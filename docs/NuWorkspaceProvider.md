# NuWorkspaceProvider

`NuWorkspaceProvider` is an optional persistence lifecycle for a set of
managed windows. It captures window geometry and state together with
application-owned metadata, but it does not choose a storage backend.

Place it inside `NuWindowProvider` (or inside `NuDesktop`, which provides the
window provider internally).

```tsx
<NuWindowProvider>
  <NuWorkspaceProvider factories={workspaceFactories}>
    <App />
  </NuWorkspaceProvider>
</NuWindowProvider>
```

## Lifecycle

An ordinary managed window remains unchanged. To opt one into Workspace, give
it a stable `workspaceFactoryKey` and an `onSaveWorkspace` callback. Returning
`undefined` omits that window from the snapshot.

```tsx
windowManager.openWindow({
  content: <ReceiverDetails ref={detailsRef} receiverId={receiverId} />,
  domain: "Receivers",
  onSaveWorkspace: () => detailsRef.current?.saveWorkspace(),
  onLoadWorkspace: (meta) => {
    detailsRef.current?.loadWorkspace(meta as ReceiverDetailsMeta);
  },
  title: "Receiver details",
  workspaceFactoryKey: "receiver-details"
});
```

The component inside the window owns its local state. A ref is one convenient
way for the lifecycle callbacks to save and restore selected tabs, filters,
scroll position, or other application state.

## Factories

`workspaceFactoryKey` identifies an application factory; it is not a data type
and does not affect WindowBar grouping. The factory receives the complete saved
window record and returns the normal `NuManagedWindowDefinition` used by
`openWindow` or `openDialog`.

```tsx
const workspaceFactories = {
  "receiver-details": (savedWindow) => {
    const meta = savedWindow.meta as ReceiverDetailsMeta;

    return createReceiverDetailsWindow(meta.receiverId);
  }
};
```

Factories can also be registered dynamically:

```tsx
const { registerWorkspaceFactory } = useNuWorkspace();

useEffect(
  () =>
    registerWorkspaceFactory(
      "receiver-details",
      workspaceFactories["receiver-details"]
    ),
  [registerWorkspaceFactory]
);
```

## Saving and loading

`useNuWorkspace()` exposes:

- `saveWorkspace(): NuWorkspaceSnapshot`
- `loadWorkspace(snapshot): NuWorkspaceLoadResult`
- `registerWorkspaceFactory(factoryKey, factory)`

```tsx
const { loadWorkspace, saveWorkspace } = useNuWorkspace();

const snapshot = saveWorkspace();
window.localStorage.setItem("my-app.workspace", JSON.stringify(snapshot));

const saved = JSON.parse(
  window.localStorage.getItem("my-app.workspace") ?? "null"
);

if (saved) {
  const { restoredIds, skipped } = loadWorkspace(saved);
}
```

ReactNU does not write to `localStorage`, validate application metadata, or
close current windows during `loadWorkspace`. The host owns storage, schema
migrations, metadata validation, and whether it wants to close an existing
workspace before loading another one. Unknown or intentionally declined
factory records appear in `NuWorkspaceLoadResult.skipped`.

## Snapshot contents

The snapshot has `version: 1` and contains one record per opted-in window that
returned metadata. ReactNU saves the window mode, geometry, minimized/maximized
state, `domain`, and `activationGroup` automatically. Thus restored windows
continue to participate in WindowBar grouping and linked activation exactly as
ordinary windows do.

During restore, the factory's `domain` and `activationGroup` take precedence;
the saved values are used only when the factory does not supply them. The saved
window geometry takes precedence over the factory's normal `onOpen` snapshot.
After the new window mounts, its `onLoadWorkspace(meta, context)` callback is
called with the saved metadata and the new managed-window ID.

## Notes

- This feature is entirely opt-in. Existing managed windows and
  `useNuWindowManager()` calls behave as before.
- `workspaceFactoryKey` must be stable across application releases that need to
  restore old workspaces.
- Keep `meta` JSON-serializable when serializing the returned snapshot.
- Helper dialogs have no workspace key by default and are not saved.

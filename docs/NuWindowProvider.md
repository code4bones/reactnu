# NuWindowProvider

`NuWindowProvider` is the window manager for the desktop shell.

## Usage

```tsx
<NuWindowProvider>
  <Workspace />
</NuWindowProvider>
```

## Main API

Use `useNuWindowManager()` to access:

- `openWindow(definition)`
- `openDialog(definition)`
- `showMessageBox(options)`
- `showInputBox(options)`
- `closeWindow(id)`
- `updateWindow(id, patch)`
- `activateWindow(id)`
- `bringToFront(id)`
- `toggleWindowMinimized(id)`
- `toggleWindowMaximized(id)`
- `closeAll()`
- `windows`

## Managed Window Persistence

Set `windowStoreKey` to persist a managed window's last position, size, and
minimized/maximized state automatically. ReactNU stores the snapshot in
`localStorage` as `reactnu.window.<key>`. Use a stable, unique key for each
logical window; re-opening that window with the same key restores its saved
geometry.

```tsx
windowManager.openWindow({
  content: <Inspector />,
  title: "Inspector",
  windowStoreKey: "workspace.inspector"
});
```

Browser storage is optional: malformed or unavailable storage is ignored.
`onOpen` remains the explicit override for applications that restore state
from their own storage, and `onClose` still receives the current snapshot.
Clear `reactnu.window.workspace.inspector` to reset this example.

For host-owned persistence, `NuManagedWindowDefinition` also supports:

- `onOpen?: () => NuManagedWindowSnapshot | void`
- `onClose?: (snapshot: NuManagedWindowSnapshot) => boolean | void`

This lets the host save and restore window geometry:

```tsx
let savedWindowState: NuManagedWindowSnapshot | undefined;

windowManager.openWindow({
  title: "Inspector",
  content: <Inspector />,
  onOpen: () => savedWindowState,
  onClose: (snapshot) => {
    savedWindowState = snapshot;
    return true;
  }
});
```

## Title Icons

`openWindow(...)` and `openDialog(...)` accept `icon?: ReactNode`. It renders in
the fixed left title-bar slot, so managed dialogs use the same chrome as regular
windows. The same icon is reused in the minimized AppBar item, the MDI
`Window` menu, and the `Pick...` dialog.

```tsx
windowManager.openDialog({
  content: <NetworkSettings />,
  icon: <NuGlyph name="gear" />,
  title: "Network settings"
});
```

## Fixed Aspect Ratio

Set a positive `aspectRatio` (width / height) for image, video, map, or other
fixed-ratio content. Pointer resizing keeps the ratio, combines `minWidth` and
`minHeight` into a ratio-consistent minimum, and disables maximizing the
managed window.

```tsx
windowManager.openWindow({
  aspectRatio: 178 / 704,
  content: <VirtualRemote />,
  minWidth: "11rem",
  style: { height: "50rem", width: "13rem" },
  title: "Remote"
});
```

## Linked Activation

Set the same `activationGroup` on managed windows that represent one logical
workspace. Activating either one gives every visible member of that group the
active window chrome. Activating a window outside the group makes all members
inactive again. This only links activation visuals; it does not dock, move, or
resize the windows together.

```tsx
windowManager.openWindow({
  activationGroup: "receiver-42",
  content: <ReceiverOverview />,
  title: "Receiver overview"
});

windowManager.openWindow({
  activationGroup: "receiver-42",
  content: <ReceiverDiagnostics />,
  title: "Receiver diagnostics"
});
```

App-modal dialogs remain the sole active surface while open, regardless of an
activation group.

## Size Limits

Managed windows accept `minWidth` and `minHeight` directly. They override the
provider's default minimum width (`26rem` for a window and `22rem` for a
dialog) and constrain pointer resizing as well as CSS layout.

```tsx
windowManager.openWindow({
  content: <CompactLog />,
  minHeight: "10rem",
  minWidth: "18rem",
  title: "Compact log"
});
```

## Helper Dialogs

The same manager also provides async helper dialogs:

```tsx
const result = await windowManager.showMessageBox({
  title: "Diagnostics",
  message: "Continue with the maintenance pass?",
  kind: "info",
  yes: true,
  no: true
});

const value = await windowManager.showInputBox({
  title: "Archive Report",
  label: "Target path",
  defaultValue: "C:\\LOGS\\SURFACE.MAP"
});
```

See [Dialog Helpers](./DialogHelpers.md) for the full option list.

## Notes

- Supports app-modal and owner-modal dialogs.
- Keeps window list order stable for app-bar display while still maintaining a separate visual z-stack.
- `onOpen` is applied when the managed window record is created.
- `onClose` receives the latest saved geometry and `maximized/minimized` state.
- Returning `false` from `onClose` vetoes the close request.

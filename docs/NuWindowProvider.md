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

`NuManagedWindowDefinition` also supports:

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

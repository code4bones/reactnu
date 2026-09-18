# Getting Started

This guide shows the recommended host setup for a ReactNU application.

## Recommended Shell

```tsx
import {
  AppBarHost,
  AppBarItem,
  NuDesktop,
  NuThemeProvider,
  NuView,
  WindowBar,
  useNuWindowManager
} from "@deadragdoll/reactnu";

function ShellAppBar() {
  const windowManager = useNuWindowManager();

  return (
    <AppBarHost>
      <WindowBar
        items={windowManager.windows.map((windowEntry) => ({
          active: windowEntry.active,
          domain: windowEntry.domain,
          id: windowEntry.id,
          minimized: windowEntry.minimized,
          title: windowEntry.title
        }))}
        onActivateWindow={windowManager.activateWindow}
      />
      <AppBarItem alignment="end">12:40</AppBarItem>
    </AppBarHost>
  );
}

export function App() {
  return (
    <NuThemeProvider>
      <NuDesktop appBar={<ShellAppBar />}>
        <NuView padding="md">Workspace content</NuView>
      </NuDesktop>
    </NuThemeProvider>
  );
}
```

## Recommended Order

1. `NuThemeProvider`
2. `NuDragDropProvider` when ListBox, ListView, TreeListView, or IconGrid need to exchange items
3. `NuDesktop`
3. host-driven `appBar`
4. workspace content
5. open windows through `useNuWindowManager()`

## Opening A Window

```tsx
import { Button, useNuWindowManager } from "@deadragdoll/reactnu";

function Launcher() {
  const windowManager = useNuWindowManager();

  return (
    <Button
      onClick={() =>
        windowManager.openWindow({
          title: "Inspector",
          content: <div>Window content</div>
        })
      }
    >
      &Open inspector
    </Button>
  );
}
```

## Opening A Dialog

```tsx
windowManager.openDialog({
  title: "Confirm",
  content: ({ close }) => <Button onClick={close}>&Close</Button>
});
```

## Recommended Folder Shape

```text
src/
  app/
    App.tsx
    DesktopAppBar.tsx
    DesktopMenu.tsx
  windows/
    InspectorWindow.tsx
    ReportWindow.tsx
  dialogs/
    ConfirmDialog.tsx
  views/
    DashboardView.tsx
```

## Notes

- `NuDesktop` already creates the app host and window manager layers.
- `WindowBar` is host-owned. It is not injected automatically.
- Use `NuView` whenever a pane or cell needs to own scrolling explicitly.

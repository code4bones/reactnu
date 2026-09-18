# Spacer

`Spacer` fills unused space in a flex layout, moving all following controls to
the opposite edge. It is decorative and is hidden from assistive technology.

## Usage

```tsx
<ToolBar>
  <ToolButton>&Open</ToolButton>
  <Spacer />
  <ToolButton>&Help</ToolButton>
</ToolBar>
```

It works in `ToolBar`, `Stack direction="row"`, and a window `statusBar`:

```tsx
<Window
  statusBar={
    <>
      <StatusBarItem>F2 Save</StatusBarItem>
      <Spacer />
      <StatusBarItem>Ready</StatusBarItem>
    </>
  }
  title="Editor"
/>
```

For a root `MainMenu`, use the menu model equivalent:

```tsx
const items: MainMenuNode[] = [
  { id: "file", text: "&File" },
  { id: "window", text: "&Window" },
  { id: "menu-spacer", type: "spacer" },
  { id: "profile", text: "&Profile" },
  { id: "about", text: "&About" }
];
```

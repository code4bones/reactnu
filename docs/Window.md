# Window

`Window` is the main floating chrome primitive used for desktop windows and dialogs.

## Usage

```tsx
<Window title="Activity Log" mode="window" statusBar="F2 Save">
  <Content />
</Window>
```

```tsx
<Window
  title="Activity Log"
  mode="window"
  statusBar={
    <>
      <StatusBarItem grow>F2 Save F3 Search Alt+F3 Close</StatusBarItem>
      <StatusBarItem align="end">3 warnings</StatusBarItem>
    </>
  }
>
  <Content />
</Window>
```

## Key Props

- `title: string`
- `mode?: "dialog" | "window"`
- `border?: "single" | "double"`
- `minimized?: boolean`
- `maximized?: boolean`
- `closeable?: boolean`
- `draggable?: boolean`
- `resizable?: boolean`
- `scrollable?: boolean`
- `statusBar?: ReactNode`
- `titleButtons?: WindowTitleButtonDefinition[]`
- `onClose?()`
- `onToggleMinimized?()`
- `onToggleMaximized?()`
- `onPositionChange?(position)`
- `onSizeChange?(size)`
- `onActivate?()`

## Notes

- Drag and resize are implemented with pointer events and local DOM updates for smoother motion.
- The public `WindowTitleButton` and `useWindowTitleButtons()` helpers support custom title-bar controls.
- `StatusBarItem` only provides placement semantics (`grow`, `align`) and does not enforce its own border or chrome.
- Plain string `statusBar` still works for simple status lines.

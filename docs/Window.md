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
  icon={<NuGlyph name="folder" />}
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
- `icon?: ReactNode` — decorative visual in the fixed left title-bar slot
- `minimized?: boolean`
- `maximized?: boolean`
- `closeable?: boolean`
- `draggable?: boolean`
- `resizable?: boolean`
- `aspectRatio?: number` — positive width / height ratio; locks pointer resize
  and suppresses the maximize control
- `minWidth?: number | string` — defaults to `240px` for a standalone window
- `minHeight?: number | string` — defaults to `120px` for a standalone window
- `scrollable?: boolean`
- `statusBar?: ReactNode`
- `titleButtons?: WindowTitleButtonDefinition[]`
- `onClose?()`
- `onToggleMinimized?()`
- `onToggleMaximized?()`
- `onPositionChange?(position)`
- `onSizeChange?(size)`
- `onActivate?()`

`activationGroup?: string` is available on a managed window definition passed
to `useNuWindowManager().openWindow(...)`; it is resolved by
`NuWindowProvider`, rather than by a standalone `Window` instance. See
[NuWindowProvider](./NuWindowProvider.md#linked-activation).

`windowStoreKey?: string` is also available on a managed window definition.
It automatically restores and saves that window's geometry in browser storage;
see [NuWindowProvider](./NuWindowProvider.md#managed-window-persistence).

## Notes

- Drag and resize are implemented with pointer events and local DOM updates for smoother motion.
- The public `WindowTitleButton` and `useWindowTitleButtons()` helpers support custom title-bar controls.
- The left title-bar slot is always reserved. Pass `icon` to show a `NuGlyph`,
  Font Awesome icon, SVG, or another React node without shifting the title.
- `StatusBarItem` only provides placement semantics (`grow`, `align`) and does not enforce its own border or chrome.
- Plain string `statusBar` still works for simple status lines.
- `minWidth` and `minHeight` are applied as CSS limits and as the lower bounds
  for pointer resizing. A managed window may also specify them in its
  `openWindow(...)` definition.
- With `aspectRatio`, resizing follows whichever pointer axis has the greater
  ratio-adjusted movement. The other dimension is derived from the ratio, and
  the effective minimum remains ratio-consistent.

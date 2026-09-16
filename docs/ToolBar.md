# ToolBar

`ToolBar` is the compact action strip for command buttons and separators.

For the same button behavior outside a toolbar container, use [CommandButton](./CommandButton.md).

## Usage

```tsx
<ToolBar>
  <ToolButton icon="folder">&Scan</ToolButton>
  <ToolButton icon="star" pressed>
    &Watch
  </ToolButton>
  <ToolSeparator />
  <ToolDropButton
    icon="folder"
    menuItems={[
      { id: "export-map", text: "Export &map" },
      { id: "export-log", text: "Export &log" }
    ]}
  >
    &Export
  </ToolDropButton>
</ToolBar>
```

## Exports

- `CommandButton`
- `ToolBar`
- `ToolButton`
- `ToolDropButton`
- `ToolSeparator`

## Key Props

- `fill?: boolean`
- `wrap?: boolean`
- `slotStyles`
- `slotClassNames`

## Notes

- `ToolBar` is layout-only and defaults to `fill={true}`.
- `wrap={true}` lets tools continue on the next row when the container is too narrow.
- `ToolButton` supports `toggled` for toggle-style tools. `pressed` is kept as a legacy alias through the shared command-button layer.
- `ToolButton` also supports `icon` and optional `dropdown`.
- `ToolDropButton` is a convenience wrapper for `ToolButton dropdown`.
- If `menuItems` are provided, `ToolDropButton` opens `PopupMenu` automatically and reports selection through `onMenuItemSelect`.
- `ToolSeparator` is decorative and should only be used between tools.

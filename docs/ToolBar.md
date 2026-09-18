# ToolBar

`ToolBar` is the compact action strip for command buttons and separators.

For the same button behavior outside a toolbar container, use [CommandButton](./CommandButton.md).

## Usage

```tsx
<ToolBar startContent={<NuGlyph aria-hidden name="folder" />}>
  <ToolButton icon="folder">&Scan</ToolButton>
  <ToolButton icon="star" pressed>
    &Watch
  </ToolButton>
  <ToolSeparator />
  <Spacer />
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
- `Spacer`

## Key Props

- `fill?: boolean`
- `wrap?: boolean`
- `startContent?: ReactNode`
- `endContent?: ReactNode`
- `slotStyles`
- `slotClassNames`

## Notes

- `ToolBar` defaults to `fill={true}` and uses `--nu-toolbar-background` for
  its surface.
- `startContent` and `endContent` render static React content before and after
  the controls. Use them for decorative icons or compact status text, not for
  actions that need toolbar keyboard semantics.
- `wrap={true}` lets tools continue on the next row when the container is too narrow.
- `ToolButton` supports `toggled` for toggle-style tools. `pressed` is kept as a legacy alias through the shared command-button layer.
- `ToolButton` also supports `icon` and optional `dropdown`.
- `ToolDropButton` is a convenience wrapper for `ToolButton dropdown`.
- If `menuItems` are provided, `ToolDropButton` opens `PopupMenu` automatically and reports selection through `onMenuItemSelect`.
- `ToolSeparator` is decorative and should only be used between tools.
- Toolbar chrome is themeable through `--nu-toolbar-border-color`,
  `--nu-toolbar-border-style`, and `--nu-toolbar-border-width`; separators
  use the corresponding `--nu-toolbar-separator-*` tokens.
- `--nu-toolbar-inset` controls Toolbar padding on all four sides.
- `Spacer` fills free space and moves following tools to the opposite edge.

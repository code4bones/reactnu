# CommandButton

`CommandButton` is the standalone command-style button that shares the same interaction model and compact chrome as `ToolButton`, but does not require a `ToolBar` container.

## Usage

```tsx
<CommandButton icon="gear">&Run</CommandButton>
```

With popup menu:

```tsx
<CommandButton
  icon="folder"
  menuItems={[
    { id: "export-map", text: "Export &map" },
    { id: "export-log", text: "Export &log" }
  ]}
>
  &Export
</CommandButton>
```

## Key Props

- `icon?: NuGlyphName | ReactNode`
- `toggled?: boolean`
- `pressed?: boolean`
- `dropdown?: boolean`
- `menuItems?: MainMenuNode[]`
- `onMenuItemSelect?: (item: MainMenuItem) => void`
- `uncheckedShape?: "box" | "none"`
- `slotStyles`
- `slotClassNames`
- normal button props such as `onClick`, `disabled`, `type`

## Notes

- if `menuItems` are provided, `CommandButton` opens `PopupMenu` automatically
- `dropdown` only controls the caret visual
- `menuItems` controls the actual popup behavior
- `toggled` is the preferred toggle-state prop name
- `pressed` remains supported as a legacy alias
- `ToolButton` and `ToolDropButton` are thin wrappers over the same command-button behavior

# MainMenu

`MainMenu` is the classic top application menu bar with nested submenus.

## Usage

```tsx
<MainMenu items={menuItems} />
```

## Key Props

- `items: MainMenuNode[]`
- `onItemSelect?: (item) => void`

## Menu Model

- `MainMenuItem`
  - `id`
  - `text`
  - `icon?: ReactNode` — decorative icon in a popup menu row
  - `hotkey?`
  - `shortcut?`
  - `checked?`
  - `disabled?`
  - `hidden?`
  - `items?`
  - `onSelect?`
- `MainMenuDivider`
  - `id`
  - `type: "divider"`
- `MainMenuSpacer`
  - `id`
  - `type: "spacer"`
  - Valid at the root level only; pushes following menu items to the right.

## Notes

- Top-level dropdowns open below their root items.
- Nested submenus open to the right by default and automatically open to the
  left only when their right edge would leave the viewport.
- Active and hovered items use the same black selection pattern used elsewhere in the library.
- Popup-menu dividers use `--nu-menu-divider-color`,
  `--nu-menu-divider-style`, and `--nu-menu-divider-width`.
- Use `{ id: "main-menu-spacer", type: "spacer" }` between root menu items to
  align the following menu group to the opposite edge. Their dropdowns choose
  the viewport-facing side when opened.

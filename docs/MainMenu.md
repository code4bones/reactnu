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

## Notes

- Top-level dropdowns open below their root items.
- Nested submenus open to the right.
- Active and hovered items use the same black selection pattern used elsewhere in the library.

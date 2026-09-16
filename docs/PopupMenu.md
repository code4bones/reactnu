# PopupMenu

`PopupMenu` is a context-style menu surface built on the same menu item model as `MainMenu`.

## Usage

```tsx
const popupMenu = usePopupMenu();

<Button onClick={popupMenu.openFromClick}>Open popup</Button>
<PopupMenu
  anchor={popupMenu.anchor}
  open={popupMenu.open}
  onOpenChange={popupMenu.setOpen}
  items={items}
/>
```

## Key Props

- `items: MainMenuNode[]`
- `anchor: PopupMenuAnchor | null`
- `open?: boolean`
- `defaultOpen?: boolean`
- `onOpenChange?: (open) => void`
- `onItemSelect?: (item) => void`

## Related Hook

- `usePopupMenu()`
  - `anchor`
  - `open`
  - `setOpen`
  - `close()`
  - `openAtPoint(x, y)`
  - `openAtElement(element)`
  - `openFromClick(event)`
  - `openFromContextMenu(event)`

## Notes

- Popup menus render through a portal and are not clipped by local overflow containers.

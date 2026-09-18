# ListBox

`ListBox` is the main scrollable selection surface for grouped or flat item collections.

## Usage

```tsx
<ListBox
  data={groups}
  selectedId={selectedId}
  onItemSelect={(item) => setSelectedId(item.id ?? "")}
/>
```

## Key Props

- `data: ListBoxGroup[]`
- `selectedId?: string`
- `onItemSelect?: (item, group) => void`
- `checkedIds?: string[]`
- `onItemCheckChange?: (item, group, checked) => void`
- `onItemDoubleClick?: (item, group) => void`
- `onPopupMenu?: (event, item, group) => void`
- `getDragItem?: (item, group) => NuDragDropItem | false`
- `renderDragPreview?: (item, group) => ReactNode`
- `onItemDragOut?: (item, group) => void`
- `acceptsDrop?: (item) => boolean`
- `onDrop?: (item, context) => boolean | void`
- `rightCheckBox?: boolean`
- `emptyText?: string`

## Keyboard

- `ArrowUp` / `ArrowDown`
- `Home` / `End`
- `Enter`
- `Space` for check toggling

## Notes

- The same data format supports both grouped and flat lists by using `category: null`.
- Right-clicking an enabled item activates it, prevents the browser context menu,
  and calls `onPopupMenu`. Use the event coordinates to open an application-owned
  `PopupMenu` or another contextual action surface.
- Inside `NuDragDropProvider`, `getDragItem` makes rows draggable. The
  application decides accepted data in `acceptsDrop` and updates its collection
  in `onDrop` / `onItemDragOut`.
- `renderDragPreview(item, group)` may render a compact React preview instead
  of the full list row while dragging.

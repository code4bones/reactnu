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
- `rightCheckBox?: boolean`
- `emptyText?: string`

## Keyboard

- `ArrowUp` / `ArrowDown`
- `Home` / `End`
- `Enter`
- `Space` for check toggling

## Notes

- The same data format supports both grouped and flat lists by using `category: null`.

# TreeView

`TreeView` renders a recursive hierarchy with DOS-style connector geometry.

## Usage

```tsx
<TreeView
  data={[
    {
      title: "Drive C:",
      id: "1",
      expanded: true,
      children: [
        { title: "SYSTEM", id: "1-1" },
        { title: "LOGS", id: "1-2", checked: true }
      ]
    }
  ]}
  selectedId={selectedId}
  onItemSelect={(item) => setSelectedId(item.id)}
  onItemCheckChange={(item, checked) => {}}
/>
```

## Key Props

- `data: TreeItem[]`
- `selectedId?: string`
- `expandedIds?: string[]`
- `defaultExpandedIds?: string[]`
- `emptyText?: string`
- `uncheckedShape?: "box" | "none"`
- `onItemSelect?: (item) => void`
- `onItemDoubleClick?: (item) => void`
- `onItemCheckChange?: (item, checked) => void`
- `onExpandedIdsChange?: (expandedIds) => void`

## Imperative Handle

- `focus()`
- `scrollToItem(itemId)`
- `activateItem(itemId)`
- `expandItem(itemId)`
- `collapseItem(itemId)`
- `toggleItemCheck(itemId)`
- `getActiveItemId()`

## Notes

- Tree geometry is owned by the component.
- The host provides item data and optional controlled state.
- Keyboard navigation supports arrows, `Home`, `End`, `Enter`, and `Space`.

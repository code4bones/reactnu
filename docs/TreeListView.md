# TreeListView

`TreeListView` combines a hierarchical tree column with report-style columns.
The tree geometry stays under component control, while report cells can be
filled by the host.

## Usage

```tsx
type Node = TreeListItemBase<Node> & {
  metrics?: {
    humidity: number;
    temperature: number;
    wind: number;
  };
};

const columns: TreeListColumn<Node>[] = [
  { id: "name", title: "&Name", tree: true, width: "24ch" },
  { id: "temp", title: "&Temp", align: "end", width: "9ch" },
  { id: "humidity", title: "&Humidity", align: "end", width: "10ch" }
];

<TreeListView
  columns={columns}
  data={nodes}
  getCellContent={(itemId, columnId, context) => {
    if (columnId === "temp" && context.item.metrics) {
      return (
        <ReportCell align="end">
          {`${context.item.metrics.temperature.toFixed(1)}C`}
        </ReportCell>
      );
    }

    return undefined;
  }}
  selectedId={selectedId}
  onItemSelect={(item) => setSelectedId(item.id)}
  onItemCheckChange={(item, checked) => {}}
/>;
```

## Key Props

- `columns`
- `columnStoreKey` — stores user-resized widths under `reactnu.<key>` in
  `localStorage`
- `data`
- `getCellContent`
- `dataVersion`
- `selectedId`
- `activeItemId`
- `defaultActiveItemId`
- `expandedIds`
- `defaultExpandedIds`
- `onItemSelect`
- `onItemDoubleClick`
- `onPopupMenu`
- `getDragItem`
- `onItemDragOut`
- `acceptsDrop`
- `onDrop`
- `onItemCheckChange`
- `onExpandedIdsChange`
- `onActiveItemChange`
- `checkedIds`
- `uncheckedShape`

## Imperative Handle

- `focus()`
- `scrollToItem(itemId)`
- `activateItem(itemId)`
- `expandItem(itemId)`
- `collapseItem(itemId)`
- `toggleItemCheck(itemId)`
- `getActiveItemId()`

## Notes

- Mark one column with `tree: true` to host the hierarchy.
- If no column is marked as tree, the first column is used.
- Keyboard behavior follows the same pattern as `TreeView`, while columns behave like `ListView`.
- `getCellContent(itemId, columnId, context)` is the preferred way to populate
  report columns from host data.
- `dataVersion` is available for live-data scenarios where report content
  changes frequently even if the tree structure itself stays stable.
- Columns auto-size from visible content by default.
- `minWidth` sets a lower bound for auto-sized and resized columns.
- Columns are resizable unless `resizable={false}` is set on a column.
- Give `columnStoreKey` a stable, application-owned name to restore a user's
  resized widths on the next mount. Missing, malformed, or unavailable browser
  storage falls back to the column definitions without throwing.
- Right-clicking an enabled row activates it and calls
  `onPopupMenu(event, item, context)`. `context` has the same `depth`, `isLeaf`,
  `item`, and `rowIndex` fields as `getCellContent`; the host owns rendering the
  resulting menu.
- Inside `NuDragDropProvider`, rows may produce shared drag items through
  `getDragItem`; the host filters and applies incoming items with
  `acceptsDrop` and `onDrop`.

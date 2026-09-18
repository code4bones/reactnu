# ListView

`ListView` renders a report-style list with columns, row selection, optional checkboxes, and per-column custom cell renderers.

## Usage

```tsx
type Row = ListViewRowBase & {
  name: string;
  size: string;
  type: string;
};

const columns: ListViewColumn<Row>[] = [
  { id: "name", title: "&Name", field: "name", width: "18ch" },
  { id: "type", title: "&Type", field: "type", width: "10ch" },
  { id: "size", title: "&Size", field: "size", align: "end", width: "8ch" }
];

<ListView
  columns={columns}
  data={rows}
  activeRowId={activeRowId}
  onActiveRowChange={(row) => setActiveRowId(row.id)}
  selectedId={selectedId}
  showCheckBox
  checkedIds={checkedIds}
  onRowSelect={(row) => setSelectedId(row.id)}
  onRowCheckChange={(row, checked) => {}}
/>;
```

## Key Props

- `columns`
- `data`
- `activeRowId`
- `defaultActiveRowId`
- `onActiveRowChange`
- `selectedId`
- `onRowSelect`
- `onRowDoubleClick`
- `getDragItem`
- `onRowDragOut`
- `acceptsDrop`
- `onDrop`
- `renderDragPreview`
- `showCheckBox`
- `checkedIds`
- `onRowCheckChange`
- `uncheckedShape`

## Notes

- Keyboard navigation follows the same pattern as other list-like controls.
- Column titles support `&` mnemonic markup.
- A column can use `field` for simple value rendering or `renderCell` for custom content.
- `getDragItem(row)` makes a row a shared drag source. `onRowDragOut(row)` runs
  after another target accepts it; `acceptsDrop` and `onDrop` make the list a
  target. Wrap related controls in `NuDragDropProvider`.
- `renderDragPreview(row)` can return a compact React node, rather than using
  the complete report row as the native drag preview.

## Imperative Handle

`ListView` also supports `ref` with:

- `focus()`
- `scrollToRow(rowId)`
- `activateRow(rowId)`
- `toggleRowCheck(rowId)`
- `getActiveRowId()`

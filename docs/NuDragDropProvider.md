# NuDragDropProvider

`NuDragDropProvider` coordinates native HTML5 drag-and-drop between
`NuIconGrid`, `ListBox`, `ListView`, and `TreeListView`. It is implemented on
top of `react-dnd`; it carries an application-defined item and does not mutate
host list or tree data.

```tsx
<NuDragDropProvider>
  <ListBox
    data={receivers}
    getDragItem={(item, group) => ({
      type: "receiver",
      id: String(item.id),
      data: { group: group.category?.text ?? "ungrouped", receiver: item }
    })}
    onItemDragOut={(item) => removeReceiver(String(item.id))}
  />
  <TreeListView
    acceptsDrop={(drag) => drag.type === "receiver"}
    columns={columns}
    data={groups}
    onDrop={(drag) => {
      assignReceiverToSelectedGroup(drag.data);
    }}
  />
</NuDragDropProvider>
```

## Contract

- A source uses `getDragItem` to opt a displayed item into dragging. Return a
  stable `type`, an ID, and any host payload in `data`.
- A target uses `acceptsDrop(item)` to filter drag item types and `onDrop` to
  perform its own state update. Returning `false` rejects the transfer.
- `onItemDragOut` / `onDragOut` run only after a target accepted the item;
  remove or update the source data there.
- A target may return `{ action: "copy" }` from `onDrop`. `NuIconGrid` then
  leaves its source icon in place; `{ action: "move" }` is the default. List
  and tree sources always leave source-data mutation to their host callback.
- `renderDragPreview` on `ListBox`, `ListView`, and `TreeListView` renders a
  compact React preview instead of the browser's full-row preview.
- `NuIconGrid` keeps `accepts(icon)`, `onIconDrop`, and `onIconMoveOut` for
  its existing icon-to-icon transfer. Its `acceptsDrop` and `onDrop` receive
  non-icon shared drag items.

Wrap a workspace once when sources and targets must interact. The controls can
also mount independently, but one provider gives cross-control dragging and a
single custom-preview layer an explicit scope.

## Hover feedback

`useNuDropTarget(element, options)` returns reactive `{ isOver, canDrop, item
}` state. Use it in a custom target to render classic accept/reject feedback;
`onDragEnter(item, canDrop)` and `onDragLeave(item)` are available when a
callback fits better.

```tsx
const [element, setElement] = useState<HTMLDivElement | null>(null);
const dropState = useNuDropTarget(element, {
  accepts: (item) => item.type === "receiver",
  onDrop: (item) => {
    assignReceiver(item.data);
  },
  type: "receiver-group"
});

<div
  className={dropState.isOver && dropState.canDrop ? "group group--accept" : "group"}
  ref={setElement}
/>;
```

`NuIconGrid dropTarget` additionally registers a bounded desktop fallback, so
an icon grid behind managed windows can accept an item dropped anywhere inside
its own bounds without intercepting normal pointer interaction.

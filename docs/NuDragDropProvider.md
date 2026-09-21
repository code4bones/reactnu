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
- A target uses `acceptsDrop(item)` to decide whether it accepts an item and
  `onDrop` to perform its own state update. `item.type` is application metadata,
  not a built-in routing rule: a target may inspect `data`, `type`, both, or
  simply accept every item. Returning `false` rejects the transfer.
- `onItemDragOut` / `onDragOut` run only after a target accepted a `move`;
  remove or update the source data there.
- A target may return `{ action: "copy" }` from `onDrop`. The source remains
  in place; `{ action: "move" }` is the default.
- `renderDragPreview` on `ListBox`, `ListView`, and `TreeListView` renders a
  compact React preview instead of the browser's full-row preview.
- `NuIconGrid` keeps `accepts(icon)`, `onIconDrop`, and `onIconMoveOut` for
  its existing automatic icon-to-icon transfer. When `onDrop` is supplied,
  its `acceptsDrop` and `onDrop` receive every shared drag item without
  type-specific routing; without it,
  the legacy icon-transfer callbacks remain in effect.
- `NuDragDropContext` includes the drop pointer's `clientX` and `clientY`. For
  canvas-local coordinates, subtract the target element's bounding-rect origin.
- `TreeListView onItemDrop` receives the target row as well as its depth and
  visible row index, so a host can distinguish drops onto individual tree nodes.

`Dropdown`, `ComboBox`, `ListBox`, `ListView`, and `TreeListView` work without
an outer provider when they are used as ordinary selection controls. Wrap a
workspace once in `NuDragDropProvider` only when drag sources and targets must
interact across controls (or when using `useNuDragSource` / `useNuDropTarget`
directly); the shared provider supplies one manager and one custom-preview
layer for that scope.

On touch-capable devices, ReactNU uses the touch backend automatically. Drag
starts after a short hold and small movement threshold, so ordinary taps still
select controls and vertical scrolling remains available until a drag begins.

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
  className={
    dropState.isOver && dropState.canDrop ? "group group--accept" : "group"
  }
  ref={setElement}
/>;
```

`NuIconGrid dropTarget` additionally registers a bounded desktop fallback, so
an icon grid behind managed windows can accept an item dropped anywhere inside
its own bounds without intercepting normal pointer interaction.

# NuDragDropProvider

`NuDragDropProvider` coordinates pointer drag-and-drop between `NuIconGrid`,
`ListBox`, and `TreeListView`. It carries an application-defined item; it does
not mutate the host application's list or tree data.

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
- `NuIconGrid` keeps `accepts(icon)`, `onIconDrop`, and `onIconMoveOut` for
  its existing icon-to-icon transfer. Its `acceptsDrop` and `onDrop` receive
  non-icon shared drag items.

Wrap every source and target that should interact in the same provider. A
fallback coordinator preserves existing unwrapped IconGrid transfers, but a
provider gives the application an explicit DnD scope.

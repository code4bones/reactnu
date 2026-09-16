# Dashboard

`Dashboard` is a full-workspace static layout surface for persistent desktop content that lives behind managed windows inside `NuDesktop`.

It supports two static layout modes:

- `grid`: explicit CSS grid placement
- `lanes`: independent vertical columns

## Usage

```tsx
<Dashboard
  gap={12}
  laneCount={2}
  items={[
    {
      id: "system",
      lane: 1,
      minHeight: "18rem",
      content: <Panel title="System Core">...</Panel>
    },
    {
      id: "tools",
      lane: 2,
      minHeight: "18rem",
      content: <Panel title="Workspace Tools">...</Panel>
    }
  ]}
  layout="lanes"
/>
```

## Key Props

- `items: DashboardItem[]`
- `columnCount?: number`
- `layout?: "grid" | "lanes"`
- `laneCount?: number`
- `gap?: number`
- `fill?: boolean`

## DashboardItem

Each item describes static CSS grid placement plus render content:

```ts
type DashboardItem = {
  id: string | number;
  lane?: number;
  column?: string;
  row?: string;
  columnSpan?: number;
  rowSpan?: number;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  content: ReactNode;
};
```

## Notes

- `Dashboard` is a static layout surface, not a drag-and-resize layout engine.
- Managed `Window` instances still render above it through `NuWindowProvider`.
- Use it for always-present workspace panels, launch surfaces, inspectors, and dashboard-like control rooms.
- The control defaults to `fill`, so it is suitable as the direct child of `NuDesktop`.
- Grid rows use normal CSS content sizing, so panel height follows the child content unless you set explicit `minHeight`.
- `lanes` mode is useful when each column should stack by its own height, without waiting for taller cells in neighboring columns.
- In `lanes` mode you can also give an item an explicit `width` or `maxWidth` to avoid stretching it across the full lane.
- Panel content should usually be another ReactNU surface such as `Panel`, `Frame`, or `NuView`.
- If a product needs interactive rearrangement, `panelgrid` should be used directly by the host rather than hidden behind `Dashboard`.

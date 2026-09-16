# NuView

`NuView` is a generic fill-and-scroll container for hosting content inside frames, panes, dialogs, and splitter cells.

## Usage

```tsx
<NuView padding="sm">
  <Frame title="Inspector">
    <Stack gap="md">{/* content */}</Stack>
  </Frame>
</NuView>
```

## Key Props

- `fill?: boolean`
- `scroll?: "auto" | "x" | "y" | "both" | "hidden"`
- `padding?: "none" | "sm" | "md" | "lg"`

## Notes

- `fill` defaults to `true`, so `NuView` expands to the available area in common pane/frame layouts.
- `NuView` is the place where host code should declare scroll behavior, instead of relying on incidental overflow from parent containers.
- It is intended to simplify content composition inside `Splitter`, `Frame`, `Window`, and similar layout shells.

## Recommended Ownership

`NuView` should usually own the viewport area.

Good fit:

- splitter cells
- resizable panes
- frame-like shells inside windows
- any place where the host wants one explicit scroll/fill container

Typical pattern:

```tsx
<NuView scroll="auto" padding="sm">
  <Frame title="Status">{/* content */}</Frame>
</NuView>
```

This is especially important in `Splitter` layouts, where `NuView` should sit directly inside the pane and define how that pane scrolls.

## Protocol Note

During splitter integration we hit a concrete bug:

- `NuView` was implemented too deep in the tree.
- It did not own the pane viewport.
- Scroll behavior looked wrong because the pane owner and the viewport owner were different components.

The current rule is:

`pane -> NuView -> content`

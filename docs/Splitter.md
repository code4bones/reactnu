# Splitter

`Splitter` divides available space into two resizable panes with a draggable separator.

## Usage

```tsx
<Splitter
  defaultValue={0.4}
  first={
    <NuView padding="sm">
      <Frame title="Navigator">{/* content */}</Frame>
    </NuView>
  }
  second={
    <NuView padding="sm">
      <Frame title="Inspector">{/* content */}</Frame>
    </NuView>
  }
/>
```

## Key Props

- `orientation?: "vertical" | "horizontal"`
- `value?: number`
- `defaultValue?: number`
- `onValueChange?: (value: number) => void`
- `saveId?: string`
- `min?: number`
- `max?: number`
- `first`
- `second`

## Notes

- `vertical` means side-by-side panes with a vertical drag handle.
- `horizontal` means stacked panes with a horizontal drag handle.
- `value`, `min`, `max`, and `defaultValue` are ratio-based in the `0..1` range.
- `saveId` stores the latest ratio in `localStorage` and restores it for uncontrolled usage.
- Nested splitters work through normal composition; each pane can render another `Splitter`.
- The separator supports pointer dragging and keyboard resizing with arrow keys, `Home`, and `End`.

## Layout Protocol

For splitter cells, the recommended ownership is:

`Splitter cell -> NuView -> content`

That means:

- `Splitter` only divides space.
- `NuView` owns fill, scroll, and optional padding.
- The actual content component (`Frame`, `ListView`, custom layout, etc.) lives inside `NuView`.

Recommended:

```tsx
<Splitter
  first={
    <NuView padding="sm">
      <Frame title="Navigator">{/* content */}</Frame>
    </NuView>
  }
  second={
    <NuView scroll="auto">
      <MyPane />
    </NuView>
  }
/>
```

Avoid using the inverse ownership when the viewport should belong to the cell:

```tsx
<Frame title="Navigator">
  <NuView>{/* content */}</NuView>
</Frame>
```

That pattern makes the frame own the area and the viewport live too deep in the tree, which is usually not what you want in splitter layouts.

## Protocol Note

This was introduced after a layout bug in the splitter preview:

- `NuView` was living inside `Frame`, instead of owning the splitter cell.
- `Frame` was being treated like the viewport owner.
- As a result, scroll behavior and clipping looked wrong for pane-sized content.

The fix was to treat `NuView` as the viewport contract and keep `Splitter` itself layout-only.

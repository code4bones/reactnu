# Slot Customization

ReactNU components are moving to a shared internal customization contract:

- `slotStyles`
- `slotClassNames`

This is the preferred way to override internal surfaces without rewriting a component.

## Shape

Typical usage:

```tsx
<Frame
  slotStyles={{
    title: { background: "black", color: "yellow" },
    body: { background: "#6262e3" }
  }}
  slotClassNames={{
    root: "my-frame",
    title: "my-frame-title"
  }}
  title="Target Controls"
/>
```

## Rules

- `className` and `style` still target the component root.
- `slotClassNames` and `slotStyles` target internal named slots.
- Slot names should be literal and structural:
  - `root`
  - `label`
  - `body`
  - `title`
  - `input`
  - `hint`
  - `popup`
  - `listbox`
- Component-specific legacy props such as `titleStyle` or `contentStyle` may still exist for compatibility, but new work should prefer slot-based customization.

## Internal Primitive Rule

Slot customization does not replace shared internal primitives.

If two controls share the same internal visual part, prefer:

- one shared internal primitive
- plus slot customization on top of that primitive

instead of:

- separate duplicated markup
- separate duplicated LESS
- followed by two independent slot APIs

Example:

- `Dropdown` and `ComboBox` share the internal `ControlOpener` primitive
- each control still exposes its own slot names around that primitive

## Current Direction

This contract is now the standard for new and updated controls.

The first wave already covers the main surface and control layer:

- `Frame`
- `Panel`
- `Button`
- `PageControl`
- `ToolBar`
- `ProgressBar`
- `TickBar`
- `TextField`
- `SpinBox`
- `CheckBox`

Additional controls should follow the same pattern as they are touched, instead of inventing one-off prop names.

When extending a component:

- add slots only for meaningful structural surfaces
- do not expose every nested implementation detail as a slot unless it is a real customization surface

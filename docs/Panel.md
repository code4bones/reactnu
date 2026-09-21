# Panel

`Panel` is a heavier container surface for primary application regions.

## Usage

```tsx
<Panel title="System Core" footer="F1 Help" inset>
  <Content />
</Panel>
```

## Key Props

- `title?: string`
- `footer?: string`
- `inset?: boolean`
- `slotClassNames` / `slotStyles` for `root`, `header`, `body`, and `footer`
- `children`

## Notes

- `Panel` is the main raised surface.
- `inset` is useful for denser workspace-like regions inside a larger shell.
- Panel does not force `overflow`, clipping, or wrapping on its body. Use a
  nested `Stack wrap` for a row of controls that must remain within the panel,
  or set explicit overflow behavior in the `body` slot when required.
- Header and footer use the Panel frame without a separate inner shadow line.

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
- `children`

## Notes

- `Panel` is the main raised surface.
- `inset` is useful for denser workspace-like regions inside a larger shell.

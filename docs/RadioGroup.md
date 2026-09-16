# RadioGroup

`RadioGroup` renders a set of DOS-style radio options with one active value.

## Usage

```tsx
<RadioGroup
  label="&Boot mode"
  hint="Choose the recovery startup profile."
  options={[
    { label: "&Safe mode", value: "safe" },
    { label: "&Network mode", value: "network" },
    { label: "&Full diagnostics", value: "full" }
  ]}
  value={bootMode}
  onValueChange={setBootMode}
/>
```

## Key Props

- `label?: string`
- `hint?: string`
- `name?: string`
- `options: Array<{ label, value, disabled?, hint? }>`
- `value?: string`
- `defaultValue?: string`
- `onValueChange?: (value) => void`
- `slotClassNames?` / `slotStyles?` for group-level customization

## Notes

- Supports controlled and uncontrolled usage.
- `RadioButton` is also available as a lower-level building block.
- Mnemonic highlighting follows the `&` marker convention.

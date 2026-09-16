# CheckBox

`CheckBox` renders a DOS-style checkbox with optional hint text.

## Usage

```tsx
<CheckBox
  checked={enabled}
  hint="Verify structure before commit."
  label="&Verify structure"
  onCheckedChange={(nextChecked) => setEnabled(nextChecked)}
/>
```

## Key Props

- `label: string`
- `checked?: boolean`
- `defaultChecked?: boolean`
- `hint?: string`
- `disabled?: boolean`
- `uncheckedShape?: "box" | "none"`
- `onCheckedChange?: (checked, event) => void`

## Notes

- Supports controlled and uncontrolled usage.
- Label mnemonic highlighting follows the `&` marker convention.
- `uncheckedShape` controls whether the empty box is shown when unchecked.

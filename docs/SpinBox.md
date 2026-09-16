# SpinBox

`SpinBox` is the numeric field with inline decrement and increment controls.

## Usage

```tsx
<SpinBox defaultValue={32} label="Cluster size" min={1} max={128} step={1} />
```

## Key Props

- `label: string`
- `hint?: string`
- `value?: number`
- `defaultValue?: number`
- `min?: number`
- `max?: number`
- `step?: number`
- `onValueChange?: (value) => void`

## Notes

- `ArrowUp` and `ArrowDown` adjust the value.
- Manual text edits are allowed; invalid draft text is normalized back to the last valid numeric value on blur.

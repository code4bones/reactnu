# TextField

`TextField` is the basic text input primitive using the DOS-style bracketed slot.

## Usage

```tsx
<TextField
  label="Target volume"
  defaultValue="C:\\SYSTEM"
  hint="Classic Blue is the default theme."
/>
```

## Key Props

- `label: string`
- `hint?: string`
- `debounceMs?: number`
- `onDebouncedChange?: (value) => void`
- standard `input` props such as `value`, `defaultValue`, `onChange`, `disabled`

## Notes

- The control uses brackets and a dark input slot rather than a conventional bordered web input.
- `onChange` remains immediate; `onDebouncedChange` is optional and runs after the debounce delay.
- For masked input, use [MaskedField](./MaskedField.md) instead of overloading `TextField`.

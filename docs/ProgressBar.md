# ProgressBar

`ProgressBar` renders a DOS-style determinate or indeterminate progress indicator.

## Usage

```tsx
<ProgressBar
  label="Surface scan"
  value={42}
  max={100}
  hint="Scanning allocation map"
/>
```

## Key Props

- `value?: number`
- `min?: number`
- `max?: number`
- `indeterminate?: boolean`
- `showValue?: boolean`
- `label?: string`
- `hint?: string`
- `trackBackground?: CSSProperties["background"]`
- `valueRenderer?: (percent, value, min, max) => ReactNode`

## Notes

- `value` is clamped to the `min..max` range.
- `showValue` controls the right-side textual progress output.
- `indeterminate` ignores `aria-valuenow` and animates the fill instead.
- `trackBackground` lets the host override the progress track background while keeping the fill white.

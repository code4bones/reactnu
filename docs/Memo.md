# Memo

`Memo` renders an editable multiline text area that fills its parent by default.

## Usage

```tsx
<Memo
  content={`Operator note:
Check drive map before running repair.`}
/>
```

## Key Props

- `content?: string`
- `value?: string`
- `defaultValue?: string`
- `onValueChange?: (value: string) => void`
- `fill?: boolean`
- `scroll?: "auto" | "x" | "y" | "both" | "hidden"`
- `background?: CSSProperties["background"]`
- `focusBackground?: CSSProperties["background"]`
- `focusTextColor?: CSSProperties["color"]`
- `textColor?: CSSProperties["color"]`

## Notes

- `Memo` uses a native `textarea` and preserves line breaks.
- Its default colors come from the active theme: `memoBackground` /
  `--nu-color-memo-bg` and `memoText` / `--nu-color-memo-text`.
- `background` and `textColor` override those theme defaults for one instance.
- `content` works as convenient initial text for uncontrolled usage.
- Focus colors are configurable and default to the same surface colors unless overridden.

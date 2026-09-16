# TickBar

`TickBar` is a DOS-style slider with keyboard support, pointer dragging, and visible tick marks.

## Usage

```tsx
import { TickBar } from "@deadragdoll/reactnu";

function Example() {
  return (
    <TickBar
      hint="Arrow keys adjust the value"
      label="Volume"
      max={100}
      min={0}
      orientation="horizontal"
      step={5}
      value={65}
    />
  );
}
```

## Props

- `label?: string`
- `hint?: string`
- `min?: number`
- `max?: number`
- `step?: number`
- `orientation?: "horizontal" | "vertical"`
- `value?: number`
- `defaultValue?: number`
- `onValueChange?: (value: number) => void`
- `tickCount?: number`
- `showValue?: boolean`
- `valueRenderer?: (value, min, max) => ReactNode`
- `disabled?: boolean`
- `fill?: boolean`

## Behavior

- Supports controlled and uncontrolled value flow.
- Pointer down on the track moves the thumb immediately.
- Dragging continues while the pointer is captured by the track.
- `vertical` mode maps `min` to the bottom and `max` to the top.
- Keyboard:
  - `ArrowLeft`, `ArrowDown` decrement
  - `ArrowRight`, `ArrowUp` increment
  - `PageDown`, `PageUp` move by `step * 10`
  - `Home`, `End` jump to `min` and `max`
- Values are clamped to `min` / `max` and snapped to `step`.

## Notes

- If `tickCount` is omitted, the control derives a reasonable number of visible marks from `min`, `max`, and `step`.

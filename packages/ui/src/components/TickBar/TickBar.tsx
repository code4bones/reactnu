import {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type TickBarSlot =
  | "root"
  | "label"
  | "slot"
  | "track"
  | "rail"
  | "ticks"
  | "tick"
  | "thumb"
  | "value"
  | "hint";

export type TickBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  defaultValue?: number;
  disabled?: boolean;
  fill?: boolean;
  hint?: string;
  label?: string;
  max?: number;
  min?: number;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  slotClassNames?: SlotCustomizationProps<TickBarSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<TickBarSlot>["slotStyles"];
  step?: number;
  tickCount?: number;
  value?: number;
  valueRenderer?: (value: number, min: number, max: number) => ReactNode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snapToStep(value: number, min: number, step: number) {
  if (!Number.isFinite(step) || step <= 0) {
    return value;
  }

  const steps = Math.round((value - min) / step);

  return min + steps * step;
}

export function TickBar({
  className,
  defaultValue,
  disabled = false,
  fill = false,
  hint,
  id,
  label,
  max = 100,
  min = 0,
  orientation = "horizontal",
  onKeyDown,
  onValueChange,
  showValue = true,
  slotClassNames,
  slotStyles,
  step = 1,
  style,
  tickCount,
  value,
  valueRenderer,
  ...props
}: TickBarProps) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const hintId = hint ? `${sliderId}-hint` : undefined;
  const safeStep = step > 0 ? step : 1;
  const safeMax = max <= min ? min + safeStep : max;
  const isControlled = value !== undefined;
  const initialValue = clamp(
    snapToStep(defaultValue ?? min, min, safeStep),
    min,
    safeMax
  );
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const resolvedValue = isControlled
    ? clamp(snapToStep(value ?? initialValue, min, safeStep), min, safeMax)
    : uncontrolledValue;
  const ratio = safeMax === min ? 0 : (resolvedValue - min) / (safeMax - min);
  const derivedTickCount = useMemo(() => {
    if (tickCount !== undefined) {
      return Math.max(2, tickCount);
    }

    return Math.max(
      2,
      Math.min(11, Math.floor((safeMax - min) / safeStep) + 1)
    );
  }, [min, safeMax, safeStep, tickCount]);
  const renderedValue = valueRenderer
    ? valueRenderer(resolvedValue, min, safeMax)
    : String(resolvedValue);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    function cancelDrag() {
      setDragging(false);
    }

    window.addEventListener("pointerup", cancelDrag);

    return () => window.removeEventListener("pointerup", cancelDrag);
  }, [dragging]);

  function commitValue(nextValue: number) {
    const snappedValue = clamp(
      snapToStep(nextValue, min, safeStep),
      min,
      safeMax
    );

    if (!isControlled) {
      setUncontrolledValue(snappedValue);
    }

    onValueChange?.(snappedValue);
  }

  function updateFromPointer(clientX: number, clientY: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const nextRatio =
      orientation === "vertical"
        ? clamp((rect.bottom - clientY) / rect.height, 0, 1)
        : clamp((clientX - rect.left) / rect.width, 0, 1);

    commitValue(min + nextRatio * (safeMax - min));
  }

  function nudge(direction: 1 | -1, multiplier = 1) {
    commitValue(resolvedValue + safeStep * direction * multiplier);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      onKeyDown?.(event);
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        nudge(-1);
        break;
      case "ArrowDown":
        event.preventDefault();
        nudge(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        nudge(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        nudge(1);
        break;
      case "PageDown":
        event.preventDefault();
        nudge(-1, 10);
        break;
      case "PageUp":
        event.preventDefault();
        nudge(1, 10);
        break;
      case "Home":
        event.preventDefault();
        commitValue(min);
        break;
      case "End":
        event.preventDefault();
        commitValue(safeMax);
        break;
      default:
        break;
    }

    onKeyDown?.(event);
  }

  return (
    <div
      {...props}
      className={cx("nu-tick-bar", slotClassNames?.root, className)}
      data-disabled={disabled || undefined}
      data-fill={fill || undefined}
      data-orientation={orientation}
      style={mergeSlotStyle(
        style as CSSProperties | undefined,
        slotStyles?.root
      )}
    >
      {label ? (
        <span
          className={cx("nu-tick-bar__label", slotClassNames?.label)}
          style={slotStyles?.label}
        >
          {renderMnemonicText(label)}
        </span>
      ) : null}
      <div
        className={cx("nu-tick-bar__slot", slotClassNames?.slot)}
        style={slotStyles?.slot}
      >
        <div
          aria-describedby={hintId}
          aria-disabled={disabled || undefined}
          aria-valuemax={safeMax}
          aria-valuemin={min}
          aria-valuenow={resolvedValue}
          aria-valuetext={
            typeof renderedValue === "string" ? renderedValue : undefined
          }
          className={cx("nu-tick-bar__track", slotClassNames?.track)}
          data-dragging={dragging || undefined}
          id={sliderId}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          onLostPointerCapture={() => setDragging(false)}
          onPointerDown={(event) => {
            if (disabled) {
              return;
            }

            event.preventDefault();
            event.currentTarget.focus();
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (
              disabled ||
              !dragging ||
              !event.currentTarget.hasPointerCapture(event.pointerId)
            ) {
              return;
            }

            updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }

            setDragging(false);
          }}
          ref={trackRef}
          role="slider"
          style={slotStyles?.track}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={cx("nu-tick-bar__rail", slotClassNames?.rail)}
            style={slotStyles?.rail}
          />
          <div
            className={cx("nu-tick-bar__ticks", slotClassNames?.ticks)}
            style={slotStyles?.ticks}
          >
            {Array.from({ length: derivedTickCount }, (_, index) => (
              <span
                aria-hidden="true"
                className={cx("nu-tick-bar__tick", slotClassNames?.tick)}
                key={`${sliderId}-tick-${index}`}
                style={slotStyles?.tick}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className={cx("nu-tick-bar__thumb", slotClassNames?.thumb)}
            style={{
              ...(orientation === "vertical"
                ? {
                    top: `calc(100% - var(--nu-tick-bar-track-inset) - (100% - (var(--nu-tick-bar-track-inset) * 2)) * ${ratio})`
                  }
                : {
                    left: `calc(var(--nu-tick-bar-track-inset) + (100% - (var(--nu-tick-bar-track-inset) * 2)) * ${ratio})`
                  }),
              ...slotStyles?.thumb
            }}
          />
        </div>
        {showValue ? (
          <span
            className={cx("nu-tick-bar__value", slotClassNames?.value)}
            style={slotStyles?.value}
          >
            {renderedValue}
          </span>
        ) : null}
      </div>
      {hint ? (
        <span
          className={cx("nu-tick-bar__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

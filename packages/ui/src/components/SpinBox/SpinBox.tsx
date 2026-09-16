import {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useId,
  useMemo,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type SpinBoxSlot =
  | "root"
  | "label"
  | "slot"
  | "bracket"
  | "inputShell"
  | "input"
  | "controls"
  | "button"
  | "hint";

export type SpinBoxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "type" | "value"
> & {
  defaultValue?: number;
  hint?: string;
  label: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  slotClassNames?: SlotCustomizationProps<SpinBoxSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<SpinBoxSlot>["slotStyles"];
  step?: number;
  value?: number;
};

function clampSpinValue(value: number, min?: number, max?: number) {
  let nextValue = value;

  if (min !== undefined) {
    nextValue = Math.max(min, nextValue);
  }

  if (max !== undefined) {
    nextValue = Math.min(max, nextValue);
  }

  return nextValue;
}

function formatSpinValue(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function parseSpinDraft(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function SpinBox({
  className,
  defaultValue,
  disabled = false,
  hint,
  id,
  label,
  max,
  min,
  onBlur,
  onChange,
  onKeyDown,
  onValueChange,
  slotClassNames,
  slotStyles,
  step = 1,
  style,
  value,
  ...props
}: SpinBoxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const isControlled = value !== undefined;
  const initialNumericValue = clampSpinValue(
    defaultValue ?? min ?? 0,
    min,
    max
  );
  const [uncontrolledValue, setUncontrolledValue] =
    useState(initialNumericValue);
  const numericValue = isControlled
    ? clampSpinValue(value ?? initialNumericValue, min, max)
    : uncontrolledValue;
  const [uncontrolledDraftValue, setUncontrolledDraftValue] = useState(() =>
    formatSpinValue(initialNumericValue)
  );
  const draftValue = isControlled
    ? formatSpinValue(numericValue)
    : uncontrolledDraftValue;

  function commitValue(nextValue: number) {
    const clampedValue = clampSpinValue(nextValue, min, max);

    if (!isControlled) {
      setUncontrolledValue(clampedValue);
    }

    setUncontrolledDraftValue(formatSpinValue(clampedValue));
    onValueChange?.(clampedValue);
  }

  function nudge(direction: 1 | -1) {
    commitValue(numericValue + step * direction);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDraftValue = event.target.value;
    const parsedValue = parseSpinDraft(nextDraftValue);

    if (!isControlled) {
      setUncontrolledDraftValue(nextDraftValue);
    }

    if (parsedValue !== null) {
      const clampedValue = clampSpinValue(parsedValue, min, max);

      if (!isControlled) {
        setUncontrolledValue(clampedValue);
      }

      onValueChange?.(clampedValue);
    }

    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setUncontrolledDraftValue(formatSpinValue(numericValue));
    onBlur?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled) {
      onKeyDown?.(event);
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        nudge(1);
        break;
      case "ArrowDown":
        event.preventDefault();
        nudge(-1);
        break;
      default:
        break;
    }

    onKeyDown?.(event);
  }

  const decrementDisabled = useMemo(
    () => disabled || (min !== undefined && numericValue <= min),
    [disabled, min, numericValue]
  );
  const incrementDisabled = useMemo(
    () => disabled || (max !== undefined && numericValue >= max),
    [disabled, max, numericValue]
  );

  return (
    <label
      className={cx("nu-spin-box", slotClassNames?.root, className)}
      htmlFor={fieldId}
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      <span
        className={cx("nu-spin-box__label", slotClassNames?.label)}
        style={slotStyles?.label}
      >
        {renderMnemonicText(label)}
      </span>
      <span
        className={cx("nu-spin-box__slot", slotClassNames?.slot)}
        style={slotStyles?.slot}
      >
        <span
          aria-hidden="true"
          className={cx("nu-spin-box__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          [
        </span>
        <span
          className={cx("nu-spin-box__input-shell", slotClassNames?.inputShell)}
          style={slotStyles?.inputShell}
        >
          <input
            {...props}
            aria-describedby={hintId}
            className={cx("nu-spin-box__input", slotClassNames?.input)}
            disabled={disabled}
            id={fieldId}
            inputMode="decimal"
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={slotStyles?.input}
            type="text"
            value={draftValue}
          />
        </span>
        <span
          aria-hidden="true"
          className={cx("nu-spin-box__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          ]
        </span>
        <span
          className={cx("nu-spin-box__controls", slotClassNames?.controls)}
          style={slotStyles?.controls}
        >
          <button
            className={cx("nu-spin-box__button", slotClassNames?.button)}
            disabled={decrementDisabled}
            onClick={() => nudge(-1)}
            style={slotStyles?.button}
            type="button"
          >
            -
          </button>
          <button
            className={cx("nu-spin-box__button", slotClassNames?.button)}
            disabled={incrementDisabled}
            onClick={() => nudge(1)}
            style={slotStyles?.button}
            type="button"
          >
            +
          </button>
        </span>
      </span>
      {hint ? (
        <span
          className={cx("nu-spin-box__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

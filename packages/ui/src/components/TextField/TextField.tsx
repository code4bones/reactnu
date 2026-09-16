import {
  ChangeEvent,
  CSSProperties,
  InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type TextFieldSlot =
  | "root"
  | "label"
  | "slot"
  | "bracket"
  | "inputShell"
  | "input"
  | "hint";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  debounceMs?: number;
  label: string;
  hint?: string;
  onDebouncedChange?: (value: string) => void;
  slotClassNames?: SlotCustomizationProps<TextFieldSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<TextFieldSlot>["slotStyles"];
};

export function TextField({
  className,
  debounceMs = 0,
  defaultValue,
  hint,
  id,
  label,
  onChange,
  onDebouncedChange,
  placeholder,
  slotClassNames,
  slotStyles,
  type,
  value,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const isControlled = value !== undefined;
  const hasMountedRef = useRef(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue == null ? "" : String(defaultValue)
  );
  const resolvedValue = isControlled
    ? value == null
      ? ""
      : String(value)
    : uncontrolledValue;

  useEffect(() => {
    if (!onDebouncedChange) {
      return;
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (debounceMs <= 0) {
      onDebouncedChange(resolvedValue);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDebouncedChange(resolvedValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, onDebouncedChange, resolvedValue]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }

    onChange?.(event);
  }

  return (
    <label
      className={cx("nu-text-field", slotClassNames?.root, className)}
      htmlFor={fieldId}
      style={slotStyles?.root}
    >
      <span
        className={cx("nu-text-field__label", slotClassNames?.label)}
        style={slotStyles?.label}
      >
        {renderMnemonicText(label)}
      </span>
      <span
        className={cx("nu-text-field__slot", slotClassNames?.slot)}
        style={slotStyles?.slot}
      >
        <span
          aria-hidden="true"
          className={cx("nu-text-field__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          [
        </span>
        <span
          className={cx(
            "nu-text-field__input-shell",
            slotClassNames?.inputShell
          )}
          style={slotStyles?.inputShell}
        >
          <input
            {...props}
            id={fieldId}
            onChange={handleChange}
            className={cx("nu-text-field__input", slotClassNames?.input)}
            aria-describedby={hintId}
            placeholder={placeholder}
            style={mergeSlotStyle(
              props.style as CSSProperties | undefined,
              slotStyles?.input
            )}
            type={type}
            value={resolvedValue}
          />
        </span>
        <span
          aria-hidden="true"
          className={cx("nu-text-field__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          ]
        </span>
      </span>
      {hint ? (
        <span
          className={cx("nu-text-field__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

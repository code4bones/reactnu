import {
  ChangeEvent,
  InputHTMLAttributes,
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
import { getTextMaskInputMode, getMaskedFieldState } from "./textMask";

export type MaskedFieldSlot =
  | "root"
  | "label"
  | "slot"
  | "bracket"
  | "inputShell"
  | "input"
  | "hint";

export type MaskedFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  debounceMs?: number;
  label: string;
  hint?: string;
  mask: string;
  onDebouncedChange?: (value: string) => void;
  slotClassNames?: SlotCustomizationProps<MaskedFieldSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<MaskedFieldSlot>["slotStyles"];
};

export function MaskedField({
  "aria-invalid": ariaInvalid,
  className,
  debounceMs = 0,
  defaultValue,
  hint,
  id,
  label,
  mask,
  onChange,
  onDebouncedChange,
  placeholder,
  slotClassNames,
  slotStyles,
  value,
  style,
  ...props
}: MaskedFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const isControlled = value !== undefined;
  const hasMountedRef = useRef(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue == null
      ? ""
      : getMaskedFieldState(mask, String(defaultValue)).formattedValue
  );
  const rawResolvedValue = isControlled
    ? value == null
      ? ""
      : String(value)
    : uncontrolledValue;
  const { formattedValue: resolvedValue, isInvalid } = getMaskedFieldState(
    mask,
    rawResolvedValue
  );
  const resolvedAriaInvalid = ariaInvalid ?? (isInvalid ? true : undefined);
  const maskInputMode = useMemo(
    () =>
      props.inputMode === undefined ? getTextMaskInputMode(mask) : undefined,
    [mask, props.inputMode]
  );

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
    const nextValue = getMaskedFieldState(
      mask,
      event.target.value
    ).formattedValue;

    if (event.target.value !== nextValue) {
      event.target.value = nextValue;
    }

    if (event.currentTarget.value !== nextValue) {
      event.currentTarget.value = nextValue;
    }

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onChange?.(event);
  }

  return (
    <label
      className={cx(
        "nu-masked-field",
        isInvalid ? "nu-masked-field--invalid" : null,
        slotClassNames?.root,
        className
      )}
      htmlFor={fieldId}
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      <span
        className={cx("nu-masked-field__label", slotClassNames?.label)}
        style={slotStyles?.label}
      >
        {renderMnemonicText(label)}
      </span>
      <span
        className={cx("nu-masked-field__slot", slotClassNames?.slot)}
        style={slotStyles?.slot}
      >
        <span
          aria-hidden="true"
          className={cx("nu-masked-field__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          [
        </span>
        <span
          className={cx(
            "nu-masked-field__input-shell",
            slotClassNames?.inputShell
          )}
          style={slotStyles?.inputShell}
        >
          <input
            {...props}
            id={fieldId}
            aria-describedby={hintId}
            aria-invalid={resolvedAriaInvalid}
            className={cx("nu-masked-field__input", slotClassNames?.input)}
            inputMode={props.inputMode ?? maskInputMode}
            onChange={handleChange}
            placeholder={placeholder}
            style={slotStyles?.input}
            type="text"
            value={resolvedValue}
          />
        </span>
        <span
          aria-hidden="true"
          className={cx("nu-masked-field__bracket", slotClassNames?.bracket)}
          style={slotStyles?.bracket}
        >
          ]
        </span>
      </span>
      {hint ? (
        <span
          className={cx("nu-masked-field__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

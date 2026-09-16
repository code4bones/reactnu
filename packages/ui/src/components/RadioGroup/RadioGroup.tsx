import { HTMLAttributes, useId, useState } from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { RadioButton } from "./RadioButton";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type RadioGroupSlot = "root" | "label" | "options" | "hint";

export type RadioOption = {
  disabled?: boolean;
  hint?: string;
  label: string;
  value: string;
};

export type RadioGroupProps = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  "onChange"
> & {
  defaultValue?: string;
  hint?: string;
  label?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  slotClassNames?: SlotCustomizationProps<RadioGroupSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<RadioGroupSlot>["slotStyles"];
  value?: string;
};

export function RadioGroup({
  className,
  defaultValue,
  hint,
  label,
  name,
  onValueChange,
  options,
  slotClassNames,
  slotStyles,
  style,
  value,
  ...props
}: RadioGroupProps) {
  const generatedId = useId();
  const groupName = name ?? generatedId;
  const hintId = hint ? `${groupName}-hint` : undefined;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue ?? options[0]?.value);
  const resolvedValue = isControlled ? value : uncontrolledValue;

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <fieldset
      {...props}
      aria-describedby={hintId}
      className={cx("nu-radio-group", slotClassNames?.root, className)}
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      {label ? (
        <legend
          className={cx("nu-radio-group__label", slotClassNames?.label)}
          style={slotStyles?.label}
        >
          {renderMnemonicText(label)}
        </legend>
      ) : null}
      <div
        className={cx("nu-radio-group__options", slotClassNames?.options)}
        style={slotStyles?.options}
      >
        {options.map((option) => (
          <RadioButton
            checked={resolvedValue === option.value}
            disabled={option.disabled}
            hint={option.hint}
            key={option.value}
            label={option.label}
            name={groupName}
            onCheckedChange={(nextChecked) => {
              if (nextChecked) {
                commitValue(option.value);
              }
            }}
            value={option.value}
          />
        ))}
      </div>
      {hint ? (
        <span
          className={cx("nu-radio-group__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </fieldset>
  );
}

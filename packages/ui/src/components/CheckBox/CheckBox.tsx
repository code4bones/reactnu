import { ChangeEvent, InputHTMLAttributes, useId, useState } from "react";
import { NuGlyph } from "../Glyph";
import { SlotCustomizationProps, cx } from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type CheckBoxSlot =
  | "root"
  | "main"
  | "input"
  | "control"
  | "box"
  | "mark"
  | "label"
  | "hint";

export type CheckBoxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange" | "type"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  hint?: string;
  label: string;
  onCheckedChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  slotClassNames?: SlotCustomizationProps<CheckBoxSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<CheckBoxSlot>["slotStyles"];
  uncheckedShape?: "box" | "none";
};

export function CheckBox({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  hint,
  id,
  label,
  onCheckedChange,
  slotClassNames,
  slotStyles,
  uncheckedShape = "box",
  ...props
}: CheckBoxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const resolvedChecked = isControlled ? checked : uncontrolledChecked;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    onCheckedChange?.(event.target.checked, event);
  }

  return (
    <label
      className={cx("nu-check-box", slotClassNames?.root, className)}
      style={slotStyles?.root}
    >
      <span
        className={cx("nu-check-box__main", slotClassNames?.main)}
        style={slotStyles?.main}
      >
        <input
          {...props}
          aria-describedby={hintId}
          checked={resolvedChecked}
          className={cx("nu-check-box__input", slotClassNames?.input)}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          style={slotStyles?.input}
          type="checkbox"
        />
        <span
          aria-hidden="true"
          className={cx("nu-check-box__control", slotClassNames?.control)}
          style={slotStyles?.control}
        >
          <span
            className={cx("nu-check-box__box", slotClassNames?.box)}
            data-unchecked-shape={uncheckedShape}
            style={slotStyles?.box}
          >
            {resolvedChecked ? (
              <NuGlyph
                className={cx("nu-check-box__mark", slotClassNames?.mark)}
                name="check-mark"
                style={slotStyles?.mark}
              />
            ) : null}
          </span>
        </span>
        <span
          className={cx("nu-check-box__label", slotClassNames?.label)}
          style={slotStyles?.label}
        >
          {renderMnemonicText(label)}
        </span>
      </span>
      {hint ? (
        <span
          className={cx("nu-check-box__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

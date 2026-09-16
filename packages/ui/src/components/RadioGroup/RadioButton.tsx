import { ChangeEvent, InputHTMLAttributes, useId, useState } from "react";
import { NuGlyph } from "../Glyph";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type RadioButtonProps = Omit<
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
};

export function RadioButton({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  hint,
  id,
  label,
  onCheckedChange,
  ...props
}: RadioButtonProps) {
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
    <label className={["nu-radio-button", className].filter(Boolean).join(" ")}>
      <span className="nu-radio-button__main">
        <input
          {...props}
          aria-describedby={hintId}
          checked={resolvedChecked}
          className="nu-radio-button__input"
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          type="radio"
        />
        <span aria-hidden="true" className="nu-radio-button__control">
          <span className="nu-radio-button__disc">
            <NuGlyph className="nu-radio-button__ring" name="radio-ring" />
            {resolvedChecked ? (
              <NuGlyph className="nu-radio-button__fill" name="radio-fill" />
            ) : null}
          </span>
        </span>
        <span className="nu-radio-button__label">
          {renderMnemonicText(label)}
        </span>
      </span>
      {hint ? (
        <span className="nu-radio-button__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

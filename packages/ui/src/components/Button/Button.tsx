import {
  ButtonHTMLAttributes,
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicNode } from "../../utils/renderMnemonicText";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";
export type ButtonSlot =
  | "root"
  | "face"
  | "label"
  | "focusIndicatorLeft"
  | "focusIndicatorRight"
  | "shadowRight"
  | "shadowBottom";

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Marks this button as the dialog action invoked with Enter. */
    isDefault?: boolean;
    /** Marks this button as the dialog action invoked with Escape. */
    isCancel?: boolean;
    defaultFocused?: boolean;
    focused?: boolean;
    slotClassNames?: SlotCustomizationProps<ButtonSlot>["slotClassNames"];
    slotStyles?: SlotCustomizationProps<ButtonSlot>["slotStyles"];
    variant?: ButtonVariant;
  }
>;

export function Button({
  children,
  className,
  defaultFocused = false,
  disabled = false,
  focused,
  isCancel = false,
  isDefault = false,
  onBlur,
  onClick,
  onFocus,
  slotClassNames,
  slotStyles,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [uncontrolledFocused, setUncontrolledFocused] =
    useState(defaultFocused);
  const isControlled = focused !== undefined;
  const resolvedFocused = isControlled ? focused : uncontrolledFocused;

  useEffect(() => {
    if (!isControlled && defaultFocused) {
      buttonRef.current?.focus();
    }
  }, [defaultFocused, isControlled]);

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    if (!isControlled) {
      setUncontrolledFocused(true);
    }

    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLButtonElement>) {
    if (!isControlled) {
      setUncontrolledFocused(false);
    }

    onBlur?.(event);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (buttonRef.current && document.activeElement !== buttonRef.current) {
      buttonRef.current.focus();
    }

    onClick?.(event);
  }

  return (
    <button
      {...props}
      className={cx("nu-button", slotClassNames?.root, className)}
      data-nu-cancel={isCancel || undefined}
      data-nu-default={isDefault || undefined}
      data-focused={resolvedFocused || undefined}
      data-variant={variant}
      disabled={disabled}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      ref={buttonRef}
      style={mergeSlotStyle(props.style, slotStyles?.root)}
      type={type}
    >
      <span
        className={cx("nu-button__face", slotClassNames?.face)}
        style={slotStyles?.face}
      >
        <span
          aria-hidden="true"
          className={cx(
            "nu-button__focus-indicator",
            "nu-button__focus-indicator--left",
            slotClassNames?.focusIndicatorLeft
          )}
          style={slotStyles?.focusIndicatorLeft}
        />
        <span
          className={cx("nu-button__label", slotClassNames?.label)}
          style={slotStyles?.label}
        >
          {renderMnemonicNode(children)}
        </span>
        <span
          aria-hidden="true"
          className={cx(
            "nu-button__focus-indicator",
            "nu-button__focus-indicator--right",
            slotClassNames?.focusIndicatorRight
          )}
          style={slotStyles?.focusIndicatorRight}
        />
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "nu-button__shadow",
          "nu-button__shadow--right",
          slotClassNames?.shadowRight
        )}
        style={slotStyles?.shadowRight}
      />
      <span
        aria-hidden="true"
        className={cx(
          "nu-button__shadow",
          "nu-button__shadow--bottom",
          slotClassNames?.shadowBottom
        )}
        style={slotStyles?.shadowBottom}
      />
    </button>
  );
}

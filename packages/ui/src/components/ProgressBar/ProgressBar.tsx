import { CSSProperties, HTMLAttributes, ReactNode } from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type ProgressBarSlot =
  | "root"
  | "label"
  | "track"
  | "fill"
  | "value"
  | "hint";

export type ProgressBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hint?: string;
  indeterminate?: boolean;
  label?: string;
  max?: number;
  min?: number;
  showValue?: boolean;
  slotClassNames?: SlotCustomizationProps<ProgressBarSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<ProgressBarSlot>["slotStyles"];
  trackBackground?: CSSProperties["background"];
  value?: number;
  valueRenderer?: (
    percent: number,
    value: number,
    min: number,
    max: number
  ) => ReactNode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ProgressBar({
  className,
  hint,
  indeterminate = false,
  label,
  max = 100,
  min = 0,
  showValue = true,
  slotClassNames,
  slotStyles,
  style,
  trackBackground,
  value = min,
  valueRenderer,
  ...props
}: ProgressBarProps) {
  const safeMax = max <= min ? min + 1 : max;
  const clampedValue = clamp(value, min, safeMax);
  const percent = Math.round(((clampedValue - min) / (safeMax - min)) * 100);
  const renderedValue = valueRenderer
    ? valueRenderer(percent, clampedValue, min, safeMax)
    : `${percent}%`;

  return (
    <div
      {...props}
      aria-valuemax={safeMax}
      aria-valuemin={min}
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuetext={
        typeof renderedValue === "string" ? renderedValue : undefined
      }
      className={cx("nu-progress-bar", slotClassNames?.root, className)}
      role="progressbar"
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      {label ? (
        <span
          className={cx("nu-progress-bar__label", slotClassNames?.label)}
          style={slotStyles?.label}
        >
          {renderMnemonicText(label)}
        </span>
      ) : null}
      <div
        className={cx("nu-progress-bar__track", slotClassNames?.track)}
        style={mergeSlotStyle(
          trackBackground
            ? {
                background: trackBackground
              }
            : undefined,
          slotStyles?.track
        )}
      >
        <div
          className={cx("nu-progress-bar__fill", slotClassNames?.fill)}
          data-indeterminate={indeterminate || undefined}
          style={mergeSlotStyle(
            indeterminate
              ? undefined
              : {
                  width: `${percent}%`
                },
            slotStyles?.fill
          )}
        />
        {showValue ? (
          <span
            className={cx("nu-progress-bar__value", slotClassNames?.value)}
            style={slotStyles?.value}
          >
            {renderedValue}
          </span>
        ) : null}
      </div>
      {hint ? (
        <span
          className={cx("nu-progress-bar__hint", slotClassNames?.hint)}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

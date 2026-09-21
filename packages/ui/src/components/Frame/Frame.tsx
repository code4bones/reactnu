import {
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type FrameTitleProps = {
  background?: CSSProperties["background"];
  borderColor?: CSSProperties["borderColor"];
  color?: CSSProperties["color"];
};

export type FrameSlot =
  | "root"
  | "title"
  | "titleStart"
  | "titleContent"
  | "titleEnd"
  | "body";

export type FrameProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    contentStyle?: CSSProperties;
    fill?: boolean;
    slotClassNames?: SlotCustomizationProps<FrameSlot>["slotClassNames"];
    slotStyles?: SlotCustomizationProps<FrameSlot>["slotStyles"];
    title?: string;
    titleContent?: ReactNode;
    titleEnd?: ReactNode;
    titleProps?: FrameTitleProps;
    titleStart?: ReactNode;
    titleStyle?: CSSProperties;
    variant?: "outline" | "title-bar";
    titleAlign?: "start" | "center" | "end";
    titleBold?: boolean;
  }
>;

export function Frame({
  children,
  className,
  contentStyle,
  fill = true,
  slotClassNames,
  slotStyles,
  title,
  titleContent,
  titleEnd,
  titleAlign = "start",
  titleBold = false,
  titleProps,
  titleStart,
  titleStyle,
  variant = "outline",
  ...props
}: FrameProps) {
  const resolvedTitleContent =
    titleContent ?? (title ? renderMnemonicText(title) : null);
  const hasTitleShell = Boolean(titleStart || resolvedTitleContent || titleEnd);

  return (
    <section
      {...props}
      className={cx("nu-frame", slotClassNames?.root, className)}
      data-fill={fill || undefined}
      data-has-title={hasTitleShell || undefined}
      data-title-align={titleAlign}
      data-title-bold={titleBold || undefined}
      data-variant={variant}
      style={
        {
          ...props.style,
          "--nu-frame-border-color": titleProps?.borderColor,
          "--nu-frame-title-bg": titleProps?.background,
          "--nu-frame-title-color": titleProps?.color,
          ...slotStyles?.root
        } as CSSProperties
      }
    >
      {hasTitleShell ? (
        <span
          className={cx("nu-frame__title", slotClassNames?.title)}
          style={mergeSlotStyle(titleStyle, slotStyles?.title)}
        >
          {titleStart ? (
            <span
              className={cx(
                "nu-frame__title-start",
                slotClassNames?.titleStart
              )}
              style={slotStyles?.titleStart}
            >
              {titleStart}
            </span>
          ) : null}
          {resolvedTitleContent ? (
            <span
              className={cx(
                "nu-frame__title-content",
                slotClassNames?.titleContent
              )}
              style={slotStyles?.titleContent}
            >
              {resolvedTitleContent}
            </span>
          ) : null}
          {titleEnd ? (
            <span
              className={cx("nu-frame__title-end", slotClassNames?.titleEnd)}
              style={slotStyles?.titleEnd}
            >
              {titleEnd}
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        className={cx("nu-frame__body", slotClassNames?.body)}
        style={mergeSlotStyle(contentStyle, slotStyles?.body)}
      >
        {children}
      </div>
    </section>
  );
}

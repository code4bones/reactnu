import { HTMLAttributes, PropsWithChildren } from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type PanelSlot = "root" | "header" | "body" | "footer";

export type PanelProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    footer?: string;
    inset?: boolean;
    slotClassNames?: SlotCustomizationProps<PanelSlot>["slotClassNames"];
    slotStyles?: SlotCustomizationProps<PanelSlot>["slotStyles"];
    title?: string;
  }
>;

export function Panel({
  children,
  className,
  footer,
  inset = false,
  slotClassNames,
  slotStyles,
  title,
  ...props
}: PanelProps) {
  return (
    <section
      {...props}
      className={cx("nu-panel", slotClassNames?.root, className)}
      style={mergeSlotStyle(props.style, slotStyles?.root)}
    >
      {title ? (
        <header
          className={cx("nu-panel__header", slotClassNames?.header)}
          style={slotStyles?.header}
        >
          {renderMnemonicText(title)}
        </header>
      ) : null}
      <div
        className={cx(
          "nu-panel__body",
          inset ? "nu-panel__inset" : null,
          slotClassNames?.body
        )}
        style={slotStyles?.body}
      >
        {children}
      </div>
      {footer ? (
        <footer
          className={cx("nu-panel__footer", slotClassNames?.footer)}
          style={slotStyles?.footer}
        >
          {renderMnemonicText(footer)}
        </footer>
      ) : null}
    </section>
  );
}

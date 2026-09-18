import { HTMLAttributes, ReactNode } from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import {
  CommandButton,
  CommandButtonProps
} from "../CommandButton/CommandButton";
import { MainMenuItem, MainMenuNode } from "../MainMenu/MainMenu.types";

export type ToolBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Static decorative or informative content before the tool controls. */
  startContent?: ReactNode;
  /** Static decorative or informative content after the tool controls. */
  endContent?: ReactNode;
  fill?: boolean;
  slotClassNames?: SlotCustomizationProps<"root">["slotClassNames"];
  slotStyles?: SlotCustomizationProps<"root">["slotStyles"];
  wrap?: boolean;
};

export type ToolButtonSlot = "button" | "icon" | "label" | "caret";

export type ToolButtonProps = Omit<
  CommandButtonProps,
  | "menuItems"
  | "onMenuItemSelect"
  | "uncheckedShape"
  | "slotClassNames"
  | "slotStyles"
> & {
  slotClassNames?: SlotCustomizationProps<ToolButtonSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<ToolButtonSlot>["slotStyles"];
};

export type ToolSeparatorProps = HTMLAttributes<HTMLDivElement> &
  SlotCustomizationProps<"separator">;

export type ToolDropButtonProps = ToolButtonProps & {
  menuItems?: MainMenuNode[];
  onMenuItemSelect?: (item: MainMenuItem) => void;
  uncheckedShape?: "box" | "none";
};

export function ToolBar({
  children,
  className,
  endContent,
  fill = true,
  slotClassNames,
  slotStyles,
  startContent,
  wrap = false,
  ...props
}: ToolBarProps) {
  return (
    <div
      {...props}
      className={cx("nu-toolbar", slotClassNames?.root, className)}
      data-fill={fill || undefined}
      data-wrap={wrap || undefined}
      role="toolbar"
      style={mergeSlotStyle(props.style, slotStyles?.root)}
    >
      {startContent !== null && startContent !== undefined ? (
        <span className="nu-toolbar__static nu-toolbar__static--start">
          {startContent}
        </span>
      ) : null}
      {children}
      {endContent !== null && endContent !== undefined ? (
        <span className="nu-toolbar__static nu-toolbar__static--end">
          {endContent}
        </span>
      ) : null}
    </div>
  );
}

export function ToolButton({
  className,
  slotClassNames,
  slotStyles,
  ...props
}: ToolButtonProps) {
  return (
    <CommandButton
      {...props}
      className={cx("nu-toolbar__button", slotClassNames?.button, className)}
      slotClassNames={{
        caret: slotClassNames?.caret,
        icon: slotClassNames?.icon,
        label: slotClassNames?.label,
        root: slotClassNames?.button
      }}
      slotStyles={{
        caret: slotStyles?.caret,
        icon: slotStyles?.icon,
        label: slotStyles?.label,
        root: slotStyles?.button
      }}
      style={mergeSlotStyle(props.style, slotStyles?.button)}
    />
  );
}

export function ToolDropButton({
  className,
  menuItems,
  onMenuItemSelect,
  slotClassNames,
  slotStyles,
  uncheckedShape,
  ...props
}: ToolDropButtonProps) {
  return (
    <CommandButton
      {...props}
      className={cx("nu-toolbar__button", slotClassNames?.button, className)}
      dropdown
      menuItems={menuItems}
      onMenuItemSelect={onMenuItemSelect}
      slotClassNames={{
        caret: slotClassNames?.caret,
        icon: slotClassNames?.icon,
        label: slotClassNames?.label,
        root: slotClassNames?.button
      }}
      slotStyles={{
        caret: slotStyles?.caret,
        icon: slotStyles?.icon,
        label: slotStyles?.label,
        root: slotStyles?.button
      }}
      style={mergeSlotStyle(props.style, slotStyles?.button)}
      uncheckedShape={uncheckedShape}
    />
  );
}

export function ToolSeparator({ className, ...props }: ToolSeparatorProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx(
        "nu-toolbar__separator",
        props.slotClassNames?.separator,
        className
      )}
      style={mergeSlotStyle(props.style, props.slotStyles?.separator)}
    />
  );
}

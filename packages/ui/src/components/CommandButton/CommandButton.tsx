import {
  ButtonHTMLAttributes,
  Fragment,
  PropsWithChildren,
  ReactNode
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { NuGlyph, type NuGlyphName } from "../Glyph";
import { MainMenuItem, MainMenuNode } from "../MainMenu/MainMenu.types";
import { PopupMenu } from "../PopupMenu";
import { usePopupMenu } from "../PopupMenu/usePopupMenu";
import { renderMnemonicNode } from "../../utils/renderMnemonicText";

const COMMAND_BUTTON_GLYPH_NAMES = new Set<NuGlyphName>([
  "check-fill",
  "check-mark",
  "dropdown-arrow",
  "folder",
  "gear",
  "radio-fill",
  "radio-ring",
  "star",
  "tree-caret-down",
  "tree-caret-right",
  "window-close",
  "window-maximize",
  "window-minimize",
  "window-resize",
  "window-restore"
]);

export type CommandButtonSlot = "root" | "icon" | "label" | "caret";

export type CommandButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    dropdown?: boolean;
    icon?: NuGlyphName | ReactNode;
    menuItems?: MainMenuNode[];
    onMenuItemSelect?: (item: MainMenuItem) => void;
    pressed?: boolean;
    slotClassNames?: SlotCustomizationProps<CommandButtonSlot>["slotClassNames"];
    slotStyles?: SlotCustomizationProps<CommandButtonSlot>["slotStyles"];
    toggled?: boolean;
    uncheckedShape?: "box" | "none";
  }
>;

function isCommandButtonGlyphName(value: string): value is NuGlyphName {
  return COMMAND_BUTTON_GLYPH_NAMES.has(value as NuGlyphName);
}

export function CommandButton({
  children,
  className,
  dropdown = false,
  icon,
  menuItems = [],
  onClick,
  onMenuItemSelect,
  pressed = false,
  slotClassNames,
  slotStyles,
  toggled,
  type = "button",
  uncheckedShape = "box",
  ...props
}: CommandButtonProps) {
  const popupMenu = usePopupMenu();
  const hasMenu = menuItems.length > 0;
  const showCaret = dropdown || hasMenu;
  const resolvedToggled = toggled ?? pressed;
  const resolvedIcon =
    typeof icon === "string" && isCommandButtonGlyphName(icon) ? (
      <NuGlyph name={icon} />
    ) : (
      (icon ?? null)
    );

  function handleClick(event: Parameters<NonNullable<typeof onClick>>[0]) {
    onClick?.(event);

    if (event.defaultPrevented || !hasMenu) {
      return;
    }

    popupMenu.openFromClick(event);
  }

  return (
    <Fragment>
      <button
        {...props}
        className={cx(
          "nu-command-button",
          "nu-toolbar__button",
          slotClassNames?.root,
          className
        )}
        data-dropdown={showCaret || undefined}
        data-pressed={resolvedToggled || undefined}
        style={mergeSlotStyle(props.style, slotStyles?.root)}
        type={type}
        onClick={handleClick}
      >
        {resolvedIcon ? (
          <span
            className={cx(
              "nu-command-button__icon",
              "nu-toolbar__button-icon",
              slotClassNames?.icon
            )}
            style={slotStyles?.icon}
          >
            {resolvedIcon}
          </span>
        ) : null}
        {children ? (
          <span
            className={cx(
              "nu-command-button__label",
              "nu-toolbar__button-label",
              slotClassNames?.label
            )}
            style={slotStyles?.label}
          >
            {renderMnemonicNode(children)}
          </span>
        ) : null}
        {showCaret ? (
          <span
            className={cx(
              "nu-command-button__caret",
              "nu-toolbar__button-caret",
              slotClassNames?.caret
            )}
            style={slotStyles?.caret}
          >
            <NuGlyph name="dropdown-arrow" />
          </span>
        ) : null}
      </button>
      {hasMenu ? (
        <PopupMenu
          anchor={popupMenu.anchor}
          items={menuItems}
          onItemSelect={onMenuItemSelect}
          onOpenChange={(nextOpen) => popupMenu.setOpen(nextOpen)}
          open={popupMenu.open}
          uncheckedShape={uncheckedShape}
        />
      ) : null}
    </Fragment>
  );
}

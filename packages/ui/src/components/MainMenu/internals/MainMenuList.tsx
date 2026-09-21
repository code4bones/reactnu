import { MouseEvent, PointerEvent as ReactPointerEvent, useRef } from "react";
import {
  MainMenuItem,
  MainMenuNode,
  isMainMenuDivider,
  isMainMenuItem,
  isMainMenuSpacer
} from "../MainMenu.types";
import { NuGlyph } from "../../Glyph";
import { Spacer } from "../../Spacer";
import { MainMenuSubmenuShell } from "./MainMenuSubmenuShell";
import {
  parseMnemonicText,
  renderMnemonicText
} from "../../../utils/renderMnemonicText";

type MainMenuListProps = {
  activePath: string[];
  items: MainMenuNode[];
  level: number;
  onActivateItem: (item: MainMenuItem, level: number) => void;
  onHoverItem: (item: MainMenuItem, level: number) => void;
  rootVariant?: "bar" | "popup";
  uncheckedShape?: "box" | "none";
};

function getVisibleItems(items: MainMenuNode[]) {
  return items.filter((item) => !item.hidden);
}

function renderItemLabel(item: MainMenuItem) {
  return renderMnemonicText(item.text, "nu-main-menu__hotkey");
}

function resolveItemShortcut(item: MainMenuItem) {
  if (item.shortcut) {
    return item.shortcut;
  }

  if (!item.modifier) {
    return "";
  }

  const { mnemonicChar } = parseMnemonicText(item.text);

  return mnemonicChar ? `${item.modifier}+${mnemonicChar.toUpperCase()}` : "";
}

export function MainMenuList({
  activePath,
  items,
  level,
  onActivateItem,
  onHoverItem,
  rootVariant = "bar",
  uncheckedShape = "box"
}: MainMenuListProps) {
  const touchActivatedItemRef = useRef<string | null>(null);
  const visibleItems = getVisibleItems(items);
  const isRootBar = level === 0 && rootVariant === "bar";
  const isPopupRow = !isRootBar;

  function handlePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    item: MainMenuItem
  ) {
    if (event.pointerType === "mouse" || item.disabled) {
      return;
    }

    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    touchActivatedItemRef.current = item.id;
    window.setTimeout(() => {
      if (touchActivatedItemRef.current === item.id) {
        touchActivatedItemRef.current = null;
      }
    }, 500);
    onActivateItem(item, level);
  }

  function handleClick(
    event: MouseEvent<HTMLButtonElement>,
    item: MainMenuItem
  ) {
    if (event.detail > 0 && touchActivatedItemRef.current === item.id) {
      touchActivatedItemRef.current = null;
      return;
    }

    onActivateItem(item, level);
  }

  return (
    <div
      className={
        isRootBar
          ? "nu-main-menu__bar"
          : "nu-main-menu__popup nu-main-menu__popup--submenu"
      }
      role="menu"
    >
      {visibleItems.map((item) => {
        if (isMainMenuDivider(item)) {
          return (
            <div
              className="nu-main-menu__divider"
              key={item.id}
              role="separator"
            />
          );
        }

        if (isMainMenuSpacer(item)) {
          return isRootBar ? (
            <Spacer className="nu-main-menu__spacer" key={item.id} />
          ) : null;
        }

        const hasChildren = Boolean(
          item.items?.some((child) => isMainMenuItem(child) && !child.hidden)
        );
        const isCheckable = item.checkable === true;
        const isOpen = activePath[level] === item.id;
        const isChecked = item.checked === true;
        const hasCheckMark = isCheckable || isChecked;
        const hasLeadingAdornment =
          isPopupRow && (hasCheckMark || Boolean(item.icon));
        const shortcut =
          isPopupRow && !hasChildren ? resolveItemShortcut(item) : null;

        return (
          <div
            className={[
              "nu-main-menu__item",
              isPopupRow
                ? "nu-main-menu__item--submenu"
                : "nu-main-menu__item--root",
              isOpen ? "nu-main-menu__item--open" : null,
              item.disabled ? "nu-main-menu__item--disabled" : null
            ]
              .filter(Boolean)
              .join(" ")}
            key={item.id}
            onMouseEnter={() => onHoverItem(item, level)}
            role="none"
          >
            <button
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-haspopup={hasChildren || undefined}
              className="nu-main-menu__item-button"
              data-has-leading={hasLeadingAdornment || undefined}
              disabled={item.disabled}
              onClick={(event) => handleClick(event, item)}
              onPointerDown={(event) => handlePointerDown(event, item)}
              type="button"
            >
              {hasLeadingAdornment ? (
                <span aria-hidden="true" className="nu-main-menu__leading">
                  {hasCheckMark ? (
                    <span
                      className={[
                        "nu-main-menu__check",
                        isChecked ? "nu-main-menu__check--active" : null
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {isCheckable ? (
                        <span
                          className="nu-main-menu__check-box"
                          data-unchecked-shape={uncheckedShape}
                        >
                          {isChecked ? <NuGlyph name="check-mark" /> : null}
                        </span>
                      ) : (
                        <NuGlyph name="check-mark" />
                      )}
                    </span>
                  ) : null}
                  {item.icon ? (
                    <span className="nu-main-menu__icon">{item.icon}</span>
                  ) : null}
                </span>
              ) : null}
              <span className="nu-main-menu__label">
                {renderItemLabel(item)}
              </span>
              {shortcut ? (
                <span className="nu-main-menu__shortcut">{shortcut}</span>
              ) : null}
              {isPopupRow && hasChildren ? (
                <span className="nu-main-menu__submenu-arrow">▶</span>
              ) : null}
            </button>
            {hasChildren && isOpen && item.items ? (
              <MainMenuSubmenuShell placement={isRootBar ? "root" : "submenu"}>
                <MainMenuList
                  activePath={activePath}
                  items={item.items}
                  level={level + 1}
                  onActivateItem={onActivateItem}
                  onHoverItem={onHoverItem}
                  uncheckedShape={uncheckedShape}
                />
              </MainMenuSubmenuShell>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

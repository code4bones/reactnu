import {
  MainMenuItem,
  MainMenuNode,
  isMainMenuDivider
} from "../MainMenu.types";
import { NuGlyph } from "../../Glyph";
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
  const visibleItems = getVisibleItems(items);
  const isRootBar = level === 0 && rootVariant === "bar";
  const isPopupRow = !isRootBar;

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

        const hasChildren = Boolean(item.items?.some((child) => !child.hidden));
        const isCheckable = item.checkable === true;
        const isOpen = activePath[level] === item.id;
        const isChecked = item.checked === true;

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
              disabled={item.disabled}
              onClick={() => onActivateItem(item, level)}
              type="button"
            >
              {isPopupRow ? (
                <span
                  aria-hidden="true"
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
                  ) : isChecked ? (
                    <NuGlyph name="check-mark" />
                  ) : null}
                </span>
              ) : null}
              <span className="nu-main-menu__label">
                {renderItemLabel(item)}
              </span>
              {isPopupRow ? (
                <span className="nu-main-menu__shortcut">
                  {resolveItemShortcut(item)}
                </span>
              ) : null}
              {isPopupRow ? (
                <span className="nu-main-menu__submenu-arrow">
                  {hasChildren ? "▶" : ""}
                </span>
              ) : null}
            </button>
            {hasChildren && isOpen && item.items ? (
              <div
                className={[
                  isRootBar
                    ? "nu-main-menu__submenu-shell nu-main-menu__submenu-shell--root"
                    : "nu-main-menu__submenu-shell nu-main-menu__submenu-shell--submenu"
                ].join(" ")}
              >
                <MainMenuList
                  activePath={activePath}
                  items={item.items}
                  level={level + 1}
                  onActivateItem={onActivateItem}
                  onHoverItem={onHoverItem}
                  uncheckedShape={uncheckedShape}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

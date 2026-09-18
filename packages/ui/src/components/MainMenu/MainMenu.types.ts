import { ReactNode } from "react";

export type MainMenuFlags = {
  checkable?: boolean;
  checked?: boolean;
  disabled?: boolean;
  hidden?: boolean;
};

export type MainMenuDivider = {
  hidden?: boolean;
  id: string;
  type: "divider";
};

/** Flexible root-menu space that pushes following menu items to the end. */
export type MainMenuSpacer = {
  hidden?: boolean;
  id: string;
  type: "spacer";
};

export type MainMenuItem = MainMenuFlags & {
  id: string;
  /** Decorative mark shown before the item label in popup menus. */
  icon?: ReactNode;
  items?: MainMenuNode[];
  modifier?: string;
  onSelect?: () => void;
  shortcut?: string;
  text: string;
  type?: "item";
};

export type MainMenuNode = MainMenuItem | MainMenuDivider | MainMenuSpacer;

export function isMainMenuDivider(item: MainMenuNode): item is MainMenuDivider {
  return item.type === "divider";
}

export function isMainMenuSpacer(item: MainMenuNode): item is MainMenuSpacer {
  return item.type === "spacer";
}

export function isMainMenuItem(item: MainMenuNode): item is MainMenuItem {
  return item.type === undefined || item.type === "item";
}

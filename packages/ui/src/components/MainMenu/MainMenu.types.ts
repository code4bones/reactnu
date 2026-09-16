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

export type MainMenuItem = MainMenuFlags & {
  id: string;
  items?: MainMenuNode[];
  modifier?: string;
  onSelect?: () => void;
  shortcut?: string;
  text: string;
  type?: "item";
};

export type MainMenuNode = MainMenuItem | MainMenuDivider;

export function isMainMenuDivider(item: MainMenuNode): item is MainMenuDivider {
  return item.type === "divider";
}

export function isMainMenuItem(item: MainMenuNode): item is MainMenuItem {
  return item.type !== "divider";
}

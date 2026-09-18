import { MouseEventHandler, ReactNode } from "react";
import { MainMenuNode } from "../MainMenu";

export type NuIconPosition = {
  x: number;
  y: number;
};

export type NuIconArrangeMode = "columns" | "rows" | "name";

export type NuIconDefinition = {
  contextMenuItems?: MainMenuNode[] | ((icon: NuIconInfo) => MainMenuNode[]);
  disabled?: boolean;
  id?: string;
  /** A URL for an SVG, PNG, or JPEG asset, or inline SVG/React content. */
  icon: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: MouseEventHandler<HTMLButtonElement>;
  onPositionChange?: (position: NuIconPosition, icon: NuIconInfo) => void;
  /** Application-defined data preserved when the icon moves to another grid. */
  payload?: unknown;
  position?: NuIconPosition;
};

export type NuIconInfo = Omit<NuIconDefinition, "id" | "position"> & {
  id: string;
  position: NuIconPosition;
};

export type NuIconManager = {
  addIcon: (definition: NuIconDefinition) => string;
  arrangeIcons: (mode?: NuIconArrangeMode) => void;
  icons: NuIconInfo[];
  moveIcon: (id: string, position: NuIconPosition) => void;
  removeIcon: (id: string) => void;
  selectedIconId: string | null;
  selectIcon: (id: string | null) => void;
  updateIcon: (
    id: string,
    patch: Partial<Omit<NuIconDefinition, "id">>
  ) => void;
};

export type NuIconContextMenuItems =
  | MainMenuNode[]
  | ((manager: NuIconManager) => MainMenuNode[]);

export type NuIconDropContext = {
  position: NuIconPosition;
  source: NuIconManager;
  sourceGrid: HTMLElement;
  target: NuIconManager;
  targetGrid: HTMLElement;
};

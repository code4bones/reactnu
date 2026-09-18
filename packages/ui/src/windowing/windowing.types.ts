import { CSSProperties, ReactNode } from "react";
import { WindowBorder, WindowMode } from "../components/Window";
import { WindowTitleButtonDefinition } from "../components/Window/WindowTitleButton";
import {
  NuInputBoxOptions,
  NuMessageBoxKind,
  NuMessageBoxOptions,
  NuMessageBoxPreset,
  NuMessageBoxResult
} from "./dialogHelpers";

export type NuManagedWindowSnapshot = {
  height?: number;
  left?: number;
  maximized?: boolean;
  minimized?: boolean;
  top?: number;
  width?: number;
};

export type NuManagedWindowDefinition = {
  /** Windows with the same value share their active/inactive chrome state. */
  activationGroup?: string;
  /** Locks pointer resizing to this width / height ratio and disables maximize. */
  aspectRatio?: number;
  appModal?: boolean;
  bodyClassName?: string;
  border?: WindowBorder;
  className?: string;
  closeable?: boolean;
  content: ReactNode | ((controls: NuManagedWindowControls) => ReactNode);
  domain?: string;
  /** Decorative visual rendered in the fixed left title-bar slot. */
  icon?: ReactNode;
  maximizable?: boolean;
  /** Minimum rendered height and resize bound for this window. */
  minHeight?: CSSProperties["minHeight"];
  /** Minimum rendered width and resize bound for this window. */
  minWidth?: CSSProperties["minWidth"];
  modal?: boolean | string;
  minimizable?: boolean;
  mode?: WindowMode;
  onClose?: (snapshot: NuManagedWindowSnapshot) => boolean | void;
  onOpen?: () => NuManagedWindowSnapshot | void;
  resizable?: boolean;
  statusBar?: ReactNode;
  style?: CSSProperties;
  titleButtons?: WindowTitleButtonDefinition[];
  title: string;
};

export type NuManagedWindowControls = {
  bringToFront: () => void;
  close: () => void;
  id: string;
  toggleMaximized: () => void;
  toggleMinimized: () => void;
  update: (patch: Partial<NuManagedWindowDefinition>) => void;
};

export type NuManagedWindowInfo = Omit<NuManagedWindowDefinition, "content"> & {
  active: boolean;
  id: string;
  maximized: boolean;
  minimized: boolean;
  mode: WindowMode;
};

export type NuWindowBounds = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type {
  NuInputBoxOptions,
  NuMessageBoxKind,
  NuMessageBoxOptions,
  NuMessageBoxPreset,
  NuMessageBoxResult
};

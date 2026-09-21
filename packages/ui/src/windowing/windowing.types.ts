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

/** A serializable workspace record for one managed window. */
export type NuWorkspaceWindowSnapshot = {
  activationGroup?: string;
  domain?: string;
  /** Stable key used to locate the application's restoration factory. */
  factoryKey: string;
  /** Application-owned serializable state returned by `onSaveWorkspace`. */
  meta: unknown;
  mode: WindowMode;
  window: NuManagedWindowSnapshot;
};

export type NuWorkspaceSnapshot = {
  version: 1;
  windows: NuWorkspaceWindowSnapshot[];
};

export type NuWorkspaceWindowSaveContext = {
  id: string;
  window: NuManagedWindowSnapshot;
};

export type NuWorkspaceWindowLoadContext = {
  id: string;
  savedWindow: NuWorkspaceWindowSnapshot;
  window: NuManagedWindowSnapshot;
};

export type NuWorkspaceWindowFactory = (
  savedWindow: NuWorkspaceWindowSnapshot
) => NuManagedWindowDefinition | null | undefined;

export type NuWorkspaceWindowFactories = Record<
  string,
  NuWorkspaceWindowFactory
>;

export type NuWorkspaceLoadResult = {
  restoredIds: string[];
  skipped: NuWorkspaceWindowSnapshot[];
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
  /** Runs after this window was recreated through `loadWorkspace`. */
  onLoadWorkspace?: (
    meta: unknown,
    context: NuWorkspaceWindowLoadContext
  ) => void;
  onOpen?: () => NuManagedWindowSnapshot | void;
  /**
   * Returns application-owned state for a workspace snapshot. Return
   * `undefined` to omit this window from `saveWorkspace`.
   */
  onSaveWorkspace?: (
    context: NuWorkspaceWindowSaveContext
  ) => unknown | undefined;
  resizable?: boolean;
  statusBar?: ReactNode;
  style?: CSSProperties;
  titleButtons?: WindowTitleButtonDefinition[];
  title: string;
  /**
   * Persists this managed window's geometry and minimized/maximized state in
   * localStorage. The key is scoped to `reactnu.window.`.
   */
  windowStoreKey?: string;
  /** Stable key of a factory registered with `NuWorkspaceProvider`. */
  workspaceFactoryKey?: string;
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

import { createContext, useContext } from "react";
import {
  NuInputBoxOptions,
  NuManagedWindowDefinition,
  NuManagedWindowInfo,
  NuMessageBoxOptions,
  NuMessageBoxResult
} from "./windowing.types";

export type NuWindowContextValue = {
  activateWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  closeAll: () => void;
  closeWindow: (id: string) => void;
  openDialog: (definition: NuManagedWindowDefinition) => string;
  openWindow: (definition: NuManagedWindowDefinition) => string;
  showInputBox: (options: NuInputBoxOptions) => Promise<string | null>;
  showMessageBox: (options: NuMessageBoxOptions) => Promise<NuMessageBoxResult>;
  toggleWindowMaximized: (id: string) => void;
  toggleWindowMinimized: (id: string) => void;
  updateWindow: (id: string, patch: Partial<NuManagedWindowDefinition>) => void;
  windows: NuManagedWindowInfo[];
};

export type NuMdiMenuBridge = Pick<
  NuWindowContextValue,
  "activateWindow" | "openDialog" | "windows"
>;

export const NuWindowContext = createContext<NuWindowContextValue | null>(null);

export function useNuWindowManager() {
  const context = useContext(NuWindowContext);

  if (!context) {
    throw new Error(
      "useNuWindowManager must be used within a NuWindowProvider."
    );
  }

  return context;
}

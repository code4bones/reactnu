import { createContext, useContext } from "react";
import { NuIconManager } from "./IconGrid.types";

export type NuIconContextValue = NuIconManager & {
  setGridSize: (size: { height: number; width: number }) => void;
};

export const NuIconContext = createContext<NuIconContextValue | null>(null);

function useNuIconContext() {
  const context = useContext(NuIconContext);

  if (!context) {
    throw new Error("useNuIconManager must be used within a NuIconProvider.");
  }

  return context;
}

export function useNuIconManager(): NuIconManager {
  return useNuIconContext();
}

export function useNuIconGridContext() {
  return useNuIconContext();
}

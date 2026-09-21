import { createContext, useContext } from "react";
import { NuWorkspaceSnapshot } from "./windowing.types";

type NuWindowWorkspaceContextValue = {
  createWorkspaceSnapshot: () => NuWorkspaceSnapshot;
};

export const NuWindowWorkspaceContext =
  createContext<NuWindowWorkspaceContextValue | null>(null);

export function useNuWindowWorkspace() {
  const context = useContext(NuWindowWorkspaceContext);

  if (!context) {
    throw new Error(
      "NuWorkspaceProvider must be used within a NuWindowProvider."
    );
  }

  return context;
}

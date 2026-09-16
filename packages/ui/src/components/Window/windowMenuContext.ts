import { createContext, useContext } from "react";
import { MainMenuStateValue } from "../MainMenu";

export const WindowMenuContext = createContext<MainMenuStateValue | null>(null);

export function useWindowMenu() {
  const context = useContext(WindowMenuContext);

  if (!context) {
    throw new Error("useWindowMenu must be used within a Window menu scope.");
  }

  return context;
}

import { createContext, useContext } from "react";
import { MainMenuStateValue } from "../components/MainMenu";
import { NuMdiMenuBridge } from "../windowing/windowContext";

type AppHostMenuContextValue = MainMenuStateValue & {
  setWindowBridge: (bridge: NuMdiMenuBridge | null) => void;
  windowBridge: NuMdiMenuBridge | null;
};

export const AppHostMenuContext = createContext<AppHostMenuContextValue | null>(
  null
);

export function useAppHostMenu() {
  const context = useContext(AppHostMenuContext);

  if (!context) {
    throw new Error("useAppHostMenu must be used within a NuAppHostProvider.");
  }

  return {
    mainMenu: context.mainMenu,
    setMainMenu: context.setMainMenu,
    setMenuItem: context.setMenuItem,
    setMenuFlags: context.setMenuFlags,
    setMenuDisabled: context.setMenuDisabled,
    enableMenuItem: context.enableMenuItem,
    disableMenuItem: context.disableMenuItem,
    setMenuHidden: context.setMenuHidden,
    showMenuItem: context.showMenuItem,
    hideMenuItem: context.hideMenuItem,
    setMenuChecked: context.setMenuChecked,
    checkMenuItem: context.checkMenuItem,
    uncheckMenuItem: context.uncheckMenuItem,
    toggleMenuChecked: context.toggleMenuChecked,
    setMenuCheckable: context.setMenuCheckable,
    setSubmenuTree: context.setSubmenuTree
  } satisfies MainMenuStateValue;
}

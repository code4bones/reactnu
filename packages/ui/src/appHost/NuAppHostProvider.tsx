import { PropsWithChildren, useMemo, useState } from "react";
import {
  MainMenu,
  hasVisibleMainMenuItems,
  useMainMenuState
} from "../components/MainMenu";
import { resolveMdiMainMenuItems } from "../windowing/mdiMenu";
import { NuMdiMenuBridge } from "../windowing/windowContext";
import { AppHostMenuContext } from "./appHostContext";

type NuAppHostProviderProps = PropsWithChildren<{
  renderMenu?: boolean;
}>;

export function NuAppHostProvider({
  children,
  renderMenu = true
}: NuAppHostProviderProps) {
  const menuState = useMainMenuState();
  const [windowBridge, setWindowBridge] = useState<NuMdiMenuBridge | null>(
    null
  );
  const resolvedMainMenu = useMemo(
    () => resolveMdiMainMenuItems(menuState.mainMenu, windowBridge),
    [menuState.mainMenu, windowBridge]
  );
  const contextValue = useMemo(
    () => ({
      ...menuState,
      setWindowBridge,
      windowBridge
    }),
    [menuState, windowBridge]
  );

  return (
    <AppHostMenuContext.Provider value={contextValue}>
      {renderMenu && hasVisibleMainMenuItems(resolvedMainMenu) ? (
        <MainMenu items={resolvedMainMenu} />
      ) : null}
      {children}
    </AppHostMenuContext.Provider>
  );
}

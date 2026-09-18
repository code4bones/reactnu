import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import {
  MainMenuItem,
  MainMenuFlags,
  MainMenuNode,
  isMainMenuItem
} from "./MainMenu.types";

export type MainMenuItemPatch = Partial<Omit<MainMenuItem, "id" | "type">>;

export type MainMenuStateValue = {
  mainMenu: MainMenuNode[];
  setMainMenu: Dispatch<SetStateAction<MainMenuNode[]>>;
  setMenuItem: (id: string, patch: MainMenuItemPatch) => void;
  setMenuFlags: (id: string, flags: MainMenuFlags) => void;
  setMenuDisabled: (id: string, disabled: boolean) => void;
  enableMenuItem: (id: string) => void;
  disableMenuItem: (id: string) => void;
  setMenuHidden: (id: string, hidden: boolean) => void;
  showMenuItem: (id: string) => void;
  hideMenuItem: (id: string) => void;
  setMenuChecked: (id: string, checked: boolean) => void;
  checkMenuItem: (id: string) => void;
  uncheckMenuItem: (id: string) => void;
  toggleMenuChecked: (id: string) => void;
  setMenuCheckable: (id: string, checkable: boolean) => void;
  setSubmenuTree: (id: string, items: MainMenuNode[]) => void;
};

function patchMenuItem(
  items: MainMenuNode[],
  id: string,
  patch: MainMenuItemPatch
): MainMenuNode[] {
  return items.map((item) => {
    if (item.id === id && isMainMenuItem(item)) {
      return {
        ...item,
        ...patch
      };
    }

    if (isMainMenuItem(item) && item.items) {
      return {
        ...item,
        items: patchMenuItem(item.items, id, patch)
      };
    }

    return item;
  });
}

export function hasVisibleMainMenuItems(items: MainMenuNode[]) {
  return items.some((item) => isMainMenuItem(item) && !item.hidden);
}

export function useMainMenuState(initialMainMenu: MainMenuNode[] = []) {
  const [mainMenu, setMainMenu] = useState<MainMenuNode[]>(initialMainMenu);

  const setMenuItem = useCallback((id: string, patch: MainMenuItemPatch) => {
    setMainMenu((currentMenu) => patchMenuItem(currentMenu, id, patch));
  }, []);

  const setMenuFlags = useCallback(
    (id: string, flags: MainMenuFlags) => {
      setMenuItem(id, flags);
    },
    [setMenuItem]
  );

  const setMenuDisabled = useCallback(
    (id: string, disabled: boolean) => {
      setMenuItem(id, { disabled });
    },
    [setMenuItem]
  );

  const enableMenuItem = useCallback(
    (id: string) => {
      setMenuDisabled(id, false);
    },
    [setMenuDisabled]
  );

  const disableMenuItem = useCallback(
    (id: string) => {
      setMenuDisabled(id, true);
    },
    [setMenuDisabled]
  );

  const setMenuHidden = useCallback(
    (id: string, hidden: boolean) => {
      setMenuItem(id, { hidden });
    },
    [setMenuItem]
  );

  const showMenuItem = useCallback(
    (id: string) => {
      setMenuHidden(id, false);
    },
    [setMenuHidden]
  );

  const hideMenuItem = useCallback(
    (id: string) => {
      setMenuHidden(id, true);
    },
    [setMenuHidden]
  );

  const setMenuChecked = useCallback(
    (id: string, checked: boolean) => {
      setMenuItem(id, { checked });
    },
    [setMenuItem]
  );

  const checkMenuItem = useCallback(
    (id: string) => {
      setMenuChecked(id, true);
    },
    [setMenuChecked]
  );

  const uncheckMenuItem = useCallback(
    (id: string) => {
      setMenuChecked(id, false);
    },
    [setMenuChecked]
  );

  const toggleMenuChecked = useCallback((id: string) => {
    setMainMenu((currentMenu) =>
      currentMenu.map((item) => {
        if (item.id === id && isMainMenuItem(item)) {
          return {
            ...item,
            checked: !item.checked
          };
        }

        if (isMainMenuItem(item) && item.items) {
          return {
            ...item,
            items: toggleMenuCheckedInTree(item.items, id)
          };
        }

        return item;
      })
    );
  }, []);

  const setMenuCheckable = useCallback(
    (id: string, checkable: boolean) => {
      setMenuItem(id, { checkable });
    },
    [setMenuItem]
  );

  const setSubmenuTree = useCallback(
    (id: string, items: MainMenuNode[]) => {
      setMenuItem(id, { items });
    },
    [setMenuItem]
  );

  return useMemo(
    () =>
      ({
        mainMenu,
        setMainMenu,
        setMenuItem,
        setMenuFlags,
        setMenuDisabled,
        enableMenuItem,
        disableMenuItem,
        setMenuHidden,
        showMenuItem,
        hideMenuItem,
        setMenuChecked,
        checkMenuItem,
        uncheckMenuItem,
        toggleMenuChecked,
        setMenuCheckable,
        setSubmenuTree
      }) satisfies MainMenuStateValue,
    [
      mainMenu,
      setMenuItem,
      setMenuFlags,
      setMenuDisabled,
      enableMenuItem,
      disableMenuItem,
      setMenuHidden,
      showMenuItem,
      hideMenuItem,
      setMenuChecked,
      checkMenuItem,
      uncheckMenuItem,
      toggleMenuChecked,
      setMenuCheckable,
      setSubmenuTree
    ]
  );
}

function toggleMenuCheckedInTree(
  items: MainMenuNode[],
  id: string
): MainMenuNode[] {
  return items.map((item) => {
    if (item.id === id && isMainMenuItem(item)) {
      return {
        ...item,
        checked: !item.checked
      };
    }

    if (isMainMenuItem(item) && item.items) {
      return {
        ...item,
        items: toggleMenuCheckedInTree(item.items, id)
      };
    }

    return item;
  });
}

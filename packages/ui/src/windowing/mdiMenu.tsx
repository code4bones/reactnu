import {
  MainMenuDivider,
  MainMenuNode,
  isMainMenuDivider,
  isMainMenuItem
} from "../components/MainMenu/MainMenu.types";
import { MdiWindowPickerDialog } from "./internals/MdiWindowPickerDialog";
import { NuManagedWindowInfo } from "./windowing.types";
import { NuMdiMenuBridge } from "./windowContext";

const MDI_HOST_ID = "mdi.host";

function createMdiDivider(id: string): MainMenuDivider {
  return {
    id,
    type: "divider"
  };
}

function getMdiWindows(bridge: NuMdiMenuBridge | null) {
  return (
    bridge?.windows.filter((windowEntry) => windowEntry.mode === "window") ?? []
  );
}

function getActiveMdiWindowId(windows: NuManagedWindowInfo[]) {
  return (
    windows.find((windowEntry) => windowEntry.active)?.id ??
    [...windows].reverse().find((windowEntry) => !windowEntry.minimized)?.id ??
    windows[windows.length - 1]?.id
  );
}

function activateRelativeMdiWindow(
  bridge: NuMdiMenuBridge | null,
  direction: -1 | 1
) {
  const mdiWindows = getMdiWindows(bridge);

  if (!bridge || mdiWindows.length < 2) {
    return;
  }

  const activeWindowId = getActiveMdiWindowId(mdiWindows);
  const currentIndex = Math.max(
    0,
    mdiWindows.findIndex((windowEntry) => windowEntry.id === activeWindowId)
  );
  const nextIndex =
    (currentIndex + direction + mdiWindows.length) % mdiWindows.length;
  const targetWindow = mdiWindows[nextIndex];

  if (targetWindow) {
    bridge.activateWindow(targetWindow.id);
  }
}

function openMdiWindowPicker(bridge: NuMdiMenuBridge | null) {
  const mdiWindows = getMdiWindows(bridge);

  if (!bridge || mdiWindows.length === 0) {
    return;
  }

  const activeWindowId = getActiveMdiWindowId(mdiWindows);

  bridge.openDialog({
    appModal: true,
    border: "double",
    content: ({ close }) => (
      <MdiWindowPickerDialog
        activeWindowId={activeWindowId}
        onActivateWindow={bridge.activateWindow}
        onClose={close}
        windows={bridge.windows}
      />
    ),
    style: {
      left: "50%",
      minWidth: "24rem",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "26rem"
    },
    title: "Windows"
  });
}

function buildStandardMdiMenuItems(
  bridge: NuMdiMenuBridge | null
): MainMenuNode[] {
  const mdiWindows = getMdiWindows(bridge);
  const activeWindowId = getActiveMdiWindowId(mdiWindows);
  const canCycle = mdiWindows.length > 1;
  const canPick = Boolean(bridge) && mdiWindows.length > 0;

  return [
    {
      disabled: !canCycle,
      id: "mdi.prev",
      onSelect: () => activateRelativeMdiWindow(bridge, -1),
      text: "Previous"
    },
    {
      disabled: !canCycle,
      id: "mdi.next",
      onSelect: () => activateRelativeMdiWindow(bridge, 1),
      text: "Next"
    },
    {
      ...createMdiDivider("mdi.divider.windows")
    },
    ...mdiWindows.map((windowEntry, index) => ({
      checked: windowEntry.id === activeWindowId,
      id: `mdi.window.${windowEntry.id}`,
      icon: windowEntry.icon,
      onSelect: () => bridge?.activateWindow(windowEntry.id),
      text: `${index + 1} ${windowEntry.title}`
    })),
    {
      disabled: !canPick,
      id: "mdi.pick",
      onSelect: () => openMdiWindowPicker(bridge),
      text: "Pick..."
    }
  ];
}

function mergeMdiMenuItems(
  existingItems: MainMenuNode[] | undefined,
  bridge: NuMdiMenuBridge | null
) {
  const resolvedItems = buildStandardMdiMenuItems(bridge);

  if (!existingItems || existingItems.length === 0) {
    return resolvedItems;
  }

  return [
    ...existingItems,
    createMdiDivider("mdi.divider.host"),
    ...resolvedItems
  ];
}

export function resolveMdiMainMenuItems(
  items: MainMenuNode[],
  bridge: NuMdiMenuBridge | null
): MainMenuNode[] {
  return items.map((item) => {
    if (isMainMenuDivider(item)) {
      return item;
    }

    if (isMainMenuItem(item) && item.id === MDI_HOST_ID) {
      return {
        ...item,
        items: mergeMdiMenuItems(item.items, bridge)
      };
    }

    if (isMainMenuItem(item) && item.items) {
      return {
        ...item,
        items: resolveMdiMainMenuItems(item.items, bridge)
      };
    }

    return item;
  });
}

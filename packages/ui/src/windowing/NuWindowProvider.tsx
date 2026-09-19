import {
  CSSProperties,
  Fragment,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Window,
  WindowBorder,
  WindowMode,
  WindowPosition,
  WindowSize
} from "../components/Window";
import { AppHostMenuContext } from "../appHost/appHostContext";
import { AppBarHost } from "./AppBarHost";
import { WindowBar } from "./WindowBar";
import { NuWindowContext, NuWindowContextValue } from "./windowContext";
import {
  getInputBoxDomain,
  getInputBoxStyle,
  getInputBoxTitle,
  getMessageBoxDismissResult,
  getMessageBoxDomain,
  getResolvedMessageBoxLabels,
  getMessageBoxStyle,
  getMessageBoxTitle,
  getResolvedMessageBoxButtons,
  InputBoxDialogContent,
  MessageBoxDialogContent
} from "./dialogHelpers";
import {
  NuManagedWindowControls,
  NuManagedWindowDefinition,
  NuManagedWindowInfo,
  NuManagedWindowSnapshot,
  NuWindowBounds
} from "./windowing.types";

export type {
  NuManagedWindowControls,
  NuManagedWindowDefinition,
  NuManagedWindowInfo,
  NuManagedWindowSnapshot
};

type NuManagedWindowRecord = NuManagedWindowDefinition & {
  appModal: boolean;
  border: WindowBorder;
  closeable: boolean;
  creationOrder: number;
  draggable: boolean;
  id: string;
  maximizable: boolean;
  maximized: boolean;
  modalOwnerId?: string;
  minimizable: boolean;
  minimized: boolean;
  mode: WindowMode;
  resizable: boolean;
  restoreStyle?: CSSProperties;
  titleBase: string;
};

type NuWindowProviderProps = PropsWithChildren<{
  className?: string;
  onAppModalChange?: (active: boolean) => void;
  renderAppBar?: boolean;
}>;

function getDefaultWindowStyle(mode: WindowMode, index: number): CSSProperties {
  const offset = index * 18;

  return {
    position: "absolute",
    top: `calc(50% + ${offset}px)`,
    left: `calc(50% + ${offset}px)`,
    transform: "translate(-50%, -50%)",
    width: mode === "window" ? "34rem" : "26rem",
    height: mode === "window" ? "21rem" : undefined,
    minWidth: mode === "window" ? "26rem" : "22rem"
  };
}

function getNumericStyleValue(value: CSSProperties["left"]) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && /^-?\d+(\.\d+)?px$/.test(value.trim())) {
    return Number.parseFloat(value);
  }

  return undefined;
}

function getWindowStorageKey(windowStoreKey: string | undefined) {
  const normalizedKey = windowStoreKey?.trim();

  return normalizedKey ? `reactnu.window.${normalizedKey}` : null;
}

function readStoredWindowSnapshot(
  windowStoreKey: string | undefined
): NuManagedWindowSnapshot | undefined {
  const storageKey = getWindowStorageKey(windowStoreKey);

  if (!storageKey || typeof window === "undefined") {
    return undefined;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return undefined;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return undefined;
    }

    const storedValue = parsedValue as Record<string, unknown>;
    const snapshot: NuManagedWindowSnapshot = {};

    for (const property of ["height", "width"] as const) {
      const value = storedValue[property];

      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        snapshot[property] = value;
      }
    }

    for (const property of ["left", "top"] as const) {
      const value = storedValue[property];

      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        snapshot[property] = value;
      }
    }

    for (const property of ["maximized", "minimized"] as const) {
      const value = storedValue[property];

      if (typeof value === "boolean") {
        snapshot[property] = value;
      }
    }

    return Object.keys(snapshot).length > 0 ? snapshot : undefined;
  } catch {
    // Persistence is optional; unavailable browser storage must not block windows.
    return undefined;
  }
}

function writeStoredWindowSnapshot(
  windowStoreKey: string | undefined,
  snapshot: NuManagedWindowSnapshot
) {
  const storageKey = getWindowStorageKey(windowStoreKey);

  if (!storageKey || typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    // Persistence is optional; unavailable browser storage must not block windows.
  }
}

// A drag or resize gesture updates windowBoundsById on (essentially) every
// pointermove, and writeStoredWindowSnapshot's JSON.stringify + synchronous
// localStorage.setItem was firing on every one of those updates -- visibly
// janking the drag itself. Coalesce into one write per gesture: reset a
// per-window timer on every bounds change and only persist once motion has
// settled, flushing immediately on close/unmount instead of dropping the
// final in-flight position.
const WINDOW_STORE_WRITE_DEBOUNCE_MS = 250;

type PendingWindowStoreWrite = {
  timeoutId: ReturnType<typeof setTimeout>;
  windowStoreKey: string;
  snapshot: NuManagedWindowSnapshot;
};

function resolveSavedWindowStyle(
  definition: NuManagedWindowDefinition,
  mode: WindowMode,
  ownerCenteredStyle: CSSProperties,
  index: number
) {
  // An explicit host restore hook remains the escape hatch for application
  // storage. The browser-backed key supplies the default restoration path.
  const snapshot =
    definition.onOpen?.() ??
    readStoredWindowSnapshot(definition.windowStoreKey);
  const savedStyle: CSSProperties = {};

  if (snapshot) {
    if (snapshot.height !== undefined) {
      savedStyle.height = snapshot.height;
    }

    if (snapshot.left !== undefined) {
      savedStyle.left = snapshot.left;
    }

    if (snapshot.top !== undefined) {
      savedStyle.top = snapshot.top;
    }

    if (snapshot.width !== undefined) {
      savedStyle.width = snapshot.width;
    }

    if (snapshot.left !== undefined || snapshot.top !== undefined) {
      savedStyle.transform = "none";
    }
  }

  return {
    maximized: snapshot?.maximized === true,
    minimized: snapshot?.minimized === true,
    restoreStyle: snapshot?.maximized
      ? {
          ...getDefaultWindowStyle(mode, index),
          ...ownerCenteredStyle,
          ...definition.style,
          ...savedStyle
        }
      : undefined,
    style: {
      ...getDefaultWindowStyle(mode, index),
      ...ownerCenteredStyle,
      ...definition.style,
      ...savedStyle
    }
  };
}

function resolveManagedWindowSnapshot(
  windowEntry: NuManagedWindowRecord,
  windowBoundsById: Record<string, NuWindowBounds>
): NuManagedWindowSnapshot {
  const fallbackStyle: CSSProperties =
    (windowEntry.maximized
      ? (windowEntry.restoreStyle ?? windowEntry.style)
      : windowEntry.style) ?? {};
  const bounds =
    windowEntry.maximized || !windowBoundsById[windowEntry.id]
      ? undefined
      : windowBoundsById[windowEntry.id];

  return {
    height: bounds?.height ?? getNumericStyleValue(fallbackStyle.height),
    left: bounds?.left ?? getNumericStyleValue(fallbackStyle.left),
    maximized: windowEntry.maximized,
    minimized: windowEntry.minimized,
    top: bounds?.top ?? getNumericStyleValue(fallbackStyle.top),
    width: bounds?.width ?? getNumericStyleValue(fallbackStyle.width)
  };
}

function buildWindowRecord(
  definition: NuManagedWindowDefinition,
  currentWindows: NuManagedWindowRecord[],
  windowBoundsById: Record<string, NuWindowBounds>,
  creationOrder: number,
  id: string,
  index: number,
  mode: WindowMode
): NuManagedWindowRecord {
  const titleBase = definition.title;
  const appModal = definition.appModal ?? definition.modal === true;
  const modalOwnerId =
    typeof definition.modal === "string" ? definition.modal : undefined;
  const ownerBounds = modalOwnerId ? windowBoundsById[modalOwnerId] : undefined;
  const ownerCenteredStyle =
    mode === "dialog" && modalOwnerId && ownerBounds
      ? {
          left: Math.round(ownerBounds.left + ownerBounds.width / 2),
          top: Math.round(ownerBounds.top + ownerBounds.height / 2),
          transform: "translate(-50%, -50%)"
        }
      : {};
  const savedWindowState = resolveSavedWindowStyle(
    definition,
    mode,
    ownerCenteredStyle,
    index
  );
  const hasAspectRatio =
    typeof definition.aspectRatio === "number" &&
    Number.isFinite(definition.aspectRatio) &&
    definition.aspectRatio > 0;

  return {
    ...definition,
    appModal,
    border: definition.border ?? "single",
    closeable: definition.closeable ?? true,
    creationOrder,
    draggable: mode === "window",
    id,
    maximizable:
      !hasAspectRatio && (definition.maximizable ?? mode === "window"),
    modalOwnerId,
    minimizable: definition.minimizable ?? mode === "window",
    mode,
    resizable: definition.resizable ?? mode === "window",
    restoreStyle: hasAspectRatio ? undefined : savedWindowState.restoreStyle,
    title: resolveManagedWindowTitle(currentWindows, titleBase),
    titleBase,
    style: {
      ...savedWindowState.style
    },
    maximized: hasAspectRatio ? false : savedWindowState.maximized,
    minimized: savedWindowState.minimized
  };
}

function resolveManagedWindowTitle(
  currentWindows: NuManagedWindowRecord[],
  titleBase: string,
  excludeId?: string
) {
  const siblingWindows = currentWindows.filter(
    (windowEntry) =>
      windowEntry.id !== excludeId && windowEntry.titleBase === titleBase
  );

  if (siblingWindows.length === 0) {
    return titleBase;
  }

  const occupiedTitles = new Set(
    siblingWindows.map((windowEntry) => windowEntry.title)
  );
  let nextIndex = 1;

  while (occupiedTitles.has(`${titleBase}:${nextIndex}`)) {
    nextIndex += 1;
  }

  return `${titleBase}:${nextIndex}`;
}

function findTopmostAppModalIndex(windows: NuManagedWindowRecord[]) {
  for (let index = windows.length - 1; index >= 0; index -= 1) {
    if (windows[index]?.appModal) {
      return index;
    }
  }

  return -1;
}

function getActivationChain(
  windows: NuManagedWindowRecord[],
  id: string
): NuManagedWindowRecord[] {
  const targetWindow = windows.find((windowEntry) => windowEntry.id === id);

  if (!targetWindow) {
    return [];
  }

  const chain = [targetWindow];
  let currentOwnerId = id;

  while (true) {
    const nextModal = [...windows]
      .reverse()
      .find((windowEntry) => windowEntry.modalOwnerId === currentOwnerId);

    if (!nextModal) {
      return chain;
    }

    chain.push(nextModal);
    currentOwnerId = nextModal.id;
  }
}

export function NuWindowProvider({
  children,
  className,
  onAppModalChange,
  renderAppBar = false
}: NuWindowProviderProps) {
  const creationOrderRef = useRef(0);
  const idRef = useRef(0);
  const windowBoundsByIdRef = useRef<Record<string, NuWindowBounds>>({});
  const pendingWindowStoreWritesRef = useRef<
    Map<string, PendingWindowStoreWrite>
  >(new Map());
  const [windows, setWindows] = useState<NuManagedWindowRecord[]>([]);
  const [windowBoundsById, setWindowBoundsById] = useState<
    Record<string, NuWindowBounds>
  >({});
  const appHostMenuContext = useContext(AppHostMenuContext);

  const nextId = useCallback(() => {
    idRef.current += 1;
    return `nu-window-${idRef.current}`;
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((currentWindows) => {
      const closingWindow = currentWindows.find(
        (windowEntry) => windowEntry.id === id
      );

      if (closingWindow) {
        const canClose = closingWindow.onClose?.(
          resolveManagedWindowSnapshot(
            closingWindow,
            windowBoundsByIdRef.current
          )
        );

        if (canClose === false) {
          return currentWindows;
        }
      }

      return currentWindows.filter((windowEntry) => windowEntry.id !== id);
    });
    setWindowBoundsById((currentBounds) => {
      if (!(id in currentBounds)) {
        return currentBounds;
      }

      const nextBounds = { ...currentBounds };
      delete nextBounds[id];
      windowBoundsByIdRef.current = nextBounds;
      return nextBounds;
    });
  }, []);

  const updateWindowBounds = useCallback(
    (id: string, bounds: NuWindowBounds) => {
      setWindowBoundsById((currentBounds) => {
        const previousBounds = currentBounds[id];

        if (
          previousBounds &&
          previousBounds.left === bounds.left &&
          previousBounds.top === bounds.top &&
          previousBounds.width === bounds.width &&
          previousBounds.height === bounds.height
        ) {
          return currentBounds;
        }

        const nextBounds = {
          ...currentBounds,
          [id]: bounds
        };
        windowBoundsByIdRef.current = nextBounds;
        return nextBounds;
      });
    },
    []
  );

  const bringToFront = useCallback((id: string) => {
    setWindows((currentWindows) => {
      const activationChain = getActivationChain(currentWindows, id);

      if (activationChain.length === 0) {
        return currentWindows;
      }

      return [
        ...currentWindows.filter(
          (windowEntry) =>
            !activationChain.some(
              (chainEntry) => chainEntry.id === windowEntry.id
            )
        ),
        ...activationChain
      ];
    });
  }, []);

  const activateWindow = useCallback((id: string) => {
    setWindows((currentWindows) => {
      const activationChain = getActivationChain(currentWindows, id);

      if (activationChain.length === 0) {
        return currentWindows;
      }

      return [
        ...currentWindows.filter(
          (windowEntry) =>
            !activationChain.some(
              (chainEntry) => chainEntry.id === windowEntry.id
            )
        ),
        ...activationChain.map((windowEntry, index) =>
          index === 0
            ? {
                ...windowEntry,
                minimized: false
              }
            : windowEntry
        )
      ];
    });
  }, []);

  const updateWindow = useCallback(
    (id: string, patch: Partial<NuManagedWindowDefinition>) => {
      setWindows((currentWindows) =>
        currentWindows.map((windowEntry) => {
          if (windowEntry.id !== id) {
            return windowEntry;
          }

          const nextTitleBase = patch.title ?? windowEntry.titleBase;

          return {
            ...windowEntry,
            ...patch,
            style: patch.style
              ? { ...windowEntry.style, ...patch.style }
              : windowEntry.style,
            title: patch.title
              ? resolveManagedWindowTitle(currentWindows, nextTitleBase, id)
              : windowEntry.title,
            titleBase: nextTitleBase
          };
        })
      );
    },
    []
  );

  const updateWindowPosition = useCallback(
    (id: string, position: WindowPosition) => {
      setWindows((currentWindows) =>
        currentWindows.map((windowEntry) =>
          windowEntry.id === id && !windowEntry.maximized
            ? {
                ...windowEntry,
                style: {
                  ...windowEntry.style,
                  left: position.left,
                  top: position.top,
                  transform: "none"
                }
              }
            : windowEntry
        )
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((currentWindows) =>
        currentWindows.map((windowEntry) =>
          windowEntry.id === id && !windowEntry.maximized
            ? {
                ...windowEntry,
                style: {
                  ...windowEntry.style,
                  height,
                  transform: "none",
                  width
                }
              }
            : windowEntry
        )
      );
    },
    []
  );

  const handleWindowSizeChange = useCallback(
    (id: string, size: WindowSize) => updateWindowSize(id, size.width, size.height),
    [updateWindowSize]
  );

  const toggleWindowMinimized = useCallback((id: string) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowEntry) =>
        windowEntry.id === id
          ? {
              ...windowEntry,
              minimized: !windowEntry.minimized
            }
          : windowEntry
      )
    );
  }, []);

  const toggleWindowMaximized = useCallback((id: string) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowEntry) => {
        if (windowEntry.id !== id || !windowEntry.maximizable) {
          return windowEntry;
        }

        if (windowEntry.maximized) {
          return {
            ...windowEntry,
            maximized: false,
            style: windowEntry.restoreStyle ?? windowEntry.style,
            restoreStyle: undefined
          };
        }

        return {
          ...windowEntry,
          maximized: true,
          minimized: false,
          restoreStyle: windowEntry.style,
          style: {
            ...windowEntry.style,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            transform: "none"
          }
        };
      })
    );
  }, []);

  const openManagedWindow = useCallback(
    (definition: NuManagedWindowDefinition, mode: WindowMode) => {
      const id = nextId();
      creationOrderRef.current += 1;
      const creationOrder = creationOrderRef.current;

      setWindows((currentWindows) => [
        ...currentWindows,
        buildWindowRecord(
          definition,
          currentWindows,
          windowBoundsByIdRef.current,
          creationOrder,
          id,
          currentWindows.length,
          mode
        )
      ]);

      return id;
    },
    [nextId]
  );

  const closeAll = useCallback(() => {
    setWindows((currentWindows) =>
      currentWindows.filter((windowEntry) => {
        const canClose = windowEntry.onClose?.(
          resolveManagedWindowSnapshot(windowEntry, windowBoundsByIdRef.current)
        );

        return canClose === false;
      })
    );
  }, []);

  const openDialog = useCallback(
    (definition: NuManagedWindowDefinition) =>
      openManagedWindow(definition, "dialog"),
    [openManagedWindow]
  );

  const openWindow = useCallback(
    (definition: NuManagedWindowDefinition) =>
      openManagedWindow(definition, "window"),
    [openManagedWindow]
  );

  const showMessageBox = useCallback(
    (options: import("./windowing.types").NuMessageBoxOptions) =>
      new Promise<import("./windowing.types").NuMessageBoxResult>((resolve) => {
        const buttons = getResolvedMessageBoxButtons(options);
        const labels = getResolvedMessageBoxLabels(options);
        const dismissResult = getMessageBoxDismissResult(buttons);
        let settled = false;

        function resolveOnce(
          value: import("./windowing.types").NuMessageBoxResult
        ) {
          if (settled) {
            return;
          }

          settled = true;
          resolve(value);
        }

        openDialog({
          appModal: options.appModal ?? true,
          closeable: true,
          content: ({ close }) => (
            <MessageBoxDialogContent
              cancel={buttons.cancel}
              cancelLabel={labels.cancelLabel}
              kind={options.kind ?? "normal"}
              message={options.message}
              no={buttons.no}
              noLabel={labels.noLabel}
              ok={buttons.ok}
              okLabel={labels.okLabel}
              onResolve={(result) => {
                resolveOnce(result);
                close();
              }}
              yes={buttons.yes}
              yesLabel={labels.yesLabel}
            />
          ),
          domain: getMessageBoxDomain(options),
          onClose: () => {
            resolveOnce(dismissResult);
            return true;
          },
          style: getMessageBoxStyle(options),
          title: getMessageBoxTitle(options)
        });
      }),
    [openDialog]
  );

  const showInputBox = useCallback(
    (options: import("./windowing.types").NuInputBoxOptions) =>
      new Promise<string | null>((resolve) => {
        let settled = false;

        function resolveOnce(value: string | null) {
          if (settled) {
            return;
          }

          settled = true;
          resolve(value);
        }

        openDialog({
          appModal: options.appModal ?? true,
          closeable: true,
          content: ({ close }) => (
            <InputBoxDialogContent
              cancelLabel={options.cancelLabel ?? "&Cancel"}
              defaultValue={options.defaultValue}
              hint={options.hint}
              label={options.label}
              okLabel={options.okLabel ?? "&OK"}
              onResolve={(value) => {
                resolveOnce(value);
                close();
              }}
              placeholder={options.placeholder}
            />
          ),
          domain: getInputBoxDomain(options),
          onClose: () => {
            resolveOnce(null);
            return true;
          },
          style: getInputBoxStyle(options),
          title: getInputBoxTitle(options)
        });
      }),
    [openDialog]
  );

  const visibleWindows = windows.filter(
    (windowEntry) => !windowEntry.minimized
  );
  // Minimized windows stay in renderWindows (unlike visibleWindows, used
  // below for stacking/active-window math) so their <Window> subtree stays
  // mounted — minimizing must not unmount window content and lose its
  // local state; Window.tsx hides them visually via CSS instead.
  const renderWindows = [...windows].sort(
    (leftWindow, rightWindow) =>
      leftWindow.creationOrder - rightWindow.creationOrder
  );
  const stackIndexById = new Map(
    visibleWindows.map((windowEntry, index) => [windowEntry.id, index])
  );
  const topmostAppModalIndex = findTopmostAppModalIndex(visibleWindows);
  const topmostAppModalId =
    topmostAppModalIndex >= 0
      ? visibleWindows[topmostAppModalIndex]?.id
      : undefined;
  const activeWindowId =
    topmostAppModalIndex >= 0
      ? visibleWindows[topmostAppModalIndex]?.id
      : visibleWindows[visibleWindows.length - 1]?.id;
  const activeWindow = activeWindowId
    ? windows.find((windowEntry) => windowEntry.id === activeWindowId)
    : undefined;
  const activeActivationGroup = topmostAppModalIndex >= 0
    ? undefined
    : activeWindow?.activationGroup;
  const hasAppModal = topmostAppModalIndex >= 0;
  const isWindowActive = useCallback(
    (windowEntry: NuManagedWindowRecord) =>
      windowEntry.id === activeWindowId ||
      (activeActivationGroup !== undefined &&
        windowEntry.activationGroup === activeActivationGroup),
    [activeActivationGroup, activeWindowId]
  );

  const windowsInfo = useMemo<NuManagedWindowInfo[]>(
    () =>
      [...windows]
        .sort(
          (leftWindow, rightWindow) =>
            leftWindow.creationOrder - rightWindow.creationOrder
        )
        .map((windowEntry) => ({
          active: isWindowActive(windowEntry),
          activationGroup: windowEntry.activationGroup,
          aspectRatio: windowEntry.aspectRatio,
          bodyClassName: windowEntry.bodyClassName,
          appModal: windowEntry.appModal,
          border: windowEntry.border,
          className: windowEntry.className,
          closeable: windowEntry.closeable,
          domain: windowEntry.domain,
          icon: windowEntry.icon,
          id: windowEntry.id,
          maximizable: windowEntry.maximizable,
          maximized: windowEntry.maximized,
          minHeight: windowEntry.minHeight,
          minWidth: windowEntry.minWidth,
          modal: windowEntry.modalOwnerId ?? false,
          minimizable: windowEntry.minimizable,
          minimized: windowEntry.minimized,
          mode: windowEntry.mode,
          resizable: windowEntry.resizable,
          statusBar: windowEntry.statusBar,
          style: windowEntry.style,
          title: windowEntry.title,
          titleButtons: windowEntry.titleButtons
        })),
    [isWindowActive, windows]
  );
  const mdiBridge = useMemo(
    () => ({
      activateWindow,
      openDialog,
      windows: windowsInfo
    }),
    [activateWindow, openDialog, windowsInfo]
  );

  const contextValue = useMemo<NuWindowContextValue>(
    () => ({
      activateWindow,
      bringToFront,
      closeAll,
      closeWindow,
      openDialog,
      openWindow,
      showInputBox,
      showMessageBox,
      toggleWindowMaximized,
      toggleWindowMinimized,
      updateWindow,
      windows: windowsInfo
    }),
    [
      activateWindow,
      bringToFront,
      closeAll,
      closeWindow,
      openDialog,
      openWindow,
      showInputBox,
      showMessageBox,
      toggleWindowMaximized,
      toggleWindowMinimized,
      updateWindow,
      windowsInfo
    ]
  );

  useEffect(() => {
    if (!appHostMenuContext) {
      return;
    }

    appHostMenuContext.setWindowBridge(mdiBridge);
  }, [appHostMenuContext, mdiBridge]);

  useEffect(() => {
    if (!appHostMenuContext) {
      return;
    }

    return () => {
      appHostMenuContext.setWindowBridge(null);
    };
  }, [appHostMenuContext]);

  useEffect(() => {
    onAppModalChange?.(hasAppModal);
  }, [hasAppModal, onAppModalChange]);

  useEffect(() => {
    const pendingWindowStoreWrites = pendingWindowStoreWritesRef.current;
    const windowStoreKeyById = new Map(
      windows.map((windowEntry) => [windowEntry.id, windowEntry.windowStoreKey])
    );

    // A closed window, or one whose key changed, must flush its final pending
    // snapshot before its timer bookkeeping is discarded.
    for (const [id, pending] of pendingWindowStoreWrites) {
      if (windowStoreKeyById.get(id) === pending.windowStoreKey) {
        continue;
      }

      clearTimeout(pending.timeoutId);
      pendingWindowStoreWrites.delete(id);
      writeStoredWindowSnapshot(pending.windowStoreKey, pending.snapshot);
    }

    for (const windowEntry of windows) {
      if (!windowEntry.windowStoreKey) {
        continue;
      }

      const existing = pendingWindowStoreWrites.get(windowEntry.id);

      if (existing) {
        clearTimeout(existing.timeoutId);
      }

      const windowStoreKey = windowEntry.windowStoreKey;
      const snapshot = resolveManagedWindowSnapshot(
        windowEntry,
        windowBoundsById
      );
      const timeoutId = setTimeout(() => {
        writeStoredWindowSnapshot(windowStoreKey, snapshot);
        pendingWindowStoreWrites.delete(windowEntry.id);
      }, WINDOW_STORE_WRITE_DEBOUNCE_MS);

      pendingWindowStoreWrites.set(windowEntry.id, {
        timeoutId,
        windowStoreKey,
        snapshot
      });
    }
  }, [windowBoundsById, windows]);

  // Provider unmounting (app closing/navigating away) still shouldn't drop
  // whatever the debounce above hasn't flushed yet.
  useEffect(() => {
    const pendingWindowStoreWrites = pendingWindowStoreWritesRef.current;

    return () => {
      for (const entry of pendingWindowStoreWrites.values()) {
        clearTimeout(entry.timeoutId);
        writeStoredWindowSnapshot(entry.windowStoreKey, entry.snapshot);
      }

      pendingWindowStoreWrites.clear();
    };
  }, []);

  return (
    <NuWindowContext.Provider value={contextValue}>
      <div className={["nu-window-host", className].filter(Boolean).join(" ")}>
        {children}
        <div className="nu-window-layer">
          {renderWindows.map((windowEntry) => {
            const isActiveWindow = isWindowActive(windowEntry);
            const stackIndex = stackIndexById.get(windowEntry.id);
            const isTopmostAppModal = windowEntry.id === topmostAppModalId;
            const ownerBounds = windowEntry.modalOwnerId
              ? windowBoundsById[windowEntry.modalOwnerId]
              : undefined;
            const ownerBackdropStyle =
              !windowEntry.appModal && ownerBounds && stackIndex !== undefined
                ? {
                    height: ownerBounds.height,
                    left: ownerBounds.left,
                    top: ownerBounds.top,
                    width: ownerBounds.width,
                    zIndex: stackIndex + 1
                  }
                : null;
            const handleClose = () => closeWindow(windowEntry.id);
            const handleActivate = () => activateWindow(windowEntry.id);
            const handleBringToFront = () => bringToFront(windowEntry.id);
            const handleToggleMaximized = () =>
              toggleWindowMaximized(windowEntry.id);
            const handleToggleMinimized = () =>
              toggleWindowMinimized(windowEntry.id);
            const handlePositionChange = (position: WindowPosition) =>
              updateWindowPosition(windowEntry.id, position);
            const handleSizeChange = (size: WindowSize) =>
              handleWindowSizeChange(windowEntry.id, size);
            const handleUpdate = (patch: Partial<NuManagedWindowDefinition>) =>
              updateWindow(windowEntry.id, patch);
            const controls: NuManagedWindowControls = {
              bringToFront: handleBringToFront,
              close: handleClose,
              id: windowEntry.id,
              toggleMaximized: handleToggleMaximized,
              toggleMinimized: handleToggleMinimized,
              update: handleUpdate
            };
            const content =
              typeof windowEntry.content === "function"
                ? windowEntry.content(controls)
                : windowEntry.content;

            return (
              <Fragment key={windowEntry.id}>
                {isTopmostAppModal ? (
                  <div
                    className="nu-window-layer__modal-backdrop"
                    style={{ zIndex: visibleWindows.length + 1 }}
                  />
                ) : ownerBackdropStyle ? (
                  <div
                    className="nu-window-layer__modal-backdrop"
                    style={ownerBackdropStyle}
                  />
                ) : null}
                <Window
                  active={isActiveWindow}
                  aspectRatio={windowEntry.aspectRatio}
                  bodyClassName={windowEntry.bodyClassName}
                  border={windowEntry.border}
                  className={windowEntry.className}
                  closeable={windowEntry.closeable}
                  draggable={windowEntry.draggable}
                  icon={windowEntry.icon}
                  maximizable={windowEntry.maximizable}
                  minHeight={windowEntry.minHeight}
                  minWidth={windowEntry.minWidth}
                  minimizable={windowEntry.minimizable}
                  maximized={windowEntry.maximized}
                  minimized={windowEntry.minimized}
                  mode={windowEntry.mode}
                  onActivate={handleActivate}
                  onBoundsChange={(bounds) =>
                    updateWindowBounds(windowEntry.id, bounds)
                  }
                  onClose={handleClose}
                  onPositionChange={handlePositionChange}
                  onSizeChange={handleSizeChange}
                  onToggleMaximized={handleToggleMaximized}
                  onToggleMinimized={handleToggleMinimized}
                  resizable={windowEntry.resizable}
                  statusBar={windowEntry.statusBar}
                  style={{
                    ...windowEntry.style,
                    zIndex:
                      isTopmostAppModal && topmostAppModalIndex >= 0
                        ? visibleWindows.length + 2
                        : ownerBackdropStyle
                          ? ownerBackdropStyle.zIndex + 1
                          : (stackIndex ?? 0) + 1
                  }}
                  title={windowEntry.title}
                >
                  {content}
                </Window>
              </Fragment>
            );
          })}
        </div>
        {renderAppBar ? (
          <AppBarHost>
            <WindowBar
              items={windowsInfo.map((windowEntry) => ({
                active: windowEntry.active,
                domain: windowEntry.domain,
                id: windowEntry.id,
                icon: windowEntry.icon,
                minimized: windowEntry.minimized,
                title: windowEntry.title
              }))}
              onActivateWindow={activateWindow}
            />
          </AppBarHost>
        ) : null}
      </div>
    </NuWindowContext.Provider>
  );
}

import {
  CSSProperties,
  Fragment,
  PropsWithChildren,
  ReactNode,
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

function resolveSavedWindowStyle(
  definition: NuManagedWindowDefinition,
  mode: WindowMode,
  ownerCenteredStyle: CSSProperties,
  index: number
) {
  const snapshot = definition.onOpen?.();
  const savedStyle = snapshot
    ? {
        height: snapshot.height,
        left: snapshot.left,
        top: snapshot.top,
        transform:
          snapshot.left !== undefined || snapshot.top !== undefined
            ? "none"
            : undefined,
        width: snapshot.width
      }
    : undefined;

  return {
    maximized: snapshot?.maximized === true,
    minimized: snapshot?.minimized === true,
    restoreStyle:
      snapshot?.maximized === true && savedStyle
        ? {
            ...getDefaultWindowStyle(mode, index),
            ...ownerCenteredStyle,
            ...savedStyle
          }
        : undefined,
    style: {
      ...getDefaultWindowStyle(mode, index),
      ...ownerCenteredStyle,
      ...savedStyle,
      ...definition.style
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

  return {
    ...definition,
    appModal,
    border: definition.border ?? "single",
    closeable: definition.closeable ?? true,
    creationOrder,
    draggable: mode === "window",
    id,
    maximizable: definition.maximizable ?? mode === "window",
    modalOwnerId,
    minimizable: definition.minimizable ?? mode === "window",
    mode,
    resizable: definition.resizable ?? mode === "window",
    restoreStyle: savedWindowState.restoreStyle,
    title: resolveManagedWindowTitle(currentWindows, titleBase),
    titleBase,
    style: {
      ...savedWindowState.style
    },
    maximized: savedWindowState.maximized,
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

function getIdHandler<Args extends unknown[]>(
  cache: Map<string, (...args: Args) => void>,
  id: string,
  fn: (id: string, ...args: Args) => void
): (...args: Args) => void {
  let handler = cache.get(id);

  if (!handler) {
    handler = (...args: Args) => fn(id, ...args);
    cache.set(id, handler);
  }

  return handler;
}

function getWindowControls(
  cache: Map<string, NuManagedWindowControls>,
  id: string,
  bringToFront: () => void,
  close: () => void,
  toggleMaximized: () => void,
  toggleMinimized: () => void,
  update: (patch: Partial<NuManagedWindowDefinition>) => void
): NuManagedWindowControls {
  let controls = cache.get(id);

  if (!controls) {
    controls = { bringToFront, close, id, toggleMaximized, toggleMinimized, update };
    cache.set(id, controls);
  }

  return controls;
}

function getWindowContent(
  cache: Map<string, { source: NuManagedWindowDefinition["content"]; element: ReactNode }>,
  id: string,
  source: NuManagedWindowDefinition["content"],
  controls: NuManagedWindowControls
): ReactNode {
  const cached = cache.get(id);

  if (cached && cached.source === source) {
    return cached.element;
  }

  const element = typeof source === "function" ? source(controls) : source;
  cache.set(id, { source, element });
  return element;
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
  const boundsChangeHandlersRef = useRef(
    new Map<string, (bounds: NuWindowBounds) => void>()
  );
  const windowStyleCacheRef = useRef(
    new Map<
      string,
      { source: CSSProperties | undefined; zIndex: number; merged: CSSProperties }
    >()
  );
  const closeHandlersRef = useRef(new Map<string, () => void>());
  const activateHandlersRef = useRef(new Map<string, () => void>());
  const bringToFrontHandlersRef = useRef(new Map<string, () => void>());
  const toggleMaximizedHandlersRef = useRef(new Map<string, () => void>());
  const toggleMinimizedHandlersRef = useRef(new Map<string, () => void>());
  const positionHandlersRef = useRef(
    new Map<string, (position: WindowPosition) => void>()
  );
  const sizeHandlersRef = useRef(new Map<string, (size: WindowSize) => void>());
  const updateHandlersRef = useRef(
    new Map<string, (patch: Partial<NuManagedWindowDefinition>) => void>()
  );
  const controlsCacheRef = useRef(new Map<string, NuManagedWindowControls>());
  const contentCacheRef = useRef(
    new Map<
      string,
      { source: NuManagedWindowDefinition["content"]; element: ReactNode }
    >()
  );
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

  const getBoundsChangeHandler = useCallback(
    (id: string) => {
      let handler = boundsChangeHandlersRef.current.get(id);

      if (!handler) {
        handler = (bounds: NuWindowBounds) => updateWindowBounds(id, bounds);
        boundsChangeHandlersRef.current.set(id, handler);
      }

      return handler;
    },
    [updateWindowBounds]
  );

  const getWindowStyle = useCallback(
    (id: string, source: CSSProperties | undefined, zIndex: number) => {
      const cached = windowStyleCacheRef.current.get(id);

      if (cached && cached.source === source && cached.zIndex === zIndex) {
        return cached.merged;
      }

      const merged: CSSProperties = { ...source, zIndex };
      windowStyleCacheRef.current.set(id, { source, zIndex, merged });
      return merged;
    },
    []
  );

  useEffect(() => {
    const liveIds = new Set(windows.map((windowEntry) => windowEntry.id));
    const idKeyedCaches: Map<string, unknown>[] = [
      boundsChangeHandlersRef.current,
      windowStyleCacheRef.current,
      closeHandlersRef.current,
      activateHandlersRef.current,
      bringToFrontHandlersRef.current,
      toggleMaximizedHandlersRef.current,
      toggleMinimizedHandlersRef.current,
      positionHandlersRef.current,
      sizeHandlersRef.current,
      updateHandlersRef.current,
      controlsCacheRef.current,
      contentCacheRef.current
    ];

    for (const cache of idKeyedCaches) {
      for (const id of cache.keys()) {
        if (!liveIds.has(id)) {
          cache.delete(id);
        }
      }
    }
  }, [windows]);

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
        if (windowEntry.id !== id) {
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
  const hasAppModal = topmostAppModalIndex >= 0;

  const windowsInfo = useMemo<NuManagedWindowInfo[]>(
    () =>
      [...windows]
        .sort(
          (leftWindow, rightWindow) =>
            leftWindow.creationOrder - rightWindow.creationOrder
        )
        .map((windowEntry) => ({
          active: windowEntry.id === activeWindowId,
          bodyClassName: windowEntry.bodyClassName,
          appModal: windowEntry.appModal,
          border: windowEntry.border,
          className: windowEntry.className,
          closeable: windowEntry.closeable,
          domain: windowEntry.domain,
          id: windowEntry.id,
          maximizable: windowEntry.maximizable,
          maximized: windowEntry.maximized,
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
    [activeWindowId, windows]
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

  return (
    <NuWindowContext.Provider value={contextValue}>
      <div className={["nu-window-host", className].filter(Boolean).join(" ")}>
        {children}
        <div className="nu-window-layer">
          {renderWindows.map((windowEntry) => {
            const isActiveWindow = windowEntry.id === activeWindowId;
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
            const handleClose = getIdHandler(
              closeHandlersRef.current,
              windowEntry.id,
              closeWindow
            );
            const handleActivate = getIdHandler(
              activateHandlersRef.current,
              windowEntry.id,
              activateWindow
            );
            const handleBringToFront = getIdHandler(
              bringToFrontHandlersRef.current,
              windowEntry.id,
              bringToFront
            );
            const handleToggleMaximized = getIdHandler(
              toggleMaximizedHandlersRef.current,
              windowEntry.id,
              toggleWindowMaximized
            );
            const handleToggleMinimized = getIdHandler(
              toggleMinimizedHandlersRef.current,
              windowEntry.id,
              toggleWindowMinimized
            );
            const handlePositionChange = getIdHandler(
              positionHandlersRef.current,
              windowEntry.id,
              updateWindowPosition
            );
            const handleSizeChange = getIdHandler(
              sizeHandlersRef.current,
              windowEntry.id,
              handleWindowSizeChange
            );
            const handleUpdate = getIdHandler(
              updateHandlersRef.current,
              windowEntry.id,
              updateWindow
            );
            const controls = getWindowControls(
              controlsCacheRef.current,
              windowEntry.id,
              handleBringToFront,
              handleClose,
              handleToggleMaximized,
              handleToggleMinimized,
              handleUpdate
            );
            const content = getWindowContent(
              contentCacheRef.current,
              windowEntry.id,
              windowEntry.content,
              controls
            );

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
                  bodyClassName={windowEntry.bodyClassName}
                  border={windowEntry.border}
                  className={windowEntry.className}
                  closeable={windowEntry.closeable}
                  draggable={windowEntry.draggable}
                  maximizable={windowEntry.maximizable}
                  minimizable={windowEntry.minimizable}
                  maximized={windowEntry.maximized}
                  minimized={windowEntry.minimized}
                  mode={windowEntry.mode}
                  onActivate={handleActivate}
                  onBoundsChange={getBoundsChangeHandler(windowEntry.id)}
                  onClose={handleClose}
                  onPositionChange={handlePositionChange}
                  onSizeChange={handleSizeChange}
                  onToggleMaximized={handleToggleMaximized}
                  onToggleMinimized={handleToggleMinimized}
                  resizable={windowEntry.resizable}
                  statusBar={windowEntry.statusBar}
                  style={getWindowStyle(
                    windowEntry.id,
                    windowEntry.style,
                    isTopmostAppModal && topmostAppModalIndex >= 0
                      ? visibleWindows.length + 2
                      : ownerBackdropStyle
                        ? ownerBackdropStyle.zIndex + 1
                        : (stackIndex ?? 0) + 1
                  )}
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

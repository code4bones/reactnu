import {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  PropsWithChildren,
  ReactNode,
  memo,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef
} from "react";
import { WindowStatusBar } from "./internals/WindowStatusBar";
import { WindowTitleBar } from "./internals/WindowTitleBar";
import { WindowTitleButtonDefinition } from "./WindowTitleButton";
import { useWindowTitleButtons } from "./useWindowTitleButtons";
import {
  MainMenu,
  hasVisibleMainMenuItems,
  useMainMenuState
} from "../MainMenu";
import { resolveMdiMainMenuItems } from "../../windowing/mdiMenu";
import { NuWindowContext } from "../../windowing/windowContext";
import { NuWindowBounds } from "../../windowing/windowing.types";
import { WindowMenuContext } from "./windowMenuContext";

export type WindowMode = "dialog" | "window";
export type WindowBorder = "single" | "double";
export type WindowPosition = {
  left: number;
  top: number;
};

export type WindowSize = {
  height: number;
  width: number;
};

type WindowGeometry = WindowPosition & WindowSize;

export type WindowProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLElement>, "title"> & {
    active?: boolean;
    /** Locks pointer resizing to width / height when set to a positive number. */
    aspectRatio?: number;
    bodyClassName?: string;
    border?: WindowBorder;
    closeable?: boolean;
    draggable?: boolean;
    /** Decorative visual rendered in the fixed left title-bar slot. */
    icon?: ReactNode;
    maximizable?: boolean;
    maximized?: boolean;
    minHeight?: CSSProperties["minHeight"];
    minWidth?: CSSProperties["minWidth"];
    minimizable?: boolean;
    minimized?: boolean;
    mode?: WindowMode;
    onActivate?: () => void;
    onBoundsChange?: (bounds: NuWindowBounds) => void;
    onClose?: () => void;
    onPositionChange?: (position: WindowPosition) => void;
    onSizeChange?: (size: WindowSize) => void;
    onToggleMaximized?: () => void;
    onToggleMinimized?: () => void;
    resizable?: boolean;
    scrollable?: boolean;
    statusBarClassName?: string;
    statusBar?: ReactNode;
    titleButtons?: WindowTitleButtonDefinition[];
    title: string;
  }
>;

function getWindowLayerBounds(node: HTMLElement) {
  const parentNode = node.parentElement;

  if (!parentNode) {
    return null;
  }

  return parentNode.getBoundingClientRect();
}

function getWindowGeometry(node: HTMLElement): WindowGeometry {
  const rect = node.getBoundingClientRect();
  const layerBounds = getWindowLayerBounds(node);

  return {
    height: rect.height,
    left: layerBounds ? rect.left - layerBounds.left : rect.left,
    top: layerBounds ? rect.top - layerBounds.top : rect.top,
    width: rect.width
  };
}

function getValidAspectRatio(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function WindowInner({
  active = true,
  aspectRatio,
  bodyClassName,
  border = "single",
  children,
  className,
  closeable = true,
  draggable,
  icon,
  maximizable,
  maximized = false,
  minHeight,
  minWidth,
  minimizable,
  minimized = false,
  mode = "dialog",
  onActivate,
  onBoundsChange,
  onClose,
  onPointerDownCapture,
  onPositionChange,
  onSizeChange,
  onToggleMaximized,
  onToggleMinimized,
  resizable,
  scrollable = mode === "window",
  statusBarClassName,
  statusBar,
  style,
  titleButtons,
  title,
  ...props
}: WindowProps) {
  const windowRef = useRef<HTMLElement | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const dragPositionRef = useRef<WindowPosition | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const resizeSizeRef = useRef<WindowSize | null>(null);
  const menuState = useMainMenuState();
  const windowManager = useContext(NuWindowContext);
  const isDraggable = draggable ?? mode === "window";
  const resolvedAspectRatio = getValidAspectRatio(aspectRatio);
  const isMaximizable =
    resolvedAspectRatio === undefined && (maximizable ?? mode === "window");
  const isMinimizable = minimizable ?? mode === "window";
  const isResizable = resizable ?? mode === "window";
  const mdiBridge = useMemo(
    () => ({
      activateWindow: windowManager?.activateWindow ?? (() => undefined),
      openDialog: windowManager?.openDialog ?? (() => ""),
      windows: windowManager?.windows ?? []
    }),
    [windowManager?.activateWindow, windowManager?.openDialog, windowManager?.windows]
  );
  const resolvedMainMenu = useMemo(
    () => resolveMdiMainMenuItems(menuState.mainMenu, mdiBridge),
    [menuState.mainMenu, mdiBridge]
  );
  const systemTitleButtons = useWindowTitleButtons({
    closeable,
    maximizable: isMaximizable,
    maximized,
    minimizable: isMinimizable,
    minimized,
    onClose,
    onToggleMaximized,
    onToggleMinimized
  });
  const resolvedTitleButtons: WindowTitleButtonDefinition[] =
    titleButtons ?? systemTitleButtons;

  useLayoutEffect(() => {
    if (!onBoundsChange || !windowRef.current || minimized) {
      return;
    }

    const node = windowRef.current;
    const handleBoundsChange = onBoundsChange;

    function measureBounds() {
      handleBoundsChange(getWindowGeometry(node));
    }

    measureBounds();

    const resizeObserver = new ResizeObserver(measureBounds);
    resizeObserver.observe(node);
    window.addEventListener("resize", measureBounds);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureBounds);
    };
  }, [minimized, onBoundsChange, style]);

  function handleRootPointerDownCapture(event: ReactPointerEvent<HTMLElement>) {
    onPointerDownCapture?.(event);

    if (active) {
      return;
    }

    const target = event.target as Element | null;
    const isChromeInteraction = target?.closest(
      ".nu-window__title-bar, .nu-window__resize-handle"
    );

    if (isChromeInteraction) {
      return;
    }

    onActivate?.();
  }

  function handleTitlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    onActivate?.();

    if (
      !isDraggable ||
      maximized ||
      minimized ||
      !onPositionChange ||
      !windowRef.current
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const commitPosition = onPositionChange;
    const { clientX: startClientX, clientY: startClientY } = event;
    const rect = windowRef.current.getBoundingClientRect();
    const windowNode = windowRef.current;
    const layerBounds = getWindowLayerBounds(windowRef.current);
    const startLeft = layerBounds ? rect.left - layerBounds.left : rect.left;
    const startTop = layerBounds ? rect.top - layerBounds.top : rect.top;
    const maxLeft = Math.max(
      0,
      (layerBounds?.width ?? window.innerWidth) - rect.width
    );
    const maxTop = Math.max(
      0,
      (layerBounds?.height ?? window.innerHeight) - rect.height
    );
    let didMove = false;

    function flushDragPosition() {
      if (!dragPositionRef.current) {
        dragFrameRef.current = null;
        return;
      }

      windowNode.style.left = `${dragPositionRef.current.left}px`;
      windowNode.style.top = `${dragPositionRef.current.top}px`;
      windowNode.style.transform = "none";
      dragFrameRef.current = null;
    }

    function scheduleDragPosition(position: WindowPosition) {
      dragPositionRef.current = position;

      if (dragFrameRef.current !== null) {
        return;
      }

      dragFrameRef.current = window.requestAnimationFrame(flushDragPosition);
    }

    function handlePointerMove(moveEvent: PointerEvent) {
      const nextLeft = Math.min(
        maxLeft,
        Math.max(0, startLeft + moveEvent.clientX - startClientX)
      );
      const nextTop = Math.min(
        maxTop,
        Math.max(0, startTop + moveEvent.clientY - startClientY)
      );

      didMove = true;
      scheduleDragPosition({
        left: nextLeft,
        top: nextTop
      });
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (!didMove) {
        dragPositionRef.current = null;
        return;
      }

      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        flushDragPosition();
      }

      if (dragPositionRef.current) {
        commitPosition(dragPositionRef.current);
      }

      dragPositionRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function handleResizePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>
  ) {
    onActivate?.();

    if (
      !isResizable ||
      maximized ||
      minimized ||
      !onSizeChange ||
      !windowRef.current
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const commitSize = onSizeChange;
    const { clientX: startClientX, clientY: startClientY } = event;
    const windowNode = windowRef.current;
    const {
      height: startHeight,
      left,
      top,
      width: startWidth
    } = getWindowGeometry(windowNode);
    const layerBounds = getWindowLayerBounds(windowNode);
    const computedStyle = window.getComputedStyle(windowNode);
    const minWidth = Number.parseFloat(computedStyle.minWidth || "0") || 0;
    const minHeight = Number.parseFloat(computedStyle.minHeight || "0") || 0;
    const availableWidth = (layerBounds?.width ?? window.innerWidth) - left;
    const availableHeight = (layerBounds?.height ?? window.innerHeight) - top;
    const ratioMinWidth = resolvedAspectRatio
      ? Math.max(minWidth, minHeight * resolvedAspectRatio)
      : minWidth;
    const maxWidth = resolvedAspectRatio
      ? Math.max(
          ratioMinWidth,
          Math.min(availableWidth, availableHeight * resolvedAspectRatio)
        )
      : Math.max(minWidth, availableWidth);
    const maxHeight = resolvedAspectRatio
      ? maxWidth / resolvedAspectRatio
      : Math.max(minHeight, availableHeight);
    const hadTransform = computedStyle.transform !== "none";
    let didResize = false;

    if (hadTransform) {
      windowNode.style.left = `${left}px`;
      windowNode.style.top = `${top}px`;
      windowNode.style.transform = "none";
    }

    function flushResize() {
      if (!resizeSizeRef.current) {
        resizeFrameRef.current = null;
        return;
      }

      windowNode.style.width = `${resizeSizeRef.current.width}px`;
      windowNode.style.height = `${resizeSizeRef.current.height}px`;
      resizeFrameRef.current = null;
    }

    function scheduleResize(size: WindowSize) {
      resizeSizeRef.current = size;

      if (resizeFrameRef.current !== null) {
        return;
      }

      resizeFrameRef.current = window.requestAnimationFrame(flushResize);
    }

    function handlePointerMove(moveEvent: PointerEvent) {
      const widthDelta = moveEvent.clientX - startClientX;
      const heightDelta = moveEvent.clientY - startClientY;
      const nextWidth = resolvedAspectRatio
        ? Math.min(
            maxWidth,
            Math.max(
              ratioMinWidth,
              startWidth +
                (Math.abs(widthDelta) >=
                Math.abs(heightDelta * resolvedAspectRatio)
                  ? widthDelta
                  : heightDelta * resolvedAspectRatio)
            )
          )
        : Math.min(maxWidth, Math.max(minWidth, startWidth + widthDelta));
      const nextHeight = resolvedAspectRatio
        ? nextWidth / resolvedAspectRatio
        : Math.min(maxHeight, Math.max(minHeight, startHeight + heightDelta));

      didResize = true;
      scheduleResize({
        height: nextHeight,
        width: nextWidth
      });
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (!didResize) {
        resizeSizeRef.current = null;
        return;
      }

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        flushResize();
      }

      if (resizeSizeRef.current) {
        if (hadTransform) {
          onPositionChange?.({ left, top });
        }

        commitSize(resizeSizeRef.current);
      }

      resizeSizeRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <section
      {...props}
      className={["nu-window", className].filter(Boolean).join(" ")}
      data-active={active || undefined}
      data-border={border}
      data-minimized={minimized || undefined}
      data-mode={mode}
      onPointerDownCapture={handleRootPointerDownCapture}
      ref={windowRef}
      style={
        {
          ...style,
          minHeight: minHeight ?? style?.minHeight ?? 120,
          minWidth: minWidth ?? style?.minWidth ?? 240
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="nu-window__shadow nu-window__shadow--right"
      />
      <span
        aria-hidden
        className="nu-window__shadow nu-window__shadow--bottom"
      />
      <WindowMenuContext.Provider value={menuState}>
        <WindowTitleBar
          draggable={isDraggable}
          icon={icon}
          onDragStart={handleTitlePointerDown}
          title={title}
          titleButtons={resolvedTitleButtons}
        />
        {hasVisibleMainMenuItems(resolvedMainMenu) ? (
          <MainMenu items={resolvedMainMenu} />
        ) : null}
        {/* Always mounted, even while minimized: minimizing hides the
            window via CSS (data-minimized) rather than unmounting it, so
            local state inside window content survives minimize/restore. */}
        <div
          className={[
            "nu-window__body",
            scrollable ? "nu-window__body--scrollable" : null,
            bodyClassName
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
        {mode === "window" && (statusBar || isResizable) ? (
          <WindowStatusBar
            onResizeStart={handleResizePointerDown}
            resizable={isResizable && !maximized}
            statusBarClassName={statusBarClassName}
          >
            {statusBar}
          </WindowStatusBar>
        ) : null}
      </WindowMenuContext.Provider>
    </section>
  );
}

export const Window = memo(WindowInner);

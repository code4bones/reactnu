import {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { PopupMenu, usePopupMenu } from "../PopupMenu";
import { renderMnemonicText } from "../../utils/renderMnemonicText";
import { useNuIconGridContext, useNuIconManager } from "./iconContext";
import {
  NuIconContextMenuItems,
  NuIconArrangeMode,
  NuIconInfo,
  NuIconPosition
} from "./IconGrid.types";

const DRAG_THRESHOLD = 3;

export type NuIconGridProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  contextMenuItems?: NuIconContextMenuItems;
  defaultArrangeMode?: NuIconArrangeMode;
};

type NuIconGridItemProps = {
  gridElement: HTMLDivElement | null;
  icon: NuIconInfo;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function resolveIconContextMenuItems(
  source: NuIconInfo["contextMenuItems"],
  icon: NuIconInfo
) {
  return typeof source === "function" ? source(icon) : (source ?? []);
}

function resolveGridContextMenuItems(
  source: NuIconContextMenuItems | undefined,
  manager: ReturnType<typeof useNuIconManager>
) {
  return typeof source === "function" ? source(manager) : (source ?? []);
}

function NuIconGridItem({ gridElement, icon }: NuIconGridItemProps) {
  const manager = useNuIconGridContext();
  const contextMenu = usePopupMenu();
  const dragStartRef = useRef<
    | {
        clientX: number;
        clientY: number;
        pointerId: number;
        position: NuIconPosition;
      }
    | undefined
  >(undefined);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const suppressClickRef = useRef(false);
  const latestPositionRef = useRef(icon.position);
  const contextMenuItems = resolveIconContextMenuItems(
    icon.contextMenuItems,
    icon
  );

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || icon.disabled) {
      return;
    }

    manager.selectIcon(icon.id);
    latestPositionRef.current = icon.position;
    isDraggingRef.current = false;
    dragStartRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerId: event.pointerId,
      position: icon.position
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const dragStart = dragStartRef.current;

    if (!dragStart || dragStart.pointerId !== event.pointerId || !gridElement) {
      return;
    }

    const deltaX = event.clientX - dragStart.clientX;
    const deltaY = event.clientY - dragStart.clientY;

    if (
      !isDraggingRef.current &&
      Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD
    ) {
      return;
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    const gridRect = gridElement.getBoundingClientRect();
    const iconRect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: Math.round(
        clamp(
          dragStart.position.x + deltaX,
          0,
          Math.max(0, gridRect.width - iconRect.width)
        )
      ),
      y: Math.round(
        clamp(
          dragStart.position.y + deltaY,
          0,
          Math.max(0, gridRect.height - iconRect.height)
        )
      )
    };

    latestPositionRef.current = position;
    manager.moveIcon(icon.id, position);
  }

  function finishDragging(event: PointerEvent<HTMLButtonElement>) {
    const dragStart = dragStartRef.current;

    if (!dragStart || dragStart.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartRef.current = undefined;

    if (!isDraggingRef.current) {
      return;
    }

    suppressClickRef.current = true;
    isDraggingRef.current = false;
    setIsDragging(false);
    icon.onPositionChange?.(latestPositionRef.current, {
      ...icon,
      position: latestPositionRef.current
    });
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      return;
    }

    manager.selectIcon(icon.id);
    icon.onClick?.(event);
  }

  function handleContextMenu(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    manager.selectIcon(icon.id);
    icon.onContextMenu?.(event);

    if (event.defaultPrevented || contextMenuItems.length === 0) {
      return;
    }

    event.preventDefault();
    contextMenu.openAtPoint(event.clientX, event.clientY);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      (event.key !== "ContextMenu" &&
        !(event.key === "F10" && event.shiftKey)) ||
      contextMenuItems.length === 0
    ) {
      return;
    }

    event.preventDefault();
    manager.selectIcon(icon.id);
    contextMenu.openAtElement(event.currentTarget);
  }

  return (
    <>
      <button
        aria-haspopup={contextMenuItems.length > 0 ? "menu" : undefined}
        className="nu-icon-grid__icon"
        data-dragging={isDragging || undefined}
        data-selected={manager.selectedIconId === icon.id || undefined}
        disabled={icon.disabled}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={icon.onDoubleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
        style={{ left: icon.position.x, top: icon.position.y }}
        type="button"
      >
        <span aria-hidden="true" className="nu-icon-grid__glyph">
          {typeof icon.icon === "string" ? (
            <img alt="" draggable={false} src={icon.icon} />
          ) : (
            icon.icon
          )}
        </span>
        <span className="nu-icon-grid__label">
          {renderMnemonicText(icon.label)}
        </span>
      </button>
      <PopupMenu
        anchor={contextMenu.anchor}
        items={contextMenuItems}
        onOpenChange={contextMenu.setOpen}
        open={contextMenu.open}
      />
    </>
  );
}

export function NuIconGrid({
  className,
  contextMenuItems: contextMenuItemsSource,
  defaultArrangeMode,
  onContextMenu,
  onPointerDown,
  ...props
}: NuIconGridProps) {
  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);
  const manager = useNuIconGridContext();
  const hasAppliedDefaultArrangementRef = useRef(false);
  const arrangeIcons = manager.arrangeIcons;
  const setGridSize = manager.setGridSize;
  const contextMenu = usePopupMenu();
  const contextMenuItems = useMemo(
    () => resolveGridContextMenuItems(contextMenuItemsSource, manager),
    [contextMenuItemsSource, manager]
  );

  useLayoutEffect(() => {
    if (!gridElement) {
      return;
    }

    const activeGridElement = gridElement;

    function updateGridSize() {
      const size = {
        height: activeGridElement.clientHeight,
        width: activeGridElement.clientWidth
      };

      setGridSize(size);

      if (
        defaultArrangeMode &&
        !hasAppliedDefaultArrangementRef.current &&
        size.height > 0 &&
        size.width > 0
      ) {
        hasAppliedDefaultArrangementRef.current = true;
        arrangeIcons(defaultArrangeMode);
      }
    }

    updateGridSize();
    const resizeObserver = new ResizeObserver(updateGridSize);
    resizeObserver.observe(gridElement);

    return () => resizeObserver.disconnect();
  }, [arrangeIcons, defaultArrangeMode, gridElement, setGridSize]);

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    onContextMenu?.(event);

    if (event.defaultPrevented || contextMenuItems.length === 0) {
      return;
    }

    event.preventDefault();
    manager.selectIcon(null);
    contextMenu.openAtPoint(event.clientX, event.clientY);
  }

  return (
    <div
      {...props}
      aria-label={props["aria-label"] ?? "Application icons"}
      className={["nu-icon-grid", className].filter(Boolean).join(" ")}
      onContextMenu={handleContextMenu}
      onPointerDown={(event) => {
        onPointerDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (event.target === event.currentTarget) {
          manager.selectIcon(null);
        }
      }}
      ref={setGridElement}
      role="group"
    >
      {manager.icons.map((icon) => (
        <NuIconGridItem gridElement={gridElement} icon={icon} key={icon.id} />
      ))}
      <PopupMenu
        anchor={contextMenu.anchor}
        items={contextMenuItems}
        onOpenChange={contextMenu.setOpen}
        open={contextMenu.open}
      />
    </div>
  );
}

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
import {
  NuDragDropContext,
  NuDragDropItem,
  useNuDragDrop,
  useNuDropTarget
} from "../DragDrop";
import { renderMnemonicText } from "../../utils/renderMnemonicText";
import { useNuIconGridContext, useNuIconManager } from "./iconContext";
import {
  NuIconContextMenuItems,
  NuIconArrangeMode,
  NuIconDropContext,
  NuIconInfo,
  NuIconPosition
} from "./IconGrid.types";

const DRAG_THRESHOLD = 3;

export type NuIconGridProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onDrop"
> & {
  /** Filters icons accepted from another IconGrid before `onIconDrop` is called. */
  accepts?: (icon: NuIconInfo) => boolean;
  /** Filters non-icon shared drag items accepted by this grid. */
  acceptsDrop?: (item: NuDragDropItem) => boolean;
  contextMenuItems?: NuIconContextMenuItems;
  defaultArrangeMode?: NuIconArrangeMode;
  /** Enables hit testing for a non-interactive grid surface behind other content. */
  dropTarget?: boolean;
  /** Called by the target grid before an icon is transferred. Return false to reject the drop. */
  onIconDrop?: (icon: NuIconInfo, context: NuIconDropContext) => boolean | void;
  /** Called by the source grid after its icon was transferred to another grid. */
  onIconMoveOut?: (icon: NuIconInfo, context: NuIconDropContext) => void;
  /** Called after an icon was accepted by a non-IconGrid shared drop target. */
  onDragOut?: (item: NuDragDropItem<NuIconInfo>) => void;
  /** Receives non-icon shared drag items. Return false to reject the drop. */
  onDrop?: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | void;
};

type NuIconGridRegistration = {
  accepts?: NuIconGridProps["accepts"];
  dropTarget: boolean;
  element: HTMLDivElement;
  manager: ReturnType<typeof useNuIconManager>;
  onIconDrop?: NuIconGridProps["onIconDrop"];
};

const gridRegistrations = new Map<HTMLElement, NuIconGridRegistration>();

type NuIconGridItemProps = {
  gridElement: HTMLDivElement | null;
  icon: NuIconInfo;
  onDragOut?: NuIconGridProps["onDragOut"];
  onIconMoveOut?: NuIconGridProps["onIconMoveOut"];
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

function findGridRegistrationAtPoint(clientX: number, clientY: number) {
  const target = document.elementFromPoint(clientX, clientY);
  const gridElement = target?.closest<HTMLElement>(".nu-icon-grid");

  if (gridElement) {
    return gridRegistrations.get(gridElement);
  }

  if (target?.closest(".nu-window")) {
    return undefined;
  }

  return Array.from(gridRegistrations.values())
    .reverse()
    .find((registration) => {
      if (!registration.dropTarget) {
        return false;
      }

      const rect = registration.element.getBoundingClientRect();

      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    });
}

function getTransferredPosition(
  targetGrid: HTMLElement,
  iconElement: HTMLElement,
  clientX: number,
  clientY: number
): NuIconPosition {
  const targetRect = targetGrid.getBoundingClientRect();
  const iconRect = iconElement.getBoundingClientRect();

  return {
    x: Math.round(
      clamp(
        clientX - targetRect.left - iconRect.width / 2,
        0,
        Math.max(0, targetRect.width - iconRect.width)
      )
    ),
    y: Math.round(
      clamp(
        clientY - targetRect.top - iconRect.height / 2,
        0,
        Math.max(0, targetRect.height - iconRect.height)
      )
    )
  };
}

function NuIconGridItem({
  gridElement,
  icon,
  onDragOut,
  onIconMoveOut
}: NuIconGridItemProps) {
  const manager = useNuIconGridContext();
  const dragDrop = useNuDragDrop();
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

    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragDrop.beginDrag(
        { data: icon, id: icon.id, type: "icon" },
        event.currentTarget,
        "icon-grid"
      );
    }

    dragDrop.moveDrag(event.clientX, event.clientY);
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

    if (event.type === "pointercancel" || !gridElement) {
      dragDrop.cancelDrag();
      return;
    }

    if (dragDrop.dropAt(event.clientX, event.clientY)) {
      manager.removeIcon(icon.id);
      onDragOut?.({ data: icon, id: icon.id, type: "icon" });
      return;
    }

    const targetRegistration = findGridRegistrationAtPoint(
      event.clientX,
      event.clientY
    );

    if (!targetRegistration) {
      return;
    }

    if (targetRegistration.element === gridElement) {
      manager.moveIcon(icon.id, latestPositionRef.current);
      icon.onPositionChange?.(latestPositionRef.current, {
        ...icon,
        position: latestPositionRef.current
      });
      return;
    }

    if (
      !targetRegistration.manager.icons.some(
        (targetIcon) => targetIcon.id === icon.id
      )
    ) {
      const position = getTransferredPosition(
        targetRegistration.element,
        event.currentTarget,
        event.clientX,
        event.clientY
      );
      const transferredIcon = { ...icon, position };
      const context: NuIconDropContext = {
        position,
        source: manager,
        sourceGrid: gridElement,
        target: targetRegistration.manager,
        targetGrid: targetRegistration.element
      };

      if (
        targetRegistration.accepts?.(transferredIcon) !== false &&
        targetRegistration.onIconDrop?.(transferredIcon, context) !== false
      ) {
        targetRegistration.manager.addIcon(transferredIcon);
        targetRegistration.manager.selectIcon(transferredIcon.id);
        manager.removeIcon(icon.id);
        onIconMoveOut?.(transferredIcon, context);
        return;
      }
    }
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
    contextMenu.openAtPoint(event.clientX, event.clientY, event.currentTarget);
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
  accepts,
  acceptsDrop,
  className,
  contextMenuItems: contextMenuItemsSource,
  defaultArrangeMode,
  dropTarget = false,
  onDragOut,
  onIconDrop,
  onIconMoveOut,
  onDrop,
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
  const sharedDropTargetOptions = useMemo(
    () =>
      onDrop
        ? {
            accepts: (item: NuDragDropItem) =>
              item.type !== "icon" && acceptsDrop?.(item) !== false,
            onDrop,
            type: "icon-grid"
          }
        : undefined,
    [acceptsDrop, onDrop]
  );

  useNuDropTarget(gridElement, sharedDropTargetOptions);

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

  useLayoutEffect(() => {
    if (!gridElement) {
      return;
    }

    gridRegistrations.set(gridElement, {
      accepts,
      dropTarget,
      element: gridElement,
      manager,
      onIconDrop
    });

    return () => {
      gridRegistrations.delete(gridElement);
    };
  }, [accepts, dropTarget, gridElement, manager, onIconDrop]);

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    onContextMenu?.(event);

    if (event.defaultPrevented || contextMenuItems.length === 0) {
      return;
    }

    event.preventDefault();
    manager.selectIcon(null);
    contextMenu.openAtPoint(event.clientX, event.clientY, event.currentTarget);
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
        <NuIconGridItem
          gridElement={gridElement}
          icon={icon}
          key={icon.id}
          onDragOut={onDragOut}
          onIconMoveOut={onIconMoveOut}
        />
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

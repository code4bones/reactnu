import {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { PopupMenu, usePopupMenu } from "../PopupMenu";
import {
  NuDragDropContext,
  NuDragDropItem,
  NuDragDropProvider,
  NuDropResult,
  NuDropTargetOptions,
  useNuDragSource,
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
  /**
   * Called after an icon was accepted by a non-IconGrid shared drop target.
   * Return `false`, or have the target return `{ action: "copy" }`, to keep
   * the source icon in this grid.
   */
  onDragOut?: (
    item: NuDragDropItem<NuIconInfo>,
    result: NuDropResult
  ) => boolean | void;
  /** Receives non-icon shared drag items. Return false to reject the drop. */
  onDrop?: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | NuDropResult | void;
};

type NuIconGridRegistration = {
  element: HTMLDivElement;
  manager: ReturnType<typeof useNuIconManager>;
  onIconDrop?: NuIconGridProps["onIconDrop"];
  onIconMoveOut?: NuIconGridProps["onIconMoveOut"];
};

const gridRegistrations = new Map<HTMLElement, NuIconGridRegistration>();

type NuIconGridItemProps = {
  icon: NuIconInfo;
  onDragOut?: NuIconGridProps["onDragOut"];
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
  icon,
  onDragOut
}: NuIconGridItemProps) {
  const manager = useNuIconGridContext();
  const contextMenu = usePopupMenu();
  const contextMenuItems = resolveIconContextMenuItems(
    icon.contextMenuItems,
    icon
  );
  const dragSource = useNuDragSource({
    disabled: icon.disabled,
    getItem: () => ({ data: icon, id: icon.id, type: "icon" }),
    onDropAccepted: (result) => {
      if (result.targetType === "icon-grid") {
        return;
      }

      const dragItem = { data: icon, id: icon.id, type: "icon" };
      const shouldMove =
        result.action !== "copy" && onDragOut?.(dragItem, result) !== false;

      if (shouldMove) {
        manager.removeIcon(icon.id);
      }
    },
    sourceType: "icon-grid"
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
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
        data-dragging={dragSource.isDragging || undefined}
        data-selected={manager.selectedIconId === icon.id || undefined}
        disabled={icon.disabled}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={icon.onDoubleClick}
        onKeyDown={handleKeyDown}
        ref={dragSource.dragRef}
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

function NuIconGridContent({
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
  const sharedDropTargetOptions = useMemo<NuDropTargetOptions | undefined>(() => {
    if (!gridElement) {
      return undefined;
    }

    return {
      accepts: (item: NuDragDropItem) => {
        if (item.type === "icon") {
          return accepts?.(item.data as NuIconInfo) !== false;
        }

        return Boolean(onDrop) && acceptsDrop?.(item) !== false;
      },
      onDrop: (item: NuDragDropItem, context: NuDragDropContext) => {
        if (item.type !== "icon") {
          return onDrop?.(item, context) ?? false;
        }

        const sourceGridElement = context.source.element.closest<HTMLElement>(
          ".nu-icon-grid"
        );
        const sourceRegistration = sourceGridElement
          ? gridRegistrations.get(sourceGridElement)
          : undefined;

        if (!sourceRegistration) {
          return false;
        }

        const sourceIcon = item.data as NuIconInfo;
        const position = getTransferredPosition(
          gridElement,
          context.source.element,
          context.clientX,
          context.clientY
        );

        if (sourceRegistration.element === gridElement) {
          manager.moveIcon(sourceIcon.id, position);
          sourceIcon.onPositionChange?.(position, {
            ...sourceIcon,
            position
          });
          return { action: "move", targetType: "icon-grid" };
        }

        if (
          manager.icons.some((targetIcon) => targetIcon.id === sourceIcon.id)
        ) {
          return false;
        }

        const transferredIcon = { ...sourceIcon, position };
        const dropContext: NuIconDropContext = {
          position,
          source: sourceRegistration.manager,
          sourceGrid: sourceRegistration.element,
          target: manager,
          targetGrid: gridElement
        };

        if (onIconDrop?.(transferredIcon, dropContext) === false) {
          return false;
        }

        manager.addIcon(transferredIcon);
        manager.selectIcon(transferredIcon.id);
        sourceRegistration.manager.removeIcon(sourceIcon.id);
        sourceRegistration.onIconMoveOut?.(transferredIcon, dropContext);

        return { action: "move", targetType: "icon-grid" };
      },
      type: "icon-grid"
    };
  }, [accepts, acceptsDrop, gridElement, manager, onDrop, onIconDrop]);

  useNuDropTarget(gridElement, sharedDropTargetOptions);

  const backgroundDropTargetOptions = useMemo<
    NuDropTargetOptions | undefined
  >(() => {
    if (!dropTarget || !gridElement || !sharedDropTargetOptions) {
      return undefined;
    }

    return {
      ...sharedDropTargetOptions,
      onDrop: (item, context) => {
        const rect = gridElement.getBoundingClientRect();

        if (
          context.clientX < rect.left ||
          context.clientX > rect.right ||
          context.clientY < rect.top ||
          context.clientY > rect.bottom
        ) {
          return false;
        }

        return sharedDropTargetOptions.onDrop(item, {
          ...context,
          target: { element: gridElement, type: "icon-grid" }
        });
      }
    };
  }, [dropTarget, gridElement, sharedDropTargetOptions]);

  useNuDropTarget(
    dropTarget && typeof document !== "undefined" ? document.body : null,
    backgroundDropTargetOptions
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

  useLayoutEffect(() => {
    if (!gridElement) {
      return;
    }

    gridRegistrations.set(gridElement, {
      element: gridElement,
      manager,
      onIconDrop,
      onIconMoveOut
    });

    return () => {
      gridRegistrations.delete(gridElement);
    };
  }, [gridElement, manager, onIconDrop, onIconMoveOut]);

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
      data-drop-target={dropTarget || undefined}
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
          icon={icon}
          key={icon.id}
          onDragOut={onDragOut}
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

export function NuIconGrid(props: NuIconGridProps) {
  return (
    <NuDragDropProvider>
      <NuIconGridContent {...props} />
    </NuDragDropProvider>
  );
}

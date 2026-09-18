/* eslint-disable react-refresh/only-export-components -- This module intentionally exports the provider, hooks, and shared DnD types together. */
import {
  PropsWithChildren,
  ReactNode,
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";
import {
  DndProvider,
  DndContext,
  useDrag,
  useDragDropManager,
  useDragLayer,
  useDrop
} from "react-dnd";
import { getEmptyImage, HTML5Backend } from "react-dnd-html5-backend";

const NU_DRAG_ITEM_TYPE = "reactnu-shared-item";

export type NuDragDropItem<T = unknown> = {
  data: T;
  id: string;
  type: string;
};

export type NuDragDropContext = {
  clientX: number;
  clientY: number;
  source: {
    element: HTMLElement;
    type: string;
  };
  target: {
    element: HTMLElement;
    type: string;
  };
};

export type NuDropAction = "copy" | "move";

export type NuDropResult = {
  /** Lets a target request whether its source should copy or move after a successful drop. */
  action?: NuDropAction;
  /** Identifies the target kind for source-side completion handlers. */
  targetType?: string;
};

export type NuDropTargetOptions = {
  accepts?: (item: NuDragDropItem) => boolean;
  onDragEnter?: (item: NuDragDropItem, canDrop: boolean) => void;
  onDragLeave?: (item: NuDragDropItem) => void;
  onDrop: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | NuDropResult | void;
  type: string;
};

export type NuDropTargetState = {
  canDrop: boolean;
  isOver: boolean;
  item: NuDragDropItem | null;
};

type InternalDragItem = NuDragDropItem & {
  preview?: ReactNode;
  sourceElement: HTMLElement | null;
  sourceType: string;
};

type InternalDropResult = NuDropResult & {
  accepted: boolean;
};

function getDropContext(
  item: InternalDragItem,
  element: HTMLElement,
  type: string,
  clientOffset: { x: number; y: number } | null
): NuDragDropContext {
  return {
    clientX: clientOffset?.x ?? 0,
    clientY: clientOffset?.y ?? 0,
    source: {
      element: item.sourceElement ?? element,
      type: item.sourceType
    },
    target: { element, type }
  };
}

function NuDragPreviewLayer() {
  const { isDragging, item, offset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem<InternalDragItem>() ?? null,
    offset: monitor.getClientOffset()
  }));

  if (!isDragging || !item?.preview || !offset) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        left: 0,
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        transform: `translate(${Math.round(offset.x + 12)}px, ${Math.round(offset.y + 12)}px)`,
        zIndex: 2147483647
      }}
    >
      {item.preview}
    </div>
  );
}

export function NuDragDropProvider({ children }: PropsWithChildren) {
  const { dragDropManager } = useContext(DndContext);

  if (dragDropManager) {
    return children;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {children}
      <NuDragPreviewLayer />
    </DndProvider>
  );
}

/** Returns the underlying react-dnd manager for advanced integrations. */
export function useNuDragDrop() {
  return useDragDropManager();
}

export function useNuDropTarget(
  element: HTMLElement | null,
  options: NuDropTargetOptions | undefined
): NuDropTargetState {
  const [{ canDrop, isOver, item }, drop] = useDrop<
    InternalDragItem,
    InternalDropResult,
    NuDropTargetState
  >(
    () => ({
      accept: NU_DRAG_ITEM_TYPE,
      canDrop: (dragItem) =>
        options ? options.accepts?.(dragItem) !== false : false,
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver({ shallow: true }),
        item: monitor.isOver({ shallow: true })
          ? (monitor.getItem<InternalDragItem>() ?? null)
          : null
      }),
      drop: (dragItem, monitor) => {
        if (!options || monitor.didDrop()) {
          return undefined;
        }

        const result = options.onDrop(
          dragItem,
          getDropContext(
            dragItem,
            element ?? dragItem.sourceElement ?? document.body,
            options.type,
            monitor.getClientOffset()
          )
        );

        if (result === false) {
          return { accepted: false };
        }

        return {
          ...(typeof result === "object" && result ? result : {}),
          accepted: true
        };
      }
    }),
    [element, options]
  );

  useEffect(() => {
    if (!element || !options) {
      drop(null);
      return undefined;
    }

    drop(element);
    return () => {
      drop(null);
    };
  }, [drop, element, options]);

  const previousItemRef = useRef<NuDragDropItem | null>(null);

  useEffect(() => {
    const previousItem = previousItemRef.current;

    if (isOver && item && (!previousItem || previousItem !== item)) {
      options?.onDragEnter?.(item, canDrop);
    } else if (!isOver && previousItem) {
      options?.onDragLeave?.(previousItem);
    }

    previousItemRef.current = isOver ? item : null;
  }, [canDrop, isOver, item, options]);

  return { canDrop, isOver, item };
}

type NuDragSourceOptions = {
  disabled?: boolean;
  getItem: () => NuDragDropItem | false;
  onDropAccepted?: (result: NuDropResult) => void;
  renderPreview?: (item: NuDragDropItem) => ReactNode;
  sourceType: string;
};

export function useNuDragSource({
  disabled = false,
  getItem,
  onDropAccepted,
  renderPreview,
  sourceType
}: NuDragSourceOptions) {
  const sourceElementRef = useRef<HTMLElement | null>(null);
  const [{ isDragging }, drag, preview] = useDrag<
    InternalDragItem,
    InternalDropResult,
    { isDragging: boolean }
  >(
    () => ({
      type: NU_DRAG_ITEM_TYPE,
      canDrag: () => !disabled && Boolean(getItem()),
      item: () => {
        const item = getItem();

        if (!item) {
          throw new Error("getItem must return a drag item when dragging is enabled.");
        }

        return {
          ...item,
          preview: renderPreview?.(item),
          sourceElement: sourceElementRef.current,
          sourceType
        };
      },
      end: (_item, monitor) => {
        const result = monitor.getDropResult();

        if (monitor.didDrop() && result?.accepted !== false) {
          onDropAccepted?.(result ?? {});
        }
      },
      collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }),
    [disabled, getItem, onDropAccepted, renderPreview, sourceType]
  );

  const dragRef = useCallback<RefCallback<HTMLElement>>(
    (element) => {
      if (disabled) {
        sourceElementRef.current = null;
        drag(null);
        return;
      }

      sourceElementRef.current = element;
      drag(element);
    },
    [disabled, drag]
  );

  useEffect(() => {
    if (renderPreview) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview, renderPreview]);

  return { dragRef, isDragging };
}

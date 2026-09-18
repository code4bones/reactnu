/* eslint-disable react-refresh/only-export-components -- This module intentionally exports the provider, hooks, and shared DnD types together. */
import {
  PointerEvent,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { getThemePortalStyle } from "../_shared/themePortal";

const DRAG_THRESHOLD = 3;

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

export type NuDropTargetOptions = {
  accepts?: (item: NuDragDropItem) => boolean;
  onDrop: (item: NuDragDropItem, context: NuDragDropContext) => boolean | void;
  type: string;
};

type DropTargetRegistration = NuDropTargetOptions & {
  element: HTMLElement;
};

type ActiveDrag = {
  item: NuDragDropItem;
  preview: HTMLElement;
  sourceElement: HTMLElement;
  sourceType: string;
};

type NuDragDropController = {
  beginDrag: (
    item: NuDragDropItem,
    sourceElement: HTMLElement,
    sourceType: string
  ) => void;
  cancelDrag: () => void;
  dropAt: (clientX: number, clientY: number) => boolean;
  moveDrag: (clientX: number, clientY: number) => void;
  registerTarget: (element: HTMLElement, options: NuDropTargetOptions) => () => void;
};

function createDragPreview(sourceElement: HTMLElement) {
  const rect = sourceElement.getBoundingClientRect();
  const preview = sourceElement.cloneNode(true) as HTMLElement;

  preview.removeAttribute("id");
  preview.setAttribute("aria-hidden", "true");
  Object.assign(preview.style, {
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    margin: "0",
    opacity: "0.85",
    pointerEvents: "none",
    position: "fixed",
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    zIndex: "2147483647"
  });

  const themeStyle = getThemePortalStyle(sourceElement);

  Object.entries(themeStyle ?? {}).forEach(([property, value]) => {
    if (value !== undefined) {
      preview.style.setProperty(property, String(value));
    }
  });
  document.body.append(preview);

  return preview;
}

function createController(): NuDragDropController {
  const targets = new Map<HTMLElement, DropTargetRegistration>();
  let activeDrag: ActiveDrag | null = null;

  function findTarget(clientX: number, clientY: number) {
    const elementAtPoint = document.elementFromPoint(clientX, clientY);
    let candidate = elementAtPoint as HTMLElement | null;

    while (candidate) {
      const target = targets.get(candidate);

      if (target) {
        return target;
      }

      candidate = candidate.parentElement;
    }

    return Array.from(targets.values())
      .reverse()
      .find((target) => {
        const rect = target.element.getBoundingClientRect();

        return (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      });
  }

  function clearActiveDrag() {
    activeDrag?.preview.remove();
    activeDrag = null;
  }

  return {
    beginDrag(item, sourceElement, sourceType) {
      clearActiveDrag();
      activeDrag = {
        item,
        preview: createDragPreview(sourceElement),
        sourceElement,
        sourceType
      };
    },
    cancelDrag: clearActiveDrag,
    dropAt(clientX, clientY) {
      const currentDrag = activeDrag;

      if (!currentDrag) {
        return false;
      }

      const target = findTarget(clientX, clientY);
      clearActiveDrag();

      if (!target || target.element === currentDrag.sourceElement) {
        return false;
      }

      if (target.accepts?.(currentDrag.item) === false) {
        return false;
      }

      return (
        target.onDrop(currentDrag.item, {
          clientX,
          clientY,
          source: {
            element: currentDrag.sourceElement,
            type: currentDrag.sourceType
          },
          target: { element: target.element, type: target.type }
        }) !== false
      );
    },
    moveDrag(clientX, clientY) {
      const currentDrag = activeDrag;

      if (!currentDrag) {
        return;
      }

      const rect = currentDrag.sourceElement.getBoundingClientRect();
      currentDrag.preview.style.left = `${Math.round(clientX - rect.width / 2)}px`;
      currentDrag.preview.style.top = `${Math.round(clientY - rect.height / 2)}px`;
    },
    registerTarget(element, options) {
      targets.set(element, { ...options, element });

      return () => targets.delete(element);
    }
  };
}

const fallbackController = createController();
const NuDragDropContext = createContext<NuDragDropController | null>(null);

export function NuDragDropProvider({ children }: PropsWithChildren) {
  const controller = useMemo(() => createController(), []);

  return (
    <NuDragDropContext.Provider value={controller}>
      {children}
    </NuDragDropContext.Provider>
  );
}

export function useNuDragDrop() {
  return useContext(NuDragDropContext) ?? fallbackController;
}

export function useNuDropTarget(
  element: HTMLElement | null,
  options: NuDropTargetOptions | undefined
) {
  const controller = useNuDragDrop();

  useEffect(() => {
    if (!element || !options) {
      return undefined;
    }

    return controller.registerTarget(element, options);
  }, [controller, element, options]);
}

type NuDragSourceOptions = {
  disabled?: boolean;
  getItem: () => NuDragDropItem | false;
  onDropAccepted?: () => void;
  sourceType: string;
};

export function useNuDragSource({
  disabled = false,
  getItem,
  onDropAccepted,
  sourceType
}: NuDragSourceOptions) {
  const controller = useNuDragDrop();
  const stateRef = useRef({
    dragging: false,
    pointerId: -1,
    sourceElement: null as HTMLElement | null,
    startX: 0,
    startY: 0
  });
  const state = stateRef.current;

  function stop(event: PointerEvent<HTMLElement>, shouldDrop: boolean) {
    if (state.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    state.pointerId = -1;

    if (state.dragging && shouldDrop && controller.dropAt(event.clientX, event.clientY)) {
      onDropAccepted?.();
    } else if (state.dragging) {
      controller.cancelDrag();
    }

    state.dragging = false;
    state.sourceElement = null;
  }

  return {
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      stop(event, false);
    },
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (disabled || event.button !== 0) {
        return;
      }

      if (
        event.target instanceof HTMLElement &&
        event.target.closest("button, input, select, textarea, a")
      ) {
        return;
      }

      state.dragging = false;
      state.pointerId = event.pointerId;
      state.sourceElement = event.currentTarget;
      state.startX = event.clientX;
      state.startY = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (state.pointerId !== event.pointerId || !state.sourceElement) {
        return;
      }

      if (!state.dragging) {
        const distance = Math.max(
          Math.abs(event.clientX - state.startX),
          Math.abs(event.clientY - state.startY)
        );

        if (distance < DRAG_THRESHOLD) {
          return;
        }

        const item = getItem();

        if (!item) {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }

          state.pointerId = -1;
          state.sourceElement = null;
          return;
        }

        state.dragging = true;
        controller.beginDrag(item, state.sourceElement, sourceType);
      }

      controller.moveDrag(event.clientX, event.clientY);
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      stop(event, true);
    }
  };
}

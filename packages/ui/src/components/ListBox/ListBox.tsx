import {
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import {
  flattenListBoxData,
  getInitialActiveId,
  getListBoxItemChecked
} from "./internals/helpers";
import { ListBoxGroupView } from "./internals/ListBoxGroupView";
import { ListBoxGroup, ListBoxItem } from "./internals/types";
import {
  NuDragDropContext,
  NuDragDropItem,
  NuDragDropProvider,
  NuDropResult,
  useNuDropTarget
} from "../DragDrop";

export type {
  ListBoxCategory,
  ListBoxGroup,
  ListBoxItem,
  ListBoxLabel
} from "./internals/types";

export type ListBoxHandle = {
  activateItem: (itemId: string) => void;
  focus: () => void;
  getActiveItemId: () => string | null;
  scrollToItem: (itemId: string) => void;
  toggleItemCheck: (itemId: string) => void;
};

export type ListBoxProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onDrop" | "onSelect"
> & {
  /** Decides whether this list can receive a shared drag item. */
  acceptsDrop?: (item: NuDragDropItem) => boolean;
  data: ListBoxGroup[];
  checkedIds?: string[];
  /** Returns the shared drag item for a row, or false to keep it static. */
  getDragItem?: (
    item: ListBoxItem,
    group: ListBoxGroup
  ) => NuDragDropItem | false;
  /** Renders a compact preview for an item dragged from this list. */
  renderDragPreview?: (item: ListBoxItem, group: ListBoxGroup) => ReactNode;
  onPopupMenu?: (
    event: MouseEvent<HTMLDivElement>,
    item: ListBoxItem,
    group: ListBoxGroup
  ) => void;
  emptyText?: string;
  onItemCheckChange?: (
    item: ListBoxItem,
    group: ListBoxGroup,
    checked: boolean
  ) => void;
  onItemDoubleClick?: (item: ListBoxItem, group: ListBoxGroup) => void;
  /** Called after this list row was moved to a different shared drop target. */
  onItemDragOut?: (item: ListBoxItem, group: ListBoxGroup) => void;
  rightCheckBox?: boolean;
  selectedId?: string;
  uncheckedShape?: "box" | "none";
  onItemSelect?: (item: ListBoxItem, group: ListBoxGroup) => void;
  /** Receives a shared drag item. Return false to reject it. */
  onDrop?: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | NuDropResult | void;
};

function ListBoxInner(
  {
    acceptsDrop,
    className,
    data,
    checkedIds,
    emptyText = "No items",
    getDragItem,
    onPopupMenu,
    onItemCheckChange,
    onItemDoubleClick,
    onItemDragOut,
    onItemSelect,
    onDrop,
    renderDragPreview,
    rightCheckBox = false,
    selectedId,
    uncheckedShape = "box",
    ...props
  }: ListBoxProps,
  ref: ForwardedRef<ListBoxHandle>
) {
  const hasItems = data.some((group) => group.items.length > 0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const listboxId = useId();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const flattenedItems = useMemo(
    () => flattenListBoxData(data, listboxId),
    [data, listboxId]
  );
  const selectableItems = useMemo(
    () => flattenedItems.filter(({ item }) => !item.disabled),
    [flattenedItems]
  );
  const [activeId, setActiveId] = useState<string | null>(() =>
    getInitialActiveId(selectableItems, selectedId)
  );
  const dropTargetOptions = useMemo(
    () =>
      onDrop ? { accepts: acceptsDrop, onDrop, type: "listbox" } : undefined,
    [acceptsDrop, onDrop]
  );

  useNuDropTarget(rootElement, dropTargetOptions);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    setRootElement(node);
  }, []);
  const resolvedActiveId =
    activeId && selectableItems.some((entry) => entry.itemId === activeId)
      ? activeId
      : getInitialActiveId(selectableItems, selectedId);

  useEffect(() => {
    if (!resolvedActiveId) {
      return;
    }

    itemRefs.current[resolvedActiveId]?.scrollIntoView({
      block: "nearest"
    });
  }, [resolvedActiveId]);

  const registerItemRef = useCallback(
    (itemId: string, node: HTMLDivElement | null) => {
      itemRefs.current[itemId] = node;
    },
    []
  );

  const activateItem = useCallback(
    (item: ListBoxItem, group: ListBoxGroup, itemId: string) => {
      setActiveId(itemId);
      onItemSelect?.(item, group);
    },
    [onItemSelect]
  );

  const activateResolvedItem = useCallback(
    (itemId: string | null) => {
      if (!itemId) {
        return;
      }

      const nextEntry = selectableItems.find(
        (entry) => entry.itemId === itemId
      );

      if (nextEntry) {
        activateItem(nextEntry.item, nextEntry.group, nextEntry.itemId);
      }
    },
    [activateItem, selectableItems]
  );

  const handleItemPopupMenu = useCallback(
    (
      event: MouseEvent<HTMLDivElement>,
      item: ListBoxItem,
      group: ListBoxGroup,
      itemId: string
    ) => {
      if (item.disabled || !onPopupMenu) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      activateItem(item, group, itemId);
      onPopupMenu(event, item, group);
    },
    [activateItem, onPopupMenu]
  );

  function moveActive(direction: 1 | -1) {
    if (selectableItems.length === 0) {
      return;
    }

    const currentIndex = selectableItems.findIndex(
      (entry) => entry.itemId === resolvedActiveId
    );
    const fallbackIndex = direction > 0 ? 0 : selectableItems.length - 1;
    const nextIndex =
      currentIndex === -1
        ? fallbackIndex
        : Math.max(
            0,
            Math.min(selectableItems.length - 1, currentIndex + direction)
          );

    activateResolvedItem(selectableItems[nextIndex]?.itemId ?? null);
  }

  function activateEdge(edge: "start" | "end") {
    if (selectableItems.length === 0) {
      return;
    }

    activateResolvedItem(
      edge === "start"
        ? (selectableItems[0]?.itemId ?? null)
        : (selectableItems[selectableItems.length - 1]?.itemId ?? null)
    );
  }

  function commitActiveSelection() {
    activateResolvedItem(resolvedActiveId);
  }

  function isItemChecked(item: ListBoxItem) {
    return getListBoxItemChecked(item, checkedIds);
  }

  const toggleItemCheck = useCallback(
    (itemId: string) => {
      const activeEntry = flattenedItems.find(
        (entry) => entry.itemId === itemId
      );

      if (
        !activeEntry ||
        activeEntry.item.disabled ||
        !activeEntry.item.checkable
      ) {
        return;
      }

      onItemCheckChange?.(
        activeEntry.item,
        activeEntry.group,
        !getListBoxItemChecked(activeEntry.item, checkedIds)
      );
    },
    [flattenedItems, checkedIds, onItemCheckChange]
  );

  useImperativeHandle(
    ref,
    () => ({
      activateItem(itemId: string) {
        activateResolvedItem(itemId);
      },
      focus() {
        rootRef.current?.focus();
      },
      getActiveItemId() {
        return resolvedActiveId;
      },
      scrollToItem(itemId: string) {
        itemRefs.current[itemId]?.scrollIntoView({
          block: "nearest"
        });
      },
      toggleItemCheck(itemId: string) {
        toggleItemCheck(itemId);
      }
    }),
    [activateResolvedItem, resolvedActiveId, toggleItemCheck]
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        activateEdge("start");
        break;
      case "End":
        event.preventDefault();
        activateEdge("end");
        break;
      case "Enter":
        event.preventDefault();
        commitActiveSelection();
        break;
      case " ":
        event.preventDefault();
        if (resolvedActiveId) {
          commitActiveSelection();
          toggleItemCheck(resolvedActiveId);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      aria-activedescendant={resolvedActiveId ?? undefined}
      className={["nu-listbox", className].filter(Boolean).join(" ")}
      data-right-checkbox={rightCheckBox || undefined}
      onKeyDown={handleKeyDown}
      ref={setRootRef}
      role="listbox"
      tabIndex={0}
    >
      {hasItems ? (
        data.map((group, groupIndex) => (
          <ListBoxGroupView
            group={group}
            groupIndex={groupIndex}
            isItemChecked={isItemChecked}
            getDragItem={getDragItem}
            key={`${group.category?.text ?? "group"}-${groupIndex}`}
            listboxId={listboxId}
            onActivateItem={activateItem}
            onDoubleClickItem={onItemDoubleClick}
            onItemDragOut={onItemDragOut}
            onPopupMenuItem={handleItemPopupMenu}
            onToggleItemCheck={toggleItemCheck}
            renderDragPreview={renderDragPreview}
            registerItemRef={registerItemRef}
            resolvedActiveId={resolvedActiveId}
            rightCheckBox={rightCheckBox}
            selectedId={selectedId}
            uncheckedShape={uncheckedShape}
          />
        ))
      ) : (
        <div className="nu-listbox__empty">{emptyText}</div>
      )}
    </div>
  );
}

const ListBoxContent = forwardRef(ListBoxInner);

function ListBoxWithDragDrop(
  props: ListBoxProps,
  ref: ForwardedRef<ListBoxHandle>
) {
  return (
    <NuDragDropProvider>
      <ListBoxContent {...props} ref={ref} />
    </NuDragDropProvider>
  );
}

export const ListBox = forwardRef(ListBoxWithDragDrop) as (
  props: ListBoxProps & RefAttributes<ListBoxHandle>
) => ReturnType<typeof ListBoxInner>;

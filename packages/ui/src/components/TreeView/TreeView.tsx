import {
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
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
  collectExpandedTreeIds,
  collectVisibleTreeItems,
  findSelectedTreeItemId,
  findTreeItemById
} from "./internals/helpers";
import { TreeViewItem } from "./internals/TreeViewItem";
import { TreeItem } from "./internals/types";

export type { TreeItem } from "./internals/types";

export type TreeViewHandle = {
  activateItem: (itemId: string) => void;
  collapseItem: (itemId: string) => void;
  expandItem: (itemId: string) => void;
  focus: () => void;
  getActiveItemId: () => string | null;
  scrollToItem: (itemId: string) => void;
  toggleItemCheck: (itemId: string) => void;
};

export type TreeViewProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  data: TreeItem[];
  defaultExpandedIds?: string[];
  emptyText?: string;
  expandedIds?: string[];
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  onItemCheckChange?: (item: TreeItem, checked: boolean) => void;
  onItemDoubleClick?: (item: TreeItem) => void;
  onItemSelect?: (item: TreeItem) => void;
  selectedId?: string;
  uncheckedShape?: "box" | "none";
};

function TreeViewInner(
  {
    className,
    data,
    defaultExpandedIds,
    emptyText = "No items",
    expandedIds,
    onExpandedIdsChange,
    onItemCheckChange,
    onItemDoubleClick,
    onItemSelect,
    selectedId,
    uncheckedShape = "box",
    ...props
  }: TreeViewProps,
  ref: ForwardedRef<TreeViewHandle>
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const treeId = useId();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isExpandedControlled = expandedIds !== undefined;
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<
    string[]
  >(() => {
    const expandedFromData = collectExpandedTreeIds(data);

    if (!defaultExpandedIds?.length) {
      return expandedFromData;
    }

    return Array.from(new Set([...expandedFromData, ...defaultExpandedIds]));
  });
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState<
    string | null
  >(null);
  const resolvedExpandedIds = isExpandedControlled
    ? expandedIds
    : uncontrolledExpandedIds;
  const expandedIdSet = useMemo(
    () => new Set(resolvedExpandedIds),
    [resolvedExpandedIds]
  );
  const visibleItems = useMemo(
    () => collectVisibleTreeItems(data, expandedIdSet),
    [data, expandedIdSet]
  );
  const selectableItems = useMemo(
    () => visibleItems.filter(({ item }) => !item.disabled),
    [visibleItems]
  );
  const derivedSelectedId =
    selectedId ??
    uncontrolledSelectedId ??
    findSelectedTreeItemId(data) ??
    selectableItems[0]?.itemId ??
    null;
  const resolvedSelectedId =
    derivedSelectedId &&
    selectableItems.some((entry) => entry.itemId === derivedSelectedId)
      ? derivedSelectedId
      : (selectableItems[0]?.itemId ?? null);
  const [activeId, setActiveId] = useState<string | null>(resolvedSelectedId);
  const resolvedActiveId =
    activeId && selectableItems.some((entry) => entry.itemId === activeId)
      ? activeId
      : resolvedSelectedId;

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

  const setExpandedState = useCallback(
    (item: TreeItem, nextExpanded: boolean) => {
      const nextExpandedIds = nextExpanded
        ? Array.from(new Set([...resolvedExpandedIds, item.id]))
        : resolvedExpandedIds.filter((expandedId) => expandedId !== item.id);

      if (!isExpandedControlled) {
        setUncontrolledExpandedIds(nextExpandedIds);
      }

      onExpandedIdsChange?.(nextExpandedIds);
    },
    [isExpandedControlled, onExpandedIdsChange, resolvedExpandedIds]
  );

  const activateEntry = useCallback(
    (item: TreeItem, itemId: string) => {
      if (item.disabled) {
        return;
      }

      setActiveId(itemId);

      if (selectedId === undefined) {
        setUncontrolledSelectedId(itemId);
      }

      onItemSelect?.(item);
    },
    [onItemSelect, selectedId]
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
        activateEntry(nextEntry.item, nextEntry.itemId);
      }
    },
    [activateEntry, selectableItems]
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

  function handleArrowLeft() {
    if (!resolvedActiveId) {
      return;
    }

    const activeEntry = visibleItems.find(
      (entry) => entry.itemId === resolvedActiveId
    );

    if (!activeEntry) {
      return;
    }

    if (activeEntry.hasChildren && expandedIdSet.has(activeEntry.itemId)) {
      setExpandedState(activeEntry.item, false);
      return;
    }

    if (!activeEntry.parentId) {
      return;
    }

    activateResolvedItem(activeEntry.parentId);
  }

  function handleArrowRight() {
    if (!resolvedActiveId) {
      return;
    }

    const activeEntryIndex = visibleItems.findIndex(
      (entry) => entry.itemId === resolvedActiveId
    );
    const activeEntry = visibleItems[activeEntryIndex];

    if (!activeEntry || !activeEntry.hasChildren) {
      return;
    }

    if (!expandedIdSet.has(activeEntry.itemId)) {
      setExpandedState(activeEntry.item, true);
      return;
    }

    const childEntry = visibleItems
      .slice(activeEntryIndex + 1)
      .find(
        (entry) =>
          entry.parentId === activeEntry.itemId && entry.item.disabled !== true
      );

    activateResolvedItem(childEntry?.itemId ?? null);
  }

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
      case "ArrowLeft":
        event.preventDefault();
        handleArrowLeft();
        break;
      case "ArrowRight":
        event.preventDefault();
        handleArrowRight();
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
        activateResolvedItem(resolvedActiveId);
        break;
      case " ": {
        event.preventDefault();

        if (!resolvedActiveId) {
          return;
        }

        const activeItem = findTreeItemById(data, resolvedActiveId);

        if (!activeItem || activeItem.disabled) {
          return;
        }

        activateResolvedItem(resolvedActiveId);

        if (activeItem.checked !== undefined) {
          onItemCheckChange?.(activeItem, !activeItem.checked);
        } else if (activeItem.children?.length) {
          setExpandedState(activeItem, !expandedIdSet.has(activeItem.id));
        }
        break;
      }
      default:
        break;
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      activateItem(itemId: string) {
        activateResolvedItem(itemId);
      },
      collapseItem(itemId: string) {
        const item = findTreeItemById(data, itemId);

        if (item?.children?.length) {
          setExpandedState(item, false);
        }
      },
      expandItem(itemId: string) {
        const item = findTreeItemById(data, itemId);

        if (item?.children?.length) {
          setExpandedState(item, true);
        }
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
        const item = findTreeItemById(data, itemId);

        if (item && item.checked !== undefined && !item.disabled) {
          onItemCheckChange?.(item, !item.checked);
        }
      }
    }),
    [
      activateResolvedItem,
      data,
      onItemCheckChange,
      resolvedActiveId,
      setExpandedState
    ]
  );

  return (
    <div
      {...props}
      aria-activedescendant={
        resolvedActiveId ? `${treeId}-${resolvedActiveId}` : undefined
      }
      className={["nu-tree-view", className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
      ref={rootRef}
      role="tree"
      tabIndex={0}
    >
      {visibleItems.length > 0 ? (
        data.map((item, index) => (
          <TreeViewItem
            depth={0}
            expandedIdSet={expandedIdSet}
            guideMask={[]}
            guideOffsets={[]}
            hasNextSibling={index < data.length - 1}
            item={item}
            key={item.id}
            originOffset={0}
            onActivateItem={activateEntry}
            onDoubleClickItem={onItemDoubleClick}
            onToggleItemCheck={onItemCheckChange}
            onToggleItemExpanded={setExpandedState}
            registerItemRef={registerItemRef}
            resolvedSelectedId={resolvedSelectedId}
            treeId={treeId}
            uncheckedShape={uncheckedShape}
          />
        ))
      ) : (
        <div className="nu-tree-view__empty">{emptyText}</div>
      )}
    </div>
  );
}

export const TreeView = forwardRef(TreeViewInner) as (
  props: TreeViewProps & RefAttributes<TreeViewHandle>
) => ReturnType<typeof TreeViewInner>;

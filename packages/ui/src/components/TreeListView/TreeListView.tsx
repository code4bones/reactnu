import {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { renderMnemonicText } from "../../utils/renderMnemonicText";
import {
  collectExpandedTreeListIds,
  collectVisibleTreeListItems,
  findSelectedTreeListItemId,
  findTreeListItemById,
  getTreeListHeaderAlign,
  getTreeListTemplateColumns,
  getTreeListTreeColumnId
} from "./internals/helpers";
import { TreeListViewRow } from "./internals/TreeListViewRow";
import {
  TreeListColumn,
  TreeListCellContext,
  TreeListGetCellContent,
  TreeListItemBase
} from "./internals/types";
import {
  NuDragDropContext,
  NuDragDropItem,
  useNuDropTarget
} from "../DragDrop";

export type {
  TreeListCellContext,
  TreeListColumn,
  TreeListGetCellContent,
  TreeListItemBase
} from "./internals/types";

export type TreeListViewHandle = {
  activateItem: (itemId: string) => void;
  collapseItem: (itemId: string) => void;
  expandItem: (itemId: string) => void;
  focus: () => void;
  getActiveItemId: () => string | null;
  scrollToItem: (itemId: string) => void;
  toggleItemCheck: (itemId: string) => void;
};

export type TreeListViewProps<T extends TreeListItemBase<T>> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onDrop" | "onSelect"
> & {
  /** Decides whether this tree can receive a shared drag item. */
  acceptsDrop?: (item: NuDragDropItem) => boolean;
  activeItemId?: string;
  checkedIds?: string[];
  /** Persists user-resized column widths in `localStorage` under `reactnu.<key>`. */
  columnStoreKey?: string;
  onPopupMenu?: (
    event: MouseEvent<HTMLDivElement>,
    item: T,
    context: TreeListCellContext<T>
  ) => void;
  columns: TreeListColumn<T>[];
  data: T[];
  dataVersion?: number;
  defaultActiveItemId?: string;
  defaultExpandedIds?: string[];
  emptyText?: string;
  expandedIds?: string[];
  /** Returns the shared drag item for a row, or false to keep it static. */
  getDragItem?: (
    item: T,
    context: TreeListCellContext<T>
  ) => NuDragDropItem | false;
  getCellContent?: TreeListGetCellContent<T>;
  onActiveItemChange?: (item: T) => void;
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  onItemCheckChange?: (item: T, checked: boolean) => void;
  onItemDoubleClick?: (item: T) => void;
  /** Called after this tree row was accepted by a different shared drop target. */
  onItemDragOut?: (item: T, context: TreeListCellContext<T>) => void;
  onItemSelect?: (item: T) => void;
  /** Receives a shared drag item. Return false to reject it. */
  onDrop?: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | void;
  selectedId?: string;
  uncheckedShape?: "box" | "none";
};

function getColumnStorageKey(columnStoreKey: string | undefined) {
  const normalizedKey = columnStoreKey?.trim();

  return normalizedKey ? `reactnu.${normalizedKey}` : null;
}

function readStoredColumnWidths<T extends TreeListItemBase<T>>(
  storageKey: string | null,
  columns: TreeListColumn<T>[]
) {
  if (!storageKey || typeof window === "undefined") {
    return {} as Record<string, number>;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return {} as Record<string, number>;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {} as Record<string, number>;
    }

    return Object.fromEntries(
      columns.flatMap((column) => {
        const width = (parsedValue as Record<string, unknown>)[column.id];

        if (typeof width !== "number" || !Number.isFinite(width)) {
          return [];
        }

        return [[column.id, Math.max(width, column.minWidth ?? 0)]];
      })
    ) as Record<string, number>;
  } catch {
    return {} as Record<string, number>;
  }
}

function TreeListViewInner<T extends TreeListItemBase<T>>(
  {
    acceptsDrop,
    activeItemId: activeItemIdProp,
    checkedIds,
    className,
    columnStoreKey,
    columns,
    onPopupMenu,
    data,
    dataVersion,
    defaultActiveItemId,
    defaultExpandedIds,
    emptyText = "No items",
    expandedIds,
    getDragItem,
    getCellContent,
    onActiveItemChange,
    onExpandedIdsChange,
    onItemCheckChange,
    onItemDoubleClick,
    onItemDragOut,
    onItemSelect,
    onDrop,
    selectedId,
    uncheckedShape = "box",
    ...props
  }: TreeListViewProps<T>,
  ref: ForwardedRef<TreeListViewHandle>
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const treeId = useId();
  const storageKey = getColumnStorageKey(columnStoreKey);
  const loadedStorageKeyRef = useRef(storageKey);
  const shouldPersistColumnWidthsRef = useRef(false);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resizeFrameRef = useRef<number | null>(null);
  const resizeStateRef = useRef<{
    columnId: string;
    nextWidth: number;
    startWidth: number;
    startX: number;
  } | null>(null);
  const isExpandedControlled = expandedIds !== undefined;
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<
    string[]
  >(() => {
    const expandedFromData = collectExpandedTreeListIds(data);

    if (!defaultExpandedIds?.length) {
      return expandedFromData;
    }

    return Array.from(new Set([...expandedFromData, ...defaultExpandedIds]));
  });
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState<
    string | null
  >(null);
  const [autoColumnWidths, setAutoColumnWidths] = useState<
    Record<string, number>
  >({});
  const [userColumnWidths, setUserColumnWidths] = useState<
    Record<string, number>
  >(() => readStoredColumnWidths(storageKey, columns));
  const isActiveControlled = activeItemIdProp !== undefined;
  const resolvedExpandedIds = isExpandedControlled
    ? expandedIds
    : uncontrolledExpandedIds;
  const expandedIdSet = useMemo(
    () => new Set(resolvedExpandedIds),
    [resolvedExpandedIds]
  );
  const visibleItems = useMemo(
    () => collectVisibleTreeListItems(data, expandedIdSet),
    [data, expandedIdSet]
  );
  const selectableItems = useMemo(
    () => visibleItems.filter(({ item }) => !item.disabled),
    [visibleItems]
  );
  const derivedSelectedId =
    selectedId ??
    uncontrolledSelectedId ??
    findSelectedTreeListItemId(data) ??
    selectableItems[0]?.itemId ??
    null;
  const resolvedSelectedId =
    derivedSelectedId &&
    selectableItems.some((entry) => entry.itemId === derivedSelectedId)
      ? derivedSelectedId
      : (selectableItems[0]?.itemId ?? null);
  const [uncontrolledActiveItemId, setUncontrolledActiveItemId] = useState<
    string | null
  >(() => defaultActiveItemId ?? resolvedSelectedId);
  const activeItemId =
    activeItemIdProp !== undefined
      ? activeItemIdProp
      : uncontrolledActiveItemId;
  const resolvedActiveItemId =
    activeItemId &&
    selectableItems.some((entry) => entry.itemId === activeItemId)
      ? activeItemId
      : resolvedSelectedId;
  const minColumnWidthById = useMemo(
    () =>
      Object.fromEntries(
        columns.map(
          (column) => [column.id, column.minWidth ?? 0] as const
        )
      ) as Record<string, number>,
    [columns]
  );
  const templateColumns = useMemo(
    () =>
      getTreeListTemplateColumns(columns, {
        autoColumnWidths,
        userColumnWidths
      }),
    [autoColumnWidths, columns, userColumnWidths]
  );
  const treeColumnId = useMemo(
    () => getTreeListTreeColumnId(columns),
    [columns]
  );
  const rowIndexMap = useMemo(
    () =>
      new Map(
        visibleItems.map((entry, index) => [entry.itemId, index] as const)
      ),
    [visibleItems]
  );
  const dropTargetOptions = useMemo(
    () =>
      onDrop
        ? { accepts: acceptsDrop, onDrop, type: "tree-list" }
        : undefined,
    [acceptsDrop, onDrop]
  );

  useNuDropTarget(rootElement, dropTargetOptions);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    setRootElement(node);
  }, []);

  useEffect(() => {
    if (!resolvedActiveItemId) {
      return;
    }

    itemRefs.current[resolvedActiveItemId]?.scrollIntoView({
      block: "nearest"
    });
  }, [resolvedActiveItemId]);

  useEffect(() => {
    if (loadedStorageKeyRef.current === storageKey) {
      return;
    }

    loadedStorageKeyRef.current = storageKey;
    shouldPersistColumnWidthsRef.current = false;
    setUserColumnWidths(readStoredColumnWidths(storageKey, columns));
  }, [columns, storageKey]);

  useEffect(() => {
    if (!shouldPersistColumnWidthsRef.current) {
      return;
    }

    shouldPersistColumnWidthsRef.current = false;

    if (!storageKey || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(userColumnWidths));
    } catch {
      // Persistence is optional; unavailable browser storage must not break resizing.
    }
  }, [storageKey, userColumnWidths]);

  const registerItemRef = useCallback(
    (itemId: string, node: HTMLDivElement | null) => {
      itemRefs.current[itemId] = node;
    },
    []
  );

  const resolveCellContent = useCallback(
    (...args: Parameters<TreeListGetCellContent<T>>) =>
      getCellContent?.(...args),
    [getCellContent]
  );

  const handleItemDoubleClick = useCallback(
    (item: T) => onItemDoubleClick?.(item),
    [onItemDoubleClick]
  );

  useLayoutEffect(() => {
    const rootNode = rootRef.current;

    if (!rootNode) {
      return;
    }

    setAutoColumnWidths((currentWidths) => {
      let didChange = false;
      const nextWidths = { ...currentWidths };

      columns.forEach((column) => {
        if (
          currentWidths[column.id] !== undefined ||
          userColumnWidths[column.id] !== undefined ||
          column.width !== undefined
        ) {
          return;
        }

        const columnNodes = Array.from(
          rootNode.querySelectorAll<HTMLElement>(
            `[data-column-id="${column.id}"]`
          )
        );

        if (columnNodes.length === 0) {
          return;
        }

        const measuredWidth =
          Math.max(
            ...columnNodes.map((node) => Math.ceil(node.scrollWidth + 10)),
            column.minWidth ?? 0
          ) || 0;

        if (nextWidths[column.id] !== measuredWidth) {
          nextWidths[column.id] = measuredWidth;
          didChange = true;
        }
      });

      return didChange ? nextWidths : currentWidths;
    });
  }, [columns, userColumnWidths, visibleItems]);

  useEffect(() => {
    return () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  const setExpandedState = useCallback(
    (item: T, nextExpanded: boolean) => {
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

  const updateActiveItem = useCallback(
    (item: T) => {
      if (!isActiveControlled) {
        setUncontrolledActiveItemId(item.id);
      }

      onActiveItemChange?.(item);
    },
    [isActiveControlled, onActiveItemChange]
  );

  const activateEntry = useCallback(
    (item: T, itemId: string) => {
      if (item.disabled) {
        return;
      }

      updateActiveItem(item);

      if (selectedId === undefined) {
        setUncontrolledSelectedId(itemId);
      }

      onItemSelect?.(item);
    },
    [onItemSelect, selectedId, updateActiveItem]
  );

  const handleItemPopupMenu = useCallback(
    (
      event: MouseEvent<HTMLDivElement>,
      item: T,
      context: TreeListCellContext<T>
    ) => {
      if (item.disabled || !onPopupMenu) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      activateEntry(item, item.id);
      onPopupMenu(event, item, context);
    },
    [activateEntry, onPopupMenu]
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

  const handleItemCheckChange = useCallback(
    (item: T, checked: boolean) => {
      onItemCheckChange?.(item, checked);
    },
    [onItemCheckChange]
  );

  function moveActive(direction: 1 | -1) {
    if (selectableItems.length === 0) {
      return;
    }

    const currentIndex = selectableItems.findIndex(
      (entry) => entry.itemId === resolvedActiveItemId
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
    if (!resolvedActiveItemId) {
      return;
    }

    const activeEntry = visibleItems.find(
      (entry) => entry.itemId === resolvedActiveItemId
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
    if (!resolvedActiveItemId) {
      return;
    }

    const activeEntryIndex = visibleItems.findIndex(
      (entry) => entry.itemId === resolvedActiveItemId
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

  function isItemChecked(item: T) {
    return checkedIds ? checkedIds.includes(item.id) : item.checked === true;
  }

  const toggleItemCheck = useCallback(
    (itemId: string) => {
      const item = findTreeListItemById(data, itemId);

      if (
        !item ||
        item.disabled ||
        (item.checked === undefined && checkedIds === undefined)
      ) {
        return;
      }

      const checked = checkedIds ? checkedIds.includes(item.id) : item.checked;
      onItemCheckChange?.(item, !checked);
    },
    [checkedIds, data, onItemCheckChange]
  );

  useImperativeHandle(
    ref,
    () => ({
      activateItem(itemId: string) {
        activateResolvedItem(itemId);
      },
      collapseItem(itemId: string) {
        const item = findTreeListItemById(data, itemId);

        if (item?.children?.length) {
          setExpandedState(item, false);
        }
      },
      expandItem(itemId: string) {
        const item = findTreeListItemById(data, itemId);

        if (item?.children?.length) {
          setExpandedState(item, true);
        }
      },
      focus() {
        rootRef.current?.focus();
      },
      getActiveItemId() {
        return resolvedActiveItemId;
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
    [
      activateResolvedItem,
      data,
      resolvedActiveItemId,
      setExpandedState,
      toggleItemCheck
    ]
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
        activateResolvedItem(resolvedActiveItemId);
        break;
      case " ": {
        event.preventDefault();

        if (!resolvedActiveItemId) {
          return;
        }

        const activeItem = findTreeListItemById(data, resolvedActiveItemId);

        if (!activeItem || activeItem.disabled) {
          return;
        }

        activateResolvedItem(resolvedActiveItemId);

        if (activeItem.checked !== undefined || checkedIds !== undefined) {
          onItemCheckChange?.(activeItem, !isItemChecked(activeItem));
        } else if (activeItem.children?.length) {
          setExpandedState(activeItem, !expandedIdSet.has(activeItem.id));
        }
        break;
      }
      default:
        break;
    }
  }

  function flushResizedColumn() {
    const resizeState = resizeStateRef.current;

    if (!resizeState) {
      return;
    }

    setUserColumnWidths((currentWidths) =>
      {
        if (currentWidths[resizeState.columnId] === resizeState.nextWidth) {
          return currentWidths;
        }

        shouldPersistColumnWidthsRef.current = true;

        return {
          ...currentWidths,
          [resizeState.columnId]: resizeState.nextWidth
        };
      }
    );
  }

  function handleColumnResizeMove(event: PointerEvent) {
    const resizeState = resizeStateRef.current;

    if (!resizeState) {
      return;
    }

    resizeState.nextWidth = Math.max(
      minColumnWidthById[resizeState.columnId] ?? 0,
      Math.round(resizeState.startWidth + (event.clientX - resizeState.startX))
    );

    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = window.requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      flushResizedColumn();
    });
  }

  function handleColumnResizeEnd() {
    if (resizeFrameRef.current !== null) {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
    }

    flushResizedColumn();
    resizeStateRef.current = null;
    window.removeEventListener("pointermove", handleColumnResizeMove);
    window.removeEventListener("pointerup", handleColumnResizeEnd);
  }

  function handleColumnResizeStart(
    columnId: string,
    event: ReactPointerEvent<HTMLButtonElement>
  ) {
    const headerCell = event.currentTarget
      .parentElement as HTMLSpanElement | null;

    if (!headerCell) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    resizeStateRef.current = {
      columnId,
      nextWidth: Math.round(headerCell.getBoundingClientRect().width),
      startWidth: Math.round(headerCell.getBoundingClientRect().width),
      startX: event.clientX
    };

    window.addEventListener("pointermove", handleColumnResizeMove);
    window.addEventListener("pointerup", handleColumnResizeEnd);
  }

  return (
    <div
      {...props}
      aria-activedescendant={
        resolvedActiveItemId ? `${treeId}-${resolvedActiveItemId}` : undefined
      }
      className={["nu-tree-list-view", className].filter(Boolean).join(" ")}
      data-version={dataVersion}
      onKeyDown={handleKeyDown}
      ref={setRootRef}
      role="treegrid"
      tabIndex={0}
    >
      <div
        className="nu-tree-list-view__header"
        role="row"
        style={
          {
            "--nu-tree-list-view-columns": templateColumns
          } as CSSProperties
        }
      >
        {columns.map((column, columnIndex) => (
          <span
            className={[
              "nu-tree-list-view__header-cell",
              `nu-tree-list-view__header-cell--${getTreeListHeaderAlign(column, columnIndex)}`,
              column.className
            ]
              .filter(Boolean)
              .join(" ")}
            data-column-id={column.id}
            key={column.id}
            role="columnheader"
          >
            <span className="nu-tree-list-view__header-label">
              {renderMnemonicText(column.title)}
            </span>
            {column.resizable !== false ? (
              <button
                aria-label={`Resize ${column.title} column`}
                className="nu-tree-list-view__column-resizer"
                onPointerDown={(event) =>
                  handleColumnResizeStart(column.id, event)
                }
                tabIndex={-1}
                type="button"
              />
            ) : null}
          </span>
        ))}
      </div>
      <div className="nu-tree-list-view__body">
        {visibleItems.length > 0 ? (
          data.map((item, index) => (
            <TreeListViewRow
              activeItemId={resolvedActiveItemId}
              checkedIds={checkedIds}
              columns={columns}
              depth={0}
              expandedIdSet={expandedIdSet}
              getCellContent={getCellContent ? resolveCellContent : undefined}
              getDragItem={getDragItem}
              guideMask={[]}
              guideOffsets={[]}
              hasNextSibling={index < data.length - 1}
              item={item}
              key={item.id}
              onActivateItem={activateEntry}
              onDoubleClickItem={
                onItemDoubleClick ? handleItemDoubleClick : undefined
              }
              onItemDragOut={onItemDragOut}
              onPopupMenuItem={handleItemPopupMenu}
              onToggleItemCheck={handleItemCheckChange}
              onToggleItemExpanded={setExpandedState}
              originOffset={0}
              registerItemRef={registerItemRef}
              rowIndexMap={rowIndexMap}
              selectedItemId={resolvedSelectedId}
              templateColumns={templateColumns}
              treeColumnId={treeColumnId}
              treeId={treeId}
              uncheckedShape={uncheckedShape}
            />
          ))
        ) : (
          <div className="nu-tree-list-view__empty">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

export const TreeListView = forwardRef(TreeListViewInner) as <
  T extends TreeListItemBase<T>
>(
  props: TreeListViewProps<T> & RefAttributes<TreeListViewHandle>
) => ReturnType<typeof TreeListViewInner>;

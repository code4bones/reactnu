import {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
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
  TreeListGetCellContent,
  TreeListItemBase
} from "./internals/types";

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
  "onSelect"
> & {
  activeItemId?: string;
  checkedIds?: string[];
  columns: TreeListColumn<T>[];
  data: T[];
  dataVersion?: number;
  defaultActiveItemId?: string;
  defaultExpandedIds?: string[];
  emptyText?: string;
  expandedIds?: string[];
  getCellContent?: TreeListGetCellContent<T>;
  onActiveItemChange?: (item: T) => void;
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  onItemCheckChange?: (item: T, checked: boolean) => void;
  onItemDoubleClick?: (item: T) => void;
  onItemSelect?: (item: T) => void;
  selectedId?: string;
  uncheckedShape?: "box" | "none";
};

function areTreeListColumnsEqual<T extends TreeListItemBase<T>>(
  previousColumns: TreeListColumn<T>[],
  nextColumns: TreeListColumn<T>[]
) {
  if (previousColumns === nextColumns) {
    return true;
  }

  if (previousColumns.length !== nextColumns.length) {
    return false;
  }

  return previousColumns.every((previousColumn, index) => {
    const nextColumn = nextColumns[index];

    return (
      previousColumn.align === nextColumn.align &&
      previousColumn.className === nextColumn.className &&
      previousColumn.field === nextColumn.field &&
      previousColumn.headerAlign === nextColumn.headerAlign &&
      previousColumn.id === nextColumn.id &&
      previousColumn.minWidth === nextColumn.minWidth &&
      previousColumn.renderCell === nextColumn.renderCell &&
      previousColumn.resizable === nextColumn.resizable &&
      previousColumn.title === nextColumn.title &&
      previousColumn.tree === nextColumn.tree &&
      previousColumn.width === nextColumn.width
    );
  });
}

function TreeListViewInner<T extends TreeListItemBase<T>>(
  {
    activeItemId: activeItemIdProp,
    checkedIds,
    className,
    columns,
    data,
    dataVersion,
    defaultActiveItemId,
    defaultExpandedIds,
    emptyText = "No items",
    expandedIds,
    getCellContent,
    onActiveItemChange,
    onExpandedIdsChange,
    onItemCheckChange,
    onItemDoubleClick,
    onItemSelect,
    selectedId,
    uncheckedShape = "box",
    ...props
  }: TreeListViewProps<T>,
  ref: ForwardedRef<TreeListViewHandle>
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const treeId = useId();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const columnsRef = useRef(columns);
  const getCellContentRef = useRef(getCellContent);
  const onItemDoubleClickRef = useRef(onItemDoubleClick);
  const resizeFrameRef = useRef<number | null>(null);
  const resizeStateRef = useRef<{
    columnId: string;
    nextWidth: number;
    startWidth: number;
    startX: number;
  } | null>(null);
  if (!areTreeListColumnsEqual(columnsRef.current, columns)) {
    columnsRef.current = columns;
  }

  getCellContentRef.current = getCellContent;
  onItemDoubleClickRef.current = onItemDoubleClick;

  const resolvedColumns = columnsRef.current;
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
  >({});
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
        resolvedColumns.map(
          (column) => [column.id, column.minWidth ?? 0] as const
        )
      ) as Record<string, number>,
    [resolvedColumns]
  );
  const templateColumns = useMemo(
    () =>
      getTreeListTemplateColumns(resolvedColumns, {
        autoColumnWidths,
        userColumnWidths
      }),
    [autoColumnWidths, resolvedColumns, userColumnWidths]
  );
  const treeColumnId = useMemo(
    () => getTreeListTreeColumnId(resolvedColumns),
    [resolvedColumns]
  );
  const rowIndexMap = useMemo(
    () =>
      new Map(
        visibleItems.map((entry, index) => [entry.itemId, index] as const)
      ),
    [visibleItems, dataVersion]
  );

  useEffect(() => {
    if (!resolvedActiveItemId) {
      return;
    }

    itemRefs.current[resolvedActiveItemId]?.scrollIntoView({
      block: "nearest"
    });
  }, [resolvedActiveItemId]);

  const registerItemRef = useCallback(
    (itemId: string, node: HTMLDivElement | null) => {
      itemRefs.current[itemId] = node;
    },
    []
  );

  const resolveCellContent = useCallback(
    (...args: Parameters<TreeListGetCellContent<T>>) =>
      getCellContentRef.current?.(...args),
    []
  );

  const handleItemDoubleClick = useCallback((item: T) => {
    onItemDoubleClickRef.current?.(item);
  }, []);

  useLayoutEffect(() => {
    const rootNode = rootRef.current;

    if (!rootNode) {
      return;
    }

    setAutoColumnWidths((currentWidths) => {
      let didChange = false;
      const nextWidths = { ...currentWidths };

      resolvedColumns.forEach((column) => {
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
  }, [resolvedColumns, userColumnWidths, visibleItems]);

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

  function toggleItemCheck(itemId: string) {
    const item = findTreeListItemById(data, itemId);

    if (
      !item ||
      item.disabled ||
      (item.checked === undefined && checkedIds === undefined)
    ) {
      return;
    }

    onItemCheckChange?.(item, !isItemChecked(item));
  }

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
    [checkedIds, data, resolvedActiveItemId, resolvedExpandedIds]
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
      case " ":
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
      currentWidths[resizeState.columnId] === resizeState.nextWidth
        ? currentWidths
        : {
            ...currentWidths,
            [resizeState.columnId]: resizeState.nextWidth
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
      onKeyDown={handleKeyDown}
      ref={rootRef}
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
        {resolvedColumns.map((column, columnIndex) => (
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
              columns={resolvedColumns}
              depth={0}
              expandedIdSet={expandedIdSet}
              getCellContent={getCellContent ? resolveCellContent : undefined}
              guideMask={[]}
              guideOffsets={[]}
              hasNextSibling={index < data.length - 1}
              item={item}
              key={item.id}
              onActivateItem={activateEntry}
              onDoubleClickItem={
                onItemDoubleClick ? handleItemDoubleClick : undefined
              }
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

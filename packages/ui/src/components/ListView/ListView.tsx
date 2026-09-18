import {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import { renderMnemonicText } from "../../utils/renderMnemonicText";
import {
  getInitialActiveRowId,
  getListViewRowChecked
} from "./internals/helpers";
import { ListViewRow } from "./internals/ListViewRow";
import { ListViewColumn, ListViewRowBase } from "./internals/types";
import {
  NuDragDropContext,
  NuDragDropItem,
  NuDragDropProvider,
  NuDropResult,
  useNuDropTarget
} from "../DragDrop";

export type { ListViewColumn, ListViewRowBase } from "./internals/types";

export type ListViewHandle = {
  activateRow: (rowId: string) => void;
  focus: () => void;
  getActiveRowId: () => string | null;
  scrollToRow: (rowId: string) => void;
  toggleRowCheck: (rowId: string) => void;
};

export type ListViewProps<T extends ListViewRowBase> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  /** Decides whether this list can receive a shared drag item. */
  acceptsDrop?: (item: NuDragDropItem) => boolean;
  activeRowId?: string;
  checkedIds?: string[];
  columns: ListViewColumn<T>[];
  data: T[];
  defaultActiveRowId?: string;
  emptyText?: string;
  /** Returns the shared drag item for a row, or false to keep it static. */
  getDragItem?: (row: T) => NuDragDropItem | false;
  onActiveRowChange?: (row: T) => void;
  onRowCheckChange?: (row: T, checked: boolean) => void;
  onRowDoubleClick?: (row: T) => void;
  /** Called after this list row was accepted by a different shared drop target. */
  onRowDragOut?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  /** Receives a shared drag item. Return false to reject it. */
  onDrop?: (
    item: NuDragDropItem,
    context: NuDragDropContext
  ) => boolean | NuDropResult | void;
  /** Renders a compact preview for a row dragged from this list. */
  renderDragPreview?: (row: T) => ReactNode;
  selectedId?: string;
  showCheckBox?: boolean;
  uncheckedShape?: "box" | "none";
};

function ListViewInner<T extends ListViewRowBase>(
  {
    acceptsDrop,
    activeRowId: activeRowIdProp,
    checkedIds,
    className,
    columns,
    data,
    defaultActiveRowId,
    emptyText = "No rows",
    getDragItem,
    onActiveRowChange,
    onRowCheckChange,
    onRowDoubleClick,
    onRowDragOut,
    onRowSelect,
    onDrop,
    renderDragPreview,
    selectedId,
    showCheckBox = false,
    uncheckedShape = "box",
    ...props
  }: ListViewProps<T>,
  ref: ForwardedRef<ListViewHandle>
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const selectableRows = useMemo(
    () => data.filter((row) => !row.disabled),
    [data]
  );
  const isActiveControlled = activeRowIdProp !== undefined;
  const [uncontrolledActiveRowId, setUncontrolledActiveRowId] = useState<
    string | null
  >(
    () =>
      defaultActiveRowId ?? getInitialActiveRowId(selectableRows, selectedId)
  );
  const activeRowId =
    activeRowIdProp !== undefined ? activeRowIdProp : uncontrolledActiveRowId;
  const resolvedActiveRowId =
    activeRowId && selectableRows.some((row) => row.id === activeRowId)
      ? activeRowId
      : getInitialActiveRowId(selectableRows, selectedId);
  const templateColumns = useMemo(() => {
    const checkboxColumn = showCheckBox ? "var(--nu-glyph-cell-size)" : null;
    const dataColumns = columns.map(
      (column) => column.width ?? "minmax(0, 1fr)"
    );

    return [checkboxColumn, ...dataColumns].filter(Boolean).join(" ");
  }, [columns, showCheckBox]);
  const dropTargetOptions = useMemo(
    () =>
      onDrop
        ? { accepts: acceptsDrop, onDrop, type: "list-view" }
        : undefined,
    [acceptsDrop, onDrop]
  );

  useNuDropTarget(rootElement, dropTargetOptions);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    setRootElement(node);
  }, []);

  useEffect(() => {
    if (!resolvedActiveRowId) {
      return;
    }

    rowRefs.current[resolvedActiveRowId]?.scrollIntoView({
      block: "nearest"
    });
  }, [resolvedActiveRowId]);

  const registerRowRef = useCallback(
    (rowId: string, node: HTMLDivElement | null) => {
      rowRefs.current[rowId] = node;
    },
    []
  );

  const updateActiveRow = useCallback(
    (row: T) => {
      if (!isActiveControlled) {
        setUncontrolledActiveRowId(row.id);
      }

      onActiveRowChange?.(row);
    },
    [isActiveControlled, onActiveRowChange]
  );

  const activateRowId = useCallback(
    (rowId: string | null) => {
      if (!rowId) {
        return;
      }

      const nextRow = selectableRows.find((row) => row.id === rowId);

      if (!nextRow) {
        return;
      }

      updateActiveRow(nextRow);
      onRowSelect?.(nextRow);
    },
    [selectableRows, updateActiveRow, onRowSelect]
  );

  function moveActive(direction: 1 | -1) {
    if (selectableRows.length === 0) {
      return;
    }

    const currentIndex = selectableRows.findIndex(
      (row) => row.id === resolvedActiveRowId
    );
    const fallbackIndex = direction > 0 ? 0 : selectableRows.length - 1;
    const nextIndex =
      currentIndex === -1
        ? fallbackIndex
        : Math.max(
            0,
            Math.min(selectableRows.length - 1, currentIndex + direction)
          );

    activateRowId(selectableRows[nextIndex]?.id ?? null);
  }

  function activateEdge(edge: "start" | "end") {
    if (selectableRows.length === 0) {
      return;
    }

    activateRowId(
      edge === "start"
        ? (selectableRows[0]?.id ?? null)
        : (selectableRows[selectableRows.length - 1]?.id ?? null)
    );
  }

  function isRowChecked(row: T) {
    return getListViewRowChecked(row, checkedIds);
  }

  const toggleRowCheck = useCallback(
    (rowId: string) => {
      if (!showCheckBox) {
        return;
      }

      const row = data.find((currentRow) => currentRow.id === rowId);

      if (!row || row.disabled) {
        return;
      }

      onRowCheckChange?.(row, !getListViewRowChecked(row, checkedIds));
    },
    [showCheckBox, data, checkedIds, onRowCheckChange]
  );

  useImperativeHandle(
    ref,
    () => ({
      activateRow(rowId: string) {
        activateRowId(rowId);
      },
      focus() {
        rootRef.current?.focus();
      },
      getActiveRowId() {
        return resolvedActiveRowId;
      },
      scrollToRow(rowId: string) {
        rowRefs.current[rowId]?.scrollIntoView({
          block: "nearest"
        });
      },
      toggleRowCheck(rowId: string) {
        toggleRowCheck(rowId);
      }
    }),
    [activateRowId, resolvedActiveRowId, toggleRowCheck]
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
        activateRowId(resolvedActiveRowId);
        break;
      case " ":
        if (resolvedActiveRowId) {
          event.preventDefault();
          activateRowId(resolvedActiveRowId);
          toggleRowCheck(resolvedActiveRowId);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      aria-activedescendant={resolvedActiveRowId ?? undefined}
      className={["nu-list-view", className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
      ref={setRootRef}
      role="grid"
      tabIndex={0}
    >
      <div
        className="nu-list-view__header"
        role="row"
        style={
          {
            "--nu-list-view-columns": templateColumns
          } as CSSProperties
        }
      >
        {showCheckBox ? (
          <span className="nu-list-view__header-cell" role="columnheader" />
        ) : null}
        {columns.map((column) => (
          <span
            className={[
              "nu-list-view__header-cell",
              `nu-list-view__header-cell--${column.align ?? "start"}`,
              column.className
            ]
              .filter(Boolean)
              .join(" ")}
            key={column.id}
            role="columnheader"
          >
            {renderMnemonicText(column.title)}
          </span>
        ))}
      </div>
      <div className="nu-list-view__body">
        {data.length > 0 ? (
          data.map((row) => (
            <ListViewRow
              columns={columns}
              getDragItem={getDragItem}
              isActive={row.id === resolvedActiveRowId}
              isChecked={isRowChecked(row)}
              isSelected={row.id === selectedId}
              key={row.id}
              onActivate={activateRowId}
              onDoubleClick={onRowDoubleClick}
              onDragOut={onRowDragOut}
              onToggleCheck={toggleRowCheck}
              registerRowRef={registerRowRef}
              renderDragPreview={renderDragPreview}
              row={row}
              showCheckBox={showCheckBox}
              templateColumns={templateColumns}
              uncheckedShape={uncheckedShape}
            />
          ))
        ) : (
          <div className="nu-list-view__empty">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

function ListViewWithDragDrop<T extends ListViewRowBase>(
  props: ListViewProps<T>,
  ref: ForwardedRef<ListViewHandle>
) {
  return (
    <NuDragDropProvider>
      {ListViewInner(props, ref)}
    </NuDragDropProvider>
  );
}

export const ListView = forwardRef(ListViewWithDragDrop) as <
  T extends ListViewRowBase
>(
  props: ListViewProps<T> & RefAttributes<ListViewHandle>
) => ReturnType<typeof ListViewInner>;

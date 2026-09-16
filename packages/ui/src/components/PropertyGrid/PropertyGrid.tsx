import {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { NuGlyph } from "../Glyph";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

type PropertyGridItemEntry = {
  content: ReactNode;
  disabled?: boolean;
  hint?: string;
  id: string;
  label: string;
  type?: "item";
};

type PropertyGridGroupEntry = {
  children: PropertyGridEntry[];
  disabled?: boolean;
  expanded?: boolean;
  id: string;
  label: string;
  summary?: ReactNode;
  type: "group";
};

type PropertyGridSectionEntry = {
  id: string;
  title: string;
  type: "section";
};

export type PropertyGridEntry =
  | PropertyGridItemEntry
  | PropertyGridGroupEntry
  | PropertyGridSectionEntry;

export type PropertyGridProps = HTMLAttributes<HTMLDivElement> & {
  activeId?: string;
  bordered?: boolean;
  defaultActiveId?: string;
  defaultExpandedIds?: string[];
  entries: PropertyGridEntry[];
  expandedIds?: string[];
  fill?: boolean;
  labelWidth?: string;
  onActiveIdChange?: (activeId: string) => void;
  onExpandedIdsChange?: (expandedIds: string[]) => void;
};

type PropertyGridVisibleRow =
  | {
      depth: number;
      entry: PropertyGridSectionEntry;
      type: "section";
    }
  | {
      depth: number;
      entry: PropertyGridItemEntry;
      type: "item";
    }
  | {
      depth: number;
      entry: PropertyGridGroupEntry;
      type: "group";
    };

type PropertyGridInteractiveRow =
  | {
      depth: number;
      entry: PropertyGridItemEntry;
      id: string;
      type: "item";
    }
  | {
      depth: number;
      entry: PropertyGridGroupEntry;
      id: string;
      type: "group";
    };

function collectGroupIds(entries: PropertyGridEntry[]) {
  const groupIds = new Set<string>();

  function visit(nextEntries: PropertyGridEntry[]) {
    nextEntries.forEach((entry) => {
      if (entry.type === "group") {
        groupIds.add(entry.id);
        visit(entry.children);
      }
    });
  }

  visit(entries);

  return groupIds;
}

function getInitialExpandedIds(
  entries: PropertyGridEntry[],
  defaultExpandedIds?: string[]
) {
  if (defaultExpandedIds && defaultExpandedIds.length > 0) {
    return defaultExpandedIds;
  }

  const expandedIds: string[] = [];

  function visit(nextEntries: PropertyGridEntry[]) {
    nextEntries.forEach((entry) => {
      if (entry.type !== "group") {
        return;
      }

      if (entry.expanded) {
        expandedIds.push(entry.id);
      }

      visit(entry.children);
    });
  }

  visit(entries);

  return expandedIds;
}

function collectVisibleRows(
  entries: PropertyGridEntry[],
  expandedIdSet: Set<string>,
  depth = 0
) {
  const rows: PropertyGridVisibleRow[] = [];

  entries.forEach((entry) => {
    if (entry.type === "section") {
      rows.push({
        depth,
        entry,
        type: "section"
      });
      return;
    }

    if (entry.type === "group") {
      rows.push({
        depth,
        entry,
        type: "group"
      });

      if (expandedIdSet.has(entry.id)) {
        rows.push(
          ...collectVisibleRows(entry.children, expandedIdSet, depth + 1)
        );
      }

      return;
    }

    rows.push({
      depth,
      entry,
      type: "item"
    });
  });

  return rows;
}

function collectInteractiveRows(rows: PropertyGridVisibleRow[]) {
  return rows.filter(
    (row): row is PropertyGridInteractiveRow => row.type !== "section"
  );
}

function getInitialActiveId(
  interactiveRows: PropertyGridInteractiveRow[],
  defaultActiveId?: string
) {
  if (
    defaultActiveId &&
    interactiveRows.some((row) => row.id === defaultActiveId)
  ) {
    return defaultActiveId;
  }

  return interactiveRows[0]?.id;
}

function activateItemEditor(editorId: string) {
  const editorNode = document.getElementById(editorId);

  if (!editorNode) {
    return;
  }

  const target = editorNode.querySelector<HTMLElement>(
    'input:not([disabled]),button:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  );

  if (!target) {
    return;
  }

  target.focus();

  if (
    target instanceof HTMLInputElement &&
    (target.type === "checkbox" || target.type === "radio")
  ) {
    target.click();
  }
}

export function PropertyGrid({
  activeId: activeIdProp,
  bordered = false,
  className,
  defaultActiveId,
  defaultExpandedIds,
  entries,
  expandedIds: expandedIdsProp,
  fill = true,
  labelWidth = "15ch",
  onActiveIdChange,
  onExpandedIdsChange,
  style,
  ...props
}: PropertyGridProps) {
  const editorIdPrefix = useId();
  const rowButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const groupIds = useMemo(() => collectGroupIds(entries), [entries]);
  const isExpandedControlled = expandedIdsProp !== undefined;
  const isActiveControlled = activeIdProp !== undefined;
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<
    string[]
  >(() => getInitialExpandedIds(entries, defaultExpandedIds));
  const resolvedExpandedIds = expandedIdsProp ?? uncontrolledExpandedIds;
  const expandedIdSet = useMemo(
    () =>
      new Set(
        resolvedExpandedIds.filter((expandedId) => groupIds.has(expandedId))
      ),
    [groupIds, resolvedExpandedIds]
  );
  const rows = useMemo(
    () => collectVisibleRows(entries, expandedIdSet),
    [entries, expandedIdSet]
  );
  const interactiveRows = useMemo(() => collectInteractiveRows(rows), [rows]);
  const [uncontrolledActiveId, setUncontrolledActiveId] = useState<
    string | undefined
  >(() => getInitialActiveId(interactiveRows, defaultActiveId));
  const requestedActiveId = isActiveControlled
    ? activeIdProp
    : uncontrolledActiveId;
  const resolvedActiveId =
    requestedActiveId &&
    interactiveRows.some((row) => row.id === requestedActiveId)
      ? requestedActiveId
      : interactiveRows[0]?.id;

  function updateExpandedIds(nextExpandedIds: string[]) {
    if (!isExpandedControlled) {
      setUncontrolledExpandedIds(nextExpandedIds);
    }

    onExpandedIdsChange?.(nextExpandedIds);
  }

  function updateActiveId(nextActiveId: string) {
    if (!isActiveControlled) {
      setUncontrolledActiveId(nextActiveId);
    }

    onActiveIdChange?.(nextActiveId);
  }

  function focusRowButton(rowId: string) {
    rowButtonRefs.current[rowId]?.focus();
  }

  function getRowIndex(rowId: string) {
    return interactiveRows.findIndex((row) => row.id === rowId);
  }

  function focusAdjacentRow(rowId: string, direction: 1 | -1) {
    const currentIndex = getRowIndex(rowId);

    if (currentIndex === -1) {
      return;
    }

    const nextRow = interactiveRows[currentIndex + direction];

    if (!nextRow) {
      return;
    }

    focusRowButton(nextRow.id);
  }

  function focusBoundaryRow(boundary: "first" | "last") {
    const targetRow =
      boundary === "first"
        ? interactiveRows[0]
        : interactiveRows[interactiveRows.length - 1];

    if (!targetRow) {
      return;
    }

    focusRowButton(targetRow.id);
  }

  function findParentRowId(rowId: string) {
    const currentIndex = getRowIndex(rowId);

    if (currentIndex <= 0) {
      return undefined;
    }

    const currentRow = interactiveRows[currentIndex];

    if (!currentRow) {
      return undefined;
    }

    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const nextRow = interactiveRows[index];

      if (nextRow && nextRow.depth < currentRow.depth) {
        return nextRow.id;
      }
    }

    return undefined;
  }

  function handleRowKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    row: PropertyGridInteractiveRow
  ) {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusAdjacentRow(row.id, -1);
        return;
      case "ArrowDown":
        event.preventDefault();
        focusAdjacentRow(row.id, 1);
        return;
      case "Home":
        event.preventDefault();
        focusBoundaryRow("first");
        return;
      case "End":
        event.preventDefault();
        focusBoundaryRow("last");
        return;
      case "ArrowLeft": {
        event.preventDefault();

        if (row.type === "group" && expandedIdSet.has(row.entry.id)) {
          toggleGroup(row.entry);
          return;
        }

        const parentRowId = findParentRowId(row.id);

        if (parentRowId) {
          focusRowButton(parentRowId);
        }

        return;
      }
      case "ArrowRight": {
        event.preventDefault();

        if (row.type === "group") {
          if (!expandedIdSet.has(row.entry.id)) {
            toggleGroup(row.entry);
            return;
          }

          focusAdjacentRow(row.id, 1);
          return;
        }

        activateItemEditor(`${editorIdPrefix}-editor-${row.entry.id}`);
        return;
      }
      case "Enter":
      case " ":
        event.preventDefault();

        if (row.type === "group") {
          toggleGroup(row.entry);
          return;
        }

        activateItemEditor(`${editorIdPrefix}-editor-${row.entry.id}`);
        return;
      default:
        return;
    }
  }

  function toggleGroup(entry: PropertyGridGroupEntry) {
    if (entry.disabled) {
      return;
    }

    const nextExpandedIds = expandedIdSet.has(entry.id)
      ? resolvedExpandedIds.filter((expandedId) => expandedId !== entry.id)
      : [...resolvedExpandedIds, entry.id];

    updateExpandedIds(nextExpandedIds);
  }

  return (
    <div
      {...props}
      className={["nu-property-grid", className].filter(Boolean).join(" ")}
      data-bordered={bordered || undefined}
      data-fill={fill || undefined}
      style={
        {
          ...style,
          "--nu-property-grid-label-width": labelWidth
        } as CSSProperties
      }
    >
      <div className="nu-property-grid__body">
        {rows.map((row) => {
          if (row.type === "section") {
            return (
              <div className="nu-property-grid__section" key={row.entry.id}>
                {renderMnemonicText(row.entry.title)}
              </div>
            );
          }

          if (row.type === "group") {
            const isExpanded = expandedIdSet.has(row.entry.id);

            return (
              <div
                className="nu-property-grid__row"
                data-active={resolvedActiveId === row.entry.id || undefined}
                data-disabled={row.entry.disabled || undefined}
                data-expanded={isExpanded || undefined}
                data-group
                key={row.entry.id}
              >
                <button
                  className="nu-property-grid__label nu-property-grid__label-button"
                  disabled={row.entry.disabled}
                  onFocus={() => updateActiveId(row.entry.id)}
                  onKeyDown={(event) =>
                    handleRowKeyDown(event, {
                      depth: row.depth,
                      entry: row.entry,
                      id: row.entry.id,
                      type: "group"
                    })
                  }
                  onClick={() => toggleGroup(row.entry)}
                  ref={(node) => {
                    rowButtonRefs.current[row.entry.id] = node;
                  }}
                  style={
                    {
                      "--nu-property-grid-depth": row.depth
                    } as CSSProperties
                  }
                  type="button"
                >
                  <span className="nu-property-grid__lead">
                    <span className="nu-property-grid__expander">
                      <NuGlyph
                        name={
                          isExpanded ? "tree-caret-down" : "tree-caret-right"
                        }
                      />
                    </span>
                    <span className="nu-property-grid__label-text">
                      {renderMnemonicText(row.entry.label)}
                    </span>
                  </span>
                </button>
                <div className="nu-property-grid__editor">
                  {row.entry.summary ? (
                    <div className="nu-property-grid__control">
                      {row.entry.summary}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          }

          const editorId = `${editorIdPrefix}-editor-${row.entry.id}`;

          return (
            <div
              className="nu-property-grid__row"
              data-active={resolvedActiveId === row.entry.id || undefined}
              data-disabled={row.entry.disabled || undefined}
              key={row.entry.id}
            >
              <button
                className="nu-property-grid__label nu-property-grid__label-button"
                disabled={row.entry.disabled}
                onFocus={() => updateActiveId(row.entry.id)}
                onKeyDown={(event) =>
                  handleRowKeyDown(event, {
                    depth: row.depth,
                    entry: row.entry,
                    id: row.entry.id,
                    type: "item"
                  })
                }
                onClick={() => activateItemEditor(editorId)}
                ref={(node) => {
                  rowButtonRefs.current[row.entry.id] = node;
                }}
                style={
                  {
                    "--nu-property-grid-depth": row.depth
                  } as CSSProperties
                }
                type="button"
              >
                <span className="nu-property-grid__lead">
                  <span className="nu-property-grid__expander-placeholder" />
                  <span className="nu-property-grid__label-text">
                    {renderMnemonicText(row.entry.label)}
                  </span>
                </span>
              </button>
              <div
                className="nu-property-grid__editor"
                id={editorId}
                onFocusCapture={() => updateActiveId(row.entry.id)}
              >
                <div className="nu-property-grid__control">
                  {row.entry.content}
                </div>
                {row.entry.hint ? (
                  <div className="nu-property-grid__hint">{row.entry.hint}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

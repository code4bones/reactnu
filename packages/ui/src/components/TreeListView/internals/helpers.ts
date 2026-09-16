import { ReactNode } from "react";
import {
  collectExpandedTreeDataIds,
  collectVisibleTreeDataItems,
  findSelectedTreeDataItemId,
  findTreeDataItemById
} from "../../_shared/treeData";
import {
  TreeListColumn,
  TreeListColumnAlign,
  TreeListItemBase,
  VisibleTreeListItem
} from "./types";

function normalizeTreeListAlign(
  align: TreeListColumnAlign | undefined,
  fallback: "left" | "center" | "right"
) {
  if (align === "start") {
    return "left";
  }

  if (align === "end") {
    return "right";
  }

  return align ?? fallback;
}

export function collectExpandedTreeListIds<T extends TreeListItemBase<T>>(
  items: T[]
) {
  return collectExpandedTreeDataIds(items);
}

export function findSelectedTreeListItemId<T extends TreeListItemBase<T>>(
  items: T[]
): string | null {
  return findSelectedTreeDataItemId(items);
}

export function findTreeListItemById<T extends TreeListItemBase<T>>(
  items: T[],
  targetId: string
): T | null {
  return findTreeDataItemById(items, targetId);
}

export function collectVisibleTreeListItems<T extends TreeListItemBase<T>>(
  items: T[],
  expandedIds: Set<string>,
  depth = 0,
  guideMask: boolean[] = [],
  parentId: string | null = null
): VisibleTreeListItem<T>[] {
  return collectVisibleTreeDataItems(
    items,
    expandedIds,
    depth,
    guideMask,
    parentId
  );
}

export function getTreeListTemplateColumns<T extends TreeListItemBase<T>>(
  columns: TreeListColumn<T>[],
  {
    autoColumnWidths,
    userColumnWidths
  }: {
    autoColumnWidths?: Record<string, number>;
    userColumnWidths?: Record<string, number>;
  } = {}
) {
  return columns
    .map((column, index) => {
      const isLastColumn = index === columns.length - 1;
      const minWidth = column.minWidth ?? 0;

      if (userColumnWidths?.[column.id] !== undefined) {
        return `${userColumnWidths[column.id]}px`;
      }

      if (typeof column.width === "number") {
        return `${column.width}px`;
      }

      if (typeof column.width === "string") {
        return column.width;
      }

      const baseWidth = Math.max(autoColumnWidths?.[column.id] ?? 0, minWidth);

      if (isLastColumn) {
        return `minmax(${baseWidth}px, 1fr)`;
      }

      if (autoColumnWidths?.[column.id] !== undefined) {
        return `${baseWidth}px`;
      }

      return `minmax(${minWidth}px, max-content)`;
    })
    .join(" ");
}

export function getTreeListTreeColumnId<T extends TreeListItemBase<T>>(
  columns: TreeListColumn<T>[]
) {
  return columns.find((column) => column.tree)?.id ?? columns[0]?.id ?? null;
}

export function getTreeListCellAlign<T extends TreeListItemBase<T>>(
  column: TreeListColumn<T>,
  columnIndex: number
) {
  return normalizeTreeListAlign(
    column.align,
    columnIndex === 0 ? "left" : "center"
  );
}

export function getTreeListHeaderAlign<T extends TreeListItemBase<T>>(
  column: TreeListColumn<T>,
  columnIndex: number
) {
  return normalizeTreeListAlign(
    column.headerAlign,
    columnIndex === 0 ? "left" : "center"
  );
}

export function renderTreeListCellValue<T extends TreeListItemBase<T>>(
  item: T,
  column: TreeListColumn<T>
): ReactNode {
  if (column.renderCell) {
    return column.renderCell(item);
  }

  if (!column.field) {
    return "";
  }

  const value = item[column.field];

  if (value == null) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return value as ReactNode;
}

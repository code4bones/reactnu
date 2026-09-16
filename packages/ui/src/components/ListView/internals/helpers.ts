import { ReactNode } from "react";
import { ListViewColumn, ListViewRowBase } from "./types";

export function getInitialActiveRowId<T extends ListViewRowBase>(
  rows: T[],
  selectedId?: string
) {
  if (
    selectedId &&
    rows.some((row) => row.id === selectedId && !row.disabled)
  ) {
    return selectedId;
  }

  const selectedRow = rows.find((row) => row.selected && !row.disabled);

  if (selectedRow) {
    return selectedRow.id;
  }

  return rows.find((row) => !row.disabled)?.id ?? null;
}

export function getListViewRowChecked<T extends ListViewRowBase>(
  row: T,
  checkedIds?: string[]
) {
  return checkedIds ? checkedIds.includes(row.id) : row.checked === true;
}

export function renderListViewCellValue<T extends ListViewRowBase>(
  row: T,
  column: ListViewColumn<T>
): ReactNode {
  if (column.renderCell) {
    return column.renderCell(row);
  }

  if (!column.field) {
    return "";
  }

  const value = row[column.field];

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

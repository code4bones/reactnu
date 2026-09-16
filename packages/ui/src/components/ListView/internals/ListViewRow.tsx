import { CSSProperties, MouseEvent, memo } from "react";
import { renderListViewCellValue } from "./helpers";
import { ListViewColumn, ListViewRowBase } from "./types";
import { ListViewCheckControl } from "./ListViewCheckControl";

type ListViewRowProps<T extends ListViewRowBase> = {
  columns: ListViewColumn<T>[];
  isActive: boolean;
  isChecked: boolean;
  isSelected: boolean;
  onActivate: (rowId: string) => void;
  onDoubleClick?: (row: T) => void;
  onToggleCheck: (rowId: string) => void;
  registerRowRef: (rowId: string, node: HTMLDivElement | null) => void;
  row: T;
  showCheckBox: boolean;
  templateColumns: string;
  uncheckedShape: "box" | "none";
};

function ListViewRowInner<T extends ListViewRowBase>({
  columns,
  isActive,
  isChecked,
  isSelected,
  onActivate,
  onDoubleClick,
  onToggleCheck,
  registerRowRef,
  row,
  showCheckBox,
  templateColumns,
  uncheckedShape
}: ListViewRowProps<T>) {
  const rowId = row.id;

  function handleActivate() {
    if (!row.disabled) {
      onActivate(rowId);
    }
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!row.disabled) {
      onDoubleClick?.(row);
    }
  }

  function handleToggleCheck() {
    onToggleCheck(rowId);
  }

  return (
    <div
      aria-disabled={row.disabled || undefined}
      aria-selected={isSelected || undefined}
      className={[
        "nu-list-view__row",
        isActive ? "nu-list-view__row--active" : null,
        isSelected ? "nu-list-view__row--selected" : null,
        row.disabled ? "nu-list-view__row--disabled" : null,
        row.className
      ]
        .filter(Boolean)
        .join(" ")}
      id={rowId}
      onClick={handleActivate}
      onDoubleClick={handleDoubleClick}
      ref={(node) => registerRowRef(rowId, node)}
      role="row"
      style={
        {
          "--nu-list-view-columns": templateColumns
        } as CSSProperties
      }
    >
      {showCheckBox ? (
        <span className="nu-list-view__check-cell" role="gridcell">
          <ListViewCheckControl
            isChecked={isChecked}
            onActivate={handleActivate}
            onToggleCheck={handleToggleCheck}
            uncheckedShape={uncheckedShape}
          />
        </span>
      ) : null}
      {columns.map((column) => (
        <span
          className={[
            "nu-list-view__cell",
            `nu-list-view__cell--${column.align ?? "start"}`,
            column.className
          ]
            .filter(Boolean)
            .join(" ")}
          key={column.id}
          role="gridcell"
        >
          {renderListViewCellValue(row, column)}
        </span>
      ))}
    </div>
  );
}

export const ListViewRow = memo(ListViewRowInner) as typeof ListViewRowInner;

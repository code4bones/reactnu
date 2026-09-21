import { MouseEvent, ReactNode, memo } from "react";
import { NuDragDropItem, useNuDragSource } from "../../DragDrop";
import { ListBoxCheckControl } from "./ListBoxCheckControl";
import { renderLabel } from "./renderLabel";
import { ListBoxGroup, ListBoxItem } from "./types";

type ListBoxItemViewProps = {
  group: ListBoxGroup;
  getDragItem?: (
    item: ListBoxItem,
    group: ListBoxGroup
  ) => NuDragDropItem | false;
  isActive: boolean;
  isChecked: boolean;
  isSelected: boolean;
  item: ListBoxItem;
  itemId: string;
  onActivate: (item: ListBoxItem, group: ListBoxGroup, itemId: string) => void;
  onDoubleClick?: (item: ListBoxItem, group: ListBoxGroup) => void;
  onDragOut?: (item: ListBoxItem, group: ListBoxGroup) => void;
  onPopupMenu?: (
    event: MouseEvent<HTMLDivElement>,
    item: ListBoxItem,
    group: ListBoxGroup,
    itemId: string
  ) => void;
  onToggleCheck: (itemId: string) => void;
  renderDragPreview?: (item: ListBoxItem, group: ListBoxGroup) => ReactNode;
  registerItemRef: (itemId: string, node: HTMLDivElement | null) => void;
  rightCheckBox: boolean;
  uncheckedShape: "box" | "none";
};

function ListBoxItemViewInner({
  group,
  getDragItem,
  isActive,
  isChecked,
  isSelected,
  item,
  itemId,
  onActivate,
  onPopupMenu,
  onDoubleClick,
  onDragOut,
  onToggleCheck,
  renderDragPreview,
  registerItemRef,
  rightCheckBox,
  uncheckedShape
}: ListBoxItemViewProps) {
  const dragSource = useNuDragSource({
    disabled: item.disabled || !getDragItem,
    getItem: () => getDragItem?.(item, group) ?? false,
    onDropAccepted: (result) => {
      if (result.action !== "copy") {
        onDragOut?.(item, group);
      }
    },
    renderPreview: renderDragPreview
      ? () => renderDragPreview(item, group)
      : undefined,
    sourceType: "listbox-item"
  });

  function handleActivate() {
    if (!item.disabled) {
      onActivate(item, group, itemId);
    }
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!item.disabled) {
      onDoubleClick?.(item, group);
    }
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    onPopupMenu?.(event, item, group, itemId);
  }

  function handleToggleCheck() {
    onToggleCheck(itemId);
  }

  const checkControl = item.checkable ? (
    <ListBoxCheckControl
      isChecked={isChecked}
      onActivate={handleActivate}
      onToggleCheck={handleToggleCheck}
      uncheckedShape={uncheckedShape}
    />
  ) : null;

  return (
    <div
      aria-disabled={item.disabled || undefined}
      aria-checked={item.checkable ? isChecked : undefined}
      aria-current={isActive || undefined}
      aria-selected={isSelected || undefined}
      className={[
        "nu-listbox__item",
        isActive ? "nu-listbox__item--active" : null,
        isSelected ? "nu-listbox__item--selected" : null,
        item.disabled ? "nu-listbox__item--disabled" : null,
        item.className
      ]
        .filter(Boolean)
        .join(" ")}
      id={itemId}
      onClick={handleActivate}
      onContextMenu={onPopupMenu ? handleContextMenu : undefined}
      onDoubleClick={handleDoubleClick}
      ref={(node) => {
        registerItemRef(itemId, node);
        dragSource.dragRef(node);
      }}
      role="option"
    >
      <span className="nu-listbox__item-main">
        {rightCheckBox ? null : checkControl}
        {renderLabel(item.name, "nu-listbox__item-label")}
      </span>
      {item.details ? (
        <span className="nu-listbox__item-details">{item.details}</span>
      ) : null}
      {rightCheckBox ? checkControl : null}
    </div>
  );
}

export const ListBoxItemView = memo(ListBoxItemViewInner);

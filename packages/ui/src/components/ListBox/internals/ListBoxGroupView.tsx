import { MouseEvent, ReactNode } from "react";
import { buildListBoxItemId } from "./helpers";
import { ListBoxCategoryView } from "./ListBoxCategoryView";
import { ListBoxItemView } from "./ListBoxItemView";
import { ListBoxGroup, ListBoxItem } from "./types";
import { NuDragDropItem } from "../../DragDrop";

type ListBoxGroupViewProps = {
  group: ListBoxGroup;
  groupIndex: number;
  getDragItem?: (item: ListBoxItem, group: ListBoxGroup) => NuDragDropItem | false;
  isItemChecked: (item: ListBoxItem) => boolean;
  listboxId: string;
  onActivateItem: (
    item: ListBoxItem,
    group: ListBoxGroup,
    itemId: string
  ) => void;
  onDoubleClickItem?: (item: ListBoxItem, group: ListBoxGroup) => void;
  onItemDragOut?: (item: ListBoxItem, group: ListBoxGroup) => void;
  renderDragPreview?: (item: ListBoxItem, group: ListBoxGroup) => ReactNode;
  onPopupMenuItem?: (
    event: MouseEvent<HTMLDivElement>,
    item: ListBoxItem,
    group: ListBoxGroup,
    itemId: string
  ) => void;
  onToggleItemCheck: (itemId: string) => void;
  registerItemRef: (itemId: string, node: HTMLDivElement | null) => void;
  resolvedActiveId: string | null;
  rightCheckBox: boolean;
  selectedId?: string;
  uncheckedShape: "box" | "none";
};

export function ListBoxGroupView({
  group,
  groupIndex,
  getDragItem,
  isItemChecked,
  listboxId,
  onActivateItem,
  onDoubleClickItem,
  onItemDragOut,
  renderDragPreview,
  onPopupMenuItem,
  onToggleItemCheck,
  registerItemRef,
  resolvedActiveId,
  rightCheckBox,
  selectedId,
  uncheckedShape
}: ListBoxGroupViewProps) {
  return (
    <div className="nu-listbox__group" role="group">
      {group.category ? (
        <ListBoxCategoryView category={group.category} />
      ) : null}
      {group.items.map((item, itemIndex) => {
        const itemId = buildListBoxItemId(
          listboxId,
          group,
          groupIndex,
          item,
          itemIndex
        );
        const isSelected = selectedId ? item.id === selectedId : item.selected;
        const isActive = resolvedActiveId === itemId;
        const isChecked = isItemChecked(item);

        return (
          <ListBoxItemView
            group={group}
            getDragItem={getDragItem}
            isActive={isActive}
            isChecked={isChecked}
            isSelected={Boolean(isSelected)}
            item={item}
            itemId={itemId}
            key={itemId}
            onActivate={onActivateItem}
            onDoubleClick={onDoubleClickItem}
            onDragOut={onItemDragOut}
            renderDragPreview={renderDragPreview}
            onPopupMenu={onPopupMenuItem}
            onToggleCheck={onToggleItemCheck}
            registerItemRef={registerItemRef}
            rightCheckBox={rightCheckBox}
            uncheckedShape={uncheckedShape}
          />
        );
      })}
    </div>
  );
}

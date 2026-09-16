import { buildListBoxItemId } from "./helpers";
import { ListBoxCategoryView } from "./ListBoxCategoryView";
import { ListBoxItemView } from "./ListBoxItemView";
import { ListBoxGroup, ListBoxItem } from "./types";

type ListBoxGroupViewProps = {
  group: ListBoxGroup;
  groupIndex: number;
  isItemChecked: (item: ListBoxItem) => boolean;
  listboxId: string;
  onActivateItem: (
    item: ListBoxItem,
    group: ListBoxGroup,
    itemId: string
  ) => void;
  onDoubleClickItem?: (item: ListBoxItem, group: ListBoxGroup) => void;
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
  isItemChecked,
  listboxId,
  onActivateItem,
  onDoubleClickItem,
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
            isActive={isActive}
            isChecked={isChecked}
            isSelected={Boolean(isSelected)}
            item={item}
            itemId={itemId}
            key={itemId}
            onActivate={onActivateItem}
            onDoubleClick={onDoubleClickItem}
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

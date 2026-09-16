import { FlattenedListBoxItem, ListBoxGroup, ListBoxItem } from "./types";

export function buildListBoxItemId(
  listboxId: string,
  group: ListBoxGroup,
  groupIndex: number,
  item: ListBoxItem,
  itemIndex: number
) {
  return (
    item.id ??
    `${listboxId}-${group.category?.text ?? "item"}-${groupIndex}-${item.name.text}-${itemIndex}`
  );
}

export function flattenListBoxData(data: ListBoxGroup[], listboxId: string) {
  const flattenedItems: FlattenedListBoxItem[] = [];

  data.forEach((group, groupIndex) => {
    group.items.forEach((item, itemIndex) => {
      flattenedItems.push({
        group,
        item,
        itemId: buildListBoxItemId(
          listboxId,
          group,
          groupIndex,
          item,
          itemIndex
        )
      });
    });
  });

  return flattenedItems;
}

export function getInitialActiveId(
  selectableItems: FlattenedListBoxItem[],
  selectedId?: string
) {
  if (selectedId) {
    const selectedItem = selectableItems.find(
      (entry) => entry.item.id === selectedId
    );

    if (selectedItem) {
      return selectedItem.itemId;
    }
  }

  const declarativeSelected = selectableItems.find(
    (entry) => entry.item.selected
  );

  return declarativeSelected?.itemId ?? selectableItems[0]?.itemId ?? null;
}

export function getListBoxItemChecked(
  item: ListBoxItem,
  checkedIds?: string[]
) {
  if (!item.checkable) {
    return false;
  }

  return checkedIds
    ? checkedIds.includes(item.id ?? "")
    : Boolean(item.checked);
}

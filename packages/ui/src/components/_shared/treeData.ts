export type TreeDataItemBase<TItem = unknown> = {
  children?: TItem[];
  expanded?: boolean;
  id: string;
  selected?: boolean;
};

export type VisibleTreeDataItem<T extends TreeDataItemBase<T>> = {
  depth: number;
  guideMask: boolean[];
  hasChildren: boolean;
  hasNextSibling: boolean;
  item: T;
  itemId: string;
  parentId: string | null;
};

export function collectExpandedTreeDataIds<T extends TreeDataItemBase<T>>(
  items: T[]
) {
  const expandedIds: string[] = [];

  function visit(nodes: T[]) {
    nodes.forEach((item) => {
      if (item.expanded) {
        expandedIds.push(item.id);
      }

      if (item.children?.length) {
        visit(item.children);
      }
    });
  }

  visit(items);

  return expandedIds;
}

export function findSelectedTreeDataItemId<T extends TreeDataItemBase<T>>(
  items: T[]
): string | null {
  for (const item of items) {
    if (item.selected) {
      return item.id;
    }

    if (item.children?.length) {
      const nestedSelectedId = findSelectedTreeDataItemId(item.children);

      if (nestedSelectedId) {
        return nestedSelectedId;
      }
    }
  }

  return null;
}

export function findTreeDataItemById<T extends TreeDataItemBase<T>>(
  items: T[],
  targetId: string
): T | null {
  for (const item of items) {
    if (item.id === targetId) {
      return item;
    }

    if (item.children?.length) {
      const nestedMatch = findTreeDataItemById(item.children, targetId);

      if (nestedMatch) {
        return nestedMatch;
      }
    }
  }

  return null;
}

export function collectVisibleTreeDataItems<T extends TreeDataItemBase<T>>(
  items: T[],
  expandedIds: Set<string>,
  depth = 0,
  guideMask: boolean[] = [],
  parentId: string | null = null
): VisibleTreeDataItem<T>[] {
  return items.flatMap((item, index) => {
    const hasChildren = Boolean(item.children?.length);
    const hasNextSibling = index < items.length - 1;
    const currentEntry: VisibleTreeDataItem<T> = {
      depth,
      guideMask,
      hasChildren,
      hasNextSibling,
      item,
      itemId: item.id,
      parentId
    };

    if (!hasChildren || !expandedIds.has(item.id)) {
      return [currentEntry];
    }

    return [
      currentEntry,
      ...collectVisibleTreeDataItems(
        item.children ?? [],
        expandedIds,
        depth + 1,
        [...guideMask, hasNextSibling],
        item.id
      )
    ];
  });
}

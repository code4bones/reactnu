import {
  collectExpandedTreeDataIds,
  collectVisibleTreeDataItems,
  findSelectedTreeDataItemId,
  findTreeDataItemById
} from "../../_shared/treeData";
import { TreeItem, VisibleTreeItem } from "./types";

export function collectExpandedTreeIds(items: TreeItem[]) {
  return collectExpandedTreeDataIds(items);
}

export function findSelectedTreeItemId(items: TreeItem[]): string | null {
  return findSelectedTreeDataItemId(items);
}

export function findTreeItemById(
  items: TreeItem[],
  targetId: string
): TreeItem | null {
  return findTreeDataItemById(items, targetId);
}

export function collectVisibleTreeItems(
  items: TreeItem[],
  expandedIds: Set<string>,
  depth = 0,
  guideMask: boolean[] = [],
  parentId: string | null = null
): VisibleTreeItem[] {
  return collectVisibleTreeDataItems(
    items,
    expandedIds,
    depth,
    guideMask,
    parentId
  );
}

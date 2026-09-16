import { ReactNode } from "react";
import { TreeDataItemBase, VisibleTreeDataItem } from "../../_shared/treeData";

export type TreeListColumnAlign = "left" | "center" | "right" | "start" | "end";

export type TreeListItemBase<TItem = unknown> = TreeDataItemBase<TItem> & {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  hint?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
};

export type TreeListColumn<T extends TreeListItemBase<T>> = {
  align?: TreeListColumnAlign;
  className?: string;
  field?: keyof T;
  headerAlign?: TreeListColumnAlign;
  id: string;
  minWidth?: number;
  renderCell?: (item: T) => ReactNode;
  resizable?: boolean;
  title: string;
  tree?: boolean;
  width?: number | string;
};

export type TreeListCellContext<T extends TreeListItemBase<T>> = {
  depth: number;
  isLeaf: boolean;
  item: T;
  rowIndex: number;
};

export type TreeListGetCellContent<T extends TreeListItemBase<T>> = (
  itemId: string,
  columnId: string,
  context: TreeListCellContext<T>
) => ReactNode;

export type VisibleTreeListItem<T extends TreeListItemBase<T>> =
  VisibleTreeDataItem<T>;

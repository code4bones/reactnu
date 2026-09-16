import { ReactNode } from "react";
import { TreeDataItemBase, VisibleTreeDataItem } from "../../_shared/treeData";

export interface TreeItem extends TreeDataItemBase<TreeItem> {
  checked?: boolean;
  disabled?: boolean;
  hint?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}

export type VisibleTreeItem = VisibleTreeDataItem<TreeItem>;

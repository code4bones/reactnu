import { ReactNode } from "react";

export type ListBoxLabel = {
  text: string;
  icon?: ReactNode;
};

export type ListBoxCategory = ListBoxLabel & {
  className?: string;
};

export type ListBoxItem = {
  id?: string;
  name: ListBoxLabel;
  details?: ReactNode;
  className?: string;
  checkable?: boolean;
  checked?: boolean;
  disabled?: boolean;
  selected?: boolean;
};

export type ListBoxGroup = {
  category: ListBoxCategory | null;
  items: ListBoxItem[];
};

export type FlattenedListBoxItem = {
  group: ListBoxGroup;
  item: ListBoxItem;
  itemId: string;
};

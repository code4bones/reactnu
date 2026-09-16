import { ReactNode } from "react";

export type ListViewRowBase = {
  id: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  selected?: boolean;
};

export type ListViewColumn<T extends ListViewRowBase> = {
  align?: "start" | "center" | "end";
  className?: string;
  field?: keyof T;
  id: string;
  renderCell?: (row: T) => ReactNode;
  title: string;
  width?: string;
};

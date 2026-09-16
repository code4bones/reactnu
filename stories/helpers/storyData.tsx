import React, { ReactNode } from "react";
import {
  ListBoxGroup,
  ListViewColumn,
  ListViewRowBase,
  MainMenuNode,
  NuGlyph,
  TreeListColumn,
  TreeListItemBase,
  TreeItem
} from "@deadragdoll/reactnu";

export const dropdownData: ListBoxGroup[] = [
  {
    category: { text: "Volumes" },
    items: [
      { id: "c", name: { text: "Drive C:" } },
      { id: "d", name: { text: "Drive D:" } },
      { disabled: true, id: "a", name: { text: "Drive A:" } }
    ]
  },
  {
    category: { text: "Remote" },
    items: [
      { id: "net-1", name: { text: "Archive Share" } },
      { id: "net-2", name: { text: "Diagnostics Node" } }
    ]
  }
];

export const searchRecords = [
  { id: "tokyo", text: "Tokyo", details: "JP / Asia Pacific" },
  { id: "osaka", text: "Osaka", details: "JP / Asia Pacific" },
  { id: "sydney", text: "Sydney", details: "AU / Asia Pacific" },
  { id: "berlin", text: "Berlin", details: "DE / Europe" },
  { id: "madrid", text: "Madrid", details: "ES / Europe" }
];

export type StoryListRow = ListViewRowBase & {
  name: string;
  selected?: boolean;
  size: string;
  status: string;
};

export const listColumns: ListViewColumn<StoryListRow>[] = [
  { field: "name", id: "name", title: "Name", width: "18ch" },
  { align: "right", field: "size", id: "size", title: "Size", width: "8ch" },
  { field: "status", id: "status", title: "Status", width: "12ch" }
];

export const listRows: StoryListRow[] = [
  { id: "row-1", name: "SURFACE.001", size: "44 KB", status: "Ready" },
  { id: "row-2", name: "SURFACE.002", size: "52 KB", status: "Dirty" },
  { id: "row-3", name: "CONFIG.SYS", size: "18 KB", status: "Locked" }
];

export const treeData: TreeItem[] = [
  {
    children: [
      {
        children: [
          { id: "1-1-1", hint: "44 KB", title: "SURFACE.001" },
          {
            checked: true,
            id: "1-1-2",
            icon: <NuGlyph name="gear" />,
            hint: "watch",
            title: "AUDIT.NLM"
          }
        ],
        expanded: true,
        hint: "2 items",
        icon: <NuGlyph name="folder" />,
        id: "1-1",
        title: "MODULES"
      },
      {
        children: [
          { id: "1-2-1", hint: "urban core", title: "Tokyo" },
          { id: "1-2-2", hint: "bay station", title: "Osaka" }
        ],
        expanded: true,
        hint: "2 cities",
        icon: <NuGlyph name="folder" />,
        id: "1-2",
        title: "Japan"
      }
    ],
    expanded: true,
    hint: "workspace",
    id: "1",
    title: "Drive C:"
  }
];

export type WeatherItem = TreeListItemBase<WeatherItem> & {
  humidity?: string;
  temperature?: string;
  wind?: string;
};

export const treeListColumns: TreeListColumn<WeatherItem>[] = [
  { id: "tree", minWidth: 16 * 8, title: "Location" },
  {
    align: "right",
    headerAlign: "center",
    id: "temperature",
    minWidth: 8 * 8,
    title: "Temp"
  },
  {
    align: "right",
    headerAlign: "center",
    id: "humidity",
    minWidth: 10 * 8,
    title: "Humidity"
  },
  {
    align: "right",
    headerAlign: "center",
    id: "wind",
    minWidth: 8 * 8,
    title: "Wind"
  }
];

export const treeListData: WeatherItem[] = [
  {
    children: [
      {
        children: [
          {
            humidity: "54%",
            id: "ap-jp-tokyo",
            temperature: "22C",
            title: "Tokyo",
            wind: "4 m/s"
          },
          {
            humidity: "61%",
            id: "ap-jp-osaka",
            temperature: "24C",
            title: "Osaka",
            wind: "3 m/s"
          }
        ],
        expanded: true,
        humidity: "58%",
        id: "ap-jp",
        temperature: "23C",
        title: "Japan",
        wind: "3.5 m/s"
      },
      {
        children: [
          {
            humidity: "48%",
            id: "ap-au-sydney",
            temperature: "18C",
            title: "Sydney",
            wind: "6 m/s"
          },
          {
            humidity: "44%",
            id: "ap-au-melbourne",
            temperature: "16C",
            title: "Melbourne",
            wind: "5 m/s"
          }
        ],
        expanded: true,
        humidity: "46%",
        id: "ap-au",
        temperature: "17C",
        title: "Australia",
        wind: "5.5 m/s"
      }
    ],
    expanded: true,
    humidity: "52%",
    id: "asia-pacific",
    temperature: "20C",
    title: "Asia Pacific",
    wind: "4.5 m/s"
  }
];

export const toolbarMenu: MainMenuNode[] = [
  { id: "map", text: "Export &map" },
  { id: "log", text: "Export &log" },
  { id: "divider-1", type: "divider" },
  { id: "archive", text: "&Archive package" }
];

export function renderCellValue(value: ReactNode) {
  return <span>{value}</span>;
}

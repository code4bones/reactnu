import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox, ListView, TreeListView, TreeView } from "@deadragdoll/reactnu";
import {
  dropdownData,
  listColumns,
  listRows,
  treeData,
  treeListColumns,
  treeListData
} from "../helpers/storyData";
import { StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Data/List And Tree",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function OverviewStory() {
    const [selectedListId, setSelectedListId] = useState<string | undefined>(
      "row-2"
    );
    const [selectedTreeId, setSelectedTreeId] = useState("1-1-2");
    const [selectedWeatherId, setSelectedWeatherId] = useState("ap-jp-osaka");
    const weatherById = useMemo(() => {
      const map = new Map<string, (typeof treeListData)[number]>();
      const visit = (items: typeof treeListData) => {
        items.forEach((item) => {
          map.set(item.id, item);
          if (item.children) {
            visit(item.children);
          }
        });
      };
      visit(treeListData);
      return map;
    }, []);

    return (
      <StoryStack>
        <StoryPanel title="ListBox">
          <div style={{ maxWidth: "24rem" }}>
            <ListBox
              data={dropdownData}
              onItemSelect={(item) => setSelectedListId(String(item.id))}
              selectedId={selectedListId}
            />
          </div>
        </StoryPanel>
        <StoryPanel title="ListView">
          <div style={{ maxWidth: "34rem" }}>
            <ListView
              columns={listColumns}
              data={listRows}
              selectedId={selectedListId}
              onRowSelect={(row) => setSelectedListId(row.id)}
            />
          </div>
        </StoryPanel>
        <StoryPanel title="TreeView">
          <div style={{ maxWidth: "28rem" }}>
            <TreeView
              data={treeData}
              onItemSelect={(item) => setSelectedTreeId(item.id)}
              selectedId={selectedTreeId}
            />
          </div>
        </StoryPanel>
        <StoryPanel title="TreeListView">
          <div style={{ maxWidth: "44rem" }}>
            <TreeListView
              columns={treeListColumns}
              data={treeListData}
              getCellContent={(itemId, columnId) => {
                const item = weatherById.get(itemId);

                if (!item) {
                  return null;
                }

                switch (columnId) {
                  case "temperature":
                    return item.temperature ?? "";
                  case "humidity":
                    return item.humidity ?? "";
                  case "wind":
                    return item.wind ?? "";
                  default:
                    return null;
                }
              }}
              onItemSelect={(item) => setSelectedWeatherId(item.id)}
              selectedId={selectedWeatherId}
            />
          </div>
        </StoryPanel>
      </StoryStack>
    );
  }
};

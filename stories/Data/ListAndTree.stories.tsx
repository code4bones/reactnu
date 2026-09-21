import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ComboBox,
  Dropdown,
  ListBox,
  ListView,
  TreeListView,
  TreeView
} from "@deadragdoll/reactnu";
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
    const [popupTarget, setPopupTarget] = useState("none");
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
              onPopupMenu={(_event, item) =>
                setPopupTarget(`ListBox: ${String(item.id)}`)
              }
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
              onPopupMenu={(_event, item, context) =>
                setPopupTarget(
                  `TreeListView: ${item.id} (row ${context.rowIndex + 1})`
                )
              }
              onItemSelect={(item) => setSelectedWeatherId(item.id)}
              selectedId={selectedWeatherId}
            />
          </div>
        </StoryPanel>
        <small>Last contextual target: {popupTarget}</small>
      </StoryStack>
    );
  }
};

export const OrdinaryControlsWithoutDragDropProvider: Story = {
  render: function OrdinaryControlsWithoutDragDropProviderStory() {
    const [dropdownValue, setDropdownValue] = useState("alpha");
    const [comboValue, setComboValue] = useState("beta");

    return (
      <StoryStack>
        <small>
          No NuDragDropProvider is mounted around these ordinary selection
          controls.
        </small>
        <Dropdown
          data={[
            {
              category: null,
              items: [
                { id: "alpha", name: { text: "Alpha" } },
                { id: "beta", name: { text: "Beta" } }
              ]
            }
          ]}
          label="Dropdown"
          onValueChange={setDropdownValue}
          value={dropdownValue}
        />
        <ComboBox
          data={[
            {
              category: null,
              items: [
                { id: "alpha", name: { text: "Alpha" } },
                { id: "beta", name: { text: "Beta" } }
              ]
            }
          ]}
          label="ComboBox"
          onValueChange={setComboValue}
          value={comboValue}
        />
        <div style={{ maxWidth: "24rem" }}>
          <ListBox data={dropdownData} />
        </div>
      </StoryStack>
    );
  }
};

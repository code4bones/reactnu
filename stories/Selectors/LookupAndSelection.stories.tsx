import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboBox, Dropdown, SearchBox, Stack } from "@deadragdoll/reactnu";
import { dropdownData, searchRecords } from "../helpers/storyData";
import { StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Selectors/Lookup And Selection",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function OverviewStory() {
    const [dropdownValue, setDropdownValue] = useState("c");
    const [comboValue, setComboValue] = useState<string | undefined>("d");
    const [comboInput, setComboInput] = useState("Drive D:");
    const [searchLog, setSearchLog] = useState("No search selection yet");

    return (
      <StoryStack>
        <StoryPanel title="Dropdown">
          <Dropdown
            data={dropdownData}
            hint="Local select over fixed data."
            label="Target volume"
            onValueChange={(nextValue) => setDropdownValue(nextValue)}
            value={dropdownValue}
          />
        </StoryPanel>
        <StoryPanel title="ComboBox">
          <ComboBox
            data={dropdownData}
            hint="Editable local filter."
            inputValue={comboInput}
            label="Archive share"
            onInputValueChange={setComboInput}
            onValueChange={(nextValue, item) => {
              setComboValue(nextValue);
              setComboInput(item.name.text);
            }}
            value={comboValue}
          />
        </StoryPanel>
        <StoryPanel title="SearchBox">
          <Stack gap="md">
            <SearchBox
              dataProvider={async (query) => {
                await new Promise((resolve) => window.setTimeout(resolve, 250));
                return searchRecords.filter((record) =>
                  record.text.toLowerCase().includes(query.toLowerCase())
                );
              }}
              getItemDetails={(item) => item.details}
              getItemId={(item) => item.id}
              getItemText={(item) => item.text}
              hint="Async provider search."
              label="City lookup"
              onItemSelect={(item) => setSearchLog(`Selected ${item.text}`)}
            />
            <div>
              State: dropdown={dropdownValue}, combo={comboValue ?? "none"},
              search={searchLog}
            </div>
          </Stack>
        </StoryPanel>
      </StoryStack>
    );
  }
};

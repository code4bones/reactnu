import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckBox,
  ComboBox,
  PropertyGrid,
  SpinBox,
  TextField
} from "@deadragdoll/reactnu";
import { dropdownData } from "../helpers/storyData";

const meta = {
  title: "Inspector/PropertyGrid",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedEditorRows: Story = {
  render: () => {
    const [name, setName] = useState("Archive Set");
    const [left, setLeft] = useState(32);
    const [watch, setWatch] = useState(true);
    const [volume, setVolume] = useState("c");

    return (
      <PropertyGrid
        bordered={false}
        entries={[
          {
            id: "name",
            label: "Name",
            content: (
              <TextField
                label="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            )
          },
          {
            expanded: true,
            id: "geometry",
            label: "Box",
            summary: "Rect(10,14,120,48)",
            type: "group",
            children: [
              {
                id: "left",
                label: "Left",
                content: (
                  <SpinBox
                    label="Left"
                    min={0}
                    onValueChange={setLeft}
                    value={left}
                  />
                )
              },
              {
                id: "watch",
                label: "Watch",
                content: (
                  <CheckBox
                    checked={watch}
                    label="Watch"
                    onCheckedChange={(checked) => setWatch(checked)}
                  />
                )
              }
            ]
          },
          {
            id: "volume",
            label: "Volume",
            content: (
              <ComboBox
                data={dropdownData}
                label="Volume"
                onValueChange={setVolume}
                placeholder="Select volume"
                value={volume}
              />
            )
          }
        ]}
      />
    );
  }
};

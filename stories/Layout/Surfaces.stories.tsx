import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Dashboard,
  Frame,
  Info,
  InfoAccent,
  NuView,
  Panel,
  Splitter,
  Stack
} from "@deadragdoll/reactnu";
import { StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Layout/Surfaces",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <StoryStack fill>
      <Panel inset title="Panel">
        <Info>
          Inset panel body is still driven by{" "}
          <InfoAccent>theme tokens</InfoAccent>.
        </Info>
      </Panel>
      <StoryPanel title="Frame">
        <Frame
          contentStyle={{ padding: "0.75rem 1rem" }}
          fill
          title="Frame"
          titleEnd={<Button variant="secondary">Help</Button>}
        >
          <Info>
            Frame title, body background, and padding can now be split between
            root props and slot overrides.
          </Info>
        </Frame>
      </StoryPanel>
      <StoryPanel title="Splitter">
        <div style={{ height: "12rem", width: "32rem" }}>
          <Splitter
            first={<NuView padding="sm">Left pane</NuView>}
            second={<NuView padding="sm">Right pane</NuView>}
          />
        </div>
      </StoryPanel>
      <StoryPanel title="Dashboard">
        <Dashboard
          items={[
            {
              content: (
                <Frame
                  contentStyle={{ padding: "0.75rem 1rem" }}
                  title="System Core"
                >
                  Core controls
                </Frame>
              ),
              lane: 1,
              id: "system"
            },
            {
              content: (
                <Frame
                  contentStyle={{ padding: "0.75rem 1rem" }}
                  title="Workspace Tools"
                >
                  Launchers
                </Frame>
              ),
              lane: 2,
              id: "tools"
            }
          ]}
          laneCount={2}
          layout="lanes"
        />
      </StoryPanel>
    </StoryStack>
  )
};

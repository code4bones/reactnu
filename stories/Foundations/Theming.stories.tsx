import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Frame, Info, InfoAccent, Panel, Stack } from "@deadragdoll/reactnu";
import { StoryFrame, StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Foundations/Theming",
  parameters: {
    docs: {
      description: {
        component:
          "Use the Storybook toolbar to verify theme, font, size, and desktop-pattern propagation across the entire package."
      }
    }
  },
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <StoryStack>
      <Stack direction="row" gap="md">
        <StoryPanel title="Surface Tokens">
          <Info>
            Active shell uses <InfoAccent>provider-level</InfoAccent> theme and
            typography.
          </Info>
        </StoryPanel>
        <StoryFrame title="Button States">
          <Stack direction="row" gap="sm">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </Stack>
        </StoryFrame>
      </Stack>
      <Frame
        contentStyle={{ padding: "0.75rem 1rem" }}
        slotStyles={{
          body: { background: "#202020" },
          title: { background: "black", color: "yellow" }
        }}
        title="Slot Overrides"
        titleProps={{
          background: "black",
          borderColor: "black",
          color: "yellow"
        }}
      >
        <Info>
          This frame overrides its internal slots through{" "}
          <InfoAccent bold>slotStyles</InfoAccent> while the global theme still
          drives the rest of the chrome.
        </Info>
      </Frame>
      <Panel footer="Footer strip" inset title="Panel Chrome">
        <Info>
          Panel header, inset body, shadow density, and title compression should
          stay readable under every theme and font preset.
        </Info>
      </Panel>
    </StoryStack>
  )
};

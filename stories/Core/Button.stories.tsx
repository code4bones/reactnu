import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack } from "@deadragdoll/reactnu";
import { StoryPanel, StoryRow, StoryStack } from "../helpers/StoryLayout";

const meta = {
  component: Button,
  title: "Core/Button",
  tags: ["autodocs"],
  args: {
    children: "Continue"
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

function ButtonStoryCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        height: "fit-content",
        width: "fit-content"
      }}
    >
      {children}
    </div>
  );
}

export const Variants: Story = {
  render: (args) => (
    <ButtonStoryCanvas>
      <StoryPanel compact title="Variants">
        <StoryRow>
          <Button {...args}>Primary</Button>
          <Button {...args} variant="secondary">
            Secondary
          </Button>
          <Button {...args} variant="danger">
            Danger
          </Button>
          <Button {...args} variant="success">
            Success
          </Button>
          <Button {...args} disabled>
            Disabled
          </Button>
        </StoryRow>
      </StoryPanel>
    </ButtonStoryCanvas>
  )
};

export const EventsAndFocus: Story = {
  render: () => {
    const [log, setLog] = useState("No events yet");

    return (
      <ButtonStoryCanvas>
        <StoryStack>
          <StoryPanel compact title="Events And Focus">
            <Stack gap="md">
              <StoryRow>
                <Button
                  defaultFocused
                  onClick={() => setLog("Primary button clicked")}
                >
                  Run
                </Button>
                <Button
                  onClick={() => setLog("Secondary button clicked")}
                  variant="secondary"
                >
                  Preview
                </Button>
              </StoryRow>
              <div>{log}</div>
            </Stack>
          </StoryPanel>
        </StoryStack>
      </ButtonStoryCanvas>
    );
  }
};

export const SlotCustomization: Story = {
  render: () => (
    <ButtonStoryCanvas>
      <StoryPanel compact title="Slot Customization">
        <Button
          slotStyles={{
            face: { background: "#000000", color: "#ffff55" },
            shadowBottom: { background: "rgb(0 0 0 / 0.2)" },
            shadowRight: { background: "rgb(0 0 0 / 0.2)" }
          }}
        >
          Custom Slot Face
        </Button>
      </StoryPanel>
    </ButtonStoryCanvas>
  )
};

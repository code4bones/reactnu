import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CommandButton,
  Frame,
  Info,
  InfoAccent,
  PageControl,
  Stack,
  ToolBar,
  ToolButton,
  ToolDropButton,
  ToolSeparator
} from "@deadragdoll/reactnu";
import { toolbarMenu } from "../helpers/storyData";
import { StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Navigation/PageControl And ToolBar",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function OverviewStory() {
    const [log, setLog] = useState("No toolbar command yet");
    const [watch, setWatch] = useState(true);

    return (
      <StoryStack>
        <StoryPanel title="CommandButton">
          <Stack gap="md">
            <Stack direction="row" gap="sm">
              <CommandButton
                icon="folder"
                onClick={() => setLog("Standalone scan clicked")}
              >
                &Scan
              </CommandButton>
              <CommandButton icon="star" toggled={watch}>
                &Watch
              </CommandButton>
              <CommandButton
                icon="gear"
                menuItems={toolbarMenu}
                onMenuItemSelect={(item) =>
                  setLog(`CommandButton selected ${String(item.id)}`)
                }
              >
                &Export
              </CommandButton>
            </Stack>
            <Info>
              Command button state: <InfoAccent>{log}</InfoAccent>
            </Info>
          </Stack>
        </StoryPanel>
        <StoryPanel title="ToolBar">
          <Stack gap="md">
            <ToolBar>
              <ToolButton icon="folder" onClick={() => setLog("Scan clicked")}>
                &Scan
              </ToolButton>
              <ToolButton
                icon="star"
                onClick={() => setWatch((current) => !current)}
                pressed={watch}
              >
                &Watch
              </ToolButton>
              <ToolSeparator />
              <ToolDropButton
                icon="gear"
                menuItems={toolbarMenu}
                onMenuItemSelect={(item) =>
                  setLog(`Selected ${String(item.id)}`)
                }
              >
                &Export
              </ToolDropButton>
            </ToolBar>
            <Info>
              Toolbar state: <InfoAccent>{log}</InfoAccent>, watch=
              <InfoAccent>{String(watch)}</InfoAccent>
            </Info>
            <div style={{ width: "100%" }}>
              <ToolBar wrap>
                <ToolButton icon="folder">&Scan</ToolButton>
                <ToolButton icon="star" pressed={watch}>
                  &Watch
                </ToolButton>
                <ToolButton icon="gear">&Trace</ToolButton>
                <ToolDropButton icon="gear" menuItems={toolbarMenu}>
                  &Export
                </ToolDropButton>
                <ToolButton>&Repair</ToolButton>
                <ToolButton>&Verify</ToolButton>
              </ToolBar>
            </div>
          </Stack>
        </StoryPanel>
        <StoryPanel title="PageControl">
          <PageControl
            pages={[
              {
                content: (
                  <Frame
                    contentStyle={{ padding: "0.75rem 1rem" }}
                    fill
                    title="Summary"
                  >
                    <Info>
                      Current target is <InfoAccent bold>Drive C:</InfoAccent>.
                    </Info>
                  </Frame>
                ),
                id: "summary",
                label: "&Summary"
              },
              {
                content: (
                  <Frame
                    contentStyle={{ padding: "0.75rem 1rem" }}
                    fill
                    title="Actions"
                  >
                    <Stack direction="row" gap="sm">
                      <Button>&Run</Button>
                      <Button variant="secondary">&Preview</Button>
                    </Stack>
                  </Frame>
                ),
                id: "actions",
                label: "&Actions"
              },
              {
                content: (
                  <Frame
                    contentStyle={{ padding: "0.75rem 1rem" }}
                    fill
                    title="Archive"
                  >
                    <Info>
                      Archive remains <InfoAccent>disabled</InfoAccent>.
                    </Info>
                  </Frame>
                ),
                disabled: true,
                id: "archive",
                label: "&Archive"
              }
            ]}
          />
        </StoryPanel>
      </StoryStack>
    );
  }
};

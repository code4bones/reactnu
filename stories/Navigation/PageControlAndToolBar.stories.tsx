import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CommandButton,
  Info,
  InfoAccent,
  NuView,
  PageControl,
  Spacer,
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
              <Spacer />
              <ToolDropButton
                icon="gear"
                menuItems={toolbarMenu}
                onMenuItemSelect={(item) =>
                  setLog(`Selected ${String(item.id)}`)
                }
              >
                &Export
              </ToolDropButton>
              <ToolButton icon="gear">&Help</ToolButton>
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
                  <NuView>
                    <Info>
                      Current target is <InfoAccent bold>Drive C:</InfoAccent>.
                    </Info>
                  </NuView>
                ),
                id: "summary",
                label: "&Summary"
              },
              {
                content: (
                  <NuView>
                    <Stack direction="row" gap="sm">
                      <Button>&Run</Button>
                      <Button variant="secondary">&Preview</Button>
                    </Stack>
                  </NuView>
                ),
                id: "actions",
                label: "&Actions"
              },
              {
                content: (
                  <NuView>
                    <Info>
                      Archive remains <InfoAccent>disabled</InfoAccent>.
                    </Info>
                  </NuView>
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

export const Overflow: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <PageControl
        pages={[
          {
            content: <NuView>Summary page content.</NuView>,
            id: "summary",
            label: "&Summary"
          },
          {
            content: <NuView>Actions page content.</NuView>,
            id: "actions",
            label: "&Actions"
          },
          {
            content: <NuView>Archive page content.</NuView>,
            id: "archive",
            label: "&Archive"
          },
          {
            content: <NuView>Reports page content.</NuView>,
            id: "reports",
            label: "&Reports"
          },
          {
            content: <NuView>Schedule page content.</NuView>,
            id: "schedule",
            label: "&Schedule"
          },
          {
            content: <NuView>History page content.</NuView>,
            id: "history",
            label: "&History"
          }
        ]}
      />
    </div>
  )
};

export const ToolBarOverflow: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <ToolBar>
        <ToolButton icon="folder">&Scan</ToolButton>
        <ToolButton icon="star">&Watch</ToolButton>
        <ToolButton icon="gear">&Trace</ToolButton>
        <ToolDropButton icon="gear" menuItems={toolbarMenu}>
          &Export
        </ToolDropButton>
        <ToolButton>&Verify</ToolButton>
        <ToolButton>&Repair</ToolButton>
        <ToolButton>&Defragment</ToolButton>
      </ToolBar>
    </div>
  )
};

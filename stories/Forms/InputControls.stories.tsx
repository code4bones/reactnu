import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckBox,
  MaskedField,
  Memo,
  RadioGroup,
  SpinBox,
  Stack,
  TextField,
  TickBar
} from "@deadragdoll/reactnu";
import { StoryPanel, StoryStack } from "../helpers/StoryLayout";

const meta = {
  title: "Forms/Input Controls",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function OverviewStory() {
    const [name, setName] = useState("NORTON");
    const [checked, setChecked] = useState(true);
    const [spin, setSpin] = useState(3);
    const [tick, setTick] = useState(40);
    const [mode, setMode] = useState("safe");
    const [memo, setMemo] = useState(
      "Diagnostics will be written to ARCHIVE.LOG"
    );

    return (
      <StoryStack>
        <StoryPanel title="Text And Masked Input">
          <Stack gap="md">
            <TextField
              hint="Debounced and immediate text input."
              label="Module"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <MaskedField
              hint="Readable mask grammar."
              label="Recovery code"
              mask="(D3-D2-D2)"
            />
          </Stack>
        </StoryPanel>
        <StoryPanel title="Boolean And Choice">
          <Stack gap="md">
            <CheckBox
              checked={checked}
              hint="Check events are reflected below."
              label="Watch mode"
              onCheckedChange={(nextChecked) => setChecked(nextChecked)}
            />
            <RadioGroup
              label="Verification mode"
              onValueChange={setMode}
              options={[
                { label: "&Safe", value: "safe" },
                { label: "&Wide", value: "wide" },
                { label: "&Deep", value: "deep" }
              ]}
              value={mode}
            />
          </Stack>
        </StoryPanel>
        <StoryPanel title="Numeric And Range">
          <Stack gap="md">
            <SpinBox
              hint="Arrow keys and buttons clamp to bounds."
              label="Retry count"
              max={12}
              min={0}
              onValueChange={setSpin}
              value={spin}
            />
            <TickBar
              hint="Horizontal slider with visible marks."
              label="Threshold"
              max={100}
              min={0}
              onValueChange={setTick}
              step={5}
              value={tick}
            />
          </Stack>
        </StoryPanel>
        <StoryPanel title="Memo Surface">
          <Stack gap="md">
            <Memo
              content={memo}
              focusBackground="#8ddbcd"
              hint="Editable note surface"
              onValueChange={setMemo}
            />
            <div>
              State: name={name}, checked={String(checked)}, mode={mode},
              retries={spin}, threshold={tick}
            </div>
          </Stack>
        </StoryPanel>
      </StoryStack>
    );
  }
};

export const VerticalTickBar: Story = {
  render: function VerticalTickBarStory() {
    const [gain, setGain] = useState(7);

    return (
      <StoryPanel compact title="Vertical TickBar">
        <TickBar
          hint="Vertical mode keeps max at the top."
          label="Gain"
          max={10}
          min={0}
          onValueChange={setGain}
          orientation="vertical"
          step={1}
          tickCount={11}
          value={gain}
        />
      </StoryPanel>
    );
  }
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NuDragDropProvider,
  NuGlyph,
  NuIconGrid,
  NuIconProvider
} from "@deadragdoll/reactnu";

const meta = {
  title: "Desktop/IconGrid",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applications: Story = {
  render: () => (
    <div
      style={{
        height: "22rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)",
        backgroundImage: "var(--nu-desktop-pattern-image)",
        backgroundRepeat: "var(--nu-desktop-pattern-repeat)",
        backgroundSize: "var(--nu-desktop-pattern-size)"
      }}
    >
      <NuIconProvider
        defaultIcons={[
          {
            icon: (
              <NuGlyph
                name="gear"
                style={{ blockSize: "3rem", inlineSize: "3rem" }}
              />
            ),
            id: "diagnostics",
            label: "&Diagnostics"
          },
          {
            icon: (
              <NuGlyph
                name="folder"
                style={{ blockSize: "3rem", inlineSize: "3rem" }}
              />
            ),
            id: "reports",
            label: "&Reports"
          },
          {
            icon: (
              <NuGlyph
                name="star"
                style={{ blockSize: "3rem", inlineSize: "3rem" }}
              />
            ),
            id: "favorites",
            label: "&Favorites"
          }
        ]}
      >
        <NuIconGrid
          contextMenuItems={(icons) => [
            {
              id: "arrange",
              items: [
                {
                  id: "arrange-columns",
                  onSelect: () => icons.arrangeIcons("columns"),
                  text: "&Columns"
                },
                {
                  id: "arrange-name",
                  onSelect: () => icons.arrangeIcons("name"),
                  text: "&Name"
                }
              ],
              text: "&Arrange icons"
            }
          ]}
        />
      </NuIconProvider>
    </div>
  )
};

export const CrossGridTransfer: Story = {
  render: () => (
    <NuDragDropProvider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          height: "22rem"
        }}
      >
        <NuIconProvider
          defaultIcons={[
            {
              icon: <NuGlyph name="folder" />,
              id: "incoming-report",
              label: "&Incoming report",
              payload: { queue: "incoming" }
            }
          ]}
        >
          <NuIconGrid aria-label="Incoming icons" />
        </NuIconProvider>
        <NuIconProvider>
          <NuIconGrid aria-label="Processed icons" />
        </NuIconProvider>
      </div>
    </NuDragDropProvider>
  )
};

export const SharedIconDrop: Story = {
  render: function SharedIconDropStory() {
    const [lastDrop, setLastDrop] = useState(
      "Drop an icon on the target grid."
    );

    return (
      <NuDragDropProvider>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr 1fr",
            height: "22rem"
          }}
        >
          <NuIconProvider
            defaultIcons={[
              {
                icon: <NuGlyph name="folder" />,
                id: "source-report",
                label: "&Source report",
                payload: { source: "incoming" }
              }
            ]}
          >
            <NuIconGrid aria-label="Source icons" />
          </NuIconProvider>
          <NuIconProvider>
            <NuIconGrid
              acceptsDrop={() => true}
              aria-label="Generic icon drop target"
              onDrop={(item) => {
                setLastDrop(`Received ${item.id} through onDrop.`);
                return { action: "copy" };
              }}
            />
          </NuIconProvider>
        </div>
        <small>{lastDrop}</small>
      </NuDragDropProvider>
    );
  }
};

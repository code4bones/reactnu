import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Info,
  InfoAccent,
  MainMenu,
  MainMenuNode,
  NuGlyph,
  NuWindowProvider,
  StatusBarItem,
  Stack,
  Window,
  useNuWindowManager
} from "@deadragdoll/reactnu";
import { useWindowMenu } from "../../packages/ui/src/components/Window/windowMenuContext";
import { StoryFrame } from "../helpers/StoryLayout";

const meta = {
  title: "Desktop/Windowing",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const desktopMenuItems: MainMenuNode[] = [
  {
    id: "file",
    text: "&File",
    items: [
      { id: "file-new", text: "&New workspace" },
      {
        id: "file-export",
        text: "E&xport",
        items: [
          { id: "file-export-text", text: "&Text report" },
          {
            id: "file-export-binary",
            text: "&Binary package",
            items: [
              { id: "file-export-binary-zip", text: "&Zip archive" },
              { id: "file-export-binary-tar", text: "&Tar bundle" }
            ]
          }
        ]
      },
      { id: "file-exit", text: "E&xit" }
    ]
  },
  {
    id: "view",
    text: "&View",
    items: [
      { id: "view-wide", text: "&Wide layout", checkable: true, checked: true },
      {
        id: "view-columns",
        text: "&Columns",
        items: [
          { id: "view-columns-left", text: "&Left" },
          { id: "view-columns-right", text: "&Right" },
          {
            id: "view-columns-advanced",
            text: "A&dvanced",
            items: [
              { id: "view-columns-advanced-grid", text: "&Grid" },
              { id: "view-columns-advanced-compact", text: "&Compact" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "help",
    text: "&Help",
    items: [{ id: "help-about", text: "&About" }]
  }
];

const windowMenuItems: MainMenuNode[] = [
  {
    id: "scope",
    text: "&Scope",
    items: [
      { id: "scope-active", text: "&Active set" },
      {
        id: "scope-history",
        text: "&History",
        items: [
          { id: "scope-history-today", text: "&Today" },
          {
            id: "scope-history-snapshots",
            text: "&Snapshots",
            items: [
              { id: "scope-history-snapshots-morning", text: "&Morning" },
              { id: "scope-history-snapshots-evening", text: "&Evening" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "actions",
    text: "&Actions",
    items: [
      { id: "actions-run", text: "&Run" },
      { id: "actions-preview", text: "&Preview" }
    ]
  }
];

function WindowMenuSeed({ items }: { items: MainMenuNode[] }) {
  const menu = useWindowMenu();

  useEffect(() => {
    menu.setMainMenu(items);
  }, [items, menu]);

  return null;
}

function DialogLauncherSurface() {
  const windowManager = useNuWindowManager();
  const [result, setResult] = React.useState("No dialog result yet");

  async function openMessageBox() {
    const nextResult = await windowManager.showMessageBox({
      message: "Archive operation completed successfully.",
      okLabel: "&Acknowledge",
      preset: "ok",
      title: "Information"
    });

    setResult(`MessageBox: ${nextResult}`);
  }

  async function openErrorBox() {
    const nextResult = await windowManager.showMessageBox({
      kind: "error",
      message: "Device 3A did not respond within the expected timeout window.",
      preset: "yes-no-cancel",
      title: "Danger"
    });

    setResult(`ErrorBox: ${nextResult}`);
  }

  async function openInputBox() {
    const nextResult = await windowManager.showInputBox({
      defaultValue: "NODE-07",
      hint: "Provide the node label used for the next diagnostics run.",
      label: "Node name",
      title: "Input"
    });

    setResult(
      nextResult === null ? "InputBox: cancelled" : `InputBox: ${nextResult}`
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <StoryFrame title="Dialog Launchers">
        <Stack gap="md">
          <Stack direction="row" gap="sm">
            <Button onClick={openMessageBox} variant="secondary">
              Open &message box
            </Button>
            <Button onClick={openErrorBox} variant="danger">
              Open &danger box
            </Button>
            <Button onClick={openInputBox} variant="secondary">
              Open &input box
            </Button>
          </Stack>
          <Info>
            Last result: <InfoAccent>{result}</InfoAccent>
          </Info>
        </Stack>
      </StoryFrame>
    </div>
  );
}

function LinkedActivationLauncher() {
  const windowManager = useNuWindowManager();

  function openLinkedWindows() {
    const activationGroup = "story-linked-windows";

    windowManager.openWindow({
      activationGroup,
      content: <div style={{ padding: "0.75rem 1rem" }}>Overview</div>,
      style: {
        height: "12rem",
        left: "8%",
        top: "12%",
        transform: "none",
        width: "22rem"
      },
      title: "Linked overview"
    });
    windowManager.openWindow({
      activationGroup,
      content: <div style={{ padding: "0.75rem 1rem" }}>Inspector</div>,
      style: {
        height: "12rem",
        left: "52%",
        top: "42%",
        transform: "none",
        width: "22rem"
      },
      title: "Linked inspector"
    });
    windowManager.openWindow({
      content: <div style={{ padding: "0.75rem 1rem" }}>Independent</div>,
      style: {
        height: "10rem",
        left: "30%",
        top: "68%",
        transform: "none",
        width: "22rem"
      },
      title: "Independent window"
    });
  }

  return (
    <div style={{ padding: "1rem" }}>
      <Button onClick={openLinkedWindows}>Open &linked windows</Button>
    </div>
  );
}

function PersistedWindowLauncher() {
  const windowManager = useNuWindowManager();

  function openInspector() {
    windowManager.openWindow({
      content: (
        <div style={{ padding: "0.75rem 1rem" }}>
          Move or resize this window, close it, then open it again. Its geometry
          is restored from localStorage.
        </div>
      ),
      style: {
        height: "14rem",
        left: "18%",
        top: "20%",
        transform: "none",
        width: "26rem"
      },
      title: "Persisted inspector",
      windowStoreKey: "storybook.persisted-inspector"
    });
  }

  return (
    <div style={{ padding: "1rem" }}>
      <Button onClick={openInspector}>Open &persisted inspector</Button>
    </div>
  );
}

function AspectRatioWindow() {
  const [size, setSize] = React.useState({ height: 216, width: 384 });

  return (
    <Window
      active
      aspectRatio={16 / 9}
      icon={<NuGlyph name="gear" />}
      minHeight={144}
      minWidth={256}
      mode="window"
      onSizeChange={setSize}
      statusBar="Drag the resize handle"
      style={{
        ...size,
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
      title="Fixed ratio preview"
    >
      <div style={{ display: "grid", height: "100%", placeItems: "center" }}>
        16:9 content remains proportional
      </div>
    </Window>
  );
}

export const WindowShell: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "32rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)",
        backgroundImage: "var(--nu-desktop-pattern-image)",
        backgroundSize: "var(--nu-desktop-pattern-size)",
        backgroundRepeat: "var(--nu-desktop-pattern-repeat)"
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <MainMenu items={desktopMenuItems} />
        <Window
          active
          icon={<NuGlyph name="gear" />}
          mode="window"
          statusBar={<StatusBarItem>Ready Geometry test</StatusBarItem>}
          style={{
            height: 320,
            left: 32,
            top: 48,
            width: 420,
            position: "absolute"
          }}
          title="Diagnostics"
        >
          <WindowMenuSeed items={windowMenuItems} />
          <div style={{ padding: "0.75rem 1rem" }}>
            <Stack gap="sm">
              <div>
                Direct `Window` story for title bar, shadow, status strip, body
                fill, and embedded window-level menu.
              </div>
              <div>
                Open Scope -&gt; History -&gt; Snapshots to verify nested
                submenu geometry.
              </div>
            </Stack>
          </div>
        </Window>
        <Window
          active={false}
          mode="dialog"
          style={{
            height: 160,
            left: 300,
            top: 210,
            width: 260,
            position: "absolute"
          }}
          title="Confirm"
        >
          <div style={{ padding: "0.75rem 1rem" }}>
            Secondary inactive dialog for contrast.
          </div>
        </Window>
      </div>
    </div>
  )
};

export const NestedMainMenu: Story = {
  render: () => <MainMenu items={desktopMenuItems} />
};

export const Dialogs: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "52rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)",
        backgroundImage: "var(--nu-desktop-pattern-image)",
        backgroundSize: "var(--nu-desktop-pattern-size)",
        backgroundRepeat: "var(--nu-desktop-pattern-repeat)"
      }}
    >
      <NuWindowProvider renderAppBar={false}>
        <DialogLauncherSurface />
      </NuWindowProvider>
    </div>
  )
};

export const LinkedActivation: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "42rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)"
      }}
    >
      <NuWindowProvider renderAppBar={false}>
        <LinkedActivationLauncher />
      </NuWindowProvider>
    </div>
  )
};

export const ManagedWindowPersistence: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "42rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)"
      }}
    >
      <NuWindowProvider renderAppBar={false}>
        <PersistedWindowLauncher />
      </NuWindowProvider>
    </div>
  )
};

export const AspectRatioResize: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "32rem",
        overflow: "hidden",
        backgroundColor: "var(--nu-desktop-bg)"
      }}
    >
      <AspectRatioWindow />
    </div>
  )
};

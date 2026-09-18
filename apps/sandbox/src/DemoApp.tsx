import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  Bell,
  BookOpen,
  CircleHelp,
  FolderCog,
  FolderOpen,
  FolderPlus,
  KeyRound,
  LogOut,
  Palette,
  PanelsTopLeft,
  ScanSearch,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wrench
} from "lucide-react";
import {
  Button,
  CheckBox,
  CommandButton,
  ComboBox,
  Dashboard,
  Dropdown,
  Frame,
  Info,
  InfoAccent,
  NuIconGrid,
  NuIconProvider,
  ListBox,
  ListView,
  MaskedField,
  Memo,
  NuGlyph,
  PageControl,
  Panel,
  PopupMenu,
  PropertyGrid,
  ProgressBar,
  RadioGroup,
  ReportCell,
  SearchBox,
  SpinBox,
  Splitter,
  StatusBarItem,
  Stack,
  TickBar,
  TextField,
  ToolBar,
  ToolButton,
  ToolDropButton,
  ToolSeparator,
  TreeListView,
  TreeView,
  NuView,
  useAppHostMenu,
  useNuWindowManager,
  usePopupMenu,
  getMaskedFieldState,
  nuThemes,
  useNuTheme,
  useWindowMenu
} from "@deadragdoll/reactnu";
import type {
  ListViewColumn,
  ListViewRowBase,
  MainMenuNode,
  NuDesktopPatternMode,
  NuManagedWindowDefinition,
  TreeListColumn,
  TreeListItemBase,
  TreeItem
} from "@deadragdoll/reactnu";
import { ThemeDesignerWindow } from "./ThemeDesignerWindow";
import { useSandboxThemeDesigner } from "./themeDesigner";

function SandboxWindowView({ children }: { children: ReactNode }) {
  return <NuView padding="cell">{children}</NuView>;
}

function ApplicationIconGraphic({
  color,
  label
}: {
  color: string;
  label: string;
}) {
  return (
    <svg aria-label={label} role="img" viewBox="0 0 32 32">
      <rect
        fill={color}
        height="26"
        stroke="currentColor"
        width="28"
        x="2"
        y="3"
      />
      <path
        d="M7 9 H25 M7 15 H20 M7 21 H23"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconTransferWindowContent() {
  return (
    <NuIconProvider
      defaultIcons={[
        {
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-color-button-success)"
              label="Drop target"
            />
          ),
          id: "drop-target",
          label: "Drop &here"
        }
      ]}
    >
      <NuIconGrid
        aria-label="Icon transfer target"
        defaultArrangeMode="columns"
      />
    </NuIconProvider>
  );
}

function ApplicationsWindowContent() {
  const windowManager = useNuWindowManager();

  function openApplication(title: string, message: string) {
    windowManager.openWindow({
      content: () => (
        <NuView padding="cell">
          <Stack gap="md">
            <p className="sandbox-copy">{message}</p>
            <p className="sandbox-copy">
              This managed window was opened from an Applications icon.
            </p>
          </Stack>
        </NuView>
      ),
      domain: title,
      icon: <NuGlyph name="folder" />,
      statusBar: "Opened from Applications  Alt+F3 Close",
      style: {
        height: "15rem",
        width: "28rem"
      },
      title
    });
  }

  function openIconTransferWindow(sourceTitle: string) {
    windowManager.openWindow({
      content: () => <IconTransferWindowContent />,
      domain: "Icon transfer",
      icon: <NuGlyph name="folder" />,
      statusBar: "Drag an Applications icon here to transfer it  Alt+F3 Close",
      style: {
        height: "20rem",
        width: "24rem"
      },
      title: `${sourceTitle} — Icon transfer`
    });
  }

  return (
    <NuIconProvider
      defaultIcons={[
        {
          contextMenuItems: [
            {
              id: "applications-diagnostics-open",
              onSelect: () =>
                openApplication(
                  "Diagnostics",
                  "Diagnostics is ready to inspect volumes and memory."
                ),
              text: "&Open"
            }
          ],
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-color-title-bg)"
              label="Diagnostics"
            />
          ),
          id: "diagnostics",
          label: "&Diagnostics",
          onDoubleClick: () => openIconTransferWindow("Diagnostics")
        },
        {
          contextMenuItems: [
            {
              id: "applications-disk-map-open",
              onSelect: () =>
                openApplication(
                  "Disk Map",
                  "Disk Map is ready to inspect allocation regions."
                ),
              text: "&Open"
            }
          ],
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-text-hotkey)"
              label="Disk Map"
            />
          ),
          id: "disk-map",
          label: "Disk &Map",
          onDoubleClick: () => openIconTransferWindow("Disk Map")
        },
        {
          contextMenuItems: [
            {
              id: "applications-reports-open",
              onSelect: () =>
                openApplication(
                  "Reports",
                  "Reports is ready to export the latest maintenance run."
                ),
              text: "&Open"
            }
          ],
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-color-button-face)"
              label="Reports"
            />
          ),
          id: "reports",
          label: "&Reports",
          onDoubleClick: () => openIconTransferWindow("Reports")
        },
        {
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-color-button-success)"
              label="System Maintenance and Recovery Console"
            />
          ),
          id: "maintenance-console",
          label: "System &Maintenance and Recovery Console",
          onDoubleClick: () => openIconTransferWindow("Maintenance Console")
        },
        {
          icon: (
            <ApplicationIconGraphic
              color="var(--nu-color-button-danger)"
              label="UltraLongApplicationIdentifierWithoutSpaces"
            />
          ),
          id: "long-identifier",
          label: "UltraLongApplicationIdentifierWithoutSpaces",
          onDoubleClick: () => openIconTransferWindow("Long Identifier")
        }
      ]}
    >
      <NuIconGrid
        defaultArrangeMode="columns"
        contextMenuItems={(iconManager) => [
          {
            id: "applications-arrange-icons",
            items: [
              {
                id: "applications-arrange-columns",
                onSelect: () => iconManager.arrangeIcons("columns"),
                text: "&Columns"
              },
              {
                id: "applications-arrange-rows",
                onSelect: () => iconManager.arrangeIcons("rows"),
                text: "&Rows"
              },
              {
                id: "applications-arrange-name",
                onSelect: () => iconManager.arrangeIcons("name"),
                text: "&Name"
              }
            ],
            text: "&Arrange icons"
          }
        ]}
      />
    </NuIconProvider>
  );
}

const SANDBOX_FONT_OPTIONS = [
  {
    id: "ibm-plex",
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", "Cascadia Mono", "Consolas", monospace'
  },
  {
    id: "cascadia",
    label: "Cascadia Mono",
    value: '"Cascadia Mono", "IBM Plex Mono", "Consolas", monospace'
  },
  {
    id: "consolas",
    label: "Consolas",
    value: '"Consolas", "Cascadia Mono", "IBM Plex Mono", monospace'
  },
  {
    id: "lucida-console",
    label: "Lucida Console",
    value: '"Lucida Console", "Consolas", "Cascadia Mono", monospace'
  },
  {
    id: "courier-new",
    label: "Courier New",
    value: '"Courier New", "Lucida Console", monospace'
  },
  {
    id: "comic-sans",
    label: "Comic Sans MS",
    value: '"Comic Sans MS", "Comic Sans", cursive'
  },
  {
    id: "fixedsys",
    label: "Fixedsys",
    value: '"Fixedsys Excelsior 3.01", "Fixedsys", "Lucida Console", monospace'
  }
] as const;

const SANDBOX_FONT_SIZE_OPTIONS = [
  { id: "13", label: "13 px", value: 13 },
  { id: "14", label: "14 px", value: 14 },
  { id: "15", label: "15 px", value: 15 },
  { id: "16", label: "16 px", value: 16 },
  { id: "18", label: "18 px", value: 18 }
] as const;

const SANDBOX_TYPOGRAPHY_PRESETS = [
  {
    id: "comic-ui",
    label: "Comic UI",
    fontId: "comic-sans",
    sizeId: "16"
  },
  {
    id: "classic-mono",
    label: "Classic Mono",
    fontId: "ibm-plex",
    sizeId: "16"
  },
  {
    id: "dense-mono",
    label: "Dense Mono",
    fontId: "cascadia",
    sizeId: "14"
  },
  {
    id: "fixedsys",
    label: "Fixedsys",
    fontId: "fixedsys",
    sizeId: "15"
  }
] as const;

const SANDBOX_WORKSPACE_PATTERN_OPTIONS = [
  {
    id: "dot-grid",
    backgroundImage:
      "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
    backgroundSize: "4px 4px",
    label: "Dot grid"
  },
  {
    id: "dense-dots",
    backgroundImage:
      "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
    backgroundSize: "3px 3px",
    label: "Dense dots"
  },
  {
    id: "coarse-dots",
    backgroundImage:
      "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
    backgroundSize: "6px 6px",
    label: "Coarse dots"
  },
  {
    id: "grid",
    backgroundImage:
      "linear-gradient(var(--nu-desktop-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--nu-desktop-pattern) 1px, transparent 1px)",
    backgroundSize: "6px 6px",
    label: "Grid"
  },
  {
    id: "solid",
    backgroundImage: "none",
    backgroundSize: "auto",
    label: "Solid"
  }
] as const;

const SANDBOX_SEARCH_RECORDS = [
  {
    id: "station-ams",
    location: "Amsterdam",
    name: "Atlas Relay"
  },
  {
    id: "station-ath",
    location: "Athens",
    name: "Argos Node"
  },
  {
    id: "station-ber",
    location: "Berlin",
    name: "Beacon Array"
  },
  {
    id: "station-lon",
    location: "London",
    name: "Bridge Watch"
  },
  {
    id: "station-mad",
    location: "Madrid",
    name: "Meridian Core"
  },
  {
    id: "station-prg",
    location: "Prague",
    name: "Pulse Archive"
  },
  {
    id: "station-rig",
    location: "Riga",
    name: "Relay North"
  }
] as const;

function ThemeSwitcher() {
  const { baseThemeName, selectBaseTheme } = useSandboxThemeDesigner();
  const themeNames = Object.keys(nuThemes) as Array<keyof typeof nuThemes>;

  return (
    <Stack direction="row" gap="sm">
      {themeNames.map((currentThemeName) => {
        const theme = nuThemes[currentThemeName];

        return (
          <Button
            key={theme.name}
            variant={theme.name === baseThemeName ? "primary" : "secondary"}
            onClick={() => selectBaseTheme(currentThemeName)}
          >
            {theme.label}
          </Button>
        );
      })}
    </Stack>
  );
}

function DesktopMenuSync({
  editorFontFamily,
  editorFontSize
}: {
  editorFontFamily: string;
  editorFontSize: number;
}) {
  const { setMainMenu } = useAppHostMenu();
  const windowManager = useNuWindowManager();

  const openEditorWindow = useCallback(() => {
    windowManager.openWindow({
      content: () => (
        <MonacoEditorWindowContent
          fontFamily={editorFontFamily}
          fontSize={editorFontSize}
        />
      ),
      domain: "Editor",
      icon: <NuGlyph name="folder" />,
      statusBar: "Monaco editor inside Window  File/New opens this workspace",
      style: {
        height: "28rem",
        width: "52rem"
      },
      title: "Editor"
    });
  }, [editorFontFamily, editorFontSize, windowManager]);

  const openThemeDesigner = useCallback(() => {
    windowManager.openWindow({
      content: ({ close }) => <ThemeDesignerWindow onClose={close} />,
      domain: "Theme Designer",
      icon: <NuGlyph name="gear" />,
      statusBar: "Live preview  Export CSS/JSON  Alt+F3 Close",
      style: {
        height: "40rem",
        width: "58rem"
      },
      title: "Theme Designer"
    });
  }, [windowManager]);

  useEffect(() => {
    const desktopMenu: MainMenuNode[] = [
      {
        id: "file",
        items: [
          {
            id: "new",
            icon: <FolderPlus />,
            modifier: "Alt",
            onSelect: openEditorWindow,
            text: "&New workspace"
          },
          {
            icon: <FolderOpen />,
            id: "open",
            modifier: "Alt",
            text: "&Open..."
          },
          { id: "divider-file-1", type: "divider" },
          { icon: <LogOut />, id: "exit", modifier: "Alt", text: "E&xit" }
        ],
        text: "&File"
      },
      {
        id: "edit",
        items: [
          {
            checkable: true,
            checked: true,
            id: "overwrite",
            icon: <Settings />,
            modifier: "Alt",
            text: "&Overwrite mode"
          },
          {
            id: "tools",
            items: [
              {
                id: "tools-compare",
                icon: <ScanSearch />,
                modifier: "Alt",
                text: "&Compare sessions"
              },
              {
                id: "tools-layout",
                items: [
                  {
                    id: "tools-layout-compact",
                    icon: <PanelsTopLeft />,
                    modifier: "Alt",
                    text: "&Compact layout"
                  },
                  {
                    id: "tools-layout-wide",
                    icon: <PanelsTopLeft />,
                    modifier: "Alt",
                    text: "&Wide layout"
                  }
                ],
                icon: <PanelsTopLeft />,
                modifier: "Alt",
                text: "&Layout"
              }
            ],
            icon: <Wrench />,
            modifier: "Alt",
            text: "&Tools"
          },
          {
            icon: <SlidersHorizontal />,
            id: "prefs",
            modifier: "Alt",
            text: "&Preferences..."
          },
          {
            id: "theme-designer",
            icon: <Palette />,
            modifier: "Alt",
            onSelect: openThemeDesigner,
            text: "Theme &designer..."
          }
        ],
        text: "&Edit"
      },
      {
        id: "mdi.host",
        text: "&Window"
      },
      { id: "desktop-menu-spacer", type: "spacer" },
      {
        id: "profile",
        items: [
          { icon: <FolderCog />, id: "profile-settings", text: "&Settings..." },
          { id: "profile-plain", text: "&Plain entry" },
          {
            id: "profile-sub-1",
            items: [
              {
                id: "profile-sub-1-2",
                items: [
                  {
                    id: "profile-sub-1-2-3",
                    items: [
                      {
                        id: "profile-sub-1-2-3-4",
                        icon: <Bell />,
                        text: "Sub 1 2 3 &4"
                      }
                    ],
                    icon: <ShieldCheck />,
                    text: "Sub 1 2 &3"
                  }
                ],
                icon: <KeyRound />,
                text: "Sub 1 &2"
              }
            ],
            icon: <Settings />,
            text: "Sub &1"
          }
        ],
        text: "&Profile"
      },
      {
        id: "help",
        items: [
          { icon: <CircleHelp />, id: "about", text: "&About ReactNU" },
          {
            id: "help-sub-1",
            items: [
              {
                id: "help-sub-1-2",
                items: [
                  {
                    id: "help-sub-1-2-3",
                    items: [
                      {
                        id: "help-sub-1-2-3-4",
                        icon: <BookOpen />,
                        text: "Sub 1 2 3 &4"
                      }
                    ],
                    icon: <CircleHelp />,
                    text: "Sub 1 2 &3"
                  }
                ],
                icon: <BookOpen />,
                text: "Sub 1 &2"
              }
            ],
            icon: <CircleHelp />,
            text: "Sub &1"
          }
        ],
        text: "&Help"
      }
    ];

    setMainMenu(desktopMenu);

    return () => {
      setMainMenu([]);
    };
  }, [openEditorWindow, openThemeDesigner, setMainMenu]);

  return null;
}

function ActivityWindowMenu() {
  const { setMainMenu } = useWindowMenu();

  useEffect(() => {
    const windowMenu: MainMenuNode[] = [
      {
        id: "file",
        items: [
          { id: "save-log", shortcut: "F2", text: "&Save log" },
          { id: "print-log", text: "&Print..." },
          { id: "divider-log-1", type: "divider" },
          { id: "close-log", shortcut: "Alt+F3", text: "&Close" }
        ],
        text: "&File"
      },
      {
        id: "view",
        items: [
          {
            checkable: true,
            checked: true,
            id: "show-warnings",
            modifier: "Alt",
            text: "&Warnings only"
          },
          {
            id: "sort",
            items: [
              { id: "sort-time", modifier: "Alt", text: "By &time" },
              { id: "sort-name", modifier: "Alt", text: "By &module" },
              {
                id: "sort-group",
                items: [
                  {
                    id: "sort-group-disk",
                    modifier: "Alt",
                    text: "Group by &disk"
                  },
                  {
                    id: "sort-group-priority",
                    modifier: "Alt",
                    text: "Group by &priority"
                  }
                ],
                modifier: "Alt",
                text: "&Group"
              }
            ],
            modifier: "Alt",
            text: "&Sort"
          }
        ],
        text: "&View"
      },
      {
        id: "help",
        items: [{ id: "window-help", text: "&Window help" }],
        text: "&Help"
      }
    ];

    setMainMenu(windowMenu);

    return () => {
      setMainMenu([]);
    };
  }, [setMainMenu]);

  return null;
}

function ActivityWindowContent({
  onClose,
  onMarkDirty,
  onOpenOwnedModal
}: {
  onClose: () => void;
  onMarkDirty: () => void;
  onOpenOwnedModal: () => void;
}) {
  return (
    <>
      <ActivityWindowMenu />
      <SandboxWindowView>
        <Stack gap="md">
          <p className="sandbox-copy">
            Activity Log collects maintenance output, warnings, and progress
            messages in a scrollable shell.
          </p>
          {Array.from({ length: 12 }, (_, index) => (
            <p className="sandbox-copy" key={`log-line-${index}`}>
              {`0${index}:00  Volume C:  Cluster map verified.  Fragmentation level ${index + 2}%  Status stable.`}
            </p>
          ))}
          <Stack direction="row" gap="sm">
            <Button defaultFocused onClick={onClose}>
              &Close Log
            </Button>
            <Button onClick={onMarkDirty} variant="secondary">
              &Mark Dirty
            </Button>
            <Button onClick={onOpenOwnedModal} variant="secondary">
              Open &owned modal
            </Button>
          </Stack>
        </Stack>
      </SandboxWindowView>
    </>
  );
}

function CommandsWindowContent() {
  const [commandId, setCommandId] = useState("image");

  return (
    <SandboxWindowView>
      <Frame className="sandbox-list-frame" title="Commands">
        <ListBox
          className="sandbox-listbox"
          data={[
            {
              category: { text: "Recovery" },
              items: [
                {
                  id: "diag",
                  name: { text: "Diagnostics", icon: "□" }
                },
                {
                  id: "doctor",
                  name: { text: "Disk Doctor", icon: "□" }
                },
                {
                  id: "editor",
                  name: { text: "Disk Editor", icon: "□" }
                },
                {
                  id: "image",
                  name: { text: "Image", icon: "□" }
                },
                {
                  id: "tracker",
                  name: { text: "INI Tracker", icon: "□" }
                },
                {
                  id: "rescue",
                  name: { text: "Rescue Disk", icon: "□" }
                }
              ]
            },
            {
              category: { text: "Security" },
              items: [
                {
                  id: "smartcan",
                  name: { text: "SmartCan", icon: "□" }
                },
                { id: "unerase", name: { text: "UnErase", icon: "□" } },
                {
                  id: "unformat",
                  name: { text: "UnFormat", icon: "□" }
                }
              ]
            }
          ]}
          onItemSelect={(item) => {
            if (item.id) {
              setCommandId(item.id);
            }
          }}
          selectedId={commandId}
        />
      </Frame>
    </SandboxWindowView>
  );
}

function UtilitiesWindowContent() {
  const [utilityId, setUtilityId] = useState("nav");
  const [utilityCheckedIds, setUtilityCheckedIds] = useState<string[]>([
    "nav",
    "speed"
  ]);

  return (
    <SandboxWindowView>
      <Frame className="sandbox-list-frame" title="Utilities">
        <ListBox
          className="sandbox-listbox"
          data={[
            {
              category: null,
              items: [
                {
                  id: "batch",
                  name: { text: "Batch Enhancer", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                },
                {
                  id: "nav",
                  name: { text: "Norton AntiVirus", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                },
                {
                  id: "ndd",
                  name: { text: "Norton Disk Doctor", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                },
                {
                  id: "format",
                  name: { text: "Safe Format", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                },
                {
                  id: "speed",
                  name: { text: "Speed Disk", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                },
                {
                  id: "sysinfo",
                  name: { text: "System Information", icon: "□" },
                  checkable: true,
                  details: "3:00p"
                }
              ]
            }
          ]}
          checkedIds={utilityCheckedIds}
          onItemCheckChange={(item, _group, checked) => {
            if (!item.id) {
              return;
            }

            setUtilityCheckedIds((currentIds) =>
              checked
                ? [...currentIds, item.id!]
                : currentIds.filter((currentId) => currentId !== item.id)
            );
          }}
          onItemSelect={(item) => {
            if (item.id) {
              setUtilityId(item.id);
            }
          }}
          rightCheckBox
          selectedId={utilityId}
        />
      </Frame>
    </SandboxWindowView>
  );
}

function CommandPreviewWindowContent() {
  return (
    <SandboxWindowView>
      <Frame
        className="sandbox-list-frame"
        contentStyle={{ padding: "var(--nu-content-inset)" }}
        title="Command Preview"
        variant="title-bar"
      >
        <Stack gap="md">
          <p className="sandbox-copy">
            Alternate frame variant with a solid title bar across the full
            width.
          </p>
          <TextField
            label="Profile"
            defaultValue="DEFAULT.NU"
            hint="Title remains transparent inside the title bar."
          />
        </Stack>
      </Frame>
    </SandboxWindowView>
  );
}

function MonacoEditorWindowContent({
  fontFamily,
  fontSize
}: {
  fontFamily: string;
  fontSize: number;
}) {
  const defaultValue = `type WorkspaceEntry = {
  id: string;
  title: string;
  dirty?: boolean;
};

const workspace: WorkspaceEntry = {
  id: "editor-1",
  title: "New Workspace",
  dirty: false
};

export function activateWorkspace(entry: WorkspaceEntry) {
  return {
    ...entry,
    dirty: true
  };
}
`;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MonacoEditor
        defaultLanguage="typescript"
        defaultValue={defaultValue}
        height="100%"
        options={{
          automaticLayout: true,
          fontFamily,
          fontSize,
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          roundedSelection: false,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            horizontalScrollbarSize: 12,
            useShadows: false,
            verticalScrollbarSize: 12
          },
          scrollBeyondLastLine: false,
          smoothScrolling: false
        }}
        theme="vs-dark"
        width="100%"
      />
    </div>
  );
}

function updateTreeItemChecked<
  T extends { id: string; checked?: boolean; children?: T[] }
>(items: T[], targetId: string, checked: boolean): T[] {
  return items.map((item) => {
    if (item.id === targetId) {
      return {
        ...item,
        checked
      };
    }

    if (!item.children?.length) {
      return item;
    }

    return {
      ...item,
      children: updateTreeItemChecked(item.children, targetId, checked)
    };
  });
}

function TreeViewWindowContent() {
  const [selectedNodeId, setSelectedNodeId] = useState("1");
  const [treeData, setTreeData] = useState<TreeItem[]>([
    {
      title: "Local Disk (C:)",
      id: "1",
      hint: "12.4 GB",
      children: [
        {
          title: "NORTON",
          id: "1-1",
          hint: "utility suite",
          children: [
            {
              title: "NORTONDISKDOCTOR.EXE",
              id: "1-1-1",
              hint: "MON",
              checked: true
            },
            {
              title: "SPEEDDISK.EXE",
              id: "1-1-2",
              hint: "AUTO",
              checked: false,
              icon: <NuGlyph name="gear" />
            },
            {
              title: "LOGS",
              id: "1-1-3",
              hint: "3 files",
              children: [
                {
                  title: "JAN.LOG",
                  id: "1-1-3-1",
                  hint: "44 KB"
                },
                {
                  title: "FEB.LOG",
                  id: "1-1-3-2",
                  hint: "52 KB",
                  icon: <NuGlyph name="star" />
                },
                {
                  title: "SNAPSHOTS",
                  id: "1-1-3-3",
                  hint: "2 maps",
                  icon: <NuGlyph name="folder" />,
                  children: [
                    {
                      title: "SURFACE.001",
                      id: "1-1-3-3-1",
                      hint: "Map A",
                      checked: true,
                      icon: <NuGlyph name="star" />
                    },
                    {
                      title: "SURFACE.002",
                      id: "1-1-3-3-2",
                      hint: "Map B",
                      checked: false
                    }
                  ],
                  expanded: true
                }
              ],
              expanded: true
            },
            {
              title: "MODULES",
              id: "1-1-4",
              hint: "3 loaded",
              icon: <NuGlyph name="folder" />,
              children: [
                {
                  title: "CACHE.NLM",
                  id: "1-1-4-1",
                  hint: "resident",
                  icon: <NuGlyph name="gear" />
                },
                {
                  title: "AUDIT.NLM",
                  id: "1-1-4-2",
                  hint: "watch",
                  checked: true,
                  icon: <NuGlyph name="gear" />
                },
                {
                  title: "VERIFY.NLM",
                  id: "1-1-4-3",
                  hint: "52 KB"
                }
              ],
              expanded: true
            }
          ],
          expanded: true
        },
        {
          title: "DOS",
          id: "1-2",
          hint: "system",
          children: [
            {
              title: "CONFIG.SYS",
              id: "1-2-1",
              hint: "18 KB"
            },
            {
              title: "AUTOEXEC.BAT",
              id: "1-2-2",
              hint: "7 KB"
            },
            {
              title: "DRIVERS",
              id: "1-2-3",
              hint: "2 files",
              children: [
                {
                  title: "ANSI.SYS",
                  id: "1-2-3-1",
                  hint: "console",
                  icon: "D"
                },
                {
                  title: "MOUSE.SYS",
                  id: "1-2-3-2",
                  hint: "input",
                  checked: false,
                  icon: "D"
                }
              ],
              expanded: true
            }
          ]
        },
        {
          title: "Asia Pacific",
          id: "1-3",
          hint: "2 regions",
          icon: <NuGlyph name="folder" />,
          children: [
            {
              title: "Japan",
              id: "1-3-1",
              hint: "2 cities",
              icon: <NuGlyph name="folder" />,
              children: [
                {
                  title: "Tokyo",
                  id: "1-3-1-1",
                  hint: "urban core",
                  checked: true
                },
                {
                  title: "Osaka",
                  id: "1-3-1-2",
                  hint: "bay station",
                  icon: <NuGlyph name="gear" />
                }
              ],
              expanded: true
            },
            {
              title: "Australia",
              id: "1-3-2",
              hint: "2 cities",
              icon: <NuGlyph name="folder" />,
              children: [
                {
                  title: "Sydney",
                  id: "1-3-2-1",
                  hint: "harbor",
                  checked: false,
                  icon: <NuGlyph name="star" />
                },
                {
                  title: "Melbourne",
                  id: "1-3-2-2",
                  hint: "cool change"
                }
              ],
              expanded: true
            }
          ],
          expanded: true
        }
      ],
      expanded: true
    },
    {
      title: "Rescue Disk (A:)",
      id: "2",
      hint: "Recovery",
      children: [
        {
          title: "BOOT.NU",
          id: "2-1",
          hint: "142 KB",
          icon: <NuGlyph name="star" />
        },
        {
          title: "TOOLS",
          id: "2-2",
          hint: "2 files",
          children: [
            {
              title: "FORMAT.NU",
              id: "2-2-1",
              hint: "tool",
              checked: false,
              icon: <NuGlyph name="gear" />
            },
            {
              title: "SURFACE.MAP",
              id: "2-2-2",
              hint: "image",
              icon: <NuGlyph name="folder" />
            }
          ],
          expanded: true
        }
      ]
    }
  ]);

  return (
    <SandboxWindowView>
      <Frame
        className="sandbox-list-frame"
        contentStyle={{ padding: "var(--nu-content-inset)" }}
        title="Tree View"
      >
        <Stack gap="md">
          <p className="sandbox-copy">
            TreeView follows the same selection and checkmark language as the
            other controls, but renders hierarchy connectors with DOS-like
            rails.
          </p>
          <TreeView
            className="sandbox-treeview"
            data={treeData}
            onItemCheckChange={(item, checked) => {
              setTreeData((currentTreeData) =>
                updateTreeItemChecked(currentTreeData, item.id, checked)
              );
            }}
            onItemSelect={(item) => setSelectedNodeId(item.id)}
            selectedId={selectedNodeId}
          />
        </Stack>
      </Frame>
    </SandboxWindowView>
  );
}

type WeatherMetrics = {
  humidity: number;
  temperature: number;
  wind: number;
};

type AggregatedWeatherMetrics = WeatherMetrics & {
  leafCount: number;
};

type SandboxTreeListItem = Omit<TreeListItemBase, "children"> & {
  children?: SandboxTreeListItem[];
  metrics?: WeatherMetrics;
};

function updateWeatherMetrics(
  items: SandboxTreeListItem[]
): SandboxTreeListItem[] {
  return items.map((item) => {
    if (!item.children?.length) {
      if (!item.metrics) {
        return item;
      }

      return {
        ...item,
        metrics: {
          humidity: Math.max(
            20,
            Math.min(
              95,
              Math.round(item.metrics.humidity + (Math.random() * 8 - 4))
            )
          ),
          temperature: Math.max(
            -20,
            Math.min(
              38,
              Number(
                (
                  item.metrics.temperature +
                  (Math.random() * 1.8 - 0.9)
                ).toFixed(1)
              )
            )
          ),
          wind: Math.max(
            0.2,
            Math.min(
              18,
              Number((item.metrics.wind + (Math.random() * 2 - 1)).toFixed(1))
            )
          )
        }
      };
    }

    return {
      ...item,
      children: updateWeatherMetrics(item.children)
    };
  });
}

function collectWeatherMetricsById(
  items: SandboxTreeListItem[]
): Map<string, AggregatedWeatherMetrics> {
  const metricsById = new Map<string, AggregatedWeatherMetrics>();

  function visit(item: SandboxTreeListItem): AggregatedWeatherMetrics {
    if (!item.children?.length) {
      const leafMetrics: AggregatedWeatherMetrics = item.metrics
        ? {
            ...item.metrics,
            leafCount: 1
          }
        : {
            humidity: 0,
            leafCount: 0,
            temperature: 0,
            wind: 0
          };

      metricsById.set(item.id, leafMetrics);
      return leafMetrics;
    }

    const totalMetrics = item.children.reduce<AggregatedWeatherMetrics>(
      (currentMetrics, child) => {
        const childMetrics = visit(child);

        return {
          humidity: currentMetrics.humidity + childMetrics.humidity,
          leafCount: currentMetrics.leafCount + childMetrics.leafCount,
          temperature: currentMetrics.temperature + childMetrics.temperature,
          wind: currentMetrics.wind + childMetrics.wind
        };
      },
      {
        humidity: 0,
        leafCount: 0,
        temperature: 0,
        wind: 0
      }
    );

    const averagedMetrics =
      totalMetrics.leafCount > 0
        ? {
            humidity: totalMetrics.humidity / totalMetrics.leafCount,
            leafCount: totalMetrics.leafCount,
            temperature: totalMetrics.temperature / totalMetrics.leafCount,
            wind: totalMetrics.wind / totalMetrics.leafCount
          }
        : totalMetrics;

    metricsById.set(item.id, averagedMetrics);
    return averagedMetrics;
  }

  items.forEach(visit);

  return metricsById;
}

function TreeListViewWindowContent() {
  const [selectedNodeId, setSelectedNodeId] = useState("1");
  const [treeListData, setTreeListData] = useState<SandboxTreeListItem[]>([
    {
      title: "North America",
      id: "1",
      hint: "2 countries",
      children: [
        {
          title: "Canada",
          id: "1-1",
          hint: "2 cities",
          children: [
            {
              title: "Toronto",
              id: "1-1-1",
              hint: "station east",
              checked: true,
              icon: <NuGlyph name="star" />,
              metrics: {
                humidity: 66,
                temperature: 19.8,
                wind: 4.1
              }
            },
            {
              title: "Vancouver",
              id: "1-1-2",
              hint: "marine layer",
              icon: <NuGlyph name="gear" />,
              metrics: {
                humidity: 74,
                temperature: 16.2,
                wind: 5.6
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        },
        {
          title: "United States",
          id: "1-2",
          hint: "3 cities",
          children: [
            {
              title: "New York",
              id: "1-2-1",
              hint: "metro north",
              checked: false,
              metrics: {
                humidity: 61,
                temperature: 23.4,
                wind: 3.8
              }
            },
            {
              title: "Austin",
              id: "1-2-2",
              hint: "dry heat",
              checked: true,
              icon: <NuGlyph name="star" />,
              metrics: {
                humidity: 41,
                temperature: 31.1,
                wind: 6.3
              }
            },
            {
              title: "Seattle",
              id: "1-2-3",
              hint: "overcast",
              metrics: {
                humidity: 79,
                temperature: 15.4,
                wind: 4.7
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        }
      ],
      expanded: true,
      icon: <NuGlyph name="folder" />
    },
    {
      title: "Europe",
      id: "2",
      hint: "2 regions",
      children: [
        {
          title: "Northern Europe",
          id: "2-1",
          hint: "2 cities",
          children: [
            {
              title: "Stockholm",
              id: "2-1-1",
              hint: "coastal",
              icon: <NuGlyph name="gear" />,
              metrics: {
                humidity: 68,
                temperature: 14.3,
                wind: 5.2
              }
            },
            {
              title: "Helsinki",
              id: "2-1-2",
              hint: "archipelago",
              checked: false,
              metrics: {
                humidity: 71,
                temperature: 12.8,
                wind: 6.1
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        },
        {
          title: "Southern Europe",
          id: "2-2",
          hint: "2 cities",
          children: [
            {
              title: "Rome",
              id: "2-2-1",
              hint: "mediterranean",
              checked: true,
              icon: <NuGlyph name="star" />,
              metrics: {
                humidity: 58,
                temperature: 26.5,
                wind: 3.1
              }
            },
            {
              title: "Madrid",
              id: "2-2-2",
              hint: "dry inland",
              metrics: {
                humidity: 37,
                temperature: 28.9,
                wind: 4.4
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        }
      ],
      expanded: true,
      icon: <NuGlyph name="folder" />
    },
    {
      title: "Asia Pacific",
      id: "3",
      hint: "2 regions",
      children: [
        {
          title: "Japan",
          id: "3-1",
          hint: "2 cities",
          children: [
            {
              title: "Tokyo",
              id: "3-1-1",
              hint: "urban core",
              checked: true,
              metrics: {
                humidity: 64,
                temperature: 24.8,
                wind: 4.9
              }
            },
            {
              title: "Osaka",
              id: "3-1-2",
              hint: "bay station",
              icon: <NuGlyph name="gear" />,
              metrics: {
                humidity: 69,
                temperature: 23.7,
                wind: 5.3
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        },
        {
          title: "Australia",
          id: "3-2",
          hint: "2 cities",
          children: [
            {
              title: "Sydney",
              id: "3-2-1",
              hint: "harbor",
              checked: false,
              icon: <NuGlyph name="star" />,
              metrics: {
                humidity: 57,
                temperature: 21.4,
                wind: 5.8
              }
            },
            {
              title: "Melbourne",
              id: "3-2-2",
              hint: "cool change",
              metrics: {
                humidity: 63,
                temperature: 17.6,
                wind: 7.2
              }
            }
          ],
          expanded: true,
          icon: <NuGlyph name="folder" />
        }
      ],
      expanded: true,
      icon: <NuGlyph name="folder" />
    }
  ]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTreeListData((currentTreeListData) =>
        updateWeatherMetrics(currentTreeListData)
      );
    }, 5000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const weatherMetricsById = useMemo(
    () => collectWeatherMetricsById(treeListData),
    [treeListData]
  );

  const columns = useMemo<TreeListColumn<SandboxTreeListItem>[]>(
    () => [
      {
        id: "name",
        minWidth: 24 * 8,
        title: "&Name",
        tree: true
      },
      {
        align: "end",
        id: "temperature",
        minWidth: 8 * 8,
        title: "&Temp"
      },
      {
        align: "end",
        id: "humidity",
        minWidth: 9 * 8,
        title: "&Humidity"
      },
      {
        align: "end",
        id: "wind",
        minWidth: 9 * 8,
        title: "&Wind"
      }
    ],
    []
  );

  const getWeatherCellContent = useCallback(
    (itemId: string, columnId: string) => {
      const metrics = weatherMetricsById.get(itemId);

      if (!metrics || metrics.leafCount === 0) {
        return (
          <ReportCell align="end" tone="muted">
            -
          </ReportCell>
        );
      }

      switch (columnId) {
        case "temperature":
          return (
            <ReportCell
              align="end"
              tone={metrics.temperature >= 27 ? "danger" : "default"}
            >
              {`${metrics.temperature >= 0 ? "+" : ""}${metrics.temperature.toFixed(1)}C`}
            </ReportCell>
          );
        case "humidity":
          return (
            <ReportCell
              align="end"
              tone={metrics.humidity >= 72 ? "accent" : "muted"}
            >
              {`${Math.round(metrics.humidity)}%`}
            </ReportCell>
          );
        case "wind":
          return (
            <ReportCell
              align="end"
              tone={metrics.wind >= 6.5 ? "success" : "default"}
            >
              {`${metrics.wind.toFixed(1)} m/s`}
            </ReportCell>
          );
        default:
          return undefined;
      }
    },
    [weatherMetricsById]
  );

  const handleTreeListItemCheckChange = useCallback(
    (item: SandboxTreeListItem, checked: boolean) => {
      setTreeListData((currentTreeData) =>
        updateTreeItemChecked(currentTreeData, item.id, checked)
      );
    },
    []
  );

  const handleTreeListItemSelect = useCallback((item: SandboxTreeListItem) => {
    setSelectedNodeId(item.id);
  }, []);

  return (
    <SandboxWindowView>
      <Frame
        className="sandbox-list-frame"
        contentStyle={{ padding: "var(--nu-content-inset)" }}
        title="Tree List View"
      >
        <Stack gap="md">
          <p className="sandbox-copy">
            TreeListView keeps tree geometry under library control while report
            columns are filled by the host. This demo simulates live weather
            telemetry with grouped averages and city-level updates every 5
            seconds.
          </p>
          <TreeListView
            className="sandbox-tree-list-view"
            columnStoreKey="sandbox.weather-tree-table"
            columns={columns}
            data={treeListData}
            getCellContent={getWeatherCellContent}
            onItemCheckChange={handleTreeListItemCheckChange}
            onItemSelect={handleTreeListItemSelect}
            selectedId={selectedNodeId}
          />
        </Stack>
      </Frame>
    </SandboxWindowView>
  );
}

type SandboxListViewRow = ListViewRowBase & {
  modified: string;
  name: string;
  path: string;
  size: string;
  status: string;
  type: string;
};

function ListViewWindowContent() {
  const [selectedRowId, setSelectedRowId] = useState("report-1");
  const [checkedRowIds, setCheckedRowIds] = useState<string[]>([
    "report-1",
    "report-3"
  ]);
  const [rows, setRows] = useState<SandboxListViewRow[]>([
    {
      checked: true,
      id: "report-1",
      modified: "05-08-26  11:42",
      name: "AUTOEXEC.NU",
      path: "C:\\SYSTEM",
      size: "4 KB",
      status: "Ready",
      type: "Profile"
    },
    {
      id: "report-2",
      modified: "05-08-26  11:55",
      name: "CHKDSK.LOG",
      path: "C:\\LOGS",
      size: "18 KB",
      status: "Modified",
      type: "Report"
    },
    {
      checked: true,
      id: "report-3",
      modified: "05-09-26  08:14",
      name: "SURFACE.MAP",
      path: "C:\\MAPS",
      size: "96 KB",
      status: "Ready",
      type: "Map"
    },
    {
      disabled: true,
      id: "report-4",
      modified: "05-09-26  08:20",
      name: "REMOTE.NU",
      path: "\\\\SERVER\\TOOLS",
      size: "12 KB",
      status: "Offline",
      type: "Remote"
    }
  ]);

  const columns: ListViewColumn<SandboxListViewRow>[] = [
    {
      id: "name",
      renderCell: (row) => (
        <span className="sandbox-list-view__name">{`□ ${row.name}`}</span>
      ),
      title: "&Name",
      width: "18ch"
    },
    {
      field: "type",
      id: "type",
      title: "&Type",
      width: "10ch"
    },
    {
      align: "end",
      field: "size",
      id: "size",
      title: "&Size",
      width: "8ch"
    },
    {
      field: "modified",
      id: "modified",
      title: "&Modified",
      width: "16ch"
    },
    {
      field: "status",
      id: "status",
      title: "St&atus",
      width: "10ch"
    }
  ];

  return (
    <SandboxWindowView>
      <Frame
        className="sandbox-list-frame"
        contentStyle={{ padding: "var(--nu-content-inset)" }}
        title="List View"
      >
        <Stack gap="md">
          <p className="sandbox-copy">
            ListView report mode supports fixed columns, row selection, optional
            checkboxes, and per-column custom cell renderers.
          </p>
          <ListView
            checkedIds={checkedRowIds}
            className="sandbox-list-view"
            columns={columns}
            data={rows}
            onRowCheckChange={(row, checked) => {
              setRows((currentRows) =>
                currentRows.map((currentRow) =>
                  currentRow.id === row.id
                    ? {
                        ...currentRow,
                        checked
                      }
                    : currentRow
                )
              );
              setCheckedRowIds((currentIds) =>
                checked
                  ? [...currentIds, row.id]
                  : currentIds.filter((currentId) => currentId !== row.id)
              );
            }}
            onRowDoubleClick={(row) => setSelectedRowId(row.id)}
            onRowSelect={(row) => setSelectedRowId(row.id)}
            selectedId={selectedRowId}
            showCheckBox
          />
        </Stack>
      </Frame>
    </SandboxWindowView>
  );
}

function SplitterWindowContent() {
  return (
    <SandboxWindowView>
      <div className="sandbox-splitter-demo">
        <Splitter
          defaultValue={0.32}
          saveId="sandbox-splitter-main"
          first={
            <NuView className="sandbox-splitter-view" padding="cell">
              <Frame
                className="sandbox-splitter-pane"
                contentStyle={{ padding: "var(--nu-content-inset)" }}
                title="Navigator"
              >
                <Stack gap="md">
                  <p className="sandbox-copy">
                    Left pane stays independent and can host any control or
                    another layout primitive.
                  </p>
                  <TreeView
                    className="sandbox-splitter-treeview"
                    data={[
                      {
                        children: [
                          { id: "nav-system", title: "SYSTEM" },
                          { id: "nav-logs", title: "LOGS" }
                        ],
                        expanded: true,
                        id: "nav-drive-c",
                        title: "Drive C:"
                      },
                      {
                        children: [{ id: "nav-tools", title: "TOOLS" }],
                        expanded: true,
                        id: "nav-drive-d",
                        title: "Rescue Disk (D:)"
                      }
                    ]}
                    selectedId="nav-drive-c"
                  />
                </Stack>
              </Frame>
            </NuView>
          }
          second={
            <Splitter
              defaultValue={0.58}
              orientation="horizontal"
              saveId="sandbox-splitter-nested"
              first={
                <NuView className="sandbox-splitter-view" padding="cell">
                  <Frame
                    className="sandbox-splitter-pane"
                    contentStyle={{ padding: "var(--nu-content-inset)" }}
                    title="Inspector"
                  >
                    <Stack gap="md">
                      <p className="sandbox-copy">
                        Nested splitters are just composition. The right pane
                        hosts another splitter without special-case logic.
                      </p>
                      <TextField
                        defaultValue="C:\\SYSTEM\\SURFACE.MAP"
                        label="Current item"
                      />
                      <ProgressBar
                        label="Integrity scan"
                        max={1}
                        trackBackground="var(--nu-color-button-face-alt)"
                        value={0.63}
                      />
                    </Stack>
                  </Frame>
                </NuView>
              }
              second={
                <NuView className="sandbox-splitter-view" padding="cell">
                  <Frame
                    className="sandbox-splitter-pane"
                    contentStyle={{ padding: "var(--nu-content-inset)" }}
                    title="Status"
                  >
                    <Stack gap="md">
                      <p className="sandbox-copy">
                        Bottom pane shows how a second splitter can be stacked
                        vertically without breaking sizing or drag behavior.
                      </p>
                      <ListBox
                        className="sandbox-splitter-listbox"
                        data={[
                          {
                            category: null,
                            items: [
                              { id: "status-1", name: { text: "Ready" } },
                              {
                                id: "status-2",
                                name: { text: "Nested splitter active" }
                              },
                              {
                                id: "status-3",
                                name: {
                                  text: "Handle supports keyboard arrows"
                                }
                              }
                            ]
                          }
                        ]}
                        selectedId="status-2"
                      />
                    </Stack>
                  </Frame>
                </NuView>
              }
            />
          }
        />
      </div>
    </SandboxWindowView>
  );
}

function ProgressWindowContent() {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setScanProgress((currentValue) => {
        if (currentValue >= 1) {
          return 0;
        }

        return Math.min(1, Number((currentValue + 0.02).toFixed(2)));
      });
    }, 90);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <SandboxWindowView>
      <Frame
        className="sandbox-list-frame"
        contentStyle={{ padding: "var(--nu-content-inset)" }}
        title="Progress"
      >
        <Stack gap="md">
          <ProgressBar
            hint="Scanning allocation map"
            label="Surface scan"
            max={1}
            trackBackground="var(--nu-color-button-face-alt)"
            value={scanProgress}
          />
          <ProgressBar
            hint="Waiting for remote volume"
            indeterminate
            label="Network probe"
            showValue={false}
            trackBackground="var(--nu-color-button-face-alt)"
          />
        </Stack>
      </Frame>
    </SandboxWindowView>
  );
}

function MemoWindowContent() {
  return (
    <SandboxWindowView>
      <Memo
        background="#8ddbcd"
        content={`Operator memo:

- Verify allocation map before repair.
- Run surface scan on removable volumes.
- Archive current weather snapshot after review.

Status:
TreeListView host callbacks now update live report cells without breaking tree geometry.

Warning:
Do not interrupt rebuild while background telemetry sync is active.`}
        focusBackground="#8ddbcd"
      />
    </SandboxWindowView>
  );
}

function MaskedFieldWindowContent() {
  const [queueDepthValue, setQueueDepthValue] = useState("");
  const [queueDepthDebouncedValue, setQueueDepthDebouncedValue] = useState("");
  const queueDepthState = getMaskedFieldState("D3+", queueDepthValue);

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <MaskedField
          defaultValue="7"
          hint="Literal prefix is inserted automatically."
          label="Dial prefix"
          mask="+(D)"
        />
        <MaskedField
          defaultValue="1234567"
          hint="Exact token counts keep the field valid."
          label="Recovery code"
          mask="(D3-D2-D2)"
        />
        <MaskedField
          defaultValue="AB12"
          hint="This one starts invalid on purpose because the mask needs three letters and three digits."
          label="Sector tag"
          mask="A3-D3"
        />
        <MaskedField
          debounceMs={700}
          hint="Three or more digits. Values shorter than three flip the field into the red error state."
          label="Queue depth"
          mask="D3+"
          onChange={(event) => setQueueDepthValue(event.target.value)}
          onDebouncedChange={setQueueDepthDebouncedValue}
          value={queueDepthValue}
        />
        <Frame
          contentStyle={{ padding: "var(--nu-content-inset)" }}
          title="State monitor"
          variant="title-bar"
        >
          <Stack gap="sm">
            <p className="sandbox-copy">
              Immediate value: {queueDepthValue || "<empty>"}
            </p>
            <p className="sandbox-copy">
              Immediate state:{" "}
              {queueDepthValue.length === 0
                ? "empty"
                : queueDepthState.isInvalid
                  ? "invalid"
                  : queueDepthState.isComplete
                    ? "valid"
                    : "pending"}
            </p>
            <p className="sandbox-copy">
              Debounced value: {queueDepthDebouncedValue || "<empty>"}
            </p>
          </Stack>
        </Frame>
        <MaskedField
          hint="Letters only, any length."
          label="Operator code"
          mask="A*"
        />
      </Stack>
    </SandboxWindowView>
  );
}

function InfoWindowContent() {
  return (
    <SandboxWindowView>
      <Stack gap="md">
        <Info>
          Hello, you must <InfoAccent>Accept</InfoAccent> the rules before
          continuing.
        </Info>
        <Info>
          Current profile is <InfoAccent>DEFAULT.NU</InfoAccent> and the active
          target is <InfoAccent>Drive C:</InfoAccent>.
        </Info>
        <Info accentColor="#ffffff">
          Emergency mode will switch to{" "}
          <InfoAccent bold upper>
            read only
          </InfoAccent>{" "}
          after three failed verification passes.
        </Info>
        <Info>
          For bar{" "}
          <InfoAccent bold italic underline upper>
            baz
          </InfoAccent>{" "}
          HelloWorld
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function PageControlWindowContent() {
  return (
    <SandboxWindowView>
      <PageControl
        pages={[
          {
            content: (
              <Frame
                contentStyle={{ padding: "var(--nu-content-inset)" }}
                fill
                variant="outline"
              >
                <Stack gap="md">
                  <Info>
                    Current workspace target is{" "}
                    <InfoAccent>Drive C:</InfoAccent>.
                  </Info>
                  <Info>
                    Maintenance queue contains{" "}
                    <InfoAccent upper>three</InfoAccent> pending actions.
                  </Info>
                </Stack>
              </Frame>
            ),
            id: "summary",
            label: "&Summary"
          },
          {
            content: (
              <Frame
                contentStyle={{ padding: "var(--nu-content-inset)" }}
                fill
                variant="outline"
              >
                <Stack gap="sm">
                  <Button>&Run diagnostics</Button>
                  <Button variant="secondary">&Preview report</Button>
                  <Button variant="danger">&Abort queue</Button>
                </Stack>
              </Frame>
            ),
            id: "actions",
            label: "&Actions"
          },
          {
            content: (
              <Frame
                contentStyle={{ padding: "var(--nu-content-inset)" }}
                fill
                variant="outline"
              >
                <Info>
                  Archive review remains <InfoAccent bold>disabled</InfoAccent>{" "}
                  until the workspace is verified.
                </Info>
              </Frame>
            ),
            disabled: true,
            id: "archive",
            label: "&Archive"
          }
        ]}
      />
    </SandboxWindowView>
  );
}

function ToolBarWindowContent() {
  const [lastExportCommand, setLastExportCommand] = useState(
    "No export command selected"
  );
  const [watchPressed, setWatchPressed] = useState(true);
  const [tracePressed, setTracePressed] = useState(false);
  const exportMenuItems: MainMenuNode[] = [
    { id: "export-map", text: "Export &map" },
    { id: "export-log", text: "Export &log" },
    { id: "export-divider-1", type: "divider" },
    { id: "export-archive", text: "&Archive package" }
  ];

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <ToolBar startContent={<FolderCog aria-hidden="true" />}>
          <ToolButton icon="folder">&Scan</ToolButton>
          <ToolButton
            icon="star"
            pressed={watchPressed}
            onClick={() => setWatchPressed((current) => !current)}
          >
            &Watch
          </ToolButton>
          <ToolButton
            icon="gear"
            pressed={tracePressed}
            onClick={() => setTracePressed((current) => !current)}
          >
            &Trace
          </ToolButton>
          <ToolSeparator />
          <ToolDropButton
            icon="folder"
            menuItems={exportMenuItems}
            onMenuItemSelect={(item) => setLastExportCommand(item.id)}
          >
            &Export
          </ToolDropButton>
          <ToolButton icon="gear">&Map</ToolButton>
          <ToolSeparator />
          <ToolButton disabled>&Repair</ToolButton>
        </ToolBar>
        <div style={{ width: "100%" }}>
          <ToolBar wrap>
            <ToolButton icon="folder">&Scan</ToolButton>
            <ToolButton
              icon="star"
              pressed={watchPressed}
              onClick={() => setWatchPressed((current) => !current)}
            >
              &Watch
            </ToolButton>
            <ToolButton
              icon="gear"
              pressed={tracePressed}
              onClick={() => setTracePressed((current) => !current)}
            >
              &Trace
            </ToolButton>
            <ToolDropButton
              icon="folder"
              menuItems={exportMenuItems}
              onMenuItemSelect={(item) => setLastExportCommand(item.id)}
            >
              &Export
            </ToolDropButton>
            <ToolButton>&Verify</ToolButton>
            <ToolButton disabled>&Repair</ToolButton>
          </ToolBar>
        </div>
        <Info>
          Watch mode is{" "}
          <InfoAccent upper>{watchPressed ? "enabled" : "disabled"}</InfoAccent>
          . Trace mode is{" "}
          <InfoAccent upper>{tracePressed ? "enabled" : "disabled"}</InfoAccent>
          . Export command: <InfoAccent>{lastExportCommand}</InfoAccent>
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function CommandButtonWindowContent() {
  const [commandLog, setCommandLog] = useState("No command selected");

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <Stack direction="row" gap="sm">
          <CommandButton
            icon="folder"
            onClick={() => setCommandLog("Scan clicked")}
          >
            &Scan
          </CommandButton>
          <CommandButton icon="star" toggled>
            &Watch
          </CommandButton>
          <CommandButton
            icon="gear"
            menuItems={[
              { id: "export-map", text: "Export &map" },
              { id: "export-log", text: "Export &log" },
              { id: "divider-1", type: "divider" },
              { id: "archive", text: "&Archive package" }
            ]}
            onMenuItemSelect={(item) =>
              setCommandLog(`Selected ${String(item.id)}`)
            }
          >
            &Export
          </CommandButton>
        </Stack>
        <Info>
          Command result: <InfoAccent>{commandLog}</InfoAccent>
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function SpinBoxWindowContent() {
  const [clusterSize, setClusterSize] = useState(32);
  const [retryCount, setRetryCount] = useState(3);

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <SpinBox
          hint="Arrow keys work, buttons clamp to min/max."
          label="Cluster size"
          max={128}
          min={1}
          onValueChange={setClusterSize}
          step={1}
          value={clusterSize}
        />
        <SpinBox
          hint="This one uses coarse steps."
          label="Retry count"
          max={12}
          min={0}
          onValueChange={setRetryCount}
          step={3}
          value={retryCount}
        />
        <Info>
          Current numeric state: cluster{" "}
          <InfoAccent>{String(clusterSize)}</InfoAccent>, retries{" "}
          <InfoAccent>{String(retryCount)}</InfoAccent>.
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function TickBarWindowContent() {
  const [balance, setBalance] = useState(65);
  const [threshold, setThreshold] = useState(24);
  const [gain, setGain] = useState(7);

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <Stack align="start" direction="row" gap="lg">
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <Stack gap="md">
              <TickBar
                hint="Arrow keys and dragging update the live value."
                label="Balance"
                max={100}
                min={0}
                onValueChange={setBalance}
                step={5}
                value={balance}
                valueRenderer={(value) => `${value}%`}
              />
              <TickBar
                hint="Lower values react in 2-point increments."
                label="Threshold"
                max={40}
                min={0}
                onValueChange={setThreshold}
                step={2}
                tickCount={9}
                value={threshold}
              />
            </Stack>
          </div>
          <TickBar
            hint="Vertical mode uses bottom=min, top=max."
            label="Gain"
            max={10}
            min={0}
            onValueChange={setGain}
            orientation="vertical"
            step={1}
            tickCount={11}
            value={gain}
          />
        </Stack>
        <TickBar
          defaultValue={3}
          disabled
          hint="Disabled controls keep their DOS chrome but ignore input."
          label="Archive"
          max={5}
          min={0}
          showValue={false}
          step={1}
          tickCount={6}
        />
        <Info>
          Current balance is <InfoAccent bold>{balance}%</InfoAccent> and the
          trigger threshold remains <InfoAccent>{threshold}</InfoAccent>. Gain
          is <InfoAccent>{gain}</InfoAccent>.
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function ComboBoxWindowContent() {
  const [profileId, setProfileId] = useState("default");
  const [profileText, setProfileText] = useState("DEFAULT.NU");

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <ComboBox
          data={[
            {
              category: { text: "Profiles" },
              items: [
                { id: "default", name: { text: "DEFAULT.NU" } },
                { id: "repair", name: { text: "REPAIR.NU" } },
                { id: "surface", name: { text: "SURFACE.NU" } },
                { id: "archive", name: { text: "ARCHIVE.NU" } }
              ]
            }
          ]}
          hint="Type to filter, then Enter to commit the first match."
          inputValue={profileText}
          label="Run profile"
          onInputValueChange={setProfileText}
          onValueChange={(nextValue) => setProfileId(nextValue)}
          value={profileId}
        />
        <Info>
          Selected profile id: <InfoAccent>{profileId}</InfoAccent>. Current
          editor text: <InfoAccent>{profileText || "<empty>"}</InfoAccent>.
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function SearchBoxWindowContent() {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedRecordName, setSelectedRecordName] = useState<string | null>(
    null
  );

  const dataProvider = useCallback(async (query: string) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });

    if (query.toUpperCase() === "ERR") {
      throw new Error("Synthetic search failure");
    }

    const normalizedQuery = query.trim().toLowerCase();

    return SANDBOX_SEARCH_RECORDS.filter(
      (record) =>
        record.name.toLowerCase().includes(normalizedQuery) ||
        record.location.toLowerCase().includes(normalizedQuery)
    );
  }, []);

  return (
    <SandboxWindowView>
      <Stack gap="md">
        <SearchBox
          dataProvider={dataProvider}
          errorText="Provider failed"
          getItemDetails={(item) => item.location}
          getItemId={(item) => item.id}
          getItemText={(item) => item.name}
          hint='Type a city or node name. Use "ERR" to simulate provider failure.'
          label="Station search"
          minQueryLength={2}
          onItemSelect={(item) => {
            setSelectedRecordId(item.id);
            setSelectedRecordName(item.name);
          }}
        />
        <Info>
          Selected record:{" "}
          <InfoAccent>{selectedRecordName ?? "<none>"}</InfoAccent>{" "}
          <InfoAccent>{selectedRecordId ?? ""}</InfoAccent>
        </Info>
      </Stack>
    </SandboxWindowView>
  );
}

function PropertyGridWindowContent() {
  const [gridVerify, setGridVerify] = useState(true);
  const [gridProfileId, setGridProfileId] = useState("default");
  const [gridClusterSize, setGridClusterSize] = useState(32);
  const [gridClusterCopies, setGridClusterCopies] = useState(2);
  const [gridTarget, setGridTarget] = useState("C:\\SYSTEM");
  const [gridRectTop, setGridRectTop] = useState(0);
  const [gridRectLeft, setGridRectLeft] = useState(0);
  const [gridRectWidth, setGridRectWidth] = useState(10);
  const [gridRectHeight, setGridRectHeight] = useState(20);

  return (
    <SandboxWindowView>
      <PropertyGrid
        defaultExpandedIds={["geometry", "rect"]}
        entries={[
          {
            id: "general",
            title: "&General",
            type: "section"
          },
          {
            content: (
              <TextField
                defaultValue="C:\\SYSTEM"
                label="Target"
                onChange={(event) => setGridTarget(event.target.value)}
                value={gridTarget}
              />
            ),
            id: "target",
            label: "&Target"
          },
          {
            content: (
              <ComboBox
                data={[
                  {
                    category: null,
                    items: [
                      { id: "default", name: { text: "DEFAULT.NU" } },
                      { id: "repair", name: { text: "REPAIR.NU" } },
                      { id: "surface", name: { text: "SURFACE.NU" } }
                    ]
                  }
                ]}
                label="Profile"
                onValueChange={(nextValue) => setGridProfileId(nextValue)}
                value={gridProfileId}
              />
            ),
            id: "profile",
            label: "&Profile"
          },
          {
            content: (
              <CheckBox
                checked={gridVerify}
                label="&Enabled"
                onCheckedChange={setGridVerify}
              />
            ),
            // hint: "Classic property row with an embedded checkbox editor.",
            id: "verify",
            label: "&Verify"
          },
          {
            children: [
              {
                children: [
                  {
                    content: (
                      <SpinBox
                        label="Top"
                        max={999}
                        min={-999}
                        onValueChange={setGridRectTop}
                        value={gridRectTop}
                      />
                    ),
                    id: "rect-top",
                    label: "&Top"
                  },
                  {
                    content: (
                      <SpinBox
                        label="Left"
                        max={999}
                        min={-999}
                        onValueChange={setGridRectLeft}
                        value={gridRectLeft}
                      />
                    ),
                    id: "rect-left",
                    label: "&Left"
                  },
                  {
                    content: (
                      <SpinBox
                        label="Width"
                        max={999}
                        min={1}
                        onValueChange={setGridRectWidth}
                        value={gridRectWidth}
                      />
                    ),
                    id: "rect-width",
                    label: "&Width"
                  },
                  {
                    content: (
                      <SpinBox
                        label="Height"
                        max={999}
                        min={1}
                        onValueChange={setGridRectHeight}
                        value={gridRectHeight}
                      />
                    ),
                    id: "rect-height",
                    label: "&Height"
                  }
                ],
                id: "rect",
                label: "&Box",
                summary: (
                  <Info>
                    <InfoAccent>
                      Rect({gridRectLeft},{gridRectTop},{gridRectWidth},
                      {gridRectHeight})
                    </InfoAccent>
                  </Info>
                ),
                type: "group"
              }
            ],
            id: "geometry",
            label: "&Geometry",
            summary: (
              <Info>
                <InfoAccent upper>expanded</InfoAccent>
              </Info>
            ),
            type: "group"
          },
          {
            children: [
              {
                content: (
                  <SpinBox
                    label="Cluster size"
                    max={128}
                    min={1}
                    onValueChange={setGridClusterSize}
                    value={gridClusterSize}
                  />
                ),
                id: "cluster-size",
                label: "&Size"
              },
              {
                content: (
                  <SpinBox
                    label="Cluster copies"
                    max={8}
                    min={1}
                    onValueChange={setGridClusterCopies}
                    value={gridClusterCopies}
                  />
                ),
                id: "cluster-copies",
                label: "&Copies"
              }
            ],
            id: "cluster",
            label: "Cl&uster",
            summary: (
              <Info>
                <InfoAccent>{gridClusterSize}K</InfoAccent>{" "}
                <InfoAccent>x{gridClusterCopies}</InfoAccent>
              </Info>
            ),
            type: "group"
          },
          {
            content: (
              <Stack direction="row" gap="sm">
                <Button>&Apply</Button>
                <Button variant="secondary">&Preview</Button>
              </Stack>
            ),
            id: "actions",
            label: "&Actions"
          }
        ]}
      />
    </SandboxWindowView>
  );
}

function FrameWindowContent() {
  return (
    <SandboxWindowView>
      <Stack gap="md">
        <Frame contentStyle={{ padding: "var(--nu-content-inset)" }} title="&Simple Frame">
          <Info>Default text title still works as the simple shorthand.</Info>
        </Frame>
        <Frame
          contentStyle={{ padding: "var(--nu-content-inset)" }}
          titleEnd={<CommandButton icon="gear">Help</CommandButton>}
        >
          <Info>
            End-only title shell behaves more like a compact tab fragment.
          </Info>
        </Frame>
        <Frame
          contentStyle={{ padding: "var(--nu-content-inset)" }}
          titleContent={<InfoAccent upper>Custom center</InfoAccent>}
          titleStart={<NuGlyph name="folder" />}
          titleEnd={<CommandButton icon="gear">&Run</CommandButton>}
        >
          <Info>
            Start, custom center content, and end controls can live in one title
            shell.
          </Info>
        </Frame>
        <Frame
          contentStyle={{ padding: "var(--nu-content-inset)" }}
          titleEnd={
            <Stack direction="row" gap="sm">
              <CommandButton icon="star">A</CommandButton>
              <CommandButton icon="folder">B</CommandButton>
            </Stack>
          }
          titleStart={<InfoAccent bold>Mode</InfoAccent>}
        >
          <Info>
            Start-only and mixed control fragments can be used for host-owned
            frame chrome.
          </Info>
        </Frame>
      </Stack>
    </SandboxWindowView>
  );
}

function WindowLaunchers() {
  const windowManager = useNuWindowManager();
  const [lastDialogResult, setLastDialogResult] = useState(
    "No helper dialog result yet"
  );

  function openMaintenanceDialog() {
    windowManager.openDialog({
      border: "double",
      content: ({ close }) => (
        <NuView padding="cell">
          <Stack gap="md">
            <p className="sandbox-copy">
              Resetting theme tokens will restore the classic palette and
              clear any sandbox overrides.
            </p>
            <Stack direction="row" gap="sm" justify="center">
              <Button defaultFocused onClick={close}>
                &Confirm
              </Button>
              <Button onClick={close} variant="secondary">
                &Cancel
              </Button>
            </Stack>
          </Stack>
        </NuView>
      ),
      domain: "Reset",
      title: "Confirm Reset"
    });
  }

  function openModalMaintenanceDialog() {
    windowManager.openDialog({
      border: "double",
      content: ({ close }) => (
        <NuView padding="cell">
          <Stack gap="md">
            <p className="sandbox-copy">
              Modal maintenance dialog blocks interaction with the desktop
              and other windows until you close it.
            </p>
            <Stack direction="row" gap="sm" justify="center">
              <Button defaultFocused onClick={close}>
                &Confirm
              </Button>
              <Button onClick={close} variant="secondary">
                &Cancel
              </Button>
            </Stack>
          </Stack>
        </NuView>
      ),
      appModal: true,
      domain: "Reset",
      title: "Confirm Reset"
    });
  }

  function openLoginDialog() {
    windowManager.openDialog({
      border: "double",
      content: ({ close }) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            height: "100%",
            padding: "var(--nu-content-inset)"
          }}
        >
          <iframe
            src="http://builder.local/api/auth/login"
            title="Keycloak Login"
            style={{
              background: "white",
              border: "1px solid var(--nu-border-light)",
              flex: "1 1 auto",
              inlineSize: "100%",
              minBlockSize: "24rem"
            }}
          />
          <Stack direction="row" gap="sm" justify="center">
            <Button defaultFocused onClick={close}>
              &Close
            </Button>
          </Stack>
        </div>
      ),
      domain: "Authentication",
      style: {
        height: "32rem",
        width: "48rem"
      },
      title: "Login"
    });
  }

  function openApplicationsWindow() {
    windowManager.openWindow({
      content: () => <ApplicationsWindowContent />,
      domain: "Applications",
      icon: <NuGlyph name="folder" />,
      statusBar: "Double-click Target  Drag Move  Shift+F10 Menu",
      style: {
        height: "22rem",
        width: "30rem"
      },
      title: "Applications"
    });
  }

  function openLinkedWindows() {
    const activationGroup = "sandbox-linked-windows";

    windowManager.openWindow({
      activationGroup,
      content: () => (
        <NuView padding="cell">
          <p className="sandbox-copy">
            This window shares its active chrome with Linked Inspector.
          </p>
        </NuView>
      ),
      domain: "Linked windows",
      statusBar: "Activate either linked window",
      style: {
        height: "14rem",
        left: "10%",
        top: "14%",
        transform: "none",
        width: "25rem"
      },
      title: "Linked Overview"
    });
    windowManager.openWindow({
      activationGroup,
      content: () => (
        <NuView padding="cell">
          <p className="sandbox-copy">
            Activating this window also activates Linked Overview.
          </p>
        </NuView>
      ),
      domain: "Linked windows",
      statusBar: "Shared activation group",
      style: {
        height: "14rem",
        left: "52%",
        top: "38%",
        transform: "none",
        width: "25rem"
      },
      title: "Linked Inspector"
    });
    windowManager.openWindow({
      content: () => (
        <NuView padding="cell">
          <p className="sandbox-copy">
            Activate this independent window to dim both linked windows.
          </p>
        </NuView>
      ),
      domain: "Linked windows",
      statusBar: "Independent activation",
      style: {
        height: "12rem",
        left: "34%",
        top: "65%",
        transform: "none",
        width: "25rem"
      },
      title: "Independent Window"
    });
  }

  function openActivityWindow() {
    const windowDefinition: NuManagedWindowDefinition = {
      border: "double",
      content: ({ close, id }) => (
        <ActivityWindowContent
          onClose={close}
          onMarkDirty={() =>
            windowManager.updateWindow(windowId, { title: "Activity Log*" })
          }
          onOpenOwnedModal={() =>
            windowManager.openDialog({
              border: "double",
              content: ({ close: closeOwnedModal }) => (
                <NuView padding="cell">
                  <Stack gap="md">
                    <p className="sandbox-copy">
                      This dialog is modal only for the Activity Log window.
                    </p>
                    <Stack direction="row" gap="sm" justify="center">
                      <Button defaultFocused onClick={closeOwnedModal}>
                        &Close
                      </Button>
                    </Stack>
                  </Stack>
                </NuView>
              ),
              domain: "Activity Log",
              modal: id,
              title: "Activity Options"
            })
          }
        />
      ),
      statusBar: (
        <>
          <StatusBarItem grow>F2 Save F3 Search Alt+F3 Close</StatusBarItem>
          <StatusBarItem align="end">12 entries</StatusBarItem>
        </>
      ),
      style: {
        height: "22rem",
        width: "36rem"
      },
      domain: "Activity Log",
      title: "Activity Log"
    };
    const windowId = windowManager.openWindow(windowDefinition);
  }

  function openDiskMapWindow() {
    windowManager.openWindow({
      border: "double",
      content: ({ close }) => (
        <NuView padding="cell">
          <Stack gap="md">
            <p className="sandbox-copy">
              Disk Map displays allocation regions, hot spots, and cluster
              usage for the selected volume.
            </p>
            <p className="sandbox-copy">
              Volume C: 68% used 12% fragmented 3 hot sectors detected
            </p>
            <Stack direction="row" gap="sm">
              <Button defaultFocused onClick={close}>
                Close &Map
              </Button>
              <Button variant="secondary">&Analyze</Button>
            </Stack>
          </Stack>
        </NuView>
      ),
      domain: "Disk Map",
      statusBar: "F4 Analyze  F6 Surface Test  Alt+F3 Close",
      style: {
        height: "18rem",
        width: "32rem"
      },
      title: "Disk Map"
    });
  }

  function openCommandsWindow() {
    windowManager.openWindow({
      content: () => <CommandsWindowContent />,
      domain: "Commands",
      statusBar: "Up/Down Navigate  Enter Select  Alt+F3 Close",
      style: {
        height: "23rem",
        width: "20rem"
      },
      title: "Commands"
    });
  }

  function openUtilitiesWindow() {
    windowManager.openWindow({
      content: () => <UtilitiesWindowContent />,
      domain: "Utilities",
      statusBar: "Space Toggle  Enter Select  Alt+F3 Close",
      style: {
        height: "22rem",
        width: "26rem"
      },
      title: "Utilities"
    });
  }

  function openCommandPreviewWindow() {
    windowManager.openWindow({
      content: () => <CommandPreviewWindowContent />,
      domain: "Command Preview",
      style: {
        height: "15rem",
        width: "24rem"
      },
      title: "Command Preview"
    });
  }

  function openTreeViewWindow() {
    windowManager.openWindow({
      content: () => <TreeViewWindowContent />,
      domain: "Tree View",
      statusBar: "Left/Right Expand  Space Check  Enter Select",
      style: {
        height: "24rem",
        width: "30rem"
      },
      title: "Tree View"
    });
  }

  function openListViewWindow() {
    windowManager.openWindow({
      content: () => <ListViewWindowContent />,
      domain: "List View",
      statusBar: "Up/Down Navigate  Space Check  Enter Select",
      style: {
        height: "22rem",
        width: "42rem"
      },
      title: "List View"
    });
  }

  function openTreeListViewWindow() {
    windowManager.openWindow({
      content: () => <TreeListViewWindowContent />,
      domain: "Tree List View",
      statusBar: "Resize columns  Left/Right Expand  Space Check  Enter Select",
      style: {
        height: "24rem",
        width: "48rem"
      },
      title: "Tree List View"
    });
  }

  function openSplitterWindow() {
    windowManager.openWindow({
      content: () => <SplitterWindowContent />,
      domain: "Splitter",
      statusBar: "Arrows Resize  Shift+Arrows Coarse  Home/End Snap",
      style: {
        height: "26rem",
        width: "52rem"
      },
      title: "Splitter"
    });
  }

  function openProgressWindow() {
    windowManager.openWindow({
      content: () => <ProgressWindowContent />,
      domain: "Progress",
      statusBar: "Live progress demo  Determinate and indeterminate",
      style: {
        height: "14rem",
        width: "32rem"
      },
      title: "Progress"
    });
  }

  function openMemoWindow() {
    windowManager.openWindow({
      content: () => <MemoWindowContent />,
      domain: "Memo",
      statusBar: "Editable memo surface  Parent-sized  Scrollable",
      style: {
        height: "20rem",
        width: "36rem"
      },
      title: "Memo"
    });
  }

  function openMaskedFieldWindow() {
    windowManager.openWindow({
      content: () => <MaskedFieldWindowContent />,
      domain: "Masked Field",
      statusBar: "Readable masks  Invalid input turns red with yellow text",
      style: {
        height: "20rem",
        width: "36rem"
      },
      title: "Masked Field"
    });
  }

  function openInfoWindow() {
    windowManager.openWindow({
      content: () => <InfoWindowContent />,
      domain: "Info",
      statusBar: "Inline accent fragments are driven by InfoAccent elements",
      style: {
        height: "14rem",
        width: "34rem"
      },
      title: "Info"
    });
  }

  function openPageControlWindow() {
    windowManager.openWindow({
      content: () => <PageControlWindowContent />,
      domain: "Page Control",
      statusBar: "Arrow keys switch tabs  Disabled pages stay visible",
      style: {
        height: "18rem",
        width: "34rem"
      },
      title: "Page Control"
    });
  }

  function openToolBarWindow() {
    windowManager.openWindow({
      content: () => <ToolBarWindowContent />,
      domain: "ToolBar",
      statusBar: "Compact command strip  Toggle tools keep pressed state",
      style: {
        height: "12rem",
        width: "32rem"
      },
      title: "ToolBar"
    });
  }

  function openCommandButtonWindow() {
    windowManager.openWindow({
      content: () => <CommandButtonWindowContent />,
      domain: "CommandButton",
      statusBar:
        "Standalone command button  Optional popup menu  Pressed state",
      style: {
        height: "12rem",
        width: "34rem"
      },
      title: "CommandButton"
    });
  }

  function openSpinBoxWindow() {
    windowManager.openWindow({
      content: () => <SpinBoxWindowContent />,
      domain: "SpinBox",
      statusBar: "ArrowUp/ArrowDown adjust numeric value",
      style: {
        height: "14rem",
        width: "30rem"
      },
      title: "SpinBox"
    });
  }

  function openComboBoxWindow() {
    windowManager.openWindow({
      content: () => <ComboBoxWindowContent />,
      domain: "ComboBox",
      statusBar: "Editable select  Type to filter  Enter commits first match",
      style: {
        height: "14rem",
        width: "34rem"
      },
      title: "ComboBox"
    });
  }

  function openTickBarWindow() {
    windowManager.openWindow({
      content: () => <TickBarWindowContent />,
      domain: "TickBar",
      statusBar: "Horizontal slider  Keyboard and pointer drag  Visible ticks",
      style: {
        height: "16rem",
        width: "34rem"
      },
      title: "TickBar"
    });
  }

  function openPropertyGridWindow() {
    windowManager.openWindow({
      content: () => <PropertyGridWindowContent />,
      domain: "Property Grid",
      statusBar: "Two-column inspector surface for labeled values and actions",
      style: {
        height: "18rem",
        width: "36rem"
      },
      title: "Property Grid"
    });
  }

  function openFrameWindow() {
    windowManager.openWindow({
      content: () => <FrameWindowContent />,
      domain: "Frame",
      statusBar: "Frame title shell  titleStart titleContent titleEnd",
      style: {
        height: "24rem",
        width: "40rem"
      },
      title: "Frame"
    });
  }

  function openSearchBoxWindow() {
    windowManager.openWindow({
      content: () => <SearchBoxWindowContent />,
      domain: "SearchBox",
      statusBar: "Async provider lookup  Loading, empty, and error states",
      style: {
        height: "14rem",
        width: "36rem"
      },
      title: "SearchBox"
    });
  }

  async function openMessageBox() {
    const result = await windowManager.showMessageBox({
      kind: "info",
      message:
        "Current volume contains pending maintenance tasks. Continue with diagnostics?",
      preset: "yes-no",
      title: "Diagnostics",
      yesLabel: "&Proceed"
    });

    setLastDialogResult(`MessageBox result: ${result}`);
  }

  async function openErrorMessageBox() {
    const result = await windowManager.showMessageBox({
      kind: "error",
      message:
        "Surface scan detected unreadable sectors. Abort the operation and return to the desktop?",
      noLabel: "&Continue",
      preset: "yes-no-cancel",
      title: "Surface Scan Error",
      yesLabel: "&Abort"
    });

    setLastDialogResult(`Error MessageBox result: ${result}`);
  }

  async function openInputBox() {
    const result = await windowManager.showInputBox({
      defaultValue: "C:\\LOGS\\SURFACE.MAP",
      hint: "Type the target report path and confirm.",
      label: "Target path",
      title: "Archive Report"
    });

    setLastDialogResult(
      result === null
        ? "InputBox result: cancelled"
        : `InputBox result: ${result}`
    );
  }

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
        <Button onClick={openMaintenanceDialog}>Open &dialog</Button>
        <Button onClick={openModalMaintenanceDialog} variant="secondary">
          Open &modal dialog
        </Button>
        <Button onClick={openLoginDialog} variant="secondary">
          &Login
        </Button>
        <Button onClick={openApplicationsWindow} variant="secondary">
          &Applications
        </Button>
        <Button onClick={openLinkedWindows} variant="secondary">
          Open &linked windows
        </Button>
        <Button onClick={openMessageBox} variant="secondary">
          Open &message box
        </Button>
        <Button onClick={openErrorMessageBox} variant="secondary">
          Open &error box
        </Button>
        <Button onClick={openInputBox} variant="secondary">
          Open &input box
        </Button>
        <Button onClick={openActivityWindow} variant="secondary">
          Open acti&vity window
        </Button>
        <Button onClick={openDiskMapWindow} variant="secondary">
          Open dis&k map
        </Button>
        <Button onClick={openCommandsWindow} variant="secondary">
          Open &commands
        </Button>
        <Button onClick={openUtilitiesWindow} variant="secondary">
          Open &utilities
        </Button>
        <Button onClick={openCommandPreviewWindow} variant="secondary">
          Open &preview
        </Button>
        <Button onClick={openTreeViewWindow} variant="secondary">
          Open &tree view
        </Button>
        <Button onClick={openListViewWindow} variant="secondary">
          Open &list view
        </Button>
        <Button onClick={openTreeListViewWindow} variant="secondary">
          Open tree &table
        </Button>
        <Button onClick={openSplitterWindow} variant="secondary">
          Open s&plitter
        </Button>
        <Button onClick={openProgressWindow} variant="secondary">
          Open &progress
        </Button>
        <Button onClick={openMemoWindow} variant="secondary">
          Open &memo
        </Button>
        <Button onClick={openMaskedFieldWindow} variant="secondary">
          Open m&asked field
        </Button>
        <Button onClick={openInfoWindow} variant="secondary">
          Open &info
        </Button>
        <Button onClick={openPageControlWindow} variant="secondary">
          Open &page control
        </Button>
        <Button onClick={openFrameWindow} variant="secondary">
          Open &frame
        </Button>
        <Button onClick={openCommandButtonWindow} variant="secondary">
          Open c&ommand button
        </Button>
        <Button onClick={openToolBarWindow} variant="secondary">
          Open t&oolbar
        </Button>
        <Button onClick={openSpinBoxWindow} variant="secondary">
          Open s&pinbox
        </Button>
        <Button onClick={openTickBarWindow} variant="secondary">
          Open tic&k bar
        </Button>
        <Button onClick={openComboBoxWindow} variant="secondary">
          Open c&ombobox
        </Button>
        <Button onClick={openPropertyGridWindow} variant="secondary">
          Open propert&y grid
        </Button>
        <Button onClick={openSearchBoxWindow} variant="secondary">
          Open &search box
        </Button>
      </Stack>
      <p className="sandbox-copy">{lastDialogResult}</p>
    </Stack>
  );
}

function PopupMenuSandbox() {
  const clickMenu = usePopupMenu();
  const contextMenu = usePopupMenu();
  const [lastPopupCommand, setLastPopupCommand] = useState(
    "No command selected"
  );
  const popupItems: MainMenuNode[] = [
    {
      id: "inspect-target",
      modifier: "Alt",
      text: "&Inspect target"
    },
    {
      checkable: true,
      checked: true,
      id: "show-hidden",
      modifier: "Alt",
      text: "Show &hidden sectors"
    },
    { id: "popup-divider-1", type: "divider" },
    {
      id: "layout",
      items: [
        { id: "layout-compact", modifier: "Alt", text: "&Compact" },
        { id: "layout-wide", modifier: "Alt", text: "&Wide" },
        {
          id: "layout-grid",
          items: [
            { id: "layout-grid-2", modifier: "Alt", text: "&2 columns" },
            { id: "layout-grid-3", modifier: "Alt", text: "&3 columns" }
          ],
          modifier: "Alt",
          text: "&Grid"
        }
      ],
      modifier: "Alt",
      text: "&Layout"
    },
    {
      id: "properties",
      shortcut: "Alt+Enter",
      text: "&Properties"
    }
  ];

  function handleSelectMenuItem(id: string) {
    setLastPopupCommand(id);
  }

  return (
    <>
      <PopupMenu
        anchor={clickMenu.anchor}
        items={popupItems}
        onItemSelect={(item) => handleSelectMenuItem(item.id)}
        onOpenChange={(nextOpen) => clickMenu.setOpen(nextOpen)}
        open={clickMenu.open}
      />
      <PopupMenu
        anchor={contextMenu.anchor}
        items={popupItems}
        onItemSelect={(item) => handleSelectMenuItem(item.id)}
        onOpenChange={(nextOpen) => contextMenu.setOpen(nextOpen)}
        open={contextMenu.open}
      />
      <Stack gap="sm">
        <Stack direction="row" gap="sm" style={{ alignItems: "flex-start" }}>
          <Button onClick={clickMenu.openFromClick} variant="secondary">
            Open pop&up menu
          </Button>
          <div
            className="sandbox-popup-target"
            onContextMenu={contextMenu.openFromContextMenu}
          >
            Right click this workspace cell
          </div>
        </Stack>
        <p className="sandbox-copy">{`Last popup command: ${lastPopupCommand}`}</p>
      </Stack>
    </>
  );
}

export function DemoApp() {
  const {
    desktopPatternMode,
    fontFamily,
    fontSize,
    setDesktopPatternMode,
    setFontFamily,
    setFontSize
  } = useNuTheme();
  const [profileId, setProfileId] = useState("default");
  const [verifyStructure, setVerifyStructure] = useState(true);
  const [repairLinks, setRepairLinks] = useState(false);
  const [bootMode, setBootMode] = useState("safe");
  const hostFontFamily = fontFamily ?? SANDBOX_FONT_OPTIONS[0].value;
  const hostFontSize = fontSize ?? SANDBOX_FONT_SIZE_OPTIONS[3].value;
  const hostFontId =
    SANDBOX_FONT_OPTIONS.find((option) => option.value === hostFontFamily)
      ?.id ?? SANDBOX_FONT_OPTIONS[0].id;
  const hostFontSizeId =
    SANDBOX_FONT_SIZE_OPTIONS.find((option) => option.value === hostFontSize)
      ?.id ?? SANDBOX_FONT_SIZE_OPTIONS[3].id;
  const hostTypographyPresetId =
    SANDBOX_TYPOGRAPHY_PRESETS.find(
      (preset) =>
        preset.fontId === hostFontId && preset.sizeId === hostFontSizeId
    )?.id ?? "custom";
  const workspacePatternId = desktopPatternMode ?? "dot-grid";
  const dashboardItems = [
    {
      content: (
        <Panel
          footer="F1 Themes  F5 Refresh  Alt+X Exit"
          inset
          title="System Core"
        >
          <Stack gap="md">
            <p className="sandbox-copy">
              Building the library core around theme tokens first keeps the
              components dumb and lets color schemes swap without changing
              component APIs.
            </p>
            <ThemeSwitcher />
            <Stack direction="row" gap="md">
              <Dropdown
                data={[
                  {
                    category: null,
                    items: [
                      ...SANDBOX_TYPOGRAPHY_PRESETS.map((preset) => ({
                        id: preset.id,
                        name: { text: preset.label }
                      })),
                      {
                        id: "custom",
                        name: { text: "Custom" }
                      }
                    ]
                  }
                ]}
                hint="Apply a preset pair of host font family and size."
                label="Type preset"
                onValueChange={(nextValue) => {
                  const nextPreset = SANDBOX_TYPOGRAPHY_PRESETS.find(
                    (preset) => preset.id === nextValue
                  );

                  if (!nextPreset) {
                    return;
                  }

                  const nextFontFamily = SANDBOX_FONT_OPTIONS.find(
                    (option) => option.id === nextPreset.fontId
                  )?.value;
                  const nextFontSize = SANDBOX_FONT_SIZE_OPTIONS.find(
                    (option) => option.id === nextPreset.sizeId
                  )?.value;

                  if (nextFontFamily) {
                    setFontFamily(nextFontFamily);
                  }

                  if (nextFontSize) {
                    setFontSize(nextFontSize);
                  }
                }}
                value={hostTypographyPresetId}
              />
              <Dropdown
                data={[
                  {
                    category: null,
                    items: SANDBOX_FONT_OPTIONS.map((option) => ({
                      id: option.id,
                      name: { text: option.label }
                    }))
                  }
                ]}
                hint="Switch the host monospace stack for all controls and new Monaco windows."
                label="Host font"
                onValueChange={(nextValue) => {
                  const nextFontFamily = SANDBOX_FONT_OPTIONS.find(
                    (option) => option.id === nextValue
                  )?.value;

                  if (nextFontFamily) {
                    setFontFamily(nextFontFamily);
                  }
                }}
                value={hostFontId}
              />
              <Dropdown
                data={[
                  {
                    category: null,
                    items: SANDBOX_FONT_SIZE_OPTIONS.map((option) => ({
                      id: option.id,
                      name: { text: option.label }
                    }))
                  }
                ]}
                hint="Adjust base type size for the sandbox host."
                label="Host size"
                onValueChange={(nextValue) => {
                  const nextFontSize = SANDBOX_FONT_SIZE_OPTIONS.find(
                    (option) => option.id === nextValue
                  )?.value;

                  if (nextFontSize) {
                    setFontSize(nextFontSize);
                  }
                }}
                value={hostFontSizeId}
              />
              <Dropdown
                data={[
                  {
                    category: null,
                    items: SANDBOX_WORKSPACE_PATTERN_OPTIONS.map((option) => ({
                      id: option.id,
                      name: { text: option.label }
                    }))
                  }
                ]}
                hint="Choose the desktop pattern fill behind the workspace and windows."
                label="Workspace pattern"
                onValueChange={(nextValue) =>
                  setDesktopPatternMode(nextValue as NuDesktopPatternMode)
                }
                value={workspacePatternId}
              />
            </Stack>
          </Stack>
        </Panel>
      ),
      id: "system-core",
      lane: 1,
      minHeight: "18rem"
    },
    {
      content: (
        <Panel inset title="Workspace Tools">
          <Stack gap="md">
            <WindowLaunchers />
            <PopupMenuSandbox />
          </Stack>
        </Panel>
      ),
      id: "workspace-tools",
      lane: 2,
      minHeight: "18rem"
    },
    {
      content: (
        <Stack align="start" direction="row" gap="md" justify="space-around">
          <div style={{ width: "50%" }}>
            <Frame
              contentStyle={{
                background: "var(--nu-color-panel-inset)",
                padding: "var(--nu-content-inset)"
              }}
              title="Target Controls"
              titleProps={{
                background: "black",
                borderColor: "black",
                color: "yellow"
              }}
            >
              <Stack gap="md">
                <TextField
                  defaultValue="C:\\SYSTEM"
                  hint="Classic Blue is the default theme. Alternate schemes are for token validation."
                  label="Target volume"
                />
                <Dropdown
                  data={[
                    {
                      category: null,
                      items: [
                        { id: "default", name: { text: "DEFAULT.NU" } },
                        { id: "repair", name: { text: "REPAIR.NU" } },
                        { id: "surface", name: { text: "SURFACE.NU" } },
                        { id: "network", name: { text: "NETWORK.NU" } }
                      ]
                    }
                  ]}
                  hint="Dropdown reuses the existing ListBox popup and clamps it to the control width."
                  label="Run profile"
                  onValueChange={(nextValue) => setProfileId(nextValue)}
                  value={profileId}
                />
                <Stack direction="row" gap="sm">
                  <Button defaultFocused>&Commit theme</Button>
                  <Button variant="secondary">&Preview panel</Button>
                  <Button variant="success">&Apply profile</Button>
                  <Button variant="danger">&Reset tokens</Button>
                </Stack>
              </Stack>
            </Frame>
          </div>
          <div style={{ width: "33.3333%" }}>
            <Frame
              contentStyle={{
                background: "var(--nu-color-panel-inset)",
                padding: "var(--nu-content-inset)"
              }}
              title="Selection Controls"
              titleProps={{
                background: "black",
                borderColor: "black",
                color: "yellow"
              }}
            >
              <Stack gap="md">
                <CheckBox
                  checked={verifyStructure}
                  hint="Keep structural validation enabled during maintenance."
                  label="Verify structure"
                  onCheckedChange={(nextChecked) =>
                    setVerifyStructure(nextChecked)
                  }
                />
                <CheckBox
                  checked={repairLinks}
                  hint="Attempt automatic repair of damaged allocation links."
                  label="Repair allocation links"
                  onCheckedChange={(nextChecked) => setRepairLinks(nextChecked)}
                />
                <RadioGroup
                  hint="Boot mode changes the startup command set for recovery tools."
                  label="Boot mode"
                  onValueChange={setBootMode}
                  options={[
                    {
                      hint: "Load the smallest recovery footprint.",
                      label: "Safe mode",
                      value: "safe"
                    },
                    {
                      hint: "Include network diagnostics and remote shares.",
                      label: "Network mode",
                      value: "network"
                    },
                    {
                      hint: "Run every subsystem and reporting utility.",
                      label: "Full diagnostics",
                      value: "full"
                    }
                  ]}
                  value={bootMode}
                />
              </Stack>
            </Frame>
          </div>
        </Stack>
      ),
      id: "target-controls",
      lane: 1,
      minHeight: "16rem",
      width: "100%"
    }
  ];

  return (
    <div className="sandbox-dashboard-shell">
      <DesktopMenuSync
        editorFontFamily={hostFontFamily}
        editorFontSize={hostFontSize}
      />
      <Dashboard
        className="sandbox-dashboard"
        gap={12}
        items={dashboardItems}
        laneCount={2}
        layout="lanes"
      />
    </div>
  );
}

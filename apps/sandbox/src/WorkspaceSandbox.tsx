import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import {
  Button,
  Frame,
  Info,
  InfoAccent,
  NuView,
  Panel,
  Stack,
  NuWorkspaceProvider,
  useAppHostMenu,
  useNuWindowManager,
  useNuWorkspace
} from "@deadragdoll/reactnu";
import type {
  MainMenuNode,
  NuManagedWindowDefinition,
  NuWorkspaceSnapshot,
  NuWorkspaceWindowFactories
} from "@deadragdoll/reactnu";

type WorkspaceDetailsMeta = {
  activeSection: "overview" | "history";
  includeWarnings: boolean;
  receiverId: string;
};

type WorkspaceDetailsHandle = {
  loadWorkspace: (meta: WorkspaceDetailsMeta) => void;
  saveWorkspace: () => WorkspaceDetailsMeta;
};

const WorkspaceDetails = forwardRef<
  WorkspaceDetailsHandle,
  { receiverId: string }
>(function WorkspaceDetails({ receiverId }, ref) {
  const [activeSection, setActiveSection] =
    useState<WorkspaceDetailsMeta["activeSection"]>("overview");
  const [includeWarnings, setIncludeWarnings] = useState(true);

  useImperativeHandle(
    ref,
    () => ({
      loadWorkspace: (meta) => {
        setActiveSection(meta.activeSection);
        setIncludeWarnings(meta.includeWarnings);
      },
      saveWorkspace: () => ({
        activeSection,
        includeWarnings,
        receiverId
      })
    }),
    [activeSection, includeWarnings, receiverId]
  );

  return (
    <NuView padding="cell">
      <Stack gap="md">
        <Info>
          Receiver: <InfoAccent>{receiverId}</InfoAccent>
        </Info>
        <Stack direction="row" gap="sm" wrap>
          <Button
            onClick={() => setActiveSection("overview")}
            variant={activeSection === "overview" ? "primary" : "secondary"}
          >
            &Overview
          </Button>
          <Button
            onClick={() => setActiveSection("history")}
            variant={activeSection === "history" ? "primary" : "secondary"}
          >
            &History
          </Button>
          <Button
            onClick={() => setIncludeWarnings((current) => !current)}
            variant={includeWarnings ? "primary" : "secondary"}
          >
            {includeWarnings ? "Hide &warnings" : "Show &warnings"}
          </Button>
        </Stack>
        <p className="sandbox-copy">
          Active section: {activeSection}. Warnings:{" "}
          {includeWarnings ? "on" : "off"}.
        </p>
        <p className="sandbox-copy">
          This state comes from the inner ReceiverDetails component and is
          restored through `onLoadWorkspace`.
        </p>
      </Stack>
    </NuView>
  );
});

function createWorkspaceDetailsWindow(
  receiverId: string,
  position: { left: string; top: string }
): NuManagedWindowDefinition {
  const detailsRef = createRef<WorkspaceDetailsHandle>();

  return {
    activationGroup: `sandbox-workspace-${receiverId}`,
    content: <WorkspaceDetails receiverId={receiverId} ref={detailsRef} />,
    domain: "Workspace receivers",
    onLoadWorkspace: (meta) => {
      detailsRef.current?.loadWorkspace(meta as WorkspaceDetailsMeta);
    },
    onSaveWorkspace: () => detailsRef.current?.saveWorkspace(),
    statusBar: "Change state  Save workspace  Close  Restore",
    style: {
      height: "18rem",
      left: position.left,
      top: position.top,
      transform: "none",
      width: "29rem"
    },
    title: `Receiver ${receiverId}`,
    workspaceFactoryKey: "sandbox.receiver-details"
  };
}

function isWorkspaceDetailsMeta(value: unknown): value is WorkspaceDetailsMeta {
  if (!value || typeof value !== "object") {
    return false;
  }

  const meta = value as Record<string, unknown>;

  return (
    (meta.activeSection === "overview" || meta.activeSection === "history") &&
    typeof meta.includeWarnings === "boolean" &&
    typeof meta.receiverId === "string"
  );
}

const sandboxWorkspaceFactories: NuWorkspaceWindowFactories = {
  "sandbox.receiver-details": (savedWindow) => {
    if (!isWorkspaceDetailsMeta(savedWindow.meta)) {
      return null;
    }

    return createWorkspaceDetailsWindow(savedWindow.meta.receiverId, {
      left: "18%",
      top: "18%"
    });
  }
};

export function WorkspaceSandbox({
  onNormalModeChange
}: {
  onNormalModeChange: () => void;
}) {
  const { setMainMenu } = useAppHostMenu();
  const windowManager = useNuWindowManager();
  const { loadWorkspace, saveWorkspace } = useNuWorkspace();
  const openedWindowIdsRef = useRef(new Set<string>());
  const [snapshot, setSnapshot] = useState<NuWorkspaceSnapshot | null>(null);
  const [status, setStatus] = useState(
    "Open workspace windows, then save their geometry and internal state."
  );

  useEffect(
    () => () => {
      for (const id of openedWindowIdsRef.current) {
        windowManager.closeWindow(id);
      }
    },
    [windowManager]
  );

  useEffect(() => {
    const workspaceMenu: MainMenuNode[] = [
      {
        id: "workspace",
        items: [
          {
            id: "normal-sandbox",
            onSelect: onNormalModeChange,
            text: "&Normal sandbox"
          }
        ],
        text: "W&orkspace"
      },
      { id: "mdi.host", text: "&Window" }
    ];

    setMainMenu(workspaceMenu);

    return () => {
      setMainMenu([]);
    };
  }, [onNormalModeChange, setMainMenu]);

  function openReceiver(receiverId: string, left: string, top: string) {
    const id = windowManager.openWindow(
      createWorkspaceDetailsWindow(receiverId, { left, top })
    );
    openedWindowIdsRef.current.add(id);
  }

  function saveCurrentWorkspace() {
    const nextSnapshot = saveWorkspace();
    setSnapshot(nextSnapshot);
    setStatus(`Saved ${nextSnapshot.windows.length} workspace window(s).`);
  }

  function closeWorkspaceWindows() {
    for (const id of openedWindowIdsRef.current) {
      windowManager.closeWindow(id);
    }

    openedWindowIdsRef.current.clear();
    setStatus(
      "Closed Workspace demo windows. The current snapshot is retained."
    );
  }

  function loadSavedWorkspace() {
    if (!snapshot) {
      setStatus("Save a workspace first.");
      return;
    }

    const result = loadWorkspace(snapshot);

    result.restoredIds.forEach((id) => openedWindowIdsRef.current.add(id));
    setStatus(
      `Restored ${result.restoredIds.length}; skipped ${result.skipped.length}.`
    );
  }

  return (
    <div className="sandbox-workspace">
      <Panel
        footer="F2 Open  F5 Save  F8 Close  F9 Restore"
        inset
        title="Workspace Sandbox"
      >
        <Stack gap="md">
          <p className="sandbox-copy">
            This mode is isolated from the normal component sandbox. Open the
            two receiver windows, move or resize them, change their content,
            then save, close, and restore.
          </p>
          <Stack direction="row" gap="sm" wrap>
            <Button onClick={() => openReceiver("42", "12%", "16%")}>
              Open receiver &42
            </Button>
            <Button
              onClick={() => openReceiver("77", "48%", "42%")}
              variant="secondary"
            >
              Open receiver &77
            </Button>
            <Button onClick={saveCurrentWorkspace} variant="secondary">
              &Save workspace
            </Button>
            <Button onClick={closeWorkspaceWindows} variant="secondary">
              Close &workspace windows
            </Button>
            <Button onClick={loadSavedWorkspace} variant="secondary">
              &Restore workspace
            </Button>
          </Stack>
          <Info>{status}</Info>
        </Stack>
      </Panel>
      <Frame title="Current workspace snapshot">
        <pre className="sandbox-workspace__snapshot">
          {snapshot ? JSON.stringify(snapshot, null, 2) : "No snapshot yet."}
        </pre>
      </Frame>
    </div>
  );
}

export function WorkspaceSandboxMode({
  onNormalModeChange
}: {
  onNormalModeChange: () => void;
}) {
  return (
    <NuWorkspaceProvider factories={sandboxWorkspaceFactories}>
      <WorkspaceSandbox onNormalModeChange={onNormalModeChange} />
    </NuWorkspaceProvider>
  );
}

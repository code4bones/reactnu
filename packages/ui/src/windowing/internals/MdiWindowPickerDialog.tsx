import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { ListBox } from "../../components/ListBox";
import { Stack } from "../../components/Stack";
import { NuManagedWindowInfo } from "../windowing.types";

function isPickerEligibleWindow(windowEntry: NuManagedWindowInfo) {
  if (windowEntry.mode === "window") {
    return true;
  }

  return (
    windowEntry.mode === "dialog" && !windowEntry.modal && !windowEntry.appModal
  );
}

function getOwnedModalChain(
  windows: NuManagedWindowInfo[],
  ownerId: string
): NuManagedWindowInfo[] {
  const chain: NuManagedWindowInfo[] = [];
  let currentOwnerId = ownerId;

  while (true) {
    const nextModal = [...windows]
      .reverse()
      .find((windowEntry) => windowEntry.modal === currentOwnerId);

    if (!nextModal) {
      return chain;
    }

    chain.push(nextModal);
    currentOwnerId = nextModal.id;
  }
}

function formatPickerWindowTitle(
  windows: NuManagedWindowInfo[],
  windowEntry: NuManagedWindowInfo
) {
  const modalChain = getOwnedModalChain(windows, windowEntry.id);
  const topModal = modalChain[modalChain.length - 1];

  if (!topModal) {
    return windowEntry.title;
  }

  return `${windowEntry.title} - ${topModal.title}`;
}

type MdiWindowPickerDialogProps = {
  activeWindowId?: string;
  domain?: string;
  onActivateWindow: (id: string) => void;
  onClose: () => void;
  windows: NuManagedWindowInfo[];
};

export function MdiWindowPickerDialog({
  activeWindowId,
  domain,
  onActivateWindow,
  onClose,
  windows
}: MdiWindowPickerDialogProps) {
  const resolvedWindows = useMemo(
    () =>
      windows.filter(
        (windowEntry) =>
          isPickerEligibleWindow(windowEntry) &&
          (!domain || windowEntry.domain === domain)
      ),
    [domain, windows]
  );
  const [selectedId, setSelectedId] = useState<string>(
    activeWindowId ?? resolvedWindows[0]?.id ?? ""
  );

  useEffect(() => {
    if (
      selectedId &&
      resolvedWindows.some((windowEntry) => windowEntry.id === selectedId)
    ) {
      return;
    }

    setSelectedId(activeWindowId ?? resolvedWindows[0]?.id ?? "");
  }, [activeWindowId, resolvedWindows, selectedId]);

  function handleActivate() {
    if (!selectedId) {
      return;
    }

    onActivateWindow(selectedId);
    onClose();
  }

  return (
    <Stack gap="md">
      <ListBox
        data={[
          {
            category: null,
            items: resolvedWindows.map((windowEntry, index) => ({
              id: windowEntry.id,
              name: {
                text: `${index + 1} ${formatPickerWindowTitle(windows, windowEntry)}`
              },
              selected: windowEntry.id === activeWindowId
            }))
          }
        ]}
        onItemSelect={(item) => {
          if (item.id) {
            setSelectedId(item.id);
          }
        }}
        onItemDoubleClick={(item) => {
          if (!item.id) {
            return;
          }

          onActivateWindow(item.id);
          onClose();
        }}
        selectedId={selectedId}
        style={{
          maxHeight: "14rem",
          minHeight: "12rem"
        }}
      />
      <Stack direction="row" gap="sm">
        <Button defaultFocused onClick={handleActivate}>
          Activate
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

import { useContext } from "react";
import { AppBarItem } from "./AppBarItem";
import { NuWindowContext } from "./windowContext";
import { MdiWindowPickerDialog } from "./internals/MdiWindowPickerDialog";
import { NuManagedWindowDefinition } from "./windowing.types";

export type WindowBarItem = {
  active?: boolean;
  domain?: string;
  id: string;
  minimized?: boolean;
  title: string;
};

type WindowBarProps = {
  items: WindowBarItem[];
  onActivateWindow: (id: string) => void;
};

type WindowBarGroup = {
  active: boolean;
  domain?: string;
  id: string;
  items: WindowBarItem[];
  label: string;
};

function buildWindowBarGroups(items: WindowBarItem[]): WindowBarGroup[] {
  const groups: WindowBarGroup[] = [];
  const groupsByDomain = new Map<string, WindowBarGroup>();

  items.forEach((item) => {
    if (!item.domain) {
      groups.push({
        active: Boolean(item.active),
        id: item.id,
        items: [item],
        label: item.title
      });
      return;
    }

    const existingGroup = groupsByDomain.get(item.domain);

    if (!existingGroup) {
      const nextGroup: WindowBarGroup = {
        active: Boolean(item.active),
        domain: item.domain,
        id: item.id,
        items: [item],
        label: item.title
      };

      groupsByDomain.set(item.domain, nextGroup);
      groups.push(nextGroup);
      return;
    }

    existingGroup.items.push(item);
    existingGroup.active = existingGroup.active || Boolean(item.active);
    existingGroup.label = `${item.domain} (${existingGroup.items.length})`;
  });

  return groups;
}

export function WindowBar({ items, onActivateWindow }: WindowBarProps) {
  const windowManager = useContext(NuWindowContext);
  const groups = buildWindowBarGroups(items);

  function activateGroup(group: WindowBarGroup) {
    if (group.items.length <= 1) {
      const targetId = group.items[0]?.id;

      if (targetId) {
        onActivateWindow(targetId);
      }

      return;
    }

    const activeGroupWindowId = group.items.find((item) => item.active)?.id;

    if (!windowManager || !group.domain) {
      onActivateWindow(activeGroupWindowId ?? group.items[0]?.id ?? "");
      return;
    }

    const dialogDefinition: NuManagedWindowDefinition = {
      appModal: true,
      border: "double",
      content: ({ close }) => (
        <MdiWindowPickerDialog
          activeWindowId={activeGroupWindowId}
          domain={group.domain}
          onActivateWindow={onActivateWindow}
          onClose={close}
          windows={windowManager.windows}
        />
      ),
      style: {
        left: "50%",
        minWidth: "24rem",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "26rem"
      },
      title: `List:${group.domain}`
    };

    windowManager.openDialog(dialogDefinition);
  }

  return (
    <div className="nu-window-bar" role="group" aria-label="Open windows">
      {groups.map((group) => (
        <AppBarItem
          active={group.active}
          className="nu-window-bar__item"
          interactive
          key={group.id}
          onClick={() => activateGroup(group)}
        >
          {group.label}
        </AppBarItem>
      ))}
    </div>
  );
}

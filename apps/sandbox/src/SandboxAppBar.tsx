import { AppBarHost, WindowBar, useNuWindowManager } from "@deadragdoll/reactnu";
import { CalendarAppBarItem } from "./CalendarAppBarItem";

export function SandboxAppBar() {
  const windowManager = useNuWindowManager();

  return (
    <AppBarHost inline>
      <WindowBar
        items={windowManager.windows.map((windowEntry) => ({
          active: windowEntry.active,
          domain: windowEntry.domain,
          id: windowEntry.id,
          minimized: windowEntry.minimized,
          title: windowEntry.title
        }))}
        onActivateWindow={windowManager.activateWindow}
      />
      <CalendarAppBarItem />
    </AppBarHost>
  );
}

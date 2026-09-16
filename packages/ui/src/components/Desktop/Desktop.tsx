import {
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState
} from "react";
import { MainMenu, hasVisibleMainMenuItems } from "../MainMenu";
import { NuAppHostProvider } from "../../appHost/NuAppHostProvider";
import { AppHostMenuContext } from "../../appHost/appHostContext";
import { resolveMdiMainMenuItems } from "../../windowing/mdiMenu";
import { NuWindowProvider } from "../../windowing/NuWindowProvider";

type DesktopWindowRegionProps = PropsWithChildren<{
  appBar?: ReactNode;
}>;

function DesktopWindowRegion({ appBar, children }: DesktopWindowRegionProps) {
  return (
    <Fragment>
      <div className="nu-desktop__workspace">{children}</div>
      {appBar ? <div className="nu-desktop__app-bar">{appBar}</div> : null}
    </Fragment>
  );
}

export type NuDesktopProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    appBar?: ReactNode;
    appBarContent?: ReactNode;
  }
>;

export function NuDesktop({
  appBar,
  appBarContent,
  children,
  className,
  ...props
}: NuDesktopProps) {
  const [hasAppModal, setHasAppModal] = useState(false);
  const appHostContext = useContext(AppHostMenuContext);

  if (appHostContext) {
    throw new Error("NuDesktop should not be nested inside another app host.");
  }

  return (
    <NuAppHostProvider renderMenu={false}>
      <NuDesktopShell
        appBar={appBar ?? appBarContent}
        className={className}
        hasAppModal={hasAppModal}
        onAppModalChange={setHasAppModal}
        props={props}
      >
        {children}
      </NuDesktopShell>
    </NuAppHostProvider>
  );
}

type NuDesktopShellProps = PropsWithChildren<{
  appBar?: ReactNode;
  className?: string;
  hasAppModal: boolean;
  onAppModalChange: (active: boolean) => void;
  props: HTMLAttributes<HTMLDivElement>;
}>;

function NuDesktopShell({
  appBar,
  children,
  className,
  hasAppModal,
  onAppModalChange,
  props
}: NuDesktopShellProps) {
  const appHostContext = useContext(AppHostMenuContext);

  if (!appHostContext) {
    throw new Error("NuDesktop must be used within a NuAppHostProvider.");
  }

  const resolvedMainMenu = resolveMdiMainMenuItems(
    appHostContext.mainMenu,
    appHostContext.windowBridge
  );

  return (
    <div
      {...props}
      className={["nu-desktop", className].filter(Boolean).join(" ")}
      data-modal-active={hasAppModal || undefined}
    >
      {hasVisibleMainMenuItems(resolvedMainMenu) ? (
        <div className="nu-desktop__menu">
          <MainMenu items={resolvedMainMenu} />
        </div>
      ) : null}
      <NuWindowProvider
        className="nu-desktop__window-region"
        onAppModalChange={onAppModalChange}
        renderAppBar={false}
      >
        <DesktopWindowRegion appBar={appBar}>{children}</DesktopWindowRegion>
      </NuWindowProvider>
    </div>
  );
}

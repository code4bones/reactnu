import { PropsWithChildren, useLayoutEffect, useRef, useState } from "react";

type MainMenuSubmenuShellProps = PropsWithChildren<{
  placement: "root" | "submenu";
}>;

/** Chooses the viewport-facing side only when the default right opening clips. */
export function MainMenuSubmenuShell({
  children,
  placement
}: MainMenuSubmenuShellProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [opensLeft, setOpensLeft] = useState(false);

  useLayoutEffect(() => {
    const shellNode = shellRef.current;

    if (!shellNode) {
      return;
    }

    const parentNode = shellNode.parentElement;

    if (!parentNode) {
      return;
    }

    const submenuNode = shellNode;
    const ownerNode = parentNode;

    function updateDirection() {
      const parentBounds = ownerNode.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const shouldOpenLeft =
        parentBounds.right + submenuNode.offsetWidth > viewportWidth;

      setOpensLeft((currentValue) =>
        currentValue === shouldOpenLeft ? currentValue : shouldOpenLeft
      );
    }

    updateDirection();
    window.addEventListener("resize", updateDirection);

    return () => {
      window.removeEventListener("resize", updateDirection);
    };
  }, []);

  return (
    <div
      className={`nu-main-menu__submenu-shell nu-main-menu__submenu-shell--${placement}`}
      data-open-left={opensLeft || undefined}
      ref={shellRef}
    >
      {children}
    </div>
  );
}

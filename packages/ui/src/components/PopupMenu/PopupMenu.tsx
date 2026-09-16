import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import {
  getPortalViewportRect,
  toPortalCoordinates
} from "../_shared/portalPositioning";
import { getThemePortalStyle } from "../_shared/themePortal";
import { MainMenuList } from "../MainMenu/internals/MainMenuList";
import { MainMenuItem, MainMenuNode } from "../MainMenu/MainMenu.types";

export type PopupMenuPointAnchor = {
  type: "point";
  x: number;
  y: number;
};

export type PopupMenuElementAnchor = {
  element: HTMLElement;
  type: "element";
};

export type PopupMenuAnchor = PopupMenuPointAnchor | PopupMenuElementAnchor;

export type PopupMenuProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  anchor: PopupMenuAnchor | null;
  defaultOpen?: boolean;
  items: MainMenuNode[];
  onItemSelect?: (item: MainMenuItem) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  uncheckedShape?: "box" | "none";
};

function hasVisibleChildren(item: MainMenuItem) {
  return Boolean(item.items?.some((child) => !child.hidden));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveAnchorPosition(anchor: PopupMenuAnchor | null) {
  if (!anchor) {
    return null;
  }

  if (anchor.type === "point") {
    return {
      left: anchor.x,
      top: anchor.y
    };
  }

  const rect = anchor.element.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.bottom - 1
  };
}

function resolvePortalRoot(anchor: PopupMenuAnchor | null) {
  if (typeof document === "undefined") {
    return null;
  }

  return document.body;
}

export function PopupMenu({
  anchor,
  className,
  defaultOpen = false,
  items,
  onItemSelect,
  onOpenChange,
  open,
  style: styleProp,
  uncheckedShape = "box",
  ...props
}: PopupMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;
  const portalRoot = resolvePortalRoot(anchor);

  const setResolvedOpen = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setActivePath([]);
      }

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (!resolvedOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setResolvedOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setResolvedOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [resolvedOpen, setResolvedOpen]);

  useLayoutEffect(() => {
    if (!resolvedOpen || !anchor || !rootRef.current) {
      return;
    }

    const rootNode = rootRef.current;

    function updatePosition() {
      const anchorPosition = resolveAnchorPosition(anchor);

      if (!anchorPosition) {
        return;
      }

      const viewportRect = getPortalViewportRect(portalRoot);
      const relativePosition = toPortalCoordinates(portalRoot, anchorPosition);
      const rect = rootNode.getBoundingClientRect();
      const maxLeft = Math.max(0, viewportRect.width - rect.width);
      const maxTop = Math.max(0, viewportRect.height - rect.height);

      rootNode.style.left = `${clamp(relativePosition.left, 0, maxLeft)}px`;
      rootNode.style.top = `${clamp(relativePosition.top, 0, maxTop)}px`;
      rootNode.style.visibility = "visible";
    }

    rootNode.style.left = "0px";
    rootNode.style.top = "0px";
    rootNode.style.visibility = "hidden";
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchor, portalRoot, resolvedOpen]);

  function handleActivateItem(item: MainMenuItem, level: number) {
    if (item.disabled) {
      return;
    }

    if (hasVisibleChildren(item)) {
      setActivePath((currentPath) =>
        currentPath[level] === item.id
          ? currentPath.slice(0, level)
          : [...currentPath.slice(0, level), item.id]
      );
      return;
    }

    item.onSelect?.();
    onItemSelect?.(item);
    setResolvedOpen(false);
  }

  function handleHoverItem(item: MainMenuItem, level: number) {
    if (item.disabled) {
      return;
    }

    setActivePath((currentPath) => [...currentPath.slice(0, level), item.id]);
  }

  if (
    !resolvedOpen ||
    !anchor ||
    !portalRoot ||
    items.every((item) => item.hidden)
  ) {
    return null;
  }

  return createPortal(
    <div
      {...props}
      className={["nu-popup-menu", className].filter(Boolean).join(" ")}
      onContextMenu={(event) => event.preventDefault()}
      ref={rootRef}
      style={{
        ...getThemePortalStyle(
          anchor?.type === "element" ? anchor.element : null
        ),
        ...styleProp,
        left: 0,
        top: 0,
        visibility: "hidden"
      }}
    >
      <div className="nu-popup-menu__shell">
        <MainMenuList
          activePath={activePath}
          items={items}
          level={0}
          onActivateItem={handleActivateItem}
          onHoverItem={handleHoverItem}
          rootVariant="popup"
          uncheckedShape={uncheckedShape}
        />
      </div>
    </div>,
    portalRoot
  );
}

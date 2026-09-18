import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { MainMenuList } from "./internals/MainMenuList";
import {
  MainMenuItem,
  MainMenuNode,
  isMainMenuItem
} from "./MainMenu.types";

export type MainMenuProps = HTMLAttributes<HTMLDivElement> & {
  items: MainMenuNode[];
  onItemSelect?: (item: MainMenuItem) => void;
  uncheckedShape?: "box" | "none";
};

function hasVisibleChildren(item: MainMenuItem) {
  return Boolean(
    item.items?.some((child) => isMainMenuItem(child) && !child.hidden)
  );
}

export function MainMenu({
  className,
  items,
  onItemSelect,
  uncheckedShape = "box",
  ...props
}: MainMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActivePath([]);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePath([]);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    setActivePath([]);
  }

  function handleHoverItem(item: MainMenuItem, level: number) {
    if (item.disabled) {
      return;
    }

    setActivePath((currentPath) => {
      if (currentPath.length === 0) {
        return currentPath;
      }

      return [...currentPath.slice(0, level), item.id];
    });
  }

  return (
    <div
      {...props}
      className={["nu-main-menu", className].filter(Boolean).join(" ")}
      ref={rootRef}
    >
      <MainMenuList
        activePath={activePath}
        items={items}
        level={0}
        onActivateItem={handleActivateItem}
        onHoverItem={handleHoverItem}
        uncheckedShape={uncheckedShape}
      />
    </div>
  );
}

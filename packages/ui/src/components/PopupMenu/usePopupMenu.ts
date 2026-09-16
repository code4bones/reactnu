import { MouseEvent, useState } from "react";
import { PopupMenuAnchor } from "./PopupMenu";

export function usePopupMenu() {
  const [anchor, setAnchor] = useState<PopupMenuAnchor | null>(null);
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  function openAtPoint(x: number, y: number) {
    setAnchor({
      type: "point",
      x,
      y
    });
    setOpen(true);
  }

  function openAtElement(element: HTMLElement) {
    setAnchor({
      element,
      type: "element"
    });
    setOpen(true);
  }

  function openFromClick(event: MouseEvent<HTMLElement>) {
    openAtElement(event.currentTarget);
  }

  function openFromContextMenu(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    openAtPoint(event.clientX, event.clientY);
  }

  return {
    anchor,
    close,
    open,
    openAtElement,
    openAtPoint,
    openFromClick,
    openFromContextMenu,
    setOpen
  };
}

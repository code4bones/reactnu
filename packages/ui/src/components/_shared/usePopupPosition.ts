import { RefObject, useLayoutEffect } from "react";
import { toPortalCoordinates } from "./portalPositioning";

export type UsePopupPositionOptions = {
  /**
   * Element the popup is anchored to. Its `getBoundingClientRect()` drives
   * the popup's left/top/width.
   */
  anchorRef: RefObject<HTMLElement | null>;
  /** Whether the popup is currently open/mounted. */
  open: boolean;
  /**
   * The popup element itself (already portaled into `portalRoot`). Its
   * inline style is written directly, matching the imperative positioning
   * pattern used by `Dropdown`/`ComboBox`/`SearchBox`.
   */
  popupRef: RefObject<HTMLElement | null>;
  /**
   * Portal root the popup is rendered into. Defaults to `document.body`,
   * which is what every current popup-owning control uses. Coordinates are
   * expressed relative to this root via `toPortalCoordinates`.
   */
  portalRoot?: HTMLElement | null;
};

function defaultPortalRoot() {
  return typeof document === "undefined" ? null : document.body;
}

function applyPopupPosition(
  anchor: HTMLElement,
  popupNode: HTMLElement,
  portalRoot: HTMLElement | null
) {
  const rect = anchor.getBoundingClientRect();
  const coordinates = toPortalCoordinates(portalRoot, {
    left: rect.left,
    top: rect.bottom - 1
  });

  popupNode.style.left = `${coordinates.left}px`;
  popupNode.style.top = `${coordinates.top}px`;
  popupNode.style.width = `${rect.width}px`;
  popupNode.style.visibility = "visible";
}

/**
 * Shared popup-positioning primitive for anchor-following popups
 * (`Dropdown`, `ComboBox`, `SearchBox`, ...).
 *
 * Owns the part of "Popup Ownership" (see docs/ARCHITECTURE.md) that is
 * identical across those controls: measuring the anchor via
 * `getBoundingClientRect()`, converting to portal-relative coordinates via
 * `toPortalCoordinates`, and keeping the popup glued to the anchor on
 * `resize`/`scroll`.
 *
 * `resize`/`scroll` are rAF-throttled: raw events schedule a single
 * recalculation on the next animation frame instead of recomputing
 * synchronously per event, coalescing bursts (fast scroll, drag-resize)
 * into at most one reflow per frame. The initial placement (on open) is
 * still applied synchronously inside the layout effect, before paint, so
 * there is no first-frame flicker.
 */
export function usePopupPosition({
  anchorRef,
  open,
  popupRef,
  portalRoot = defaultPortalRoot()
}: UsePopupPositionOptions) {
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const popupNode = popupRef.current;

    if (!open || !anchor || !popupNode) {
      return;
    }

    let frameId: number | null = null;

    function scheduleUpdate() {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;

        const currentAnchor = anchorRef.current;
        const currentPopupNode = popupRef.current;

        if (!currentAnchor || !currentPopupNode) {
          return;
        }

        applyPopupPosition(currentAnchor, currentPopupNode, portalRoot);
      });
    }

    popupNode.style.left = "0px";
    popupNode.style.top = "0px";
    popupNode.style.width = "0px";
    popupNode.style.visibility = "hidden";
    applyPopupPosition(anchor, popupNode, portalRoot);

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [anchorRef, open, popupRef, portalRoot]);
}

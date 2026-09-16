type PortalViewportRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function isDocumentViewportRoot(portalRoot: HTMLElement | null) {
  if (typeof document === "undefined") {
    return true;
  }

  return (
    !portalRoot ||
    portalRoot === document.body ||
    portalRoot === document.documentElement
  );
}

export function getPortalViewportRect(
  portalRoot: HTMLElement | null
): PortalViewportRect {
  if (isDocumentViewportRoot(portalRoot)) {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  const resolvedPortalRoot = portalRoot;

  if (!resolvedPortalRoot) {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  const rect = resolvedPortalRoot.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
    width: resolvedPortalRoot.clientWidth,
    height: resolvedPortalRoot.clientHeight
  };
}

export function toPortalCoordinates(
  portalRoot: HTMLElement | null,
  position: { left: number; top: number }
) {
  const viewportRect = getPortalViewportRect(portalRoot);

  return {
    left: position.left - viewportRect.left,
    top: position.top - viewportRect.top
  };
}

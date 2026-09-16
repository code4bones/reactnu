import { CSSProperties } from "react";

export function getThemePortalStyle(anchor: HTMLElement | null) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const themeRoot = anchor?.closest(".nu-theme-root");

  if (!themeRoot) {
    return undefined;
  }

  const computed = window.getComputedStyle(themeRoot);
  const style: CSSProperties & Record<string, string> = {
    color: computed.color,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize
  };

  for (const propertyName of computed) {
    if (propertyName.startsWith("--nu-")) {
      style[propertyName] = computed.getPropertyValue(propertyName).trim();
    }
  }

  return style;
}

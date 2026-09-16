import { CSSProperties } from "react";

export type NuDesktopPatternMode =
  | "dot-grid"
  | "dense-dots"
  | "coarse-dots"
  | "grid"
  | "solid";

export type NuThemeTokens = {
  desktopBackground: string;
  desktopPattern: string;
  shellBackground: string;
  appBackground: string;
  appBackgroundAlt: string;
  chromeBackground: string;
  panelBackground: string;
  panelInsetBackground: string;
  titleBackground: string;
  titleText: string;
  textPrimary: string;
  textMuted: string;
  textInverse: string;
  textAccent: string;
  textHotkey: string;
  buttonFace: string;
  buttonFaceAlt: string;
  buttonDanger: string;
  buttonSuccess: string;
  buttonText: string;
  fieldBackground: string;
  fieldText: string;
  borderLight: string;
  borderDark: string;
  borderAccent: string;
  shadowColor: string;
  panelShadowColor: string;
  focusColor: string;
  windowInactiveOverlay: string;
  windowModalBackdrop: string;
};

export type NuThemeDefinition = {
  name: string;
  label: string;
  tokens: NuThemeTokens;
};

const classicTheme: NuThemeDefinition = {
  name: "classic",
  label: "Classic Blue",
  tokens: {
    desktopBackground: "#f3f3f3",
    desktopPattern: "rgb(0 0 0 / 0.18)",
    shellBackground: "#575757",
    appBackground: "#6262e3",
    appBackgroundAlt: "#3030c7",
    chromeBackground: "#ffffff",
    panelBackground: "#6262e3",
    panelInsetBackground: "#6262e3",
    titleBackground: "#ffffff",
    titleText: "#1f36bc",
    textPrimary: "#ffffff",
    textMuted: "#dfe3ff",
    textInverse: "#000000",
    textAccent: "#ffff55",
    textHotkey: "#ff5555",
    buttonFace: "#ffffff",
    buttonFaceAlt: "#c7c7c7",
    buttonDanger: "#c84d4d",
    buttonSuccess: "#188f3b",
    buttonText: "#000000",
    fieldBackground: "#000000",
    fieldText: "#ffffff",
    borderLight: "#ffffff",
    borderDark: "#000000",
    borderAccent: "#ffff55",
    shadowColor: "#000000",
    panelShadowColor: "rgb(0 0 0 / 0.38)",
    focusColor: "#ffff55",
    windowInactiveOverlay: "rgb(0 0 0 / 0.22)",
    windowModalBackdrop: "rgb(0 0 0 / 0.32)"
  }
};

const amberTheme: NuThemeDefinition = {
  name: "amber",
  label: "Amber Monitor",
  tokens: {
    desktopBackground: "#7b5a1e",
    desktopPattern: "#c08a38",
    shellBackground: "#2c2212",
    appBackground: "#4b2b00",
    appBackgroundAlt: "#251400",
    chromeBackground: "#ffd28f",
    panelBackground: "#4b2b00",
    panelInsetBackground: "#382000",
    titleBackground: "#ffd28f",
    titleText: "#4b2b00",
    textPrimary: "#ffd28f",
    textMuted: "#d6b57a",
    textInverse: "#201000",
    textAccent: "#fff27a",
    textHotkey: "#ff5f00",
    buttonFace: "#ffd28f",
    buttonFaceAlt: "#d6b57a",
    buttonDanger: "#b03a1a",
    buttonSuccess: "#4a7a1a",
    buttonText: "#201000",
    fieldBackground: "#201000",
    fieldText: "#ffd28f",
    borderLight: "#ffd28f",
    borderDark: "#000000",
    borderAccent: "#fff27a",
    shadowColor: "#000000",
    panelShadowColor: "rgb(32 16 0 / 0.38)",
    focusColor: "#fff27a",
    windowInactiveOverlay: "rgb(32 16 0 / 0.24)",
    windowModalBackdrop: "rgb(32 16 0 / 0.34)"
  }
};

const phosphorTheme: NuThemeDefinition = {
  name: "phosphor",
  label: "Phosphor Green",
  tokens: {
    desktopBackground: "#35533a",
    desktopPattern: "#5f8f67",
    shellBackground: "#1e271f",
    appBackground: "#11351a",
    appBackgroundAlt: "#071a0b",
    chromeBackground: "#b7ffbf",
    panelBackground: "#11351a",
    panelInsetBackground: "#0d2813",
    titleBackground: "#b7ffbf",
    titleText: "#0b2310",
    textPrimary: "#b7ffbf",
    textMuted: "#8ed39a",
    textInverse: "#061208",
    textAccent: "#f7ff7a",
    textHotkey: "#ff6f6f",
    buttonFace: "#b7ffbf",
    buttonFaceAlt: "#8ed39a",
    buttonDanger: "#bb5e48",
    buttonSuccess: "#2d8c3f",
    buttonText: "#061208",
    fieldBackground: "#061208",
    fieldText: "#b7ffbf",
    borderLight: "#b7ffbf",
    borderDark: "#000000",
    borderAccent: "#f7ff7a",
    shadowColor: "#000000",
    panelShadowColor: "rgb(6 18 8 / 0.38)",
    focusColor: "#f7ff7a",
    windowInactiveOverlay: "rgb(6 18 8 / 0.24)",
    windowModalBackdrop: "rgb(6 18 8 / 0.34)"
  }
};

export const nuThemes = {
  classic: classicTheme,
  amber: amberTheme,
  phosphor: phosphorTheme
} as const satisfies Record<string, NuThemeDefinition>;

export type NuThemeName = keyof typeof nuThemes;

export function isNuThemeName(value: string): value is NuThemeName {
  return value in nuThemes;
}

export function resolveNuTheme(
  theme: NuThemeName | NuThemeDefinition
): NuThemeDefinition {
  return typeof theme === "string" ? nuThemes[theme] : theme;
}

export function getNuThemeStyle(theme: NuThemeDefinition): CSSProperties {
  return {
    "--nu-desktop-bg": theme.tokens.desktopBackground,
    "--nu-desktop-pattern": theme.tokens.desktopPattern,
    "--nu-color-shell": theme.tokens.shellBackground,
    "--nu-color-app-bg": theme.tokens.appBackground,
    "--nu-color-app-bg-alt": theme.tokens.appBackgroundAlt,
    "--nu-color-chrome": theme.tokens.chromeBackground,
    "--nu-color-panel": theme.tokens.panelBackground,
    "--nu-color-panel-inset": theme.tokens.panelInsetBackground,
    "--nu-color-title-bg": theme.tokens.titleBackground,
    "--nu-color-title-text": theme.tokens.titleText,
    "--nu-text-primary": theme.tokens.textPrimary,
    "--nu-text-muted": theme.tokens.textMuted,
    "--nu-text-inverse": theme.tokens.textInverse,
    "--nu-text-accent": theme.tokens.textAccent,
    "--nu-text-hotkey": theme.tokens.textHotkey,
    "--nu-color-button-face": theme.tokens.buttonFace,
    "--nu-color-button-face-alt": theme.tokens.buttonFaceAlt,
    "--nu-color-button-danger": theme.tokens.buttonDanger,
    "--nu-color-button-success": theme.tokens.buttonSuccess,
    "--nu-color-button-text": theme.tokens.buttonText,
    "--nu-color-field-bg": theme.tokens.fieldBackground,
    "--nu-color-field-text": theme.tokens.fieldText,
    "--nu-border-light": theme.tokens.borderLight,
    "--nu-border-dark": theme.tokens.borderDark,
    "--nu-border-accent": theme.tokens.borderAccent,
    "--nu-shadow-color": theme.tokens.shadowColor,
    "--nu-panel-shadow-color": theme.tokens.panelShadowColor,
    "--nu-focus-color": theme.tokens.focusColor ?? theme.tokens.borderAccent,
    "--nu-window-inactive-overlay": theme.tokens.windowInactiveOverlay,
    "--nu-window-modal-backdrop": theme.tokens.windowModalBackdrop
  } as CSSProperties;
}

export function getNuDesktopPatternStyle(
  mode: NuDesktopPatternMode
): CSSProperties {
  switch (mode) {
    case "dense-dots":
      return {
        "--nu-desktop-pattern-image":
          "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
        "--nu-desktop-pattern-repeat": "repeat",
        "--nu-desktop-pattern-size": "3px 3px"
      } as CSSProperties;
    case "coarse-dots":
      return {
        "--nu-desktop-pattern-image":
          "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
        "--nu-desktop-pattern-repeat": "repeat",
        "--nu-desktop-pattern-size": "6px 6px"
      } as CSSProperties;
    case "grid":
      return {
        "--nu-desktop-pattern-image":
          "linear-gradient(var(--nu-desktop-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--nu-desktop-pattern) 1px, transparent 1px)",
        "--nu-desktop-pattern-repeat": "repeat",
        "--nu-desktop-pattern-size": "6px 6px"
      } as CSSProperties;
    case "solid":
      return {
        "--nu-desktop-pattern-image": "none",
        "--nu-desktop-pattern-repeat": "repeat",
        "--nu-desktop-pattern-size": "auto"
      } as CSSProperties;
    case "dot-grid":
    default:
      return {
        "--nu-desktop-pattern-image":
          "radial-gradient(circle at 1px 1px, var(--nu-desktop-pattern) 1px, transparent 1.2px)",
        "--nu-desktop-pattern-repeat": "repeat",
        "--nu-desktop-pattern-size": "4px 4px"
      } as CSSProperties;
  }
}

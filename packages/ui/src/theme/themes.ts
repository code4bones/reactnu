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
  menuBackground: string;
  titleText: string;
  textPrimary: string;
  textMuted: string;
  textInverse: string;
  mainMenuText: string;
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
    menuBackground: "#ffffff",
    titleText: "#1f36bc",
    textPrimary: "#ffffff",
    textMuted: "#dfe3ff",
    textInverse: "#000000",
    mainMenuText: "#000000",
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
    menuBackground: "#ffd28f",
    titleText: "#4b2b00",
    textPrimary: "#ffd28f",
    textMuted: "#d6b57a",
    textInverse: "#201000",
    mainMenuText: "#201000",
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
    menuBackground: "#b7ffbf",
    titleText: "#0b2310",
    textPrimary: "#b7ffbf",
    textMuted: "#8ed39a",
    textInverse: "#061208",
    mainMenuText: "#061208",
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

const midnightTheme: NuThemeDefinition = {
  name: "midnight",
  label: "Midnight Slate",
  tokens: {
    desktopBackground: "#1b2430",
    desktopPattern: "rgb(156 177 201 / 0.24)",
    shellBackground: "#101722",
    appBackground: "#17273b",
    appBackgroundAlt: "#0d1724",
    chromeBackground: "#36547d",
    panelBackground: "#192c43",
    panelInsetBackground: "#111e2e",
    titleBackground: "#0b2432",
    menuBackground: "#1c2945",
    titleText: "#c2d0e5",
    textPrimary: "#6b9adb",
    textMuted: "#65a8ec",
    textInverse: "#b7caf0",
    mainMenuText: "#b7caf0",
    textAccent: "#ffcd57",
    textHotkey: "#fb0404",
    buttonFace: "#5074af",
    buttonFaceAlt: "#3c5372",
    buttonDanger: "#4e0e15",
    buttonSuccess: "#3c936d",
    buttonText: "#ffffff",
    fieldBackground: "#09111c",
    fieldText: "#627b9d",
    borderLight: "#415776",
    borderDark: "#1d2134",
    borderAccent: "#3b5681",
    shadowColor: "#070c14",
    panelShadowColor: "rgb(7 12 20 / 0.56)",
    focusColor: "#af532c",
    windowInactiveOverlay: "rgb(7 12 20 / 0.3)",
    windowModalBackdrop: "rgb(7 12 20 / 0.48)"
  }
};

const grayscaleTheme: NuThemeDefinition = {
  name: "grayscale",
  label: "Grayscale Monitor",
  tokens: {
    desktopBackground: "#808080",
    desktopPattern: "rgb(0 0 0 / 0.3)",
    shellBackground: "#202020",
    appBackground: "#3f3f3f",
    appBackgroundAlt: "#2b2b2b",
    chromeBackground: "#727272",
    panelBackground: "#3f3f3f",
    panelInsetBackground: "#343434",
    titleBackground: "#262626",
    menuBackground: "#262626",
    titleText: "#d0d0d0",
    textPrimary: "#c8c8c8",
    textMuted: "#969696",
    textInverse: "#d0d0d0",
    mainMenuText: "#d0d0d0",
    textAccent: "#e0e0e0",
    textHotkey: "#ffffff",
    buttonFace: "#5b5b5b",
    buttonFaceAlt: "#414141",
    buttonDanger: "#303030",
    buttonSuccess: "#6b6b6b",
    buttonText: "#d0d0d0",
    fieldBackground: "#0e0e0e",
    fieldText: "#d8d8d8",
    borderLight: "#c7c7c7",
    borderDark: "#000000",
    borderAccent: "#ffffff",
    shadowColor: "#000000",
    panelShadowColor: "rgb(0 0 0 / 0.5)",
    focusColor: "#ffffff",
    windowInactiveOverlay: "rgb(0 0 0 / 0.34)",
    windowModalBackdrop: "rgb(0 0 0 / 0.5)"
  }
};

export const nuThemes = {
  classic: classicTheme,
  amber: amberTheme,
  phosphor: phosphorTheme,
  midnight: midnightTheme,
  grayscale: grayscaleTheme
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
    "--nu-color-menu": theme.tokens.menuBackground,
    "--nu-color-title-text": theme.tokens.titleText,
    "--nu-text-primary": theme.tokens.textPrimary,
    "--nu-text-muted": theme.tokens.textMuted,
    "--nu-text-inverse": theme.tokens.textInverse,
    "--nu-main-menu-text": theme.tokens.mainMenuText,
    "--nu-text-accent": theme.tokens.textAccent,
    "--nu-text-hotkey": theme.tokens.textHotkey,
    "--nu-color-button-face": theme.tokens.buttonFace,
    "--nu-color-button-face-alt": theme.tokens.buttonFaceAlt,
    "--nu-color-button-danger": theme.tokens.buttonDanger,
    "--nu-color-button-success": theme.tokens.buttonSuccess,
    "--nu-text-danger": theme.tokens.buttonDanger,
    "--nu-text-success": theme.tokens.buttonSuccess,
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

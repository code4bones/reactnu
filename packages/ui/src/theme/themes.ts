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
  memoBackground: string;
  memoText: string;
  borderLight: string;
  borderDark: string;
  borderAccent: string;
  shadowColor: string;
  panelShadowColor: string;
  focusColor: string;
  windowInactiveOverlay: string;
  windowModalBackdrop: string;
};

export type NuThemeVisualTokens = Record<`--nu-${string}`, string>;

export type NuThemeDefinition = {
  desktopPatternMode?: NuDesktopPatternMode;
  fontFamily?: string;
  fontSize?: number;
  name: string;
  label: string;
  tokens: NuThemeTokens;
  visualTokens?: NuThemeVisualTokens;
};

const classicVisualTokens: NuThemeVisualTokens = {
  "--nu-glyph-cell-size": "1em",
  "--nu-content-inset": "1em 1ch",
  "--nu-control-height": "1.2em",
  "--nu-space-xs": "0.25rem",
  "--nu-space-sm": "0.5rem",
  "--nu-space-md": "0.75rem",
  "--nu-space-lg": "1rem",
  "--nu-space-xl": "1.5rem",
  "--nu-radius-none": "0",
  "--nu-window-title-height": "calc(1em + 10px)",
  "--nu-window-status-height": "1.35rem",
  "--nu-window-title-controls-width": "7.8ch",
  "--nu-window-title-icon-width": "1em",
  "--nu-frame-thickness": "1px",
  "--nu-rule-thickness": "1px",
  "--nu-window-shadow-offset-x": "1ch",
  "--nu-window-shadow-offset-y": "1em",
  "--nu-button-shadow-x": "1ch",
  "--nu-button-shadow-y": "calc(var(--nu-control-height) / 2)",
  "--nu-button-shadow-offset-x": "var(--nu-button-shadow-x)",
  "--nu-button-shadow-offset-y": "calc(var(--nu-control-height) / 2)",
  "--nu-button-press-depth-x": "0.18em",
  "--nu-button-press-depth-y": "0.1em",
  "--nu-app-bar-height": "2.1rem",
  "--nu-app-bar-padding": "0.2rem 0.35rem",
  "--nu-toolbar-background": "#798ee2",
  "--nu-toolbar-inset": "1ch",
  "--nu-toolbar-label-offset-y": "1px",
  "--nu-toolbar-border-color": "transparent",
  "--nu-toolbar-border-style": "solid",
  "--nu-toolbar-border-width": "var(--nu-rule-thickness)",
  "--nu-toolbar-separator-color": "#ffffff",
  "--nu-toolbar-separator-style": "solid",
  "--nu-toolbar-separator-width": "var(--nu-rule-thickness)",
  "--nu-menu-divider-color": "#000000",
  "--nu-menu-divider-style": "solid",
  "--nu-menu-divider-width": "var(--nu-rule-thickness)",
  "--nu-window-shadow-bg": "rgb(0 0 0 / 0.38)",
  "--nu-window-inactive-border":
    "color-mix(in srgb, var(--nu-border-light) 78%, var(--nu-border-dark))",
  "--nu-scrollbar-track": "transparent",
  "--nu-scrollbar-thumb": "var(--nu-color-button-face)",
  "--nu-scrollbar-button-bg": "var(--nu-color-button-face)",
  "--nu-scrollbar-button-size": "0.875rem",
  "--nu-icon-grid-icon-background": "transparent",
  "--nu-icon-grid-icon-border-color": "transparent",
  "--nu-icon-grid-icon-border-style": "solid",
  "--nu-icon-grid-icon-opacity": "1",
  "--nu-icon-grid-icon-selected-background": "var(--nu-color-title-bg)",
  "--nu-icon-grid-icon-inactive-selected-background":
    "color-mix(in srgb, var(--nu-icon-grid-icon-selected-background) 65%, var(--nu-color-app-bg-alt))",
  "--nu-icon-grid-icon-selected-border-color": "var(--nu-focus-color)",
  "--nu-icon-grid-icon-selected-border-style": "solid",
  "--nu-icon-grid-icon-selected-opacity": "1",
  "--nu-icon-grid-icon-focus-background": "var(--nu-color-title-bg)",
  "--nu-icon-grid-icon-focus-border-color": "var(--nu-focus-color)",
  "--nu-icon-grid-icon-focus-border-style": "solid",
  "--nu-icon-grid-icon-focus-opacity": "1",
  "--nu-icon-grid-icon-disabled-opacity": "0.6",
  "--nu-icon-grid-icon-drag-opacity": "0.35",
  "--nu-icon-grid-icon-drag-preview-opacity": "0.85"
};

const classicTheme: NuThemeDefinition = {
  desktopPatternMode: "dot-grid",
  fontFamily: '"Consolas", monospace',
  fontSize: 15,
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
    memoBackground: "#8ae8ff",
    memoText: "#000000",
    borderLight: "#ffffff",
    borderDark: "#000000",
    borderAccent: "#ffff55",
    shadowColor: "#000000",
    panelShadowColor: "rgb(0 0 0 / 0.38)",
    focusColor: "#ffff55",
    windowInactiveOverlay: "rgb(0 0 0 / 0.22)",
    windowModalBackdrop: "rgb(0 0 0 / 0.32)"
  },
  visualTokens: classicVisualTokens
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
    memoBackground: "#ffd28f",
    memoText: "#201000",
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
    memoBackground: "#b7ffbf",
    memoText: "#061208",
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
  desktopPatternMode: "coarse-dots",
  tokens: {
    desktopBackground: "#1b2430",
    desktopPattern: "rgb(156 177 201 / 0.24)",
    shellBackground: "#101722",
    appBackground: "#17273b",
    appBackgroundAlt: "#0d1724",
    chromeBackground: "#36547d",
    panelBackground: "#192c43",
    panelInsetBackground: "#111e2e",
    titleBackground: "#1b3550",
    menuBackground: "#1a2337",
    titleText: "#a8cbff",
    textPrimary: "#b3d2ff",
    textMuted: "#65a8ec",
    textInverse: "#b7caf0",
    mainMenuText: "#b7caf0",
    textAccent: "#ffcd57",
    textHotkey: "#fb0404",
    buttonFace: "#5074af",
    buttonFaceAlt: "#3c5372",
    buttonDanger: "#4e0e15",
    buttonSuccess: "#275214",
    buttonText: "#ffffff",
    fieldBackground: "#09111c",
    fieldText: "#627b9d",
    memoBackground: "#243751",
    memoText: "#9ac8f9",
    borderLight: "#415776",
    borderDark: "#848bae",
    borderAccent: "#3b5681",
    shadowColor: "#070c14",
    panelShadowColor: "rgb(7 12 20 / 0.56)",
    focusColor: "#af532c",
    windowInactiveOverlay: "rgb(7 12 20 / 0.3)",
    windowModalBackdrop: "rgb(7 12 20 / 0.48)"
  },
  visualTokens: {
    "--nu-glyph-cell-size": "1em",
    "--nu-content-inset": "1em 1ch",
    "--nu-control-height": "1.2em",
    "--nu-space-xs": "0.25rem",
    "--nu-space-sm": "0.5rem",
    "--nu-space-md": "0.75rem",
    "--nu-space-lg": "1rem",
    "--nu-space-xl": "1.5rem",
    "--nu-radius-none": "0",
    "--nu-window-title-height": "calc(1em + 10px)",
    "--nu-window-status-height": "1.35rem",
    "--nu-window-title-controls-width": "7.8ch",
    "--nu-window-title-icon-width": "1em",
    "--nu-frame-thickness": "1px",
    "--nu-rule-thickness": "1px",
    "--nu-window-shadow-offset-x": "1ch",
    "--nu-window-shadow-offset-y": "1em",
    "--nu-button-shadow-x": "1ch",
    "--nu-button-shadow-y": "calc(var(--nu-control-height) / 2)",
    "--nu-button-shadow-offset-x": "var(--nu-button-shadow-x)",
    "--nu-button-shadow-offset-y": "calc(var(--nu-control-height) / 2)",
    "--nu-button-press-depth-x": "0.18em",
    "--nu-button-press-depth-y": "0.1em",
    "--nu-app-bar-height": "2.1rem",
    "--nu-app-bar-padding": "0.2rem 0.35rem",
    "--nu-toolbar-background": "#1b3550",
    "--nu-toolbar-inset": "1ch",
    "--nu-toolbar-border-color": "var(--nu-border-dark)",
    "--nu-toolbar-border-style": "none",
    "--nu-toolbar-border-width": "var(--nu-rule-thickness)",
    "--nu-toolbar-separator-color": "#6184bd",
    "--nu-toolbar-separator-style": "solid",
    "--nu-toolbar-separator-width": "var(--nu-rule-thickness)",
    "--nu-menu-divider-color": "#3d5a8a",
    "--nu-menu-divider-style": "solid",
    "--nu-menu-divider-width": "var(--nu-rule-thickness)",
    "--nu-window-shadow-bg": "rgb(0 0 0 / 0.38)",
    "--nu-window-inactive-border":
      "color-mix(in srgb, var(--nu-border-light) 78%, var(--nu-border-dark))",
    "--nu-scrollbar-track": "transparent",
    "--nu-scrollbar-thumb": "var(--nu-color-button-face)",
    "--nu-scrollbar-button-bg": "var(--nu-color-button-face)",
    "--nu-scrollbar-button-size": "0.875rem",
    "--nu-icon-grid-icon-background": "transparent",
    "--nu-icon-grid-icon-border-color": "transparent",
    "--nu-icon-grid-icon-border-style": "solid",
    "--nu-icon-grid-icon-opacity": "1",
    "--nu-icon-grid-icon-selected-background": "var(--nu-color-title-bg)",
    "--nu-icon-grid-icon-inactive-selected-background":
      "color-mix(in srgb, var(--nu-icon-grid-icon-selected-background) 65%, var(--nu-color-app-bg-alt))",
    "--nu-icon-grid-icon-selected-border-color": "transparent",
    "--nu-icon-grid-icon-selected-border-style": "none",
    "--nu-icon-grid-icon-selected-opacity": "1",
    "--nu-icon-grid-icon-focus-background": "#153051",
    "--nu-icon-grid-icon-focus-border-color": "#5672bd",
    "--nu-icon-grid-icon-focus-border-style": "solid",
    "--nu-icon-grid-icon-focus-opacity": "1",
    "--nu-icon-grid-icon-disabled-opacity": "0.6",
    "--nu-icon-grid-icon-drag-opacity": "0.35",
    "--nu-icon-grid-icon-drag-preview-opacity": "0.85"
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
    memoBackground: "#d8d8d8",
    memoText: "#000000",
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
    "--nu-color-memo-bg": theme.tokens.memoBackground,
    "--nu-color-memo-text": theme.tokens.memoText,
    "--nu-border-light": theme.tokens.borderLight,
    "--nu-border-dark": theme.tokens.borderDark,
    "--nu-border-accent": theme.tokens.borderAccent,
    "--nu-shadow-color": theme.tokens.shadowColor,
    "--nu-panel-shadow-color": theme.tokens.panelShadowColor,
    "--nu-focus-color": theme.tokens.focusColor ?? theme.tokens.borderAccent,
    "--nu-window-inactive-overlay": theme.tokens.windowInactiveOverlay,
    "--nu-window-modal-backdrop": theme.tokens.windowModalBackdrop,
    ...theme.visualTokens
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

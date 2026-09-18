/* eslint-disable react-refresh/only-export-components -- This sandbox module intentionally keeps the theme host, token catalog, and its consumer hook together. */
import {
  CSSProperties,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import {
  NuDesktopPatternMode,
  NuThemeDefinition,
  NuThemeName,
  NuThemeTokens,
  NuThemeProvider,
  getNuDesktopPatternStyle,
  isNuThemeName,
  nuThemes
} from "@deadragdoll/reactnu";

export type ThemeTokenField = {
  cssVariable: string;
  key: keyof NuThemeTokens;
  label: string;
};

export type VisualTokenField = {
  cssVariable: string;
  control?: "border-style" | "color" | "opacity";
  defaultValue: string;
  label: string;
};

export const THEME_TOKEN_GROUPS: ReadonlyArray<{
  fields: ReadonlyArray<ThemeTokenField>;
  title: string;
}> = [
  {
    title: "Desktop and surfaces",
    fields: [
      {
        key: "desktopBackground",
        cssVariable: "--nu-desktop-bg",
        label: "Desktop background"
      },
      {
        key: "desktopPattern",
        cssVariable: "--nu-desktop-pattern",
        label: "Desktop pattern"
      },
      {
        key: "shellBackground",
        cssVariable: "--nu-color-shell",
        label: "Shell / app bar"
      },
      {
        key: "appBackground",
        cssVariable: "--nu-color-app-bg",
        label: "Application background"
      },
      {
        key: "appBackgroundAlt",
        cssVariable: "--nu-color-app-bg-alt",
        label: "Alternate application background"
      },
      {
        key: "chromeBackground",
        cssVariable: "--nu-color-chrome",
        label: "Chrome"
      },
      {
        key: "panelBackground",
        cssVariable: "--nu-color-panel",
        label: "Panel"
      },
      {
        key: "panelInsetBackground",
        cssVariable: "--nu-color-panel-inset",
        label: "Inset panel"
      },
      {
        key: "titleBackground",
        cssVariable: "--nu-color-title-bg",
        label: "Title / status background"
      },
      {
        key: "menuBackground",
        cssVariable: "--nu-color-menu",
        label: "Menu background"
      },
      {
        key: "titleText",
        cssVariable: "--nu-color-title-text",
        label: "Title / status text"
      }
    ]
  },
  {
    title: "Text and focus",
    fields: [
      {
        key: "textPrimary",
        cssVariable: "--nu-text-primary",
        label: "Primary text"
      },
      { key: "textMuted", cssVariable: "--nu-text-muted", label: "Muted text" },
      {
        key: "textInverse",
        cssVariable: "--nu-text-inverse",
        label: "Inverse text"
      },
      {
        key: "mainMenuText",
        cssVariable: "--nu-main-menu-text",
        label: "Main menu text"
      },
      {
        key: "textAccent",
        cssVariable: "--nu-text-accent",
        label: "Accent text"
      },
      {
        key: "textHotkey",
        cssVariable: "--nu-text-hotkey",
        label: "Mnemonic / hotkey"
      },
      { key: "focusColor", cssVariable: "--nu-focus-color", label: "Focus" }
    ]
  },
  {
    title: "Controls and borders",
    fields: [
      {
        key: "buttonFace",
        cssVariable: "--nu-color-button-face",
        label: "Button face"
      },
      {
        key: "buttonFaceAlt",
        cssVariable: "--nu-color-button-face-alt",
        label: "Secondary button face"
      },
      {
        key: "buttonDanger",
        cssVariable: "--nu-color-button-danger",
        label: "Danger button"
      },
      {
        key: "buttonSuccess",
        cssVariable: "--nu-color-button-success",
        label: "Success button"
      },
      {
        key: "buttonText",
        cssVariable: "--nu-color-button-text",
        label: "Button text"
      },
      {
        key: "fieldBackground",
        cssVariable: "--nu-color-field-bg",
        label: "Field background"
      },
      {
        key: "fieldText",
        cssVariable: "--nu-color-field-text",
        label: "Field text"
      },
      {
        key: "borderLight",
        cssVariable: "--nu-border-light",
        label: "Light border"
      },
      {
        key: "borderDark",
        cssVariable: "--nu-border-dark",
        label: "Dark border"
      },
      {
        key: "borderAccent",
        cssVariable: "--nu-border-accent",
        label: "Accent border"
      }
    ]
  },
  {
    title: "Overlays and shadows",
    fields: [
      {
        key: "shadowColor",
        cssVariable: "--nu-shadow-color",
        label: "Shadow color"
      },
      {
        key: "panelShadowColor",
        cssVariable: "--nu-panel-shadow-color",
        label: "Panel shadow"
      },
      {
        key: "windowInactiveOverlay",
        cssVariable: "--nu-window-inactive-overlay",
        label: "Inactive window overlay"
      },
      {
        key: "windowModalBackdrop",
        cssVariable: "--nu-window-modal-backdrop",
        label: "Modal backdrop"
      }
    ]
  }
];

export const VISUAL_TOKEN_GROUPS: ReadonlyArray<{
  fields: ReadonlyArray<VisualTokenField>;
  title: string;
}> = [
  {
    title: "Typography and density",
    fields: [
      {
        cssVariable: "--nu-glyph-cell-size",
        defaultValue: "1em",
        label: "Glyph cell size"
      },
      {
        cssVariable: "--nu-content-inset",
        defaultValue: "1em 1ch",
        label: "Content inset"
      },
      {
        cssVariable: "--nu-control-height",
        defaultValue: "1.2em",
        label: "Control height"
      },
      {
        cssVariable: "--nu-space-xs",
        defaultValue: "0.25rem",
        label: "Space XS"
      },
      {
        cssVariable: "--nu-space-sm",
        defaultValue: "0.5rem",
        label: "Space SM"
      },
      {
        cssVariable: "--nu-space-md",
        defaultValue: "0.75rem",
        label: "Space MD"
      },
      { cssVariable: "--nu-space-lg", defaultValue: "1rem", label: "Space LG" },
      {
        cssVariable: "--nu-space-xl",
        defaultValue: "1.5rem",
        label: "Space XL"
      },
      {
        cssVariable: "--nu-radius-none",
        defaultValue: "0",
        label: "Control radius"
      }
    ]
  },
  {
    title: "Window and frame geometry",
    fields: [
      {
        cssVariable: "--nu-window-title-height",
        defaultValue: "calc(1em + 3px)",
        label: "Title bar height"
      },
      {
        cssVariable: "--nu-window-status-height",
        defaultValue: "1.35rem",
        label: "Status bar height"
      },
      {
        cssVariable: "--nu-window-title-controls-width",
        defaultValue: "7.8ch",
        label: "Title controls width"
      },
      {
        cssVariable: "--nu-window-title-icon-width",
        defaultValue: "1em",
        label: "Title icon width"
      },
      {
        cssVariable: "--nu-frame-thickness",
        defaultValue: "2px",
        label: "Frame thickness"
      },
      {
        cssVariable: "--nu-rule-thickness",
        defaultValue: "1px",
        label: "Rule thickness"
      },
      {
        cssVariable: "--nu-window-shadow-offset-x",
        defaultValue: "1ch",
        label: "Window shadow X"
      },
      {
        cssVariable: "--nu-window-shadow-offset-y",
        defaultValue: "1em",
        label: "Window shadow Y"
      }
    ]
  },
  {
    title: "Buttons and app bar",
    fields: [
      {
        cssVariable: "--nu-button-shadow-x",
        defaultValue: "1ch",
        label: "Button shadow X"
      },
      {
        cssVariable: "--nu-button-shadow-y",
        defaultValue: "calc(var(--nu-control-height) / 2)",
        label: "Button shadow Y"
      },
      {
        cssVariable: "--nu-button-shadow-offset-x",
        defaultValue: "var(--nu-button-shadow-x)",
        label: "Button shadow offset X"
      },
      {
        cssVariable: "--nu-button-shadow-offset-y",
        defaultValue: "calc(var(--nu-control-height) / 2)",
        label: "Button shadow offset Y"
      },
      {
        cssVariable: "--nu-button-press-depth-x",
        defaultValue: "0.18em",
        label: "Button press X"
      },
      {
        cssVariable: "--nu-button-press-depth-y",
        defaultValue: "0.1em",
        label: "Button press Y"
      },
      {
        cssVariable: "--nu-app-bar-height",
        defaultValue: "2.1rem",
        label: "App bar height"
      },
      {
        cssVariable: "--nu-app-bar-padding",
        defaultValue: "0.2rem 0.35rem",
        label: "App bar padding"
      }
    ]
  },
  {
    title: "Toolbar and menu dividers",
    fields: [
      {
        cssVariable: "--nu-toolbar-background",
        control: "color",
        defaultValue: "var(--nu-color-panel)",
        label: "Toolbar background"
      },
      {
        cssVariable: "--nu-toolbar-inset",
        defaultValue: "0.2ch",
        label: "Toolbar inset"
      },
      {
        cssVariable: "--nu-toolbar-border-color",
        control: "color",
        defaultValue: "var(--nu-border-dark)",
        label: "Toolbar border color"
      },
      {
        cssVariable: "--nu-toolbar-border-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Toolbar border style"
      },
      {
        cssVariable: "--nu-toolbar-border-width",
        defaultValue: "var(--nu-rule-thickness)",
        label: "Toolbar border width"
      },
      {
        cssVariable: "--nu-toolbar-separator-color",
        control: "color",
        defaultValue: "var(--nu-border-dark)",
        label: "Toolbar separator color"
      },
      {
        cssVariable: "--nu-toolbar-separator-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Toolbar separator style"
      },
      {
        cssVariable: "--nu-toolbar-separator-width",
        defaultValue: "var(--nu-rule-thickness)",
        label: "Toolbar separator width"
      },
      {
        cssVariable: "--nu-menu-divider-color",
        control: "color",
        defaultValue: "var(--nu-border-dark)",
        label: "Menu divider color"
      },
      {
        cssVariable: "--nu-menu-divider-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Menu divider style"
      },
      {
        cssVariable: "--nu-menu-divider-width",
        defaultValue: "var(--nu-rule-thickness)",
        label: "Menu divider width"
      }
    ]
  },
  {
    title: "Effects and scrollbars",
    fields: [
      {
        cssVariable: "--nu-window-shadow-bg",
        defaultValue: "rgb(0 0 0 / 0.38)",
        label: "Window shadow fill"
      },
      {
        cssVariable: "--nu-window-inactive-border",
        defaultValue:
          "color-mix(in srgb, var(--nu-border-light) 78%, var(--nu-border-dark))",
        label: "Inactive window border"
      },
      {
        cssVariable: "--nu-scrollbar-track",
        defaultValue: "transparent",
        label: "Scrollbar track"
      },
      {
        cssVariable: "--nu-scrollbar-thumb",
        defaultValue: "var(--nu-color-button-face)",
        label: "Scrollbar thumb"
      },
      {
        cssVariable: "--nu-scrollbar-button-bg",
        defaultValue: "var(--nu-color-button-face)",
        label: "Scrollbar button"
      },
      {
        cssVariable: "--nu-scrollbar-button-size",
        defaultValue: "0.875rem",
        label: "Scrollbar button size"
      }
    ]
  },
  {
    title: "Icon grid states",
    fields: [
      {
        cssVariable: "--nu-icon-grid-icon-background",
        control: "color",
        defaultValue: "transparent",
        label: "Default background"
      },
      {
        cssVariable: "--nu-icon-grid-icon-border-color",
        control: "color",
        defaultValue: "transparent",
        label: "Default border color"
      },
      {
        cssVariable: "--nu-icon-grid-icon-border-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Default border style"
      },
      {
        cssVariable: "--nu-icon-grid-icon-opacity",
        control: "opacity",
        defaultValue: "1",
        label: "Default background opacity"
      },
      {
        cssVariable: "--nu-icon-grid-icon-selected-background",
        control: "color",
        defaultValue: "var(--nu-color-title-bg)",
        label: "Selected background"
      },
      {
        cssVariable: "--nu-icon-grid-icon-inactive-selected-background",
        control: "color",
        defaultValue:
          "color-mix(in srgb, var(--nu-icon-grid-icon-selected-background) 65%, var(--nu-color-app-bg-alt))",
        label: "Inactive selected background"
      },
      {
        cssVariable: "--nu-icon-grid-icon-selected-border-color",
        control: "color",
        defaultValue: "var(--nu-focus-color)",
        label: "Selected border color"
      },
      {
        cssVariable: "--nu-icon-grid-icon-selected-border-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Selected border style"
      },
      {
        cssVariable: "--nu-icon-grid-icon-selected-opacity",
        control: "opacity",
        defaultValue: "1",
        label: "Selected background opacity"
      },
      {
        cssVariable: "--nu-icon-grid-icon-focus-background",
        control: "color",
        defaultValue: "var(--nu-color-title-bg)",
        label: "Focus background"
      },
      {
        cssVariable: "--nu-icon-grid-icon-focus-border-color",
        control: "color",
        defaultValue: "var(--nu-focus-color)",
        label: "Focus border color"
      },
      {
        cssVariable: "--nu-icon-grid-icon-focus-border-style",
        control: "border-style",
        defaultValue: "solid",
        label: "Focus border style"
      },
      {
        cssVariable: "--nu-icon-grid-icon-focus-opacity",
        control: "opacity",
        defaultValue: "1",
        label: "Focus background opacity"
      },
      {
        cssVariable: "--nu-icon-grid-icon-disabled-opacity",
        control: "opacity",
        defaultValue: "0.6",
        label: "Disabled opacity"
      },
      {
        cssVariable: "--nu-icon-grid-icon-drag-opacity",
        control: "opacity",
        defaultValue: "0.35",
        label: "Drag source opacity"
      },
      {
        cssVariable: "--nu-icon-grid-icon-drag-preview-opacity",
        control: "opacity",
        defaultValue: "0.85",
        label: "Drag preview opacity"
      }
    ]
  }
];

const INITIAL_FONT_FAMILY = '"Comic Sans MS", "Comic Sans", cursive';
const INITIAL_FONT_SIZE = 16;

function getInitialVisualTokens() {
  return Object.fromEntries(
    VISUAL_TOKEN_GROUPS.flatMap((group) =>
      group.fields.map((field) => [field.cssVariable, field.defaultValue])
    )
  ) as Record<string, string>;
}

function getThemeCss(
  theme: NuThemeDefinition,
  visualTokens: Record<string, string>,
  desktopPatternMode: NuDesktopPatternMode,
  fontFamily: string,
  fontSize: number
) {
  const paletteLines = THEME_TOKEN_GROUPS.flatMap((group) =>
    group.fields.map(
      (field) => `  ${field.cssVariable}: ${theme.tokens[field.key]};`
    )
  );
  const patternLines = Object.entries(
    getNuDesktopPatternStyle(desktopPatternMode)
  ).map(([cssVariable, value]) => `  ${cssVariable}: ${value};`);
  const visualLines = VISUAL_TOKEN_GROUPS.flatMap((group) =>
    group.fields.map(
      (field) => `  ${field.cssVariable}: ${visualTokens[field.cssVariable]};`
    )
  );

  return [
    "/* Generated by the ReactNU sandbox Theme Designer. */",
    ".nu-theme-root {",
    ...paletteLines,
    ...patternLines,
    `  --nu-font-body: ${fontFamily};`,
    `  font-size: ${fontSize}px;`,
    ...visualLines,
    "}"
  ].join("\n");
}

type SandboxThemeDesignerContextValue = {
  baseThemeName: NuThemeName;
  cssExport: string;
  desktopPatternMode: NuDesktopPatternMode;
  fontFamily: string;
  fontSize: number;
  importThemeJson: (source: string) => ThemeImportResult;
  jsonExport: string;
  resetTheme: () => void;
  resolvedTheme: NuThemeDefinition;
  selectBaseTheme: (themeName: NuThemeName) => void;
  setDesktopPatternMode: (mode: NuDesktopPatternMode) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setThemeToken: (key: keyof NuThemeTokens, value: string) => void;
  setVisualToken: (cssVariable: string, value: string) => void;
  visualTokens: Record<string, string>;
};

type ThemeImportResult = {
  message: string;
  ok: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDesktopPatternMode(value: unknown): value is NuDesktopPatternMode {
  return (
    value === "dot-grid" ||
    value === "dense-dots" ||
    value === "coarse-dots" ||
    value === "grid" ||
    value === "solid"
  );
}

const SandboxThemeDesignerContext =
  createContext<SandboxThemeDesignerContextValue | null>(null);

type SandboxThemeHostProps = PropsWithChildren;

export function SandboxThemeHost({ children }: SandboxThemeHostProps) {
  const [baseThemeName, setBaseThemeName] = useState<NuThemeName>("classic");
  const [desktopPatternMode, setDesktopPatternMode] =
    useState<NuDesktopPatternMode>("dot-grid");
  const [fontFamily, setFontFamily] = useState(INITIAL_FONT_FAMILY);
  const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
  const [themeOverrides, setThemeOverrides] = useState<Partial<NuThemeTokens>>(
    {}
  );
  const [visualTokens, setVisualTokens] = useState(getInitialVisualTokens);

  const resolvedTheme = useMemo<NuThemeDefinition>(
    () => ({
      label: "Sandbox custom theme",
      name: "sandbox-custom",
      tokens: {
        ...nuThemes[baseThemeName].tokens,
        ...themeOverrides
      }
    }),
    [baseThemeName, themeOverrides]
  );
  const themeStyle = useMemo(
    () => visualTokens as CSSProperties,
    [visualTokens]
  );

  const selectBaseTheme = useCallback((themeName: NuThemeName) => {
    setBaseThemeName(themeName);
    setThemeOverrides({});
    setVisualTokens(getInitialVisualTokens());
    setDesktopPatternMode("dot-grid");
  }, []);

  const resetTheme = useCallback(() => {
    setThemeOverrides({});
    setVisualTokens(getInitialVisualTokens());
    setDesktopPatternMode("dot-grid");
    setFontFamily(INITIAL_FONT_FAMILY);
    setFontSize(INITIAL_FONT_SIZE);
  }, []);

  const setThemeToken = useCallback(
    (key: keyof NuThemeTokens, value: string) => {
      setThemeOverrides((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const setVisualToken = useCallback((cssVariable: string, value: string) => {
    setVisualTokens((current) => ({ ...current, [cssVariable]: value }));
  }, []);

  const importThemeJson = useCallback((source: string): ThemeImportResult => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(source);
    } catch {
      return {
        message: "Import failed: the value is not valid JSON.",
        ok: false
      };
    }

    if (
      !isRecord(parsed) ||
      !isRecord(parsed.theme) ||
      !isRecord(parsed.provider)
    ) {
      return {
        message: "Import failed: expected a Theme Designer JSON export.",
        ok: false
      };
    }

    if (!isRecord(parsed.theme.tokens)) {
      return { message: "Import failed: theme tokens are missing.", ok: false };
    }

    const importedBaseThemeName =
      typeof parsed.baseThemeName === "string" &&
      isNuThemeName(parsed.baseThemeName)
        ? parsed.baseThemeName
        : "classic";
    const importedTokens: NuThemeTokens = {
      ...nuThemes[importedBaseThemeName].tokens
    };
    let fallbackTokenCount = 0;

    for (const field of THEME_TOKEN_GROUPS.flatMap((group) => group.fields)) {
      const value = parsed.theme.tokens[field.key];

      if (value === undefined) {
        if (
          field.key === "mainMenuText" &&
          typeof parsed.theme.tokens.textInverse === "string"
        ) {
          importedTokens.mainMenuText = parsed.theme.tokens.textInverse;
        }

        if (
          field.key === "menuBackground" &&
          typeof parsed.theme.tokens.titleBackground === "string"
        ) {
          importedTokens.menuBackground = parsed.theme.tokens.titleBackground;
        }

        fallbackTokenCount += 1;
        continue;
      }

      if (typeof value !== "string") {
        return {
          message: `Import failed: ${field.key} must be a CSS value.`,
          ok: false
        };
      }

      importedTokens[field.key] = value;
    }

    const {
      desktopPatternMode: importedPatternMode,
      fontFamily: importedFontFamily,
      fontSize: importedFontSize
    } = parsed.provider;

    if (!isDesktopPatternMode(importedPatternMode)) {
      return { message: "Import failed: unknown desktop pattern.", ok: false };
    }

    if (typeof importedFontFamily !== "string") {
      return { message: "Import failed: font family must be text.", ok: false };
    }

    if (
      typeof importedFontSize !== "number" ||
      !Number.isFinite(importedFontSize) ||
      importedFontSize < 8
    ) {
      return {
        message: "Import failed: font size must be 8 or greater.",
        ok: false
      };
    }

    const importedVisualTokens = getInitialVisualTokens();

    if (parsed.visualTokens !== undefined) {
      if (!isRecord(parsed.visualTokens)) {
        return {
          message: "Import failed: visual tokens must be an object.",
          ok: false
        };
      }

      for (const field of VISUAL_TOKEN_GROUPS.flatMap(
        (group) => group.fields
      )) {
        const value = parsed.visualTokens[field.cssVariable];

        if (value !== undefined && typeof value !== "string") {
          return {
            message: `Import failed: ${field.cssVariable} must be a CSS value.`,
            ok: false
          };
        }

        if (typeof value === "string") {
          importedVisualTokens[field.cssVariable] = value;
        }
      }
    }

    setBaseThemeName(importedBaseThemeName);
    setThemeOverrides(importedTokens);
    setVisualTokens(importedVisualTokens);
    setDesktopPatternMode(importedPatternMode);
    setFontFamily(importedFontFamily);
    setFontSize(importedFontSize);

    return {
      message:
        fallbackTokenCount > 0
          ? `Theme imported. Defaults supplied for ${fallbackTokenCount} missing token(s).`
          : "Theme imported and applied.",
      ok: true
    };
  }, []);

  const cssExport = useMemo(
    () =>
      getThemeCss(
        resolvedTheme,
        visualTokens,
        desktopPatternMode,
        fontFamily,
        fontSize
      ),
    [resolvedTheme, visualTokens, desktopPatternMode, fontFamily, fontSize]
  );
  const jsonExport = useMemo(
    () =>
      JSON.stringify(
        {
          theme: resolvedTheme,
          baseThemeName,
          provider: { desktopPatternMode, fontFamily, fontSize },
          visualTokens
        },
        null,
        2
      ),
    [
      resolvedTheme,
      baseThemeName,
      visualTokens,
      desktopPatternMode,
      fontFamily,
      fontSize
    ]
  );
  const contextValue = useMemo(
    () => ({
      baseThemeName,
      cssExport,
      desktopPatternMode,
      fontFamily,
      fontSize,
      importThemeJson,
      jsonExport,
      resetTheme,
      resolvedTheme,
      selectBaseTheme,
      setDesktopPatternMode,
      setFontFamily,
      setFontSize,
      setThemeToken,
      setVisualToken,
      visualTokens
    }),
    [
      baseThemeName,
      cssExport,
      desktopPatternMode,
      fontFamily,
      fontSize,
      importThemeJson,
      jsonExport,
      resetTheme,
      resolvedTheme,
      selectBaseTheme,
      setThemeToken,
      setVisualToken,
      visualTokens
    ]
  );

  return (
    <SandboxThemeDesignerContext.Provider value={contextValue}>
      <NuThemeProvider
        desktopPatternMode={desktopPatternMode}
        fontFamily={fontFamily}
        fontSize={fontSize}
        onDesktopPatternModeChange={setDesktopPatternMode}
        onFontFamilyChange={setFontFamily}
        onFontSizeChange={setFontSize}
        style={themeStyle}
        theme={resolvedTheme}
      >
        {children}
      </NuThemeProvider>
    </SandboxThemeDesignerContext.Provider>
  );
}

export function useSandboxThemeDesigner() {
  const context = useContext(SandboxThemeDesignerContext);

  if (!context) {
    throw new Error(
      "useSandboxThemeDesigner must be used within SandboxThemeHost."
    );
  }

  return context;
}

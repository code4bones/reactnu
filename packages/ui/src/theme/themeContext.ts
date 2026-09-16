import { createContext, useContext } from "react";
import {
  NuDesktopPatternMode,
  NuThemeDefinition,
  NuThemeName,
  nuThemes
} from "./themes";

export type NuThemeContextValue = {
  desktopPatternMode: NuDesktopPatternMode;
  fontFamily: string;
  fontSize: number;
  themeName: string;
  resolvedTheme: NuThemeDefinition;
  setDesktopPatternMode: (desktopPatternMode: NuDesktopPatternMode) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setTheme: (theme: NuThemeName) => void;
  themes: typeof nuThemes;
};

export const NuThemeContext = createContext<NuThemeContextValue | null>(null);

export function useNuTheme() {
  const context = useContext(NuThemeContext);

  if (!context) {
    throw new Error("useNuTheme must be used within a NuThemeProvider.");
  }

  return context;
}

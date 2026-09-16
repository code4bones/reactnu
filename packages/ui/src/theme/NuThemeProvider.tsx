import {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useId,
  useMemo,
  useState
} from "react";
import { NuCrtGlitch, NuCrtGlitchProps } from "../components/CrtGlitch";
import {
  NuDesktopPatternMode,
  NuThemeDefinition,
  NuThemeName,
  getNuDesktopPatternStyle,
  getNuThemeStyle,
  nuThemes,
  resolveNuTheme
} from "./themes";
import { NuThemeContext } from "./themeContext";

type NuThemeProviderProps = PropsWithChildren<{
  onThemeChange?: (theme: NuThemeName) => void;
  className?: string;
  /**
   * Enables the subliminal CRT-glitch effect (see `NuCrtGlitch`). Pass
   * `true` for its defaults, or an options object to tune them. Omitted or
   * `false` by default — the effect is opt-in.
   */
  crtGlitch?: boolean | NuCrtGlitchProps;
  defaultDesktopPatternMode?: NuDesktopPatternMode;
  defaultFontFamily?: string;
  defaultFontSize?: number;
  defaultTheme?: NuThemeName;
  desktopPatternMode?: NuDesktopPatternMode;
  fontFamily?: string;
  fontSize?: number;
  onDesktopPatternModeChange?: (
    desktopPatternMode: NuDesktopPatternMode
  ) => void;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  theme?: NuThemeName | NuThemeDefinition;
}>;

export function NuThemeProvider({
  children,
  className,
  crtGlitch = false,
  defaultDesktopPatternMode = "dot-grid",
  defaultFontFamily = '"IBM Plex Mono", "Cascadia Mono", "Consolas", monospace',
  defaultFontSize = 16,
  defaultTheme = "classic",
  desktopPatternMode,
  fontFamily,
  fontSize,
  onDesktopPatternModeChange,
  onFontFamilyChange,
  onFontSizeChange,
  onThemeChange,
  theme
}: NuThemeProviderProps) {
  const generatedId = useId();
  const [internalTheme, setInternalTheme] = useState<NuThemeName>(defaultTheme);
  const [internalDesktopPatternMode, setInternalDesktopPatternMode] =
    useState<NuDesktopPatternMode>(defaultDesktopPatternMode);
  const [internalFontFamily, setInternalFontFamily] =
    useState(defaultFontFamily);
  const [internalFontSize, setInternalFontSize] = useState(defaultFontSize);
  const currentTheme = theme ?? internalTheme;
  const resolvedDesktopPatternMode =
    desktopPatternMode ?? internalDesktopPatternMode;
  const resolvedFontFamily = fontFamily ?? internalFontFamily;
  const resolvedFontSize = fontSize ?? internalFontSize;
  const resolvedTheme = resolveNuTheme(currentTheme);
  const themeName =
    typeof currentTheme === "string" ? currentTheme : currentTheme.name;

  const handleThemeChange = useCallback(
    (nextTheme: NuThemeName) => {
      if (theme === undefined) {
        setInternalTheme(nextTheme);
      }

      onThemeChange?.(nextTheme);
    },
    [theme, onThemeChange]
  );

  const handleDesktopPatternModeChange = useCallback(
    (nextDesktopPatternMode: NuDesktopPatternMode) => {
      if (desktopPatternMode === undefined) {
        setInternalDesktopPatternMode(nextDesktopPatternMode);
      }

      onDesktopPatternModeChange?.(nextDesktopPatternMode);
    },
    [desktopPatternMode, onDesktopPatternModeChange]
  );

  const handleFontFamilyChange = useCallback(
    (nextFontFamily: string) => {
      if (fontFamily === undefined) {
        setInternalFontFamily(nextFontFamily);
      }

      onFontFamilyChange?.(nextFontFamily);
    },
    [fontFamily, onFontFamilyChange]
  );

  const handleFontSizeChange = useCallback(
    (nextFontSize: number) => {
      if (fontSize === undefined) {
        setInternalFontSize(nextFontSize);
      }

      onFontSizeChange?.(nextFontSize);
    },
    [fontSize, onFontSizeChange]
  );

  const contextValue = useMemo(
    () => ({
      desktopPatternMode: resolvedDesktopPatternMode,
      fontFamily: resolvedFontFamily,
      fontSize: resolvedFontSize,
      themeName,
      resolvedTheme,
      setDesktopPatternMode: handleDesktopPatternModeChange,
      setFontFamily: handleFontFamilyChange,
      setFontSize: handleFontSizeChange,
      setTheme: handleThemeChange,
      themes: nuThemes
    }),
    [
      resolvedDesktopPatternMode,
      resolvedFontFamily,
      resolvedFontSize,
      themeName,
      resolvedTheme,
      handleDesktopPatternModeChange,
      handleFontFamilyChange,
      handleFontSizeChange,
      handleThemeChange
    ]
  );

  return (
    <NuThemeContext.Provider value={contextValue}>
      <div
        className={["nu-theme-root", className].filter(Boolean).join(" ")}
        data-nu-theme={themeName}
        data-nu-theme-scope={generatedId}
        style={
          {
            ...getNuDesktopPatternStyle(resolvedDesktopPatternMode),
            ...getNuThemeStyle(resolvedTheme),
            "--nu-font-body": resolvedFontFamily,
            fontFamily: resolvedFontFamily,
            fontSize: `${resolvedFontSize}px`
          } as CSSProperties
        }
      >
        {crtGlitch ? (
          <NuCrtGlitch {...(typeof crtGlitch === "object" ? crtGlitch : {})} />
        ) : null}
        {children}
      </div>
    </NuThemeContext.Provider>
  );
}

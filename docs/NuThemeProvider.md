# NuThemeProvider

`NuThemeProvider` applies design tokens for the active visual theme.

## Usage

```tsx
<NuThemeProvider>
  <NuDesktop appBar={<AppBar />}>
    <App />
  </NuDesktop>
</NuThemeProvider>
```

Typography can also be configured at the provider level:

```tsx
<NuThemeProvider
  defaultFontFamily={'"Comic Sans MS", "Comic Sans", cursive'}
  defaultFontSize={16}
>
  <App />
</NuThemeProvider>
```

## Related API

- `useNuTheme()`
- `nuThemes`
- `resolveNuTheme(...)`
- `isNuThemeName(...)`

## Provider Typography

`NuThemeProvider` now owns both theme tokens and base typography for the full UI tree.

Supported props:

- `desktopPatternMode?: "dot-grid" | "dense-dots" | "coarse-dots" | "grid" | "solid"`
- `defaultDesktopPatternMode?: ...`
- `onDesktopPatternModeChange?: (mode) => void`
- `fontFamily?: string`
- `defaultFontFamily?: string`
- `onFontFamilyChange?: (fontFamily) => void`
- `fontSize?: number`
- `defaultFontSize?: number`
- `onFontSizeChange?: (fontSize) => void`
- `crtGlitch?: boolean | NuCrtGlitchProps`
  enables the ambient CRT-glitch effect (see [CrtGlitch](./CrtGlitch.md)). `true` uses its defaults; pass an options object to tune them. Defaults to `false` — opt-in.
- `style?: CSSProperties`
  applies scoped CSS custom-property overrides after the resolved theme tokens. Popup portals mirror the computed values from the theme root.

`useNuTheme()` exposes:

- `desktopPatternMode`
- `fontFamily`
- `fontSize`
- `setDesktopPatternMode(...)`
- `setFontFamily(...)`
- `setFontSize(...)`

## Notes

- Built-in themes are `classic` (default), `amber`, `phosphor`, `midnight`, and
  `grayscale`.
- All built-in themes default to `Consolas` at 15px. Explicit typography props
  and custom-theme typography still take precedence.
- Built-in themes may also define default desktop patterns and visual CSS-token
  overrides. Custom-theme typography and explicit provider props still take
  precedence.
- `midnight` is a dark slate-blue palette with blue chrome, a burnt-orange
  focus accent, coarse dots, and dedicated window, toolbar, menu, and icon-grid
  chrome tokens.
- `grayscale` is a high-contrast monochrome monitor palette. Semantic button variants use brightness rather than hue.
- Theme tokens drive desktop, windowing, controls (including Memo surfaces),
  selection, and inactive overlays.
- Provider typography affects preview content, managed windows, dialogs, menus, and popup portals rendered inside the theme scope.

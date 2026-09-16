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

`useNuTheme()` exposes:

- `desktopPatternMode`
- `fontFamily`
- `fontSize`
- `setDesktopPatternMode(...)`
- `setFontFamily(...)`
- `setFontSize(...)`

## Notes

- Built-in themes are `classic` (default), `amber`, `phosphor`, and `midnight`.
- `midnight` is a restrained dark blue-gray palette with pale chrome and yellow focus accents.
- Theme tokens drive desktop, windowing, controls, selection, and inactive overlays.
- Provider typography affects preview content, managed windows, dialogs, menus, and popup portals rendered inside the theme scope.

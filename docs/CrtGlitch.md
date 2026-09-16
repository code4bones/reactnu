# CrtGlitch

`NuCrtGlitch` is an opt-in ambient effect. It periodically applies a brief RGB-split/warp distortion to a single, randomly chosen control on the page — meant to be caught in peripheral vision, not watched directly.

## Usage

Recommended — enable through the theme provider:

```tsx
<NuThemeProvider crtGlitch>
  <NuDesktop appBar={<AppBar />}>
    <App />
  </NuDesktop>
</NuThemeProvider>
```

With options:

```tsx
<NuThemeProvider crtGlitch={{ intervalMs: 5000, topLevelRatio: 0.5 }}>
  <App />
</NuThemeProvider>
```

Standalone, if not using `NuThemeProvider`'s `crtGlitch` prop:

```tsx
<NuCrtGlitch />
```

## Key Props

- `enabled?: boolean`
  default `true`. When `false`, the filter definitions stay mounted but inert — no pulses fire.
- `intervalMs?: number`
  default `3000`. Average gap between pulses. The actual gap is jittered (0.6x-1.6x of this value) so pulses never fall into a detectable fixed cadence.
- `durationMs?: number`
  default `2500`. Average length of a single pulse. Also jittered per pulse (0.7x-1.4x).
- `targetSelector?: string`
  CSS selector for the pool of small leaf-control candidates (buttons, checkboxes, glyphs, rows...). Defaults to controls scoped under an open, non-minimized `.nu-window`.
- `topLevelRatio?: number`
  default `1/3`. Fraction of pulses that target a whole open window instead of a small leaf control. Falls back to whichever pool actually has candidates if the rolled pool is empty (e.g. no windows open yet).

## Notes

- Opt-in and silent between pulses — the component only renders a hidden SVG `<filter>` definition, nothing visible on its own.
- No two pulses share the same noise seed, offsets, duration, or gap, so nothing about the effect repeats often enough to read as decorative.
- Designed to feel like a real, subtle fault rather than a demo effect: small controls glitch far more often than whole windows (see `topLevelRatio`), and offsets/intensity are re-rolled every pulse.
- Mount once, anywhere under `NuThemeProvider` (or once via the `crtGlitch` prop). A second instance is wasteful, not harmful.

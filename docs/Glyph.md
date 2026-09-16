# Glyph

`NuGlyph` is the reusable icon primitive for small UI symbols.

## Usage

```tsx
<NuGlyph name="window-close" />
<NuGlyph name="dropdown-arrow" />
```

## Key Props

- `name: NuGlyphName`
- standard `span` props such as `className`

## Current Glyph Set

- `check-fill`
- `dropdown-arrow`
- `window-close`
- `window-maximize`
- `window-minimize`
- `window-resize`
- `window-restore`

## Notes

- New control-specific symbols should be added here instead of being redrawn ad hoc in component styles.

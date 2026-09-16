# Token Checklist

Practical checklist for keeping new components visually consistent with the rest of the library.

## Source Of Truth

- Runtime theme tokens: [`packages/ui/src/theme/themes.ts`](../packages/ui/src/theme/themes.ts)
- CSS variable defaults: [`packages/ui/src/variables.less`](../packages/ui/src/variables.less)

If a component needs a new reusable visual value, add it there first instead of hardcoding it locally.

## Core Color Tokens

- Desktop and shell:
  - `--nu-desktop-bg`
  - `--nu-desktop-pattern`
  - `--nu-color-shell`
  - `--nu-color-app-bg`
  - `--nu-color-app-bg-alt`
- Chrome and panels:
  - `--nu-color-chrome`
  - `--nu-color-panel`
  - `--nu-color-panel-inset`
  - `--nu-color-title-bg`
  - `--nu-color-title-text`
- Text:
  - `--nu-text-primary`
  - `--nu-text-muted`
  - `--nu-text-inverse`
  - `--nu-text-accent`
  - `--nu-text-hotkey`
- Controls:
  - `--nu-color-button-face`
  - `--nu-color-button-face-alt`
  - `--nu-color-button-danger`
  - `--nu-color-button-text`
  - `--nu-color-field-bg`
  - `--nu-color-field-text`
- Borders, focus, shadow:
  - `--nu-border-light`
  - `--nu-border-dark`
  - `--nu-border-accent`
  - `--nu-shadow-color`
  - `--nu-focus-color`
- Window overlays:
  - `--nu-window-inactive-overlay`
  - `--nu-window-modal-backdrop`

## Layout And Geometry Tokens

- Spacing:
  - `--nu-space-xs`
  - `--nu-space-sm`
  - `--nu-space-md`
  - `--nu-space-lg`
  - `--nu-space-xl`
- Typography:
  - `--nu-font-body`
- Shared geometry:
  - `--nu-glyph-cell-size`
  - `--nu-control-height`
  - `--nu-frame-thickness`
  - `--nu-rule-thickness`
- Button mechanics:
  - `--nu-button-shadow-x`
  - `--nu-button-shadow-y`
  - `--nu-button-shadow-offset-x`
  - `--nu-button-shadow-offset-y`
  - `--nu-button-press-depth-x`
  - `--nu-button-press-depth-y`
- Window shadow:
  - `--nu-window-shadow-bg`
  - `--nu-window-shadow-offset-x`
  - `--nu-window-shadow-offset-y`
- Scrollbar:
  - `--nu-scrollbar-track`
  - `--nu-scrollbar-thumb`
  - `--nu-scrollbar-button-bg`
  - `--nu-scrollbar-button-size`

## Checklist For A New Component

- Surface:
  - Is the background coming from an existing panel, chrome, button, or field token?
- Text:
  - Is default text using one of `primary`, `inverse`, `muted`, `accent`, `hotkey`?
- Focus and selection:
  - Is active/focused state using the same black/yellow system as existing controls?
- Borders:
  - Are border colors coming from `light`, `dark`, or `accent` tokens?
- Spacing:
  - Are paddings and gaps based on `--nu-space-*`?
- Height:
  - If it is a control row, is it aligned to `--nu-control-height`?
- Glyphs:
  - If it shows an icon/checkmark/caret, is it using `NuGlyph` and the shared glyph cell?
- Shadows:
  - If it is raised, is it reusing button/window shadow logic instead of inventing a new one?
- Theme coverage:
  - Would the component still read correctly in `classic`, `amber`, and `phosphor`?
- Hardcoded values:
  - Are any colors or dimensions local only because they are truly component-specific?

## When To Add A New Token

Add a token when:

- the value is already repeated in more than one component
- the value expresses a visual role, not just a one-off tweak
- the value should vary by theme

Do not add a token when:

- the value is internal to one component only
- the value is purely structural and unlikely to be reused
- the value is still experimental and not yet stable

## Current Gaps To Watch

- Some component-specific structural values still live locally in `*.less`.
- Scrollbar tokens are partially shared, but geometry is still tied to current implementation details.
- Mnemonic/hotkey color is standardized, but keyboard behavior itself is not tokenized and should stay behavioral, not visual.

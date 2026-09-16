# ROADMAP

This file is the working map for ReactNU development.

It is not a strict milestone promise.
It is the current best view of:

- what is already strong
- what still needs finishing
- what architectural rules should not be broken while extending the library

## Current Stable Direction

The library already has a strong base in these areas:

- theme/provider ownership
- desktop shell composition
- managed windows and dialogs
- storybook coverage
- sandbox integration coverage
- DOS/Norton-style visual language
- shared slot customization contract
- popup/body-portal geometry model
- shared internal opener primitive

## Principles That Should Stay Stable

These are not backlog items. These are architectural decisions to preserve.

### 1. Theme Owns Typography And Desktop Pattern

Do not move font family, font size, or desktop pattern back into demo-only DOM overrides.

### 2. Popup Geometry Should Stay Single-System

Body portal plus viewport measurement is the current stable model.

Do not casually reintroduce mixed local-root coordinate systems.

### 3. Shared Chrome Should Not Fork

If `Dropdown`, `ComboBox`, `ToolBar`, `PageControl`, or other controls share the same visual primitive, prefer one shared internal layer.

### 4. Storybook And Sandbox Have Different Jobs

- Storybook = isolated review
- Sandbox = workflow integration

Do not force one to behave like the other.

## High-Priority Next Work

### PropertyGrid Finalization

Current state:

- expandable groups
- nested properties
- active row
- keyboard navigation baseline
- editor activation from key click

Still wanted:

- richer active-row semantics
- smoother focus transfer between row and editor
- optional grouped editing flows
- deeper inspector polish for multi-level trees

### Slot Customization Rollout

Current state:

- first large wave is done
- several surface/form controls already support slot overrides

Still wanted:

- finish slot rollout for remaining controls touched in ongoing work
- document slot names consistently per component
- avoid new ad-hoc surface props in future additions

### Storybook Completion

Current state:

- strong baseline coverage exists
- desktop/window/dialog examples are present

Still wanted:

- even more complete per-control stories
- tighter visual composition pass for remaining categories
- cleanup of the remaining docgen warning for `.storybook/preview.tsx`

### Popup And Overlay Consistency

Current state:

- `Dropdown`
- `ComboBox`
- `SearchBox`
- `PopupMenu`

already share the same body-portal geometry rule.

Still wanted:

- verify every popup-like control against the same behavior rules
- keep category rows, hover states, widths, and focus paths visually consistent

## Medium-Priority Work

### ComboBox / SearchBox Depth

Current state:

- `ComboBox` is a local editable select
- `SearchBox` is an async lookup control

Still wanted:

- richer keyboard navigation
- caret/selection edge-case handling
- more mature result-list focus choreography

### Property Editor Suite Around PropertyGrid

Potential follow-up:

- more structured property editor recipes
- reusable inspector row helpers
- better composed examples for nested data editors

### Dialog Surface Refinement

Current state:

- helper dialogs exist
- standard buttons and presets exist

Still wanted:

- broader documented recipes for custom dialogs
- clearer distinction between helper dialogs and hand-built managed dialogs

## Longer-Term Work

### More Complete Desktop Utility Suite

Potential future targets:

- richer log/terminal-style surfaces
- more inspector-style editors
- more workflow-specific shell compositions

### Contributor Experience

Potential future additions:

- dedicated internal patterns guide per subsystem
- more implementation recipes
- more examples of host composition patterns

## Component Status Notes

### Strong Baseline

These are in good shape as reusable controls:

- `Button`
- `Frame`
- `Panel`
- `Dropdown`
- `ComboBox`
- `SearchBox`
- `MainMenu`
- `PopupMenu`
- `Window`
- `NuWindowProvider`
- `PageControl`
- `ToolBar`
- `TickBar`
- `PropertyGrid` baseline

### Good But Not Final

- `PropertyGrid`
- `ComboBox`
- `SearchBox`
- `MaskedField`
- Storybook coverage breadth

### Intentionally Thin

These are intentionally lightweight and should only be expanded when a real second use case appears:

- shared primitives in `_shared`
- some story helpers
- some helper dialog content wrappers

## Rules For Agents And Contributors

When choosing the next implementation step:

1. prefer the smallest coherent change
2. preserve the current geometry contract
3. prefer internal primitives over duplicated chrome
4. update Storybook when user-visible behavior changes
5. update docs when a rule becomes architectural

## What Not To Do

- do not solve Storybook-only host problems by breaking sandbox geometry
- do not solve sandbox-only host problems by breaking Storybook geometry
- do not reintroduce duplicated opener/popup chrome in separate controls
- do not add new style APIs when slot customization already covers the need
- do not push desktop semantics into controls that should remain host-agnostic

## Practical Reading Order For Future Work

If you continue the library later, read:

1. [docs/CONTRIBUTOR_GUIDE.md](./docs/CONTRIBUTOR_GUIDE.md)
2. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. [docs/SLOT_CUSTOMIZATION.md](./docs/SLOT_CUSTOMIZATION.md)
4. [docs/STORYBOOK.md](./docs/STORYBOOK.md)
5. [AGENTS.md](./AGENTS.md)

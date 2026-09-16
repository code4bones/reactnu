# Storybook

ReactNU now ships with a dedicated Storybook layer for component coverage, visual regression review, and API exploration.

## Scripts

- `npm run storybook`
  starts Storybook in dev mode
- `npm run build-storybook`
  produces a static build in `storybook-static/`

## Global Toolbars

The Storybook preview exposes provider-level globals for:

- theme
- font family
- font size
- desktop pattern mode

These are wired through `NuThemeProvider`, so stories can be checked under the same typography and desktop-surface conditions as the sandbox.

## Host Composition Rules

Storybook uses more than one kind of host on purpose.

Use a bounded surface with direct components when you only need:

- isolated control review
- static window chrome
- local layout examples

Use `NuWindowProvider` in a bounded container when you need:

- managed windows
- helper dialogs
- modal layering
- `useNuWindowManager()` flows

Use full `NuDesktop` only when the story is explicitly about:

- desktop shell composition
- menu/app-bar integration
- fixed desktop semantics

This distinction matters because `NuDesktop` is intentionally fullscreen/fixed by nature, while many Storybook stories need a bounded preview host.

## Coverage Goals

The current Storybook covers the main package surfaces:

- theming and slot customization
- buttons and event feedback
- input controls
- selectors and async lookup
- toolbar and page control navigation
- list and tree controls
- property inspector layout
- surface/layout primitives
- direct desktop and window chrome

## Why Storybook Exists Alongside Sandbox

The sandbox remains the free-form integration lab.

Storybook serves a different role:

- isolated component review
- prop and event exploration
- theme/font regression checks
- docs-friendly usage examples
- easier review of slot-level customization

## Current Scope

Storybook is intended to show:

- how a control behaves on its own
- how it behaves under different theme and typography settings
- how slot overrides affect internal surfaces

The sandbox still remains the better place for:

- long-lived desktop workflows
- managed window orchestration
- complex multi-control interaction sequences

## Popup Story Guidance

Popup-like controls in Storybook should follow the same contract as the library runtime:

- popup rendered into `document.body`
- popup themed from the nearest `.nu-theme-root`
- geometry measured from the visible anchor

If a popup appears correct in sandbox but drifts in Storybook, treat that first as a host-composition issue rather than immediately changing the control API.

# Contributor Guide

This guide is for developers and coding agents who need to extend ReactNU or integrate it into a host application without reverse-engineering the source tree first.

It is intentionally practical.

## What ReactNU Is

ReactNU is a React + TypeScript component library with a Norton Utilities / DOS-era visual language.

The target qualities are:

- crisp geometry
- dense information layout
- keyboard-first interaction
- strong visual hierarchy
- predictable controlled/uncontrolled behavior
- reusable host shell composition

ReactNU is not a novelty retro skin. It is a reusable UI system that happens to use a DOS-style visual grammar.

## Recommended Mental Model

Think in layers:

1. Theme and desktop tokens
2. Low-level controls
3. Composed surfaces
4. Window and dialog orchestration
5. Host application composition

That means:

- a control should not guess desktop ownership
- a dialog should not guess app-shell structure
- popup geometry should not guess multiple coordinate systems
- the host should explicitly own workflow composition

## First Files To Read

If you are new to the repo, read in this order:

1. [Getting Started](./GETTING_STARTED.md)
2. [Architecture](./ARCHITECTURE.md)
3. [API Reference](./API_REFERENCE.md)
4. [Slot Customization](./SLOT_CUSTOMIZATION.md)
5. [Storybook](./STORYBOOK.md)

If you are working on windowing or popup behavior, also read:

6. [NuWindowProvider](./NuWindowProvider.md)
7. [Dialog Helpers](./DialogHelpers.md)
8. [Desktop](./Desktop.md)

## Host Composition Patterns

### Full Desktop Shell

Use this when you want:

- main menu
- workspace area
- app bar
- managed windows
- desktop-level modal behavior

Recommended ownership:

`NuThemeProvider -> NuDesktop -> workspace content -> managed windows`

Typical example:

```tsx
<NuThemeProvider>
  <NuDesktop appBar={<ShellAppBar />}>
    <Dashboard items={...} />
  </NuDesktop>
</NuThemeProvider>
```

### Bounded Window Host

Use this when you need:

- managed dialogs or windows
- modal layering
- `useNuWindowManager()`
- but not the full desktop shell

This is especially useful for:

- Storybook stories
- focused demo surfaces
- embedded host panels

Typical example:

```tsx
<div style={{ position: "relative", height: "40rem", overflow: "hidden" }}>
  <NuWindowProvider renderAppBar={false}>
    <DialogLauncherSurface />
  </NuWindowProvider>
</div>
```

### Do Not Mix These Accidentally

Common mistake:

- using `NuDesktop` when a bounded `NuWindowProvider` is enough

Symptoms:

- content appears to escape the preview region
- dialogs reposition the whole preview unexpectedly
- fullscreen/fixed desktop semantics leak into Storybook

## Theme Ownership

Theme state belongs to `NuThemeProvider`.

Current provider-level host settings include:

- theme
- font family
- font size
- desktop pattern mode

Prefer changing typography and desktop surface through the provider, not through ad-hoc DOM overrides.

## Popup And Menu Contract

Popup-like controls currently follow this contract:

- popup renders into `document.body`
- popup position is measured from `getBoundingClientRect()`
- popup receives theme vars from the nearest `.nu-theme-root`

Why:

- viewport coordinates stay stable
- Storybook and sandbox use the same geometry model
- popup visuals still inherit theme and typography

If a popup appears correct in sandbox but not in Storybook, first suspect host composition or portal assumptions, not the control API.

## Shared Internal Primitive Rule

When two controls share the same visual part, do not duplicate the implementation casually.

Preferred order:

1. shared LESS primitive if only chrome/geometry is shared
2. shared internal JSX primitive if markup/behavior is mostly shared
3. public component only if the thing has independent public meaning

Current example:

- `ControlOpener`
  internal primitive shared by `Dropdown` and `ComboBox`

This keeps:

- glyph metrics
- opener width
- border
- background
- browser button reset behavior

in one place.

## Slot Customization Contract

Preferred internal customization API:

- `slotStyles`
- `slotClassNames`

Use:

- `className` / `style` for root
- `slot*` props for meaningful internal surfaces

Examples of good slot names:

- `root`
- `label`
- `title`
- `body`
- `popup`
- `listbox`
- `input`
- `field`
- `hint`

Avoid inventing new one-off props for every surface if a control already supports slot customization.

## Controlled / Uncontrolled Guidance

Use normal React contracts unless there is a strong reason not to.

Prefer:

- `value`
- `defaultValue`
- `onValueChange`

or for stateful booleans:

- `open`
- `defaultOpen`
- `onOpenChange`

For text-like controls:

- do not blur or steal focus during normal typing paths
- especially for editable popup controls like `ComboBox` and `SearchBox`

## Keyboard And Focus Rules

ReactNU is intentionally keyboard-forward.

Baseline expectations for interactive controls:

- visible focus
- sane tab order
- escape paths for overlays
- predictable arrow-key semantics where relevant

If a control opens a popup while still being text-editable:

- typing must stay on the input
- popup focus transfer should happen only on explicit navigation behavior

## Window And Dialog Guidance

Use `openWindow(...)` for document/tool windows.

Use `openDialog(...)` for managed dialogs that still use the normal window manager.

Use helper dialogs when you want standard system prompts:

- `showMessageBox(...)`
- `showInputBox(...)`

Helper dialogs already own:

- centered footer buttons
- standard sizing
- title defaults
- error/info tone behavior

If you build a custom dialog manually through `openDialog(...)`, you own its internal layout. That includes button centering.

## Storybook Rules

Storybook is not the sandbox.

Use Storybook for:

- isolated control review
- prop and slot examples
- theme/font variation
- narrow interaction checks

Use sandbox for:

- free-form desktop workflows
- multiple windows over time
- broader integration exercises

### Storybook Window Stories

Use:

- direct `Window` stories for static shell inspection
- bounded `NuWindowProvider` stories for managed dialogs/windows
- full `NuDesktop` only for shell-level stories

### Storybook Layout Density

Avoid giant empty canvases for small controls.

Preferred:

- wrap demos in titled panels
- keep compact controls content-sized
- use bounded desktop surfaces for desktop-like stories

## Sandbox Rules

Sandbox is allowed to be richer and more workflow-driven than Storybook.

But avoid turning sandbox code into hidden library architecture.

Good sandbox usage:

- realistic host composition
- test launchers
- theme switching
- live windowing flows

Bad sandbox usage:

- solving library bugs only in sandbox CSS
- encoding internal library assumptions in demo-only hacks

## Common Pitfalls

### 1. Mixing Portal Roots And Viewport Coordinates

If popup position is measured from `getBoundingClientRect()`, do not render the popup into an arbitrary local root unless the whole component is built around local coordinates.

### 2. Browser Button Defaults

If a shared primitive can render as a real `button`, neutralize browser defaults explicitly:

- `font: inherit`
- `line-height: 1`
- `appearance: none`

Otherwise glyphs and geometry drift even when the SVG is the same.

### 3. Hidden Stretch From Flex/Grid Parents

If shadows or chrome look detached, check whether the parent is stretching the child unexpectedly.

### 4. Storybook Isolates Bugs Differently

If behavior differs between sandbox and Storybook:

- inspect the host first
- inspect portal root and positioning rules second
- only then change the component internals

## Checklist For A New Control

Before adding a new control:

1. Decide whether it is a real public component or only an internal primitive.
2. Check whether an existing control or shared layer already solves most of it.
3. Define the public API in controlled/uncontrolled terms.
4. Define keyboard behavior.
5. Define focus behavior.
6. Define slot surfaces.
7. Add Storybook coverage.
8. Add sandbox coverage if the control is workflow-heavy.
9. Run the narrowest meaningful checks.

## Checklist For Updating An Existing Control

1. Read the current docs page.
2. Read the component implementation.
3. Check whether Storybook and sandbox both cover the control.
4. Prefer a small change.
5. If two controls share the same fix, look for a shared primitive/helper.
6. Update docs if the rule becomes architectural.

## Checklist For Popup Controls

1. Confirm anchor measurement surface.
2. Confirm portal root.
3. Confirm theme inheritance in the popup.
4. Confirm width contract:
   - whole control
   - field only
   - custom width
5. Confirm focus path:
   - editable input stays editable
   - menu/list can still be navigated intentionally

## Checklist For Window/Dialog Stories

1. Decide whether the story needs full `NuDesktop`.
2. If not, prefer bounded `NuWindowProvider`.
3. Keep the preview area explicitly sized.
4. Avoid desktop-only CSS classes on standalone window hosts.
5. Test helper dialogs and custom dialogs separately.

## Current Internal Conventions Worth Preserving

- body portals for popup-like controls
- provider-owned typography and desktop pattern
- slot-based internal customization
- shared internal primitives for repeated chrome
- bounded Storybook hosts for dialog/window examples
- explicit scroll ownership

## If You Are Unsure

Choose the smallest rule-preserving change.

If a fix only works in sandbox or only works in Storybook, it is probably not finished.

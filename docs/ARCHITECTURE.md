# Architecture

ReactNU is organized around a desktop shell and explicit ownership boundaries.

## Main Layers

1. Theme tokens
2. Low-level controls
3. Desktop shell and window manager
4. Host application composition

## Desktop Ownership

Recommended ownership:

`NuThemeProvider -> NuDesktop -> workspace + app bar -> managed windows`

That means:

- `NuDesktop` owns screen geometry.
- `NuDesktop` composes `NuAppHostProvider` and `NuWindowProvider` for the full desktop shell.
- `NuWindowProvider` owns managed windows.
- the host owns main menu content and app bar composition.
- controls do not know about desktop layout unless they are part of windowing.

## Window Ownership

Managed windows are opened through `useNuWindowManager()`:

- `openWindow(definition)`
- `openDialog(definition)`
- `updateWindow(id, patch)`
- `closeWindow(id)`

The host provides:

- title
- content
- optional persistence callbacks
- domain metadata

The manager provides:

- activation
- z-order
- modal behavior
- app-bar visibility state

## Popup Ownership

Popup-like controls such as:

- `Dropdown`
- `ComboBox`
- `SearchBox`
- `PopupMenu`

use a shared ownership split:

- the control owns anchor measurement
- the popup layer renders into `document.body`
- theme variables are mirrored from the nearest `.nu-theme-root`

This avoids mixing local portal roots with viewport-based coordinates.

If a popup needs the same chrome as another control, prefer a shared internal primitive or shared helper over per-control duplication.

## Scroll Ownership

ReactNU does not assume that every container should scroll automatically.

Recommended ownership:

- `Splitter cell -> NuView -> content`
- `Window body -> scrollable control`
- `Frame -> one filling child`

This keeps scroll behavior explicit and avoids hidden nested viewport bugs.

## Slot Customization

ReactNU is standardizing internal customization around named slots.

Preferred API:

- `slotStyles`
- `slotClassNames`

Use this for component internals instead of inventing ad-hoc props like:

- `headerStyle`
- `inputShellClassName`
- `popupBackground`

See: [Slot Customization](./SLOT_CUSTOMIZATION.md)

## Shared Internal Primitives

Not every repeated visual element should become a public component.

Preferred rule:

- shared public behavior -> public component
- shared internal geometry/chrome -> internal primitive

Example:

- `Dropdown` and `ComboBox` use the internal `ControlOpener` primitive so opener size, glyph metrics, border, and button chrome stay centralized.

## Tree Ownership

`TreeView` and `TreeListView` own:

- hierarchy geometry
- connector rendering
- expand/collapse behavior
- keyboard navigation

The host owns:

- data
- selection/check state when controlled
- report-column rendering for `TreeListView`

## Window Persistence

Managed windows can persist geometry with:

- `onOpen?: () => NuManagedWindowSnapshot | void`
- `onClose?: (snapshot) => boolean | void`

Use this when the host wants to restore:

- last position
- last size
- maximized state
- minimized state

## Recommended Host Split

Keep host code separated by responsibility:

- desktop shell
- menu state
- app bar composition
- window launchers
- individual window content components

That keeps the component library reusable and avoids demo-only patterns leaking into product code.

## Storybook Host Strategy

Storybook should distinguish between:

- full desktop-shell stories
- bounded window-manager stories

Use a full `NuDesktop` story when validating:

- desktop background
- menu/app-bar composition
- shell-level layering

Use a bounded `NuWindowProvider` story when validating:

- helper dialogs
- modal behavior
- managed window chrome inside a fixed preview area

This avoids accidental fullscreen/fixed-position behavior inside Storybook preview containers.

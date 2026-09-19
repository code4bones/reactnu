# Changelog

All notable changes to `@deadragdoll/reactnu` should be documented in this file.

This project follows a simple changelog policy:

- keep entries user-facing
- group changes by release
- prefer `Added`, `Changed`, `Fixed`, `Removed`
- do not dump raw commit history

## [Unreleased]

### Fixed

- `windowStoreKey` persistence no longer writes to `localStorage` on every
  drag/resize bounds update (it was firing synchronously on effectively
  every pointermove, visibly janking the drag/resize gesture itself).
  Writes are now debounced per window (250ms after motion settles) and
  flushed immediately on close or provider unmount so the final position is
  never lost.

## [0.1.77]

### Added

- Added `windowStoreKey` to managed windows for automatic local persistence of
  their position, size, and minimized/maximized state.

## [0.1.75]

### Added

- Added shared drag-and-drop support to `ListView`, including source, target,
  and compact preview props.
- Added compact React drag previews and reactive target hover state
  (`isOver` / `canDrop`) to the shared DnD contract.

### Changed

- Migrated shared DnD internals to `react-dnd`. `NuIconGrid` external drops
  now support non-destructive copy behavior through `{ action: "copy" }` or
  an `onDragOut` callback that returns `false`.

## [0.1.74]

### Added

- Added `columnStoreKey` to `TreeListView` for persistence of user-resized
  widths under `reactnu.<key>` in localStorage.

## [0.1.73]

### Added

- Added a success-variant button to the sandbox Target Controls panel.

## [0.1.72]

### Changed

- Replaced split vertical Toolbar inset tokens with one four-sided
  `--nu-toolbar-inset` and clipped overflowing toolbar content to its frame.

## [0.1.71]

### Added

- Added independently themeable top and bottom Toolbar insets and static
  `startContent`/`endContent` ReactNode slots.

## [0.1.70]

### Added

- Added theme tokens for Toolbar background, border, and separators, plus
  independent MainMenu/PopupMenu divider tokens; all are editable in the
  sandbox Theme Designer.

## [0.1.69]

### Fixed

- Made MainMenu popup width grow to its longest label instead of truncating it;
  shortcut and submenu-opener columns remain aligned.

## [0.1.68]

### Added

- Added `lucide-react` to the sandbox and varied menu-icon examples.

### Fixed

- Collapsed the MainMenu leading slot when an item has no check marker or icon,
  moving its label closer to the left padding.

## [0.1.67]

### Added

- Added four-level Profile and Help submenu chains to the sandbox desktop menu
  for viewport-flip regression testing.

## [0.1.66]

### Fixed

- Reserved separate MainMenu label, shortcut, and submenu-opener areas; nested
  items no longer show shortcuts, and long labels truncate before the shortcut.

## [0.1.65]

### Fixed

- Prevented root MainMenu button styling from leaking into nested menu rows,
  restoring fixed shortcut and submenu-indicator columns.

## [0.1.64]

### Fixed

- Restored the legacy MainMenu row grid for items without an icon; icon columns
  now appear only when a menu item actually supplies one.

## [0.1.63]

### Fixed

- Explicitly aligned MainMenu check marks, icons, shortcuts, and submenu
  indicators in their respective row columns.

## [0.1.62]

### Fixed

- Made root and nested menus flip left only when their default right opening
  would overflow the viewport.

## [0.1.61]

### Fixed

- Kept submenu indicators pinned to the row edge and aligned root dropdowns
  after a MainMenu spacer to the viewport-facing edge.

## [0.1.60]

### Fixed

- Kept MainMenu submenu indicators in the fixed rightmost row column.

## [0.1.59]

### Changed

- Made nested MainMenu and PopupMenu levels consistently open to the left.

## [0.1.58]

### Added

- Added `Spacer` for separating flex-layout control groups and root `MainMenu`
  spacer nodes for end-aligned menu actions.

## [0.1.57]

### Fixed

- Passed managed-window icons through the sandbox's custom AppBar mapping.

## [0.1.56]

### Added

- Added a fixed icon slot for standalone and managed windows, including dialogs,
  and reused managed icons in AppBar, the MDI `Window` menu, and `Pick...`.

## [0.1.55]

### Added

- Added ratio-locked managed window resizing through `aspectRatio`, with ratio-consistent size limits and disabled maximize.

## [0.1.54]

### Added

- Added `minWidth` and `minHeight` window props that also bound pointer resizing.

## [0.1.53]

### Added

- Added managed-window `activationGroup` for shared active chrome across logically linked windows.

## [0.1.52]

### Changed

- Documented the shared drag-and-drop integration contract in the guides, API index, and package readmes.

## [0.1.51]

### Added

- Added shared `NuDragDropProvider` transfers among IconGrid, ListBox, and TreeListView, with application-owned acceptance and data updates.

## [0.1.50]

### Changed

- Reworked the built-in Midnight Slate palette with the supplied dark blue chrome, muted blue text, and burnt-orange focus treatment.

## [0.1.49]

### Fixed

- Made MainMenu and PopupMenu checkbox markers transparent with a border instead of using the button-face fill.

## [0.1.48]

### Fixed

- Let a pointer interaction with a control in an inactive window activate the window and the control in one click.

## [0.1.47]

### Fixed

- Limited IconGrid default, selected, and focus opacity tokens to their background fills.

## [0.1.46]

### Fixed

- Applied IconGrid focus-state tokens to pointer focus as well as keyboard focus.

## [0.1.45]

### Fixed

- Kept Theme Designer color pickers available for `transparent` and CSS-variable values.

## [0.1.44]

### Fixed

- Made the default IconGrid selected border contrast with its selected fill.

## [0.1.43]

### Fixed

- Kept IconGrid selected borders visible in inactive windows and added a configurable inactive selected fill.

## [0.1.42]

### Added

- Added tokenized IconGrid default, selected, and focus backgrounds, borders, border styles, and opacity controls to the Theme Designer.

### Fixed

- Suppressed active IconGrid selection chrome in inactive managed windows.

## [0.1.41]

### Fixed

- Restored pointer interaction for icons dropped onto the sandbox desktop target.

## [0.1.40]

### Added

- Added non-interactive IconGrid drop-target surfaces and incoming-icon acceptance filters.

## [0.1.39]

### Fixed

- Made IconGrid cross-window drags use a free-moving preview and restored double-click-only opening for the sandbox transfer target.

## [0.1.38]

### Added

- Added a desktop-level IconGrid provider and drop target to the sandbox transfer scenario.

## [0.1.37]

### Added

- Added an Applications-window icon-transfer target to exercise cross-provider IconGrid dragging in the sandbox.

## [0.1.36]

### Added

- Added item-level `onPopupMenu` callbacks to `ListBox` and `TreeListView`.
- Added cross-provider IconGrid transfers with target acceptance and source move-out callbacks.

## [0.1.35]

### Changed

- Separated menu backgrounds from button faces with the `menuBackground` theme token.

## [0.1.34]

### Fixed

- Applied valid Theme Designer JSON exports immediately when pasted into the import field.

## [0.1.33]

### Added

- Added the `mainMenuText` theme token and a Theme Designer JSON import flow with backward-compatible missing-token defaults.

## [0.1.32]

### Fixed

- Removed the sandbox CRT-glitch effect and made Theme Designer pages use the active panel surface.

## [0.1.31]

### Added

- Added a live Theme Designer to the sandbox, with token, geometry, desktop-pattern, CSS, and JSON export controls.
- Added scoped `NuThemeProvider` style overrides and configurable window title/status and app-bar sizing tokens.

## [0.1.30]

### Changed

- Removed the decorative frame from the window close glyph.

## [0.1.29]

### Fixed

- Preserved nearest theme tokens for coordinate-anchored context menus rendered through `PopupMenu` portals.

## [0.1.28]

### Fixed

- Increased grayscale-theme mnemonic contrast by dimming surrounding text.

## [0.1.27]

### Changed

- Darkened grayscale theme surfaces so white mnemonic highlights and focus cues remain visually dominant.

## [0.1.26]

### Changed

- Reduced grayscale-theme mnemonic highlight brightness for calmer text hierarchy.

## [0.1.25]

### Added

- Added the high-contrast monochrome `grayscale` theme.

## [0.1.24]

### Added

- Added Applications icon-grid and PageControl screenshots to the README gallery.

## [0.1.23]

### Changed

- Documented icon-grid composition, arrangement, accessibility, and layout persistence in the README and component docs.

## [0.1.22]

### Fixed

- Arranged sandbox Applications icons after their window grid is measured, keeping them visible in the bounded window.

## [0.1.21]

### Added

- Added long multi-word and unbroken icon-label examples to the sandbox Applications window.

## [0.1.20]

### Fixed

- Limited icon labels to two wrapped lines and truncated longer labels with an ellipsis.

## [0.1.19]

### Added

- Added composable icon providers and grids with keyboard support, drag-and-drop positioning, icon and grid context menus, and icon arrangement methods.

## [0.1.18]

### Changed

- Increased window title bar height by 3 px.

## [0.1.17]

### Fixed

- Re-exported `NuManagedWindowControls` from the package public API for typed managed-window content callbacks.

## [0.1.16]

### Fixed

- Dimmed inactive window borders along with their content, including both single and double frames.

## [0.1.15]

### Added

- Added the `midnight` theme: a dark blue-gray DOS palette with pale chrome and yellow focus accents.

## [0.1.14]

### Fixed

- Made the root lint command ignore generated Storybook output and lint source stories correctly.

## [0.1.13]

### Fixed

- Restored sandbox TypeScript and lint checks by repairing its recursive TreeList demo data and supported stack spacing.

## [0.1.12]

### Fixed

- Removed package-source lint violations, including unsafe ref reads during render and unnecessary synchronous state synchronization.

## [0.1.11]

### Changed

- Ignored local MCP/session files and npm tarball artifacts to keep repository status clean.

## [0.1.10]

### Added

- GitHub repository, homepage, and issue-tracker metadata to the npm package.

## [0.1.9]

### Changed

- Migrated repository scripts and contributor documentation from Yarn to npm.

### Removed

- Yarn lockfile and Yarn-specific repository configuration.

## [0.1.8]

### Changed

- Moved the screenshot gallery directly below the README introduction and made npm the only consumer installation and release command shown.

## [0.1.7]

### Changed

- Arranged the screenshot gallery as a two-column table with the full desktop view spanning the first row.

## [0.1.6]

### Added

- Public GitHub-hosted screenshot gallery to the repository README.

## [0.1.5]

### Changed

- Expanded the npm README with a complete component catalog and the library's Norton Utilities 6.0 inspiration.

## [0.1.4]

### Added

- Component and integration documentation to the published npm package.

### Changed

- Expanded the npm package README with installation, usage, and documentation guidance.

## [0.1.3]

### Changed

- Renamed the public package to `@deadragdoll/reactnu` across the workspace, sandbox, examples, and documentation.
- Prepared package metadata and public access settings for npm publication.

### Removed

- Legacy private-registry release scripts and configuration.

## [0.1.0]

### Added

- Initial public package baseline for ReactNU
- Desktop shell, windowing, menus, dialogs, panels, frames, and data-entry controls
- Sandbox application and Storybook coverage for the current component set

### Notes

- Earlier internal iteration history was not reconstructed retroactively before changelog tracking was introduced.

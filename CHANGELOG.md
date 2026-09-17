# Changelog

All notable changes to `@deadragdoll/reactnu` should be documented in this file.

This project follows a simple changelog policy:

- keep entries user-facing
- group changes by release
- prefer `Added`, `Changed`, `Fixed`, `Removed`
- do not dump raw commit history

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

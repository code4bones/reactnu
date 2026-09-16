# ReactNU

`@deadragdoll/reactnu` is a React + TypeScript component library with a visual language inspired by Norton Utilities 6.0 and serious DOS-era productivity software.

It is a nostalgic tribute to a beautiful era of precise, purposeful utility
interfaces, brought forward as a modern reusable component system.

## Screenshots

<table>
  <tr>
    <td colspan="2" align="center">
      <a href="https://github.com/code4bones/reactnu/blob/main/images/full.png">
        <img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/full.png" alt="Full ReactNU desktop" width="900" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/windows.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/windows.png" alt="Managed windows" width="440" /></a></td>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/menu_window.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/menu_window.png" alt="Menu and window" width="440" /></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/popup.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/popup.png" alt="Popup menu" width="440" /></a></td>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/toolbar.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/toolbar.png" alt="Toolbar" width="440" /></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/splitter.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/splitter.png" alt="Splitter layout" width="440" /></a></td>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/propertygrid.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/propertygrid.png" alt="Property grid" width="440" /></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/tickbar.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/tickbar.png" alt="Tick bar" width="440" /></a></td>
    <td align="center"><a href="https://github.com/code4bones/reactnu/blob/main/images/progress.png"><img src="https://raw.githubusercontent.com/code4bones/reactnu/main/images/progress.png" alt="Progress bar" width="440" /></a></td>
  </tr>
</table>

The screenshots use public GitHub URLs rather than local paths, so they render
on the repository page and in external README viewers.

This is not a novelty retro skin. The goal is a reusable desktop-style UI system that is:

- dense
- keyboard-friendly
- high-contrast
- host-composable
- visually disciplined

The library is built around the idea of a modern React desktop shell wearing a precise DOS utility grammar: panels, frames, menu bars, dialogs, toolbars, property grids, list/tree controls, and managed windows.

## Package

Published package:

```bash
@deadragdoll/reactnu
```

## What Is Included

ReactNU currently covers several layers of a desktop-style UI stack.

Providers and shell:

- `NuThemeProvider`
- `NuDesktop`
- `NuWindowProvider`
- `Dashboard`

Core controls:

- `Button`
- `CheckBox`
- `Dropdown`
- `ComboBox`
- `SearchBox`
- `TextField`
- `MaskedField`
- `Memo`
- `RadioGroup`
- `SpinBox`
- `TickBar`
- `ProgressBar`
- `Info`

Data and navigation:

- `ListBox`
- `ListView`
- `TreeView`
- `TreeListView`
- `PageControl`
- `ToolBar`
- `PropertyGrid`

Surfaces and windowing:

- `Panel`
- `Frame`
- `NuView`
- `Splitter`
- `Window`
- `MainMenu`
- `PopupMenu`
- `WindowBar`
- dialog helpers via `showMessageBox(...)` and `showInputBox(...)`

## Install

```bash
npm install @deadragdoll/reactnu react react-dom
```

## Quick Start

```tsx
import {
  AppBarHost,
  AppBarItem,
  NuDesktop,
  NuThemeProvider,
  NuView,
  WindowBar,
  useNuWindowManager
} from "@deadragdoll/reactnu";
import "@deadragdoll/reactnu/styles.css";

function ShellAppBar() {
  const windowManager = useNuWindowManager();

  return (
    <AppBarHost>
      <WindowBar
        items={windowManager.windows.map((windowEntry) => ({
          active: windowEntry.active,
          domain: windowEntry.domain,
          id: windowEntry.id,
          minimized: windowEntry.minimized,
          title: windowEntry.title
        }))}
        onActivateWindow={windowManager.activateWindow}
      />
      <AppBarItem alignment="end">12:40</AppBarItem>
    </AppBarHost>
  );
}

export function App() {
  return (
    <NuThemeProvider>
      <NuDesktop appBar={<ShellAppBar />}>
        <NuView padding="md">Workspace content</NuView>
      </NuDesktop>
    </NuThemeProvider>
  );
}
```

Open a managed window:

```tsx
import { Button, useNuWindowManager } from "@deadragdoll/reactnu";

function Launcher() {
  const windowManager = useNuWindowManager();

  return (
    <Button
      onClick={() =>
        windowManager.openWindow({
          title: "Inspector",
          content: <div>Window content</div>
        })
      }
    >
      &Open inspector
    </Button>
  );
}
```

## Architecture: Desktop First

`NuDesktop` is the top-level desktop shell. It composes the app host and
managed-window layers, so application UI normally follows this structure:

```text
NuThemeProvider -> NuDesktop -> workspace + app bar + managed windows
```

Place panels, forms, lists, trees, and views in the workspace. Use
`useNuWindowManager()` below `NuDesktop` to open managed windows and dialogs.
For a bounded embedded host without full-screen desktop semantics, use
`NuWindowProvider` directly. See [Architecture](./docs/ARCHITECTURE.md) for
ownership details.

## Design Direction

ReactNU is intentionally optimized around:

- rectangular geometry
- strong contrast
- monospaced or utility-style typography
- keyboard-first interaction
- explicit focus states
- host-owned composition

It is intentionally not built around:

- rounded consumer-app styling
- soft glassmorphism
- decorative motion
- overly abstract design-system semantics

## Repository Structure

```text
packages/ui
  main library package

apps/sandbox
  live host app used to exercise controls in real window/dialog flows

stories
  Storybook coverage for controls, themes, layouts, and windowing

docs
  public and contributor-facing documentation

```

## Development

From repo root:

```bash
yarn dev:sandbox
```

Useful scripts:

```bash
yarn build
yarn storybook
yarn build-storybook
yarn typecheck
yarn format:check
```

## npm Release Flow

Every repository change receives a version bump in `packages/ui/package.json`.
Update the matching sandbox dependency and `CHANGELOG.md`, build the package,
then publish it to the public npm registry:

```bash
npm run build --workspace @deadragdoll/reactnu
cd packages/ui
npm publish
```

The publisher must be authenticated with an npm account that has permission to
publish `@deadragdoll/reactnu`. The package declares public access in its
`publishConfig`, so no consumer or publisher `.npmrc` registry override is
needed.

Release history:

- [CHANGELOG.md](./CHANGELOG.md)

## Documentation Map

Start here:

1. [Getting Started](./docs/GETTING_STARTED.md)
2. [API Reference](./docs/API_REFERENCE.md)
3. [Architecture](./docs/ARCHITECTURE.md)
4. [Storybook](./docs/STORYBOOK.md)

For internal development and agent work:

- [Contributor Guide](./docs/CONTRIBUTOR_GUIDE.md)
- [Slot Customization](./docs/SLOT_CUSTOMIZATION.md)
- [ROADMAP](./ROADMAP.md)

Repository metadata:

- [LICENSE](./LICENSE)
- [CHANGELOG](./CHANGELOG.md)

Component index:

- [Component Index](./docs/COMPONENT_INDEX.md)

The published npm package also includes this documentation under `docs/`, with
the package README linking to the main entry points.

## Notes

- The package is designed for React 19.
- Popup-like controls use body portals and mirror theme values from the nearest theme root.
- Windowing and dialogs are host-driven. The library provides the orchestration layer, but the application still owns workflow composition.

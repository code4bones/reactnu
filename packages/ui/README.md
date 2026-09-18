# ReactNU

`@deadragdoll/reactnu` is a nostalgic React and TypeScript component library
inspired by Norton Utilities 6.0 — a tribute to a beautiful era of precise,
purposeful DOS utility software. It brings that crisp, high-contrast language
to modern, dense, keyboard-friendly desktop-style interfaces: panels, windows,
menus, dialogs, data controls, and application chrome.

## Install

```bash
npm install @deadragdoll/reactnu react react-dom
```

ReactNU requires React 19 and React DOM 19. Import the stylesheet once in your
application entry point:

```tsx
import "@deadragdoll/reactnu/styles.css";
```

## Quick Start

```tsx
import { Button, NuThemeProvider } from "@deadragdoll/reactnu";
import "@deadragdoll/reactnu/styles.css";

export function App() {
  return (
    <NuThemeProvider>
      <Button variant="primary">Run diagnostics</Button>
    </NuThemeProvider>
  );
}
```

For a full desktop shell with managed windows, start with `NuThemeProvider` and
`NuDesktop`; `NuDesktop` provides the application-host and window-manager
layers internally. The [Getting Started guide](./docs/GETTING_STARTED.md) shows
the recommended composition.

## Architecture: Desktop First

ReactNU is organized around a desktop shell, rather than a collection of
unrelated controls. `NuDesktop` is the top-level application surface: it owns
the screen geometry and composes the application-menu and managed-window
layers internally.

```text
NuThemeProvider
└─ NuDesktop
   ├─ Main menu (host-provided through the app host)
   └─ NuWindowProvider
      ├─ Workspace content: panels, views, forms, lists, trees
      ├─ App bar: host-provided status and window controls
      └─ Managed windows and dialogs
```

Place your normal application UI in `NuDesktop`'s children. Use
`useNuWindowManager()` anywhere below it to open managed `Window` and dialog
surfaces. For an embedded or bounded area that needs windows but not a full
desktop, use `NuWindowProvider` directly.

## Documentation

This package includes the complete Markdown documentation set:

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Component Index](./docs/COMPONENT_INDEX.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Theme Provider](./docs/NuThemeProvider.md)
- [Shared Drag and Drop](./docs/NuDragDropProvider.md)
- [Window Provider](./docs/NuWindowProvider.md)
- [Storybook guidance](./docs/STORYBOOK.md)

Each public component has a dedicated page in [`docs/`](./docs/).

## Components

### Providers and desktop shell

- `NuThemeProvider` — supplies themes, typography, desktop pattern, and theme context.
- `NuDragDropProvider` — coordinates application-owned transfers among icon grids, lists, and trees.
- `NuDesktop` — fullscreen desktop shell with workspace and app-bar regions.
- `NuAppHostProvider` — owns application-level main-menu state.
- `NuWindowProvider` — manages windows, dialogs, modal state, and window-manager hooks.
- `Dashboard` — static grid or lane-based workspace layout.

### Actions and input

- `Button` — primary DOS-style action button.
- `CommandButton` — compact command button with optional icon and popup menu.
- `CheckBox` — controlled or uncontrolled checkbox with mnemonic labels.
- `RadioGroup` and `RadioButton` — grouped single-choice controls.
- `TextField` — basic labelled text input with optional debounced change handling.
- `MaskedField` — text input constrained by a display/edit mask.
- `Memo` — multi-line text editor.
- `SpinBox` — numeric input with increment and decrement controls.
- `TickBar` — keyboard and pointer-accessible slider with tick marks.
- `Dropdown` — non-editable selection field with a popup list.
- `ComboBox` — editable, locally filtered selection field.
- `SearchBox` — async search and result-selection control.
- `ProgressBar` — determinate or indeterminate progress indicator.
- `Info` and `InfoAccent` — informational text and inline emphasis.

### Data, navigation, and layout

- `ListBox` — grouped or flat selectable list with optional checkboxes.
- `ListView` — report-style, column-based data list.
- `TreeView` — hierarchical tree with keyboard navigation and connector lines.
- `TreeListView` — tree hierarchy combined with report columns.
- `PropertyGrid` — hierarchical settings and inspector surface.
- `PageControl` and `Tabs` — keyboard-navigable tabbed pages.
- `ToolBar`, `ToolButton`, `ToolDropButton`, and `ToolSeparator` — compact command strip primitives.
- `Stack` — small flexbox layout helper.
- `Splitter` — resizable pane layout.
- `NuView` — scroll-owning content pane.
- `Panel` — raised primary application surface.
- `Frame` — bordered container with optional title chrome.
- `ReportCell` — aligned and toned report-column content helper.

### Menus, windows, and desktop chrome

- `MainMenu` — classic nested application menu bar.
- `PopupMenu` and `usePopupMenu` — anchored/context popup menu and its state helper.
- `Window` — draggable, resizable window or dialog chrome.
- `WindowTitleButton` and `useWindowTitleButtons` — custom title-bar actions.
- `StatusBarItem` — placement helper for window status bars.
- `AppBarHost` and `AppBarItem` — bottom desktop-bar container and item primitive.
- `WindowBar` — app-bar representation of managed windows.
- `useNuWindowManager` — opens, updates, activates, and closes managed windows and helper dialogs.
- `useAppHostMenu` and `useWindowMenu` — access desktop and window menu state.

### Visual utilities

- `NuGlyph` — consistent glyph/icon primitive for interface symbols.
- `NuCrtGlitch` — opt-in, ambient CRT-fault effect.
- `nuThemes`, `resolveNuTheme`, `isNuThemeName`, and `useNuTheme` — theme definitions and helpers.

## Design Principles

- sharp, high-contrast DOS-style geometry
- visible focus and keyboard-first interactions
- provider-owned themes and typography
- body portals with viewport positioning for popups
- host-owned desktop, menu, and window workflow composition

## Package Contents

- `dist/` — ESM, CommonJS, type declarations, and stylesheet
- `docs/` — component, architecture, and integration documentation
- `README.md` and `LICENSE`

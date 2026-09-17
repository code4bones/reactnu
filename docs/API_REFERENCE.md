# API Reference

This is the top-level map of the public ReactNU API.

For internal implementation and extension rules, also read:

- [Contributor Guide](./CONTRIBUTOR_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Storybook](./STORYBOOK.md)

## Common Customization Contract

Many controls now support internal slot overrides through:

- `slotStyles`
- `slotClassNames`

See: [Slot Customization](./SLOT_CUSTOMIZATION.md)

## Providers And Shell

- `NuThemeProvider`
  docs: [NuThemeProvider](./NuThemeProvider.md)
- `NuDesktop`
  docs: [Desktop](./Desktop.md)
- `Dashboard`
  docs: [Dashboard](./Dashboard.md)
- `NuAppHostProvider`
  docs: [NuAppHostProvider](./NuAppHostProvider.md)
- `NuWindowProvider`
  docs: [NuWindowProvider](./NuWindowProvider.md)

## Hooks

- `useNuTheme()`
  reads and changes the active theme, provider typography, and desktop pattern mode
- `useAppHostMenu()`
  manages the desktop-level main menu tree and item flags
- `useNuWindowManager()`
  opens, updates, activates, and closes managed windows
  also exposes `showMessageBox(...)` and `showInputBox(...)`
- `useNuIconManager()`
  manages icons inside a `NuIconProvider`
- `usePopupMenu()`
  anchor/open helper for `PopupMenu`
- `useWindowMenu()`
  accesses menu state from inside a managed window

## Core Controls

- `Button`
  docs: [Button](./Button.md)
- `CheckBox`
  docs: [CheckBox](./CheckBox.md)
- `Dropdown`
  docs: [Dropdown](./Dropdown.md)
- `ComboBox`
  docs: [ComboBox](./ComboBox.md)
- `CommandButton`
  docs: [CommandButton](./CommandButton.md)
- `Info`
  docs: [Info](./Info.md)
- `MaskedField`
  docs: [MaskedField](./MaskedField.md)
- `Memo`
  docs: [Memo](./Memo.md)
- `Panel`
  docs: [Panel](./Panel.md)
- `PageControl` / `Tabs`
  docs: [PageControl](./PageControl.md)
- `ProgressBar`
  docs: [ProgressBar](./ProgressBar.md)
- `RadioButton`, `RadioGroup`
  docs: [RadioGroup](./RadioGroup.md)
- `SearchBox`
  docs: [SearchBox](./SearchBox.md)
- `TextField`
  docs: [TextField](./TextField.md)
- `SpinBox`
  docs: [SpinBox](./SpinBox.md)
- `TickBar`
  docs: [TickBar](./TickBar.md)

## Data And Navigation Controls

- `ListBox`
  docs: [ListBox](./ListBox.md)
- `ListView`
  docs: [ListView](./ListView.md)
- `TreeView`
  docs: [TreeView](./TreeView.md)
- `TreeListView`
  docs: [TreeListView](./TreeListView.md)

## Layout And Surfaces

- `Frame`
  docs: [Frame](./Frame.md)
- `NuView`
  docs: [NuView](./NuView.md)
- `PropertyGrid`
  docs: [PropertyGrid](./PropertyGrid.md)
- `ReportCell`
  docs: [ReportCell](./ReportCell.md)
- `Splitter`
  docs: [Splitter](./Splitter.md)
- `Stack`
  docs: [Stack](./Stack.md)
- `ToolBar`, `ToolButton`, `ToolSeparator`
  docs: [ToolBar](./ToolBar.md)

## Menus

- `MainMenu`
  docs: [MainMenu](./MainMenu.md)
- `PopupMenu`
  docs: [PopupMenu](./PopupMenu.md)
- `NuIconProvider`, `NuIconGrid`
  docs: [Icon Grid](./IconGrid.md)

## Windowing And Desktop Chrome

- `Window`
  docs: [Window](./Window.md)
- `StatusBarItem`
  docs: [StatusBarItem](./StatusBarItem.md)
- `AppBarHost`
  docs: [AppBarHost](./AppBarHost.md)
- `AppBarItem`
  docs: [AppBarItem](./AppBarItem.md)
- `WindowBar`
  docs: [WindowBar](./WindowBar.md)
- `MessageBox` / `InputBox` helpers
  docs: [Dialog Helpers](./DialogHelpers.md)

## Visual Utilities

- `NuGlyph`
  docs: [Glyph](./Glyph.md)
- `NuCrtGlitch`
  docs: [CrtGlitch](./CrtGlitch.md)
- `nuThemes`
- `resolveNuTheme(...)`
- `isNuThemeName(...)`

## Start Here

If you are new to the library, read in this order:

1. [Getting Started](./GETTING_STARTED.md)
2. [Architecture](./ARCHITECTURE.md)
3. [NuThemeProvider](./NuThemeProvider.md)
4. [Desktop](./Desktop.md)
5. [NuWindowProvider](./NuWindowProvider.md)

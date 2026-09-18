# WindowBar

`WindowBar` renders open windows in the desktop app bar.

## Usage

```tsx
<WindowBar
  items={windowManager.windows}
  onActivateWindow={(id) => windowManager.activateWindow(id)}
/>
```

## Behavior

- Shows open windows in creation order
- Marks the active window
- Groups windows by `domain`
- Opens a picker dialog when a grouped domain is clicked
- Shows each managed window's `icon` beside its title; grouped entries use the
  active window's icon when one is available

## Notes

- Grouping is driven by `NuManagedWindowDefinition.domain`.
- Grouped pickers use the shared MDI-style window picker dialog logic.
- The MDI `Window` menu and `Pick...` dialog reuse the same managed-window icon.

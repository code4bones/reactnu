# Desktop

`NuDesktop` is the top-level desktop shell. It renders a fixed full-screen workspace with three rows:

1. top menu area
2. central workspace
3. bottom app bar area

## Usage

```tsx
<NuDesktop appBar={<SandboxAppBar />}>
  <App />
</NuDesktop>
```

## Key Props

- `children`
- `appBar?: ReactNode`
- `appBarContent?: ReactNode`
- standard `div` props

## Application icons

`NuDesktop` does not own a separate icon implementation. Compose a reusable
`NuIconProvider` and `NuIconGrid` inside the desktop workspace instead. The
same pair can also live inside a `Window`.

Use `NuIconGrid`'s `contextMenuItems` callback for a desktop background menu.
It receives `useNuIconManager()`'s methods, so an `Arrange icons` submenu can
call `arrangeIcons("columns")`, `arrangeIcons("rows")`, or
`arrangeIcons("name")`.

See [Icon Grid](./IconGrid.md) for the full API and interaction contract.

## Notes

- The desktop owns the browser viewport and is intended to behave like a bounded screen.
- `appBarContent` is kept as a compatibility alias, but `appBar` is the preferred entry point.
- Window title bars and resize handles use Pointer Events, so they work with
  touch and pen as well as a mouse. Desktop chrome and static control surfaces
  suppress text selection and native touch callouts; editable inputs and
  textareas remain selectable. Custom content can restore selection with
  `user-select: text` when needed.

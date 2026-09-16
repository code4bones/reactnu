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

## Notes

- The desktop owns the browser viewport and is intended to behave like a bounded screen.
- `appBarContent` is kept as a compatibility alias, but `appBar` is the preferred entry point.

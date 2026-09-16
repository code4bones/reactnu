# AppBarItem

`AppBarItem` is the generic item primitive for desktop bar content such as clocks, indicators, or task entries.

## Usage

```tsx
<AppBarItem alignment="end">12:30</AppBarItem>
```

## Key Props

- `alignment?: "start" | "end"`
- `active?: boolean`
- `grow?: boolean`
- `interactive?: boolean`
- standard static or button-like props depending on usage

## Notes

- `AppBarItem` can render as static chrome or as an interactive item.
- `WindowBar` is built on top of this primitive rather than embedding its own task-button styling.

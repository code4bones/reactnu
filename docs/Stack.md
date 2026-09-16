# Stack

`Stack` is a small flex layout helper.

## Usage

```tsx
<Stack gap="md">
  <TextField label="Target" />
  <Button>Run</Button>
</Stack>
```

## Key Props

- `direction?: "row" | "column"`
- `gap?: "sm" | "md" | "lg"`
- `align?: "start" | "center" | "end" | "stretch"`
- `justify?: "start" | "center" | "end" | "space-between" | "space-around"`
- standard `div` props

## Notes

- `align` maps to `align-items`.
- `justify` maps to `justify-content`.
- `Stack` is intentionally small, but these two props cover the common row/column alignment cases without dropping to inline styles.

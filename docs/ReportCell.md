# ReportCell

`ReportCell` is a lightweight helper for report-style table cells.

It is intentionally optional. Host code can return plain text or any custom
`ReactNode`, but `ReportCell` keeps alignment and tone consistent for
`ListView` and `TreeListView`-style columns.

## Usage

```tsx
<ReportCell align="end" tone="muted">
  44 KB
</ReportCell>
```

## Props

- `align?: "start" | "center" | "end"`
- `tone?: "default" | "muted" | "accent" | "danger" | "success"`

## Notes

- `ReportCell` does not own column sizing.
- It is a content helper, not a container control.
- Use it when host-provided cells should still follow the library's report
  alignment and color language.

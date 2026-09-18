# StatusBarItem

`StatusBarItem` is a placement helper for window status bars.

## Usage

```tsx
<Window
  title="Activity Log"
  statusBar={
    <>
      <StatusBarItem grow>F2 Save F3 Search</StatusBarItem>
      <StatusBarItem align="end">3 warnings</StatusBarItem>
    </>
  }
>
  <Content />
</Window>
```

## Key Props

- `grow?: boolean`
- `align?: "start" | "center" | "end"`
- `children`

## Notes

- `StatusBarItem` is layout-only.
- It does not render its own border or segmented chrome.
- The host controls the visual content inside the item.
- Insert `Spacer` between items to pin the following status controls to the end.

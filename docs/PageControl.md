# PageControl

`PageControl` is the tabbed page surface for switching between compact tool panels inside the same window.

## Usage

```tsx
<PageControl
  pages={[
    { id: "summary", label: "&Summary", content: <SummaryPanel /> },
    { id: "detail", label: "&Detail", content: <DetailPanel /> }
  ]}
/>
```

## Key Props

- `pages: PageControlPage[]`
- `activePageId?: string`
- `defaultActivePageId?: string`
- `onActivePageChange?: (page) => void`
- `fill?: boolean`

## Notes

- The component supports controlled and uncontrolled page selection.
- Keyboard navigation includes `Left/Right`, `Up/Down`, `Home`, and `End`.
- `Tabs` is exported as an alias of `PageControl`.

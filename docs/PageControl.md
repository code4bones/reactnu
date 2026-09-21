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
- `overflowButtonLabel?: ReactNode`
- `overflowButtonIcon?: NuGlyphName | ReactNode`

## Notes

- The component supports controlled and uncontrolled page selection.
- Keyboard navigation includes `Left/Right`, `Up/Down`, `Home`, and `End`.
- The active tab joins the page surface and interrupts its top border, matching
  conventional desktop tab controls.
- The page frame is transparent and its content receives a `1ch` inset. The
  host surface, such as a window body, provides the page background.
- When labels overflow, tabs that do not fit move into a dynamic `More`
  dropdown without widening their containing surface. Its trigger defaults to
  the dropdown icon alone; `overflowButtonLabel` and `overflowButtonIcon`
  customize it.
- `Tabs` is exported as an alias of `PageControl`.

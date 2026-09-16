# SearchBox

`SearchBox` is the async lookup control for remote or database-backed search.

## Usage

```tsx
<SearchBox
  dataProvider={(query) => fetchStations(query)}
  getItemId={(item) => item.id}
  getItemText={(item) => item.name}
  label="Station search"
  onItemSelect={(item) => setSelectedStation(item)}
/>
```

## Key Props

- `dataProvider: (query) => Promise<T[]>`
- `getItemId: (item, index) => string`
- `getItemText: (item) => string`
- `getItemDetails?: (item) => ReactNode`
- `getItemDisabled?: (item) => boolean`
- `label: string`
- `hint?: string`
- `query?: string`
- `defaultQuery?: string`
- `onQueryChange?: (query) => void`
- `onItemSelect?: (item) => void`
- `debounceMs?: number`
- `minQueryLength?: number`
- `loadingText?: string`
- `emptyText?: string`
- `errorText?: string`

## Notes

- `SearchBox` is intentionally separate from `ComboBox`.
- Use `ComboBox` for local editable lists.
- Use `SearchBox` when results come from an async provider such as a database or remote service.
- The input remains the focus owner; `Enter` commits the first result when available.

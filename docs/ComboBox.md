# ComboBox

`ComboBox` is the editable select control. It combines a text input with a filtered list popup.

## Usage

```tsx
<ComboBox
  data={[
    {
      category: null,
      items: [
        { id: "default", name: { text: "DEFAULT.NU" } },
        { id: "repair", name: { text: "REPAIR.NU" } }
      ]
    }
  ]}
  label="Run profile"
/>
```

## Key Props

- `data: ListBoxGroup[]`
- `label: string`
- `hint?: string`
- `value?: string`
- `defaultValue?: string`
- `inputValue?: string`
- `defaultInputValue?: string`
- `onValueChange?: (value, item, group) => void`
- `onInputValueChange?: (value) => void`
- `slotClassNames?` / `slotStyles?` for internal surface customization

## Notes

- Typing filters the popup list by item text.
- `Enter` commits the first filtered match.
- `ArrowDown` opens the popup.
- `ComboBox` is intentionally separate from `Dropdown`, which stays non-editable.
- For async or database-backed lookup, use [SearchBox](./SearchBox.md) instead of overloading `ComboBox`.

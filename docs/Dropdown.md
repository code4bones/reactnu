# Dropdown

`Dropdown` is a select-like control built from a compact DOS-style field and a popup `ListBox`.

## Usage

```tsx
<Dropdown
  label="Run profile"
  value={profileId}
  onValueChange={(nextValue) => setProfileId(nextValue)}
  data={[
    {
      category: null,
      items: [
        { id: "default", name: { text: "DEFAULT.NU" } },
        { id: "repair", name: { text: "REPAIR.NU" } }
      ]
    }
  ]}
/>
```

## Key Props

- `label: string`
- `data: ListBoxGroup[]`
- `value?: string`
- `defaultValue?: string`
- `onValueChange?: (value, item, group) => void`
- `placeholder?: string`
- `hint?: string`
- `disabled?: boolean`
- `slotClassNames?` / `slotStyles?` for internal surface customization

## Keyboard

- `ArrowUp` / `ArrowDown` change the value while closed
- `Enter` / `Space` open the list

## Notes

- The popup width is clamped to the width of the closed control.
- The popup inherits the nearest `NuThemeProvider` tokens even though it is rendered into `document.body`.
- This component is intentionally select-like; searchable combo-box behavior should live in a separate component.

# Button

`Button` is the basic action control for the library.

## Usage

```tsx
<Button variant="primary">Commit</Button>
<Button variant="secondary">Preview</Button>
<Button variant="danger">Reset</Button>
<Button variant="success">Apply</Button>
```

## Key Props

- `variant?: "primary" | "secondary" | "danger" | "success"`
- `focused?: boolean`
- `defaultFocused?: boolean`
- standard `button` props such as `disabled`, `onClick`, `type`

## Notes

- Visual focus is rendered with DOS-style side markers instead of a browser outline.
- Press state is purely visual and does not change layout around neighboring controls.

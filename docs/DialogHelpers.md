# Dialog Helpers

`useNuWindowManager()` includes two async helper dialogs built on top of the managed window layer:

- `showMessageBox(options)`
- `showInputBox(options)`

Both helpers open managed dialogs and resolve through a `Promise`.

## MessageBox

```tsx
const windowManager = useNuWindowManager();

const result = await windowManager.showMessageBox({
  title: "Diagnostics",
  message: "Continue with the maintenance pass?",
  kind: "info",
  preset: "yes-no-cancel"
});
```

Supported options:

- `title?: string`
- `message: ReactNode`
- `kind?: "normal" | "info" | "error"`
- `preset?: "ok" | "ok-cancel" | "yes-no" | "yes-no-cancel"`
- `yes?: boolean`
- `no?: boolean`
- `cancel?: boolean`
- `ok?: boolean`
- `yesLabel?: string`
- `noLabel?: string`
- `cancelLabel?: string`
- `okLabel?: string`
- `appModal?: boolean`
- `domain?: string`
- `style?: CSSProperties`

Result type:

- `"ok" | "yes" | "no" | "cancel"`

Notes:

- If no buttons are specified, `MessageBox` falls back to `OK`.
- `preset` provides the starting button set, but explicit button flags still override it.
- Button labels can be overridden without changing the result values.
- If the dialog is closed through the title bar, the helper resolves to the best dismiss result for the configured buttons.
- `Enter` invokes the default action (`OK`, or `Yes` when `OK` is absent).
  `Escape` invokes `Cancel`, or the normal dismiss result when no Cancel button
  exists.

## InputBox

```tsx
const windowManager = useNuWindowManager();

const value = await windowManager.showInputBox({
  title: "Archive Report",
  label: "Target path",
  defaultValue: "C:\\LOGS\\SURFACE.MAP",
  hint: "Type the report path and confirm."
});
```

Supported options:

- `title?: string`
- `label: string`
- `defaultValue?: string`
- `placeholder?: string`
- `hint?: string`
- `okLabel?: string`
- `cancelLabel?: string`
- `appModal?: boolean`
- `domain?: string`
- `style?: CSSProperties`

Result type:

- `string | null`

Notes:

- `null` means the dialog was cancelled or closed.
- `InputBox` uses the same managed dialog layer as all other windowed UI.
- Its text field keeps initial focus. `Enter` resolves the typed value and
  `Escape` resolves `null`.
- A multiline `textarea`, `Memo`, contenteditable region, active popup, or an
  IME composition keeps ownership of Enter instead of submitting the dialog.

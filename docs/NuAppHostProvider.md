# NuAppHostProvider

`NuAppHostProvider` owns the application-level main menu state.

## Usage

```tsx
<NuAppHostProvider>
  <NuDesktop appBar={<AppBar />}>
    <App />
  </NuDesktop>
</NuAppHostProvider>
```

## Related API

Use `useAppHostMenu()` to access:

- `mainMenu`
- `setMainMenu(...)`
- `setMenuFlags(id, flags)`
- `setMenuItem(id, patch)`
- `setSubmenuTree(id, items)`

## Notes

- `NuDesktop` expects to live inside this provider.
- The app host menu layer also receives the MDI bridge used by the `mdi.host` menu slot.

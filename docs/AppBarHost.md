# AppBarHost

`AppBarHost` is the bottom chrome container for desktop bar content.

## Usage

```tsx
<AppBarHost inline>
  <WindowBar items={windowManager.windows} onActivateWindow={handleActivate} />
  <CalendarAppBarItem />
</AppBarHost>
```

## Key Props

- `children`
- `inline?: boolean`

## Notes

- `inline` is intended for `NuDesktop` layout usage.
- The host is intentionally dumb; the application decides which app-bar items to place inside it.

# Info

`Info` is a lightweight fill-container for informational copy. It does not add window chrome or borders; it pairs with `InfoAccent` for inline highlighted fragments.

## Usage

```tsx
<Info>
  Hello, you must <InfoAccent>Accept</InfoAccent> the rules before continuing.
</Info>
```

Custom accent:

```tsx
<Info accentColor="#ffffff">
  Current profile: <InfoAccent>DEFAULT.NU</InfoAccent>
</Info>
```

Formatting flags:

```tsx
<Info>
  For bar
  <InfoAccent bold italic underline upper>
    baz
  </InfoAccent>
  HelloWorld
</Info>
```

## Key Props

- `fill?: boolean`
- `accentColor?: CSSProperties["color"]`
- standard `div` props such as `className`, `style`, `children`

`InfoAccent` props:

- `bold?: boolean`
- `italic?: boolean`
- `underline?: boolean`
- `upper?: boolean`
- standard `span` props such as `className`, `style`, `children`

## Notes

- `fill` defaults to `true`, so `Info` stretches with its parent container.
- `InfoAccent` is the intended inline emphasis API for `Info`.
- `accentColor` is inherited by nested `InfoAccent` fragments.

# Frame

`Frame` is a lightweight container with a simple border and optional title.

## Usage

```tsx
<Frame title="Commands">
  <ListBox data={groups} />
</Frame>
```

## Key Props

- `fill?: boolean`
- `title?: string`
- `titleStart?: ReactNode`
- `titleContent?: ReactNode`
- `titleEnd?: ReactNode`
- `titleProps?: { background?: string; color?: string; borderColor?: string }`
- `titleStyle?: CSSProperties`
- `contentStyle?: CSSProperties`
- `variant?: "outline" | "title-bar"`
- `titleAlign?: "start" | "center" | "end"`
- `titleBold?: boolean`
- `children`

## Notes

- `fill` defaults to `true`, so `Frame` stretches naturally inside flex/grid parents and also fills block-style hosts such as window bodies.
- `outline` keeps the title floating over the top border.
- `title-bar` renders a solid title strip across the full width.
- `titleProps` controls frame chrome around the title area: title background, title text color, and frame border color.
- `titleStyle` and `contentStyle` remain available for additional local overrides without creating a separate Frame variant.
- `title` remains a shorthand for simple text titles.
- `titleContent` lets you replace the center title payload with custom markup.
- `titleStart` and `titleEnd` let you place custom controls or indicators on the left and right of the title shell.
- if only `titleStart` or `titleEnd` is provided, `Frame` renders just that fragment without a default text title.

# Icon Grid

`NuIconProvider` owns a mutable collection of application icons. Place a
`NuIconGrid` anywhere inside it: on the desktop, in a `Window`, or in another
bounded surface.

```tsx
import {
  NuIconGrid,
  NuIconProvider,
  useNuIconManager
} from "@deadragdoll/reactnu";

function Applications() {
  return (
    <NuIconProvider
      defaultIcons={[
        {
          id: "diagnostics",
          icon: "/icons/diagnostics.svg",
          label: "&Diagnostics",
          onDoubleClick: () => openDiagnostics()
        }
      ]}
    >
      <NuIconGrid
        defaultArrangeMode="columns"
        contextMenuItems={(icons) => [
          {
            id: "arrange-icons",
            items: [
              {
                id: "arrange-by-name",
                text: "&By name",
                onSelect: () => icons.arrangeIcons("name")
              }
            ],
            text: "&Arrange icons"
          }
        ]}
      />
    </NuIconProvider>
  );
}
```

## API

`NuIconProvider`

- `defaultIcons?: NuIconDefinition[]` seeds its internal collection. IDs should
  be unique; omitted IDs are generated.
- Icon `icon` accepts a URL string for SVG, PNG, or JPEG assets, or inline
  React content such as an `<svg>`.

`NuIconGrid`

- `contextMenuItems` accepts ordinary `MainMenuNode[]` or a callback receiving
  the icon manager. Use the callback for a background menu such as Arrange
  icons.
- `defaultArrangeMode="columns" | "rows" | "name"` arranges seeded icons
  once, after the grid measures a non-zero available area. This prevents icons
  from initially landing outside a bounded `Window`.
- `dropTarget` makes a grid eligible as a non-interactive drop surface when it
  sits behind other content. Pair it with `accepts(icon)` to filter incoming
  icons before `onIconDrop` runs. This is useful for a full desktop target that
  uses `pointer-events: none` and therefore does not interfere with the
  desktop's own controls.
- Drag an icon to another `NuIconGrid`, including one in a different managed
  window, to transfer it between providers. `onIconDrop(icon, context)` runs on
  the target first and may return `false` to reject the transfer;
  `onIconMoveOut(icon, context)` runs on the source after a successful transfer.
  `context` exposes both managers, grids, and the target `position`.
- Within `NuDragDropProvider`, use `acceptsDrop(item)` and `onDrop(item,
  context)` to accept application-defined items from `ListBox` or
  `TreeListView`. `onDragOut(item)` runs when an icon is accepted by one of
  those non-icon targets. The existing `accepts(icon)` API remains specific to
  icon-to-icon transfers.

`useNuIconManager()`

- `addIcon(definition)` returns the new icon ID.
- `updateIcon(id, patch)`, `removeIcon(id)`, `moveIcon(id, position)`, and
  `selectIcon(id | null)` update the provider collection.
- `arrangeIcons("columns" | "rows" | "name")` lays out the current icons.

Each icon can have `onClick`, `onDoubleClick`, `onContextMenu`,
`onPositionChange`, its own `contextMenuItems`, and an application-defined
`payload` that is preserved during a cross-grid transfer.

## Theme tokens

The default, selected, and focus IconGrid states each expose `background`,
`border-color`, `border-style`, and `opacity` values under the
`--nu-icon-grid-icon-*` prefix. The resting background defaults to
`transparent`; those opacity values affect only the background fill. Drag,
drag-preview, and disabled opacity also have dedicated
tokens. In an inactive managed window, the selected border remains visible
while `--nu-icon-grid-icon-inactive-selected-background` supplies a calmer
fill.

## Interaction and accessibility

- Drag icons to move them inside the grid, or onto another icon grid to transfer
  them. A duplicate ID or a non-grid target leaves the source icon in place.
- A click selects an icon. Enter and Space activate its normal button action.
- Right-click opens the icon menu; `Shift+F10` and the Context Menu key open it
  from the keyboard.
- Right-click the grid background for the grid context menu, such as Arrange
  icons. An `onContextMenu` handler may call `preventDefault()` to replace it.
- Labels wrap to two lines. Longer labels receive an ellipsis; long unbroken
  words are wrapped instead of overflowing their icon cell.

## Persistence

The provider keeps icon positions for its mounted lifetime. To restore a layout
after a reload, save a position from `onPositionChange` and pass it back as the
icon's `position` in `defaultIcons` on the next mount. Call `arrangeIcons(...)`
only for an explicit user action, rather than on every render, so a saved layout
is not overwritten.

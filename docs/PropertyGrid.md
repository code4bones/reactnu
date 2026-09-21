# PropertyGrid

`PropertyGrid` is the hierarchical inspector surface for labeled settings, expandable groups, and embedded editors.

## Usage

```tsx
<PropertyGrid
  entries={[
    { id: "general", type: "section", title: "&General" },
    {
      id: "target",
      label: "&Target",
      content: <TextField label="Target" defaultValue="C:\\SYSTEM" />
    },
    {
      id: "rect",
      type: "group",
      label: "&Box",
      summary: <>Rect(0,0,10,20)</>,
      children: [
        {
          id: "top",
          label: "&Top",
          content: <SpinBox label="Top" value={0} />
        }
      ]
    }
  ]}
/>
```

## Key Props

- `entries: PropertyGridEntry[]`
- `labelWidth?: string`
- `fill?: boolean`
- `bordered?: boolean`
- `activeId?: string`
- `defaultActiveId?: string`
- `onActiveIdChange?: (activeId) => void`
- `expandedIds?: string[]`
- `defaultExpandedIds?: string[]`
- `onExpandedIdsChange?: (expandedIds) => void`

## Notes

- Use section rows to break long inspectors into logical blocks.
- Group rows provide expandable hierarchy with a summary cell on the right.
- Nested groups can be arbitrarily deep. A common pattern is a collapsed summary row like `Rect(0,0,10,20)` that expands into leaf editors such as `Top`, `Left`, `Width`, and `Height`.
- Item rows accept arbitrary React content in the value column.
- Clicking an item key activates the editor in the value column. For checkbox-like editors, the key click also toggles the value.
- Keyboard navigation now follows inspector-style semantics:
  - `Up` / `Down` move between rows
  - `Home` / `End` jump to the first or last interactive row
  - `Right` expands a group or activates the current item editor
  - `Left` collapses the current group or moves focus to the parent group
  - `Enter` / `Space` toggle a group or activate the current item editor
- Item keys use the same white-surface / inverse-text treatment as the rest of the library's menu-like key slots.
- Group keys use the inactive-button surface, so expandable branches are visually distinct from leaf properties.
- Borders are optional through `bordered`; the default presentation is borderless.
- Embedded ReactNU field controls have their internal top labels visually suppressed inside the property cell, because the grid already owns the left label column.
- `PropertyGrid` is already suitable as a practical inspector surface, but it is still not a full schema engine. The next logical expansion would be deeper in-place editing semantics and richer nested property schemas.
- With the default `fill` behavior, the grid takes its parent’s available space and scrolls its own rows when they exceed that space. Give the parent a bounded height (for example, a window body or a sized `NuView`) rather than relying on the outer page to scroll the inspector.

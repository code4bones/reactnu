# MaskedField

`MaskedField` is a bracketed single-line input with a readable mask grammar and built-in invalid feedback.

## Usage

```tsx
<MaskedField
  label="Dial prefix"
  mask="+(D)"
  defaultValue="7"
/>

<MaskedField
  label="Recovery code"
  mask="(D3-D2-D2)"
  defaultValue="1234567"
  hint="Fixed literals stay inline with the mask."
/>
```

## Key Props

- `label: string`
- `mask: string`
- `hint?: string`
- `debounceMs?: number`
- `onDebouncedChange?: (value) => void`
- `slotClassNames?` / `slotStyles?` for internal surface customization
- standard `input` props such as `value`, `defaultValue`, `onChange`, `disabled`

## Immediate And Debounced Flow

- `onChange` stays immediate and should drive live state in the host.
- `onDebouncedChange` is optional and runs after `debounceMs`.
- If you need to show current validity right away, use your controlled `value` together with `getMaskedFieldState(mask, value)`.

## Mask Syntax

- `D` = one digit
- `A` = one letter
- `D*` = zero or more digits
- `A*` = zero or more letters
- `D3` = exactly three digits
- `A2` = exactly two letters
- `D3+` = three or more digits
- `A4+` = four or more letters
- any other character is treated as a literal

Examples:

- `+(D)`
- `(D3)`
- `(D3-D2-D2)`
- `A3-D3`

## Validation

- The field filters incoming text through the mask and auto-inserts literals when enough token content exists.
- If the current value is incomplete for the mask, the field turns red with yellow text.
- Empty value stays neutral, so a fresh field does not start in an error state.

## Notes

- `MaskedField` is intentionally separate from `TextField`, so plain text inputs stay simple.
- Unbounded segments such as `D*` and `D3+` are best used as the final variable part of the mask. That keeps formatting deterministic.

## Current Scope

For the current library stage, `MaskedField` is considered production-ready for:

- fixed masks with literals
- short operational codes
- dial prefixes
- serial-like identifiers
- numeric masks with immediate invalid feedback
- host flows where live state and debounced state are both useful

The current implementation deliberately stops short of advanced editor-like caret management.

## Final-State Roadmap

If we continue this control toward a fuller final state, the main work areas are:

1. Caret and selection behavior.
   File: [packages/ui/src/components/MaskedField/MaskedField.tsx](/home/code4bones/Devs/coding/ReactNU/packages/ui/src/components/MaskedField/MaskedField.tsx)
   This is where cursor preservation, middle-of-string edits, backspace-over-literals, and paste normalization should be finished.

2. Mask grammar and formatting engine.
   File: [packages/ui/src/components/MaskedField/textMask.ts](/home/code4bones/Devs/coding/ReactNU/packages/ui/src/components/MaskedField/textMask.ts)
   This is the place to extend token kinds, add richer rules like hex/alnum/upper/lower, or tighten behavior for unbounded segments.

3. Public state contract.
   Files:
   [packages/ui/src/components/MaskedField/MaskedField.tsx](/home/code4bones/Devs/coding/ReactNU/packages/ui/src/components/MaskedField/MaskedField.tsx)
   [packages/ui/src/components/MaskedField/index.ts](/home/code4bones/Devs/coding/ReactNU/packages/ui/src/components/MaskedField/index.ts)
   If we need a stronger final API, this is where to add explicit exports such as `MaskedFieldState`, `onValidityChange`, or `onMaskComplete`.

4. Visual invalid and pending states.
   File: [packages/ui/src/components/MaskedField/MaskedField.less](/home/code4bones/Devs/coding/ReactNU/packages/ui/src/components/MaskedField/MaskedField.less)
   This is the right place for any future visual split between `pending`, `invalid`, and `complete`, or for adding a dedicated state marker.

5. Real usage regression coverage.
   File: [apps/sandbox/src/DemoApp.tsx](/home/code4bones/Devs/coding/ReactNU/apps/sandbox/src/DemoApp.tsx)
   The dedicated `Masked Field` demo window should stay the proving ground for new mask forms, paste flows, and live host-state scenarios.

## Recommended Next Improvements

These are the best-practice upgrades worth doing later, but not required right now:

- preserve caret position during reformatting
- add `onValidityChange`
- add `onMaskComplete`
- export a typed `MaskedFieldState`
- introduce richer token families only when a real use case appears

## Non-Goals For Now

These are intentionally out of scope for the current version:

- regex-style masks
- full parser-expression language
- locale-aware date/number semantics
- aggressive auto-correction beyond the current readable token model

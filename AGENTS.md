# AGENTS.md

## Project

We are building a **React component library** with a visual language inspired by **Norton Utilities 6.0 / DOS-era productivity software**.

The goal is not to make a cheap “retro skin”. The goal is to create a serious, reusable component system that feels like a polished DOS utility suite: precise, fast, dense, keyboard-friendly, high-contrast, and visually disciplined.

The agent working in this repository should behave like a **senior frontend engineer**: pragmatic, careful, self-critical, and focused on delivering maintainable code rather than impressive-looking churn.

---

## Core Behavior

Act as a senior engineer who:

- Thinks before editing.
- Reads the relevant code before making changes.
- Makes the smallest effective change that solves the problem.
- Is self-critical and checks their own assumptions.
- Avoids speculative rewrites.
- Explains tradeoffs when they matter.
- Does not hide uncertainty.
- Does not produce noisy output just to appear busy.

Prefer calm, precise engineering over dramatic refactors.

---

## Operating Principles

### 1. Understand Before Changing

Before editing code:

- Identify the actual request.
- Inspect relevant files.
- Check existing patterns.
- Reuse existing architecture unless there is a strong reason not to.
- Do not introduce new abstractions until at least two concrete use cases justify them.

If the task is ambiguous, make a reasonable assumption and state it briefly. Do not block progress with excessive questions.

### 2. Minimal, Coherent Changes

Make changes that are:

- Small enough to review.
- Complete enough to be useful.
- Consistent with the rest of the library.
- Easy to revert if needed.

Avoid unrelated formatting, drive-by cleanup, or broad rewrites unless explicitly requested.

### 3. Senior-Level Self-Review

Before considering a task done, review your own work as if you were reviewing a pull request.

Check:

- Does the API make sense?
- Is the component reusable?
- Are props named clearly?
- Are edge cases handled?
- Is styling consistent with the visual system?
- Are accessibility basics respected?
- Did you accidentally increase complexity?
- Did you leave dead code, debug code, or misleading comments?

If something is imperfect but acceptable, mention it honestly.

---

## Command and Output Discipline

The agent must be careful and economical with command output.

### Do Not Dump Huge Output

Do **not** run commands in a way that floods the transcript with full build logs, full test logs, or giant directory listings.

Avoid commands such as:

```bash
npm run build
npm test
ls -R
find .
cat large-file.tsx
```

unless output is filtered, scoped, or genuinely necessary.

### Prefer Focused Output

When running checks, prefer commands that surface only meaningful information.

Examples:

```bash
npm run build 2>&1 | grep -iE "error|failed|warning|ts\(|TS[0-9]+|vite|rollup" | head -120
npm test -- --runInBand 2>&1 | grep -iE "fail|error|expected|received" | head -120
npm run lint 2>&1 | grep -iE "error|warning|problem|eslint" | head -120
```

If a command fails and filtered output is insufficient, rerun a narrower command targeting the failing package, file, or test.

### Summarize Command Results

After running commands, report only:

- Command run.
- Whether it passed or failed.
- Relevant errors or warnings.
- Any uncertainty caused by filtered output.

Do not paste full logs unless specifically requested.

### Be Resource-Conscious

Prefer quick local checks before expensive ones.

Suggested order:

1. Typecheck relevant files if possible.
2. Run targeted tests.
3. Run lint only where relevant if supported.
4. Run full build only when needed.
5. Run full test suite only when the change justifies it.

---

## Coding Standards

### Language and Framework

This project uses React and TypeScript.

Default expectations:

- Components are written in TypeScript.
- Public APIs are typed explicitly.
- Avoid `any` unless there is a documented reason.
- Prefer composition over configuration overload.
- Keep component logic simple and readable.
- Keep rendering predictable.

### Component Design

A good component in this library should be:

- Reusable.
- Accessible by default.
- Keyboard-friendly.
- Easy to theme.
- Reasonable in DOM structure.
- Predictable in behavior.
- Visually consistent with the DOS/Norton-inspired design system.

Component APIs should avoid excessive cleverness.

Prefer:

```tsx
<Button variant="primary" size="sm">
  Continue
</Button>
```

over:

```tsx
<Button mode="norton-blue-solid-tight-action-hotkey-aware">Continue</Button>
```

### Props

Use clear prop names.

Prefer common conventions:

- `variant`
- `size`
- `disabled`
- `selected`
- `active`
- `open`
- `defaultOpen`
- `onOpenChange`
- `value`
- `defaultValue`
- `onValueChange`
- `children`
- `className`

Boolean props should read naturally.

Good:

```tsx
<Panel bordered shadowed />
```

Bad:

```tsx
<Panel hasBorderFlag enableShadowMode />
```

### State

Prefer controlled/uncontrolled patterns where appropriate.

Do not hide meaningful state transitions inside styling code.

Avoid state unless it is necessary.

### Styling

Use the project’s established styling approach. Do not introduce a new styling system without explicit approval.

Styling should favor reusable tokens and clear primitives over one-off values.

Avoid scattering magic colors, spacing, and typography values throughout components.

When two or more controls share the same visual part, prefer a shared internal primitive over duplicated markup or duplicated LESS.

Examples:

- dropdown/combo opener chrome
- popup surface shells
- repeated status/footer action rows

If DOM semantics differ, keep one shared primitive with a selectable tag or role rather than forking the entire implementation.

---

## Visual Direction

The visual style is inspired by **Norton Utilities 6.0-era DOS interfaces**.

This means:

- Text-mode UI feel.
- Sharp rectangular geometry.
- Dense information layout.
- Strong contrast.
- Crisp borders.
- Functional color coding.
- Minimal ornament.
- Keyboard-first interaction patterns.
- Utility-software seriousness.

This does **not** mean:

- Random glitch effects.
- Fake CRT blur everywhere.
- Meme retro aesthetics.
- Excessive animation.
- Low readability.
- Inconsistent novelty styling.

The UI should feel like a professional DOS utility that somehow became a modern React library.

### Visual Keywords

Use these as guidance:

- DOS
- Norton Utilities
- text mode
- cyan panels
- blue background
- gray beveled controls
- yellow highlights
- white monospaced text
- keyboard shortcuts
- menu bars
- modal dialogs
- status bars
- dense grids
- command panels
- functional hierarchy

### Color Guidance

Prefer a restrained palette inspired by DOS text UIs:

- Deep blue backgrounds.
- Cyan panel surfaces.
- White primary text.
- Black shadow or contrast lines.
- Yellow highlights for active or selected states.
- Gray for inactive controls.
- Red only for destructive or critical states.
- Green only for success or active system states.

Use tokens, not scattered raw colors.

Example token names:

```ts
--nu - bg - app;
--nu - bg - panel;
--nu - bg - panel - raised;
--nu - border - bright;
--nu - border - dark;
--nu - text - primary;
--nu - text - muted;
--nu - text - inverse;
--nu - accent - active;
--nu - accent - warning;
--nu - accent - danger;
--nu - accent - success;
```

### Typography

Prefer monospaced typography.

The UI should remain readable at small sizes.

Important text should look intentional, not merely nostalgic.

Avoid using decorative fonts that harm usability.

### Borders and Surfaces

Borders are central to the style.

Use:

- Single-pixel or double-line borders.
- Beveled edges where appropriate.
- Clear separation between panels.
- Explicit focus outlines.

Avoid:

- Soft modern glassmorphism.
- Large rounded corners.
- Heavy drop shadows.
- Gradient-heavy web-2.0 styling.

### Motion

Motion should be minimal.

Prefer instant or near-instant UI feedback. If animation exists, it should serve clarity, not decoration.

Avoid springy, bouncy, playful motion unless explicitly requested.

---

## Accessibility Requirements

Retro styling must not compromise accessibility.

Every interactive component should consider:

- Keyboard navigation.
- Focus visibility.
- ARIA roles where appropriate.
- Disabled states.
- Screen reader semantics.
- Sufficient contrast.
- Logical tab order.

Do not remove outlines unless replacing them with an equally visible focus style.

Keyboard support is especially important because the visual inspiration is keyboard-first DOS software.

---

## Library Architecture

Prefer a layered structure:

1. Design tokens.
2. Low-level primitives.
3. Composed components.
4. Examples and documentation.

Avoid coupling components directly to demo-only code.

Suggested structure:

```text
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
      index.ts
    Panel/
      Panel.tsx
      Panel.test.tsx
      Panel.stories.tsx
      index.ts
  tokens/
    colors.css
    spacing.css
    typography.css
  utils/
  index.ts
```

Follow the actual repository structure if it already exists.

### Internal Primitive Guidance

Do not create a new public component just because two controls share an internal piece.

Prefer:

- shared LESS primitive when only geometry/chrome is shared
- shared internal JSX primitive when markup and behavior are mostly shared

Current examples in this repository:

- `ControlOpener` is an internal shared primitive for `Dropdown` and `ComboBox`
- popup positioning helpers live in `_shared` because the same viewport/portal math is reused

### Popup / Portal Guidance

Popup-like controls should not guess between multiple coordinate systems.

Current preferred contract:

- render popup/menu layers into `document.body`
- compute position from `getBoundingClientRect()`
- if theme tokens are needed, mirror them from the nearest `.nu-theme-root` onto the portal root

Avoid mixing:

- viewport-based coordinates
- with a popup rendered inside a non-body portal root

unless the component is intentionally built around that local coordinate system.

---

## Testing Expectations

Add or update tests when behavior changes.

Prioritize tests for:

- User-visible behavior.
- Keyboard interaction.
- Controlled/uncontrolled state.
- Accessibility-relevant behavior.
- Regression-prone logic.

Do not write brittle tests for implementation details unless unavoidable.

For visual components, stories/examples may be as important as unit tests.

---

## Documentation Expectations

Public components should have enough documentation for another developer to use them correctly.

Include, where appropriate:

- Basic usage.
- Variants.
- Sizes.
- Keyboard behavior.
- Accessibility notes.
- Controlled/uncontrolled examples.

Keep docs practical. Avoid marketing language.

---

## Storybook / Examples

When adding or modifying a component, update examples or stories if the project uses Storybook or a similar tool.

Stories should demonstrate:

- Default state.
- Variants.
- Disabled state.
- Focus/active/selected states where possible.
- Dense layout usage.
- Realistic DOS/Norton-style composition.

Avoid toy examples that do not reveal real component behavior.

### Storybook Host Rules

Storybook desktop/window stories should be explicit about the host they are demonstrating.

Use:

- `NuDesktop` only when the story is specifically about the full desktop shell
- bounded `NuWindowProvider` when the story only needs managed dialogs/windows inside a preview area

Do not rely on fullscreen/fixed desktop semantics for helper-dialog stories when a bounded window host is enough.

---

## Dependency Policy

Do not add dependencies casually.

Before adding a dependency, consider:

- Can this be solved simply without it?
- Is it appropriate for a component library?
- Does it affect bundle size?
- Is it actively maintained?
- Does it complicate SSR or bundling?
- Does it introduce styling assumptions?

If a dependency is useful, explain why.

Prefer peer dependencies for framework-level packages when appropriate.

---

## Performance

Component library code should be lightweight.

Avoid:

- Unnecessary runtime work.
- Large dependencies for small utilities.
- Re-render-heavy patterns.
- Layout thrashing.
- Deep component trees without reason.

Do not prematurely optimize, but do not ignore obvious inefficiencies.

---

## Build and Packaging Awareness

Be careful with public exports.

When modifying exports, check:

- `src/index.ts`
- per-component `index.ts` files
- package build config
- type declarations
- tree-shaking behavior

Avoid accidental breaking changes to public APIs.

If a breaking change is necessary, call it out clearly.

---

## Error Handling

When something fails:

1. Read the error carefully.
2. Identify the smallest failing surface.
3. Reproduce narrowly if possible.
4. Fix the root cause, not just the symptom.
5. Re-run the most relevant check.

Do not guess wildly.

Do not make unrelated changes hoping the error disappears.

---

## Git Discipline

Do not create commits unless explicitly asked.

Do not rewrite history.

Do not change branches unless explicitly asked.

Before final response, summarize changed files and meaningful checks performed.

Every completed repository change must include a version bump in
`packages/ui/package.json`; keep any workspace dependency on the library in
sync and record release-relevant changes in `CHANGELOG.md`.

If working tree already contains unrelated user changes, do not overwrite them.

---

## Security and Safety

Do not execute unknown scripts from the internet.

Do not paste secrets into logs.

Do not expose environment variables.

Do not modify lockfiles unless dependency changes or package manager behavior requires it.

Do not run destructive commands unless explicitly requested and clearly necessary.

Avoid commands such as:

```bash
rm -rf
sudo
chmod -R
chown -R
git reset --hard
git clean -fd
```

unless the user explicitly approves the exact action.

---

## Preferred Workflow

For most tasks:

1. Inspect relevant files.
2. Identify existing patterns.
3. Make a small implementation change.
4. Add or update tests/examples/docs if appropriate.
5. Run targeted checks with filtered output.
6. Self-review the diff.
7. Summarize the work clearly.

---

## Final Response Format

When finishing a task, respond with:

1. What changed.
2. Why it changed.
3. Checks run and result.
4. Any caveats or follow-up recommendations.

Keep the final response concise and useful.

Example:

```text
Implemented Button `variant="danger"` using existing token patterns.

Changed:
- `src/components/Button/Button.tsx`
- `src/components/Button/Button.test.tsx`
- `src/components/Button/Button.stories.tsx`

Checks:
- `npm run test -- Button` passed
- `npm run lint -- Button` passed

Note:
- I did not run the full build because the change was isolated and targeted checks passed.
```

---

## Quality Bar

A task is not complete merely because the code compiles.

A task is complete when:

- The implementation solves the actual request.
- The API is coherent.
- The visual result fits the Norton Utilities / DOS design direction.
- The code is maintainable.
- Relevant checks were run.
- The agent can explain what changed and why.

---

## Design Taste Reminder

This library should feel like a serious tool made by people who cared about clarity and speed.

Think less “retro novelty website”.

Think more:

> A modern React component library wearing the uniform of a precise DOS-era diagnostic suite.

Dense. Fast. Crisp. Useful.

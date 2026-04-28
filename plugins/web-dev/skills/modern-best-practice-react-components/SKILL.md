---
name: modern-best-practice-react-components
description: Build clean, modern React components that apply common best practices and avoid common pitfalls like unnecessary state management or useEffect usage
---

Write and edit React components following these rules. For scaffolding a new component use `/create-react-component`.

## Component Structure

- **PREFER** small, focused components with a single responsibility
- **PREFER** named `function` components over arrow functions
  - Exception: anonymous callbacks, inline render props, and closures
- Keep components flat and readable — avoid deeply nested JSX
- Group related logic together (event handlers, derived values, helpers)

## State Management

- **AVOID** `useEffect()` — derive values during render instead of synchronizing state
  - Fetch data via TanStack Query (`@tanstack/react-query`)
- **AVOID** unnecessary `useState()` — derive state from props or other state when possible
- **DO NOT** mirror props in state unless absolutely necessary
- Localize state to the lowest possible component

## Event Handling

- **AVOID** inline event handlers in JSX — extract named handler functions inside the component body
- Name handlers clearly: `handleSubmit`, `handleChange`, `handleClose`
- Keep handlers small; extract complex logic into helpers

## Rendering & Performance

- **PREFER** computing derived values inline or via helper functions over storing in state
- Use `useMemo()` sparingly and only for proven performance issues
- **AVOID** unnecessary memoization (`memo`, `useCallback`) unless absolutely required
- Keep keys stable and meaningful when rendering lists

## Props & Composition

- **PREFER** composition over configuration
- **AVOID** excessive boolean props; prefer expressive APIs
- Keep prop names semantic and predictable

## Anti-patterns

```tsx
// ❌ inline sx with hardcoded values
<Paper sx={{ position: 'fixed', bottom: 0, zIndex: 1100 }}>

// ✅ reference a styles key
<Paper sx={styles.paper}>  // styles.paper defined in .styles.ts
```

```tsx
// ❌ inline event handler
<Button onClick={() => navigate({ to: Path.Groups })}>

// ✅ named handler
const handleNavigate = () => navigate({ to: Path.Groups });
<Button onClick={handleNavigate}>
```

```tsx
// ❌ raw useTheme + useMediaQuery duplicated across components
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// ✅ use a shared breakpoint hook
const { isMobile } = useBreakpoints();
```

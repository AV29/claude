---
name: create-react-component
description: Create a new React component following project conventions with necessary supporting files. Usage: /create-react-component ComponentName [path]
argument-hint: ComponentName [src/components]
---

Create a React component named `$ARGUMENTS` following project conventions.

Parse `$ARGUMENTS` as: first word = component name, optional second word = destination path (default: `src/components`).

> For component design rules (state, events, composition, anti-patterns) apply the `/modern-best-practice-react-components` skill. For unit tests use the `/write-unit-tests` skill.

## Detect styling approach

Before scaffolding, check the project's styling setup:

- **Tailwind CSS** — any of: `tailwind.config.js`, `tailwind.config.ts`, `tailwind.config.mjs` exists, or `tailwindcss` / `@tailwindcss/*` appears in `package.json` dependencies
- **MUI / CSS-in-JS** — otherwise (default)

The detected approach determines which template to use below.

---

## Tailwind CSS project

No `.styles.ts` file. Use semantic HTML or lightweight wrappers with `className`.

### `<path>/<ComponentName>/ComponentName.tsx`

```tsx
interface ComponentNameProps {}

function ComponentName(props: ComponentNameProps) {
  return <div className=""></div>;
}

export default ComponentName;
```

### `<path>/<ComponentName>/index.ts`

```ts
export { default } from "./ComponentName";
```

### `<path>/<ComponentName>/ComponentName.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName />);
    // assert visible content, e.g.:
    // expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

---

## MUI / CSS-in-JS project

### `<path>/<ComponentName>/ComponentName.tsx`

```tsx
import { Box } from "@mui/material";
import styles from "./ComponentName.styles";

interface ComponentNameProps {}

function ComponentName(props: ComponentNameProps) {
  return <Box sx={styles.root}></Box>;
}

export default ComponentName;
```

### `<path>/<ComponentName>/ComponentName.styles.ts`

```ts
const styles = {
  root: {},
};

export default styles;
```

### `<path>/<ComponentName>/index.ts`

```ts
export { default } from "./ComponentName";
```

### `<path>/<ComponentName>/ComponentName.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName />);
    // assert visible content, e.g.:
    // expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

---

## Project Conventions

- Imports: use `@/` alias except within the same folder
- **Tailwind projects:** no `.styles.ts`, no inline style props — use `className` with Tailwind utilities
- **MUI projects:** styles go in `.styles.ts` only — no inline `sx` props with hardcoded values (use `styles.*` keys); styles object named `styles`, default exported from `*.styles.ts`; put blank lines between style properties for readability
- Boolean props/state: prefix with `is`, `has`, `can`, `should`
- If it's a page, destination is `src/pages/` and also _(adapt paths to your project's router setup)_:
  - Add the path constant to the router paths enum
  - Register the route in the app's route config
  - Wrap with an auth guard if the route requires authentication

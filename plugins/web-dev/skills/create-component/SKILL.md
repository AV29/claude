---
name: create-component
description: Create a folder with a new React component following project conventions with necessary supporting files. Usage: /create-component ComponentName [path]
argument-hint: ComponentName [src/components]
---

Create a React component named `$ARGUMENTS` following project conventions.

Parse `$ARGUMENTS` as: first word = component name, optional second word = destination path (default: `src/components`).

> For component design rules (state, events, composition, anti-patterns) apply the `/modern-best-practice-react-components` skill. For unit tests use the `/write-unit-tests` skill.

## Files to create

### `<path>/<ComponentName>/ComponentName.tsx`

```tsx
import { Box } from '@mui/material';
import styles from './ComponentName.styles';

interface ComponentNameProps {}

const ComponentName = (props: ComponentNameProps) => {
  return <Box sx={styles.root}></Box>;
};

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
export { default } from './ComponentName';
```

### `<path>/<ComponentName>/ComponentName.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
    // assert visible content, e.g.:
    // expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## Project Conventions

- Use MUI components (`Box`, `Typography`, etc.) — no plain HTML elements
- Styles go in `.styles.ts` only — no inline styles or `sx` props with hardcoded values (use `styles.*` keys). No inline CSS-in-JS.
- Styles object should be named `styles`, default exported from `*.styles.ts` and imported from `./ComponentName.styles`
- Put blank lines between each style property in the `styles` object for readability
- Imports: use `@/` alias except within the same folder
- Boolean props/state: prefix with `is`, `has`, `can`, `should`
- If it's a page, destination is `src/pages/` and also *(adapt paths to your project's router setup)*:
  - Add the path constant to the router paths enum
  - Register the route in the app's route config
  - Wrap with an auth guard if the route requires authentication

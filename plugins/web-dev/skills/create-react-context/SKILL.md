---
name: create-react-context
description: Create a new React context following project conventions. Usage: /create-react-context ContextName [route-based]
argument-hint: ContextName [route-based]
---

Create a React context named `$ARGUMENTS` following project conventions.

Parse `$ARGUMENTS` as: first word = context name (without "Context" suffix, e.g. `User` → `UserContext`), optional second word = `route-based` (default: children-based).

## Context Pattern

All files go in `src/context/<ContextNameContext>`.

- `ContextNameProvider.tsx` — provider
- `ContextNameContext.tsx` — type, context
- `ContextNameProvider.test.tsx` - unit tests
- `useContextName.ts` — hook with out-of-scope guard
- `index.ts` — barrel export

## Files to create

### `src/context/<ContextNameContext>/ContextNameContext.tsx`

```tsx
import { createContext } from "react";

export interface ContextNameContextType {
  // add context value shape here
}

export const ContextNameContext = createContext<
  ContextNameContextType | undefined
>(undefined);
```

### `src/context/<ContextNameContext>/ContextNameProvider.tsx`

**Children-based provider (default):**

```tsx
import { ReactNode } from "react";
import {
  ContextNameContext,
  ContextNameContextType,
} from "./ContextNameContext";

interface ContextNameProviderProps {
  children: ReactNode;
}

export const ContextNameProvider = ({ children }: ContextNameProviderProps) => {
  const value: ContextNameContextType = {
    // populate value here
  };

  return (
    <ContextNameContext.Provider value={value}>
      {children}
    </ContextNameContext.Provider>
  );
};
```

**Route-based provider (when `route-based` is passed):**

```tsx
import { Outlet } from "react-router";
import {
  ContextNameContext,
  ContextNameContextType,
} from "./ContextNameContext";

export const ContextNameProvider = () => {
  const value: ContextNameContextType = {
    // populate value here
  };

  return (
    <ContextNameContext.Provider value={value}>
      {children}
    </ContextNameContext.Provider>
  );
};
```

### `src/context/<ContextNameContext>/ContextNameContext.test.tsx`

```tsx
...

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>child content</span>
      </ThemeProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});

...
```

### `src/context/<ContextNameContext>/useContextName.ts`

```ts
import { useContext } from "react";
import {
  ContextNameContext,
  ContextNameContextType,
} from "./ContextNameContext";

export const useContextName = (): ContextNameContextType => {
  const context = useContext(ContextNameContext);

  if (context === undefined) {
    throw new Error("useContextName must be used within ContextNameProvider");
  }

  return context;
};
```

### `src/context/<ContextNameContext>/index.ts`

Add to the existing barrel (do not replace, append):

```ts
export {
  ContextNameContext,
  ContextNameProvider,
  type ContextNameContextType,
} from "./ContextNameContext";
export { useContextName } from "./useContextName";
```

## Rules

- The context type interface must be named `ContextNameContextType`
- The context must be initialised with `undefined` and typed as `ContextNameContextType | undefined`
- The hook must guard against out-of-scope usage by throwing a descriptive error when `context === undefined`
- Boolean props/state: prefix with `is`, `has`, `can`, `should`
- Imports: use `@/` alias except within the same folder
- Add the new exports to the existing `src/context/index.ts` barrel — never overwrite it
- If the provider needs to wrap a route segment, use the route-based pattern (`<Outlet />`); otherwise use the children-based pattern

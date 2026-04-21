---
name: create-react-context
description: Create a new React context following project conventions. Usage: /create-react-context ContextName [route-based]
argument-hint: ContextName [route-based]
---

Create a React context named `$ARGUMENTS` following project conventions.

Parse `$ARGUMENTS` as: first word = context name (without "Context" suffix, e.g. `User` → `UserContext`), optional second word = `route-based` (default: children-based).

## Context Pattern

All files go in `src/context/<ContextNameContext>`.

- `ContextNameContext.tsx` — type, context, provider
- `useContextName.ts` — hook with out-of-scope guard
- `index.ts` — barrel export

## Files to create

### `src/context/<ContextNameContext>/ContextNameContext.tsx`

**Children-based provider (default):**

```tsx
import { createContext, ReactNode } from 'react';

export interface ContextNameContextType {
  // add context value shape here
}

export const ContextNameContext = createContext<
  ContextNameContextType | undefined
>(undefined);

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
import { createContext } from 'react';
import { Outlet } from 'react-router';

export interface ContextNameContextType {
  // add context value shape here
}

export const ContextNameContext = createContext<
  ContextNameContextType | undefined
>(undefined);

export const ContextNameProvider = () => {
  const value: ContextNameContextType = {
    // populate value here
  };

  return (
    <ContextNameContext.Provider value={value}>
      <Outlet />
    </ContextNameContext.Provider>
  );
};
```

### `src/context/<ContextNameContext>/useContextName.ts`

```ts
import { useContext } from 'react';
import {
  ContextNameContext,
  ContextNameContextType,
} from './ContextNameContext';

export const useContextName = (): ContextNameContextType => {
  const context = useContext(ContextNameContext);

  if (context === undefined) {
    throw new Error('useContextName must be used within ContextNameProvider');
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
} from './ContextNameContext';
export { useContextName } from './useContextName';
```

## Rules

- The context type interface must be named `ContextNameContextType`
- The context must be initialised with `undefined` and typed as `ContextNameContextType | undefined`
- The hook must guard against out-of-scope usage by throwing a descriptive error when `context === undefined`
- Boolean props/state: prefix with `is`, `has`, `can`, `should`
- Imports: use `@/` alias except within the same folder
- Add the new exports to the existing `src/context/index.ts` barrel — never overwrite it
- If the provider needs to wrap a route segment, use the route-based pattern (`<Outlet />`); otherwise use the children-based pattern

---
name: write-unit-tests
description: Write unit tests for a component, hook, or utility using React Testing Library and Vitest. Usage: /write-unit-tests <path-to-file>
argument-hint: src/path/to/File.tsx
---

Write unit tests for the file at `$ARGUMENTS`. Read the target file first, then create a `<FileName>.test.ts(x)` file in the same directory.

## Best Practices

### General

- Test **behaviour**, not implementation — assert what the user sees or what the function returns, not internal state
- One assertion focus per `it` block — keep tests narrow and descriptive
- Test file lives next to the source file: `ComponentName.test.tsx`
- Use `describe('<ComponentName>')` as the top-level block; nest `describe` only when grouping meaningfully (e.g. by prop variation or user flow)
- `it` descriptions should read as plain English: `it('shows an error when email is invalid')`

### Imports

```ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
```

- Prefer `userEvent` over `fireEvent` for interactions that trigger multiple events (click, type)
- Never add arbitrary `setTimeout` delays, use `waitFor` / `findBy*` instead for async assertions;

### Queries (priority order)

1. `getByRole` — most resilient, matches accessible semantics
2. `getByLabelText` — for form fields
3. `getByText` — for visible content
4. `getByTestId` — last resort only; prefer semantic queries

### Mocking

Mock at the module boundary, not inside components:

```ts
vi.mock('@/api/users/hooks', () => ({
  useGetUsers: vi.fn(),
}));
```

Restore or reset mocks in `beforeEach` to avoid test bleed:

```ts
beforeEach(() => {
  vi.mocked(useGetUsers).mockReturnValue({ data: [], isPending: false });
});
```

For mocking hooks let's use spyOn helpers that should be put in a utility folder `utils/tests/spyOnUseSomething.ts` for future reusability by other tests:

```ts
import * as useSomething from 'hooks/api/something';

const spyOnUseAssets = ({
  data = { assets: [] } as SomethingResponse | undefined,
  isLoading = false,
  error = null,
  isSuccess = true,
} = {}) => {
  vi.spyOn(useSomething, 'default').mockReturnValue({
    data,
    isLoading,
    error,
    isSuccess,
  });
};

export default spyOnUseAssets;
```

For router-dependent components wrap with `BrowserRouter` or a helper, that lives inside test-utils:

```tsx
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);
```

For components that need React Query, wrap with a fresh `QueryClientProvider`:

```tsx
const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};
```

### What to test

**Components:** rendering, user interactions, conditional branches (loading / error / empty states)

**Hooks:** use `renderHook` from `@testing-library/react`; test return values and side effects

**Utils / pure functions:** straightforward input → output assertions; no rendering needed

### What NOT to test

- Implementation details (state variable names, internal method calls)
- Third-party library internals
- Styles

### Types

- Avoid using `as any` or `@ts-ignore` in tests; if necessary, add a comment explaining why and consider improving the test setup to avoid it

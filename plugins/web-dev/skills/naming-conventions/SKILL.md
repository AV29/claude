---
name: naming-conventions
description: Enforce consistent naming conventions across React/TypeScript code
---

# Naming Conventions

Names should communicate **intent and domain**, not implementation details or rendering specifics.

## Casing at a glance

| Thing | Convention | Example |
|---|---|---|
| Variables & local constants | `camelCase` | `expenseTotal`, `currentUser` |
| Magic numbers, strings, maps, config | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Enums | `PascalCase` (singular) | `PaymentStatus`, `UserRole` |
| Components | `PascalCase` | `ExpenseList`, `PaymentForm` |
| Hooks | `camelCase` with `use` prefix | `useExpenses`, `useAuthState` |
| Props types | `PascalCase` `ComponentNameProps` | `ExpenseListProps` |
| Test IDs & JSX wrapper IDs | `kebab-case` | `expense-list`, `submit-button` |

## Booleans

- Prefix with `is`, `has`, `can`, `should`
- **AVOID** negated booleans — they force double negation at the call site

```ts
// ✅
isLoading, hasError, canSubmit, shouldRefresh

// ❌
isNotLoading, noError, disabled (use isDisabled), notReady
```

## Functions

- Always a verb
- **PREFER** `get`, `make`, `generate` as starters for value-returning functions
- Exception: boolean-returning functions follow the boolean rule (`is`, `has`, `can`, `should`)

```ts
// ✅
getExpenses(), makePayload(), generateId()
hasPermission(), canEdit(), isAuthenticated()

// ❌
expenses(), expensesFetcher(), data()
```

## Variables & Constants

- Local variables and constants: `camelCase`
- Module-level constants representing magic numbers, strings, maps, or configuration: `SCREAMING_SNAKE_CASE`

```ts
// ✅
const expenseTotal = 0;
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const STATUS_LABELS: Record<PaymentStatus, string> = { ... };

// ❌
const ExpenseTotal = 0;
const maxRetryCount = 3;
```

## Enums

- `PascalCase` name, always **singular**
- Members in `PascalCase`

```ts
// ✅
enum PaymentStatus { Pending, Completed, Failed }
enum UserRole { Admin, Viewer, Editor }

// ❌
enum PaymentStatuses { ... }   // plural
enum PAYMENT_STATUS { ... }    // screaming case
```

## React Hooks

- Always prefix with `use`
- Name by **what it provides**, not how it fetches or where data comes from

```ts
// ✅
useExpenses(), useAuthState(), useBreakpoints()

// ❌
useFetchExpensesFromApi(), useExpenseHook(), useExpenseQuery()
```

## Event Handlers

- Prop names (what the parent passes in): `on` prefix
- Handler implementations (what the component defines): `handle` prefix

```tsx
// ✅
<ExpenseRow onSelect={handleSelect} onDelete={handleDelete} />
const handleSelect = (id: string) => { ... };

// ❌
<ExpenseRow selectExpense={onSelectExpense} />
```

## Arrays & Collections

- Use plural nouns — never encode the data structure in the name

```ts
// ✅
expenses, selectedIds, filteredItems

// ❌
expenseList, expenseArray, idMap (use expenseById instead)
```

## Components & Files

- `PascalCase` for component names (also known as CapitalCamelCase)
- File name matches the exported component exactly (`ExpenseList.tsx` → `ExpenseList`)
- Name by **what it represents**, not how it renders — rendering details change, names should not

```tsx
// ✅
ExpenseList, UserCard, PaymentForm

// ❌
ExpensePillList, UserAvatarCard, PaymentModalForm
```

## Props Types

- Name as `ComponentNameProps`, no `I` prefix

```ts
// ✅
type ExpenseListProps = { ... }

// ❌
type Props = { ... }
type IExpenseListProps = { ... }
```

## Test IDs & JSX Wrapper IDs

- `kebab-case` for `data-testid` attributes and wrapper element IDs

```tsx
// ✅
<div data-testid="expense-list">
<button data-testid="submit-button">

// ❌
<div data-testid="expenseList">
<button data-testid="SubmitButton">
```

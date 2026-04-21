---
name: conventional-commits
description: Write git commit messages following the Conventional Commits specification. Use when asked to "write a commit message", "conventional commit", "commit format", or "how should I name this commit".
---

# Conventional Commits

Commit messages follow the format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Rules:**
- Subject line ≤ 72 characters
- Use imperative mood: "add feature" not "added feature"
- No period at the end of the subject
- Body explains *why*, not *what* — the diff shows what changed
- Blank line between subject and body

---

## Types

| Type | When to use |
|------|-------------|
| `feat` | New feature visible to users |
| `fix` | Bug fix visible to users |
| `refactor` | Code change with no behaviour change and no bug fix |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `chore` | Tooling, config, dependency bumps, build scripts |
| `ci` | CI pipeline changes |
| `build` | Changes affecting the build system |
| `revert` | Reverts a previous commit |

**Rule of thumb:** if a user would notice it → `feat` or `fix`. If only a developer would notice → everything else.

---

## Scope (optional)

A noun naming the area of the codebase in parentheses: `feat(auth):`, `fix(api):`, `chore(deps):`. Keep it short — one word preferred.

---

## Breaking Changes

Two ways to signal a breaking change:

```
feat!: drop support for Node 18
```

```
feat(api): rename endpoint

BREAKING CHANGE: /users/list is now /users
```

Both trigger a major version bump in semantic versioning.

---

## Examples

```
feat(auth): add OAuth2 login with Google
```

```
fix(forms): prevent duplicate submission on double-click
```

```
chore(deps): bump vite from 5.1.0 to 5.4.0
```

```
refactor(hooks): extract useFormState from RegistrationPage
```

```
feat!: remove deprecated v1 API endpoints

BREAKING CHANGE: /api/v1/* routes have been removed. Migrate to /api/v2/*.
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `fix: fixed the bug` | `fix: prevent crash when user list is empty` — describe *what* was fixed |
| `feat: various improvements` | Split into separate commits per change |
| `chore: WIP` | Never commit WIP to main; squash before merging |
| `feat(UserProfileComponent): ...` | Scope is too long — use `feat(profile): ...` |
| Past tense: `added`, `updated` | Imperative: `add`, `update` |

---
name: accessibility-checker
description: Reviews React components and HTML for accessibility compliance. Use when asked to "check accessibility", "a11y review", "WCAG compliance", "audit accessibility", or "make accessible". Enforces WCAG 2.2 AA standards including semantic HTML, ARIA, keyboard navigation, color contrast, and screen reader compatibility. Does NOT apply to backend code, API endpoints, or non-UI files.
argument-hint: src/components/ComponentName/ComponentName.tsx
---

# Accessibility Checker

Audit the component or markup in `$ARGUMENTS` for WCAG 2.1 AA compliance.

Parse `$ARGUMENTS` as: a file path, component name, or inline markup to review.

---

## When This Skill Applies

Activate for:
- "check accessibility", "a11y review", "WCAG compliance", "accessibility audit"
- Adding or reviewing interactive UI (buttons, forms, modals, navigation)
- Screen reader compatibility questions
- Keyboard navigation issues

Skip for:
- Backend/API code with no UI output
- CSS-only changes with no structural markup
- Unit test files

---

## Review Workflow

1. **Identify the component type** — form, modal, navigation, button group, data table, etc.
2. **Check structural semantics** — does HTML convey meaning without CSS?
3. **Audit ARIA usage** — are roles, labels, and states correct and necessary?
4. **Verify keyboard paths** — can every interaction be completed without a mouse?
5. **Check color contrast** — do foreground/background pairs meet 4.5:1 (text) or 3:1 (large text / UI)?
6. **Test screen reader announcements** — will a blind user hear the right context?
7. **Report findings** — group by WCAG principle (Perceivable, Operable, Understandable, Robust)

Refer to `resources/wcag-checklist.md` for the full WCAG 2.2 AA success criteria organized by principle.

---

## WCAG 2.2 AA Checklist

See `resources/wcag-checklist.md` for complete requirements organized by the four WCAG principles with specific success criteria and pass/fail indicators.

---

## Semantic HTML Rules

Always prefer native HTML semantics over ARIA overrides:

| Purpose | Correct | Avoid |
|---------|---------|-------|
| Clickable action | `<button>` | `<div onClick>` |
| Page navigation | `<nav>` | `<div role="navigation">` |
| Main content | `<main>` | `<div id="main">` |
| Section heading | `<h1>`–`<h6>` | `<div class="heading">` |
| Form field label | `<label htmlFor>` | `aria-label` on input (use when no visible label) |
| Form landmark | `<form>` | `<div>` wrapping inputs |
| Data table | `<table>`, `<th scope>` | `<div>` grid layout |

**Rule:** If a native element provides the semantics, use it. Add ARIA only when native HTML cannot express the pattern.

---

## ARIA Rules

1. **No ARIA is better than bad ARIA.** A missing label is better than a wrong one.
2. **`aria-label` vs `aria-labelledby`:** prefer `aria-labelledby` (references visible text); use `aria-label` when there is no visible label.
3. **`aria-describedby`:** supplements the accessible name with additional context (e.g., error messages, hints).
4. **Dynamic regions:** add `aria-live="polite"` for non-critical updates; `aria-live="assertive"` only for errors requiring immediate attention.
5. **Modal focus trap:** when a dialog opens, focus must move inside it; when it closes, focus must return to the trigger.
6. **`role="button"` on non-button:** requires `tabIndex={0}` and `onKeyDown` handling for `Enter`/`Space` — always use `<button>` instead.

### Required ARIA attributes by role

| Role | Required attributes |
|------|-------------------|
| `dialog` | `aria-labelledby` or `aria-label`, `aria-modal="true"` |
| `alertdialog` | `aria-labelledby`, `aria-describedby` |
| `combobox` | `aria-expanded`, `aria-controls` |
| `slider` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| `tab` | `aria-selected`, `aria-controls` |
| `tabpanel` | `aria-labelledby` |
| `tooltip` | triggered by `aria-describedby` on host |

---

## Keyboard Navigation Requirements

Every interactive element must be reachable and operable via keyboard:

| Interaction | Key(s) |
|-------------|--------|
| Focus next element | `Tab` |
| Focus previous element | `Shift+Tab` |
| Activate button/link | `Enter` |
| Toggle checkbox / activate button | `Space` |
| Close modal / dismiss tooltip | `Escape` |
| Navigate list/menu items | Arrow keys |
| Select option in listbox | `Enter` or `Space` |

**Focus management checklist:**
- [ ] Focus order follows visual/logical reading order
- [ ] Focus indicator is visible (outline, ring, or custom style — never `outline: none` without a replacement)
- [ ] Modal dialogs trap focus within the dialog
- [ ] Focus returns to trigger element after dialog/popover closes
- [ ] Skip-to-main-content link is the first focusable element on the page

---

## Color Contrast Requirements

| Text type | Minimum contrast ratio |
|-----------|----------------------|
| Normal text (< 18pt / < 14pt bold) | 4.5 : 1 |
| Large text (≥ 18pt or ≥ 14pt bold) | 3 : 1 |
| UI components & graphical objects | 3 : 1 |
| Disabled / decorative elements | No requirement |

**Checking contrast in code (MUI):**
- Use MUI's theme palette — avoid `text.disabled` or `action.disabled` colors for meaningful text
- `grey[400]` on white = ~2.6:1 — **fails** for normal text; use `grey[700]` (7.4:1) or darker
- `primary.main` (MUI blue `#1976d2`) on white = ~4.6:1 — **passes** for normal text
- Always verify custom palette entries with a dedicated contrast checker (e.g. WebAIM Contrast Checker)

---

## Image and Media Accessibility

```tsx
// Informative image — describe content
<img src="chart.png" alt="Q3 revenue grew 23% to $4.2M" />

// Decorative image — empty alt, hidden from screen readers
<img src="divider.png" alt="" role="presentation" />

// Icon button — label the action, not the icon
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Icon + visible text — hide icon from screen readers
<button>
  <XIcon aria-hidden="true" />
  Close
</button>
```

---

## Form Accessibility

```tsx
// Every input needs a visible, associated label
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-hint email-error"
    aria-invalid={hasError}
    aria-required="true"
  />
  <span id="email-hint">We'll never share your email.</span>
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email address.
    </span>
  )}
</div>
```

**Form checklist:**
- [ ] Every `<input>`, `<select>`, `<textarea>` has an associated `<label>` via `htmlFor`/`id`
- [ ] Required fields marked with `aria-required="true"` (and visually)
- [ ] Error messages linked via `aria-describedby` and use `role="alert"`
- [ ] `aria-invalid="true"` set on invalid fields
- [ ] Form groups use `<fieldset>` + `<legend>` (radio groups, checkboxes)

---

## Screen Reader Compatibility

**Announce dynamic content:**
```tsx
// Status messages (non-critical)
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Errors (critical, interrupt)
<div role="alert">
  {errorMessage}
</div>
```

**Visually hidden but screen-reader accessible:**
```tsx
import { visuallyHidden } from '@mui/utils';

// MUI utility — applies the sr-only CSS pattern
<Box component="span" sx={visuallyHidden}>Loading results...</Box>
```

**Never:**
- Use `display: none` or `visibility: hidden` for content that should be read aloud
- Use `aria-hidden="true"` on elements that need to be announced

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `<div onClick={...}>` | Replace with `<button>` |
| `<img>` without `alt` | Add `alt=""` (decorative) or descriptive text |
| `<input>` without label | Add `<label htmlFor>` or `aria-label` |
| `aria-label` duplicates visible text | Remove `aria-label`; screen readers read both |
| `role="button"` on `<div>` | Use `<button>` |
| Modal without focus trap | Implement focus trap; return focus on close |
| Low-contrast placeholder text | Use `color: #767676` minimum on white |
| Icon-only button without label | Add `aria-label` describing the action |
| `tabIndex={1}` or higher | Use `tabIndex={0}` only; never positive values |
| `autoFocus` on page load | Only use on modals/dialogs when appropriate |

---

## Reporting Format

When auditing a component, report findings as:

```
## Accessibility Audit: [ComponentName]

### Critical (must fix — WCAG 2.2 AA failure)
- [WCAG 1.1.1] Missing alt text on <img src="logo.png">
- [WCAG 4.1.2] <div onClick> must be a <button>

### Warnings (should fix — best practice)
- [WCAG 2.4.7] Focus indicator not visible on nav links

### Passes
- [WCAG 1.4.3] Color contrast on body text: 7.2:1 ✓
- [WCAG 2.1.1] All interactive elements reachable by keyboard ✓

### Recommendations
- Consider adding a skip-to-main-content link
```

# WCAG 2.2 AA Checklist

Reference for the `accessibility-checker` skill. Based on [WebAIM's WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist) and the [W3C WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/).

> **Note:** This targets WCAG 2.2 (W3C Recommendation, October 2023, updated December 2024) — the current recommended conformance target. It is a superset of WCAG 2.1. Mark each item ✓ Pass, ✗ Fail, or N/A.

---

## Principle 1: Perceivable

Information and UI components must be presentable to users in ways they can perceive.

### 1.1 Text Alternatives

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 1.1.1 | Non-text Content | A | All images, icons, charts, and CAPTCHAs have a text alternative. Decorative images use `alt=""`. |

**Checklist:**
- [ ] `<img>` tags have `alt` attribute (empty string acceptable only for decorative images)
- [ ] Icon-only buttons have `aria-label` or `aria-labelledby`
- [ ] SVG icons have `aria-hidden="true"` when paired with visible text; or `role="img"` + `aria-label` when standalone
- [ ] Canvas elements have a text description
- [ ] Complex images (charts, graphs) have a longer description via `aria-describedby` or adjacent text

### 1.2 Time-based Media

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 1.2.1 | Audio-only / Video-only | A | Pre-recorded audio has transcript; pre-recorded video-only has audio description or transcript |
| 1.2.2 | Captions (Prerecorded) | A | Captions provided for all pre-recorded audio in synchronized media |
| 1.2.3 | Audio Description or Media Alternative | A | Audio description or text alternative for pre-recorded video |
| 1.2.4 | Captions (Live) | AA | Captions for live audio content |
| 1.2.5 | Audio Description (Prerecorded) | AA | Audio description for all pre-recorded video |

**Checklist:**
- [ ] `<video>` elements include `<track kind="captions">`
- [ ] Auto-playing video/audio can be paused, stopped, or muted
- [ ] Videos with important visual content have audio descriptions

### 1.3 Adaptable

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 1.3.1 | Info and Relationships | A | Structure conveyed through markup, not just visual presentation |
| 1.3.2 | Meaningful Sequence | A | Reading order makes sense when CSS is removed |
| 1.3.3 | Sensory Characteristics | A | Instructions don't rely solely on shape, size, visual location, or sound |
| 1.3.4 | Orientation | AA | Content not restricted to portrait or landscape |
| 1.3.5 | Identify Input Purpose | AA | Input fields identifying personal data use correct `autocomplete` values |

**Checklist:**
- [ ] Headings use `<h1>`–`<h6>` (not styled `<div>`)
- [ ] Lists use `<ul>`, `<ol>`, `<dl>` (not `<div>` with bullets via CSS)
- [ ] Tables use `<table>`, `<th scope="col|row">`, `<caption>`
- [ ] Form fields are associated with labels via `htmlFor`/`id`
- [ ] Related form controls grouped with `<fieldset>` + `<legend>`
- [ ] DOM order matches visual reading order
- [ ] Name/address inputs have appropriate `autocomplete` attributes (`name`, `email`, `tel`, `street-address`, etc.)

### 1.4 Distinguishable

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 1.4.1 | Use of Color | A | Color not the only means of conveying information |
| 1.4.2 | Audio Control | A | Audio playing > 3s can be paused/stopped/muted |
| 1.4.3 | Contrast (Minimum) | AA | Text has ≥ 4.5:1 contrast; large text ≥ 3:1 |
| 1.4.4 | Resize Text | AA | Text can be resized up to 200% without loss of content |
| 1.4.5 | Images of Text | AA | Text used instead of images of text (except logos) |
| 1.4.10 | Reflow | AA | Content reflows at 320px width without horizontal scrolling |
| 1.4.11 | Non-text Contrast | AA | UI components and graphical objects have ≥ 3:1 contrast |
| 1.4.12 | Text Spacing | AA | No loss of content with increased letter/word/line spacing |
| 1.4.13 | Content on Hover or Focus | AA | Hover/focus content is dismissible, hoverable, and persistent |

**Checklist:**
- [ ] Error states use icon + color (not color alone)
- [ ] Required fields use asterisk + color (not color alone)
- [ ] Normal text: ≥ 4.5:1 contrast ratio against background
- [ ] Large text (≥ 18pt or ≥ 14pt bold): ≥ 3:1 contrast ratio
- [ ] Input borders, focus rings: ≥ 3:1 contrast against adjacent background
- [ ] Placeholder text: ≥ 4.5:1 (often fails — `placeholder` color must be dark enough)
- [ ] Page layout not broken at 320px width
- [ ] Tooltips/popovers stay visible when hovered; dismissible via `Escape`

---

## Principle 2: Operable

UI components and navigation must be operable.

### 2.1 Keyboard Accessible

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 2.1.1 | Keyboard | A | All functionality available from keyboard |
| 2.1.2 | No Keyboard Trap | A | Keyboard focus can be moved away from any component |
| 2.1.4 | Character Key Shortcuts | A | Single-key shortcuts can be turned off or remapped |

**Checklist:**
- [ ] All interactive elements focusable with `Tab`
- [ ] No positive `tabIndex` values (use `tabIndex={0}` or `-1` only)
- [ ] Modals trap focus inside while open
- [ ] Focus is not permanently trapped anywhere
- [ ] Custom widgets (date pickers, carousels, menus) have keyboard interaction
- [ ] Dropdown menus: arrow keys navigate items, `Escape` closes, `Enter`/`Space` selects

### 2.2 Enough Time

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 2.2.1 | Timing Adjustable | A | Time limits can be turned off, adjusted, or extended |
| 2.2.2 | Pause, Stop, Hide | A | Moving/auto-updating content lasting > 5s can be paused |

**Checklist:**
- [ ] Session timeouts warn users and allow extension
- [ ] Auto-advancing carousels have pause control
- [ ] Animations can be disabled (respect `prefers-reduced-motion`)

### 2.3 Seizures and Physical Reactions

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 2.3.1 | Three Flashes or Below Threshold | A | No content flashes more than 3 times per second |

**Checklist:**
- [ ] No rapid flashing animations
- [ ] Loading spinners use CSS animation, not JS-driven flashes

### 2.4 Navigable

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 2.4.1 | Bypass Blocks | A | Skip navigation link provided |
| 2.4.2 | Page Titled | A | Pages have descriptive `<title>` |
| 2.4.3 | Focus Order | A | Focus order preserves meaning and operability |
| 2.4.4 | Link Purpose (In Context) | A | Link purpose clear from text or context |
| 2.4.5 | Multiple Ways | AA | Multiple ways to find content (search, sitemap, etc.) |
| 2.4.6 | Headings and Labels | AA | Headings and labels describe topic/purpose |
| 2.4.7 | Focus Visible | AA | Keyboard focus indicator visible |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | **[New in 2.2]** Focused component is not entirely hidden by author-created content (e.g. sticky headers, cookie banners) |

**Checklist:**
- [ ] Skip-to-main-content link is first focusable element (can be visually hidden until focused)
- [ ] `<title>` set per page/route; updates on SPA navigation
- [ ] Focus order: top-to-bottom, left-to-right (matches reading order)
- [ ] Links say what they link to ("View cart" not "Click here")
- [ ] "Read more" links have `aria-label="Read more about [topic]"`
- [ ] Focus ring never removed without accessible replacement (`outline: none` is forbidden)
- [ ] All page sections reachable by heading navigation
- [ ] Focused elements are not fully hidden behind sticky headers, floating toolbars, or cookie consent banners

### 2.5 Input Modalities

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 2.5.1 | Pointer Gestures | A | Multi-point/path gestures have single-pointer alternative |
| 2.5.2 | Pointer Cancellation | A | Down-event actions can be cancelled |
| 2.5.3 | Label in Name | A | Accessible name includes visible label text |
| 2.5.4 | Motion Actuation | A | Motion-triggered functionality has UI alternative |
| 2.5.7 | Dragging Movements | AA | **[New in 2.2]** All drag-based functionality has a single-pointer alternative (e.g. drag-to-reorder has up/down buttons) |
| 2.5.8 | Target Size (Minimum) | AA | **[New in 2.2]** Pointer targets are at least 24×24 CSS pixels, or have sufficient spacing so the 24×24 area doesn't overlap other targets |

**Checklist:**
- [ ] Swipe gestures have button alternatives
- [ ] Drag-and-drop actions have a keyboard/button alternative (e.g. move up/down buttons for reorderable lists)
- [ ] Interactive tap targets are at least 24×24px; ideally 44×44px (WCAG AAA threshold)
- [ ] Button's `aria-label` starts with or contains visible button text

---

## Principle 3: Understandable

Information and operation of the UI must be understandable.

### 3.1 Readable

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 3.1.1 | Language of Page | A | `<html lang="en">` set |
| 3.1.2 | Language of Parts | AA | Language changes in content marked with `lang` attribute |

**Checklist:**
- [ ] `<html>` element has `lang` attribute (`lang="en"`, `lang="es"`, etc.)
- [ ] Inline foreign-language phrases wrapped with `lang` attribute

### 3.2 Predictable

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 3.2.1 | On Focus | A | Focusing an element doesn't trigger unexpected context change |
| 3.2.2 | On Input | A | Changing a setting doesn't auto-submit or navigate unexpectedly |
| 3.2.3 | Consistent Navigation | AA | Navigation repeated in same order across pages |
| 3.2.4 | Consistent Identification | AA | Components with same function identified consistently |
| 3.2.6 | Consistent Help | A | **[New in 2.2]** Help mechanisms (contact info, support link, chat) appear in the same relative location across pages |

**Checklist:**
- [ ] `onChange` on `<select>` doesn't immediately navigate without user confirmation
- [ ] Form submission requires explicit submit action
- [ ] Navigation components appear in consistent location across routes
- [ ] Same icon used for same function throughout app
- [ ] Help/support links appear in a consistent position on every page that includes them

### 3.3 Input Assistance

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 3.3.1 | Error Identification | A | Input errors described in text |
| 3.3.2 | Labels or Instructions | A | Labels and instructions provided for user input |
| 3.3.3 | Error Suggestion | AA | Suggestions provided for correcting input errors |
| 3.3.4 | Error Prevention | AA | Legal/financial/data submissions can be reviewed/corrected |
| 3.3.7 | Redundant Entry | A | **[New in 2.2]** Information already entered by the user is auto-populated or selectable when required again in the same session |
| 3.3.8 | Accessible Authentication (Minimum) | AA | **[New in 2.2]** Authentication does not rely solely on a cognitive function test (e.g. password recall, puzzle) unless an alternative or assist mechanism is provided |

**Checklist:**
- [ ] Validation errors show descriptive text (not just red border)
- [ ] Error message references the specific field
- [ ] Suggestions provided: "Enter a valid email like name@example.com"
- [ ] `aria-invalid="true"` set on invalid inputs
- [ ] `role="alert"` or `aria-live="assertive"` for error messages
- [ ] Multi-step forms pre-fill data already entered in earlier steps
- [ ] Login/signup flows don't use CAPTCHAs as the *only* authentication method

---

## Principle 4: Robust

Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

### 4.1 Compatible

> **Note:** 4.1.1 Parsing was present in WCAG 2.0 and 2.1 but was **removed in WCAG 2.2** as it is now considered obsolete given modern browser error-correction behaviour.

| # | Success Criterion | Level | Requirement |
|---|------------------|-------|-------------|
| 4.1.2 | Name, Role, Value | A | All UI components have accessible name, role, state/value |
| 4.1.3 | Status Messages | AA | Status messages programmatically determinable without receiving focus |

**Checklist:**
- [ ] No duplicate `id` attributes on a page
- [ ] No improper nesting (e.g., `<button>` inside `<button>`, `<div>` inside `<p>`)
- [ ] Custom interactive components have appropriate `role`
- [ ] Dynamic state reflected: `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`
- [ ] `aria-live` regions used for status updates ("3 items in cart", "Search results updated")
- [ ] `role="status"` for polite status messages
- [ ] `role="alert"` for urgent error messages

---

## Quick Reference: Common Tailwind Contrast Pairs

| Foreground | Background | Ratio | Normal Text | Large Text |
|-----------|-----------|-------|-------------|------------|
| `gray-900` | `white` | 19.5:1 | ✓ Pass | ✓ Pass |
| `gray-700` | `white` | 7.4:1 | ✓ Pass | ✓ Pass |
| `gray-600` | `white` | 5.9:1 | ✓ Pass | ✓ Pass |
| `gray-500` | `white` | 3.9:1 | ✗ Fail | ✓ Pass |
| `gray-400` | `white` | 2.6:1 | ✗ Fail | ✗ Fail |
| `blue-600` | `white` | 4.7:1 | ✓ Pass | ✓ Pass |
| `blue-500` | `white` | 3.0:1 | ✗ Fail | ✓ Pass |
| `red-600` | `white` | 5.0:1 | ✓ Pass | ✓ Pass |
| `red-500` | `white` | 3.4:1 | ✗ Fail | ✓ Pass |
| `white` | `blue-600` | 4.7:1 | ✓ Pass | ✓ Pass |
| `white` | `gray-600` | 5.9:1 | ✓ Pass | ✓ Pass |

> Ratios are approximate. Always verify with a dedicated contrast checker for custom colors.

---

## Sources

- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist) — last updated June 2024
- [W3C WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

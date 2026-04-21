# Common ARIA Patterns

Reference for the `accessibility-checker` skill. Shows correct and incorrect implementations for the most common interactive UI patterns.

---

## Pattern 1: Button

### Icon-only Button

```tsx
// CORRECT — action described via aria-label; icon hidden from AT
<button
  aria-label="Close dialog"
  onClick={onClose}
  className="rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <XIcon className="h-5 w-5" aria-hidden="true" />
</button>

// INCORRECT — no label; screen reader announces nothing useful
<button onClick={onClose}>
  <XIcon className="h-5 w-5" />
</button>
```

### Toggle Button

```tsx
// CORRECT — state exposed via aria-pressed
<button
  aria-pressed={isFavorited}
  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
  onClick={toggleFavorite}
>
  <HeartIcon aria-hidden="true" />
</button>

// INCORRECT — state only conveyed visually
<button onClick={toggleFavorite} className={isFavorited ? "text-red-500" : "text-gray-400"}>
  <HeartIcon />
</button>
```

### Loading Button

```tsx
// CORRECT — disabled state and loading communicated to AT
<button
  disabled={isSubmitting}
  aria-disabled={isSubmitting}
  aria-busy={isSubmitting}
  type="submit"
>
  {isSubmitting ? (
    <>
      <Spinner aria-hidden="true" />
      <span className="sr-only">Submitting…</span>
    </>
  ) : (
    "Submit"
  )}
</button>

// INCORRECT — spinner replaces text with no announcement
<button disabled={isSubmitting} type="submit">
  {isSubmitting ? <Spinner /> : "Submit"}
</button>
```

---

## Pattern 2: Modal / Dialog

### Full Dialog Pattern

```tsx
// CORRECT — focus managed, labelled, and escape handled
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus first focusable element when dialog opens
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    // Portal to body recommended to avoid stacking context issues
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={dialogRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div className="relative z-10 rounded-lg bg-white p-6 shadow-xl">
        <h2 id="dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        <button
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <XIcon aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
};

// INCORRECT — no role, no label, no keyboard handling, focus not managed
const BadModal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="rounded bg-white p-6">
        <h2>{title}</h2>
        <span onClick={onClose}>X</span>   {/* not a button, no keyboard access */}
        {children}
      </div>
    </div>
  );
};
```

### Alert Dialog (Confirmation)

```tsx
// CORRECT — alertdialog role for destructive confirmations
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="confirm-title"
  aria-describedby="confirm-desc"
>
  <h2 id="confirm-title">Delete account?</h2>
  <p id="confirm-desc">
    This action cannot be undone. All your data will be permanently deleted.
  </p>
  <button onClick={onConfirm}>Delete account</button>
  <button onClick={onCancel}>Cancel</button>
</div>
```

---

## Pattern 3: Navigation

### Primary Navigation

```tsx
// CORRECT — landmark role, current page indicated
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/" aria-current={currentPath === "/" ? "page" : undefined}>
        Home
      </a>
    </li>
    <li>
      <a href="/products" aria-current={currentPath === "/products" ? "page" : undefined}>
        Products
      </a>
    </li>
    <li>
      <a href="/cart" aria-current={currentPath === "/cart" ? "page" : undefined}>
        Cart
        {cartCount > 0 && (
          <span aria-label={`${cartCount} items`} className="ml-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
            {cartCount}
          </span>
        )}
      </a>
    </li>
  </ul>
</nav>

// INCORRECT — no landmark, no current indicator, badge not labelled
<div>
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/cart">
    Cart
    {cartCount > 0 && <span className="badge">{cartCount}</span>}
  </a>
</div>
```

### Breadcrumb

```tsx
// CORRECT — landmark, ordered list, current item marked
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li>
      <a href="/products/electronics" aria-current="page">Electronics</a>
    </li>
  </ol>
</nav>
```

### Skip Navigation

```tsx
// CORRECT — first focusable element on the page; visually hidden until focused
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
>
  Skip to main content
</a>

<main id="main-content" tabIndex={-1}>
  {/* page content */}
</main>
```

---

## Pattern 4: Form Elements

### Text Input with Error

```tsx
// CORRECT — label associated, error linked, state set
const EmailField = () => {
  const [error, setError] = useState("");

  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
        <span aria-hidden="true" className="ml-1 text-red-500">*</span>
        <span className="sr-only"> (required)</span>
      </label>
      <input
        id="email"
        type="email"
        name="email"
        autoComplete="email"
        aria-required="true"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "email-error" : "email-hint"}
        className={`mt-1 block w-full rounded border ${
          error ? "border-red-500" : "border-gray-300"
        } px-3 py-2`}
      />
      <p id="email-hint" className="mt-1 text-sm text-gray-500">
        We'll never share your email.
      </p>
      {error && (
        <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// INCORRECT — no label, error is only visual
<div>
  <input type="email" className={error ? "border-red-500" : "border-gray-300"} />
  {error && <span className="text-red-500">{error}</span>}
</div>
```

### Radio Group

```tsx
// CORRECT — fieldset/legend groups related controls
<fieldset>
  <legend className="text-sm font-medium text-gray-700">Shipping method</legend>
  <div className="mt-2 space-y-2">
    <label className="flex items-center gap-2">
      <input type="radio" name="shipping" value="standard" defaultChecked />
      Standard (5–7 days) — Free
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="shipping" value="express" />
      Express (2–3 days) — $9.99
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="shipping" value="overnight" />
      Overnight — $24.99
    </label>
  </div>
</fieldset>

// INCORRECT — no grouping, labels not associated
<div>
  <p>Shipping method</p>
  <div><input type="radio" name="s" value="standard" /> Standard</div>
  <div><input type="radio" name="s" value="express" /> Express</div>
</div>
```

### Select / Combobox

```tsx
// CORRECT — native select (preferred over custom combobox when possible)
<div>
  <label htmlFor="country">Country</label>
  <select id="country" name="country" autoComplete="country-name">
    <option value="">Select a country…</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="gb">United Kingdom</option>
  </select>
</div>

// CORRECT — custom combobox (only when native select is insufficient)
<div>
  <label id="country-label">Country</label>
  <div
    role="combobox"
    aria-labelledby="country-label"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="country-listbox"
    tabIndex={0}
    onKeyDown={handleKeyDown}
  >
    {selectedCountry || "Select a country…"}
  </div>
  {isOpen && (
    <ul
      id="country-listbox"
      role="listbox"
      aria-labelledby="country-label"
    >
      {countries.map((country) => (
        <li
          key={country.value}
          role="option"
          aria-selected={selectedCountry === country.value}
          onClick={() => selectCountry(country)}
        >
          {country.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

---

## Pattern 5: Live Regions & Status

### Cart Count Update

```tsx
// CORRECT — polite live region announces cart changes without interrupting
const CartStatus = ({ count }: { count: number }) => (
  <>
    {/* Visible badge */}
    <span aria-hidden="true" className="rounded-full bg-red-500 px-1.5 text-xs text-white">
      {count}
    </span>
    {/* Screen reader announcement */}
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {count === 0 ? "Cart is empty" : `${count} item${count !== 1 ? "s" : ""} in cart`}
    </span>
  </>
);
```

### Loading State

```tsx
// CORRECT — status announced; spinner hidden from AT
const LoadingState = ({ isLoading }: { isLoading: boolean }) => (
  <div aria-live="polite" aria-busy={isLoading}>
    {isLoading ? (
      <>
        <Spinner aria-hidden="true" />
        <span className="sr-only">Loading products…</span>
      </>
    ) : (
      <ProductList />
    )}
  </div>
);
```

### Form Submission Result

```tsx
// CORRECT — success and error results both announced
const SubmitResult = ({ status }: { status: "idle" | "success" | "error" }) => (
  <>
    {status === "success" && (
      <div role="status" aria-live="polite" className="text-green-700">
        Your order has been placed successfully.
      </div>
    )}
    {status === "error" && (
      <div role="alert" className="text-red-700">
        Something went wrong. Please try again.
      </div>
    )}
  </>
);
```

---

## Pattern 6: Tabs

```tsx
// CORRECT — full tab pattern with keyboard navigation
const Tabs = ({ tabs }: { tabs: Tab[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") setActiveTab((i) => Math.min(i + 1, tabs.length - 1));
    if (e.key === "ArrowLeft") setActiveTab((i) => Math.max(i - 1, 0));
    if (e.key === "Home") setActiveTab(0);
    if (e.key === "End") setActiveTab(tabs.length - 1);
  };

  return (
    <div>
      <div role="tablist" aria-label="Product details">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== index}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
```

---

## Pattern 7: Tooltip

```tsx
// CORRECT — tooltip linked to trigger via aria-describedby
const TooltipButton = ({ label, tip, onClick }: TooltipButtonProps) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative inline-block">
      <button
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={onClick}
      >
        {label}
      </button>
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-sm text-white"
        >
          {tip}
        </div>
      )}
    </div>
  );
};

// INCORRECT — tooltip on title attribute only (not announced reliably)
<button title="This action cannot be undone">Delete</button>
```

---

## Pattern 8: Accordion

```tsx
// CORRECT — expanded state, panel associated to trigger
const AccordionItem = ({ id, heading, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h3>
        <button
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          id={`btn-${id}`}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          {heading}
          <ChevronIcon
            aria-hidden="true"
            className={isOpen ? "rotate-180 transition" : "transition"}
          />
        </button>
      </h3>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`btn-${id}`}
        hidden={!isOpen}
        className="px-4 pb-4"
      >
        {children}
      </div>
    </div>
  );
};
```

---

## Summary: Required ARIA Attributes by Pattern

| Pattern | Key attributes |
|---------|---------------|
| Icon button | `aria-label` on `<button>`, `aria-hidden="true"` on icon |
| Toggle button | `aria-pressed` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Alert dialog | `role="alertdialog"`, `aria-labelledby`, `aria-describedby` |
| Nav current page | `aria-current="page"` |
| Text input error | `aria-invalid`, `aria-describedby` on error element |
| Radio group | `<fieldset>` + `<legend>` |
| Custom combobox | `role="combobox"`, `aria-expanded`, `aria-controls` |
| Live status | `aria-live="polite"`, `role="status"` |
| Live error | `aria-live="assertive"`, `role="alert"` |
| Tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby` |
| Tooltip | `role="tooltip"`, `aria-describedby` on trigger |
| Accordion | `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` |

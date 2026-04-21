---
name: bundle-analyzer
description: Analyzes bundle size and dependency weight for this React/Vite project. Use when asked to "analyze bundle", "check bundle size", "optimize dependencies", "reduce bundle", "find heavy packages", "performance audit", or "why is my bundle large". Runs scripts/bundle-analyzer.ts against package.json. Does NOT apply to backend code, API endpoints, or runtime performance (FPS, re-renders).
argument-hint: "[path/to/package.json] [--threshold=KB]"
---

# Bundle Analyzer

Analyze bundle size and dependency weight for `$ARGUMENTS`.

Parse `$ARGUMENTS` as: optional path to `package.json` (default: `./package.json`) and optional `--threshold=<KB>` flag (default: 100KB).

---

## When This Skill Applies

Activate for:
- "analyze bundle", "bundle size", "reduce bundle", "optimize dependencies"
- "find heavy packages", "why is my build large", "performance audit"
- Before shipping a feature that adds new npm dependencies
- After `npm install` adds packages that seem large

Skip for:
- Runtime performance issues (slow re-renders, high FPS, memory leaks)
- Backend/API code with no client-side output
- Build pipeline or CI configuration questions

---

## Running the Script

The script uses the [bundlephobia](https://bundlephobia.com) public API — no API key or extra dependencies required. It requires only Node.js 22.6+ (already available in this project).

```bash
# Analyze the project's own package.json
node --experimental-strip-types .claude/skills/bundle-analyzer/scripts/bundle-analyzer.ts

# Analyze a different package.json
node --experimental-strip-types .claude/skills/bundle-analyzer/scripts/bundle-analyzer.ts ./apps/web/package.json

# Change the "heavy" threshold to 50KB
node --experimental-strip-types .claude/skills/bundle-analyzer/scripts/bundle-analyzer.ts --threshold=50

# Combine: specific file + custom threshold
node --experimental-strip-types .claude/skills/bundle-analyzer/scripts/bundle-analyzer.ts ./package.json --threshold=75
```

Progress messages are written to **stderr**; JSON report is written to **stdout**.

To capture only the JSON report to a file:

```bash
node --experimental-strip-types .claude/skills/bundle-analyzer/scripts/bundle-analyzer.ts > bundle-report.txt
```

---

## What the Script Does

1. **Reads `package.json`** — collects keys from `dependencies` and `peerDependencies` only (`devDependencies` are excluded — they don't ship to the browser)
2. **Queries bundlephobia** for each package's minified + gzipped size (concurrency: 5 requests at a time)
3. **Flags heavy packages** — any package whose minified size exceeds the threshold (default 100KB)
4. **Generates recommendations** — known lighter alternatives and structural suggestions
5. **Outputs JSON** — machine-readable report with all findings

---

## Output Format

```json
{
  "package_json": "/abs/path/to/package.json",
  "total_dependencies": 42,
  "total_size": "4.2MB",
  "threshold_kb": 100,
  "heavy_packages": [
    {
      "name": "moment",
      "version": "2.30.1",
      "size": "329.2KB",
      "size_gzip": "72.1KB"
    },
    {
      "name": "lodash",
      "version": "4.17.21",
      "size": "531.0KB",
      "size_gzip": "96.8KB"
    }
  ],
  "recommendations": [
    "Replace moment (~330KB) with date-fns (modular, tree-shakable) or dayjs (~2KB)",
    "Replace lodash (~530KB) with lodash-es or individual imports: import merge from \"lodash/merge\"",
    "Add rollup-plugin-visualizer (Vite) or webpack-bundle-analyzer for visual bundle inspection"
  ],
  "failed_lookups": [
    { "name": "@internal/shared", "reason": "not found on bundlephobia (private or non-JS package)" }
  ]
}
```

**Fields:**

| Field | Description |
|-------|-------------|
| `total_dependencies` | Count of packages analyzed (from `dependencies` + `peerDependencies` only) |
| `total_size` | Sum of minified sizes for all successfully resolved packages |
| `heavy_packages` | Packages exceeding the threshold, sorted largest-first |
| `size` | Minified size (uncompressed — what the browser parses) |
| `size_gzip` | Gzipped size (what travels over the network) |
| `recommendations` | Actionable suggestions based on detected packages |
| `failed_lookups` | Packages skipped (private, non-JS, or API timeout) |

---

## Interpreting Results

### Total Size Benchmarks

| Total Size | Assessment |
|------------|------------|
| < 500KB | Excellent — lean dependency tree |
| 500KB – 1.5MB | Good — monitor growth |
| 1.5MB – 3MB | Warning — investigate heavy packages |
| > 3MB | Critical — bundle likely hurts TTI |

> These are minified (uncompressed) totals. Actual network transfer is gzip size (~3–5× smaller). The project's performance targets are FCP < 1.5s and TTI < 3.5s — bundle size directly affects TTI.

### Common Heavy Packages and Fixes

| Package | Typical Size | Fix |
|---------|-------------|-----|
| `moment` | 330KB | Migrate to `date-fns` or `dayjs` |
| `lodash` | 531KB | Use `lodash-es` + tree-shaking, or per-function imports |
| `@mui/material` | 500KB+ | Import per-component: `import Button from "@mui/material/Button"` |
| `antd` | 2MB+ | Configure `babel-plugin-import` for tree-shaking |
| `rxjs` | 200KB+ | Import operators individually from `rxjs/operators` |
| `highlight.js` | 900KB+ | Register only needed languages via `hljs.registerLanguage()` |

---

## Recommended Workflow

1. **Run the script** to get the baseline JSON report
2. **Identify the top 3 heavy packages** in `heavy_packages`
3. **Cross-reference recommendations** for each flagged package
4. **Check if the package is in `devDependencies`** — dev-only packages don't affect the production bundle
5. **Apply the fix** (swap library, configure tree-shaking, add dynamic import)
6. **Re-run** to verify the size went down

### Adding Visual Analysis (Vite)

For a treemap visualization, add `rollup-plugin-visualizer` to the project:

```bash
npm install --save-dev rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
});
```

Run `npm run build` — the visualizer opens a browser treemap automatically.

---

## Code-Splitting Strategy

When a heavy package cannot be replaced, defer its load with `React.lazy`:

```tsx
// Before — eagerly loaded, blocks initial render
import { HeavyChart } from 'chart.js-wrapper';

// After — loaded only when component enters the viewport
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Treating `devDependencies` as production bundle weight | Dev-only packages are excluded from the production bundle — focus on `dependencies` |
| Importing the entire library (`import _ from 'lodash'`) | Use named imports or per-function paths: `import merge from 'lodash/merge'` |
| Ignoring `size_gzip` in favor of raw `size` | Network transfer cost is the gzip size; use raw size to estimate parse/execute cost |
| Replacing a package before confirming it's in `dependencies` | Verify the package isn't dev-only before spending effort on a swap |
| Skipping `failed_lookups` | Private or scoped packages listed there may still be large — audit manually |
| Adding `rollup-plugin-visualizer` to `dependencies` | Install it in `devDependencies` only — it's a build-time tool |
| Lazy-loading a small package with `React.lazy` | Code-splitting adds a network round-trip; only split packages that are genuinely large or conditionally needed |

---

## Error Handling

| Situation | Script Behavior |
|-----------|----------------|
| `package.json` not found | Exits with JSON `{ "error": "..." }` and non-zero exit code |
| Invalid JSON in `package.json` | Exits with JSON `{ "error": "..." }` and non-zero exit code |
| Package not on bundlephobia | Listed in `failed_lookups` — analysis continues for remaining packages |
| Network timeout (10s per package) | Listed in `failed_lookups` with reason `"timeout"` |
| Zero dependencies | Returns report with `total_size: "0B"` and a note |

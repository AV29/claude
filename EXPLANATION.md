# Design Explanation

## Why these three plugins?

The three plugins operate at different layers of the development experience and have different installation audiences — which is exactly why they're separate.

`documentation` is a universal utility: any project in any language benefits from fast library lookups. `web-dev` is project-type specific: its rules only make sense on a React/TypeScript frontend — installing it on a backend service would be noise. `ambient` is developer-preference specific: sound feedback and commit conventions are personal workflow choices, independent of the tech stack.

One giant plugin would force a backend developer to install MUI component conventions. Ten small plugins would fragment tightly related rules — splitting `create-component` from `write-unit-tests` or `clean-typescript` would mean partial installs that leave gaps. The three-plugin split maps naturally to: "what you're looking up", "what project you're on", and "how you like to work".

## Why these components in each plugin?

- **`documentation`**: The `/lookup` command, `docs-explorer` agent, and Context7 MCP server all exist to answer one question — "what does this library's API look like right now?" The MCP provides live data, the agent orchestrates parallel lookups across sources, and the command is the entry point. None of the three is useful without the others.

- **`web-dev`**: Skills only — because the plugin is a knowledge base, not an automation. There's nothing to execute autonomously; the value is in Claude applying these rules while writing or reviewing code. Skills are the right primitive for "when working on this codebase, always follow these conventions." The `hooks.json` (TypeScript compile check on Stop) is the one exception: it's a passive safety net, not an interactive tool.

- **`ambient`**: Hooks and one skill — all components serve the same goal: reduce friction in the development loop without requiring any deliberate action. Hooks fire automatically. The `conventional-commits` skill is included here rather than in `web-dev` because commit conventions are stack-agnostic; they belong with the developer-workflow plugin, not the React-specific one.

## Versioning — what would you bump?

**Patch (1.0.0 → 1.0.1):** Fix a typo in a skill, correct a broken reference link, update a wrong sound file path, add a missing package to the bundle-analyzer alternatives table.

**Minor (1.0.0 → 1.1.0):** Add a new skill to `web-dev` (e.g., `data-fetching`, `forms`), add a new hook event to `ambient`, add a new command to `documentation`.

**Major (1.0.0 → 2.0.0):** Change `web-dev` conventions in a way that conflicts with existing code (e.g., migrating from MUI to a different component library), remove a component, or change hook behavior that could silently alter existing workflows (e.g., making the destructive-command hook blocking instead of async).

## What's missing?

**`documentation`:** A caching layer — the same library shouldn't re-fetch from Context7 every session. A short-lived local cache (session-scoped or file-backed) would make repeated lookups instant.

**`web-dev`:** Two skills that are conspicuously absent: `data-fetching` (TanStack Query patterns — cache keys, mutations, optimistic updates) and `forms` (React Hook Form + Zod validation, accessible error states). Both are referenced implicitly by existing skills but never defined.

**`ambient`:** Cross-platform support — `afplay` and `osascript` are macOS-only. A v2 would detect the OS and fall back to `paplay` (Linux) or PowerShell toast notifications (Windows). A `/mute-ambient` toggle command to silence hooks during focused work sessions would also be useful.

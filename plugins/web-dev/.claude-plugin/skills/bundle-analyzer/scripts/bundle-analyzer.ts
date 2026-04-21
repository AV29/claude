#!/usr/bin/env node
/**
 * bundle-analyzer.ts
 *
 * Analyzes package.json dependencies using the bundlephobia public API.
 * Identifies heavy packages and outputs JSON with actionable recommendations.
 *
 * Usage:
 *   node --experimental-strip-types bundle-analyzer.ts [path/to/package.json] [--threshold=<KB>]
 *
 * Options:
 *   path/to/package.json   Path to package.json (default: ./package.json)
 *   --threshold=<KB>       Flag packages over this size as heavy (default: 100)
 *
 * Output: JSON to stdout. Progress messages go to stdout via console.log.
 */

import fs from 'fs';
import path from 'path';

const CONCURRENCY = 5;
const TIMEOUT_MS = 10_000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PackageSuccess {
  name: string;
  resolvedVersion: string;
  sizeBytes: number;
  gzipBytes: number;
}

interface PackageFailure {
  name: string;
  error: string;
}

type PackageResult = PackageSuccess | PackageFailure;

interface AnalyzeOptions {
  pkgPath: string;
  thresholdKB: number;
}

interface BundlephobiaResponse {
  version: string;
  size: number;
  gzip: number;
}

// ─── Known heavy packages and lighter alternatives ────────────────────────────

const KNOWN_ALTERNATIVES: Record<string, string> = {
  moment: 'Replace moment (~330KB) with date-fns (modular, tree-shakable) or dayjs (~2KB)',
  lodash: 'Replace lodash (~530KB) with lodash-es or individual imports: import merge from "lodash/merge"',
  'lodash-es': 'lodash-es is tree-shakable — ensure your bundler is configured for ESM tree-shaking',
  jquery: 'Replace jQuery (~90KB) with native DOM APIs or cash-dom (~6KB)',
  bootstrap: 'Replace Bootstrap (~230KB) with Tailwind CSS utility classes (zero runtime CSS-in-JS)',
  '@material-ui/core': 'Import MUI components directly: import Button from "@mui/material/Button" instead of barrel',
  '@mui/material': 'Import MUI components directly: import Button from "@mui/material/Button" instead of barrel',
  antd: 'Use babel-plugin-import or antd tree-shaking guide to avoid importing full bundle',
  rxjs: 'Import RxJS operators individually: import { map } from "rxjs/operators" — avoid importing rxjs directly',
  axios: 'Consider native fetch for simple GET/POST requests (saves ~13KB gzipped); keep axios for complex interceptor needs',
  'chart.js': 'Register only the Chart.js components you use — see Chart.js tree-shaking docs',
  three: 'Import Three.js modules directly: import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"',
  'highlight.js': 'Import only required languages: import hljs from "highlight.js/lib/core" + registerLanguage()',
  'core-js': 'Configure @babel/preset-env targets to reduce polyfill scope; use useBuiltIns: "usage"',
  'react-bootstrap': 'Import individual components: import Button from "react-bootstrap/Button"',
  'styled-components': 'Ensure Babel plugin is configured for styled-components; consider Tailwind CSS for static styles',
  '@emotion/react': 'Emotion is necessary for MUI — ensure MUI version ≥ 5 for improved tree-shaking',
  ramda: 'Import ramda functions individually: import map from "ramda/src/map" (tree-shakable)',
};

const VISUALIZER_PACKAGES = ['webpack-bundle-analyzer', 'rollup-plugin-visualizer', 'vite-bundle-visualizer'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fatalError(stderrMsg: string, jsonMsg: string): never {
  console.error(`Error: ${stderrMsg}`);
  console.log(JSON.stringify({ error: jsonMsg }, null, 2));
  process.exit(1);
  return undefined as never;
}

function isSuccess(r: PackageResult): r is PackageSuccess {
  return !('error' in r);
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${bytes}B`;
}

/**
 * Strips semver range operators and extracts a concrete version string.
 * Returns just the package name if version is a wildcard, file:, or git ref.
 */
function resolvePackageSpec(name: string, rawVersion: string | undefined): string {
  if (!rawVersion) return name;
  if (
    rawVersion.startsWith('file:') ||
    rawVersion.startsWith('git') ||
    rawVersion === '*' ||
    rawVersion === ''
  ) {
    return name;
  }
  const clean = rawVersion.replace(/[\^~>=<\s]/g, '').split('||')[0].split(' ')[0];
  return clean ? `${name}@${clean}` : name;
}

/**
 * Runs async tasks with a bounded concurrency limit to avoid hammering the API.
 */
async function withConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < tasks.length) {
      const idx = cursor++;
      results[idx] = await tasks[idx]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// ─── Bundlephobia API ─────────────────────────────────────────────────────────

async function fetchPackageSize(name: string, rawVersion: string | undefined): Promise<PackageResult> {
  const spec = resolvePackageSpec(name, rawVersion);
  const url = `https://bundlephobia.com/api/size?package=${encodeURIComponent(spec)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'bundle-analyzer-skill/1.0' },
      signal: controller.signal,
    });

    if (res.status === 404) throw new Error('not found on bundlephobia (private or non-JS package)');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as BundlephobiaResponse;
    return { name, resolvedVersion: data.version, sizeBytes: data.size, gzipBytes: data.gzip };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { name, error: err.name === 'AbortError' ? 'timeout' : err.message };
    }
    return { name, error: String(err) };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

async function analyze({ pkgPath, thresholdKB }: AnalyzeOptions): Promise<void> {
  const resolvedPath = path.resolve(pkgPath);

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    fatalError(
      `Failed to read package.json at ${resolvedPath} — ${message}`,
      `Failed to read package.json: ${message}`
    );
  }

  const allDeps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string>),
    ...(pkg.peerDependencies as Record<string, string>),
  };

  const allDevDeps: Record<string, string> = {
    ...(pkg.devDependencies as Record<string, string>),
  };

  const depEntries = Object.entries(allDeps);
  const totalDependencies = depEntries.length;
  const thresholdBytes = thresholdKB * 1024;

  if (totalDependencies === 0) {
    console.log(JSON.stringify({
      package_json: resolvedPath,
      total_dependencies: 0,
      total_size: '0B',
      heavy_packages: [],
      recommendations: ['No dependencies found in package.json'],
    }, null, 2));
    return;
  }

  console.error(`Analyzing ${totalDependencies} packages via bundlephobia (threshold: ${thresholdKB}KB)...`);

  const tasks = depEntries.map(([name, version]) => () => fetchPackageSize(name, version));
  const results = await withConcurrency(tasks, CONCURRENCY);

  const successful: PackageSuccess[] = [];
  const failed: PackageFailure[] = [];
  let totalSizeBytes = 0;

  for (const r of results) {
    if (isSuccess(r)) {
      successful.push(r);
      totalSizeBytes += r.sizeBytes;
    } else {
      failed.push(r);
    }
  }

  console.error(`Done. ${successful.length} packages resolved, ${failed.length} failed.`);

  const heavyPackages = successful
    .filter((r) => r.sizeBytes >= thresholdBytes)
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .map((r) => ({
      name: r.name,
      version: r.resolvedVersion,
      size: formatBytes(r.sizeBytes),
      size_gzip: formatBytes(r.gzipBytes),
    }));

  const recommendations = new Set<string>();

  for (const heavyPkg of heavyPackages) {
    if (KNOWN_ALTERNATIVES[heavyPkg.name]) {
      recommendations.add(KNOWN_ALTERNATIVES[heavyPkg.name]);
    }
  }

  if (heavyPackages.length > 3) {
    recommendations.add(
      'Consider code-splitting with React.lazy() + Suspense to defer loading of large dependencies'
    );
  }
  if (!VISUALIZER_PACKAGES.some((d) => allDeps[d] || allDevDeps[d])) {
    recommendations.add(
      'Add rollup-plugin-visualizer (Vite) or webpack-bundle-analyzer for visual bundle inspection'
    );
  }
  if (allDeps['moment'] && !allDeps['date-fns'] && !allDeps['dayjs']) {
    recommendations.add('moment is detected — migrate to date-fns or dayjs for significant bundle savings');
  }
  if (allDeps['lodash'] && !allDeps['lodash-es']) {
    recommendations.add('lodash detected — switch to lodash-es or per-function imports for tree-shaking support');
  }
  if (totalSizeBytes > 2 * 1024 * 1024) {
    recommendations.add(
      'Total dependency footprint exceeds 2MB — audit with vite-bundle-visualizer and apply dynamic imports'
    );
  }

  const output: Record<string, unknown> = {
    package_json: resolvedPath,
    total_dependencies: totalDependencies,
    total_size: formatBytes(totalSizeBytes),
    threshold_kb: thresholdKB,
    heavy_packages: heavyPackages,
    recommendations: [...recommendations],
  };

  if (failed.length > 0) {
    output.failed_lookups = failed.map((r) => ({ name: r.name, reason: r.error }));
  }

  console.log(JSON.stringify(output, null, 2));
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let pkgPath = './package.json';
let thresholdKB = 100;

for (const arg of args) {
  if (arg.startsWith('--threshold=')) {
    const val = parseInt(arg.split('=')[1], 10);
    if (!isNaN(val) && val > 0) thresholdKB = val;
  } else if (!arg.startsWith('--')) {
    pkgPath = arg;
  }
}

analyze({ pkgPath, thresholdKB }).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Unexpected error: ${message}`);
  console.log(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});

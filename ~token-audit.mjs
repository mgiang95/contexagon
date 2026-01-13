#!/usr/bin/env node
/**
 * token-audit.mjs
 * Usage:
 *   node token-audit.mjs <path-to-css-root> [--json report.json]
 *
 * What it does:
 *   - Collects defined CSS custom properties (tokens) and their files
 *   - Collects used tokens via var(--token) references
 *   - Reports:
 *       * Used-but-undefined tokens (global + per-prefix)
 *       * Files in /components that reference --p-* (forbidden)
 *       * Files in /semantics that reference --c-* (forbidden)
 *   - Optional: write JSON report
 */
import fs from 'fs';
import path from 'path';

const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;

const IGNORE_DIRS = new Set(['.git','node_modules','.next','dist','build','coverage']);

const cssFiles = [];
walk(rootDir);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (IGNORE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name.endsWith('.css')) cssFiles.push(full);
  }
}

const defined = new Map(); // token -> Set(files)
const used = new Map();    // token -> Set({file:..., line:...})
const violations = {
  componentsUsePrimitives: [], // {file, line, match}
  semanticsUseComponents: [],  // {file, line, match}
};

const defRe = /--[a-zA-Z0-9_-]+(?=\s*:)/g;
const useRe = /var\(\s*(--[a-zA-Z0-9_-]+)/g;

for (const file of cssFiles) {
  const text = fs.readFileSync(file, 'utf8');
  // Definitions
  const defs = text.match(defRe) || [];
  for (const d of defs) {
    if (!defined.has(d)) defined.set(d, new Set());
    defined.get(d).add(file);
  }
  // Usages with line numbers
  const lines = text.split(/\r?\n/);
  lines.forEach((lineText, i) => {
    const m = lineText.matchAll(useRe);
    for (const mm of m) {
      const token = mm[1];
      if (!used.has(token)) used.set(token, new Set());
      used.get(token).add(JSON.stringify({ file, line: i + 1, match: mm[0] }));

      // Policy checks
      const lower = file.toLowerCase();
      if (/(component|components)/.test(lower) && token.startsWith('--p-')) {
        violations.componentsUsePrimitives.push({ file, line: i + 1, match: mm[0] });
      }
      if (/(semantic|semantics|token-semantics)/.test(lower) && token.startsWith('--c-')) {
        violations.semanticsUseComponents.push({ file, line: i + 1, match: mm[0] });
      }
    }
  });
}

// Reports
const definedSet = new Set(defined.keys());
const usedSet = new Set(used.keys());

const usedButUndefined = [...usedSet].filter(t => !definedSet.has(t));
const byPrefix = (arr, prefix) => arr.filter(t => t.startsWith(prefix));

const report = {
  scannedFiles: cssFiles.length,
  tokens: {
    definedCount: definedSet.size,
    usedCount: usedSet.size,
  },
  usedButUndefined: {
    all: usedButUndefined,
    primitives: byPrefix(usedButUndefined, '--p-'),
    semantics: byPrefix(usedButUndefined, '--s-'),
    components: byPrefix(usedButUndefined, '--c-'),
  },
  violations: {
    componentsUsePrimitives: violations.componentsUsePrimitives,
    semanticsUseComponents: violations.semanticsUseComponents,
  },
  samples: {
    undefinedUsages: Object.fromEntries(
      usedButUndefined.slice(0, 20).map(t => [
        t,
        [...(used.get(t) || [])].slice(0, 5).map(s => JSON.parse(s)),
      ])
    ),
  },
};

// Pretty print
function printSection(title) {
  console.log('\n' + title);
  console.log('-'.repeat(title.length));
}
console.log(`Scanned ${cssFiles.length} CSS files in: ${rootDir}`);

printSection('Defined tokens');
console.log(`Total: ${definedSet.size}`);

printSection('Used tokens');
console.log(`Total: ${usedSet.size}`);

printSection('USED BUT UNDEFINED tokens (top-level)');
if (usedButUndefined.length === 0) console.log('✅ None');
else console.log(usedButUndefined.join('\n'));

printSection('Violations: Components using --p-*');
if (report.violations.componentsUsePrimitives.length === 0) console.log('✅ None');
else {
  for (const v of report.violations.componentsUsePrimitives) {
    console.log(`${v.file}:${v.line}  ${v.match}`);
  }
}

printSection('Violations: Semantics using --c-*');
if (report.violations.semanticsUseComponents.length === 0) console.log('✅ None');
else {
  for (const v of report.violations.semanticsUseComponents) {
    console.log(`${v.file}:${v.line}  ${v.match}`);
  }
}

if (jsonOut) {
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nJSON report written to ${path.resolve(jsonOut)}`);
}

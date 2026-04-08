#!/usr/bin/env node
/**
 * Test Suite Generator
 *
 * Scans React/TypeScript components and generates Jest + React Testing Library
 * test stubs with proper structure, accessibility tests, and common patterns.
 *
 * Usage:
 *   node test_suite_generator.mjs src/components/ --output testing/unit/
 *   node test_suite_generator.mjs src/ --include-a11y --scan-only
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, basename, extname, dirname, relative } from 'path';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { output: null, includeA11y: false, scanOnly: false, verbose: false, json: false };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--output' || a === '-o') { args.output = argv[++i]; }
    else if (a.startsWith('--output=')) { args.output = a.split('=')[1]; }
    else if (a === '--include-a11y') { args.includeA11y = true; }
    else if (a === '--scan-only') { args.scanOnly = true; }
    else if (a === '--verbose' || a === '-v') { args.verbose = true; }
    else if (a === '--json') { args.json = true; }
    else if (!a.startsWith('-')) { positional.push(a); }
  }

  if (!positional[0]) {
    console.error('Usage: node test_suite_generator.mjs <source-dir> [options]');
    process.exit(1);
  }
  args.source = positional[0];
  return args;
}

// ---------------------------------------------------------------------------
// Component scanner (regex-based, no AST)
// ---------------------------------------------------------------------------

const FUNCTIONAL_RE = /^(?:export\s+)?(?:const|function)\s+([A-Z][a-zA-Z0-9]*)\s*[=:]?\s*(?:\([^)]*\)\s*(?::\s*[^=]+)?\s*=>|function\s*\()/m;
const ARROW_RE = /^(?:export\s+)?const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*(?:React\.)?(?:memo|forwardRef)?\s*\(/m;
const CLASS_RE = /^(?:export\s+)?class\s+([A-Z][a-zA-Z0-9]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)/m;
const HOOK_RE = /use([A-Z][a-zA-Z0-9]*)\s*\(/g;
const PROPS_RE = /{\s*([^}]+)\s*}\s*=\s*props|:\s*([A-Z][a-zA-Z0-9]*Props)/;
const CONTEXT_RE = /useContext\s*\(|\.Provider|\.Consumer/;
const EFFECT_RE = /useEffect\s*\(|useLayoutEffect\s*\(/;
const STATE_RE = /useState\s*\(|useReducer\s*\(|this\.state/;
const CALLBACK_RE = /on[A-Z][a-zA-Z]*\s*[=:]|handle[A-Z][a-zA-Z]*\s*[=:]/;
const IMPORT_RE = /import\s+(?:{[^}]+}|[^\s;]+)\s+from\s+['"]([^'"]+)['"]/g;
const EXPORT_RE = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;

const SRC_EXTS = new Set(['.tsx', '.jsx', '.ts', '.js']);
const SKIP_DIRS = new Set(['node_modules', '__tests__', 'test', 'tests', '.git', '.next', 'dist', 'build']);

function extractHooks(content) {
  const hooks = new Set();
  for (const m of content.matchAll(HOOK_RE)) hooks.add(m[1]);
  return [...hooks].slice(0, 10);
}

function extractProps(content) {
  const m = PROPS_RE.exec(content);
  if (!m) return [];
  const raw = m[1] || '';
  return raw.split(',').map(p => p.trim().split(':')[0].trim()).filter(Boolean).slice(0, 10);
}

function extractImports(content) {
  const imp = [];
  for (const m of content.matchAll(IMPORT_RE)) imp.push(m[1]);
  return imp.slice(0, 10);
}

function extractExports(content) {
  const exp = [];
  for (const m of content.matchAll(EXPORT_RE)) exp.push(m[1]);
  return exp.slice(0, 5);
}

function scanFiles(dirPath, verbose) {
  const components = [];
  const seen = new Set();

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!SRC_EXTS.has(extname(entry.name))) continue;
      if (entry.name.includes('.test.') || entry.name.includes('.spec.')) continue;

      let content;
      try { content = readFileSync(full, 'utf8'); } catch { continue; }

      // Skip files without JSX or hooks
      if (!content.includes('return') || (!content.includes('<') && !content.toLowerCase().includes('jsx'))) {
        if (!HOOK_RE.test(content)) continue;
      }

      const hooks = extractHooks(content);
      const props = extractProps(content);
      const imports = extractImports(content);
      const exports = extractExports(content);
      const hasContext = CONTEXT_RE.test(content);
      const hasEffects = EFFECT_RE.test(content);
      const hasState = STATE_RE.test(content);
      const hasCallbacks = CALLBACK_RE.test(content);

      const addComponent = (name, type) => {
        const key = `${name}::${full}`;
        if (seen.has(key)) return;
        seen.add(key);
        components.push({ name, filePath: full, componentType: type, hasProps: props.length > 0 || content.toLowerCase().includes('props'), props, hasHooks: hooks, hasContext, hasEffects, hasState, hasCallbacks, exports, imports });
        if (verbose) console.error(`  Found: ${name} (${type}) in ${entry.name}`);
      };

      for (const m of content.matchAll(new RegExp(FUNCTIONAL_RE.source, 'gm'))) addComponent(m[1], 'functional');
      for (const m of content.matchAll(new RegExp(ARROW_RE.source, 'gm'))) {
        const type = content.includes('memo(') ? 'memo' : content.includes('forwardRef(') ? 'forwardRef' : 'functional';
        addComponent(m[1], type);
      }
      for (const m of content.matchAll(new RegExp(CLASS_RE.source, 'gm'))) addComponent(m[1], 'class');
    }
  }

  walk(dirPath);
  return components;
}

// ---------------------------------------------------------------------------
// Test file generator
// ---------------------------------------------------------------------------

function relativeImport(componentFilePath, outputPath) {
  // Compute import path from the generated test file to the component
  const stem = basename(componentFilePath, extname(componentFilePath));
  const compDir = dirname(componentFilePath);
  // We'll generate test in outputPath/<ComponentName>.test.tsx
  // The relative path from test to component:
  let rel = relative(resolve(outputPath), componentFilePath).replace(/\\/g, '/');
  // Remove extension for import
  rel = rel.replace(/\.(tsx?|jsx?)$/, '');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

function generateTestFile(component, outputPath, includeA11y) {
  const { name, filePath, hasProps, props, hasCallbacks, hasState, hasEffects } = component;
  const importPath = relativeImport(filePath, outputPath);

  const imports = new Set([
    `import '@testing-library/jest-dom';`,
    `import { render, screen } from '@testing-library/react';`,
    `import { ${name} } from '${importPath}';`,
  ]);

  if (hasCallbacks) imports.add(`import userEvent from '@testing-library/user-event';`);
  if (hasState || hasEffects) imports.add(`import { waitFor } from '@testing-library/react';`);
  if (includeA11y) {
    imports.add(`import { axe, toHaveNoViolations } from 'jest-axe';`);
  }

  const propsStr = hasProps ? ' {...mockProps}' : '';
  const lines = [...imports].sort(), body = [];

  lines.push('');
  if (includeA11y) { lines.push('expect.extend(toHaveNoViolations);', ''); }
  if (hasProps) { lines.push('// TODO: Define mock props', `const mockProps = {};`, ''); }
  lines.push(`describe('${name}', () => {`);

  // Render tests
  body.push('', `  // Basic render tests`);
  body.push(`  it('renders without crashing', () => {`);
  body.push(`    render(<${name}${propsStr} />);`);
  body.push(`  });`);
  body.push('', `  it('renders expected content', () => {`);
  body.push(`    render(<${name}${propsStr} />);`);
  body.push(`    // TODO: Add specific content assertions`);
  body.push(`    // expect(screen.getByRole('...')).toBeInTheDocument();`);
  body.push(`  });`);

  // Props tests
  if (hasProps && props.length > 0) {
    body.push('', `  // Props handling tests`);
    for (const prop of props.slice(0, 3)) {
      body.push(`  it('renders with ${prop} prop', () => {`);
      body.push(`    render(<${name} ${prop}="test-value" />);`);
      body.push(`    // TODO: Assert that ${prop} affects rendering`);
      body.push(`  });`);
    }
  }

  // Interaction tests
  if (hasCallbacks) {
    body.push('', `  // User interaction tests`);
    body.push(`  it('handles user interaction', async () => {`);
    body.push(`    const user = userEvent.setup();`);
    body.push(`    const handleClick = jest.fn();`);
    body.push(`    render(<${name} onClick={handleClick} />);`);
    body.push(`    const button = screen.getByRole('button');`);
    body.push(`    await user.click(button);`);
    body.push(`    expect(handleClick).toHaveBeenCalledTimes(1);`);
    body.push(`  });`);
    body.push('', `  it('handles keyboard navigation', async () => {`);
    body.push(`    const user = userEvent.setup();`);
    body.push(`    render(<${name} />);`);
    body.push(`    // TODO: Add keyboard interaction tests`);
    body.push(`    // await user.tab();`);
    body.push(`    // expect(screen.getByRole('...')).toHaveFocus();`);
    body.push(`  });`);
  }

  // State tests
  if (hasState) {
    body.push('', `  // State management tests`);
    body.push(`  it('updates state correctly', async () => {`);
    body.push(`    const user = userEvent.setup();`);
    body.push(`    render(<${name} />);`);
    body.push(`    // TODO: Trigger state change`);
    body.push(`    // await user.click(screen.getByRole('button'));`);
    body.push(`    await waitFor(() => {`);
    body.push(`      // expect(screen.getByText('...')).toBeInTheDocument();`);
    body.push(`    });`);
    body.push(`  });`);
  }

  // A11y test
  if (includeA11y) {
    body.push('', `  // Accessibility tests`);
    body.push(`  it('has no accessibility violations', async () => {`);
    body.push(`    const { container } = render(<${name}${propsStr} />);`);
    body.push(`    const results = await axe(container);`);
    body.push(`    expect(results).toHaveNoViolations();`);
    body.push(`  });`);
  }

  lines.push(...body, '});', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const sourcePath = resolve(args.source);

if (!existsSync(sourcePath)) {
  console.error(`Error: Source path does not exist: ${sourcePath}`);
  process.exit(1);
}

console.error(`Scanning: ${sourcePath}`);
const components = scanFiles(sourcePath, args.verbose);
console.error(`Found ${components.length} React components`);

if (args.scanOnly) {
  console.error('');
  console.error('='.repeat(60));
  console.error('COMPONENT SCAN RESULTS');
  console.error('='.repeat(60));

  const byType = {};
  for (const c of components) {
    (byType[c.componentType] ??= []).push(c);
  }

  for (const [type, comps] of Object.entries(byType).sort()) {
    console.error(`\n${type.toUpperCase()} COMPONENTS (${comps.length}):`);
    for (const c of comps) {
      const hStr = c.hasHooks.length ? ` [hooks: ${c.hasHooks.slice(0, 3).join(', ')}]` : '';
      const sStr = c.hasState ? ' [stateful]' : '';
      console.error(`  - ${c.name}${hStr}${sStr}`);
      console.error(`    ${c.filePath}`);
    }
  }
  console.error('');
  console.error(`Total: ${components.length} components`);

  if (args.json) console.log(JSON.stringify({ components, summary: { total: components.length, byType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.length])) } }, null, 2));
  process.exit(0);
}

const outputPath = resolve(args.output ?? join(sourcePath, '__tests__'));
mkdirSync(outputPath, { recursive: true });

const generatedFiles = [];
let totalTests = 0;

for (const comp of components) {
  const content = generateTestFile(comp, outputPath, args.includeA11y);
  const fname = `${comp.name}.test.tsx`;
  const fpath = join(outputPath, fname);
  writeFileSync(fpath, content, 'utf8');

  // Count 'it(' occurrences as proxy for test count
  const testCount = (content.match(/\bit\(/g) ?? []).length;
  totalTests += testCount;
  generatedFiles.push({ component: comp.name, path: fpath, testCases: testCount });
  console.error(`  ${fname} (${testCount} test cases)`);
}

console.error('');
console.error(`Summary: ${components.length} test files, ${totalTests} test cases`);

const results = {
  status: 'success',
  source: sourcePath,
  components,
  generatedFiles,
  summary: { totalComponents: components.length, totalFiles: generatedFiles.length, totalTestCases: totalTests, outputDir: outputPath },
};

if (args.json) console.log(JSON.stringify(results, null, 2));

#!/usr/bin/env node
/**
 * E2E Test Scaffolder
 *
 * Scans Next.js app/ or pages/ directory and generates Playwright test files
 * with common interactions, Page Object Model classes, and configuration.
 *
 * Usage:
 *   node e2e_test_scaffolder.mjs src/app/ --output testing/e2e/
 *   node e2e_test_scaffolder.mjs pages/ --include-pom --routes "/login,/dashboard"
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve, join, relative, basename } from 'path';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { output: 'testing/e2e', includePom: false, verbose: false, json: false };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--output' || a === '-o') { args.output = argv[++i]; }
    else if (a.startsWith('--output=')) { args.output = a.split('=')[1]; }
    else if (a === '--include-pom') { args.includePom = true; }
    else if (a === '--routes') { args.routes = argv[++i]; }
    else if (a.startsWith('--routes=')) { args.routes = a.split('=')[1]; }
    else if (a === '--verbose' || a === '-v') { args.verbose = true; }
    else if (a === '--json') { args.json = true; }
    else if (!a.startsWith('-')) { positional.push(a); }
  }

  if (!positional[0]) {
    console.error('Usage: node e2e_test_scaffolder.mjs <source-dir> [options]');
    process.exit(1);
  }
  args.source = positional[0];
  return args;
}

// ---------------------------------------------------------------------------
// Route scanner
// ---------------------------------------------------------------------------

const PAGE_FILES = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'index.tsx', 'index.ts', 'index.jsx', 'index.js']);
const FORM_PATTERN = /<form|handleSubmit|onSubmit|useForm|<input|<textarea|<select/;
const AUTH_PATTERN = /auth|login|signin|signup|register|useAuth|useSession|getServerSession|withAuth/i;
const INTERACTION_PATTERNS = {
  click: /onClick|button|Button|<a\s|Link/,
  type: /<input|<textarea|onChange/,
  select: /<select|Dropdown|Select/,
  navigation: /useRouter|router\.push|Link/,
  modal: /Modal|Dialog|isOpen|onClose/,
  toggle: /toggle|Switch|Checkbox/,
  upload: /<input.*type=["']file|upload|dropzone/,
};

function scanDir(dirPath, urlPath, routes, verbose) {
  if (!existsSync(dirPath)) return;

  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const name = entry.name;
    if (name.startsWith('.') || name === 'node_modules') continue;

    if (entry.isDirectory()) {
      if (name.startsWith('(') && name.endsWith(')')) {
        // Route group — transparent
        scanDir(join(dirPath, name), urlPath, routes, verbose);
      } else if (name.startsWith('[') && name.endsWith(']')) {
        // Dynamic segment
        const param = name.slice(1, -1);
        const seg = param.startsWith('...') ? `[...${param.slice(3)}]` : `[${param}]`;
        scanDir(join(dirPath, name), `${urlPath}/${seg}`, routes, verbose);
      } else if (name === 'api') {
        // Skip API routes
      } else {
        scanDir(join(dirPath, name), `${urlPath}/${name}`, routes, verbose);
      }
    } else if (entry.isFile() && PAGE_FILES.has(name)) {
      let content = '';
      try { content = readFileSync(join(dirPath, name), 'utf8'); } catch { continue; }

      const routePath = urlPath === '' ? '/' : urlPath;
      const params = [...routePath.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
      const interactions = Object.entries(INTERACTION_PATTERNS)
        .filter(([, re]) => re.test(content))
        .map(([k]) => k);

      routes.push({
        path: routePath,
        filePath: join(dirPath, name),
        hasDynamic: params.length > 0,
        params,
        hasForm: FORM_PATTERN.test(content),
        hasAuth: AUTH_PATTERN.test(content),
        interactions,
      });

      if (verbose) console.error(`  Found route: ${routePath}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function testUrl(route) {
  let url = route.path;
  for (const p of route.params) {
    url = p.startsWith('...') ? url.replace(`[...${p.slice(3)}]`, 'example/path') : url.replace(`[${p}]`, 'test-id');
  }
  return url;
}

function pageClassName(routePath) {
  if (routePath === '/') return 'HomePage';
  const name = routePath.replace(/\[[^\]]*\]/g, '').split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  return `${name}Page`;
}

function testFileName(routePath) {
  if (routePath === '/') return 'home.spec.ts';
  return routePath.replace(/\[([^\]]+)\]/g, '$1').replace(/^\//, '').replace(/\//g, '-') + '.spec.ts';
}

function pomFileName(routePath) {
  return pageClassName(routePath) + '.ts';
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Test file generator
// ---------------------------------------------------------------------------

function generateTest(route, includePom) {
  const url = testUrl(route);
  const name = route.path === '/' ? 'Home' : route.path;
  const urlPattern = escapeRegex(route.path.replace(/\[[^\]]*\]/g, '.*'));
  const className = pageClassName(route.path);
  const lines = [
    `import { test, expect } from '@playwright/test';`,
  ];
  if (includePom) lines.push(`import { ${className} } from './pages/${className}';`);
  lines.push('', `test.describe('${name}', () => {`);

  lines.push('', `  test('loads successfully', async ({ page }) => {`);
  lines.push(`    await page.goto('${url}');`);
  lines.push(`    await expect(page).toHaveURL(/${urlPattern}/);`);
  lines.push(`    // TODO: Add specific content assertions`);
  lines.push(`  });`);

  lines.push('', `  test('has correct title', async ({ page }) => {`);
  lines.push(`    await page.goto('${url}');`);
  lines.push(`    // TODO: Update expected title`);
  lines.push(`    await expect(page).toHaveTitle(/.*/);`);
  lines.push(`  });`);

  if (route.hasAuth) {
    lines.push('', `  test('redirects unauthenticated users', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    // TODO: Verify redirect to login`);
    lines.push(`    // await expect(page).toHaveURL('/login');`);
    lines.push(`  });`);

    lines.push('', `  test('allows authenticated access', async ({ page }) => {`);
    lines.push(`    // TODO: Set up authentication state`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    await expect(page).toHaveURL(/${urlPattern}/);`);
    lines.push(`  });`);
  }

  if (route.hasForm) {
    lines.push('', `  test('form submission works', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    // TODO: Fill in form fields`);
    lines.push(`    // await page.getByLabel('Email').fill('test@example.com');`);
    lines.push(`    // await page.getByRole('button', { name: 'Submit' }).click();`);
    lines.push(`    // TODO: Assert success state`);
    lines.push(`  });`);

    lines.push('', `  test('shows validation errors', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    await page.getByRole('button', { name: /submit/i }).click();`);
    lines.push(`    // TODO: Assert validation errors shown`);
    lines.push(`  });`);
  }

  if (route.interactions.includes('click')) {
    lines.push('', `  test('button interactions work', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    // TODO: Find and click interactive elements`);
    lines.push(`    // const button = page.getByRole('button', { name: '...' });`);
    lines.push(`    // await button.click();`);
    lines.push(`  });`);
  }

  if (route.interactions.includes('navigation')) {
    lines.push('', `  test('navigation works correctly', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    // TODO: Click navigation links`);
    lines.push(`    // await page.getByRole('link', { name: '...' }).click();`);
    lines.push(`  });`);
  }

  if (route.interactions.includes('modal')) {
    lines.push('', `  test('modal opens and closes', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    // await page.getByRole('button', { name: 'Open' }).click();`);
    lines.push(`    // await expect(page.getByRole('dialog')).toBeVisible();`);
    lines.push(`  });`);
  }

  if (route.hasDynamic) {
    lines.push('', `  test('handles dynamic parameters', async ({ page }) => {`);
    lines.push(`    await page.goto('${url}');`);
    lines.push(`    await expect(page.locator('body')).toBeVisible();`);
    lines.push(`  });`);
  }

  lines.push('});', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Page Object generator
// ---------------------------------------------------------------------------

function generatePom(route) {
  const className = pageClassName(route.path);
  const url = route.path;
  const hasForm = route.hasForm;
  const hasAuth = route.hasAuth;
  const hasModal = route.interactions.includes('modal');
  const hasNav = route.interactions.includes('navigation');

  const locatorDecls = [`  readonly page: Page;`, `  readonly heading: Locator;`];
  const locatorInits = [`    this.page = page;`, `    this.heading = page.getByRole('heading', { level: 1 });`];

  if (hasForm) {
    locatorDecls.push(`  readonly submitButton: Locator;`, `  readonly form: Locator;`);
    locatorInits.push(`    this.submitButton = page.getByRole('button', { name: /submit/i });`, `    this.form = page.locator('form');`);
  }
  if (hasAuth) {
    locatorDecls.push(`  readonly emailInput: Locator;`, `  readonly passwordInput: Locator;`);
    locatorInits.push(`    this.emailInput = page.getByLabel('Email');`, `    this.passwordInput = page.getByLabel('Password');`);
  }
  if (hasNav) {
    locatorDecls.push(`  readonly navLinks: Locator;`);
    locatorInits.push(`    this.navLinks = page.getByRole('navigation').getByRole('link');`);
  }
  if (hasModal) {
    locatorDecls.push(`  readonly modal: Locator;`);
    locatorInits.push(`    this.modal = page.getByRole('dialog');`);
  }

  const gotoArgs = route.hasDynamic ? route.params.map(p => `${p.replace('...', '')}: string`).join(', ') : '';
  const gotoUrl = route.hasDynamic
    ? route.params.reduce((u, p) => {
        const key = p.startsWith('...') ? p.slice(3) : p;
        return u.replace(p.startsWith('...') ? `[...${key}]` : `[${p}]`, `\${${key}}`);
      }, url)
    : url;
  const gotoLine = route.hasDynamic ? `await this.page.goto(\`${gotoUrl}\`);` : `await this.page.goto('${url}');`;

  const methods = [
    `  async goto(${gotoArgs}) {`,
    `    ${gotoLine}`,
    `  }`,
    ``,
    `  async waitForLoad() {`,
    `    await expect(this.heading).toBeVisible();`,
    `  }`,
  ];

  if (hasForm) methods.push(``, `  async submitForm() {`, `    await this.submitButton.click();`, `  }`);
  if (hasAuth) {
    methods.push(``, `  async login(email: string, password: string) {`);
    methods.push(`    await this.emailInput.fill(email);`);
    methods.push(`    await this.passwordInput.fill(password);`);
    methods.push(`    await this.submitButton.click();`);
    methods.push(`  }`);
  }
  if (hasModal) {
    methods.push(``, `  async waitForModal() {`, `    await expect(this.modal).toBeVisible();`, `  }`);
    methods.push(``, `  async closeModal() {`, `    await this.page.keyboard.press('Escape');`, `    await expect(this.modal).not.toBeVisible();`, `  }`);
  }

  return [
    `import { Page, Locator, expect } from '@playwright/test';`,
    ``,
    `export class ${className} {`,
    ...locatorDecls,
    ``,
    `  constructor(page: Page) {`,
    ...locatorInits,
    `  }`,
    ``,
    ...methods,
    `}`,
    ``,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Config / fixture generators
// ---------------------------------------------------------------------------

const CONFIG_CONTENT = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
`;

const AUTH_FIXTURE_CONTENT = `import { test as base, Page } from '@playwright/test';

interface AuthFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Option 1: Login via UI
    // await page.goto('/login');
    // await page.getByLabel('Email').fill(process.env.TEST_EMAIL ?? 'test@example.com');
    // await page.getByLabel('Password').fill(process.env.TEST_PASSWORD ?? 'password');
    // await page.getByRole('button', { name: 'Sign in' }).click();
    // await page.waitForURL('/dashboard');

    // Option 2: Login via API (faster)
    // const res = await page.request.post('/api/auth/login', {
    //   data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
    // });
    // const { token } = await res.json();
    // await page.context().addCookies([{ name: 'auth-token', value: token, domain: 'localhost', path: '/' }]);

    await use(page);
  },
});

export { expect } from '@playwright/test';
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const sourcePath = resolve(args.source);
const outputPath = resolve(args.output);
const routesFilter = args.routes ? args.routes.split(',').map(r => r.trim()) : null;

if (!existsSync(sourcePath)) {
  console.error(`Error: Source path does not exist: ${sourcePath}`);
  process.exit(1);
}

console.error(`Scanning: ${sourcePath}`);

const routes = [];
scanDir(sourcePath, '', routes, args.verbose);

const filtered = routesFilter ? routes.filter(r => routesFilter.some(f => r.path.includes(f))) : routes;
console.error(`Found ${filtered.length} routes`);

mkdirSync(outputPath, { recursive: true });
if (args.includePom) mkdirSync(join(outputPath, 'pages'), { recursive: true });
mkdirSync(join(outputPath, 'fixtures'), { recursive: true });

const generatedFiles = [];

for (const route of filtered) {
  const fname = testFileName(route.path);
  const fpath = join(outputPath, fname);
  writeFileSync(fpath, generateTest(route, args.includePom), 'utf8');
  generatedFiles.push({ type: 'test', route: route.path, path: fpath });
  console.error(`  ${fname}`);

  if (args.includePom) {
    const pname = pomFileName(route.path);
    const ppath = join(outputPath, 'pages', pname);
    writeFileSync(ppath, generatePom(route), 'utf8');
    generatedFiles.push({ type: 'page_object', route: route.path, path: ppath });
    console.error(`  pages/${pname}`);
  }
}

// Generate playwright.config.ts inside testing/ (next to e2e/) if not exists
const configPath = join(resolve(args.output, '..'), 'playwright.config.ts');
if (!existsSync(configPath)) {
  writeFileSync(configPath, CONFIG_CONTENT, 'utf8');
  generatedFiles.push({ type: 'config', path: configPath });
  console.error(`  playwright.config.ts`);
}

const authFixturePath = join(outputPath, 'fixtures', 'auth.ts');
if (!existsSync(authFixturePath)) {
  writeFileSync(authFixturePath, AUTH_FIXTURE_CONTENT, 'utf8');
  generatedFiles.push({ type: 'fixture', path: authFixturePath });
  console.error(`  fixtures/auth.ts`);
}

const results = {
  status: 'success',
  source: sourcePath,
  routes: filtered,
  generatedFiles,
  summary: { totalRoutes: filtered.length, totalFiles: generatedFiles.length, outputDir: outputPath, includePom: args.includePom },
};

console.error(`\nSummary: ${filtered.length} routes, ${generatedFiles.length} files generated`);

if (args.json) console.log(JSON.stringify(results, null, 2));

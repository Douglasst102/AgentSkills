# Execução de testes com Playwright

Guia para escrita e execução de testes E2E com Playwright. Os testes ficam em `testing/e2e/` e a configuração em `testing/playwright.config.ts`. A instalação (npm) e a execução (npx) devem ocorrer **sempre dentro do container Playwright**; ver [playwright-docker.md](playwright-docker.md).

---

## Geração de código a partir de ações

Ao interagir com a página (preencher formulários, clicar, navegar), gere código Playwright equivalente para seus testes:

```typescript
import { test, expect } from '@playwright/test';

test('fluxo de login', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/.*dashboard/);
});
```

### Locators preferidos

Use locators semânticos (baseados em papel e acessibilidade); são mais estáveis que seletores CSS:

```typescript
// Preferido (semântico)
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByPlaceholder('Search').fill('query');
await page.getByText('Welcome').isVisible();

// Evitar (frágil)
await page.locator('#submit-btn').click();
await page.locator('.email-input').fill('...');
```

### Assertions

O código gerado a partir de ações não inclui assertions. Sempre adicione expectativas no teste:

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Success')).toBeVisible();
await expect(page).toHaveURL(/\/orders\/.+/);
```

---

## Cenários avançados (código Playwright direto)

Quando precisar de waits, storage state ou lógica mais complexa, use a API do Playwright dentro do próprio teste:

### Espera por estado da rede

```typescript
await page.goto('/', { waitUntil: 'networkidle' });
```

### Espera por elemento

```typescript
await page.waitForSelector('.loading', { state: 'hidden' });
await expect(page.locator('.result')).toHaveText('10', { timeout: 5000 });
```

### Storage state (login uma vez, reutilizar)

```typescript
// No projeto, em fixture ou beforeAll:
await page.goto('/login');
await page.getByLabel('Email').fill('test@example.com');
await page.getByLabel('Password').fill('password');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.waitForURL('**/dashboard');
await page.context().storageState({ path: 'auth.json' });

// Em testing/playwright.config.ts: use storageState: 'auth.json' no project
```

### Navegação e respostas

```typescript
await Promise.all([
  page.waitForURL('/dashboard'),
  page.click('a.dashboard-link'),
]);
const response = await page.waitForResponse('/api/data');
expect(response.status()).toBe(200);
```

---

## Estrutura dos testes E2E

Os specs ficam em `testing/e2e/` e a configuração em `testing/playwright.config.ts`:

```text
testing/
├── e2e/
│   ├── login.spec.ts
│   ├── dashboard.spec.ts
│   └── checkout.spec.ts
├── playwright.config.ts
├── playwright-report/        # Gerado pelo container
└── test-results/             # Gerado pelo container
```

---

## Execução da suíte E2E

**Regra:** Use o **container Playwright** e rode **dentro dele** `npm ci` e `npx playwright test`. Nunca rode npm/npx no host.

```bash
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

- Build e execução detalhados: ver [playwright-docker.md](playwright-docker.md).
- O agente deve invocar apenas comandos Docker no host; os comandos npm/npx rodam no container.
- Relatórios ficam em `testing/playwright-report/` e `testing/test-results/` no projeto (visíveis no host via volume).

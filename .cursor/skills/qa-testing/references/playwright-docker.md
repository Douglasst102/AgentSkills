# Container de QA para execução de testes

Todos os testes (unitários, integração e E2E) rodam **dentro do container de QA**. No host, o agente só usa Docker (build, run, exec).

---

## Regra obrigatória

- **npm** (install, ci) e **npx** (playwright test, jest, etc.) rodam **apenas dentro** do container.
- No host: apenas comandos **Docker** (build, run, docker compose run, docker exec).
- A execução é **cumulativa**: novos testes entram sem substituir os anteriores; cada rodada executa a suíte completa.

---

## Ferramentas por nível

| Nível | Ferramenta | API |
|-------|-----------|-----|
| Unitário | Jest + RTL | `describe` / `it` / `expect` |
| Integração | Jest + RTL + MSW | `describe` / `it` / `expect` + `setupServer` |
| E2E | Playwright | `test` / `expect` de `@playwright/test` |

O container usa a imagem oficial `mcr.microsoft.com/playwright` (Node + browsers). Isso **não** significa que Jest usa Playwright — são **dois processos distintos** no **mesmo** container (`npm test` → Jest; `npx playwright test` → runner do Playwright).

**Jest e Playwright vêm do `package.json` do projeto** e são instalados com `npm ci` dentro do container. Na máquina host basta Docker (e opcionalmente a IDE); **não** é obrigatório instalar Node na host.

### Jest precisa da aplicação rodando?

Em geral **não**: testes unitários e de integração de frontend rodam em Node/jsdom e usam **MSW** (ou mocks) sem subir frontend/backend. **E2E com Playwright precisa** de URL acessível (`baseURL`): use `webServer` no `playwright.config.ts` ou `docker compose` com os serviços da app e `BASE_URL` na rede interna (modelo em `docker/docker-compose.example.yml`).

### Monorepo / serviço isolado

Monte o diretório do pacote que contém o `package.json` dos testes (ex.: `-v "${PWD}/frontend:/app" -w /app`).

---

## Estrutura de testes no projeto

Os testes e configurações ficam centralizados em `testing/`:

```text
testing/
├── unit/                    # Testes unitários (Jest + RTL)
├── integration/             # Testes de integração (Jest + RTL + MSW)
├── e2e/                     # Specs Playwright
├── playwright.config.ts     # Config do Playwright (paths relativos a testing/)
├── playwright-report/       # Relatórios HTML (gerados pelo container via volume)
└── test-results/            # Traces, screenshots, vídeos (gerados pelo container via volume)
```

O volume monta a **raiz do projeto** em `/app` (`-v "${PWD}:/app"`), tornando `testing/` acessível como `/app/testing/` dentro do container. O Playwright lê o config em `/app/testing/playwright.config.ts` e, como os caminhos no config são relativos ao arquivo, grava artefatos em `testing/playwright-report/` e `testing/test-results/` no host.

---

## Checklist de montagem do container para E2E

| Item | Detalhe |
|------|--------|
| Volume | `-v "${PWD}:/app"` — raiz do repositório em `/app`; PowerShell: `-v "${PWD}:/app"` |
| Working dir | `-w /app` — inicia na raiz do projeto |
| Config flag | `--config=testing/playwright.config.ts` — relativo ao working dir (`/app`) |
| `testDir` no config | `'./e2e'` → `testing/e2e/` no host |
| `outputDir` no config | `'./test-results'` → `testing/test-results/` no host |
| Reporter HTML | `outputFolder: './playwright-report'` → `testing/playwright-report/` no host |
| `.dockerignore` | Garantir que `testing/` **não** apareça no `.dockerignore` do projeto |

---

## Comunicação agente/skill ↔ container

- **Canal:** Shell (terminal). O agente não se comunica com o container por API nem socket.
- **Envio:** O agente dispara no host comandos Docker.
- **Execução:** Dentro do container rodam `npm ci`, `npm test` (Jest) e `npx playwright test`.
- **Retorno:**
  - **Exit code** (0 = sucesso, ≠0 = falha).
  - **stdout/stderr** no terminal do host (logs do Jest e do Playwright).
  - **Artefatos:** `testing/playwright-report/`, `testing/test-results/` e `coverage/` ficam visíveis no host via volume montado.

---

## Como construir a imagem

A partir do diretório do **projeto** que contém os testes:

```bash
docker build -t qa-playwright -f .cursor/skills/qa-testing/docker/Dockerfile .
```

Ou, se o Dockerfile estiver copiado para a raiz do projeto:

```bash
docker build -t qa-playwright -f docker/Dockerfile .
```

---

## Como executar testes no container

Projeto montado em volume; execução **dentro** do container:

```bash
# Suíte completa (unit + integração + E2E)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"

# Somente unitários + integração (Jest)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# Somente E2E (Playwright)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

- **`--ipc=host`** e **`--init`**: recomendados pela [documentação Playwright Docker](https://playwright.dev/docs/docker).
- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.

Com docker-compose (quando o projeto tiver um `docker-compose.yml`):

```bash
docker compose run playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"
```

Exemplo comentado para **frontend + backend + E2E** (rede, `BASE_URL`, volume para `node_modules`): `docker/docker-compose.example.yml`.

---

## Instrução para o agente

1. Sempre usar o container para **instalar** (npm ci) e **executar** (npm test, npx playwright test). Nunca rodar npm ou npx no host.
2. Usar `--config=testing/playwright.config.ts` para que o Playwright encontre specs em `testing/e2e/` e grave relatórios em `testing/playwright-report/` e `testing/test-results/`.
3. A suíte é cumulativa: os testes de stories anteriores são reexecutados junto com os novos.
4. Após a execução, ler o exit code para saber se os testes passaram e, se existirem, os relatórios em `testing/playwright-report/` ou `testing/test-results/`.

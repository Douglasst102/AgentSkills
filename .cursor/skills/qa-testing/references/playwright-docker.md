# Container Playwright para execução de testes

Todos os testes (unitários, integração e E2E) rodam **dentro do container Playwright**. No host, o agente só usa Docker (build, run, exec).

---

## Regra obrigatória

- **npm** (install, ci) e **npx** (playwright test, jest, etc.) rodam **apenas dentro** do container.
- No host: apenas comandos **Docker** (build, run, docker compose run, docker exec).
- A execução é **cumulativa**: novos testes entram sem substituir os anteriores; cada rodada executa a suíte completa.

---

## Estrutura de testes no projeto

Os testes e configurações ficam centralizados em `testing/`:

```text
testing/
├── unit/                    # Testes unitários (Jest + RTL)
├── integration/             # Testes de integração (RTL + MSW)
├── e2e/                     # Specs Playwright
├── playwright.config.ts     # Config do Playwright (testDir: 'e2e/')
├── playwright-report/       # Relatórios HTML (gerados pelo container)
└── test-results/            # Traces, screenshots, vídeos (gerados pelo container)
```

O volume monta o projeto inteiro em `/app`, tornando `testing/` e seus subdiretórios acessíveis ao container. O Playwright lê o config em `testing/playwright.config.ts` e grava artefatos em `testing/playwright-report/` e `testing/test-results/`.

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

Ou, se o Dockerfile estiver na raiz do projeto:

```bash
docker build -t qa-playwright ./docker
```

---

## Como executar testes no container

Projeto montado em volume; execução **dentro** do container:

```bash
# Suíte completa (unit + integração + E2E)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"

# Somente unitários + integração
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# Somente E2E
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

- **`--ipc=host`** e **`--init`**: recomendados pela [documentação Playwright Docker](https://playwright.dev/docs/docker).
- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.

Com docker-compose (quando o projeto tiver um `docker-compose.yml`):

```bash
docker compose run playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"
```

---

## Instrução para o agente

1. Sempre usar o container para **instalar** (npm ci) e **executar** (npm test, npx playwright test). Nunca rodar npm ou npx no host.
2. Usar `--config=testing/playwright.config.ts` para que o Playwright encontre specs em `testing/e2e/` e grave relatórios em `testing/playwright-report/` e `testing/test-results/`.
3. A suíte é cumulativa: os testes de stories anteriores são reexecutados junto com os novos.
4. Após a execução, ler o exit code para saber se os testes passaram e, se existirem, os relatórios em `testing/playwright-report/` ou `testing/test-results/`.

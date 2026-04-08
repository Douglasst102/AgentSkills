# Container de QA para testes

Todos os testes (unitários, integração e E2E) rodam **dentro deste container**. No host, o agente só executa comandos Docker.

## O que a imagem faz (e o que não faz)

A imagem `qa-playwright` é baseada em `mcr.microsoft.com/playwright` (**Node.js + browsers**). Ela **não** instala Jest nem `@playwright/test` por conta própria: esses pacotes vêm do **`package.json` do projeto** e são instalados com `npm ci` **dentro** do container após montar o código em `/app`.

- **Jest** e **Playwright** são dois programas diferentes; ambos rodam no **mesmo** container de QA, em sequência ou em comandos separados.
- **Host sem Node:** não é necessário instalar Node/npm na máquina local — só Docker (e a IDE).

## Build

A partir da **raiz do projeto** que contém os testes (e `package.json`):

```bash
docker build -t qa-playwright -f .cursor/skills/qa-testing/docker/Dockerfile .
```

Ou, copiando o Dockerfile para o projeto:

```bash
docker build -t qa-playwright -f docker/Dockerfile .
```

## Ferramentas no container

- **Jest** — `npm test` (dependência do projeto)
- **Playwright** — `npx playwright test` (dependência do projeto)

## Jest vs E2E: precisa da aplicação rodando?

| Suíte | Precisa de frontend/backend no ar? |
|-------|-----------------------------------|
| Jest (unit + integração típica) | **Não** — jsdom + MSW/mocks. |
| Playwright (E2E) | **Sim** — o browser precisa de `baseURL` acessível. |

Opções para E2E:

1. **`webServer` no `playwright.config.ts`** — sobe `npm run dev` (ou similar) no mesmo container que já tem o repo em `/app` (ver comentário no exemplo em `SKILL.md`).
2. **`docker compose`** — serviços `frontend` / `backend` + `playwright` na mesma rede; `BASE_URL=http://frontend:3000`. Modelo: [`docker-compose.example.yml`](docker-compose.example.yml).

## Executar testes

### Monorepo ou só o frontend

Monte a pasta que contém o `package.json` usado pelos testes:

```bash
docker run --rm -v "${PWD}/frontend:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"
```

### Raiz única (app + testing na mesma raiz)

```bash
# Suíte completa (unit + integração + E2E) — E2E exige app acessível em BASE_URL
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"

# Somente unitários + integração (Jest)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# Somente E2E (Playwright)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.
- **`--ipc=host`** e **`--init`**: recomendados pela documentação do Playwright.

### Artefatos gerados pelo container

- `testing/playwright-report/` — relatório HTML do Playwright
- `testing/test-results/` — traces, screenshots, vídeos
- `coverage/` — cobertura Jest (configurável no Jest)

Caminhos no `playwright.config.ts` em `testing/` são relativos a esse arquivo (`./e2e`, `./test-results`, `./playwright-report`).

### Volume `node_modules` (recomendado no Windows)

No Compose, use um volume nomeado para `/app/node_modules` para não gravar milhares de arquivos no bind mount do host e evitar binários nativos incompatíveis. Exemplo em [`docker-compose.example.yml`](docker-compose.example.yml).

## Docker Compose

Compose mínimo (equivalente ao `docker run` na raiz do repo):

```yaml
services:
  playwright:
    image: qa-playwright
    volumes:
      - .:/app
    working_dir: /app
    ipc: host
    init: true
    command: sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"
```

Modelo com profile `e2e`, rede e `BASE_URL` para stacks com frontend/backend: [`docker-compose.example.yml`](docker-compose.example.yml).

```bash
docker compose run playwright
# ou, com o exemplo que usa profile:
docker compose -f docker-compose.qa.yml --profile e2e run --rm playwright
```

## Uso pelo agente

1. No host, o agente só executa comandos **Docker** (build, run ou compose run).
2. O agente **não** roda `npm` ou `npx` no host para esta suíte.
3. A suíte é **cumulativa**: cada execução roda todos os testes (novos + anteriores).
4. Resultado: exit code; stdout/stderr; artefatos em `testing/playwright-report/`, `testing/test-results/` e `coverage/`.

Detalhes: [../references/playwright-docker.md](../references/playwright-docker.md).

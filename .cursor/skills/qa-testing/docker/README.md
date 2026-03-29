# Container Playwright para QA Testing

Todos os testes (unitários, integração e E2E) rodam **dentro deste container**. No host, o agente só executa comandos Docker.

## Build

A partir da **raiz do projeto** que contém os testes (e package.json):

```bash
docker build -t qa-playwright -f .cursor/skills/qa-testing/docker/Dockerfile .
```

Ou, copiando o Dockerfile para o projeto:

```bash
docker build -t qa-playwright -f docker/Dockerfile .
```

## Executar testes

O projeto é montado em volume em `/app`. Os testes ficam sob `testing/` e o Playwright usa `testing/playwright.config.ts`:

```bash
# Suíte completa (unit + integração + E2E)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"

# Somente unitários + integração (Jest)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# Somente E2E (Playwright)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.
- **`--ipc=host`** e **`--init`**: recomendados pela documentação do Playwright.

### Artefatos gerados pelo container

Com o projeto montado em `/app`, os artefatos ficam visíveis no host sob `testing/`:

- `testing/playwright-report/` — relatório HTML do Playwright
- `testing/test-results/` — traces, screenshots, vídeos
- `coverage/` — relatório de cobertura Jest (caminho padrão, configurável no `jest.config`)

## Docker Compose (opcional)

No projeto que usa esta imagem, pode existir um `docker-compose.yml`:

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

Uso:

```bash
docker compose run playwright
```

Ou sobrescrevendo o comando:

```bash
docker compose run playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"
```

## Uso pelo agente

1. No host, o agente só executa comandos **Docker** (build, run ou compose run).
2. O agente **nunca** roda `npm` ou `npx` no host para esta suíte.
3. A suíte é **cumulativa**: cada execução roda todos os testes (novos + anteriores).
4. Resultado: exit code do processo no container; stdout/stderr no terminal; artefatos em `testing/playwright-report/`, `testing/test-results/` e `coverage/` no projeto.

Detalhes: [../references/playwright-docker.md](../references/playwright-docker.md).

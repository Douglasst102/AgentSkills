# Container Playwright para QA Testing

A instalação (npm) e a execução (npx playwright test, npm test) devem rodar **sempre dentro** deste container. No host só se executa Docker.

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

Projeto montado em volume; comandos **dentro** do container:

```bash
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"
```

- **Windows (PowerShell):** use `-v "${PWD}:/app"` ou `-v "$(Get-Location):/app"`.
- **--ipc=host** e **--init**: recomendados pela documentação do Playwright.

Relatórios (`playwright-report/`, `test-results/`) aparecem no diretório do projeto no host, pois `/app` é o volume montado.

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
    # Comando padrão; pode sobrescrever com: docker compose run playwright sh -c "npm ci && npx playwright test"
    command: sh -c "npm ci && npx playwright test"
```

Uso:

```bash
docker compose run playwright sh -c "npm ci && npx playwright test"
```

## Uso pelo agente

1. No host, o agente só executa comandos **Docker** (build, run ou compose run).
2. O agente **nunca** roda `npm` ou `npx` de Playwright/Jest no host para esta suíte.
3. Resultado: exit code do processo no container; stdout/stderr no terminal; artefatos em `playwright-report/` e `test-results/` no projeto.

Detalhes: [../references/playwright-docker.md](../references/playwright-docker.md).

# Container Playwright para execução de testes

Objetivo: executar instalação (npm) e testes (npx playwright test, npm test) **sempre dentro** do container Playwright. No host só se usa Docker (build, run, exec).

---

## Regra obrigatória

- **npm** (install, ci) e **npx** (playwright test, playwright install, etc.) rodam **apenas dentro** do container.
- No host: apenas comandos **Docker** (build, run, docker compose run, docker exec).

---

## Comunicação agente/skill ↔ Playwright no container

- **Canal:** Shell (terminal). O agente não se comunica com o container por API nem socket.
- **Envio:** O agente dispara no host comandos Docker, por exemplo:
  - `docker run --rm -v ${PWD}:/app -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"`
  - ou `docker compose run playwright sh -c "npm ci && npx playwright test"`
- **Execução:** Dentro do container rodam `npm ci` e `npx playwright test`.
- **Retorno:**
  - **Exit code** (0 = sucesso, ≠0 = falha).
  - **stdout/stderr** no terminal do host (logs do Playwright).
  - **Artefatos:** `playwright-report/`, `test-results/` são gravados no diretório de trabalho do container; com o projeto montado em volume (`-v ${PWD}:/app`), esses arquivos ficam visíveis no host. O agente pode ler `playwright-report/index.html` ou `test-results/` no caminho do projeto.

---

## Como construir a imagem

A partir do diretório do **projeto** que contém os testes (ou do diretório da skill, conforme o Dockerfile):

```bash
docker build -t qa-playwright -f .cursor/skills/qa-testing/docker/Dockerfile .
```

Ou, se o Dockerfile estiver na raiz do projeto:

```bash
docker build -t qa-playwright ./docker
```

---

## Como instalar e rodar testes no container

Projeto montado em volume; instalação e execução **dentro** do container:

```bash
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"
```

- `--ipc=host` e `--init`: recomendados pela [documentação Playwright Docker](https://playwright.dev/docs/docker).
- Em Windows (PowerShell): use `$PWD` em vez de `${PWD}`.

Com docker-compose (quando o projeto tiver um `docker-compose.yml` que use esta imagem):

```bash
docker compose run playwright sh -c "npm ci && npx playwright test"
```

---

## Instrução para o agente

- Sempre usar o container para **instalar** (npm install / npm ci) e **executar** (npx playwright test, npm test). Nunca rodar npm ou npx de Playwright/Jest no host para esta suíte.
- Após a execução, ler o exit code para saber se os testes passaram e, se existirem, os relatórios em `playwright-report/` ou `test-results/` no projeto.

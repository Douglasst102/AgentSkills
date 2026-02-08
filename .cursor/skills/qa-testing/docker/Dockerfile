# Imagem oficial Playwright com Node e browsers instalados.
# Uso: monte o projeto em /app e rode npm ci e npx playwright test dentro do container.
# Nunca rode npm/npx de Playwright no host; use sempre este container.
# Ref: https://playwright.dev/docs/docker
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Sem ENTRYPOINT/CMD fixos: o agente ou usuário invoca comandos explícitos, por exemplo:
# docker run --rm -v ${PWD}:/app -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"

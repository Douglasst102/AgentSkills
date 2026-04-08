# Imagem oficial Playwright: Node.js + browsers (Chromium, Firefox, WebKit).
#
# Este é o "container de QA" unificado da skill qa-testing:
#   - Jest (unit/integration) vem do package.json do projeto e roda após npm ci — não está na imagem base.
#   - Playwright (@playwright/test) idem, via devDependencies do projeto.
#
# Montar o código em /app e executar DENTRO do container, por exemplo:
#   npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts
#
# No host: apenas Docker (build/run/compose). Ref: https://playwright.dev/docs/docker
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Sem ENTRYPOINT/CMD: comandos explícitos em docker run / compose (ver docker/README.md).

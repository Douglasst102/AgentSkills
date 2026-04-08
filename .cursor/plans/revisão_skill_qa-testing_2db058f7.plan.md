---
name: Revisão skill qa-testing
overview: "Atualizar a skill `qa-testing` e referências alinhadas para: (1) ferramentas auxiliares em Node.js em vez de Python; (2) deixar explícito que Playwright cobre só E2E e que unit/integration usam Jest (ou stack Node equivalente), com critérios de quando automatizar cada nível; (3) documentar de forma verificável o volume Docker e os caminhos de `testing/` para specs e artefatos E2E."
todos:
  - id: skill-md
    content: "Reescrever SKILL.md: Node.js nos auxiliares, seção Playwright vs Jest + quando automatizar, checklist volume/caminhos E2E"
    status: completed
  - id: refs-docker
    content: Alinhar playwright-docker.md, docker/README.md e opcionalmente test-strategy-template.md ao mesmo contrato de diretórios
    status: completed
  - id: node-scripts
    content: Adicionar scripts .mjs (e package.json se necessário), port faseado dos três .py; remover ou marcar legado os .py
    status: completed
  - id: qa-agent
    content: Ajustar .cursor/agents/qa-engineer.md para terminologia container/E2E/Jest consistente com a skill
    status: completed
isProject: false
---

# Revisão da skill qa-testing (Node.js, pirâmide, container)

## Contexto atual

- A skill principal está em [`.cursor/skills/qa-testing/SKILL.md`](.cursor/skills/qa-testing/SKILL.md): já usa **npm/Jest/Playwright dentro do container**, mas a seção **“Scripts auxiliares”** ainda aponta para **Python** (`test_suite_generator.py`, `coverage_analyzer.py`, `e2e_test_scaffolder.py` em [`.cursor/skills/qa-testing/scripts/`](.cursor/skills/qa-testing/scripts/)).
- Esses três `.py` são grandes (~600–830 linhas cada); migrar com paridade total é trabalhoso e deve ser tratado como **fases**, não como um único passo de documentação.
- O [Dockerfile](`.cursor/skills/qa-testing/docker/Dockerfile`) só define `FROM mcr.microsoft.com/playwright:...` e `WORKDIR /app`; a “montagem correta” depende do **`docker run -v ...:/app`** e do **`playwright.config.ts`** do projeto — hoje isso está descrito de forma dispersa em [`references/playwright-docker.md`](`.cursor/skills/qa-testing/references/playwright-docker.md`) e [`docker/README.md`](`.cursor/skills/qa-testing/docker/README.md`).

## 1. Mudança de Python para JavaScript (Node.js)

**Na skill e referências**

- Substituir a seção “Scripts auxiliares” por **comandos Node.js** (ex.: `node .cursor/skills/qa-testing/scripts/<script>.mjs ...`), com os mesmos papéis: gerador de stubs Jest/RTL, análise de cobertura, scaffolder E2E.
- Opcional mas recomendado: um [`package.json`](`.cursor/skills/qa-testing/scripts/package.json`) em `scripts/` com `"type": "module"`, `bin` ou scripts `npm run ...`, para dependências mínimas (ex.: `fast-glob` ou APIs nativas só com `fs`/`path`) — o agente executa esses comandos no **host** (como hoje com Python), salvo se no futuro quiserem rodar também no container.

**Implementação dos scripts**

- **Fase 1 (alinhada à skill):** Introduzir os **três equivalentes em `.mjs`** (ou `.ts` + `node --experimental-strip-types` se preferirem TS sem build) e **remover ou arquivar** os `.py` após paridade aceitável — ou manter `.py` temporariamente com nota “legado” apenas se a primeira versão Node for enxuta.
- **Ordem sugerida de port:** `coverage_analyzer` (leitura de JSON Istanbul) → `e2e_test_scaffolder` → `test_suite_generator` (o mais complexo).
- Se a primeira entrega for só documentação: declarar na skill que os CLIs oficiais são Node e apontar para stubs até o port completo (evita prometer Python).

## 2. Unitários e integração vs Playwright — necessidade e automação

**Esclarecimento conceitual (obrigatório no SKILL.md)**

- **Playwright** = automação de **E2E no browser** (`testing/e2e/`, API `@playwright/test`).
- **Unitários e integração** = **não usam Playwright**; rodam em **Node** com **Jest** (ou Vitest, se o projeto padronizar) + RTL / MSW conforme já citado na pirâmide.
- O **container** é a **imagem oficial Playwright** (Node + browsers): serve como **ambiente único** para `npm ci`, `npm test` e `npx playwright test`, mas isso **não** significa que testes unitários “são Playwright”.

**Nova subseção sugerida (ex.: “O que automatizar em cada nível”)**

- Critérios curtos: **unitário** — lógica pura, hooks, componentes isolados; **integração** — fluxos com MSW/API fake, composição de módulos; **E2E** — jornadas críticas, regressões de UI real, contratos browser-only.
- Referenciar de novo [`references/testing_strategies.md`](`.cursor/skills/qa-testing/references/testing_strategies.md`) e, se útil, uma linha em [`references/test-strategy-template.md`](`.cursor/skills/qa-testing/references/test-strategy-template.md`) explicitando a separação de ferramentas.

**Alinhamento do agente**

- Ajustar levemente [`.cursor/agents/qa-engineer.md`](`.cursor/agents/qa-engineer.md`) para usar a mesma linguagem (“container de QA / imagem Playwright”, “E2E com Playwright”, “unit/integration com Jest”) e evitar ambiguidade.

## 3. Container: diretórios para testes e relatórios E2E

**Checklist a incorporar na skill e em `playwright-docker.md` / `docker/README.md`**

| Item | Detalhe |
|------|--------|
| Volume | Montar a **raiz do repositório** em `/app` (`-v "${PWD}:/app"` / PowerShell: `$PWD`) e `-w /app`, para que `testing/` exista dentro do container com o mesmo caminho relativo que no host. |
| Config | Usar `npx playwright test --config=testing/playwright.config.ts` para que caminhos no config sejam relativos ao **diretório do arquivo de config** (`testing/`). |
| Specs | `testDir` apontando para `./e2e` (ou equivalente) → `testing/e2e/`. |
| Artefatos | `outputDir` (ex.: `./test-results`) e reporter HTML com pasta de saída em `./playwright-report` **dentro de `testing/`**, para gravar em `testing/test-results/` e `testing/playwright-report/` no volume. |
| Escrita | Garantir que nada no `.dockerignore` do projeto exclua `testing/`; permissões em Windows/WSL seguem o bind mount usual. |

**Nota:** O repositório **AgentSkills** ainda não contém um `playwright.config.ts` real em `testing/` (só [testing/.gitkeep](testing/.gitkeep)); a skill deve tratar o trecho de config como **contrato recomendado** para projetos que consumirem a skill (e opcionalmente um exemplo mínimo em `references/` ou snippet na doc, sem obrigar alteração global do repo).

## 4. Arquivos a tocar (resumo)

- Principal: [`.cursor/skills/qa-testing/SKILL.md`](`.cursor/skills/qa-testing/SKILL.md) — descrição frontmatter (se quiserem mencionar Node nos auxiliares), pirâmide + separação Playwright/Jest, seção container com checklist, scripts Node.
- Referências: [`references/playwright-docker.md`](`.cursor/skills/qa-testing/references/playwright-docker.md), [`docker/README.md`](`.cursor/skills/qa-testing/docker/README.md), opcionalmente [`references/test-strategy-template.md`](`.cursor/skills/qa-testing/references/test-strategy-template.md).
- Código: nova base **Node** em [`.cursor/skills/qa-testing/scripts/`](`.cursor/skills/qa-testing/scripts/) + remoção/depreciação dos `.py` quando a substituição estiver aceite.
- Agente: [`.cursor/agents/qa-engineer.md`](`.cursor/agents/qa-engineer.md) — consistência terminológica.

## 5. Risco e escopo

- **Paridade 1:1** dos três scripts Python → Node pode exceder um único PR; o plano acima separa **documentação correta** (skill + Docker) da **migração incremental** dos scripts.
- Se quiserem **apenas** atualizar a skill sem portar código na mesma entrega, isso deixa a skill desalinhada com os arquivos `.py` existentes — o ideal é pelo menos **um** script Node substituindo o fluxo mais usado na primeira entrega.

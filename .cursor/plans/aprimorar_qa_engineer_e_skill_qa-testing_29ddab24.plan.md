---
name: Aprimorar QA Engineer e Skill qa-testing
overview: Consolidar o agente QA Engineer e a skill qa-testing incorporando o conteúdo de senior-qa (escrita de testes, Jest/RTL/Playwright, scripts e referências) e playwright-cli (execução de testes no browser), adicionar suporte a container Playwright para execução de testes pelo agente, e definir uso dos critérios de aceitação (Gherkin) das User Stories para geração de testes.
todos: []
isProject: false
---

# Aprimoramento do QA Engineer e da Skill qa-testing

## Contexto da análise

- **senior-qa**: foco em **escrever** testes (Jest, React Testing Library, Playwright para React/Next.js), com 3 scripts Python (gerador de suites, analisador de cobertura, scaffolder E2E), referências detalhadas (pirâmide de testes, padrões, boas práticas) e quick reference de RTL/Playwright/MSW.
- **playwright-cli**: foco em **executar** automação no browser (comandos `playwright-cli open/click/fill/snapshot` etc., mocking, tracing, vídeo). É uma CLI externa; o que interessa para qa-testing é o conceito de “rodar testes E2E em ambiente controlado” e boas práticas de geração de código (test-generation.md).
- **User Stories**: ficam em `outputs/artifacts/requirements/user-stories-ready-for-dev.md`, com critérios de aceitação em Gherkin (Dado/Quando/Então), definidos pela skill [user-story-decomposition](.cursor/skills/user-story-decomposition/SKILL.md) e pelo [gherkin-guide](.cursor/skills/user-story-decomposition/references/gherkin-guide.md).

---

## 1. Aprimorar o agente QA Engineer

**Arquivo:** [.cursor/agents/qa-engineer.md](.cursor/agents/qa-engineer.md)

- Incluir no **Processo de Trabalho** (após ler frontend/backend/requirements):
  - Ler User Stories em `outputs/artifacts/requirements/user-stories-ready-for-dev.md` (quando existirem).
  - Usar os critérios de aceitação (Gherkin) como base para casos de teste e testes E2E/aceitação.
- Incluir passo opcional: **Executar testes E2E no container Playwright** quando a skill qa-testing estiver configurada com Docker (ver seção 4).
- Atualizar **Artefatos Gerados** para mencionar testes derivados de ACs (e.g. `e2e/` com specs por user story quando aplicável).
- Manter dependências e validação atuais; adicionar item de validação: “Testes E2E/aceitação alinhados aos critérios das User Stories (quando disponíveis)”.

---

## 2. Expandir a skill qa-testing (SKILL.md)

**Arquivo:** [.cursor/skills/qa-testing/SKILL.md](.cursor/skills/qa-testing/SKILL.md)

- **Descrição (frontmatter):** Incluir termos como “escrever testes unitários e E2E”, “Jest”, “React Testing Library”, “Playwright”, “analisar cobertura”, “configurar Playwright”, “executar testes em container”.
- **Quando usar:** Incluir cenários de geração de testes a partir de User Stories/ACs, análise de cobertura, scaffold E2E, execução em container.
- **Seção nova: Insumos**
  - Indicar leitura de `outputs/artifacts/requirements/user-stories-ready-for-dev.md` quando existir; usar cada AC (Gherkin) como cenário testável.
- **Seção: Testes a partir de critérios de aceitação**
  - Instruir a mapear **Dado/Quando/Então** para steps de teste (unitário, integração ou E2E).
  - Um AC = um cenário (describe/it ou test()); manter nomenclatura alinhada ao ID do AC (ex.: “AC 01: Login bem-sucedido”).
  - Referenciar [gherkin-guide](.cursor/skills/user-story-decomposition/references/gherkin-guide.md) para sintaxe.
- **Seção: Ferramentas e padrões (incorporar de senior-qa)**
  - Pirâmide: unitário (Jest + RTL) > integração (RTL + MSW) > E2E (Playwright).
  - Comandos comuns: `npm test`, `npm test -- --coverage`, `npx playwright test`, `npx playwright test --ui`.
  - Referências internas: `references/testing_strategies.md`, `references/test_automation_patterns.md`, `references/qa_best_practices.md` (a serem copiados para qa-testing).
- **Seção: Execução de testes E2E (incorporar conceitos de playwright-cli)**
  - **Sempre** executar instalação (npm install/ci) e execução (npx playwright test, npm test) **dentro do container Playwright** (ver seção 4 e `references/playwright-docker.md`). No host só se usa Docker para subir o container e invocar comandos nele.
  - Locators preferidos: getByRole, getByLabel; referência a `references/execucao-playwright.md` (novo, baseado em test-generation + running-code do playwright-cli).
- **Seção: Scripts auxiliares**
  - Documentar os 3 scripts em `scripts/` (copiados de senior-qa): `test_suite_generator.py`, `coverage_analyzer.py`, `e2e_test_scaffolder.py` com uso resumido (uma linha de comando cada).
- **Outputs:** Manter lista atual; adicionar menção a `e2e/` quando testes E2E forem gerados, e a relatórios do Playwright (HTML report, trace) quando aplicável.
- **Referências:** Listar os novos arquivos em `references/` (strategies, patterns, best practices, execucao-playwright, e o template já existente).

---

## 3. Copiar referências e scripts de senior-qa e playwright-cli para qa-testing

**De senior-qa para qa-testing:**


| Origem                                             | Destino em qa-testing                               |
| -------------------------------------------------- | --------------------------------------------------- |
| `senior-qa/references/testing_strategies.md`       | `qa-testing/references/testing_strategies.md`       |
| `senior-qa/references/test_automation_patterns.md` | `qa-testing/references/test_automation_patterns.md` |
| `senior-qa/references/qa_best_practices.md`        | `qa-testing/references/qa_best_practices.md`        |
| `senior-qa/scripts/test_suite_generator.py`        | `qa-testing/scripts/test_suite_generator.py`        |
| `senior-qa/scripts/coverage_analyzer.py`           | `qa-testing/scripts/coverage_analyzer.py`           |
| `senior-qa/scripts/e2e_test_scaffolder.py`         | `qa-testing/scripts/e2e_test_scaffolder.py`         |


**De playwright-cli para qa-testing (conteúdo adaptado, não a CLI):**

- Criar **um** arquivo `qa-testing/references/execucao-playwright.md` que condense:
  - Geração de código a partir de ações (baseado em [playwright-cli/references/test-generation.md](.cursor/skills/playwright-cli/references/test-generation.md)): locators semânticos, adicionar assertions manualmente.
  - Trechos úteis de [running-code.md](.cursor/skills/playwright-cli/references/running-code.md) para cenários avançados (wait, storage state, run-code quando o projeto usar Playwright API diretamente).
  - Instrução: “Para executar a suíte E2E, use o container Playwright e rode **dentro dele** `npm ci` e `npx playwright test` (ver README do Docker). Nunca rodar npm/npx de Playwright no host.”

Não copiar os outros .md do playwright-cli (request-mocking, session-management, etc.) como arquivos separados; apenas incorporar o essencial em `execucao-playwright.md` se fizer sentido para o fluxo do agente.

---

## 4. Container Playwright na skill qa-testing

Objetivo: o agente (ou o usuário) poder subir um ambiente com Playwright e executar testes sem instalar Node/browsers na máquina.

**Regra obrigatória:** Toda instalação (**npm install**, **npm ci**) e toda execução (**npx playwright test**, **npx playwright install**, **npm test**, etc.) devem rodar **dentro** do container Playwright. O host não executa npm/npx para o contexto de testes E2E/Playwright; o agente sempre usa o container para esses comandos.

**Comunicação agente/skill ↔ Playwright no container**

- **Canal:** O agente (rodando no host, ex. no Cursor) **não** fala com o container por API nem por socket; a interação é via **shell (terminal)**.
- **Envio:** O agente dispara comandos **Docker** no host, por exemplo:
  - `docker run --rm -v ${PWD}:/app -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"`, ou
  - `docker compose run playwright sh -c "npm ci && npx playwright test"`.
- **Execução:** O Docker inicia (ou reutiliza) o container; **dentro** dele rodam `npm ci` e `npx playwright test`. O Playwright executa no processo do container; não há servidor HTTP nem MCP dentro da imagem.
- **Retorno:**
  - **Exit code** do comando (0 = sucesso, ≠0 = falha) é o que o agente usa para saber se os testes passaram.
  - **stdout/stderr** do processo dentro do container são exibidos no terminal do host; o agente lê esse output (log de testes, stack traces).
  - **Artefatos:** Relatórios e traces (`playwright-report/`, `test-results/`) são gravados **dentro** do container no diretório de trabalho; como o projeto do host está montado em **volume** (`-v ${PWD}:/app`), esses arquivos aparecem no host. O agente pode ler e referenciar, por exemplo, `playwright-report/index.html` ou `test-results/` no caminho do projeto.
- **Resumo:** Agente → executa `docker run`/`docker compose run` no host → container roda npm/npx → resultado via exit code, log no terminal e arquivos no volume. Nenhum serviço HTTP ou daemon no container é necessário.

**Estrutura a criar em `qa-testing/`:**

- `**docker/**` (ou na raiz da skill)
  - `**Dockerfile**`: imagem base `mcr.microsoft.com/playwright:v1.49.0-noble` (ou versão estável atual), Node 20 já presente na imagem. Instalação de dependências do projeto (npm install/ci) e execução de testes (npx playwright test, npm test) acontecem **dentro** do container — por exemplo montando o projeto em volume e rodando `npm ci && npx playwright test` no entrypoint ou via `docker run ... npm ci && npx playwright test`.
  - `**docker-compose.yml**` (opcional): serviço `playwright` que monta o código do projeto (volume); o agente executa **dentro** do container: `npm ci`, `npx playwright install` (se necessário), `npx playwright test` (e eventualmente `npm test` para unitários). Ex.: `docker compose run playwright sh -c "npm ci && npx playwright test"`.
  - `**.dockerignore**` (se aplicável): node_modules, .git, etc.
- `**references/playwright-docker.md**` (ou seção no README):
  - Deixar explícito: **npm e npx só dentro do container**; no host só se roda Docker (build, run, exec).
  - Como construir: `docker build -t qa-playwright ./docker` (contexto do projeto ou da skill conforme decisão).
  - Como instalar e rodar testes **no container**:
    - Projeto montado em volume: entrar no container ou rodar em um único comando, e **dentro** dele: `npm ci`, `npx playwright install --with-deps` (se for imagem mínima), `npx playwright test`. Ex.: `docker run --rm -v ${PWD}:/app -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test"`.
    - Ou usar docker-compose do projeto com comando que rode npm/npx apenas no serviço playwright.
  - Recomendar `--ipc=host` e `--init` conforme [documentação Playwright Docker](https://playwright.dev/docs/docker).
  - Instrução para o agente: “Sempre use o container para instalar (npm) e executar (npx/npm test). Nunca rodar npm ou npx de Playwright/Jest no host para esta suíte.”

---

## 5. Reaproveitamento dos critérios de aceitação nas User Stories

- Na **skill qa-testing** (já coberto no item 2):
  - Ler `outputs/artifacts/requirements/user-stories-ready-for-dev.md`.
  - Para cada User Story, para cada AC em Gherkin:
    - Gerar pelo menos um caso de teste (em `test-cases.md`) e, quando fizer sentido, um teste automatizado (E2E em `e2e/*.spec.ts` ou unitário/integração em `__tests__/`).
- No **agente** (já coberto no item 1):
  - Incluir explicitamente a leitura desse artefato e a validação de que os testes cobrem os ACs.

Não criar nova skill ou artefato; apenas garantir que o fluxo do agente + skill use esse caminho.

---

## 6. Resumo de arquivos

**Novos/alterados:**

- [.cursor/agents/qa-engineer.md](.cursor/agents/qa-engineer.md) – processo, validação, artefatos.
- [.cursor/skills/qa-testing/SKILL.md](.cursor/skills/qa-testing/SKILL.md) – expandido com insumos, ACs→testes, ferramentas, scripts, execução E2E, referências.
- [.cursor/skills/qa-testing/references/testing_strategies.md](.cursor/skills/qa-testing/references/testing_strategies.md) – cópia.
- [.cursor/skills/qa-testing/references/test_automation_patterns.md](.cursor/skills/qa-testing/references/test_automation_patterns.md) – cópia.
- [.cursor/skills/qa-testing/references/qa_best_practices.md](.cursor/skills/qa-testing/references/qa_best_practices.md) – cópia.
- [.cursor/skills/qa-testing/references/execucao-playwright.md](.cursor/skills/qa-testing/references/execucao-playwright.md) – novo (conteúdo derivado de playwright-cli).
- [.cursor/skills/qa-testing/references/playwright-docker.md](.cursor/skills/qa-testing/references/playwright-docker.md) – instruções do container (build, run, uso pelo agente).
- [.cursor/skills/qa-testing/scripts/test_suite_generator.py](.cursor/skills/qa-testing/scripts/test_suite_generator.py) – cópia.
- [.cursor/skills/qa-testing/scripts/coverage_analyzer.py](.cursor/skills/qa-testing/scripts/coverage_analyzer.py) – cópia.
- [.cursor/skills/qa-testing/scripts/e2e_test_scaffolder.py](.cursor/skills/qa-testing/scripts/e2e_test_scaffolder.py) – cópia.
- [.cursor/skills/qa-testing/docker/Dockerfile](.cursor/skills/qa-testing/docker/Dockerfile) – novo.
- [.cursor/skills/qa-testing/docker/README.md](.cursor/skills/qa-testing/docker/README.md) (ou equivalente) – como buildar, rodar e usar pelo agente.

**Não criar:** `_meta.json` para qa-testing a menos que o projeto já use; não duplicar `user-story-template.md` nem `gherkin-guide.md` (manter referência ao path da skill user-story-decomposition).

---

## Ordem sugerida de implementação

1. Copiar os 3 referências e os 3 scripts de senior-qa para qa-testing.
2. Criar `references/execucao-playwright.md` e `references/playwright-docker.md`.
3. Criar `docker/Dockerfile` e `docker/README.md` (ou docker-compose + README).
4. Atualizar `qa-testing/SKILL.md` com todas as seções novas e links para referências/scripts/docker.
5. Atualizar `qa-engineer.md` com leitura de user stories, uso de ACs e execução no container.

Após isso, as skills `senior-qa` e `playwright-cli` podem ser removidas do projeto; o agente e a skill qa-testing passam a concentrar escrita e execução de testes, uso de ACs e container Playwright.
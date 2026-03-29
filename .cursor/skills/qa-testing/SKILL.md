---
name: qa-testing
description: Gera e executa testes unitários, de integração e E2E (Playwright) de forma incremental por User Story. Todos os testes rodam no container Playwright. Artefatos centralizados em testing/. Use após a implementação de cada User Story para gerar testes, executar a suíte cumulativa e emitir relatório consolidado.
---

# QA Testing

Skill para geração e execução incremental de testes por User Story, com suíte cumulativa de unitários, integração e E2E rodando no container Playwright.

## Quando Usar

- Após a implementação de cada User Story
- Para adicionar ou atualizar testes de código recém-entregue
- Para revalidar a suíte regressiva após refatorações
- Para análise de cobertura e geração de relatórios

## Insumos

- **User Story alvo:** ID, critérios de aceitação (ACs) em formato Gherkin. Quando existir, leia `requirements/user-stories-ready-for-dev.md`.
- **Código entregue:** caminhos dos arquivos alterados em `frontend/`, `backend/`, etc.
- **Suíte existente:** testes já presentes em `testing/unit/`, `testing/integration/` e `testing/e2e/` de stories anteriores.

## Estrutura canônica de `testing/`

Todos os artefatos de teste ficam organizados sob `testing/` no projeto:

```text
testing/
├── unit/                    # Testes unitários (Jest + RTL)
├── integration/             # Testes de integração (RTL + MSW)
├── e2e/                     # Specs Playwright
├── playwright.config.ts     # Configuração do Playwright (acessível ao container)
├── playwright-report/       # Relatórios HTML do Playwright (gerados pelo container)
├── test-results/            # Artefatos de execução — traces, screenshots, vídeos
├── test-strategy.md         # Estratégia de testes (criada/atualizada 1x)
├── test-cases.md            # Casos de teste acumulados por story
├── test-results.md          # Relatório consolidado da última execução
├── bug-reports.md           # Bugs encontrados na rodada atual
└── test-coverage.md         # Cobertura acumulada da suíte
```

**Regras de estrutura:**

- Novos testes entram nos subdiretórios correspondentes sem substituir os existentes.
- O `playwright.config.ts` deve referenciar `e2e/` como `testDir` e `playwright-report/` / `test-results/` como diretórios de saída.
- O volume montado no container deve tornar `testing/` acessível para que o Playwright encontre config, specs e grave relatórios.

## Testes a partir de critérios de aceitação

- Mapeie **Dado / Quando / Então** para etapas de teste (unitário, integração ou E2E).
- Um AC = um cenário de teste: use `describe`/`it` (Jest) ou `test()` (Playwright) por AC, nomeando com o ID do AC (ex.: "AC 01: Login bem-sucedido").
- Crie casos para requisitos não-funcionais quando necessário.
- Para sintaxe Gherkin e exemplos, consulte `.cursor/skills/user-story-decomposition/references/gherkin-guide.md`.

## Ferramentas e padrões

- **Pirâmide de testes:** unitário (Jest + RTL) > integração (RTL + MSW) > E2E (Playwright). Consulte `references/testing_strategies.md`.
- **Padrões de automação e boas práticas:** `references/test_automation_patterns.md`, `references/qa_best_practices.md`.
- Locators preferidos para E2E: `getByRole`, `getByLabel`. Geração de código e cenários avançados: `references/execucao-playwright.md`.

## Execução no container

**Regra:** todos os testes (unitários, integração e E2E) rodam **dentro do container Playwright**. No host, o agente só executa comandos Docker.

### Comandos de execução

O projeto é montado em volume e o `working_dir` é a raiz do projeto; o container acessa `testing/` com configs e specs:

```bash
# Unitários + Integração (Jest)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# E2E (Playwright) — config e specs em testing/
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"

# Suíte completa (unit + integração + E2E)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"
```

- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.
- **`--ipc=host`** e **`--init`**: recomendados pela documentação do Playwright.

### Suíte cumulativa

A execução é **cumulativa por story**: cada invocação gera testes novos e reexecuta os já existentes de stories anteriores. O Jest varre automaticamente `testing/unit/` e `testing/integration/`; o Playwright varre `testing/e2e/` via `testDir` no config.

### Resultados e artefatos

Após a execução no container:

- **Exit code** (0 = sucesso, ≠0 = falha)
- **stdout/stderr** no terminal do host
- **Relatórios Playwright** em `testing/playwright-report/` e `testing/test-results/` (gravados pelo container no volume montado)
- **Cobertura Jest** no diretório configurado (ex.: `coverage/`)

Ver `references/playwright-docker.md` e `docker/README.md` para build e uso detalhado do container.

## Scripts auxiliares

Scripts Python em `scripts/` (executados no host, não no container):

- **test_suite_generator.py** — gera stubs de testes Jest + RTL a partir de componentes React:
  - `python scripts/test_suite_generator.py src/components/ --output testing/unit/`
- **coverage_analyzer.py** — analisa relatório de cobertura Jest/Istanbul e sugere melhorias:
  - `python scripts/coverage_analyzer.py coverage/coverage-final.json --threshold 80`
- **e2e_test_scaffolder.py** — gera testes Playwright a partir de rotas Next.js (app/ ou pages/):
  - `python scripts/e2e_test_scaffolder.py src/app/ --output testing/e2e/`

## Fluxo de trabalho por User Story

1. **Identificar ACs** — leia os critérios de aceitação da story alvo
2. **Gerar/atualizar casos de teste** — documente em `testing/test-cases.md` os cenários derivados dos ACs
3. **Gerar testes automatizados** — crie arquivos em `testing/unit/`, `testing/integration/` e `testing/e2e/` alinhados aos ACs
4. **Executar suíte cumulativa** — rode todos os testes (novos + existentes) no container Playwright
5. **Analisar resultados** — verifique exit code, stdout, relatórios em `testing/playwright-report/` e cobertura
6. **Documentar bugs** — registre falhas em `testing/bug-reports.md` com steps to reproduce e severidade
7. **Atualizar cobertura** — analise e documente em `testing/test-coverage.md`
8. **Emitir relatório consolidado** — salve em `testing/test-results.md` separando resultados por nível (unit, integração, E2E)

## Relatório consolidado (`testing/test-results.md`)

O relatório deve conter:

- **Story validada:** ID e título da User Story
- **Resumo:** total de testes, passaram, falharam, pulados — separados por nível
- **Detalhes de falhas:** nome do teste, nível, mensagem de erro, AC relacionado
- **Cobertura:** percentuais de statements, branches, functions, lines
- **Bugs encontrados:** referência a `testing/bug-reports.md`
- **Regressões:** testes de stories anteriores que falharam na execução atual

## Referências

- `references/test-strategy-template.md` — Template de estratégia
- `references/testing_strategies.md` — Pirâmide, tipos de teste, cobertura, CI/CD
- `references/test_automation_patterns.md` — Page Objects, factories, MSW, fixtures
- `references/qa_best_practices.md` — Código testável, nomes, AAA, isolamento, flakiness
- `references/execucao-playwright.md` — Locators, assertions, execução no container
- `references/playwright-docker.md` — Build, run e uso do container pelo agente
- `docker/README.md` — Instruções de build e execução do container

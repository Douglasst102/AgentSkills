---
name: qa-testing
description: Cria estratégia de testes, gera casos de teste, escreve testes unitários e E2E (Jest, React Testing Library, Playwright), analisa cobertura, configura Playwright e executa testes em container. Use quando precisar planejar testes, criar casos de teste a partir de User Stories/ACs, gerar ou executar testes automatizados, ou validar qualidade do software.
---

# QA Testing

Skill para planejamento e execução completa de testes, incluindo geração a partir de critérios de aceitação (Gherkin) e execução E2E no container Playwright.

## Quando Usar

- Criação de estratégia de testes
- Geração de casos de teste a partir de User Stories e critérios de aceitação (Gherkin)
- Escrita de testes unitários (Jest, React Testing Library) e E2E (Playwright)
- Análise de cobertura e identificação de lacunas
- Scaffold de testes E2E a partir de rotas (Next.js/React)
- Configuração do Playwright e execução de testes em container
- Validação de qualidade e geração de relatórios

## Insumos

- **User Stories "Ready for Dev":** quando existir, leia `outputs/artifacts/requirements/user-stories-ready-for-dev.md`. Use cada critério de aceitação (AC) em formato Gherkin como cenário testável para casos de teste e testes automatizados.
- Requisitos e artefatos de frontend/backend em `outputs/artifacts/` conforme o fluxo do agente.

## Testes a partir de critérios de aceitação

- Crie casos para requisitos não-funcionais se necessário.
- Mapeie **Dado / Quando / Então** para etapas de teste (unitário, integração ou E2E).
- Um AC = um cenário de teste: use um `describe`/`it` (Jest) ou `test()` (Playwright) por AC e mantenha o nome alinhado ao ID do AC (ex.: "AC 01: Login bem-sucedido").
- Para sintaxe Gherkin e exemplos, consulte o guia em `.cursor/skills/user-story-decomposition/references/gherkin-guide.md`.

## Ferramentas e padrões

- **Pirâmide de testes:** unitário (Jest + RTL) > integração (RTL + MSW) > E2E (Playwright). Consulte `references/testing_strategies.md`.
- **Comandos comuns (rodar sempre dentro do container Playwright para E2E):** `npm test`, `npm test -- --coverage`, `npx playwright test`, `npx playwright test --ui`. Ver seção "Execução de testes E2E" e `references/playwright-docker.md`.
- **Padrões de automação e boas práticas:** `references/test_automation_patterns.md`, `references/qa_best_practices.md`.

## Execução de testes E2E

- **Sempre** executar instalação (`npm install` / `npm ci`) e execução (`npx playwright test`, `npm test`) **dentro do container Playwright**. No host use apenas Docker para subir o container e invocar comandos. Ver `references/playwright-docker.md` e `docker/README.md`.
- Locators preferidos: `getByRole`, `getByLabel`; geração de código e cenários avançados: `references/execucao-playwright.md`.

## Scripts auxiliares

Scripts Python em `scripts/` (executados no host, não no container):

- **test_suite_generator.py** – gera stubs de testes Jest + RTL a partir de componentes React:
  - `python scripts/test_suite_generator.py src/components/ --output __tests__/`
- **coverage_analyzer.py** – analisa relatório de cobertura Jest/Istanbul e sugere melhorias:
  - `python scripts/coverage_analyzer.py coverage/coverage-final.json --threshold 80`
- **e2e_test_scaffolder.py** – gera testes Playwright a partir de rotas Next.js (app/ ou pages/):
  - `python scripts/e2e_test_scaffolder.py src/app/ --output e2e/`

## Instruções gerais

1. **Estratégia de Testes** – Defina níveis (unitário, integração, E2E), ferramentas, critérios de aceitação e cobertura mínima. Use `references/test-strategy-template.md` e `references/testing_strategies.md`.
2. **Casos de Teste** – Gere casos a partir de requisitos e dos ACs das User Stories; documente pré/pós-condições.
3. **Testes Automatizados** – Crie unitários e de integração; para E2E use Playwright e execute no container (ver acima).
4. **Execução** – Testes E2E e npm/npx somente dentro do container; documente resultados e falhas.
5. **Relatório de Bugs** – Documente bugs com steps to reproduce e severidade.
6. **Cobertura** – Analise relatórios (ex.: com `coverage_analyzer.py`) e documente métricas.

## Outputs

Salve em `outputs/artifacts/testing/`:

- `test-strategy.md` – Estratégia de testes
- `test-cases.md` – Casos de teste
- `test-scripts/` – Scripts de teste
- `test-results.md` – Resultados
- `bug-reports.md` – Relatório de bugs
- `test-coverage.md` – Cobertura

Quando houver testes E2E gerados: diretório `e2e/` (specs Playwright); após execução no container, relatórios em `playwright-report/` e `test-results/` no projeto.

## Referências

- `references/test-strategy-template.md` – Template de estratégia
- `references/testing_strategies.md` – Pirâmide, tipos de teste, cobertura, CI/CD
- `references/test_automation_patterns.md` – Page Objects, factories, MSW, fixtures
- `references/qa_best_practices.md` – Código testável, nomes, AAA, isolamento, flakiness
- `references/execucao-playwright.md` – Locators, assertions, execução no container
- `references/playwright-docker.md` – Build, run e uso do container pelo agente
- `docker/README.md` – Instruções de build e execução do container

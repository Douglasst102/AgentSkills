# Template de Estratégia de Testes

## 1. Objetivos

- Garantir qualidade do software de forma incremental, validando cada User Story
- Validar requisitos funcionais e não-funcionais
- Manter uma suíte regressiva cumulativa

## 2. Níveis de Teste

### Testes Unitários
- Objetivo: Validar unidades individuais (funções, hooks, componentes isolados sem dependências externas)
- Ferramentas: **Jest + React Testing Library** (não usa Playwright)
- Localização: `testing/unit/`
- Cobertura mínima: 80%

### Testes de Integração
- Objetivo: Validar integração entre componentes, APIs mockadas e contextos
- Ferramentas: **Jest + React Testing Library + MSW** (não usa Playwright)
- Localização: `testing/integration/`
- Escopo: Componentes com dependências, chamadas API mockadas com MSW, formulários completos

### Testes E2E
- Objetivo: Validar fluxos completos do usuário no browser real
- Ferramentas: **Playwright** (`@playwright/test`) — exclusivo para este nível
- Localização: `testing/e2e/`
- Configuração: `testing/playwright.config.ts` (caminhos relativos a `testing/`)
- Escopo: Jornadas críticas derivadas dos ACs das User Stories

## 3. Execução

- Todos os testes rodam **dentro do container de QA** (imagem oficial Playwright com Node.js)
- Unitários e integração usam `npm test` (Jest); E2E usa `npx playwright test`
- Execução é **cumulativa**: novos testes + testes de stories anteriores
- Relatórios Playwright: `testing/playwright-report/`, `testing/test-results/`
- Cobertura Jest: `coverage/`

## 4. Casos de Teste

### Estrutura
- ID do caso (alinhado ao AC da User Story)
- Descrição
- Pré-condições
- Steps (Dado / Quando / Então)
- Resultado esperado
- Nível (unit, integração ou E2E)
- Prioridade

## 5. Critérios de Aceitação

- Todos os testes passando (unit, integração e E2E)
- Cobertura mínima atingida
- Bugs críticos documentados
- Relatório consolidado gerado em `testing/test-results.md`

## 6. Artefatos

- `testing/test-strategy.md` — este documento
- `testing/test-cases.md` — casos de teste acumulados
- `testing/test-results.md` — relatório consolidado da última execução
- `testing/bug-reports.md` — bugs encontrados
- `testing/test-coverage.md` — cobertura acumulada

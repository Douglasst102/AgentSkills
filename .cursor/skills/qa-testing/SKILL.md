---
name: qa-testing
description: Gera e executa testes unitários, de integração e E2E (Playwright) de forma incremental por User Story. Unitários e integração rodam com Jest no container; E2E roda com Playwright no container. Scripts auxiliares em Node.js. Artefatos centralizados em testing/. Use após a implementação de cada User Story para gerar testes, executar a suíte cumulativa e emitir relatório consolidado.
---

# QA Testing

Skill para geração e execução incremental de testes por User Story, com suíte cumulativa de unitários, integração e E2E executada no container de QA.

## Quando Usar

- Após a implementação de cada User Story
- Para adicionar ou atualizar testes de código recém-entregue
- Para revalidar a suíte regressiva após refatorações
- Para análise de cobertura e geração de relatórios

## Insumos

- **User Story alvo:** ID, critérios de aceitação (ACs) em formato Gherkin. Quando existir, leia `requirements/user-stories-ready-for-dev.md`.
- **Código entregue:** caminhos dos arquivos alterados em `frontend/`, `backend/`, etc.
- **Suíte existente:** testes já presentes em `testing/unit/`, `testing/integration/` e `testing/e2e/` de stories anteriores.

## Práticas de plataforma

Não commitar segredos em fixtures ou configs de teste; usar variáveis de ambiente de exemplo ou mocks. Fluxos **JWT**/login devem seguir contratos em `technical/` e decisões em `architecture/`. E2E contra BFF/backend conforme URLs definidas no projeto.

## Ferramentas por nível — distinção obrigatória

| Nível | Ferramenta | Localização |
|-------|-----------|-------------|
| Unitário | **Jest + RTL** | `testing/unit/` |
| Integração | **Jest + RTL + MSW** | `testing/integration/` |
| E2E | **Playwright** (`@playwright/test`) | `testing/e2e/` |

**Playwright é exclusivo para E2E.** Testes unitários e de integração usam Jest.

**Um só container de QA (imagem Playwright oficial):** Jest e Playwright **não** são a mesma ferramenta — são dois processos distintos no **mesmo** container (`npm test` executa o Jest; `npx playwright test` executa o runner do Playwright). A imagem traz Node.js e browsers; o Jest entra pelo `package.json` do projeto (`devDependencies`) e é instalado com `npm ci` **dentro** do container.

### Host sem Node.js na máquina

Quem usa só a IDE e Docker no host **não precisa instalar** Node, npm, Jest nem Playwright localmente. O fluxo é: `docker run` (ou `docker compose run`) → dentro do container → `npm ci` instala Jest e demais deps do `package.json` → `npm test` / `npx playwright test`. O código do projeto monta em volume em `/app`.

### Jest precisa da aplicação (frontend/backend) rodando?

| Tipo | Precisa de containers da app rodando? |
|------|----------------------------------------|
| **Unitário e integração (Jest)** | Em geral **não**. Roda em Node/jsdom; integração de UI costuma usar **MSW** para mockar HTTP, sem chamar o backend real. |
| **E2E (Playwright)** | **Sim** — o browser precisa de uma URL acessível (`baseURL`). Opções: (1) `webServer` no `playwright.config.ts` sobe `npm run dev` (ou build) dentro do mesmo `docker run` que já monta o repo; (2) `docker compose` com serviços `frontend` / `backend` e `playwright` na mesma rede, com `BASE_URL=http://frontend:3000` (exemplo em `docker/docker-compose.example.yml`). |

**Backend com Jest** (API, serviços): costuma mockar DB e integrações com `jest.mock` ou container de banco só para testes — fora do escopo mínimo desta skill; documente no `testing/test-strategy.md` do projeto.

### Monorepo ou frontend/backend em pastas separadas

Para **Jest** do frontend, monte a raiz do pacote que contém o `package.json` dos testes (ex.: `-v "${PWD}/frontend:/app" -w /app`). Para o backend, outro `docker run` com `-v "${PWD}/backend:/app"`. O E2E costuma ficar na raiz do monorepo ou no pacote que orquestra a suíte; ajuste `working_dir` e `--config` conforme a estrutura.

### O que automatizar em cada nível

- **Unitário** — lógica pura, hooks, funções utilitárias, componentes isolados sem dependências externas. Um AC que valida cálculo ou transformação de dados → teste unitário.
- **Integração** — fluxos que compõem dois ou mais módulos: componente + contexto, formulário + handler de submissão, chamada de API mockada com MSW. Um AC que valida o comportamento de um formulário com feedback de erro → teste de integração.
- **E2E** — jornadas críticas completas no browser real: login end-to-end, checkout, fluxos que atravessam múltiplas páginas ou dependem de navegação real. Um AC que valida o fluxo inteiro de autenticação com redirecionamento → teste E2E.

Consulte `references/testing_strategies.md` para a pirâmide completa e `references/test_automation_patterns.md` para padrões de cada nível.

## Estrutura canônica de `testing/`

Todos os artefatos de teste ficam organizados sob `testing/` no projeto:

```text
testing/
├── unit/                    # Testes unitários (Jest + RTL)
├── integration/             # Testes de integração (Jest + RTL + MSW)
├── e2e/                     # Specs Playwright
├── playwright.config.ts     # Configuração do Playwright (paths relativos a testing/)
├── playwright-report/       # Relatórios HTML do Playwright (gerados pelo container)
├── test-results/            # Artefatos E2E — traces, screenshots, vídeos (gerados pelo container)
├── test-strategy.md         # Estratégia de testes (criada/atualizada 1x)
├── test-cases.md            # Casos de teste acumulados por story
├── test-results.md          # Relatório consolidado da última execução
├── bug-reports.md           # Bugs encontrados na rodada atual
└── test-coverage.md         # Cobertura acumulada da suíte
```

**Regras de estrutura:**

- Novos testes entram nos subdiretórios correspondentes sem substituir os existentes.
- O `playwright.config.ts` usa caminhos **relativos ao próprio arquivo** (que está em `testing/`): `testDir: './e2e'`, `outputDir: './test-results'`, reporter HTML em `'./playwright-report'`.
- O volume Docker monta a raiz do projeto em `/app`; `testing/` fica acessível como `/app/testing/` dentro do container.

### Exemplo mínimo de `testing/playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  reporter: [['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Opcional: sobe a app antes dos E2E quando tudo roda no mesmo container com o repo em /app
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
```

Os caminhos `./e2e`, `./test-results` e `./playwright-report` são relativos a `testing/`, resultando em `testing/e2e/`, `testing/test-results/` e `testing/playwright-report/` no host via volume montado.

## Testes a partir de critérios de aceitação

- Mapeie **Dado / Quando / Então** para etapas de teste (unitário, integração ou E2E).
- Um AC = um cenário de teste: use `describe`/`it` (Jest) ou `test()` (Playwright) por AC, nomeando com o ID do AC (ex.: "AC 01: Login bem-sucedido").
- Crie casos para requisitos não-funcionais quando necessário.
- Para sintaxe Gherkin e exemplos, consulte `.cursor/skills/user-story-decomposition/references/gherkin-guide.md`.

## Execução no container

**Regra:** todos os testes (unitários, integração e E2E) rodam **dentro do container de QA**. No host, o agente só executa comandos Docker.

### Comandos de execução

O projeto é montado em volume (`-v "$PWD:/app"` / PowerShell: `-v "${PWD}:/app"`) e o `working_dir` é `/app`. O container acessa `testing/` com configs e specs:

```bash
# Unitários + Integração (Jest)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage"

# E2E (Playwright) — config, specs e artefatos em testing/
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npx playwright test --config=testing/playwright.config.ts"

# Suíte completa (unit + integração + E2E)
docker run --rm -v "${PWD}:/app" -w /app --ipc=host --init qa-playwright sh -c "npm ci && npm test -- --coverage && npx playwright test --config=testing/playwright.config.ts"
```

- **Windows (PowerShell):** use `$PWD` em vez de `${PWD}`.
- **`--ipc=host`** e **`--init`**: recomendados pela documentação oficial do Playwright para estabilidade dos browsers.

### Checklist de montagem do container para E2E

| Item | Verificação |
|------|------------|
| Volume | `-v "${PWD}:/app"` monta a raiz do repositório; `testing/` fica em `/app/testing/` |
| Working dir | `-w /app` — o container inicia na raiz do projeto |
| Config flag | `--config=testing/playwright.config.ts` — aponta para o arquivo de config dentro do volume |
| testDir | `./e2e` no config → `testing/e2e/` no host |
| outputDir | `./test-results` no config → `testing/test-results/` no host |
| Reporter HTML | `./playwright-report` no config → `testing/playwright-report/` no host |
| .dockerignore | Garantir que `testing/` **não** esteja listado no `.dockerignore` do projeto |
| node_modules | `npm ci` roda dentro do container; **não** é obrigatório ter `node_modules` no host antes do run |
| E2E e app | Garantir URL alcançável (`webServer` no config ou stack `compose` com frontend/backend). Ver `docker/docker-compose.example.yml` nesta skill |

**Windows:** montar só o código e usar volume anônimo para `node_modules` no Compose evita lentidão e binários nativos misturados host/container. Exemplo em `docker/docker-compose.example.yml`.

### Suíte cumulativa

A execução é **cumulativa por story**: cada invocação gera testes novos e reexecuta os já existentes de stories anteriores. O Jest varre automaticamente `testing/unit/` e `testing/integration/`; o Playwright varre `testing/e2e/` via `testDir` no config.

### Resultados e artefatos

Após a execução no container:

- **Exit code** (0 = sucesso, ≠0 = falha)
- **stdout/stderr** no terminal do host
- **Relatórios Playwright** em `testing/playwright-report/` e `testing/test-results/` (gravados pelo container via volume)
- **Cobertura Jest** no diretório configurado (ex.: `coverage/`)

Ver `references/playwright-docker.md` e `docker/README.md` para build e uso detalhado do container.

## Scripts auxiliares (Node.js)

Scripts em Node.js (ESM) em `scripts/` — executados no **host**, não no container:

- **test_suite_generator.mjs** — gera stubs de testes Jest + RTL a partir de componentes React:
  - `node .cursor/skills/qa-testing/scripts/test_suite_generator.mjs src/components/ --output testing/unit/`
- **coverage_analyzer.mjs** — analisa relatório de cobertura Jest/Istanbul e sugere melhorias:
  - `node .cursor/skills/qa-testing/scripts/coverage_analyzer.mjs coverage/coverage-final.json --threshold 80`
- **e2e_test_scaffolder.mjs** — gera testes Playwright a partir de rotas Next.js (app/ ou pages/):
  - `node .cursor/skills/qa-testing/scripts/e2e_test_scaffolder.mjs src/app/ --output testing/e2e/`

Dependências: apenas APIs nativas do Node.js (`fs`, `path`). **Sem Node no host:** rode o mesmo script via container, por exemplo:

`docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim node .cursor/skills/qa-testing/scripts/coverage_analyzer.mjs coverage/coverage-final.json`

(Ajuste o caminho do script se a skill estiver em outro lugar no repo.)

## Fluxo de trabalho por User Story

1. **Identificar ACs** — leia os critérios de aceitação da story alvo
2. **Gerar/atualizar casos de teste** — documente em `testing/test-cases.md` os cenários derivados dos ACs
3. **Gerar testes automatizados** — crie arquivos em `testing/unit/`, `testing/integration/` e `testing/e2e/` alinhados aos ACs
4. **Executar suíte cumulativa** — rode todos os testes (novos + existentes) no container de QA
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
- `docker/docker-compose.example.yml` — Modelo Compose para E2E com rede e `BASE_URL` (frontend/backend em containers)

---
name: Revisão QA incremental
overview: Revisar o agente `qa-engineer` e a skill `qa-testing` para que suportem um ciclo de QA por user story, com geração e execução cumulativa de testes unitários, integração e E2E, todos executados no container Playwright e com estrutura centralizada em `testing/`.
todos:
  - id: reposicionar-agente
    content: Revisar `qa-engineer.md` para refletir uso por user story e regressão cumulativa
    status: completed
  - id: padronizar-estrutura-testing
    content: Definir e documentar a estrutura canônica de `testing/` para unit, integração, E2E, configs e relatórios
    status: completed
  - id: alinhar-execucao-container
    content: Atualizar a skill e as referências Docker/Playwright para execução integral no container com paths centralizados
    status: completed
  - id: padronizar-relatorios
    content: Unificar outputs do agente e da skill para relatório consolidado, bugs e cobertura
    status: completed
  - id: checar-scripts-auxiliares
    content: Verificar se scripts Python precisam ajuste de documentação ou defaults para a nova estrutura
    status: completed
isProject: false
---

# Revisão do fluxo de QA incremental

## Objetivo

Ajustar o agente e a skill para refletirem um fluxo operacional claro: após cada user story implementada, o agente deve gerar testes unitários, de integração e E2E, executar a suíte cumulativa e emitir relatório consolidado.

## Diagnóstico atual

- `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\agents\qa-engineer.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\agents\qa-engineer.md)` descreve um QA de fechamento de projeto, não um QA por story.
- `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\SKILL.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\SKILL.md)` já fala em unitário, integração e E2E, mas não fixa o fluxo incremental nem a estrutura canônica sob `testing/`.
- `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\docker\README.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\docker\README.md)` e `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\references\playwright-docker.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\references\playwright-docker.md)` assumem o projeto inteiro montado em `/app` e espalham artefatos fora de `testing/`.

## Revisões propostas

### 1. Reposicionar o agente para uso por user story

Atualizar `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\agents\qa-engineer.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\agents\qa-engineer.md)` para:

- trocar o gatilho de "após frontend/backend/security completos" por "após cada user story implementada";
- explicitar insumos mínimos: ID da story, ACs/Gherkin, caminhos alterados e contexto do código entregue;
- definir que a execução é cumulativa: gerar testes novos e reexecutar os já existentes da suíte;
- mudar o encerramento de "pronto para entrega" para "story validada e suíte regressiva atualizada".

### 2. Formalizar a estrutura padrão dentro de `testing/`

Ajustar `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\SKILL.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\SKILL.md)` para fixar uma convenção única, por exemplo:

- `testing/unit/`
- `testing/integration/`
- `testing/e2e/`
- `testing/playwright.config.ts`
- `testing/playwright-report/`
- `testing/test-results/`
- `testing/test-results.md`
- `testing/test-coverage.md`

Isso elimina a ambiguidade atual entre `testing/`, `e2e/`, `playwright-report/` e `test-results/` na raiz.

### 3. Definir a política de execução incremental

Documentar na skill que:

- unitários e integração também rodam no container Playwright, conforme sua decisão;
- a suíte é cumulativa por story: novos testes entram sem substituir os anteriores;
- a execução deve contemplar a suíte já existente mais os testes gerados para a story atual;
- o relatório final precisa separar claramente resultados de unit, integração e E2E.

### 4. Alinhar a documentação Docker/Playwright ao novo layout

Revisar `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\docker\README.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\docker\README.md)` e `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\references\playwright-docker.md](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\references\playwright-docker.md)` para:

- centralizar specs, config e artefatos do Playwright em `testing/`;
- explicitar o volume e diretório de trabalho usados pelo container para que `testing/` seja o ponto de acesso dos scripts e configs;
- ajustar exemplos de comandos e caminhos de relatório ao novo padrão.

### 5. Revisar coerência dos outputs e do relatório

Padronizar entre agente e skill quais artefatos são obrigatórios por execução:

- estratégia e casos podem existir como base reutilizável;
- `test-results.md` deve consolidar execução cumulativa por story;
- `bug-reports.md` deve registrar falhas encontradas na rodada atual;
- `test-coverage.md` deve refletir o estado acumulado da suíte.

### 6. Verificar impacto nos scripts auxiliares

Validar se os scripts em `[c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\scripts](c:\Users\dougl\OneDrive\Documents\Codes\AgentSkills\.cursor\skills\qa-testing\scripts)` precisam ao menos de ajuste documental para apontarem saídas sob `testing/`, especialmente:

- `test_suite_generator.py`
- `e2e_test_scaffolder.py`
- `coverage_analyzer.py`

## Resultado esperado

Ao fim da revisão, o agente e a skill devem descrever de forma consistente um fluxo de QA incremental por user story, com todas as suítes executadas no container Playwright e com assets, configuração e relatórios organizados integralmente sob `testing/`.
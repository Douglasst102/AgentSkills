# Prompts padrão do fluxo

Cole o bloco ao ativar o agente. Substitua os campos entre colchetes. O agente deve ler a definição em `.cursor/agents/` e seguir a skill do papel até o fim, gravar **todos** os artefatos listados e só encerrar com o checklist de validação do próprio agente satisfeito. Atualize `.cursor/project-context.json` ao concluir. Idioma dos artefatos: português. Não invente fato ausente: registre a lacuna.

Ordem: Business Analyst → Process Analyst → Requirements Engineer → Software Architect → Technical Analyst → DevOps Engineer → UI/UX Designer → Data Engineer. A cada User Story: Backend → Frontend → Code Reviewer → Security Engineer → QA → Codebase Documenter.

---



## *Obs: Rules

Configurar `.cursor/rules/ambiente.mdc`

```text
---
alwaysApply: true
---
# Ambiente

- Estamos em um ambiente Windows.
- A aplicação roda em containers, usando Docker Desktop.
- Sempre que precisar de recompilar ou instalar alguma coisa (npm, npx...) execute no respectivo container.
- Sempre que precisar fazer alterações ou consultas nos databases lembre que estão em containers.
- Quando fizer alterações críticas nos containers lembre de persistí-las no docker-compose ou dockerfile caso necessário.

```



## 1. Business Analyst

Skill: `business-analysis`. Pasta: `business/`.

```text
/business-analyst faça uma análise completa do negócio e gere todos os artefatos previstos.

others_artifacts/ (colocar toda documentação / informação inicial aqui)
legacy/ (Se existir)

[descrição do negócio / processo / sistema / objetivos / restrições / público]
```



## 2. Process Analyst

Skill: `process-mapping`. Pasta: `processes/`. Depende de `business/`.

```text
/process-analyst faça uma análise completa dos processos e gere todos os artefatos previstos.

business/
```



## 3. Requirements Engineer

Skills: `requirements-spec` e `user-story-decomposition`. Pasta: `requirements/`. Depende de `business/` e `processes/`.

```text
/requirements-engineer faça uma análise completa das especificações, gere todos os artefatos previstos e detalhe bem as tarefas técnicas em user-stories-ready-for-dev.

business/
processes/
```



## 4. Software Architect

Skill: `architecture-design`. Pasta: `architecture/`. Depende de `requirements/`.

*Obs: **Modo PLAN ---------------------------------**

```text
/software-architect faça uma análise completa de arquitetura de software e gere todos os artefatos previstos.

requirements/
```



## 5. Technical Analyst

Skill: `technical-spec`. Pasta: `technical/`. Depende de `architecture/`. 

```text
/technical-analyst faça uma análise técnica detalhada e gere todos os artefatos previstos.

architecture/
```



```text
/technical-analyst agora definida a arquitetura, refine, detalhe e especifique melhor as atividades técnicas de cada U.S. em user-stories-ready-for-dev.md agrupadas em Backend, Frontend, Data e Test.

architecture/
@requirements/user-stories-ready-for-dev.md
```



## 6. DevOps Engineer

Skill: `devops-infra`. Compose na raiz; o restante em `infrastructure/`. Depende de `architecture/` e `technical/`. 

```text
/devops-engineer faça uma análise detalhada da infraestrutura necessária ao projeto e gere todos os artefatos previstos. Verifique também se há atualizações do Docker Desktop, WSL, docker-compose 2.0 e outra dependencias se necessário. Depois suba todos os serviços e deixe o Frontend e o Backend prontos para implementação já com um "hello world" de teste por exemplo.

architecture/
technical/
```



## 7. UI/UX Designer

Skills: `uiux-design` e `interface-design`. Pasta: `design/`. Depende de `requirements/`, `architecture/`, `technical/` e `infrastructure/`. 

```text
/uiux-designer faça uma análise detalhada do design do projeto e gere todos os artefatos previstos.
Crie um documento listando as páginas (frontend), suas estruturas e componentes para servir de insumo para a criação do prototipo do layout posteriormente.

requirements/
architecture/
technical/
infrastructure/
```


```text
/penpot-prototyping (ou com Figma) gere no Penpot os layouts de todo o projeto (ou da fase, ou do MVP...).

design/
```

ou

```text
/uiux-designer gere as páginas mockadas de todo o projeto (ou da fase, ou do MVP...).

design/
```



## 8. Data Engineer

Skill: `data-engineering`. Pasta: `data/`. Depende de `architecture/`, `technical/`, `infrastructure/` e `design/`. Encerra a fase de design.

```text
/data-engineer faça uma análise detalhada voltada para dados e gere os artefatos previstos. Gere a estrutura de dados incial do projeto (sql) e suba para o banco de dados.

requirements/
architecture/
technical/
infrastructure/
design/
```



## A partir daqui, repita o ciclo **para cada User Story**, nesta ordem.



## 9. Backend Developer

Skill: `backend-dev`. Pasta: `backend/`. Depende de `technical/`, `infrastructure/`, `data/` e da User Story.

Somente na primeira vez:

```text
/backend-developer e /frontend-developer verifique se o ambiente e infraestrutura estão adquados para dar início ao desenvolvimento do projeto.

technical/
infrastructure/
data/
design/
```

A cada **User Story:**

```text
/backend-developer implemente suas tarefas da US-00x.
Implemente também as tarefas Data chamando o /data-engineer se necessário.

@requirements/user-stories-ready-for-dev.md:130-192
```



## 10. Frontend Developer

Skill: `frontend-dev`. Pasta: `frontend/`. Depende de `design/` e `technical/`.

```text
/frontend-developer implemente suas tarefas da US-00x.

@requirements/user-stories-ready-for-dev.md:130-192
```



## 11. Code Reviewer

Skill: `code-review`. Pasta: `revision/<RUN_ID>/` apenas.

```text
/code-reviewer revise o que foi implementado da US-00x
```

```text
/backend-developer /frontend-developer /security-engineer corrija os apontamentos do relatório se necessário, cada qual na sua respectiva área.

@revision/2026-05-05-1200/RELATORIO-UNIFICADO.md
```



## 12. Security Engineer

Skill: `security-audit`. Pasta: `security/`. 

```text
/security-engineer revise o que foi implementado da US-00x e faça as correções de segurança se necessário.
```



## 13. QA Engineer

Skill: `qa-testing`. Pasta: `testing/`. Depois da segurança da mesma história. Suíte cumulativa no container de QA.

```text
/qa-engineer revise o que foi implementado dos testes da US-00x, implemente o que faltou, execute os testes e documente os resultados. O relatório deve ser incremental, sempre mostrando os resultados acumulados (testes anteriores), o da US atual e o somatório total.

@requirements/user-stories-ready-for-dev.md
```



## 14. Codebase Documenter

Skill: `codebase-documenter`. Último da história, depois do QA.

```text
/codebase-documenter documente o que foi implementado na US-00x, e atualize seus status.
```

Testa, commita e vai para próxima US.

---



## Fora da cadeia — Legacy Analyst

Discovery manual, antes do fluxo. Não atualiza `project-context.json` e não inicia a cadeia. Skill: `legacy-discovery`. Pasta: `legacy/`.

```text
/legacy-analyst faça uma análise completa do software antigo para modernização ou reescrita, extrair regras de negócio, inventariar features/páginas, mapear schema SQL as-is, ou preparar handoff manual para agentes do AgentSkills.

[descrição do negócio / processo / sistema / objetivos / restrições / público]
```


---
marp: true
theme: default
paginate: true
---

# Engenharia de Software com Agentes de IA

**O que é este repositório**

- **Agentes** (`.cursor/agents/`) — papéis especializados que o Cursor aciona no fluxo de desenvolvimento
- **Skills** (`.cursor/skills/`) — instruções + referências que padronizam *como* cada agente trabalha
- **Artefatos** — documentos e código gerados em pastas do projeto (`business/`, `architecture/`, etc.)

---

# Índice da apresentação

| # | Slide | Conteúdo |
|---|-------|----------|
| 1 | Título | Conceito agente + skill |
| 2 | Ciclo completo | 5 fases, 14 agentes, ordem de execução |
| 3–16 | Um por agente | Papel · Skill · Saída · Momento no fluxo |
| 17 | Resumo | Mapa agente → skill |

---

# Slide 2 — Ciclo completo (14 agentes)

## As 5 fases

| Fase | Agentes | Pasta principal |
|------|---------|-----------------|
| **1. Descoberta** | Business Analyst → Process Analyst | `business/` · `processes/` |
| **2. Requisitos** | Requirements Engineer | `requirements/` |
| **3. Design** | Software Architect → Technical Analyst → DevOps → UI/UX → Data Engineer | `architecture/` · `technical/` · `infrastructure/` · `design/` · `data/` |
| **4. Construção** | A cada User Story: Backend → Frontend | `backend/` · `frontend/` |
| **5. Qualidade** | A cada User Story: Code Reviewer → Security → QA → Codebase Documenter | `revision/` · `security/` · `testing/` |

## Ordem de execução

```
Negócio → Processos → Requisitos → Arquitetura
    → Spec técnica → DevOps → UI/UX → Dados
    → a cada User Story:
        Backend → Frontend → Revisão → Segurança → QA → Documentação
```

---

# Slide 3 — Business Analyst

| | |
|---|---|
| **Fase** | 1 · Descoberta |
| **Posição** | Primeiro agente do pipeline |

## O que faz
- Entende necessidades do cliente e stakeholders
- Define visão do produto, objetivos e métricas de sucesso
- Compara estado atual vs. desejado (gap analysis)

## Skill
`business-analysis`

## Artefatos em `business/`
`product-vision.md` · `stakeholder-matrix.md` · `business-requirements.md` · `gap-analysis.md`

## Quando acionar
Início de projeto novo ou definição de escopo

---

# Slide 4 — Process Analyst

| | |
|---|---|
| **Fase** | 1 · Descoberta |
| **Depende de** | Business Analyst |

## O que faz
- Mapeia processos de negócio atuais (BPMN)
- Identifica gargalos e processos críticos
- Propõe melhorias e automações

## Skill
`process-mapping`

## Artefatos em `processes/`
`process-map.md` · `critical-processes-matrix.md` · diagramas BPMN · `improvement-opportunities.md`

## Quando acionar
Após análise de negócios concluída

---

# Slide 5 — Requirements Engineer

| | |
|---|---|
| **Fase** | 2 · Requisitos |
| **Depende de** | Business Analyst · Process Analyst |

## O que faz
- Produz SRS com requisitos funcionais e não funcionais
- Prioriza backlog (ex.: MoSCoW) e matriz de rastreabilidade
- Decompõe em User Stories com critérios Gherkin, na mesma passagem, antes da arquitetura

## Skills
| Skill | Uso |
|-------|-----|
| `requirements-spec` | SRS, RF/RNF, backlog |
| `user-story-decomposition` | Histórias “Ready for Dev”, tarefas por área |

## Artefatos em `requirements/`
`srs.md` · `prioritized-backlog.md` · `user-stories-ready-for-dev.md`

---

# Slide 6 — Software Architect

| | |
|---|---|
| **Fase** | 3 · Design |
| **Depende de** | Requirements Engineer |

## O que faz
- Define arquitetura, stack e padrões (monólito, microsserviços, etc.)
- Cria diagramas C4 e ADRs com alternativas e trade-offs
- Especifica APIs principais e atributos de qualidade

## Skill
`architecture-design`

## Artefatos em `architecture/`
`architecture-document.md` · `c4-diagrams/` · `adrs/` · `technology-stack.md`

## Quando acionar
Requisitos e User Stories prontos. O próximo é o Technical Analyst

---

# Slide 7 — Technical Analyst

| | |
|---|---|
| **Fase** | 3 · Design |
| **Depende de** | Software Architect |
| **Em seguida** | DevOps Engineer |

## O que faz
- Detalha especificações técnicas por componente
- Define contratos OpenAPI/Swagger e modelos de dados (ERD)
- Documenta integrações, BFF, CORS e casos de uso técnicos

## Skill
`technical-spec`

## Artefatos em `technical/`
`technical-specifications.md` · `api-contracts/` · `data-models/` · `integration-specs.md`

---

# Slide 8 — DevOps Engineer

| | |
|---|---|
| **Fase** | 3 · Design |
| **Depende de** | Software Architect · Technical Analyst |
| **Em seguida** | UI/UX Designer |

## O que faz
- Cria Dockerfiles, docker-compose (dev/prod) e manifests Kubernetes
- Configura pipelines CI/CD e ambientes (dev, staging, prod)
- Mantém `.env.example` — sem secrets no repositório

## Skill
`devops-infra`

## Artefatos em `infrastructure/`
`dockerfiles/` · `docker-compose.*.yml` · `kubernetes/` · `ci-cd/` · `README.md`

---

# Slide 9 — UI/UX Designer

| | |
|---|---|
| **Fase** | 3 · Design |
| **Depende de** | Requirements Engineer · Arquitetura · Spec técnica · DevOps |
| **Em seguida** | Data Engineer |

## O que faz
- Cria wireframes, mockups e design system
- Define mapa de páginas, acessibilidade (WCAG) e mobile-first
- Especifica feedback visual (loading, erro, sucesso)

## Skills
| Skill | Uso |
|-------|-----|
| `uiux-design` | Fluxo de design, componentes, acessibilidade |
| `interface-design` | Craft visual de apps e painéis (não sites de marketing) |

## Artefatos em `design/`
`wireframes/` · `mockups/` · `design-system.md` · `component-specs.md`

---

# Slide 10 — Data Engineer

| | |
|---|---|
| **Fase** | 3 · Design |
| **Depende de** | Arquitetura · Spec técnica · Infra · UI/UX |

## O que faz
- Modela entidades, relacionamentos e regras de persistência
- Produz glossário, DDL e migrações alinhados às ADRs
- Trata auth, tokens e políticas de expiração no modelo de dados

## Skill
`data-engineering`

## Artefatos em `data/`
`modelo-dados.md` · scripts de esquema/migração · glossário

## Próximo passo
Ciclo por User Story, começando no Backend Developer

---

# Slide 11 — Backend Developer

| | |
|---|---|
| **Fase** | 4 · Construção |
| **Quando** | A cada User Story, primeiro da história |
| **Depende de** | Technical Analyst · DevOps · Data Engineer · User Stories |

## O que faz
- Implementa APIs REST/GraphQL e lógica de negócio (BFF)
- Persistência, integrações externas e autenticação (JWT)
- OpenAPI público, CORS e padrão Facade para composição

## Skill
`backend-dev`

## Artefatos em `backend/`
Código-fonte · testes unitários/integração · documentação de API

## Aciona em seguida
Frontend Developer, na mesma User Story

---

# Slide 12 — Frontend Developer

| | |
|---|---|
| **Fase** | 4 · Construção |
| **Quando** | A cada User Story, depois do backend |
| **Depende de** | UI/UX Designer · Technical Analyst · Backend da história |

## O que faz
- Implementa interface conforme design system
- Estado, rotas, integração com APIs do backend
- Acessibilidade, performance (Core Web Vitals) e SSG/SSR conforme arquitetura
- **Sem** persistência de negócio no cliente — dados só via backend

## Skill
`frontend-dev`

## Artefatos em `frontend/`
Componentes · páginas · testes de componente

## Aciona em seguida
Code Reviewer, na mesma User Story

---

# Slide 13 — Code Reviewer

| | |
|---|---|
| **Fase** | 5 · Qualidade |
| **Quando** | A cada User Story, depois do frontend |

## O que faz
- Revisa o código da história em **três lentes** independentes
- Consolida achados e indica **quem corrige** (frontend, backend, DevOps, etc.)

## Skill
`code-review`

## Três lentes → quatro arquivos em `revision/<RUN_ID>/`
1. `regressao-impacto.md`
2. `seguranca.md`
3. `clean-code.md`
4. `RELATORIO-UNIFICADO.md`

## Aciona em seguida
Security Engineer, na mesma User Story

---

# Slide 14 — Security Engineer

| | |
|---|---|
| **Fase** | 5 · Qualidade |
| **Quando** | A cada User Story, depois da revisão de código |

## O que faz
- Audita código e configurações (AppSec) da história
- Revisa auth, tokens, dependências e OWASP Top 10
- Valida práticas: `.env`, JWT, hash de senha, sem secrets no código

## Skill
`security-audit`

## Artefatos em `security/`
Relatório de vulnerabilidades · recomendações de correção

## Aciona em seguida
QA Engineer, na mesma User Story

---

# Slide 15 — QA Engineer

| | |
|---|---|
| **Fase** | 5 · Qualidade |
| **Quando** | A cada User Story, depois da auditoria de segurança |

## O que faz
- Gera e executa suíte cumulativa (novos + regressão)
- Emite relatório consolidado de cobertura e falhas

## Skill
`qa-testing`

## Ferramentas por nível
| Nível | Ferramenta | Pasta |
|-------|------------|-------|
| Unitário | Jest | `testing/unit/` |
| Integração | Jest + MSW | `testing/integration/` |
| E2E | Playwright | `testing/e2e/` |

*Execução no container de QA (Node + Playwright).*

## Aciona em seguida
Codebase Documenter, na mesma User Story

---

# Slide 16 — Codebase Documenter

| | |
|---|---|
| **Fase** | 5 · Qualidade |
| **Quando** | A cada User Story, por último, depois do QA |

## O que faz
- Documentação inline (comentários, docstrings) do que a história entregou
- READMEs, guias de API e arquitetura
- Alinha docs ao OpenAPI público do backend

## Skill
`codebase-documenter`

## Artefatos
READMEs e guias nas pastas do componente (`backend/documentation/`, `frontend/documentation/`)

## Depois
Próxima User Story, recomeçando no Backend Developer

---

# Slide 17 — Resumo: agente → skill

| # | Agente | Skill(s) |
|---|--------|----------|
| 1 | Business Analyst | `business-analysis` |
| 2 | Process Analyst | `process-mapping` |
| 3 | Requirements Engineer | `requirements-spec` · `user-story-decomposition` |
| 4 | Software Architect | `architecture-design` |
| 5 | Technical Analyst | `technical-spec` |
| 6 | DevOps Engineer | `devops-infra` |
| 7 | UI/UX Designer | `uiux-design` · `interface-design` |
| 8 | Data Engineer | `data-engineering` |
| 9 | Backend Developer | `backend-dev` |
| 10 | Frontend Developer | `frontend-dev` |
| 11 | Code Reviewer | `code-review` |
| 12 | Security Engineer | `security-audit` |
| 13 | QA Engineer | `qa-testing` |
| 14 | Codebase Documenter | `codebase-documenter` |

## Mensagem final

> **Agente** = *quem* executa no fluxo · **Skill** = *como* executar com qualidade e rastreabilidade

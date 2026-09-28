---
name: dashboard-builder
description: >-
  Specifica dashboards analíticos customizáveis por usuário (grade, widgets,
  gráficos representativos, visões salvas) e gera briefs frontend/backend
  completos. Use quando o usuário mencionar dashboard, widgets, gráficos,
  layout customizável, visões salvas, KPI, chart builder ou painel ajustável.
disable-model-invocation: true
---

# Dashboard Builder

Skill autônoma para spec de dashboards ajustáveis e insumos de UI + API
(layout por usuário, widgets, queries de métrica). Usada **junto** com o
`frontend-developer` do AgentSkills — sem integrar a cadeia e sem agente próprio.

**Não depende** de outras skills em runtime. A pesquisa na web aberta foi só
para calibrar estes princípios.

## Quando Usar

- Home/analytics com KPIs, séries temporais, comparações e tabelas
- Layout redimensionável, paleta de widgets, visões salvas por usuário
- Gráficos que devem **representar uma pergunta**, não decorar a página
- Briefs para UI do canvas e para API de layout + agregação

**Não usar** para data story estática, slides, ou um único gráfico isolado sem canvas.

## Princípios

1. **Pergunta primeiro** — todo widget declara a pergunta analítica; o tipo de gráfico segue a pergunta ([chart-catalog.md](references/chart-catalog.md))
2. **Defaults fortes** — role/persona define o layout inicial; customização é escape hatch, não canvas em branco
3. **Backend autoritativo** — layout, visões e preferências no servidor (`userId + dashboardKey + viewId`); cache client só volátil/otimista. Não usar `localStorage` como fonte da verdade
4. **Layout ≠ filtro ≠ query** — três estados distintos ([data-contracts.md](references/data-contracts.md))
5. **Modo edição explícito** (default) — leitura separada de composição; save / cancel / reset; confirmar se o save é pessoal ou compartilhado
6. **Sem lib obrigatória** — documentar API de componente; grid/chart libs só se o projeto já usar ou o usuário pedir
7. **Stack adaptável** — exemplos React como referência
8. **Animação e hover obrigatórios** — entrada do mark (ex. barras crescem da baseline) + tooltip/destaque no cursor; ver [visualization-principles.md](references/visualization-principles.md). `prefers-reduced-motion` desliga a animação, não o detalhe
9. **Sem código backend** — brief + schema + OpenAPI; implementação fica com agentes posteriores

## Entradas necessárias

Antes de avançar, confirme com o usuário:

| Entrada | Exemplos |
|---------|----------|
| Páginas / rotas | `/`, `/analytics`, `/ops` |
| Personas / papéis | admin, operador, gestor |
| Perguntas analíticas | “Como está a receita vs. meta esta semana?” |
| Stack UI | React/Vue/Svelte + design system |
| Fontes de dados | warehouse, API existente, Cube/dbt, nenhum |
| Escopo de customização | layout, tipos de gráfico, métricas, filtros, tema, visões |
| Restrições | a11y, mobile, widgets obrigatórios, feature flags |
| API existente | endpoints de métrica ou de preferência, se houver |

Se faltar rota **ou** pelo menos uma pergunta analítica, peça antes de gerar artefatos.

## Fluxo de Trabalho

Copie e acompanhe o checklist:

```
Dashboard Builder Progress:
- [ ] 1. Intake
- [ ] 2. Spec do dashboard
- [ ] 3. Catálogo de widgets
- [ ] 4. Brief frontend
- [ ] 5. Brief backend
- [ ] 6. Handoff AgentSkills
```

### 1. Intake

- Registrar rotas, personas, perguntas, stack, fontes, restrições
- Verificar se já existe API de métricas, semantic layer ou design system de charts
- Definir escopo: só docs em `dashboard/` (esta skill não implementa o app)

### 2. Spec do dashboard

- Seguir [visualization-principles.md](references/visualization-principles.md) e [layout-patterns.md](references/layout-patterns.md)
- Hierarquia: KPI (primário) → gráficos de contexto → tabela/detalhe
- Defaults por papel vs. o que o usuário pode mudar
- Produzir `dashboard-spec.md`

### 3. Catálogo de widgets

- Para cada widget: pergunta, família FT (tempo, magnitude, ranking, …), tipo, query, tamanho default, estados (loading/empty/error/stale)
- Recusar gráfico sem pergunta ou tipo só “para variar”
- Produzir `widget-catalog.md`

### 4. Brief frontend

- Shell: `DashboardProvider`, grid, toolbar (visão, intervalo, Customize), `WidgetRegistry`
- Hooks: visões (GET/PUT), queries de métrica, debounce de save
- A11y: teclado no builder, tabela equivalente, reduced motion, cor não único canal
- Charts: animação de entrada + hover (tooltip, highlight); equivalentes de teclado/foco
- Produzir `frontend-brief.md`

### 5. Brief backend

- Schema: Dashboard, SavedView, WidgetInstance, MetricQuery
- Endpoints de layout/visões **e** de agregação; cache; auth; limites
- Produzir `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
- **Não** gerar implementação de API/código de servidor

### 6. Handoff

- Preencher `handoff-agentskills.md` com [references/handoff-agentskills.md](references/handoff-agentskills.md)
- Orientar ativação manual do `frontend-developer`, depois technical/data/backend

## Outputs

Salve em `others_artifacts/dashboard/` (templates em [references/artifact-templates.md](references/artifact-templates.md)):

| Arquivo | Conteúdo |
|---------|----------|
| `dashboard-spec.md` | Páginas, hierarquia, defaults, customização |
| `widget-catalog.md` | Widgets, perguntas, tipos, queries |
| `frontend-brief.md` | Componentes, hooks, a11y, testes |
| `backend-brief.md` | Endpoints, contratos, auth, cache, erros |
| `data-model.md` | Entidades e índices lógicos |
| `openapi-sketch.yaml` | Esboço OpenAPI (views + metrics) |
| `handoff-agentskills.md` | Ordem e prompts para agentes |

## Colaboração manual (AgentSkills)

Esta skill **não** invoca agentes. Ordem sugerida:

1. **Frontend Developer** ← `dashboard-spec.md`, `widget-catalog.md`, `frontend-brief.md`
2. **Technical Analyst** / **Data Engineer** ← `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
3. **Backend Developer** ← mesmos artefatos + contratos técnicos

Detalhes: [references/handoff-agentskills.md](references/handoff-agentskills.md)

## Referências

- [chart-catalog.md](references/chart-catalog.md)
- [layout-patterns.md](references/layout-patterns.md)
- [visualization-principles.md](references/visualization-principles.md)
- [data-contracts.md](references/data-contracts.md)
- [artifact-templates.md](references/artifact-templates.md)
- [handoff-agentskills.md](references/handoff-agentskills.md)
- [README.md](README.md) — instalação e uso fora da cadeia AgentSkills

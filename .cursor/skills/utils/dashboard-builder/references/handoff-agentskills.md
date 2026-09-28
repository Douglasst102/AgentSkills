# Handoff manual para AgentSkills

Esta skill **não** integra a cadeia do AgentSkills. O usuário cita `dashboard-builder`, gera `dashboard/`, e ativa agentes manualmente (ex.: `/activate-agent frontend-developer`).

## Mapa artefato → agente

| Artefato `dashboard/` | Agente AgentSkills | Pasta típica de saída | O que extrair |
|------------------------|--------------------|------------------------|---------------|
| `dashboard-spec.md` | frontend-developer, uiux-designer | `frontend/`, `design/` | páginas, hierarquia, defaults, customização |
| `widget-catalog.md` | frontend-developer, uiux-designer | `frontend/`, `design/` | tipos, perguntas, queries, tamanhos |
| `frontend-brief.md` | frontend-developer | `frontend/` | componentes, hooks, a11y, testes |
| `backend-brief.md` | technical-analyst, backend-developer | `technical/`, `backend/` | endpoints, auth, cache, erros |
| `data-model.md` | data-engineer, technical-analyst | `data/`, `technical/` | entidades, unicidade, migração |
| `openapi-sketch.yaml` | technical-analyst, backend-developer | `technical/` | contrato OpenAPI |
| `handoff-agentskills.md` | (orquestração humana) | — | ordem e prompts |

## Ordem sugerida

1. **frontend-developer** — canvas, grid, registry de widgets, integração com API (mock/stub se API ainda não existir)
2. **technical-analyst** e/ou **data-engineer** — formalizar contrato, modelo e camada de métricas a partir dos briefs
3. **backend-developer** — persistência de visões e endpoint de query

Paralelo possível: frontend com stub de `/metrics/query` + backend em paralelo após o OpenAPI sketch estável.

## Regras de consumo

1. Layout e visões são **dados de domínio** — fonte autoritativa no backend (não `localStorage`)
2. Layout, filtros e queries são estados separados — não colapsar num único blob opaco sem schema
3. Não tratar `openapi-sketch.yaml` como contrato final até o Technical Analyst validar
4. Não alterar `project-context.json` / cadeia a partir desta skill
5. Libs de grid/chart de terceiros só se o projeto já usar ou o usuário pedir
6. Agregações oficiais no servidor; o cliente não redefine KPIs

## Prompt-base — Frontend Developer

```
Contexto: dashboard analítico customizável por usuário. A pasta dashboard/ contém
spec e briefs gerados pela skill dashboard-builder.

Instruções:
- Implemente o canvas conforme dashboard-spec.md, widget-catalog.md e frontend-brief.md.
- Consuma (ou stub) o contrato em openapi-sketch.yaml; layout e visões autoritativos no backend.
- Não use localStorage como fonte de verdade do layout.
- Separe layout, filtros globais e queries de métrica.
- Respeite a11y: teclado no builder, tabela equivalente, cor não único canal, reduced motion.
- Charts: animação de entrada (barras crescem da baseline; linhas desenham) e hover (tooltip, highlight, crosshair). Sem grow se prefers-reduced-motion; tooltip no foco/teclado.
- Siga o design system e a skill frontend-dev do projeto.
- Artefatos prioritários: dashboard-spec.md, widget-catalog.md, frontend-brief.md.

Objetivo: entregar shell + grid + registry de widgets na rota [dashboardKey / rota].
```

## Prompt-base — Technical / Data / Backend

```
Contexto: persistência de visões de dashboard (user × dashboardKey × view) e
API de agregação (measures, dimensions, filters, time grain).
Artefatos em dashboard/: backend-brief.md, data-model.md, openapi-sketch.yaml.

Instruções:
- Formalize/implemente API e persistência conforme os briefs.
- PUT de visão idempotente; conflito via version; auth via JWT/sessão existente.
- /metrics/query aplica row-level security; não devolver SQL ao cliente.
- Não invente campos de PII além do userId autenticado.

Objetivo desta ativação: [contrato técnico | DDL/migração | implementação API].
```

## Checklist pós-handoff (usuário)

- [ ] `dashboard/` revisado (perguntas, widgetTypes, chaves estáveis)
- [ ] Frontend Developer implementou canvas + integração
- [ ] Contrato OpenAPI validado (Technical Analyst se aplicável)
- [ ] Data/Backend persistiram visões e queries
- [ ] Default por papel funciona sem customização; save pessoal não sobrescreve shared

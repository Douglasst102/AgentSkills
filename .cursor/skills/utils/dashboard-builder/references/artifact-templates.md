# Templates de artefatos (`dashboard/`)

Preencher um arquivo por seção. Remover placeholders `[...]`.

---

## `dashboard-spec.md`

```markdown
# Dashboard Spec — [Nome]

## Metadados
- dashboardKey: [...]
- rotas: [...]
- stack UI: [...]
- personas: [...]
- data: [AAAA-MM-DD]

## Objetivo
[Uma frase: que decisões o dashboard acelera]

## Hierarquia
1. Primário (KPIs): [...]
2. Contexto (gráficos): [...]
3. Detalhe: [...]

## Defaults por papel
| Papel | Visão inicial | Widgets obrigatórios |
|-------|---------------|----------------------|
| [...] | [...] | [...] |

## Customização permitida
- Layout (mover/redimensionar): sim/não
- Add/remove widgets: sim/não + catálogo
- Tipo de gráfico: sim/não (allowlist)
- Filtros / intervalo: [...]
- Tema: [...]
- Escopos de save: personal | role_default | shared

## Filtros globais
| id | tipo | aplica a |
|----|------|----------|
| timeRange | dateRange | todos |
| [...] | [...] | [...] |

## Edit mode
[explícito (default) | sempre arrastável — justificar]
Save / cancel / reset: [...]
Mobile: empilhar por priority

## Critérios de aceite
- [ ] 5s: usuário identifica os KPIs primários
- [ ] Todo widget tem pergunta no spec
- [ ] Reset restaura default do papel sem limpar sessão de filtros acidentalmente
- [ ] Charts: grow/draw na primeira carga + tooltip no hover/foco
```

---

## `widget-catalog.md`

```markdown
# Widget Catalog — [dashboardKey]

| id | pergunta | widgetType | measures | dimensions | grain | minW×minH | obrigatório |
|----|----------|------------|----------|------------|-------|-----------|-------------|
| w_revenue | [...] | kpi | [...] | — | day | 3×2 | sim/não |

## Notas de escolha
- [Por que não donut em w_x]
- [Top N + outros em ranking]

## Estados por widget
loading | empty | error | stale | forbidden | retired
```

---

## `frontend-brief.md`

```markdown
# Frontend Brief — Dashboard [dashboardKey]

## Escopo
Implementar canvas, grid, registry de widgets e integração de visões/queries.
Não implementar backend.

## Stack e design system
[...]

## Componentes a criar / reutilizar
| Componente | Responsabilidade |
|------------|------------------|
| DashboardProvider | visão atual, edit mode, unsaved |
| DashboardToolbar | visões, time range, Customize, save |
| DashboardFilterBar | filtros globais |
| DashboardGrid | layout, DnD só em edit |
| WidgetFrame | título, freshness, ações, a11y |
| WidgetRegistry | widgetType → componente |
| Chart* / Kpi / DataTable | marks; tabela equivalente; enter animation + hover |

## Hook / serviço
- `useDashboardView(dashboardKey, viewId)` — GET
- `saveDashboardView(payload)` — PUT
- `useMetricQuery(query)` — POST /metrics/query
- Cache: React Query/SWR volátil; layout otimista no drag

## Integração na rota
1. Provider no layout da página
2. Fetch visão (ou default do papel)
3. Prefetch KPIs
4. Customize → edit mode → save com escopo

## Animação e hover
[por widgetType: grow da baseline / line draw / count-up; tooltip; highlight; reduced-motion]
Duração entrada: [400–700 ms]; refresh: [150–250 ms ou sem re-grow]

## A11y e mobile
[checklist apontando layout-patterns + visualization-principles]
- [ ] prefers-reduced-motion: sem grow; tooltip no foco permanece
- [ ] Tooltip no teclado igual ao hover; Escape fecha
- [ ] Touch: tap1 tooltip, tap2 drill

## Testes sugeridos
- [ ] Default renderiza sem customização prévia
- [ ] Save pessoal não altera visão shared
- [ ] Cancel descarta layout unsaved
- [ ] Teclado move widget e anuncia posição
- [ ] Widget 403 mostra card de permissão, sem dados
- [ ] Filtro global refaz queries dos widgets inscritos
- [ ] Barras crescem da baseline no primeiro load (e não com reduced-motion)
- [ ] Hover/foco mostra tooltip com valor+unidade e atenua séries irmãs

## Artefatos relacionados
- dashboard-spec.md, widget-catalog.md, openapi-sketch.yaml
```

---

## `backend-brief.md`

```markdown
# Backend Brief — Dashboard [dashboardKey]

## Objetivo
API de visões (layout) e de agregação de métricas.
Este brief NÃO inclui código de implementação.

## Auth
[JWT / sessão — userId do token; RLS em measures]

## Endpoints
| Método | Path | Descrição |
|--------|------|-----------|
| GET | /dashboards/{dashboardKey} | Template + catálogo |
| GET | /dashboards/{dashboardKey}/views | Lista |
| GET | /dashboards/{dashboardKey}/views/{viewId} | Documento |
| PUT | /dashboards/{dashboardKey}/views/{viewId} | Upsert |
| POST | /dashboards/{dashboardKey}/views | Save as |
| DELETE | /dashboards/{dashboardKey}/views/{viewId} | Remover pessoal |
| POST | /metrics/query | Agregação |
| GET | /metrics/meta | Catálogo de membros (opcional) |

## Contratos
Ver openapi-sketch.yaml e data-contracts.md.

## Regras de negócio
- Idempotência do PUT; 409 se version divergente
- scope=shared só com permissão
- Widgets obrigatórios não removíveis
- Query: allowlist de measures; limit; timeout
- Sem PII além do userId autenticado

## Erros
| Código | Quando |
|--------|--------|
| 401 | Não autenticado |
| 403 | Measure/widget/escopo negado |
| 400 | Query ou layout inválido |
| 404 | Dashboard ou view |
| 409 | Conflito de version |
| 429 | Rate limit |

## Cache e observabilidade
[TTL, lastRefreshTime, métricas de latência/erro]
```

---

## `data-model.md`

```markdown
# Data Model — Dashboard views

## Entidade DashboardView

| Campo | Tipo lógico | Obrigatório | Notas |
|-------|-------------|-------------|-------|
| id | UUID | sim | PK = viewId |
| userId | string/UUID | sim* | nulo se scope=shared de sistema |
| dashboardKey | string | sim | max 128 |
| name | string | sim | |
| scope | enum | sim | personal \| role_default \| shared |
| roleKey | string \| null | não | para role_default |
| layout | json | sim | LayoutItem[] |
| widgets | json | sim | WidgetInstance[] |
| defaultFilters | json | não | |
| schemaVersion | int | sim | |
| version | int | sim | occupancy lock |
| createdAt | datetime | sim | |
| updatedAt | datetime | sim | |

## Índices / unicidade
- UNIQUE (userId, dashboardKey, id) para personal
- Índice (dashboardKey, scope, roleKey)

## Notas de migração
[SGBD do projeto / jsonb vs tabelas normalizadas de widgets]
```

---

## `openapi-sketch.yaml`

```yaml
openapi: 3.0.3
info:
  title: Dashboard Views and Metrics API
  version: 0.1.0
paths:
  /dashboards/{dashboardKey}/views/{viewId}:
    get:
      summary: Get saved view
      parameters:
        - in: path
          name: dashboardKey
          required: true
          schema: { type: string }
        - in: path
          name: viewId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: View document
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardView'
        '401':
          description: Unauthorized
        '404':
          description: Not found
    put:
      summary: Upsert saved view
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DashboardViewInput'
      responses:
        '200':
          description: Saved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardView'
        '400':
          description: Invalid body
        '401':
          description: Unauthorized
        '403':
          description: Forbidden scope or widget
        '409':
          description: Version conflict
  /metrics/query:
    post:
      summary: Run metric aggregation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MetricQuery'
      responses:
        '200':
          description: Result set
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetricResult'
        '400':
          description: Invalid query
        '401':
          description: Unauthorized
        '403':
          description: Measure not allowed
components:
  schemas:
    LayoutItem:
      type: object
      required: [i, x, y, w, h]
      properties:
        i: { type: string }
        x: { type: integer }
        y: { type: integer }
        w: { type: integer }
        h: { type: integer }
        minW: { type: integer }
        minH: { type: integer }
        priority: { type: integer }
    WidgetInstance:
      type: object
      required: [id, widgetType, query]
      properties:
        id: { type: string }
        widgetType: { type: string }
        title: { type: string }
        query:
          $ref: '#/components/schemas/MetricQuery'
    DashboardView:
      type: object
      required: [viewId, dashboardKey, scope, layout, widgets, schemaVersion, version]
      properties:
        viewId: { type: string }
        dashboardKey: { type: string }
        name: { type: string }
        scope:
          type: string
          enum: [personal, role_default, shared]
        layout:
          type: array
          items:
            $ref: '#/components/schemas/LayoutItem'
        widgets:
          type: array
          items:
            $ref: '#/components/schemas/WidgetInstance'
        defaultFilters: { type: object }
        schemaVersion: { type: integer }
        version: { type: integer }
        updatedAt: { type: string, format: date-time }
    DashboardViewInput:
      type: object
      required: [name, scope, layout, widgets, version]
      properties:
        name: { type: string }
        scope:
          type: string
          enum: [personal, role_default, shared]
        layout:
          type: array
          items:
            $ref: '#/components/schemas/LayoutItem'
        widgets:
          type: array
          items:
            $ref: '#/components/schemas/WidgetInstance'
        defaultFilters: { type: object }
        version: { type: integer }
    MetricQuery:
      type: object
      required: [measures]
      properties:
        measures:
          type: array
          items: { type: string }
        dimensions:
          type: array
          items: { type: string }
        filters:
          type: array
          items:
            type: object
            properties:
              member: { type: string }
              operator: { type: string }
              values:
                type: array
                items: { type: string }
        timeDimensions:
          type: array
          items:
            type: object
            properties:
              dimension: { type: string }
              dateRange:
                type: array
                items: { type: string }
              granularity: { type: string }
        limit: { type: integer }
        timezone: { type: string }
    MetricResult:
      type: object
      required: [data]
      properties:
        data:
          type: array
          items: { type: object }
        lastRefreshTime: { type: string, format: date-time }
        annotation: { type: object }
```

---

## `handoff-agentskills.md`

```markdown
# Handoff AgentSkills — Dashboard [dashboardKey]

## Artefatos prontos
- [ ] dashboard-spec.md
- [ ] widget-catalog.md
- [ ] frontend-brief.md
- [ ] backend-brief.md
- [ ] data-model.md
- [ ] openapi-sketch.yaml

## Ordem
1. frontend-developer — canvas e widgets
2. technical-analyst / data-engineer — contrato e modelo
3. backend-developer — visões + /metrics/query

## Prompt frontend (copiar)
Ver references/handoff-agentskills.md
```

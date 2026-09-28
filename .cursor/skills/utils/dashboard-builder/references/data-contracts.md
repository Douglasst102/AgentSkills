# Contratos de dados (layout, visões, métricas)

Três estados **separados**. Misturá-los é o anti-padrão mais comum (UX Patterns, Metabase, Superset, Cube).

| Estado | O que persiste | Quem é dono | Não é |
|--------|----------------|-------------|-------|
| Layout / visão | widgets, geometria, tipo, bindings | SavedView | Recorte temporal ad hoc |
| Filtros | valores aplicados agora (e defaults da visão) | View defaults **ou** sessão | Posição dos cards |
| Query / dados | measures, dimensions, grain, range | Metric API / semantic layer | HTML do gráfico |

Identidade via JWT/sessão existente. Sem PII extra no JSON de layout.

## Entidades lógicas

```
User ──< SavedView >── Dashboard (dashboardKey)
              │
              ├── layout: LayoutItem[]
              ├── widgets: WidgetInstance[]
              ├── defaultFilters
              └── scope: personal | role_default | shared
```

| Entidade | Chave | Notas |
|----------|-------|-------|
| Dashboard | `dashboardKey` | Template de produto (rota, catálogo permitido, widgets obrigatórios) |
| SavedView | `(userId, dashboardKey, viewId)` | `isDefault`, `name`, `scope` |
| LayoutItem | `i` = widgetInstanceId | `{x,y,w,h}` + min/max + `priority` mobile |
| WidgetInstance | id | `widgetType`, título, `queryRef`, `chartOptions` |
| MetricQuery | id ou inline | `measures[]`, `dimensions[]`, `filters[]`, `timeDimension` |

`schemaVersion` no documento da visão (como Grafana) para migrações. `version` / `updatedAt` para optimistic concurrency.

Preferências globais do usuário (tema, timezone, home) **não** moram no layout — espelhar Grafana Preferences API.

## Query de métrica (shape)

Inspirado no [Cube query format](https://docs.cube.dev/reference/core-data-apis/rest-api/query-format); reutilizável **sem** Cube.

```json
{
  "measures": ["orders.revenue"],
  "dimensions": ["orders.status"],
  "filters": [{ "member": "orders.status", "operator": "equals", "values": ["complete"] }],
  "timeDimensions": [{
    "dimension": "orders.created_at",
    "dateRange": ["2026-08-01", "2026-08-25"],
    "granularity": "day"
  }],
  "limit": 1000,
  "timezone": "America/Sao_Paulo"
}
```

Resposta mínima:

```json
{
  "data": [{ "orders.created_at": "2026-08-01", "orders.revenue": 1200 }],
  "lastRefreshTime": "2026-08-25T12:00:00Z",
  "annotation": { "measures": { "orders.revenue": { "title": "Receita", "type": "number", "unit": "BRL" } } }
}
```

- Cache: `stale-if-slow` / `max-age`; header ou campo `lastRefreshTime` para UI stale.
- Agregação **no servidor**; o cliente não soma linhas cruas para KPIs oficiais.
- Limites: `limit`, timeout, max widgets por visão, allowlist de measures por papel.
- Filtros de dashboard são mergeados na query; o widget não ignora filtro global sem flag `ignoreDashboardFilters`.

Não há semantic layer? Ainda assim exponha este shape atrás de `/metrics/query` (implementação SQL interna). Não devolver SQL ao browser.

## Endpoints mínimos

| Método | Path | Papel |
|--------|------|-------|
| GET | `/dashboards/{dashboardKey}` | Template + catálogo permitido + default views por role |
| GET | `/dashboards/{dashboardKey}/views` | Visões do usuário (+ shared visíveis) |
| GET | `/dashboards/{dashboardKey}/views/{viewId}` | Documento completo |
| PUT | `/dashboards/{dashboardKey}/views/{viewId}` | Upsert layout+widgets+defaultFilters; idempotente |
| POST | `/dashboards/{dashboardKey}/views` | Criar (save as) |
| DELETE | `/dashboards/{dashboardKey}/views/{viewId}` | Só pessoais / com permissão |
| POST | `/metrics/query` | Body = MetricQuery; auth + row-level security |
| GET | `/metrics/meta` | Measures/dimensions permitidos (opcional, tipo Cube `/meta`) |

Filtro **temporário** de sessão (Superset `filter_state`) pode ser querystring ou store client volátil — não misturar com PUT da visão até o usuário “salvar filtros como default”.

## Auth, erros, observabilidade

- 401 não autenticado; 403 measure/widget fora do papel; 404 view; 409 conflito de `version`; 400 query inválida; 429 rate limit.
- Idempotência do PUT pela chave da visão.
- Métricas: `dashboard_view_save`, `metrics_query_latency`, `metrics_query_error`, cache hit.

## O que o frontend pode cachear

- Visão e resultados de query em React Query/SWR com `staleTime` curto.
- Layout otimista durante drag.
- **Não** tratar cache como autoritativo após F5 em outro dispositivo.

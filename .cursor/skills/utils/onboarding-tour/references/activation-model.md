# Modelo de ativação (user × page × feature)

Fonte de verdade: **backend**. O cliente consulta e atualiza progresso; cache local é opcional e não autoritativo.

## Chave composta

| Campo | Papel |
|-------|--------|
| `userId` | Identidade autenticada (JWT/sessão; não enviar no body se já vier do token) |
| `pageKey` | Identificador estável da página/rota (ex.: `dashboard`, `settings.billing`) |
| `featureKey` | Identificador da feature/tour (ex.: `billing-export`) |
| `featureVersion` | Versão do conteúdo do tour (semver, build id ou data ISO) |

Unicidade lógica: `(userId, pageKey, featureKey)` — ao mudar `featureVersion` elegível, o tour pode reaparecer.

## Status

| Status | Significado |
|--------|-------------|
| `not_started` | Sem registro ou ainda não exibido |
| `in_progress` | Tour iniciado; pode ter `currentStep` |
| `seen` | Usuário viu o suficiente (alternativa a completed) |
| `skipped` | Usuário pulou |
| `completed` | Concluiu todos os passos |

Para “não reexibir”: tratar `skipped`, `seen` e `completed` como terminais **naquela** `featureVersion`.

## Gatilhos

| Gatilho | Quando mostrar |
|---------|----------------|
| `first_visit` | Primeiro acesso à `pageKey` (sem registro terminal para o `featureKey`) |
| `new_feature` | `featureVersion` do cliente/config > `featureVersion` persistida (ou sem registro) |
| ambos | União: first visit **ou** versão nova |

## Fluxo de decisão

```text
PageLoad
  → GET progress(pageKey, featureKey)
  → deveExibir?
       não (terminal na versão atual) → não montar tour
       sim (ausente / versão antiga / in_progress retomável) → startTour
  → skip | complete | dismiss
  → PUT progress(status, featureVersion, currentStep?)
```

## Regras default (documentar desvios em `activation-rules.md`)

1. Mostrar no máximo **um** tour ativo por página
2. Nova `featureVersion` reabre o tour mesmo se `completed` na versão anterior
3. `skipped` e `completed` são equivalentes para “não mostrar de novo” na mesma versão
4. Retomar `in_progress` no `currentStep` se o produto quiser continuidade; senão reiniciar do passo 0
5. Falha no GET: **não** bloquear a página; opcionalmente não mostrar o tour (fail closed) ou mostrar uma vez sem persistir (fail open) — escolher e documentar
6. Falha no PUT: retry silencioso; manter UI utilizável

## Exclusões comuns

Documentar quais se aplicam:

- Role / permissão insuficiente para a feature
- Feature flag desligada
- Viewport mobile (tour só desktop) ou o inverso
- Preferência global “reduzir motion / desativar tours”
- Usuário anônimo (sem `userId`) — não persistir; ou não exibir

## Contrato HTTP mínimo

### GET `/onboarding/progress?pageKey=&featureKey=`

```json
{
  "pageKey": "settings.billing",
  "featureKey": "billing-export",
  "featureVersion": "2.0.0",
  "status": "completed",
  "currentStep": null,
  "completedAt": "2026-08-01T12:00:00Z"
}
```

404 ou body com `status: "not_started"` se não houver registro.

### PUT `/onboarding/progress`

```json
{
  "pageKey": "settings.billing",
  "featureKey": "billing-export",
  "featureVersion": "2.0.0",
  "status": "completed",
  "currentStep": 4
}
```

Idempotente para o mesmo `(user, page, feature, version, status)`.

Auth: JWT/sessão do produto. Sem PII extra no payload.

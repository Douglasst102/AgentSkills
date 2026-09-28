# Templates de artefatos (`onboarding/`)

Preencher um arquivo por seção. Remover placeholders `[...]`.

---

## `tour-spec.md`

```markdown
# Tour Spec — [Nome da feature / página]

## Metadados
- pageKey: [...]
- featureKey: [...]
- featureVersion: [...]
- gatilho: first_visit | new_feature | both
- stack UI: [...]
- data: [AAAA-MM-DD]

## Objetivo do tour
[Uma frase: o que o usuário deve entender/fazer]

## Fluxo
- Skip: [sim/não + efeito no status]
- Back: [sim/não]
- Alvo ausente: [skip step | abort | centered fallback]
- Diagrama (texto):
  Intro → Step1 → ... → Complete

## Passos

| # | id | target (data-tour) | título | corpo | placement | CTA primário |
|---|----|--------------------|--------|-------|-----------|--------------|
| 1 | intro | — | [...] | [...] | center | Próximo |
| 2 | [...] | [...] | [...] | [...] | bottom | Próximo |

## Copy e tom
[formal / casual; restrições de i18n]

## Critérios de aceite (UI)
- [ ] Skip disponível em todos os passos (ou justificar)
- [ ] Teclado + foco conforme tour-ui-patterns
- [ ] Não inicia com alvos ainda não montados
```

---

## `activation-rules.md`

```markdown
# Activation Rules — [featureKey]

## Chave
- pageKey: [...]
- featureKey: [...]
- featureVersion atual: [...]

## Gatilho
[first_visit | new_feature | both — detalhar]

## Quando exibir
[lista de condições verdadeiras]

## Quando NÃO exibir
[status terminais, exclusões: role, flag, mobile, ...]

## Transições de status
| Evento UI | status gravado | currentStep |
|-----------|----------------|-------------|
| start | in_progress | 0 |
| next | in_progress | n |
| skip | skipped | — |
| complete | completed | last |
| dismiss | in_progress ou skipped | [...] |

## Reexibição
Nova featureVersion: [sim — política]

## Falha de API
GET falha: [fail closed | fail open]
PUT falha: [retry / fila]
```

---

## `frontend-brief.md`

```markdown
# Frontend Brief — Onboarding [featureKey]

## Escopo
Implementar UI do tour e integração de progresso na página [...].
Não implementar backend.

## Stack e design system
[...]

## Componentes a criar / reutilizar
| Componente | Responsabilidade |
|------------|------------------|
| TourProvider | [...] |
| TourSpotlight | [...] |
| TourPopover | [...] |

## Hook / serviço
- `useOnboardingProgress(pageKey, featureKey)` — GET
- `markOnboardingProgress(payload)` — PUT
- Cache: [nenhum | React Query/SWR volátil]

## Integração na rota
1. data-tour nos alvos (ver tour-spec)
2. Provider no layout da página
3. start condicional após hydrate + progresso

## A11y e mobile
[checklist apontando tour-ui-patterns]

## Testes sugeridos
- [ ] Não renderiza overlay se status completed
- [ ] Skip dispara PUT skipped
- [ ] Escape fecha / dismiss
- [ ] Alvo ausente segue política do tour-spec

## Artefatos relacionados
- tour-spec.md, activation-rules.md, openapi-sketch.yaml
```

---

## `backend-brief.md`

```markdown
# Backend Brief — Onboarding Progress

## Objetivo
API e persistência para progresso de tour (user × page × feature × version).
Este brief NÃO inclui código de implementação.

## Auth
[JWT / sessão — userId do token]

## Endpoints
| Método | Path | Descrição |
|--------|------|-----------|
| GET | /onboarding/progress | Query: pageKey, featureKey |
| PUT | /onboarding/progress | Upsert status |

## Contratos
Ver openapi-sketch.yaml.

## Regras de negócio
- Idempotência do PUT
- Upgrade de featureVersion reabre elegibilidade no cliente
- Sem PII além do userId autenticado

## Erros
| Código | Quando |
|--------|--------|
| 401 | Não autenticado |
| 400 | pageKey/featureKey inválidos |
| 404 | GET sem registro (ou retornar not_started) |

## Observabilidade
[metricas: tours_started, skipped, completed]
```

---

## `data-model.md`

```markdown
# Data Model — OnboardingProgress

## Entidade OnboardingProgress

| Campo | Tipo lógico | Obrigatório | Notas |
|-------|-------------|-------------|-------|
| id | UUID | sim | PK |
| userId | string/UUID | sim | FK lógica User |
| pageKey | string | sim | max 128 |
| featureKey | string | sim | max 128 |
| featureVersion | string | sim | |
| status | enum | sim | not_started\|in_progress\|seen\|skipped\|completed |
| currentStep | int \| null | não | |
| completedAt | datetime \| null | não | |
| createdAt | datetime | sim | |
| updatedAt | datetime | sim | |

## Índices / unicidade
- UNIQUE (userId, pageKey, featureKey)

## Notas de migração
[SGBD do projeto / tabela sugerida]
```

---

## `openapi-sketch.yaml`

```yaml
openapi: 3.0.3
info:
  title: Onboarding Progress API
  version: 0.1.0
paths:
  /onboarding/progress:
    get:
      summary: Get onboarding progress
      parameters:
        - in: query
          name: pageKey
          required: true
          schema: { type: string }
        - in: query
          name: featureKey
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Progress found or not_started
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OnboardingProgress'
        '401':
          description: Unauthorized
    put:
      summary: Upsert onboarding progress
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OnboardingProgressInput'
      responses:
        '200':
          description: Saved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OnboardingProgress'
        '400':
          description: Invalid body
        '401':
          description: Unauthorized
components:
  schemas:
    OnboardingStatus:
      type: string
      enum: [not_started, in_progress, seen, skipped, completed]
    OnboardingProgress:
      type: object
      required: [pageKey, featureKey, featureVersion, status]
      properties:
        pageKey: { type: string }
        featureKey: { type: string }
        featureVersion: { type: string }
        status: { $ref: '#/components/schemas/OnboardingStatus' }
        currentStep: { type: integer, nullable: true }
        completedAt: { type: string, format: date-time, nullable: true }
    OnboardingProgressInput:
      type: object
      required: [pageKey, featureKey, featureVersion, status]
      properties:
        pageKey: { type: string }
        featureKey: { type: string }
        featureVersion: { type: string }
        status: { $ref: '#/components/schemas/OnboardingStatus' }
        currentStep: { type: integer, nullable: true }
```

---

## `handoff-agentskills.md`

```markdown
# Handoff AgentSkills — Onboarding [featureKey]

## Artefatos prontos
- [ ] tour-spec.md
- [ ] activation-rules.md
- [ ] frontend-brief.md
- [ ] backend-brief.md
- [ ] data-model.md
- [ ] openapi-sketch.yaml

## Ordem
1. frontend-developer — UI do tour
2. technical-analyst / data-engineer — contrato e modelo
3. backend-developer — API e persistência

## Prompt frontend (copiar)
Ver references/handoff-agentskills.md
```

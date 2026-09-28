# Handoff manual para AgentSkills

Esta skill **não** integra a cadeia do AgentSkills. O usuário cita `onboarding-tour`, gera `onboarding/`, e ativa agentes manualmente (ex.: `/activate-agent frontend-developer`).

## Mapa artefato → agente

| Artefato `onboarding/` | Agente AgentSkills | Pasta típica de saída | O que extrair |
|------------------------|--------------------|------------------------|---------------|
| `tour-spec.md` | frontend-developer, uiux-designer | `frontend/`, `design/` | passos, copy, alvos, fluxo skip/complete |
| `activation-rules.md` | frontend-developer, technical-analyst | `frontend/`, `technical/` | quando montar o tour |
| `frontend-brief.md` | frontend-developer | `frontend/` | componentes, hooks, a11y, testes |
| `backend-brief.md` | technical-analyst, backend-developer | `technical/`, `backend/` | endpoints, auth, erros |
| `data-model.md` | data-engineer, technical-analyst | `data/`, `technical/` | entidade, unicidade, migração |
| `openapi-sketch.yaml` | technical-analyst, backend-developer | `technical/` | contrato OpenAPI |
| `handoff-agentskills.md` | (orquestração humana) | — | ordem e prompts |

## Ordem sugerida

1. **frontend-developer** — implementar UI e integração com API (mock/stub se API ainda não existir)
2. **technical-analyst** e/ou **data-engineer** — formalizar contrato e modelo a partir dos briefs
3. **backend-developer** — implementar persistência e endpoints

Paralelo possível: frontend com stub + backend em paralelo após o OpenAPI sketch estável.

## Regras de consumo

1. Progresso de onboarding é **dado de domínio** — fonte autoritativa no backend (regra do `frontend-dev`)
2. Não tratar `openapi-sketch.yaml` como contrato final até o Technical Analyst validar
3. Não alterar `project-context.json` / cadeia a partir desta skill
4. Libs de tour de terceiros só se o projeto já usar ou o usuário pedir

## Prompt-base — Frontend Developer

```
Contexto: product tour / onboarding de feature. A pasta onboarding/ contém
spec e briefs gerados pela skill onboarding-tour.

Instruções:
- Implemente a UI do tour conforme tour-spec.md e frontend-brief.md.
- Respeite activation-rules.md para decidir quando exibir.
- Consuma (ou stub) o contrato em openapi-sketch.yaml; progresso autoritativo no backend.
- Não use localStorage como fonte de verdade do progresso.
- Siga o design system e a skill frontend-dev do projeto.
- Artefatos prioritários: tour-spec.md, frontend-brief.md, activation-rules.md.

Objetivo: entregar componentes/hooks do tour na página [pageKey / rota].
```

## Prompt-base — Technical / Data / Backend

```
Contexto: sistema de controle de onboarding (user × page × feature × version).
Artefatos em onboarding/: backend-brief.md, data-model.md, openapi-sketch.yaml,
activation-rules.md.

Instruções:
- Formalize/implemente API e persistência conforme os briefs.
- Idempotência no PUT; auth via JWT/sessão existente.
- Não invente campos de PII além do userId autenticado.

Objetivo desta ativação: [contrato técnico | DDL/migração | implementação API].
```

## Checklist pós-handoff (usuário)

- [ ] `onboarding/` revisado (copy e chaves estáveis)
- [ ] Frontend Developer implementou tour + integração
- [ ] Contrato OpenAPI validado (Technical Analyst se aplicável)
- [ ] Data/Backend persistiram progresso
- [ ] Tour só aparece no primeiro acesso / nova feature conforme regras

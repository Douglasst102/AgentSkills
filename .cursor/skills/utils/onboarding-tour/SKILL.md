---
name: onboarding-tour
description: >-
  Specifica product tours de onboarding (spotlight, walkthrough, coach marks) e
  gera briefs frontend/backend para ativar o tour só no primeiro acesso ou em
  nova feature. Use quando o usuário mencionar onboarding, product tour,
  walkthrough, coach mark, first visit, tutorial de página ou tour de nova
  funcionalidade.
disable-model-invocation: true
---

# Onboarding Tour

Skill autônoma para roteiros de tour de produto e insumos do sistema de controle
de ativação (user × página × feature). Usada **junto** com o `frontend-developer`
do AgentSkills — sem integrar a cadeia e sem agente próprio.

## Quando Usar

- Tour na primeira visita a uma página/rota
- Apresentação de funcionalidade nova (`featureVersion`)
- Coach marks / spotlight / walkthrough em feature existente
- Briefs para implementar UI do tour e API de progresso de onboarding

## Princípios

1. **Skip obrigatório** — tour não bloqueia tarefa crítica sem skip/dismiss explícito
2. **Backend autoritativo** — progresso em `userId + pageKey + featureKey + featureVersion`; cache client só volátil/otimista
3. **Sem lib obrigatória** — padrão spotlight + popover + provider; libs (driver.js, react-joyride, etc.) só se o projeto já usar ou o usuário pedir
4. **Stack adaptável** — exemplos React como referência; adaptar à stack do projeto
5. **Sem código backend** — brief + schema + OpenAPI; implementação fica com agentes AgentSkills

## Entradas necessárias

Antes de avançar, confirme com o usuário:

| Entrada | Exemplos |
|---------|----------|
| Página / rota | `/dashboard`, tela de relatórios |
| Feature | `featureKey`, `featureVersion` (semver ou data) |
| Gatilho | `first_visit`, `new_feature`, ou ambos |
| Stack UI | React/Vue/Angular + design system |
| Restrições | a11y, mobile, roles, feature flags |
| API existente | endpoints de progresso, se houver |

Se faltar página/feature ou gatilho, peça antes de gerar artefatos.

## Fluxo de Trabalho

Copie e acompanhe o checklist:

```
Onboarding Tour Progress:
- [ ] 1. Intake
- [ ] 2. Roteiro do tour
- [ ] 3. Modelo de ativação
- [ ] 4. Brief frontend
- [ ] 5. Brief backend
- [ ] 6. Handoff AgentSkills
```

### 1. Intake

- Registrar página/rota, featureKey/version, gatilho, stack e restrições
- Verificar se já existe API ou design de tour no projeto
- Definir escopo: só docs em `onboarding/` (esta skill não implementa o app)

### 2. Roteiro do tour

- Seguir [references/tour-ui-patterns.md](references/tour-ui-patterns.md)
- Passos ordenados: alvo (seletor/landmark/`data-tour`), título, corpo, CTA, posição
- Fluxos: next/back, skip, complete, dismiss; comportamento se alvo ausente
- Produzir `tour-spec.md`

### 3. Modelo de ativação

- Seguir [references/activation-model.md](references/activation-model.md)
- Regras: quando mostrar, marcar visto/completado/skipped, reexibir em nova versão
- Exclusões: role, feature flag, mobile, preferência “não mostrar novamente”
- Produzir `activation-rules.md`

### 4. Brief frontend

- Componentes (`TourProvider`, `TourSpotlight`, `TourPopover`, step config)
- Hook de progresso (GET/PUT), integração na página, a11y, testes sugeridos
- Produzir `frontend-brief.md`

### 5. Brief backend

- Schema lógico, endpoints, erros, auth, idempotência
- Produzir `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
- **Não** gerar implementação de API/código de servidor

### 6. Handoff

- Preencher `handoff-agentskills.md` com [references/handoff-agentskills.md](references/handoff-agentskills.md)
- Orientar ativação manual do `frontend-developer`, depois technical/data/backend

## Outputs

Salve em `others_artifacts/onboarding/` (templates em [references/artifact-templates.md](references/artifact-templates.md)):

| Arquivo | Conteúdo |
|---------|----------|
| `tour-spec.md` | Passos, copy, alvos, CTAs, fluxo |
| `activation-rules.md` | Gatilhos, versão, exclusões |
| `frontend-brief.md` | Componentes, hooks, a11y, testes |
| `backend-brief.md` | Endpoints, contratos, auth, erros |
| `data-model.md` | Entidade de progresso e índices lógicos |
| `openapi-sketch.yaml` | Esboço OpenAPI |
| `handoff-agentskills.md` | Ordem e prompts para agentes |

## Colaboração manual (AgentSkills)

Esta skill **não** invoca agentes. Ordem sugerida:

1. **Frontend Developer** ← `tour-spec.md`, `frontend-brief.md`, `activation-rules.md`
2. **Technical Analyst** / **Data Engineer** ← `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
3. **Backend Developer** ← mesmos artefatos + contratos técnicos

Detalhes: [references/handoff-agentskills.md](references/handoff-agentskills.md)

## Referências

- [tour-ui-patterns.md](references/tour-ui-patterns.md)
- [activation-model.md](references/activation-model.md)
- [artifact-templates.md](references/artifact-templates.md)
- [handoff-agentskills.md](references/handoff-agentskills.md)
- [README.md](README.md) — instalação e uso fora da cadeia AgentSkills

# Onboarding Tour

Pacote autônomo (**só skill**, sem agente) para product tours de onboarding e briefs do sistema de controle de ativação (primeiro acesso / nova feature).

**Não faz parte da cadeia AgentSkills.** Não altera o README, `project-context.json` nem os commands do AgentSkills. Você cita esta skill e, em seguida, chama o `frontend-developer` (e depois backend/data) manualmente.

## O que inclui

| Item | Caminho |
|------|---------|
| Skill | `.cursor/skills/onboarding-tour/SKILL.md` |
| Referências | `.cursor/skills/onboarding-tour/references/` |
| Saída | pasta `onboarding/` no projeto alvo |

## Quando usar

- Tour na primeira visita a uma página
- Walkthrough / coach marks de uma feature nova
- Gerar insumos de UI **e** de API/modelo para o progresso user × página × feature
- Trabalhar **junto** com o agente `frontend-developer` do AgentSkills

## Como instalar no projeto alvo

Copie para o repositório do produto (ou use workspace multi-root com MultSkills):

```
.cursor/
  skills/onboarding-tour/
    SKILL.md
    README.md
    references/
onboarding/          # criada na primeira execução; pode começar vazia
```

O AgentSkills pode permanecer em outro diretório/workspace; este pacote não precisa ser mergeado nele.

## Como usar

### 1. Spec e briefs (esta skill)

No chat do Cursor, cite a skill:

```
Use a skill onboarding-tour.
Página/rota: [/settings/billing]
featureKey: billing-export
featureVersion: 2.0.0
Gatilho: first_visit + new_feature
Stack: React + design system do projeto
```

A skill gera artefatos em `onboarding/`.

### 2. Handoff manual — Frontend (AgentSkills)

Com `onboarding/` pronto:

```
/activate-agent frontend-developer
```

Inclua o prompt sugerido em `onboarding/handoff-agentskills.md` (também em `references/handoff-agentskills.md`).

Artefatos prioritários para o frontend:

- `tour-spec.md`
- `frontend-brief.md`
- `activation-rules.md`

### 3. Handoff — Technical / Data / Backend

Depois (ou em paralelo com stub no frontend):

1. technical-analyst e/ou data-engineer ← `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
2. backend-developer ← implementação da API

## Fluxo

```text
Página + feature + gatilho
        │
        ▼
   skill onboarding-tour
        │
        ▼
   pasta onboarding/
        │
        │  (handoff manual)
        ▼
 frontend-developer → UI do tour
        │
        ▼
 technical / data / backend → API de progresso
```

## Artefatos em `onboarding/`

| Arquivo | Conteúdo |
|---------|----------|
| `tour-spec.md` | Passos, copy, alvos, CTAs |
| `activation-rules.md` | Quando exibir / reexibir / excluir |
| `frontend-brief.md` | Componentes, hooks, a11y, testes |
| `backend-brief.md` | Endpoints, auth, erros |
| `data-model.md` | Entidade de progresso |
| `openapi-sketch.yaml` | Esboço OpenAPI |
| `handoff-agentskills.md` | Ordem e prompts |

Templates: [references/artifact-templates.md](references/artifact-templates.md)

## Princípios

- Skip obrigatório; tour não bloqueia tarefa crítica  
- Progresso autoritativo no backend (não `localStorage` como fonte de verdade)  
- Sem lib de tour obrigatória; React só como exemplo de referência  
- Sem implementar backend nesta skill  
- Sem atualizar a cadeia AgentSkills  

## Referências da skill

- [tour-ui-patterns.md](references/tour-ui-patterns.md)  
- [activation-model.md](references/activation-model.md)  
- [handoff-agentskills.md](references/handoff-agentskills.md)  
- [artifact-templates.md](references/artifact-templates.md)

# Dashboard Builder

Pacote autônomo (**só skill**, sem agente) para spec de dashboards customizáveis por usuário e briefs de UI + API (layout, widgets, gráficos representativos, visões salvas, queries de métrica).

**Não faz parte da cadeia AgentSkills.** Não altera o README, `project-context.json` nem os commands do AgentSkills. Você cita esta skill e, em seguida, chama o `frontend-developer` (e depois backend/data) manualmente.

**Independente** de outras skills do MultSkills em runtime.

## O que inclui

| Item | Caminho |
|------|---------|
| Skill | `.cursor/skills/dashboard-builder/SKILL.md` |
| Referências | `.cursor/skills/dashboard-builder/references/` |
| Saída | pasta `dashboard/` no projeto alvo |

## Quando usar

- Painel analítico com KPIs e gráficos escolhidos pela pergunta
- Layout ajustável, paleta de widgets, visões salvas por usuário
- Gerar insumos de UI **e** de API/modelo (layout + agregação)
- Trabalhar **junto** com o agente `frontend-developer` do AgentSkills

## Como instalar no projeto alvo

Copie para o repositório do produto (ou use workspace multi-root com MultSkills):

```
.cursor/
  skills/dashboard-builder/
    SKILL.md
    README.md
    references/
dashboard/          # criada na primeira execução; pode começar vazia
```

O AgentSkills pode permanecer em outro diretório/workspace; este pacote não precisa ser mergeado nele.

## Como usar

### 1. Spec e briefs (esta skill)

No chat do Cursor, cite a skill:

```
Use a skill dashboard-builder.
Rotas: [/analytics]
Personas: gestor, operador
Perguntas: receita vs meta na semana; tickets abertos por fila
Stack: React + design system do projeto
Customização: layout + widgets + filtros + visões salvas
```

A skill gera artefatos em `dashboard/`.

### 2. Handoff manual — Frontend (AgentSkills)

Com `dashboard/` pronto:

```
/activate-agent frontend-developer
```

Inclua o prompt sugerido em `dashboard/handoff-agentskills.md` (também em `references/handoff-agentskills.md`).

Artefatos prioritários para o frontend:

- `dashboard-spec.md`
- `widget-catalog.md`
- `frontend-brief.md`

### 3. Handoff — Technical / Data / Backend

Depois (ou em paralelo com stub no frontend):

1. technical-analyst e/ou data-engineer ← `backend-brief.md`, `data-model.md`, `openapi-sketch.yaml`
2. backend-developer ← implementação da API

## Fluxo

```text
Rotas + personas + perguntas analíticas
        │
        ▼
   skill dashboard-builder
        │
        ▼
   pasta dashboard/
        │
        │  (handoff manual)
        ▼
 frontend-developer → canvas, grid, widgets, charts
        │
        ▼
 technical / data / backend → visões + metrics query
```

## Artefatos em `dashboard/`

| Arquivo | Conteúdo |
|---------|----------|
| `dashboard-spec.md` | Páginas, hierarquia, defaults |
| `widget-catalog.md` | Widgets, tipos, justificativa |
| `frontend-brief.md` | Componentes, hooks, a11y, testes |
| `backend-brief.md` | Endpoints, auth, cache, erros |
| `data-model.md` | View, layout, widget, query |
| `openapi-sketch.yaml` | Esboço OpenAPI |
| `handoff-agentskills.md` | Ordem e prompts |

Templates: [references/artifact-templates.md](references/artifact-templates.md)

## Princípios

- Todo widget parte de uma pergunta; gráfico só se representar a pergunta
- Charts com animação de entrada (marks a partir da baseline) e hover (tooltip, destaque); reduced-motion desliga o movimento, não o detalhe
- Defaults por papel; customização com edit mode, save/cancel/reset
- Layout e visões autoritativos no backend (não `localStorage` como fonte da verdade)
- Layout, filtros e queries são estados separados
- Sem lib de grid/chart obrigatória; React só como exemplo de referência
- Sem implementar backend nesta skill
- Sem atualizar a cadeia AgentSkills

## Referências da skill

- [chart-catalog.md](references/chart-catalog.md)
- [layout-patterns.md](references/layout-patterns.md)
- [visualization-principles.md](references/visualization-principles.md)
- [data-contracts.md](references/data-contracts.md)
- [handoff-agentskills.md](references/handoff-agentskills.md)
- [artifact-templates.md](references/artifact-templates.md)

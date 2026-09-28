# Handoff manual para AgentSkills

Esta skill **não** integra a cadeia do AgentSkills. O usuário ativa agentes manualmente (ex.: `/activate-agent business-analyst`) e aponta os artefatos em `legacy/`.

## Mapa artefato → agente

| Artefato `legacy/` | Agente AgentSkills | Pasta típica de saída | O que extrair |
|--------------------|--------------------|------------------------|---------------|
| `system-overview.md` | business-analyst, software-architect | `business/`, `architecture/` | propósito, stakeholders implícitos, limites, stack as-is |
| `feature-inventory.md` | business-analyst, requirements-engineer | `business/`, `requirements/` | capacidades, priorização inicial, escopo de paridade |
| `page-screen-map.md` | process-analyst, requirements-engineer, uiux-designer | `processes/`, `requirements/`, `design/` | fluxos de tela, atores, jornada |
| `business-rules.md` | business-analyst, process-analyst, requirements-engineer, data-engineer | `business/`, `processes/`, `requirements/`, `data/` | regras com evidência → RF / critérios / persistência |
| `data-model-as-is.md` | data-engineer, technical-analyst, software-architect | `data/`, `technical/`, `architecture/` | entidades, FKs, constraints a preservar ou redesenhar |
| `integrations.md` | software-architect, technical-analyst, backend-developer | `architecture/`, `technical/` | limites do sistema, contratos externos |
| `tech-debt-and-improvements.md` | business-analyst, software-architect | `business/` (gap), `architecture/` (ADRs) | propostas rotuladas — não tratar como requisito fechado |
| `handoff-agentskills.md` | (orquestração humana) | — | ordem e prompts sugeridos |

## Ordem sugerida

1. **business-analyst** — visão, gap (as-is vs. desejado), stakeholders  
2. **process-analyst** — processos a partir de telas + regras  
3. **requirements-engineer** — SRS / user stories a partir de features e regras  
4. **data-engineer** — modelo alvo ancorado no as-is + requisitos  
5. **software-architect** — stack nova, C4, ADRs (após visão e restrições)

Paralelos possíveis depois do discovery: architect + data; uiux com `page-screen-map.md`.

## Regras de consumo

Para qualquer agente AgentSkills:

1. Tratar `legacy/` como **fonte as-is**, não como design do sistema novo  
2. Exigir rastreio: requisito/processo → `BR-` / `F-` / `P-` quando existir  
3. Itens de `tech-debt-and-improvements.md` entram como **oportunidade** até o negócio validar  
4. Não atualizar contexto da cadeia a partir desta skill — o agente AgentSkills segue o próprio fluxo

## Prompt-base (copiar)

```
Contexto: modernização de sistema legado. A pasta legacy/ contém discovery as-is
(código + SQL) gerado pela skill legacy-discovery.

Instruções:
- Use legacy/ como evidência do estado atual.
- Não invente regras sem fonte; se faltar, registre lacuna.
- Separe requisitos de paridade das propostas em tech-debt-and-improvements.md.
- Artefatos prioritários para esta etapa: [listar arquivos].

Objetivo desta ativação: [ex.: criar product-vision e business-requirements em business/].
```

## Checklist pós-handoff (usuário)

- [ ] `legacy/` revisado (sem segredos)
- [ ] Business Analyst consumiu overview + features + regras  
- [ ] Process Analyst mapeou fluxos críticos  
- [ ] Requirements cobriu features prioritárias  
- [ ] Data Engineer partiu de `data-model-as-is.md`  
- [ ] Architect conhece integrações e dívida relevante

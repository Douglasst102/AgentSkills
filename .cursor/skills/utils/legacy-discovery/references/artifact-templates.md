# Templates dos artefatos `legacy/`

Use estes esqueletos. Remova seções sem evidência e marque lacunas explicitamente.

---

## `system-overview.md`

```markdown
# Visão do sistema legado (as-is)

## Resumo
[1–3 frases: o que o sistema faz]

## Escopo analisado
- Código: `[caminho]`
- SQL: `[caminho]`
- Objetivo do discovery: paridade | paridade + melhorias
- Módulos incluídos / excluídos:

## Stack aparente
| Camada | Tecnologia | Evidência |
|--------|------------|-----------|
| UI | | |
| Backend | | |
| Banco | | |
| Jobs | | |
| Auth | | |

## Arquitetura lógica (as-is)
[Camadas, monolito vs módulos, entry points]

## Domínios / módulos
| Domínio | Responsabilidade | Pastas/arquivos-chave |
|---------|------------------|------------------------|
| | | |

## Limites e premissas
-

## Lacunas
-
```

---

## `feature-inventory.md`

```markdown
# Inventário de features

## Por domínio

### [Domínio]
| ID | Feature | Descrição | Criticidade | Evidência (arquivo/rota) | Notas |
|----|---------|-----------|-------------|--------------------------|-------|
| F-001 | | | alta/média/baixa/desconhecida | | |

## Features transversais
| ID | Feature | Evidência | Notas |
|----|---------|-----------|-------|
| | Auth / roles | | |
| | Auditoria | | |
| | Relatórios | | |

## Lacunas
-
```

---

## `page-screen-map.md`

```markdown
# Mapa de páginas / telas / rotas

| ID | Nome / rota | Propósito | Atores | Features ligadas | Evidência |
|----|-------------|-----------|--------|------------------|-----------|
| P-001 | | | | F-xxx | |

## Fluxos de navegação principais
1. [fluxo] → telas envolvidas

## Telas sem rota clara / geradas dinamicamente
-

## Lacunas
-
```

---

## `business-rules.md`

```markdown
# Regras de negócio (as-is)

| ID | Regra | Domínio | Fonte | Criticidade | Observação |
|----|-------|---------|-------|-------------|------------|
| BR-001 | | | `path` ou `dbo.Tabela` / proc | alta/média/baixa | |

## Convenções de fonte
- Código: caminho + símbolo quando possível
- SQL: schema.objeto (constraint, trigger, procedure)
- UI: tela/rota + validação

## Regras contraditórias ou duplicadas
|

## Lacunas (comportamento observado sem regra formal)
-
```

---

## `data-model-as-is.md`

```markdown
# Modelo de dados as-is

## Visão geral
- SGBD:
- Schemas:
- Volume aproximado de tabelas:

## Entidades principais
| Entidade | Tabela(s) | PK | Descrição |
|----------|-----------|-----|-----------|
| | | | |

## Relacionamentos
| De | Para | Cardinalidade | FK / evidência |
|----|------|---------------|----------------|
| | | | |

## Constraints e regras no banco
| Objeto | Tipo | Regra inferida |
|--------|------|----------------|
| | CHECK / UNIQUE / FK / TRIGGER | |

## Views relevantes
|

## Procedures / functions relevantes
| Nome | Propósito inferido | Evidência de uso no código |
|------|--------------------|----------------------------|
| | | |

## Glossário de colunas críticas
| Tabela.coluna | Significado inferido | Evidência |
|---------------|----------------------|-----------|
| | | |

## Lacunas
-
```

---

## `integrations.md`

```markdown
# Integrações (as-is)

| ID | Tipo | Sistema / endpoint | Direção | Dados | Evidência |
|----|------|--------------------|---------|-------|-----------|
| I-001 | API / arquivo / fila / e-mail / outro | | in/out/bidirecional | | |

## Autenticação com terceiros
-

## Jobs e batch
| Job | Gatilho | Efeito | Evidência |
|-----|---------|--------|-----------|
| | | | |

## Lacunas
-
```

---

## `tech-debt-and-improvements.md`

```markdown
# Dívida técnica e oportunidades de melhoria

> Propostas — não confundir com requisitos as-is.

## Manter (paridade)
| Item | Motivo |
|------|--------|
| | |

## Melhorar
| Item | Problema as-is | Proposta | Risco se ignorar |
|------|----------------|----------|------------------|
| | | | |

## Descartar / não portar
| Item | Motivo |
|------|--------|
| | |

## Dívida técnica observada
-

## Decisões em aberto (perguntar ao negócio)
-
```

---

## `handoff-agentskills.md`

```markdown
# Handoff para AgentSkills (manual)

## Status do discovery
- Completo / parcial:
- Artefatos em `legacy/`:

## Ordem sugerida de agentes

| Ordem | Agente AgentSkills | Artefatos `legacy/` a consumir | O que produzir |
|-------|--------------------|--------------------------------|----------------|
| 1 | business-analyst | system-overview, feature-inventory, business-rules, tech-debt | business/ |
| 2 | process-analyst | page-screen-map, business-rules, integrations | processes/ |
| 3 | requirements-engineer | feature-inventory, business-rules, page-screen-map | requirements/ |
| 4 | data-engineer | data-model-as-is, business-rules | data/ |
| 5 | software-architect | system-overview, integrations, tech-debt | architecture/ |

## Prompt sugerido (colar ao ativar agente)

\`\`\`
Use os artefatos em legacy/ como fonte as-is do sistema legado a modernizar.
Priorize fatos com evidência; trate tech-debt-and-improvements.md como propostas, não como requisitos fechados.
Artefatos principais: [listar]
\`\`\`

## Lacunas que bloqueiam agentes
-
```

# Legacy Discovery

Pacote autônomo (skill + agente) para discovery de sistemas legados — análise de código e SQL, extração de regras de negócio e handoff manual para modernização.

**Não faz parte da cadeia AgentSkills.** Não altera o README, `project-context.json` nem os commands do projeto AgentSkills. Você ativa este pacote e, depois, chama os agentes do AgentSkills manualmente.

## O que inclui

| Item | Caminho |
|------|---------|
| Skill | `.cursor/skills/legacy-discovery/SKILL.md` |
| Agente | `.cursor/agents/legacy-analyst.md` |
| Referências | `.cursor/skills/legacy-discovery/references/` |
| Saída | pasta `legacy/` no projeto alvo |

## Quando usar

- Substituir sistema legado por stack nova (paridade e/ou melhorias)
- Extrair features, páginas, regras de negócio e modelo SQL as-is
- Preparar insumos para Business Analyst, Process Analyst, Requirements, Data Engineer, Architect

## Como instalar no projeto alvo

Copie para o repositório do projeto de modernização (ou use um workspace multi-root com MultSkills):

```
.cursor/
  agents/legacy-analyst.md
  skills/legacy-discovery/
    SKILL.md
    README.md
    references/
legacy/          # criada na primeira execução; pode começar vazia
```

O AgentSkills pode permanecer em outro diretório/workspace; este pacote não precisa ser mergeado nele.

## Como usar

### 1. Discovery (este pacote)

No chat do Cursor, ative o agente ou cite a skill:

```
Ative o legacy-analyst (skill legacy-discovery).
Código legado: [caminho]
SQL / schema: [caminho]
Objetivo: paridade com melhorias pontuais
```

Ou:

```
Use a skill legacy-discovery para analisar [código] e [SQL]...
```

O agente gera artefatos em `legacy/`.

### 2. Handoff manual (AgentSkills)

Com `legacy/` pronto, no projeto AgentSkills (ou no mesmo repo, se a cadeia estiver lá):

```
/activate-agent business-analyst
```

Inclua no prompt o trecho sugerido em `legacy/handoff-agentskills.md` (também documentado em `references/handoff-agentskills.md`).

Ordem sugerida:

1. business-analyst  
2. process-analyst  
3. requirements-engineer  
4. data-engineer  
5. software-architect  

## Fluxo

```text
Código legado + SQL
        │
        ▼
 legacy-analyst + legacy-discovery
        │
        ▼
   pasta legacy/
        │
        │  (handoff manual)
        ▼
 agentes AgentSkills → business/ processes/ requirements/ data/ architecture/
```

## Artefatos em `legacy/`

| Arquivo | Conteúdo |
|---------|----------|
| `system-overview.md` | Visão as-is, stack, limites |
| `feature-inventory.md` | Features por módulo |
| `page-screen-map.md` | Páginas/telas/rotas |
| `business-rules.md` | Regras com evidência |
| `data-model-as-is.md` | Modelo lógico do banco |
| `integrations.md` | Integrações e jobs |
| `tech-debt-and-improvements.md` | Dívida e propostas (não são requisitos fechados) |
| `handoff-agentskills.md` | Mapa para agentes AgentSkills |

Templates: [references/artifact-templates.md](references/artifact-templates.md)

## Princípios

- Evidência obrigatória; lacunas explícitas  
- As-is antes de melhorias  
- Sem inventar stack alvo  
- Sem atualizar a cadeia AgentSkills  

## Referências da skill

- [code-analysis-checklist.md](references/code-analysis-checklist.md)  
- [sql-analysis-guide.md](references/sql-analysis-guide.md)  
- [handoff-agentskills.md](references/handoff-agentskills.md)  
- [artifact-templates.md](references/artifact-templates.md)

---
name: legacy-discovery
description: >-
  Analisa código e banco SQL de sistemas legados para extrair regras de negócio,
  inventário de features/páginas, modelo de dados as-is e handoff para modernização.
  Use quando o usuário mencionar legado, modernização, reescrita, reverse engineering,
  discovery de sistema antigo, schema SQL legado, ou reconstrução com nova stack.
disable-model-invocation: true
---

# Legacy Discovery

Skill para discovery de sistemas legados: análise detalhada de código e SQL, extração de regras de negócio e preparação de handoff manual para agentes do AgentSkills (sem integrar à cadeia).

## Quando Usar

- Substituir/reescrever sistema legado com stack nova
- Extrair features, páginas/telas e regras de negócio do as-is
- Mapear schema SQL (DDL, constraints, procs, triggers) para documentação
- Preparar insumos para Business Analyst, Process Analyst, Requirements, Data Engineer ou Architect

## Princípios

1. **Evidência obrigatória** — toda regra/feature cita arquivo, rota, tabela ou objeto SQL
2. **Lacunas explícitas** — se não houver evidência, registrar como `lacuna` (não inventar)
3. **As-is primeiro** — documentar o que existe antes de propor melhorias
4. **Melhorias rotuladas** — propostas vão em `tech-debt-and-improvements.md`, nunca misturadas como fatos
5. **Sem stack alvo inventada** — não escolher tecnologias do sistema novo salvo o usuário pedir

## Entradas necessárias

Antes de analisar, confirme com o usuário:

| Entrada | Exemplos |
|---------|----------|
| Caminho do código | repo, pasta monolito, módulos |
| Caminho do SQL | dumps `.sql`, migrations, scripts DDL |
| Objetivo | paridade funcional vs. paridade + melhorias |
| Escopo | sistema inteiro ou módulos prioritários |

Se faltar caminho de código ou SQL, peça antes de avançar.

## Fluxo de Trabalho

Copie e acompanhe o checklist:

```
Legacy Discovery Progress:
- [ ] 1. Intake
- [ ] 2. Inventário do sistema
- [ ] 3. Análise SQL
- [ ] 4. Análise de código/UI
- [ ] 5. Regras de negócio consolidadas
- [ ] 6. Modernização (propostas)
- [ ] 7. Handoff AgentSkills
```

### 1. Intake

- Registrar caminhos, stack aparente (linguagem, framework, SGBD) e objetivo
- Definir ordem de leitura (entry points → módulos críticos → SQL)

### 2. Inventário do sistema

- Módulos, camadas, entry points, jobs/schedulers, autenticação/autorização
- Produzir rascunho de `system-overview.md` e lista inicial de domínios

### 3. Análise SQL

- Seguir [references/sql-analysis-guide.md](references/sql-analysis-guide.md)
- Tabelas, PKs/FKs, constraints, views, triggers, procedures/functions
- Inferir regras só quando sustentadas por constraint/proc/trigger; senão marcar lacuna
- Produzir `data-model-as-is.md`

### 4. Análise de código/UI

- Seguir [references/code-analysis-checklist.md](references/code-analysis-checklist.md)
- Rotas/páginas/telas, features por módulo, validações, workflows, permissões
- Produzir `feature-inventory.md`, `page-screen-map.md`, `integrations.md`

### 5. Regras de negócio

- Consolidar regras de código + DB + UI em `business-rules.md`
- Cada regra: ID, descrição, fonte(s), domínio, criticidade (alta/média/baixa ou desconhecida)

### 6. Modernização

- Em `tech-debt-and-improvements.md`: manter / melhorar / descartar
- Separar dívida técnica de oportunidade de produto
- Não assumir stack do sistema novo

### 7. Handoff

- Preencher `handoff-agentskills.md` com [references/handoff-agentskills.md](references/handoff-agentskills.md)
- Indicar quais agentes chamar manualmente e quais artefatos `legacy/` usar

## Outputs

Salve em `others_artifacts/legacy/` (templates em [references/artifact-templates.md](references/artifact-templates.md)):

| Arquivo | Conteúdo |
|---------|----------|
| `system-overview.md` | Visão as-is, stack, limites |
| `feature-inventory.md` | Features por módulo/domínio |
| `page-screen-map.md` | Páginas/telas/rotas e propósito |
| `business-rules.md` | Regras com fonte (código/SQL) |
| `data-model-as-is.md` | Modelo lógico do banco legado |
| `integrations.md` | APIs, filas, arquivos, terceiros |
| `tech-debt-and-improvements.md` | Dívida e oportunidades de melhoria |
| `handoff-agentskills.md` | Mapa artefato → agente AgentSkills |

## Colaboração manual (AgentSkills)

Após o discovery, o usuário chama agentes do AgentSkills **manualmente**. Esta skill não os invoca.

Ordem sugerida de handoff:

1. **Business Analyst** ← overview, features, regras, melhorias
2. **Process Analyst** ← páginas, regras, integrações
3. **Requirements Engineer** ← features, regras, páginas
4. **Data Engineer** ← `data-model-as-is.md`, regras de persistência
5. **Software Architect** ← overview, integrações, dívida técnica

Detalhes: [references/handoff-agentskills.md](references/handoff-agentskills.md)

## Referências

- [artifact-templates.md](references/artifact-templates.md)
- [code-analysis-checklist.md](references/code-analysis-checklist.md)
- [sql-analysis-guide.md](references/sql-analysis-guide.md)
- [handoff-agentskills.md](references/handoff-agentskills.md)
- [README.md](README.md) — uso do pacote fora da cadeia AgentSkills

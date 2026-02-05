---
name: Integração do Prompt Analista em Agents e Skills
overview: Integrar o conteúdo do prompt_analista.md (decomposição de requisitos em User Stories "Ready for Dev") na estrutura de agents e skills, criando uma nova skill e expandindo o Requirements Engineer ou criando um novo agent Product Owner.
todos:
  - id: create-user-story-skill
    content: Criar skill user-story-decomposition em .cursor/skills/user-story-decomposition/SKILL.md com conteúdo adaptado do prompt_analista.md
    status: completed
  - id: create-user-story-template
    content: Criar template de User Story em .cursor/skills/user-story-decomposition/references/user-story-template.md
    status: completed
  - id: create-gherkin-guide
    content: Criar guia Gherkin em .cursor/skills/user-story-decomposition/references/gherkin-guide.md
    status: completed
  - id: update-requirements-engineer
    content: Atualizar .cursor/agents/requirements-engineer.md para incluir criação de User Stories usando a nova skill
    status: completed
    dependencies:
      - create-user-story-skill
  - id: update-readme
    content: Atualizar README.md para documentar a nova skill e processo de User Stories
    status: completed
    dependencies:
      - create-user-story-skill
      - update-requirements-engineer
---

# Integração do Prompt Analista em Agents e Skills

## Análise do Conteúdo

O arquivo `artefatos/Analista/prompt_analista.md` contém um processo completo para decomposição de requisitos em User Stories "Ready for Dev", incluindo:

- Persona: Analista de Sistemas Sênior e Product Owner técnico
- Objetivo: Decompor requisitos de alto nível em User Stories claras e prontas para desenvolvimento
- Processo detalhado com:
  - Análise e clarificação
  - Identificação de User Stories
  - Detalhamento completo (título, descrição formato "Como um...", critérios de aceitação em Gherkin, tarefas técnicas por área)
  - Princípios INVEST
  - Formato de saída estruturado

## Lacuna Identificada

No fluxo atual, há uma lacuna entre:

- **Requirements Engineer**: Gera requisitos funcionais/não-funcionais, SRS, backlog priorizado
- **Desenvolvimento**: Frontend/Backend Developers que precisam de User Stories detalhadas

O `prompt_analista.md` preenche essa lacuna, transformando requisitos em User Stories "Ready for Dev" com critérios de aceitação e tarefas técnicas.

## Proposta de Integração

### Opção 1: Criar Nova Skill + Expandir Requirements Engineer (Recomendado)

**1. Criar nova skill: `user-story-decomposition`**

- Localização: `.cursor/skills/user-story-decomposition/SKILL.md`
- Conteúdo baseado no `prompt_analista.md`:
  - Processo de decomposição em User Stories
  - Formato INVEST
  - Critérios de aceitação em Gherkin
  - Tarefas técnicas por área (Backend, Frontend, Banco de Dados)
  - Template de User Story completo
- Referências: Criar `references/user-story-template.md` e `references/gherkin-guide.md`

**2. Expandir Requirements Engineer**

- Adicionar responsabilidade de criar User Stories detalhadas
- Usar a skill `user-story-decomposition` no processo de trabalho
- Adicionar artefato `user-stories-ready-for-dev.md` nos outputs
- Posicionar após a criação do backlog priorizado

### Opção 2: Criar Novo Agent "Product Owner"

**1. Criar novo agent: `product-owner.md`**

- Localização: `.cursor/agents/product-owner.md`
- Persona baseada no `prompt_analista.md`
- Dependências: Requirements Engineer e Software Architect
- Usa skill `user-story-decomposition`
- Gera User Stories "Ready for Dev"

**2. Criar skill: `user-story-decomposition`** (mesmo da Opção 1)

## Implementação Recomendada (Opção 1)

### Arquivos a Criar/Modificar

1. **`.cursor/skills/user-story-decomposition/SKILL.md`** (NOVO)

   - Extrair e adaptar conteúdo do `prompt_analista.md`
   - Estruturar como skill reutilizável
   - Incluir instruções detalhadas do processo

2. **`.cursor/skills/user-story-decomposition/references/user-story-template.md`** (NOVO)

   - Template completo de User Story com todos os campos
   - Exemplos de critérios de aceitação em Gherkin

3. **`.cursor/skills/user-story-decomposition/references/gherkin-guide.md`** (NOVO)

   - Guia de sintaxe Gherkin
   - Exemplos de cenários de teste

4. **`.cursor/agents/requirements-engineer.md`** (MODIFICAR)

   - Adicionar responsabilidade de criar User Stories
   - Incluir uso da skill `user-story-decomposition`
   - Adicionar `user-stories-ready-for-dev.md` nos artefatos gerados
   - Atualizar processo de trabalho

5. **`README.md`** (MODIFICAR)

   - Documentar a nova skill
   - Atualizar fluxo de execução se necessário

### Estrutura da Nova Skill

A skill `user-story-decomposition` deve conter:

- **Quando Usar**: Após requisitos especificados e arquitetura definida
- **Instruções**:

  1. Análise e clarificação de insumos
  2. Identificação de User Stories (evitar Epics)
  3. Detalhamento completo de cada User Story:

     - Título (formato US-XXX)
     - Descrição (Como um... Eu quero... Para que...)
     - Critérios de aceitação em Gherkin
     - Tarefas técnicas por área
     - Dependências e notas

  1. Validação INVEST
  2. Consideração de casos de falha e borda

- **Outputs**: `user-stories-ready-for-dev.md` em `outputs/artifacts/requirements/`

### Fluxo Atualizado

```
Requirements Engineer
  ├─ Especifica requisitos (SRS)
  ├─ Prioriza backlog
  └─ Cria User Stories "Ready for Dev" ← NOVO
      └─ Usa skill: user-story-decomposition
```

## Benefícios

1. **Reutilização**: Skill pode ser usada por outros agents se necessário
2. **Consistência**: Processo padronizado de criação de User Stories
3. **Completude**: Preenche lacuna entre requisitos e desenvolvimento
4. **Rastreabilidade**: User Stories ligadas a requisitos e arquitetura
5. **Pronto para Dev**: User Stories com critérios claros e tarefas técnicas

## Validação

Após implementação, verificar:

- [ ] Skill criada e documentada
- [ ] Requirements Engineer atualizado
- [ ] Templates e referências criados
- [ ] README atualizado
- [ ] Fluxo de execução documentado
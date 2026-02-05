---
name: Integração de conteúdo de arquitetura em agentes e skills
overview: Integrar o conteúdo dos arquivos de arquitetura (prompt_arquitetura.txt, orientacoes_arquitetura.md, stacks_atuais.md) na estrutura existente de agentes e skills, enriquecendo o agente software-architect e a skill architecture-design com os princípios, diretrizes e práticas já validadas.
todos:
  - id: criar-referencias
    content: "Criar três arquivos de referência em architecture-design/references/: orientacoes-arquiteturais.md, stacks-atuais.md, e guia-alternativas-arquiteturais.md"
    status: completed
  - id: enriquecer-skill
    content: Enriquecer architecture-design/SKILL.md com princípios, padrões, gestão de atributos de qualidade, práticas essenciais e estrutura para alternativas
    status: completed
    dependencies:
      - criar-referencias
  - id: enriquecer-agente
    content: Enriquecer software-architect.md com contexto, referências aos documentos, processo expandido e requisitos adicionais
    status: completed
    dependencies:
      - criar-referencias
      - enriquecer-skill
---

# Integração de Conteúdo de Arquitetura em Agentes e Skills

## Objetivo

Integrar o conteúdo validado dos arquivos de arquitetura (`artefatos/Arquiteto/`) na estrutura de agentes e skills, enriquecendo o agente `software-architect` e a skill `architecture-design` com os princípios, diretrizes e práticas já estabelecidas.

## Análise do Conteúdo Disponível

### Arquivos de Entrada

1. **`prompt_arquitetura.txt`** - Prompt detalhado com:

- Contexto sobre software house, Scrum, Cursor AI
- Estrutura para propor múltiplas alternativas de arquitetura
- Formato detalhado de resposta (Visão Geral, Diagrama C4, Componentes Chave, Gestão de Atributos de Qualidade, Trade-offs)
- Requisitos sobre transparência, vieses, iteração

2. **`orientacoes_arquitetura.md`** - Diretrizes arquiteturais com:

- Princípios gerais (Foco no Valor, Evolvabilidade, Agilidade, Qualidade, Data-Driven)
- Padrões preferenciais (Modular Monolith, Microsserviços, EDA, etc.)
- Gestão de atributos de qualidade (Escalabilidade, Resiliência, Segurança, Desempenho)
- Ferramentas e práticas (ADRs, C4, Conway's Law, Architecture Haiku)
- Reaproveitamento de stacks atuais

3. **`stacks_atuais.md`** - Lista organizada de tecnologias por categoria

## Pontos de Integração Identificados

### 1. Agente `software-architect.md`

- Adicionar contexto sobre software house, Scrum, Cursor AI
- Incorporar estrutura para propor múltiplas alternativas de arquitetura
- Referenciar documentos de orientação arquitetural
- Incluir requisitos sobre transparência, vieses e iteração

### 2. Skill `architecture-design/SKILL.md`

- Enriquecer com princípios arquiteturais detalhados
- Adicionar padrões preferenciais (Modular Monolith, Microsserviços, EDA)
- Incluir gestão detalhada de atributos de qualidade
- Incorporar práticas essenciais (ADRs, C4, Conway's Law, Architecture Haiku)
- Adicionar estrutura para apresentar múltiplas alternativas com opções tecnológicas

### 3. Referências em `architecture-design/references/`

- Criar `orientacoes-arquiteturais.md` (baseado em `orientacoes_arquitetura.md`)
- Criar `stacks-atuais.md` (baseado em `stacks_atuais.md`)
- Criar `guia-alternativas-arquiteturais.md` (baseado na estrutura de `prompt_arquitetura.txt`)

## Implementação

### Etapa 1: Criar Arquivos de Referência

1. Criar `.cursor/skills/architecture-design/references/orientacoes-arquiteturais.md`

- Copiar e adaptar conteúdo de `artefatos/Arquiteto/orientacoes_arquitetura.md`
- Ajustar referências para o contexto da estrutura de skills

2. Criar `.cursor/skills/architecture-design/references/stacks-atuais.md`

- Copiar conteúdo de `artefatos/Arquiteto/stacks_atuais.md`
- Manter formato organizado por categorias

3. Criar `.cursor/skills/architecture-design/references/guia-alternativas-arquiteturais.md`

- Extrair estrutura de resposta de `prompt_arquitetura.txt`
- Criar guia sobre como propor múltiplas alternativas de arquitetura
- Incluir formato detalhado (Visão Geral, Diagrama C4, Componentes Chave, etc.)

### Etapa 2: Enriquecer Skill `architecture-design/SKILL.md`

1. Adicionar seção "Contexto e Princípios"

- Referenciar `orientacoes-arquiteturais.md`
- Incorporar princípios gerais (Foco no Valor, Evolvabilidade, Agilidade, Qualidade, Data-Driven)

2. Expandir seção "Escolha de Padrão Arquitetural"

- Adicionar padrões preferenciais: Modular Monolith, Microsserviços, EDA, Pipes and Filters
- Incluir justificativas e quando usar cada padrão

3. Expandir seção "Seleção de Stack Tecnológico"

- Referenciar `stacks-atuais.md`
- Adicionar estrutura para apresentar múltiplas opções (Opção A alinhada às stacks atuais, Opção B alternativa)
- Incluir análise de trade-offs

4. Adicionar seção "Gestão de Atributos de Qualidade"

- Escalabilidade e Elasticidade
- Resiliência (Circuit Breaker, Bulkhead, Timeouts, Retries)
- Segurança (Princípio do Menor Privilégio, Defesa em Profundidade, Zero Trust)
- Desempenho (Response Time, Throughput)
- Evolvabilidade e Manutenibilidade

5. Adicionar seção "Práticas Essenciais"

- ADRs (já mencionado, mas expandir)
- C4 Model (já mencionado, mas expandir)
- Conway's Law e estrutura organizacional
- Architecture Haiku
- Gerenciamento de Dívida Técnica

6. Adicionar seção "Proposta de Alternativas de Arquitetura"

- Referenciar `guia-alternativas-arquiteturais.md`
- Estrutura para propor duas ou mais alternativas
- Análise comparativa e recomendações

### Etapa 3: Enriquecer Agente `software-architect.md`

1. Adicionar contexto no início

- Software house com times Scrum
- Transição para desenvolvimento auxiliado por IA (Cursor AI)
- Objetivo de otimizar design arquitetural e acelerar entrega

2. Expandir seção "Processo de Trabalho"

- Adicionar passo para consultar `orientacoes-arquiteturais.md` e `stacks-atuais.md`
- Incluir passo para propor múltiplas alternativas de arquitetura
- Adicionar passo para análise de trade-offs e recomendações

3. Adicionar seção "Documentos de Referência"

- Listar documentos de orientação arquitetural disponíveis
- Explicar quando consultar cada documento

4. Expandir seção "Validação"

- Adicionar checklist para múltiplas alternativas consideradas
- Incluir validação de alinhamento com orientações arquiteturais
- Adicionar validação de análise de trade-offs

5. Adicionar seção "Requisitos Adicionais"

- Transparência nas justificativas
- Consciência de vieses (Viés de Recência, Viés de Confirmação)
- Iteração quando necessário

## Arquivos a Modificar/Criar

### Criar

- `.cursor/skills/architecture-design/references/orientacoes-arquiteturais.md`
- `.cursor/skills/architecture-design/references/stacks-atuais.md`
- `.cursor/skills/architecture-design/references/guia-alternativas-arquiteturais.md`

### Modificar

- `.cursor/skills/architecture-design/SKILL.md`
- `.cursor/agents/software-architect.md`

## Benefícios Esperados

1. **Consistência**: Agentes seguirão diretrizes arquiteturais estabelecidas
2. **Qualidade**: Incorporação de práticas validadas e princípios testados
3. **Eficiência**: Reaproveitamento de stacks atuais reduzindo curva de aprendizado
4. **Transparência**: Estrutura clara para apresentar alternativas e trade-offs
5. **Evolução**: Base sólida para evolução contínua das práticas arquiteturais
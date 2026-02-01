---
name: architecture-design
description: Projeta arquitetura de software, escolhe tecnologias, e cria diagramas C4 e ADRs. Use quando precisar projetar arquitetura do sistema, escolher stack tecnológico, ou documentar decisões arquiteturais.
---

# Architecture Design

Skill para design completo de arquitetura de software.

## Quando Usar

- Projeto de arquitetura do sistema
- Seleção de stack tecnológico
- Criação de diagramas de arquitetura
- Documentação de decisões arquiteturais
- Especificação de APIs

## Instruções

1. **Análise de Requisitos**
   - Revise requisitos funcionais e não-funcionais
   - Identifique restrições técnicas
   - Analise requisitos de escalabilidade e performance

2. **Escolha de Padrão Arquitetural**
   - Monolito vs. Microserviços
   - Arquitetura em camadas
   - Event-driven architecture
   - Justifique a escolha baseada em requisitos

3. **Seleção de Stack Tecnológico**
   - Linguagens de programação
   - Frameworks e bibliotecas
   - Bancos de dados (SQL, NoSQL)
   - Ferramentas de mensageria
   - Justifique cada escolha

4. **Criação de Diagramas C4**
   - **Context Diagram** - Visão de alto nível do sistema
   - **Container Diagram** - Componentes principais
   - **Component Diagram** - Estrutura interna (quando necessário)
   - Use notação C4 padrão

5. **Documentação de ADRs (Architectural Decision Records)**
   - Documente decisões importantes
   - Inclua contexto, decisão e consequências
   - Use formato ADR padrão

6. **Especificação de APIs**
   - Identifique APIs principais
   - Documente endpoints essenciais
   - Especifique contratos básicos

## Outputs

Salve os seguintes arquivos em `outputs/artifacts/architecture/`:
- `architecture-document.md` - Documento de Arquitetura (SAD)
- `technology-stack.md` - Stack tecnológico
- `c4-diagrams/` - Diagramas C4
- `adrs/` - Arquitetural Decision Records
- `api-specification.md` - Especificação de APIs

## Referências

Consulte `references/c4-model-guide.md` e `references/adr-template.md` para templates.

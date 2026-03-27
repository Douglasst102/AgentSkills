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
- Proposta de múltiplas alternativas arquiteturais

## Contexto e Princípios

Antes de iniciar o design arquitetural, consulte `references/orientacoes-arquiteturais.md` para entender os princípios e diretrizes arquiteturais da software house. Os princípios fundamentais são:

- **Foco no Valor de Negócio:** Toda decisão arquitetural deve ser justificada pelo seu impacto positivo nos objetivos de negócio.
- **Evolvabilidade e Adaptabilidade:** Sistemas devem evoluir continuamente com o mínimo de atrito.
- **Agilidade e Entrega Contínua:** Arquiteturas devem facilitar CI/CD e operação de times Scrum autônomos.
- **Qualidade e Manutenibilidade:** Simplicidade estrutural, baixo acoplamento e alta coesão são pilares fundamentais.
- **Decisões Orientadas a Dados:** Escolhas baseadas em dados (estimativas de carga, custos, riscos) e não em opiniões subjetivas.

## Instruções

1. **Análise de Requisitos**
   - Revise requisitos funcionais e não-funcionais em `requirements/`
   - Identifique restrições técnicas
   - Analise requisitos de escalabilidade e performance
   - Utilize "Back-of-the-Envelope Calculations" para validar suposições de escala

2. **Escolha de Padrão Arquitetural**

   Consulte `references/orientacoes-arquiteturais.md` para padrões preferenciais. Considere os seguintes estilos:

   - **Modular Monolith (Monólito Modular):** Recomendado para projetos em fase inicial ou com domínio ainda não totalmente claro. Permite evoluir para microsserviços posteriormente sem a complexidade inicial de um sistema distribuído.
   
   - **Microsserviços:** Para domínios de negócio bem delimitados e complexos, onde autonomia de times, escalabilidade granular e resiliência são críticas. A decomposição deve ser alinhada a "Bounded Contexts" (DDD).
   
   - **Arquiteturas Orientadas a Eventos (EDA):** Para cenários que exigem alto desacoplamento, alta reatividade e resiliência (especialmente em integrações). Comunicação assíncrona via eventos (ex: RabbitMQ) deve ser priorizada.
   
   - **Arquitetura em Camadas:** Pode ser utilizada para estruturação interna de módulos ou microsserviços, mas evite o anti-padrão "Architecture Sinkhole".
   
   - **Pipes and Filters:** Para processamento de fluxos de dados, pipelines de ETL ou transformações sequenciais.

   Justifique a escolha baseada em requisitos e consulte as orientações arquiteturais.

3. **Seleção de Stack Tecnológico**

   Consulte `references/stacks-atuais.md` para a lista completa de tecnologias disponíveis. Para cada componente arquitetural, apresente múltiplas opções:

   - **Opção A (Alinhada às Stacks Atuais):**
     - Tecnologia/Serviço da `stacks-atuais.md`
     - Justificativa: Alinhamento com stacks atuais, baixo impacto na curva de aprendizado
     - Trade-offs: Custos, riscos ou limitações
   
   - **Opção B (Alternativa/Inovadora - com justificativa):**
     - Tecnologia/Serviço diferente, possivelmente fora da `stacks-atuais.md`
     - Justificativa: Por que é superior, quais problemas resolve, quais atributos de qualidade aprimora
     - Trade-offs: Custos, riscos, limitações, potencial curva de aprendizado

   Priorize soluções que reaproveitem conhecimentos das stacks atuais, a menos que haja justificativa clara de negócio ou técnica para inovar. Sempre apresente análise de trade-offs clara.

4. **Gestão de Atributos de Qualidade**

   Demonstre como a arquitetura proposta aborda os seguintes atributos de qualidade (consulte `references/orientacoes-arquiteturais.md` para detalhes):

   - **Escalabilidade e Elasticidade:** Priorize soluções que suportem scale-out (horizontal) e utilizem elasticidade de serviços de nuvem. Caching agressivo e comunicação assíncrona são táticas fundamentais.
   
   - **Resiliência:** Implemente padrões como Circuit Breaker, Bulkhead, Timeouts e Retries. Considere estratégias de redundância e recuperação de falhas desde o design inicial.
   
   - **Segurança:** Segurança por design é mandatório. Considere o Princípio do Menor Privilégio, Defesa em Profundidade (ex: DMZ), Zero Trust e Modelagem de Ameaças (ex: STRIDE). Incorpore mecanismos de segurança desde o nível da plataforma até a aplicação.
   
   - **Desempenho:** Otimize o Response Time para o usuário e o Throughput do sistema. Identifique e gerencie gargalos (especialmente em bancos de dados).
   
   - **Evolvabilidade e Manutenibilidade:** A arquitetura deve facilitar a evolução e manutenção do sistema. Priorize designs que permitam mudanças incrementais, refatoração contínua e baixa dívida técnica.

5. **Práticas Essenciais**

   - **ADRs (Architecture Decision Records):** Obrigatório para registrar decisões arquiteturais significativas, suas justificativas, alternativas consideradas e trade-offs. Use o template em `references/adr-template.md`.
   
   - **C4 Model:** Utilize o Modelo C4 (Contexto, Contêineres, Componentes, Código) para diagramas, garantindo clareza e níveis de abstração apropriados. Consulte `references/c4-model-guide.md`.
   
   - **Conway's Law:** Considere o impacto na estrutura organizacional, visando a formação de equipes autônomas e multidisciplinares ("Two-Pizza Teams" ou "Stream-Aligned Teams") e minimizando a carga cognitiva.
   
   - **Architecture Haiku:** Use para resumir a essência do sistema de forma concisa e compartilhável.
   
   - **Gerenciamento de Dívida Técnica:** A dívida técnica arquitetural, quando assumida, deve ser deliberada, justificada (via ADR) e ter um plano de pagamento. Identifique "hotspots" de código para direcionar esforços de refatoração.

6. **Proposta de Alternativas de Arquitetura**

   Consulte `references/guia-alternativas-arquiteturais.md` para a estrutura completa. Proponha **duas ou mais alternativas de arquitetura**, cada uma seguindo a estrutura:

   - Visão Geral (descrição, alinhamento com requisitos e orientações)
   - Diagrama de Alto Nível (C4 - Contexto e Contêineres)
   - Componentes Chave e Opções Tecnológicas (com múltiplas opções por componente)
   - Gestão de Atributos de Qualidade
   - Análise de Trade-offs e Recomendações

   Após apresentar todas as alternativas, inclua uma análise comparativa e uma recomendação inicial justificada.

7. **Criação de Diagramas C4**
   - **Context Diagram** - Visão de alto nível do sistema
   - **Container Diagram** - Componentes principais
   - **Component Diagram** - Estrutura interna (quando necessário)
   - Use notação C4 padrão (consulte `references/c4-model-guide.md`)

8. **Documentação de ADRs (Architectural Decision Records)**
   - Documente decisões importantes
   - Inclua contexto, decisão e consequências
   - Use formato ADR padrão (consulte `references/adr-template.md`)

9. **Especificação de APIs**
   - Identifique APIs principais
   - Documente endpoints essenciais
   - Especifique contratos básicos

## Outputs

Salve os seguintes arquivos em `architecture/`:
- `architecture-document.md` - Documento de Arquitetura (SAD)
- `technology-stack.md` - Stack tecnológico
- `c4-diagrams/` - Diagramas C4
- `adrs/` - Arquitetural Decision Records
- `api-specification.md` - Especificação de APIs

## Referências

Consulte os seguintes arquivos de referência:

- `references/orientacoes-arquiteturais.md` - Princípios e diretrizes arquiteturais da software house
- `references/stacks-atuais.md` - Lista de tecnologias disponíveis nas stacks atuais
- `references/guia-alternativas-arquiteturais.md` - Estrutura para propor múltiplas alternativas de arquitetura
- `references/c4-model-guide.md` - Guia do Modelo C4 para diagramas
- `references/adr-template.md` - Template para Architecture Decision Records

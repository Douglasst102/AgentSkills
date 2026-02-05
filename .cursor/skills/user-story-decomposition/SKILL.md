---
name: user-story-decomposition
description: Decompõe requisitos de alto nível em User Stories "Ready for Dev" com critérios de aceitação em Gherkin e tarefas técnicas. Use quando precisar transformar requisitos especificados em histórias de usuário prontas para desenvolvimento, após a especificação de requisitos e definição de arquitetura.
---

# User Story Decomposition

Skill para decomposição de requisitos em User Stories claras, concisas e prontas para desenvolvimento ("Ready for Dev").

## Quando Usar

- Após especificação de requisitos estar completa
- Após arquitetura do sistema estar definida
- Quando necessário transformar requisitos em User Stories detalhadas
- Para criar histórias de usuário com critérios de aceitação testáveis
- Quando preparar backlog para desenvolvimento

## Instruções

### 1. Análise e Clarificação

Antes de tudo, analise os insumos disponíveis:
- Requisitos funcionais e não-funcionais
- Arquitetura do sistema (diagramas C4, ADRs)
- Personas de usuário identificadas
- Restrições e regras de negócio

Se houver qualquer ambiguidade, inconsistência ou informação faltante, **faça perguntas claras e objetivas** para garantir que você tenha tudo o que precisa. Não presuma nada.

### 2. Identificação de User Stories

Com base nos requisitos, identifique as User Stories principais que entregam valor ao usuário:
- Evite histórias muito grandes (Epics)
- Se identificar um Epic, sugira sua quebra em histórias menores
- Agrupe histórias relacionadas em épicos para organização
- Priorize histórias que entregam valor independente

### 3. Detalhamento de Cada User Story

Para cada User Story identificada, crie uma estrutura completa:

#### Título
- Formato: `US-XXX: [Nome descritivo]`
- Exemplo: `US-001: Autenticação de usuário por e-mail e senha`

#### Descrição (Formato Padrão)
Utilize o formato consagrado "Como um... eu quero... para que...":
```
**Como um** [Persona de Usuário],
**Eu quero** [Realizar uma ação],
**Para que** [Eu possa obter um benefício/valor].
```

#### Critérios de Aceitação (ACs)
Liste todos os critérios que definem que a história está "pronta" e funcionando corretamente. Use o formato **Gherkin (Dado-Quando-Então)** para máxima clareza e testabilidade:

```
**AC 01: [Nome do cenário]**
- **Dado** que [condição inicial]
- **E** [condição adicional]
- **Quando** [ação do usuário]
- **E** [ação adicional]
- **Então** [resultado esperado]
- **E** [resultado adicional]
```

**Importante:**
- Crie critérios para o "caminho feliz" e para casos de erro
- Inclua validações e casos de borda
- Cada AC deve ser testável e verificável

#### Tarefas Técnicas Sugeridas
Com base na arquitetura fornecida, sugira uma lista de tarefas técnicas necessárias para implementar a história. Separe por área de atuação:

- **Backend:**
  - Criar endpoints necessários
  - Implementar lógica de negócio
  - Configurar autenticação/autorização
  - Implementar validações

- **Frontend:**
  - Criar componentes de interface
  - Implementar chamadas à API
  - Gerenciar estado e navegação
  - Implementar validações de formulário

- **Banco de Dados:**
  - Verificar/criar estruturas de dados
  - Criar migrações se necessário
  - Definir índices e constraints

- **Testes:**
  - Criar testes unitários
  - Criar testes de integração
  - Criar testes end-to-end

#### Dependências e Notas
- Liste dependências de outras User Stories
- Anote observações técnicas importantes
- Documente decisões de design relevantes
- Inclua referências a documentos de arquitetura

### 4. Validação INVEST

Valide cada User Story contra os princípios INVEST:

- **I**ndependentes: A história pode ser desenvolvida independentemente
- **N**egociáveis: Detalhes podem ser negociados sem perder o valor
- **V**aliosas: Entrega valor ao usuário ou negócio
- **E**stimáveis: A equipe consegue estimar o esforço
- **S**mall (Pequenas): Podem ser completadas em uma sprint
- **T**estáveis: Possuem critérios de aceitação claros e testáveis

### 5. Consideração de Casos de Falha e Borda

Não se limite ao "caminho feliz":
- Crie critérios de aceitação para erros de validação
- Inclua tratamento de falhas de sistema
- Considere casos de borda e limites
- Documente comportamento em cenários de erro

### 6. Requisitos Não-Funcionais (NFRs)

Se aplicável:
- Crie histórias ou tarefas separadas para requisitos de segurança
- Inclua considerações de performance
- Documente requisitos de logs e auditoria
- Especifique requisitos de usabilidade e acessibilidade

## Princípios e Melhores Práticas

Sempre aplique os seguintes princípios:

- **Clareza Absoluta:** Escreva de forma que não haja margem para dupla interpretação
- **Foco no "O Quê", Não no "Como":** A história e os critérios de aceitação devem focar no comportamento esperado (o quê), enquanto as tarefas técnicas sugerem a implementação (o como)
- **Rastreabilidade:** Mantenha ligação clara entre User Stories, requisitos funcionais e necessidades de negócio
- **Organização:** Agrupe histórias relacionadas em épicos para facilitar o planejamento

## Outputs

Salve o seguinte arquivo em `outputs/artifacts/requirements/`:
- `user-stories-ready-for-dev.md` - Documento completo com todas as User Stories detalhadas, organizadas por épicos, incluindo:
  - Personas identificadas
  - Índice de User Stories
  - Detalhamento completo de cada história
  - Critérios de aceitação em Gherkin
  - Tarefas técnicas por área
  - Dependências entre histórias

## Formato de Saída

Apresente o resultado final em Markdown, bem estruturado, usando títulos e listas para facilitar a leitura e o "copia e cola" para ferramentas como Jira ou Azure DevOps.

## Referências

Consulte:
- `references/user-story-template.md` - Template completo de User Story
- `references/gherkin-guide.md` - Guia de sintaxe Gherkin e exemplos

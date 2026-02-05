# Cadeia de Desenvolvimento com Agentes no Cursor

Sistema completo de desenvolvimento de software usando agentes especializados no Cursor IDE, implementando uma cadeia automatizada desde a análise de negócios até a entrega do software.

## Visão Geral

Este projeto implementa uma cadeia de desenvolvimento de software completa utilizando:

- **Subagents** - 11 agentes especializados em diferentes etapas do desenvolvimento
- **Skills** - Capacidades específicas de cada agente
- **Commands** - Comandos para orquestração e controle
- **MCP** - Integrações externas opcionais

## Estrutura do Projeto

```
AgentSkills/
├── .cursor/
│   ├── agents/              # Subagents especializados
│   ├── skills/            # Skills por domínio
│   ├── commands/          # Commands de orquestração
│   ├── project-context.json  # Contexto compartilhado
│   └── mcp.json          # Configuração MCP (opcional)
├── outputs/
│   └── artifacts/         # Artefatos gerados por cada etapa
└── README.md
```

## Agentes Disponíveis

### 1. Business Analyst
- **Arquivo:** `.cursor/agents/business-analyst.md`
- **Skill:** `business-analysis`
- **Responsabilidade:** Análise de negócios, identificação de stakeholders, visão do produto

### 2. Process Analyst
- **Arquivo:** `.cursor/agents/process-analyst.md`
- **Skill:** `process-mapping`
- **Responsabilidade:** Mapeamento de processos de negócio, diagramas BPMN

### 3. Requirements Engineer
- **Arquivo:** `.cursor/agents/requirements-engineer.md`
- **Skills:** `requirements-spec`, `user-story-decomposition`
- **Responsabilidade:** Especificação de requisitos funcionais e não-funcionais, decomposição em User Stories "Ready for Dev"

### 4. Software Architect
- **Arquivo:** `.cursor/agents/software-architect.md`
- **Skill:** `architecture-design`
- **Responsabilidade:** Design de arquitetura, seleção de tecnologias, diagramas C4

### 5. Technical Analyst
- **Arquivo:** `.cursor/agents/technical-analyst.md`
- **Skill:** `technical-spec`
- **Responsabilidade:** Especificações técnicas, contratos de API, modelos de dados

### 6. DevOps Engineer
- **Arquivo:** `.cursor/agents/devops-engineer.md`
- **Skill:** `devops-infra`
- **Responsabilidade:** Infraestrutura, Docker, Kubernetes, CI/CD

### 7. UI/UX Designer
- **Arquivo:** `.cursor/agents/uiux-designer.md`
- **Skill:** `uiux-design` (integra `interface-design`)
- **Responsabilidade:** Wireframes, mockups, design system
- **Comandos:** `/interface-design:init`, `/interface-design:status`, `/interface-design:audit`, `/interface-design:extract`

### 8. Frontend Developer
- **Arquivo:** `.cursor/agents/frontend-developer.md`
- **Skill:** `frontend-dev`
- **Responsabilidade:** Implementação frontend, componentes, performance

### 9. Backend Developer
- **Arquivo:** `.cursor/agents/backend-developer.md`
- **Skill:** `backend-dev`
- **Responsabilidade:** Implementação backend, APIs, lógica de negócio

### 10. Security Engineer
- **Arquivo:** `.cursor/agents/security-engineer.md`
- **Skill:** `security-audit`
- **Responsabilidade:** Análise de segurança, vulnerabilidades, relatórios

### 11. QA Engineer
- **Arquivo:** `.cursor/agents/qa-engineer.md`
- **Skill:** `qa-testing`
- **Responsabilidade:** Estratégia de testes, casos de teste, validação

## Commands Disponíveis

### `/start-dev-chain`
Inicia a cadeia completa de desenvolvimento, orquestrando todos os agentes na sequência correta.

**Uso:**
```
/start-dev-chain
```

Forneça:
- Nome do projeto
- Descrição inicial do cliente
- Objetivos principais

### `/activate-agent <nome-do-agente>`
Ativa um agente específico para trabalhar em uma etapa particular.

**Exemplos:**
- `/activate-agent business-analyst`
- `/activate-agent software-architect`
- `/activate-agent security-engineer`

### `/view-progress`
Exibe o status atual de todas as etapas da cadeia de desenvolvimento.

### `/validate-stage <nome-da-etapa>`
Valida os artefatos e completude de uma etapa específica.

**Etapas disponíveis:**
- `business`, `processes`, `requirements`, `architecture`, `technical`
- `infrastructure`, `design`, `frontend`, `backend`, `security`, `testing`

### `/sync-context`
Sincroniza o contexto compartilhado entre agentes.

### Comandos de Interface Design

O skill `uiux-design` integra os comandos do `interface-design`:

#### `/interface-design:init`
Inicia o processo de design de interface com princípios de craft e consistência.

**Uso:**
```
/interface-design:init
```

#### `/interface-design:status`
Mostra o estado atual do design system, incluindo direção, tokens e padrões.

**Uso:**
```
/interface-design:status
```

#### `/interface-design:audit <caminho>`
Verifica código existente contra o design system para violações de espaçamento, profundidade, cor e padrões.

**Uso:**
```
/interface-design:audit <caminho>     # Audita arquivo/diretório específico
/interface-design:audit                # Audita caminhos UI comuns
```

#### `/interface-design:extract <caminho>`
Extrai padrões de design do código existente para criar um arquivo `system.md`.

**Uso:**
```
/interface-design:extract              # Extrai de caminhos UI comuns
/interface-design:extract <caminho>   # Extrai de diretório específico
```

## Fluxo de Execução

1. **Business Analyst** - Análise de negócios
2. **Process Analyst** - Mapeamento de processos
3. **Requirements Engineer** - Especificação de requisitos e criação de User Stories "Ready for Dev"
4. **Software Architect** - Design de arquitetura
5. **Technical Analyst** - Especificações técnicas
6. **DevOps Engineer** - Infraestrutura (paralelo com Technical)
7. **UI/UX Designer** - Design (paralelo com Architecture)
8. **Frontend Developer** - Implementação frontend
9. **Backend Developer** - Implementação backend (paralelo com Frontend)
10. **Security Engineer** - Revisão de segurança
11. **QA Engineer** - Testes e validação final

## Contexto Compartilhado

O arquivo `.cursor/project-context.json` mantém o estado compartilhado entre todos os agentes, incluindo:
- Status de cada etapa
- Artefatos gerados
- Metadados do projeto
- Dependências entre etapas

## Artefatos Gerados

Cada agente gera artefatos específicos em `outputs/artifacts/{etapa}/`:

- **business/** - Visão do produto, stakeholders, requisitos de negócio
- **processes/** - Mapeamento de processos, diagramas BPMN
- **requirements/** - SRS, matriz de rastreabilidade, backlog, User Stories "Ready for Dev"
- **architecture/** - SAD, diagramas C4, ADRs
- **technical/** - Especificações técnicas, contratos OpenAPI
- **infrastructure/** - Dockerfiles, manifests K8s, pipelines CI/CD
- **design/** - Wireframes, mockups, design system
- **frontend/** - Código frontend, componentes
- **backend/** - Código backend, APIs
- **security/** - Relatórios de segurança, vulnerabilidades
- **testing/** - Estratégia de testes, casos de teste, relatórios

## Integração MCP

O arquivo `.cursor/mcp.json` permite configurar integrações externas opcionais:

- **Notion** - Para documentação
- **Jira** - Para gerenciamento de projetos

Configure as credenciais necessárias no arquivo.

## Como Usar

1. **Iniciar um novo projeto:**
   ```
   /start-dev-chain
   ```
   Forneça as informações iniciais do projeto.

2. **Ativar um agente específico:**
   ```
   /activate-agent business-analyst
   ```

3. **Verificar progresso:**
   ```
   /view-progress
   ```

4. **Validar uma etapa:**
   ```
   /validate-stage requirements
   ```

## Dependências Entre Etapas

Cada agente verifica automaticamente se suas dependências estão completas antes de iniciar. O contexto compartilhado mantém o estado de cada etapa.

## Skills Disponíveis

### Requirements Specification (`requirements-spec`)
Especifica requisitos funcionais e não-funcionais, cria SRS, e prioriza requisitos.

### User Story Decomposition (`user-story-decomposition`)
Decompõe requisitos de alto nível em User Stories "Ready for Dev" com:
- Critérios de aceitação em formato Gherkin
- Tarefas técnicas por área (Backend, Frontend, Banco de Dados, Testes)
- Validação contra princípios INVEST
- Dependências e notas técnicas

**Referências:**
- `references/user-story-template.md` - Template completo de User Story
- `references/gherkin-guide.md` - Guia de sintaxe Gherkin e exemplos

### Business Analysis (`business-analysis`)
Analisa requisitos de negócio, identifica stakeholders, e cria visão do produto.

### Process Mapping (`process-mapping`)
Mapeia processos de negócio e cria diagramas BPMN.

### Architecture Design (`architecture-design`)
Projeta arquitetura do sistema, escolhe tecnologias, e cria diagramas C4.

### Technical Specification (`technical-spec`)
Cria especificações técnicas detalhadas, contratos de API OpenAPI/Swagger, e modelos de dados.

### DevOps Infrastructure (`devops-infra`)
Configura infraestrutura, Docker, Kubernetes, e pipelines CI/CD.

### UI/UX Design (`uiux-design`)
Cria wireframes, mockups, e design system.

### Frontend Development (`frontend-dev`)
Implementa componentes frontend e otimiza performance.

### Backend Development (`backend-dev`)
Implementa APIs backend e lógica de negócio.

### Security Audit (`security-audit`)
Realiza análise de segurança e identifica vulnerabilidades.

### QA Testing (`qa-testing`)
Cria estratégia de testes, casos de teste, e valida qualidade.

## Documentação Adicional

- Cada skill possui referências em `references/` com templates e guias
- Cada subagent documenta seu processo de trabalho e artefatos gerados
- Os commands explicam seu uso e funcionalidades

## Contribuindo

Para adicionar novos agentes, skills ou commands:

1. Crie o subagent em `.cursor/agents/`
2. Crie a skill correspondente em `.cursor/skills/`
3. Atualize o contexto compartilhado se necessário
4. Documente no README

## Licença

Este projeto é um template para uso com Cursor IDE.

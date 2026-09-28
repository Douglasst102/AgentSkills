# Cadeia de Desenvolvimento com Agentes no Cursor

Sistema completo de desenvolvimento de software usando agentes especializados no Cursor IDE, implementando uma cadeia automatizada desde a análise de negócios até a entrega do software.

## Visão Geral

Este projeto implementa uma cadeia de desenvolvimento de software completa utilizando:

- **Subagents** - 14 agentes especializados em diferentes etapas do desenvolvimento
- **Skills** - Capacidades específicas de cada agente
- **MCP** - Integrações externas opcionais

## Estrutura do Projeto

```
AgentSkills/
├── .cursor/
│   ├── agents/              # Subagents especializados
│   ├── skills/            # Skills por domínio
│   ├── project-context.json  # Contexto compartilhado
│   └── mcp.json          # Configuração MCP (opcional)
├── business/              # Análise de negócios
├── processes/             # Mapeamento de processos (BPMN)
├── requirements/          # Requisitos, SRS, User Stories
├── architecture/          # SAD, C4, ADRs
├── technical/             # Especificação técnica, OpenAPI
├── infrastructure/        # Docker, Kubernetes, CI/CD
├── design/                # Wireframes, mockups, design system
├── data/                  # Documentação de dados, modelos, DDL/migrações (Data Engineer)
├── frontend/              # Código e documentação frontend
├── backend/               # Código e documentação backend
├── security/              # Relatórios e análise de segurança
├── testing/               # Estratégia de testes, casos, automação
├── others_artifacts/      # Demais artefatos do projeto
├── README.md      
└── TODOs.md
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

### 7. Data Engineer
- **Arquivo:** `.cursor/agents/data-engineer.md`
- **Skill:** `data-engineering`
- **Responsabilidade:** Modelagem conceitual/lógica, documentação de dados, DDL/migrações e glossário ancorados em requisitos, arquitetura e stack

### 8. UI/UX Designer
- **Arquivo:** `.cursor/agents/uiux-designer.md`
- **Skill:** `uiux-design` (integra `interface-design`)
- **Responsabilidade:** Wireframes, mockups, design system
- **Comandos:** `/interface-design:init`, `/interface-design:status`, `/interface-design:audit`, `/interface-design:extract`

### 9. Frontend Developer
- **Arquivo:** `.cursor/agents/frontend-developer.md`
- **Skill:** `frontend-dev`
- **Responsabilidade:** Implementação frontend, componentes, performance

### 10. Backend Developer
- **Arquivo:** `.cursor/agents/backend-developer.md`
- **Skill:** `backend-dev`
- **Responsabilidade:** Implementação backend, APIs, lógica de negócio

### 11. Code Reviewer
- **Arquivo:** `.cursor/agents/code-reviewer.md`
- **Skill:** `code-review`
- **Responsabilidade:** Revisão de código sob três lentes (regressão/impacto, segurança, clean code), relatórios consolidados em `revision/<RUN_ID>/`

### 12. Security Engineer
- **Arquivo:** `.cursor/agents/security-engineer.md`
- **Skill:** `security-audit`
- **Responsabilidade:** Análise de segurança, vulnerabilidades, relatórios

### 13. Codebase Documenter
- **Arquivo:** `.cursor/agents/codebase-documenter.md`
- **Skill:** `codebase-documenter`
- **Responsabilidade:** Documentação de código (DocStrings, comentários, documentação externa), criação de README, API docs e guias de arquitetura

### 14. QA Engineer
- **Arquivo:** `.cursor/agents/qa-engineer.md`
- **Skill:** `qa-testing`
- **Responsabilidade:** Estratégia de testes, casos de teste, validação

## Fluxo de Execução

1. **Business Analyst** - Análise de negócios
2. **Process Analyst** - Mapeamento de processos
3. **Requirements Engineer** - Especificação de requisitos e criação de User Stories "Ready for Dev"
4. **Software Architect** - Design de arquitetura
5. **Technical Analyst** - Especificações técnicas
6. **DevOps Engineer** - Infraestrutura (paralelo com Technical)
7. **Data Engineer** - Modelagem e documentação de dados, DDL/migrações em `data/` (após infraestrutura e especificação técnica quando aplicável)
8. **UI/UX Designer** - Design (paralelo com Architecture quando fizer sentido)
9. **Frontend Developer** - Implementação frontend
10. **Backend Developer** - Implementação backend (paralelo com Frontend; pode consumir artefatos em `data/`)
11. **Code Reviewer** - Revisão de código (regressão, segurança, clean code; saídas em `revision/<RUN_ID>/`)
12. **Security Engineer** - Revisão de segurança
13. **Codebase Documenter** - Documentação de código (após Frontend, Backend, DevOps, UI/UX e Security)
14. **QA Engineer** - Testes e validação final

## Contexto Compartilhado

O arquivo `.cursor/project-context.json` mantém o estado compartilhado entre todos os agentes, incluindo:
- Status de cada etapa
- Artefatos gerados
- Metadados do projeto
- Dependências entre etapas

## Artefatos Gerados

Cada agente gera artefatos na raiz do repositório, em pastas nomeadas por etapa:

- **business/** - Visão do produto, stakeholders, requisitos de negócio
- **processes/** - Mapeamento de processos, diagramas BPMN
- **requirements/** - SRS, matriz de rastreabilidade, backlog, User Stories "Ready for Dev"
- **architecture/** - SAD, diagramas C4, ADRs
- **technical/** - Especificações técnicas, contratos OpenAPI
- **infrastructure/** - Dockerfiles, manifests K8s, pipelines CI/CD
- **design/** - Wireframes, mockups, design system
- **data/** - Modelos de dados, ERD, dicionário de dados, scripts/migrações (Data Engineer)
- **revision/** - Relatórios de revisão de código por execução (`revision/<RUN_ID>/`, Code Reviewer)
- **frontend/** - Código frontend, componentes; documentação pode ficar em subpastas (por exemplo `documentation/`)
- **backend/** - Código backend, APIs; documentação pode ficar em subpastas (por exemplo `documentation/`)
- **security/** - Relatórios de segurança, vulnerabilidades
- **testing/** - Estratégia de testes, casos de teste, relatórios
- **others_artifacts/** - Artefatos que não se encaixam nas pastas acima

## Integração MCP

O arquivo `.cursor/mcp.json` permite configurar integrações externas opcionais:

- **Notion** - Para documentação
- **Jira** - Para gerenciamento de projetos

Configure as credenciais necessárias no arquivo.

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

### Data Engineering (`data-engineering`)
Projeta modelos de dados, documentação de esquemas, DDL/migrações e glossário alinhados a requisitos, arquitetura e stack.

### UI/UX Design (`uiux-design`)
Cria wireframes, mockups, e design system.

### Frontend Development (`frontend-dev`)
Implementa componentes frontend e otimiza performance.

### Backend Development (`backend-dev`)
Implementa APIs backend e lógica de negócio.

### Code Review (`code-review`)
Revisa código ou mudanças sob três lentes — regressão/impacto, segurança (AppSec) e clean code — com relatório consolidado em `revision/<RUN_ID>/`.

### Security Audit (`security-audit`)
Realiza análise de segurança e identifica vulnerabilidades.

### Codebase Documentation (`codebase-documenter`)
Cria documentação inline (DocStrings, comentários) e externa (README, API docs, guias de arquitetura) para código gerado.

### QA Testing (`qa-testing`)
Cria estratégia de testes, casos de teste, e valida qualidade.

## Documentação Adicional

- Cada skill possui referências em `references/` com templates e guias
- Cada subagent documenta seu processo de trabalho e artefatos gerados

## Contribuindo

Para adicionar novos agentes ou skills ou commands:

1. Crie o subagent em `.cursor/agents/`
2. Crie a skill correspondente em `.cursor/skills/`
3. Atualize o contexto compartilhado se necessário
4. Documente no README

## Licença

Este projeto é um template para uso com Cursor IDE.

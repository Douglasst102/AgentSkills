---
name: Integração de Conteúdo DevOps
overview: Integrar o conteúdo detalhado dos arquivos `devops.md` e `devops-boas-praticas.md` na estrutura de agents e skills, enriquecendo a skill `devops-infra` com instruções detalhadas e criando referências específicas para Docker Compose e boas práticas.
todos:
  - id: enrich-skill
    content: Enriquecer SKILL.md com instruções detalhadas de Dockerfiles, Docker Compose, .dockerignore e .env.example baseadas em devops.md
    status: completed
  - id: create-docker-compose-guide
    content: Criar referência docker-compose-guide.md transformando o prompt detalhado de devops.md em guia estruturado com templates e checklists
    status: completed
  - id: create-best-practices
    content: Criar referência docker-best-practices.md integrando e expandindo o conteúdo de devops-boas-praticas.md
    status: completed
  - id: update-docker-guide
    content: Atualizar docker-guide.md adicionando exemplos avançados de multi-stage builds e .dockerignore
    status: completed
  - id: update-agent
    content: Atualizar devops-engineer.md adicionando referências às novas referências e expandindo processo de trabalho
    status: completed
    dependencies:
      - enrich-skill
      - create-docker-compose-guide
      - create-best-practices
---

# Integração de Conteúdo DevOps em Agents e Skills

## Análise do Conteúdo Disponível

### Arquivos Fornecidos:

1. **`artefatos/Devops/devops.md`** - Prompt detalhado e específico para geração de:

   - Dockerfiles multi-stage (API e Web)
   - docker-compose.dev.yml e docker-compose.prod.yml
   - .dockerignore otimizados
   - .env.example
   - Instruções de uso e validação
   - Exemplos usando Node.js/TypeScript/React/Neo4j/Elasticsearch (adaptável à stack do projeto)

2. **`artefatos/Devops/devops-boas-praticas.md`** - Lista de boas práticas:

   - Volumes para persistência
   - Containers ephemerals
   - Princípio 6 do 12-factor app (stateless)
   - .dockerignore
   - Multi-staging
   - Desacoplamento de aplicações
   - Minimização de camadas
   - Cache do Docker

### Estrutura Atual:

- **`.cursor/agents/devops-engineer.md`** - Agente básico com responsabilidades genéricas
- **`.cursor/skills/devops-infra/SKILL.md`** - Instruções genéricas e básicas
- **`.cursor/skills/devops-infra/references/docker-guide.md`** - Exemplos básicos de Dockerfile e docker-compose simples
- **`.cursor/skills/devops-infra/references/kubernetes-guide.md`** - Guia básico de Kubernetes

## Plano de Integração

### 1. Enriquecer a Skill `devops-infra/SKILL.md`

**Localização:** `.cursor/skills/devops-infra/SKILL.md`

**Mudanças:**

- Expandir a seção de **Dockerfiles** com instruções detalhadas baseadas em `devops.md`:
  - Multi-stage builds obrigatórios
  - Cache de dependências (cópia seletiva de lockfile e package.json)
  - Usuário não-root
  - Healthchecks
  - Separação entre API e frontend (exemplos adaptáveis à stack do projeto)

- Expandir a seção de **Docker Compose** com instruções específicas:
  - Separação entre dev e prod (docker-compose.dev.yml e docker-compose.prod.yml)
  - Bind mounts para hot reload em dev
  - Configuração de volumes persistentes
  - Networks e depends_on
  - Variáveis de ambiente via .env
  - Estratégias de espera/healthchecks

- Adicionar seção sobre **.dockerignore**:
  - Importância e boas práticas
  - Exemplos de padrões a ignorar

- Adicionar seção sobre **.env.example**:
  - Template de variáveis de ambiente
  - Segredos e configurações sensíveis

### 2. Criar Referência de Docker Compose Detalhada

**Localização:** `.cursor/skills/devops-infra/references/docker-compose-guide.md`

**Conteúdo:**

- Transformar o prompt detalhado de `devops.md` em um guia estruturado
- **Importante:** O guia será genérico e adaptável à stack do projeto. Tecnologias mencionadas no arquivo original (Node.js, React, Neo4j, Elasticsearch, etc.) são apenas exemplos ilustrativos
- Checklist de informações necessárias antes de gerar docker-compose (identificar stack do projeto, portas, dependências, etc.)
- Templates e exemplos adaptáveis à stack do projeto:
  - docker-compose.dev.yml (com bind mounts, hot reload)
  - docker-compose.prod.yml (com builds multi-stage, servidor web para frontend)
  - Configuração de bancos de dados (portas, autenticação, volumes) - exemplos com Neo4j, Elasticsearch, PostgreSQL, etc.
  - Configuração de serviços de busca/indexação (segurança, heap, volumes) - exemplos com Elasticsearch, Solr, etc.
- Instruções de validação e checklist pós-deploy

### 3. Criar Referência de Boas Práticas

**Localização:** `.cursor/skills/devops-infra/references/docker-best-practices.md`

**Conteúdo:**

- Integrar conteúdo de `devops-boas-praticas.md`
- Expandir cada prática com explicações e exemplos:
  - Volumes para persistência de dados
  - Containers ephemerals
  - Princípio 6 do 12-factor app (stateless)
  - .dockerignore para segurança e tamanho
  - Multi-staging para otimização
  - Desacoplamento de aplicações
  - Minimização de camadas
  - Uso de cache do Docker

### 4. Atualizar Referência Docker Existente

**Localização:** `.cursor/skills/devops-infra/references/docker-guide.md`

**Mudanças:**

- Manter exemplos básicos existentes
- Adicionar exemplos avançados baseados em `devops.md` (adaptáveis à stack do projeto):
  - Dockerfile multi-stage completo para API (exemplos com Node.js/TypeScript, Python, Java, etc.)
  - Dockerfile multi-stage para frontend (exemplos com React/Vue/Angular servido por Nginx/Apache, etc.)
  - Exemplos de .dockerignore genéricos e específicos por linguagem
  - Exemplos de healthchecks mais robustos

### 5. Atualizar o Agente DevOps Engineer

**Localização:** `.cursor/agents/devops-engineer.md`

**Mudanças:**

- Adicionar referência explícita às novas referências criadas
- Expandir a seção de "Processo de Trabalho" para mencionar:
  - Checklist de informações necessárias (baseado em `devops.md`)
  - Separação entre ambientes dev e prod
  - Validação com `docker compose config`
  - Criação de .env.example

### 6. Estrutura de Arquivos Resultante

```
.cursor/
├── agents/
│   └── devops-engineer.md (atualizado)
└── skills/
    └── devops-infra/
        ├── SKILL.md (enriquecido)
        └── references/
            ├── docker-guide.md (atualizado)
            ├── docker-compose-guide.md (novo)
            ├── docker-best-practices.md (novo)
            └── kubernetes-guide.md (mantido)
```

## Decisões de Design

1. **Manter compatibilidade:** Os exemplos básicos existentes serão mantidos, com adição de exemplos avançados
2. **Estrutura modular:** Separar o conteúdo em múltiplas referências para facilitar consulta
3. **Transformar prompt em guia:** O formato de prompt de `devops.md` será transformado em instruções estruturadas e checklists
4. **Foco na stack do projeto:** 

   - Todas as referências a tecnologias específicas (Node.js, React, Neo4j, Elasticsearch, Nginx, etc.) serão tratadas como **exemplos ilustrativos**
   - O guia será estruturado de forma **genérica e adaptável** à stack real do projeto
   - Instruções incluirão como identificar a stack do projeto e adaptar os exemplos conforme necessário
   - Checklists e templates serão parametrizáveis por stack tecnológica
   - Exemplos múltiplos serão fornecidos quando relevante (ex: diferentes linguagens de backend, diferentes frameworks frontend, diferentes bancos de dados)

## Benefícios

- Skill `devops-infra` muito mais completa e detalhada
- Referências específicas para consulta rápida
- Boas práticas documentadas e acessíveis
- Processo estruturado com checklist de validação
- Compatibilidade mantida com estrutura existente
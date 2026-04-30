---
name: devops-infra
description: Define infraestrutura como código, cria Dockerfiles, manifests Kubernetes, e pipelines CI/CD. Use quando precisar configurar infraestrutura, containers, ou pipelines de deploy.
---

# DevOps Infrastructure

Skill para configuração completa de infraestrutura, containers e CI/CD.

## Quando Usar

- Configuração de infraestrutura
- Criação de containers Docker
- Configuração de Kubernetes
- Criação de pipelines CI/CD
- Configuração de ambientes

## Instruções

### 1. Dockerfiles

**Importante:** Adapte os exemplos abaixo à stack tecnológica real do projeto. As tecnologias mencionadas são apenas exemplos ilustrativos.

Para cada serviço/componente da aplicação:

- **Multi-stage builds obrigatórios:**
  - Stage 1 (deps): Instalar dependências e ferramentas de build
  - Stage 2 (builder): Compilar/buildar a aplicação
  - Stage 3 (runner): Imagem final enxuta apenas com runtime e artefatos compilados
  
- **Otimização de cache de dependências:**
  - Copie primeiro apenas arquivos de dependências (ex: `package.json`, `package-lock.json`, `requirements.txt`, `Pipfile.lock`, `pom.xml`, `go.mod`, etc.)
  - Execute instalação de dependências antes de copiar o código fonte
  - Isso permite reutilizar a camada de cache quando apenas o código muda

- **Segurança:**
  - Use usuário não-root no stage final (ex: `USER node`, `USER app`, etc.)
  - Instale apenas dependências de produção no stage final
  - Remova ferramentas de build e compiladores do stage final

- **Healthchecks:**
  - Inclua HEALTHCHECK apropriado para o tipo de serviço
  - Use comandos nativos quando possível (ex: `curl`, `wget`, `nc`)
  - Se ferramentas não estiverem disponíveis, considere usar scripts "wait-for" customizados

- **Separação de componentes:**
  - Crie Dockerfile separado para API/backend e frontend
  - Frontend: use multi-stage build (build com Node/Python/etc. → servidor web estático como Nginx/Apache)
  - Backend: use multi-stage build (deps → builder → runner com runtime mínimo)

**Consulte `references/docker-guide.md` para exemplos detalhados.**

### 2. Docker Compose

**Separação de ambientes:**
- Crie `docker-compose.dev.yml` para desenvolvimento
- Crie `docker-compose.prod.yml` para produção
- Use profiles ou arquivos separados conforme necessário

**Ambiente de Desenvolvimento (docker-compose.dev.yml):**
- **Bind mounts para hot reload:**
  - Monte o código fonte diretamente nos containers
  - Para evitar conflitos com `node_modules` locais, use volumes anônimos para excluir diretórios de dependências
  - Configure comandos de dev (ex: `nodemon`, `ts-node-dev`, `npm run dev`, `python manage.py runserver`, etc.)

- **Rede interna:**
  - Defina network "backend" para comunicação entre serviços
  - Use nomes de serviço como hostnames (ex: `api`, `db`, `cache`, etc.)

- **Variáveis de ambiente:**
  - Use arquivo `.env` local para credenciais, URLs internas, chaves de API e qualquer configuração sensível — **proibido** hardcodar usuários, senhas, endpoints privados ou segredos no código-fonte
  - Garanta que `.env`, `.env.local` e variantes estejam listados no **`.gitignore`** do repositório (e não versionados)
  - Defina variáveis via `environment` ou `env_file`
  - Nunca commite senhas ou secrets reais; em CI/CD use secrets do provedor (GitHub Actions, Vault, etc.), nunca valores literais no YAML pipeline

- **Volumes persistentes:**
  - Configure volumes nomeados para dados persistentes (bancos de dados, cache, etc.)
  - Use bind mounts apenas para código fonte em dev

- **Dependências:**
  - Use `depends_on` para definir ordem de inicialização
  - Considere healthchecks ou scripts "wait-for" para garantir que dependências estejam prontas

**Ambiente de Produção (docker-compose.prod.yml):**
- **Builds multi-stage:**
  - Use imagens compiladas do Dockerfile, não bind mounts
  - Imagens devem ser enxutas e otimizadas

- **Frontend servido por servidor web:**
  - Use Nginx, Apache ou servidor web estático apropriado
  - Configure para SPA (Single Page Application) com fallback para `index.html`
  - Habilite gzip e otimizações de performance

- **Segurança:**
  - Não exponha portas desnecessárias
  - Use usuários não-root nos containers
  - Configure autenticação e segurança apropriadas para bancos de dados e serviços

- **Restart policies:**
  - Configure `restart: unless-stopped` ou `restart: always` para serviços críticos

- **Recursos (opcional):**
  - Defina limites de CPU e memória quando necessário
  - Configure healthchecks robustos

**Consulte `references/docker-compose-guide.md` para templates e checklists detalhados.**

### 3. .dockerignore

**Importância:**
- Reduz tamanho da imagem e tempo de build
- Melhora segurança evitando copiar arquivos sensíveis
- Evita conflitos com arquivos locais

**Boas práticas:**
- Ignore diretórios de dependências (ex: `node_modules/`, `venv/`, `__pycache__/`, `target/`, etc.)
- Ignore arquivos de desenvolvimento (ex: `.git/`, `.vscode/`, `.idea/`, etc.)
- Ignore arquivos de build locais (ex: `dist/`, `build/`, `.next/`, etc.)
- Ignore arquivos de configuração local (ex: `.env`, `.env.local`, etc.)
- Ignore documentação e arquivos desnecessários (ex: `README.md`, `*.md`, `docs/`, etc.)
- Ignore arquivos de teste e cobertura (ex: `tests/`, `*.test.*`, `coverage/`, etc.)

**Consulte `references/docker-best-practices.md` para mais detalhes.**

### 4. Política de segredos e `.gitignore`

- Todo valor sensível vem de ambiente ou secret store — não de constantes no código
- O repositório deve incluir `.gitignore` explícito para `.env*` (exceto `.env.example`), arquivos de credencial e caches locais
- Revise pipelines e manifests para não embutir tokens; use referências a secrets nomeados

### 5. .env.example

**Template de variáveis de ambiente:**
- Crie arquivo `.env.example` com todas as variáveis necessárias
- Documente cada variável com comentários explicativos
- **Nunca** inclua valores reais de senhas ou secrets
- Use valores placeholder ou descrições do formato esperado
- Organize por categorias (API, Database, Cache, External Services, etc.)

**Exemplo de estrutura:**
```
# API Configuration
API_PORT=4000
API_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=your_username_here
DB_PASSWORD=your_password_here

# External Services
EXTERNAL_API_KEY=your_api_key_here
```

### 6. Kubernetes Manifests
   - Crie Deployment para cada serviço
   - Configure Services (ClusterIP, LoadBalancer)
   - Configure ConfigMaps e Secrets
   - Defina Ingress para exposição externa
   - Configure Resource Limits e Requests

### 7. Pipelines CI/CD

   - Configure pipeline de build
   - Configure testes automatizados
   - Configure deploy para staging
   - Configure deploy para produção
   - Inclua rollback automático

### 8. Infraestrutura como Código

   - Use Terraform ou CloudFormation
   - Defina recursos de cloud (se aplicável)
   - Configure networking e segurança
   - Documente variáveis e outputs

### 9. Configuração de Ambientes

   - Defina variáveis por ambiente
   - Configure secrets management
   - Documente diferenças entre ambientes

## Outputs

Salve os seguintes arquivos em `infrastructure/`:
- `dockerfiles/` - Dockerfiles
- `docker-compose.yml` - Docker Compose
- `kubernetes/` - Manifests K8s
- `ci-cd/` - Pipelines CI/CD
- `infrastructure/` - IaC (Terraform/CloudFormation)
- `environments/` - Configurações de ambientes

## Validação

Antes de concluir, valide:

- [ ] Dockerfiles criados para todos os serviços com multi-stage builds
- [ ] docker-compose.dev.yml configurado com bind mounts e hot reload
- [ ] docker-compose.prod.yml configurado com builds otimizados
- [ ] .dockerignore criado para cada componente
- [ ] `.gitignore` ignora `.env` e arquivos sensíveis; nenhum secret no código ou pipeline
- [ ] .env.example criado com todas as variáveis necessárias
- [ ] Volumes persistentes configurados para dados
- [ ] Healthchecks configurados quando apropriado
- [ ] Validação com `docker compose config` passou sem erros
- [ ] Documentação de uso (dev e prod) criada

## Referências

Consulte as seguintes referências para templates e guias detalhados:

- `references/docker-guide.md` - Guia completo de Dockerfiles com exemplos
- `references/docker-compose-guide.md` - Guia detalhado de Docker Compose com templates e checklists
- `references/docker-best-practices.md` - Boas práticas de Docker e containerização
- `references/kubernetes-guide.md` - Guia de Kubernetes

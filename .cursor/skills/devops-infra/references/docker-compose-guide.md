# Guia Docker Compose

Este guia fornece instruções detalhadas para criar configurações Docker Compose para desenvolvimento e produção, adaptáveis à stack tecnológica do projeto.

**Importante:** Todas as tecnologias mencionadas (Node.js, React, Neo4j, Elasticsearch, Nginx, etc.) são apenas **exemplos ilustrativos**. Adapte os exemplos à stack real do seu projeto.

## Checklist de Informações Necessárias

Antes de criar os arquivos docker-compose, colete as seguintes informações:

### Estrutura do Projeto
- [ ] Monorepo ou múltiplos repositórios?
- [ ] Raiz do projeto e caminhos exatos dos componentes (ex: `./api`, `./web`, `./backend`, `./frontend`)
- [ ] Estrutura de diretórios completa

### Stack Tecnológica
- [ ] Linguagem/framework do backend (Node.js, Python, Java, Go, etc.)
- [ ] Framework do frontend (React, Vue, Angular, etc.)
- [ ] Versões específicas (ex: Node.js 18, 20; Python 3.9, 3.11; etc.)
- [ ] Package manager utilizado (npm, yarn, pnpm, pip, poetry, maven, etc.)

### Comandos de Build e Start
- [ ] **Backend/API:**
  - Comando de build (ex: `npm run build`, `mvn package`, `go build`)
  - Comando de start em produção (ex: `node dist/main.js`, `java -jar app.jar`)
  - Comando de dev (ex: `npm run dev`, `python manage.py runserver`)
  - Diretório de saída do build (ex: `dist/`, `target/`, `build/`)

- [ ] **Frontend:**
  - Comando de build (ex: `npm run build`, `yarn build`)
  - Comando de dev (ex: `npm start`, `npm run dev`)
  - Diretório de saída do build (ex: `build/`, `dist/`, `.next/`)

### Portas e Serviços
- [ ] Porta da API (ex: 4000, 8000, 3000)
- [ ] Porta do frontend em dev (ex: 3000, 5173)
- [ ] Porta do servidor web em produção (ex: 80, 443)
- [ ] Portas de bancos de dados e serviços externos

### Bancos de Dados e Serviços
- [ ] Tipo de banco de dados (PostgreSQL, MySQL, MongoDB, Neo4j, etc.)
- [ ] Configurações de autenticação
- [ ] Plugins ou extensões necessárias
- [ ] Serviços de busca/indexação (Elasticsearch, Solr, etc.)
- [ ] Outros serviços (Redis, RabbitMQ, etc.)

### Variáveis de Ambiente
- [ ] Lista completa de variáveis de ambiente necessárias
- [ ] Variáveis sensíveis que devem estar em `.env`
- [ ] Valores padrão para desenvolvimento

### Recursos e Limites
- [ ] Requisitos de CPU/RAM por serviço (opcional)
- [ ] Limites desejados para produção

### Estratégias de Saúde
- [ ] Healthchecks disponíveis nos serviços
- [ ] Necessidade de scripts "wait-for" customizados

## Estrutura de Arquivos

```
projeto/
├── docker-compose.dev.yml      # Desenvolvimento
├── docker-compose.prod.yml     # Produção
├── .env.example                 # Template de variáveis
├── api/
│   ├── Dockerfile
│   └── .dockerignore
└── web/                         # ou frontend/
    ├── Dockerfile
    └── .dockerignore
```

## Docker Compose para Desenvolvimento

### Características Principais

- **Bind mounts** para hot reload
- **Comandos de dev** (nodemon, ts-node-dev, etc.)
- **Rede interna** para comunicação entre serviços
- **Volumes persistentes** para dados
- **Variáveis de ambiente** via `.env`

### Template Base

```yaml
version: '3.9'

services:
  # Backend/API
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: api-dev
    command: npm run dev  # Adapte ao comando de dev do seu projeto
    ports:
      - "${API_PORT:-4000}:4000"
    volumes:
      - ./api:/app
      - /app/node_modules  # Volume anônimo para evitar conflito
    environment:
      - NODE_ENV=development
      - DB_HOST=db
      - DB_PORT=5432
    env_file:
      - .env
    depends_on:
      - db
    networks:
      - backend
    restart: unless-stopped

  # Frontend
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: web-dev
    command: npm start  # Adapte ao comando de dev do seu projeto
    ports:
      - "${WEB_PORT:-3000}:3000"
    volumes:
      - ./web:/app
      - /app/node_modules  # Volume anônimo
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    env_file:
      - .env
    depends_on:
      - api
    networks:
      - backend
    restart: unless-stopped

  # Banco de Dados (exemplo com PostgreSQL)
  db:
    image: postgres:15-alpine
    container_name: db-dev
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Cache (exemplo com Redis)
  cache:
    image: redis:7-alpine
    container_name: cache-dev
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - cache_data:/data
    networks:
      - backend
    restart: unless-stopped

volumes:
  db_data:
  cache_data:

networks:
  backend:
    driver: bridge
```

### Adaptações por Stack

#### Backend Python (Django/FastAPI)
```yaml
api:
  build:
    context: ./api
    dockerfile: Dockerfile
  command: python manage.py runserver 0.0.0.0:8000
  volumes:
    - ./api:/app
    - /app/venv  # Para Python virtualenv
```

#### Backend Java (Spring Boot)
```yaml
api:
  build:
    context: ./api
    dockerfile: Dockerfile
  command: mvn spring-boot:run
  volumes:
    - ./api:/app
    - /app/target
```

#### Frontend Vue/Angular
```yaml
web:
  command: npm run serve  # Vue
  # ou
  command: ng serve  # Angular
```

## Docker Compose para Produção

### Características Principais

- **Builds multi-stage** produzindo imagens enxutas
- **Sem bind mounts** (apenas imagens compiladas)
- **Servidor web** para frontend (Nginx, Apache, etc.)
- **Usuário não-root** nos containers
- **Healthchecks** robustos
- **Restart policies** configuradas
- **Segurança** habilitada (autenticação, TLS, etc.)

### Template Base

```yaml
version: '3.9'

services:
  # Backend/API
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: production
    container_name: api-prod
    command: node dist/main.js  # Adapte ao comando de start
    ports:
      - "${API_PORT:-4000}:4000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    env_file:
      - .env.production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend servido por Nginx
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
      target: production
    container_name: web-prod
    ports:
      - "${WEB_PORT:-80}:80"
    depends_on:
      - api
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Banco de Dados
  db:
    image: postgres:15-alpine
    container_name: db-prod
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    # Em produção, considere não expor portas externamente
    # ports:
    #   - "5432:5432"

volumes:
  db_data:

networks:
  backend:
    driver: bridge
```

### Configuração de Nginx para SPA

Crie um arquivo `web/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Configuração de Bancos de Dados

### PostgreSQL
```yaml
db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: ${DB_NAME}
    POSTGRES_USER: ${DB_USER}
    POSTGRES_PASSWORD: ${DB_PASSWORD}
  volumes:
    - db_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
```

### MongoDB
```yaml
db:
  image: mongo:6
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    MONGO_INITDB_DATABASE: ${DB_NAME}
  volumes:
    - db_data:/data/db
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

### Neo4j (exemplo)
```yaml
neo4j:
  image: neo4j:5
  environment:
    NEO4J_AUTH: ${NEO4J_USER}/${NEO4J_PASSWORD}
    NEO4J_PLUGINS: '["apoc"]'
  ports:
    - "7474:7474"  # HTTP
    - "7687:7687"  # Bolt
  volumes:
    - neo4j_data:/data
    - neo4j_logs:/logs
    - neo4j_import:/var/lib/neo4j/import
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:7474"]
```

### Elasticsearch (exemplo)
```yaml
elasticsearch:
  image: elasticsearch:8.11.0
  environment:
    discovery.type: single-node
    ES_JAVA_OPTS: "-Xms1g -Xmx1g"
    # Em dev: desabilitar segurança
    xpack.security.enabled: "false"
    # Em prod: habilitar segurança
    # xpack.security.enabled: "true"
  ports:
    - "9200:9200"
  volumes:
    - es_data:/usr/share/elasticsearch/data
  ulimits:
    memlock:
      soft: -1
      hard: -1
  healthcheck:
    test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
```

**Nota:** Em produção, habilite `xpack.security.enabled: "true"` e configure usuários/senhas.

## Variáveis de Ambiente (.env.example)

Crie um arquivo `.env.example` com todas as variáveis necessárias:

```env
# API Configuration
API_PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=your_username_here
DB_PASSWORD=your_password_here

# Cache
REDIS_HOST=localhost
REDIS_PORT=6379

# External Services
EXTERNAL_API_KEY=your_api_key_here
EXTERNAL_API_URL=https://api.example.com

# Frontend
REACT_APP_API_URL=http://localhost:4000
```

## Validação

### Validar Configuração

```bash
# Validar sintaxe do docker-compose
docker compose -f docker-compose.dev.yml config
docker compose -f docker-compose.prod.yml config
```

### Checklist Pós-Deploy

Após subir os serviços, verifique:

- [ ] Todos os containers estão rodando (`docker compose ps`)
- [ ] Healthchecks estão passando
- [ ] Logs não mostram erros críticos
- [ ] API responde em `http://localhost:API_PORT/health`
- [ ] Frontend carrega corretamente
- [ ] Banco de dados está acessível
- [ ] Serviços se comunicam pela rede interna
- [ ] Volumes persistentes foram criados
- [ ] Variáveis de ambiente estão corretas

## Comandos Úteis

### Desenvolvimento

```bash
# Subir serviços
docker compose -f docker-compose.dev.yml up -d

# Ver logs
docker compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker compose -f docker-compose.dev.yml down

# Rebuild após mudanças no Dockerfile
docker compose -f docker-compose.dev.yml up -d --build
```

### Produção

```bash
# Build e subir
docker compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker compose -f docker-compose.prod.yml logs -f

# Parar
docker compose -f docker-compose.prod.yml down

# Limpar volumes (cuidado!)
docker compose -f docker-compose.prod.yml down -v
```

## Boas Práticas

1. **Nunca commite arquivos `.env`** com valores reais
2. **Use `.env.example`** como template
3. **Valide configuração** antes de fazer deploy
4. **Configure healthchecks** para todos os serviços
5. **Use restart policies** apropriadas
6. **Limite exposição de portas** em produção
7. **Configure volumes persistentes** para dados
8. **Documente decisões** e suposições

Consulte `docker-best-practices.md` para mais detalhes sobre boas práticas.

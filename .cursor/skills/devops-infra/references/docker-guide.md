# Guia Docker

Este guia fornece exemplos de Dockerfiles para diferentes stacks tecnológicas. **Importante:** As tecnologias mencionadas são exemplos ilustrativos - adapte à stack do seu projeto.

## Dockerfile Básico

### Node.js/TypeScript (Exemplo)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
```

## Multi-stage Builds Avançados

### Node.js/TypeScript - API Backend

```dockerfile
# Stage 1: Dependências de produção
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copiar dependências e artefatos
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package.json ./

# Usar usuário não-root
USER nodejs

EXPOSE 4000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main.js"]
```

### React/Vue/Angular - Frontend com Nginx

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copiar build
COPY --from=builder /app/build .

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Python (Django/FastAPI)

```dockerfile
# Stage 1: Dependências
FROM python:3.11-slim AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Build (se necessário)
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Se houver build steps (ex: coletar static files)
# RUN python manage.py collectstatic --noinput

# Stage 3: Runtime
FROM python:3.11-slim AS runner
WORKDIR /app

# Criar usuário não-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copiar dependências
COPY --from=deps --chown=appuser:appuser /root/.local /home/appuser/.local
COPY --from=builder --chown=appuser:appuser /app .

# Adicionar .local ao PATH
ENV PATH=/home/appuser/.local/bin:$PATH

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Java (Spring Boot)

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copiar JAR
COPY --from=builder --chown=appuser:appuser /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Go

```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

# Stage 2: Runtime
FROM alpine:latest AS runner
WORKDIR /root/

# Instalar apenas ca-certificates para HTTPS
RUN apk --no-cache add ca-certificates

# Copiar binário
COPY --from=builder /app/app .

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./app"]
```

## .dockerignore

### Exemplo Genérico

```
# Dependências
node_modules/
venv/
__pycache__/
target/
*.egg-info/
vendor/

# Arquivos de desenvolvimento
.git/
.gitignore
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Arquivos de build local
dist/
build/
.next/
out/
*.log

# Configuração local
.env
.env.local
.env.*.local

# Documentação
README.md
*.md
docs/

# Testes
tests/
*.test.*
coverage/
.nyc_output/
```

### Node.js Específico

```
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn
.pnp.*
.next/
out/
dist/
build/
```

### Python Específico

```
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
.venv
*.egg-info/
dist/
build/
```

### Java Específico

```
target/
*.class
*.jar
*.war
*.ear
.mvn/
.m2/
```

### Go Específico

```
vendor/
*.test
*.out
```

## Healthchecks Avançados

### HTTP Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### TCP Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD nc -z localhost 5432 || exit 1
```

### Script Customizado

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s \
  CMD /app/healthcheck.sh || exit 1
```

### Healthcheck com wget (Alpine)

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
```

## Docker Compose

### Exemplo Básico

```yaml
version: '3.9'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - db
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
```

**Consulte `docker-compose-guide.md` para exemplos detalhados de desenvolvimento e produção.**

## Referências Adicionais

- `docker-compose-guide.md` - Guia completo de Docker Compose
- `docker-best-practices.md` - Boas práticas detalhadas

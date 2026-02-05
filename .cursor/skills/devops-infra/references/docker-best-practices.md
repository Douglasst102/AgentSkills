# Boas Práticas Docker

Este guia documenta as boas práticas essenciais para criação e gerenciamento de containers Docker, baseadas em princípios de segurança, performance e manutenibilidade.

## 1. Volumes para Persistência de Dados

### Princípio
Crie volumes nomeados para qualquer local onde há persistência de dados. Containers são efêmeros e podem ser recriados, mas os dados devem persistir.

### Implementação

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15-alpine
    volumes:
      - db_data:/var/lib/postgresql/data  # Dados do banco
      - db_backups:/backups               # Backups

volumes:
  db_data:
  db_backups:
```

### Benefícios
- Dados persistem mesmo quando containers são removidos
- Facilita backup e restauração
- Permite atualização de imagens sem perda de dados

### Quando Usar
- Bancos de dados (PostgreSQL, MySQL, MongoDB, etc.)
- Sistemas de arquivos (MinIO, S3 local, etc.)
- Cache persistente (Redis com persistência, etc.)
- Logs que precisam ser mantidos

## 2. Containers Efêmeros (Ephemeral)

### Princípio
Mantenha os containers efêmeros, isto é, que você possa parar, reiniciar e ele continue funcionando sem maiores problemas. O estado não deve depender do container em si.

### Implementação

```dockerfile
# Dockerfile
# Não armazene dados dentro do container
# Use volumes para persistência
VOLUME ["/data"]

# Não dependa de arquivos temporários do container
# Use variáveis de ambiente ou volumes
```

```yaml
# docker-compose.yml
services:
  app:
    restart: unless-stopped
    # Container pode ser recriado sem problemas
    # Dados importantes estão em volumes
```

### Benefícios
- Facilita escalabilidade horizontal
- Permite atualizações sem downtime
- Reduz acoplamento entre container e dados

### Boas Práticas
- Não armazene dados críticos dentro do filesystem do container
- Use volumes para qualquer dado que precise persistir
- Configure restart policies apropriadas
- Use healthchecks para garantir que containers estão saudáveis

## 3. Princípio 6 do 12-Factor App: Stateless

### Princípio
O processo deve ser stateless (sem estado), e qualquer persistência precisa ser feita em uma aplicação que mantém o estado, mais comumente uma database.

### Implementação

```dockerfile
# Dockerfile
# Aplicação não mantém estado local
# Tudo é armazenado em serviços externos
ENV STATELESS=true
```

```yaml
# docker-compose.yml
services:
  api:
    # Não usa volumes para estado da aplicação
    # Estado é mantido em banco de dados ou cache
    environment:
      - DB_HOST=db
      - CACHE_HOST=cache
```

### Benefícios
- Facilita escalabilidade horizontal
- Permite balanceamento de carga sem sticky sessions
- Reduz complexidade de gerenciamento de estado

### O Que Evitar
- Armazenar sessões no filesystem do container
- Usar arquivos locais para cache crítico
- Depender de estado entre requisições no container

## 4. .dockerignore para Segurança e Tamanho

### Princípio
Não inclua arquivos desnecessários no seu Dockerfile. Use `.dockerignore` para evitar "lixo" no build context, resultando em:
- Redução do tamanho da imagem
- Melhor segurança (evita copiar secrets)
- Builds mais rápidos

### Implementação

Crie um arquivo `.dockerignore` na raiz do contexto de build:

```
# Dependências (serão instaladas no container)
node_modules/
venv/
__pycache__/
target/
*.egg-info/

# Arquivos de desenvolvimento
.git/
.gitignore
.vscode/
.idea/
*.swp
*.swo

# Arquivos de build local
dist/
build/
.next/
out/

# Arquivos de configuração local
.env
.env.local
.env.*.local

# Documentação
README.md
*.md
docs/

# Testes e cobertura
tests/
*.test.*
coverage/
.nyc_output/

# Logs
*.log
logs/

# Arquivos temporários
tmp/
temp/
*.tmp
```

### Benefícios
- Builds mais rápidos (menos arquivos para copiar)
- Imagens menores
- Maior segurança (secrets não são copiados)
- Menos conflitos com arquivos locais

### Exemplo por Linguagem

**Node.js:**
```
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn
```

**Python:**
```
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
```

**Java:**
```
target/
*.class
*.jar
*.war
.mvn/
```

## 5. Multi-Stage Builds

### Princípio
Use multi-stage builds para otimizar o tamanho da imagem final. Separe o ambiente de build do ambiente de execução.

### Implementação

```dockerfile
# Stage 1: Dependências
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runtime (imagem final enxuta)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]
```

### Benefícios
- Imagem final muito menor (apenas runtime e artefatos)
- Ferramentas de build não ficam na imagem final
- Melhor segurança (menos superfície de ataque)
- Builds mais eficientes (cache de dependências)

### Estrutura Típica
1. **Stage deps:** Instala apenas dependências de produção
2. **Stage builder:** Instala todas as deps e compila o código
3. **Stage runner:** Copia apenas artefatos compilados e deps de produção

## 6. Não Instale Pacotes Desnecessários

### Princípio
Minimize o número de pacotes e ferramentas instaladas na imagem final. Cada pacote adicional aumenta:
- Tamanho da imagem
- Superfície de ataque
- Tempo de build
- Complexidade de manutenção

### Implementação

```dockerfile
# ❌ Ruim
FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    curl wget vim git build-essential python3 nodejs

# ✅ Bom
FROM node:20-alpine
# Alpine já é mínimo, não precisa instalar nada extra
# Se precisar de ferramentas, instale apenas o necessário
RUN apk add --no-cache curl
```

### Boas Práticas
- Use imagens base mínimas (Alpine, distroless, etc.)
- Remova cache de package managers após instalação
- Use `--no-cache` quando apropriado
- Limpe arquivos temporários na mesma camada RUN

```dockerfile
# Exemplo: Limpar cache na mesma camada
RUN apt-get update && \
    apt-get install -y package-name && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

## 7. Desacoplamento de Aplicações

### Princípio
Desacople as aplicações. Nunca use um container para mais de um objetivo. Cada container deve ter uma responsabilidade única.

### Implementação

```yaml
# ❌ Ruim: Tudo em um container
services:
  app:
    image: wordpress
    # Wordpress e MySQL no mesmo container - NÃO FAÇA ISSO

# ✅ Bom: Containers separados
services:
  wordpress:
    image: wordpress:latest
    depends_on:
      - db
  
  db:
    image: mysql:8
    volumes:
      - db_data:/var/lib/mysql
```

### Benefícios
- Facilita escalabilidade independente
- Permite atualização de componentes separadamente
- Melhor isolamento de falhas
- Facilita manutenção e debugging

### Regra de Ouro
**Um processo, um container.** Se você precisa de múltiplos serviços, use múltiplos containers e orquestre com docker-compose ou Kubernetes.

## 8. Minimização de Camadas

### Princípio
Minimize o número de camadas no Dockerfile. Isso geralmente otimiza o tamanho da imagem e melhora o desempenho.

### Implementação

```dockerfile
# ❌ Ruim: Muitas camadas
RUN apt-get update
RUN apt-get install -y package1
RUN apt-get install -y package2
RUN apt-get clean

# ✅ Bom: Camadas consolidadas
RUN apt-get update && \
    apt-get install -y package1 package2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Benefícios
- Menos camadas = imagem menor
- Builds mais rápidos
- Melhor uso do cache

### Boas Práticas
- Combine comandos relacionados em uma única camada RUN
- Use `&&` para encadear comandos
- Limpe arquivos temporários na mesma camada
- Ordene comandos do menos frequente ao mais frequente (para melhor cache)

```dockerfile
# Ordem otimizada para cache
COPY package.json .          # Muda raramente
RUN npm install              # Cache se package.json não mudou
COPY . .                     # Muda frequentemente
RUN npm run build            # Executa apenas se código mudou
```

## 9. Uso de Cache do Docker

### Princípio
Use e abuse da camada de cache do Docker. Estruture seu Dockerfile para maximizar o reuso de camadas em cache.

### Implementação

```dockerfile
# ✅ Estrutura otimizada para cache
FROM node:20-alpine

# 1. Copiar apenas arquivos de dependências (mudam raramente)
COPY package.json package-lock.json ./

# 2. Instalar dependências (cache se package.json não mudou)
RUN npm ci --only=production

# 3. Copiar código fonte (muda frequentemente)
COPY . .

# 4. Build (executa apenas se código mudou)
RUN npm run build
```

### Estratégias de Cache

1. **Copiar arquivos de dependências primeiro:**
   - `package.json`, `requirements.txt`, `Pipfile.lock`, `go.mod`, etc.
   - Esses arquivos mudam menos frequentemente que o código

2. **Instalar dependências antes de copiar código:**
   - Dependências são instaladas apenas quando arquivos de deps mudam
   - Código pode mudar sem invalidar cache de dependências

3. **Ordenar comandos por frequência de mudança:**
   - Comandos que mudam raramente primeiro
   - Comandos que mudam frequentemente por último

### Verificar Cache

```bash
# Ver quais camadas estão usando cache
docker build --progress=plain .

# Build sem cache (para testar)
docker build --no-cache .
```

## Checklist de Boas Práticas

Antes de finalizar seus Dockerfiles e docker-compose, verifique:

- [ ] Volumes nomeados criados para dados persistentes
- [ ] Containers são efêmeros (podem ser recriados sem problemas)
- [ ] Aplicação é stateless (estado em banco de dados)
- [ ] `.dockerignore` criado e otimizado
- [ ] Multi-stage builds implementados
- [ ] Apenas pacotes necessários instalados
- [ ] Aplicações desacopladas (um processo por container)
- [ ] Camadas minimizadas e consolidadas
- [ ] Dockerfile otimizado para cache
- [ ] Usuário não-root configurado
- [ ] Healthchecks implementados
- [ ] Variáveis de ambiente via `.env` (nunca hardcoded)
- [ ] `.env.example` criado sem secrets

## Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [12-Factor App](https://12factor.net/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

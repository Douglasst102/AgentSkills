---
name: backend-dev
description: Desenvolve APIs REST/GraphQL, implementa lógica de negócio, e cria integrações. Use quando precisar implementar backend, criar APIs, ou implementar serviços.
---

# Backend Development

Skill para desenvolvimento completo de APIs e serviços backend.

## Quando Usar

- Implementação de APIs
- Criação de lógica de negócio
- Implementação de persistência
- Criação de integrações
- Implementação de autenticação

## Instruções

1. **Configuração do Projeto**
   - Configure framework escolhido (Express, FastAPI, Spring, etc.)
   - Configure estrutura de pastas
   - Configure linting e formatação
   - Configure testes

2. **Implementação de APIs**
   - Implemente endpoints conforme OpenAPI
   - Configure validação de entrada
   - Implemente tratamento de erros
   - Configure documentação (Swagger)

3. **Lógica de Negócio**
   - Implemente services/business logic
   - Siga padrões de design (Service Layer, Repository)
   - Implemente validações de negócio
   - Configure transações quando necessário

4. **Persistência de Dados**
   - Configure ORM/ODM (Sequelize, TypeORM, Mongoose, etc.)
   - Implemente modelos de dados
   - Configure migrações
   - Implemente queries otimizadas

5. **Autenticação e Autorização**
   - Implemente JWT ou OAuth
   - Configure middleware de autenticação
   - Implemente controle de acesso (RBAC)
   - Configure refresh tokens

6. **Integrações**
   - Implemente clientes HTTP para APIs externas
   - Configure retry e circuit breaker
   - Implemente tratamento de erros de integração

7. **Testes**
   - Crie testes unitários de services
   - Crie testes de integração de APIs
   - Configure mocks para dependências externas

## Outputs

Salve os seguintes arquivos em `outputs/artifacts/backend/`:
- `src/` - Código fonte
- `api/` - APIs
- `models/` - Modelos
- `services/` - Lógica de negócio
- `tests/` - Testes
- `package.json` - Dependências

## Referências

Consulte `references/backend-patterns.md` para padrões e melhores práticas.

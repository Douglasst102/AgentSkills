# Padrões Backend

## Estrutura de Projeto

```
src/
  ├── api/
  │   ├── routes/
  │   └── controllers/
  ├── services/
  ├── models/
  ├── middleware/
  └── utils/
```

## Padrões de Design

- **Service Layer** - Lógica de negócio isolada
- **Repository Pattern** - Abstração de acesso a dados
- **DTO (Data Transfer Object)** - Objetos de transferência
- **Factory Pattern** - Criação de objetos

## Autenticação

- JWT tokens
- Refresh tokens
- Password hashing (bcrypt)
- Rate limiting

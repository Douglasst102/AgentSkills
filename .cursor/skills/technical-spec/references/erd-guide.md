# Guia de Modelagem de Dados (ERD)

## Elementos Principais

### Entidades
- Representam objetos do domínio
- Exemplo: User, Product, Order

### Atributos
- Propriedades das entidades
- Tipos: String, Integer, Date, etc.

### Relacionamentos
- **1:1** - Um para um
- **1:N** - Um para muitos
- **N:N** - Muitos para muitos

### Constraints
- **PK** - Primary Key
- **FK** - Foreign Key
- **UNIQUE** - Valores únicos
- **NOT NULL** - Obrigatório

## Exemplo

```
User (PK: id)
  ├── name (string, NOT NULL)
  └── email (string, UNIQUE)

Order (PK: id)
  ├── user_id (FK → User.id)
  └── total (decimal)
```

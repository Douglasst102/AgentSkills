# Guia OpenAPI/Swagger

## Estrutura Básica

```yaml
openapi: 3.0.0
info:
  title: API Name
  version: 1.0.0
paths:
  /endpoint:
    get:
      summary: Description
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Model'
components:
  schemas:
    Model:
      type: object
      properties:
        field:
          type: string
```

## Elementos Essenciais

- **paths** - Endpoints da API
- **components/schemas** - Modelos de dados
- **components/securitySchemes** - Autenticação
- **tags** - Organização de endpoints

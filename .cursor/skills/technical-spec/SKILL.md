---
name: technical-spec
description: Cria especificações técnicas detalhadas, contratos de API OpenAPI/Swagger, e modelos de dados. Use quando precisar detalhar especificações técnicas, projetar APIs, ou criar modelos de dados.
---

# Technical Specification

Skill para criação de especificações técnicas detalhadas e contratos de API.

## Quando Usar

- Especificação técnica detalhada
- Projeto de contratos de API
- Criação de modelos de dados
- Especificação de integrações
- Casos de uso técnicos

## Práticas de plataforma (contratos e API pública)

- Produzir **OpenAPI** completo e mantê-lo como fonte da verdade para o backend expor **documentação pública** dos métodos (sem embutir secrets nos exemplos)
- Especificar **CORS** (origens permitidas, credenciais, headers) por ambiente
- Posicionar o backend como **BFF**: endpoints que servem o frontend, **proxy** para sistemas externos quando necessário, e camadas **Facade** para operações que combinam API externa + banco (uma chamada do cliente)
- Para cada operação: objetivo claro, assinatura coerente, e texto sobre **idempotência**, transações e consistência esperada (**ACID** onde couber); erros e códigos HTTP documentados

## Instruções

1. **Especificações Técnicas Detalhadas**
   - Detalhe cada componente identificado na arquitetura
   - Especifique tecnologias e frameworks
   - Documente padrões de código e convenções
   - Defina estruturas de dados internas

2. **Contratos de API (OpenAPI/Swagger)**
   - Crie especificação OpenAPI para cada API exposta ao frontend (e padronize publicação: URL do JSON/YAML e UI)
   - Documente todos os endpoints, inclusive **Facade/BFF** que agregam integrações externas
   - Especifique schemas de request/response
   - Inclua exemplos e validações (sem segredos reais)
   - Documente autenticação e autorização (**JWT** Bearer quando for o padrão), escopos e códigos de erro

3. **Modelos de Dados (ERD)**
   - Projete esquema de banco de dados
   - Inclua **modelagem para autenticação**: tabela dedicada de usuários (hash de senha), e estruturas para refresh tokens / sessão / revogação quando aplicável, com **políticas de expiração** descritas
   - Identifique entidades e relacionamentos
   - Defina constraints e índices
   - Documente normalização

4. **Casos de Uso Técnicos**
   - Especifique fluxos técnicos detalhados
   - Documente interações entre componentes
   - Inclua tratamento de erros
   - Especifique transações e consistência

5. **Especificações de Integração**
   - Documente integrações entre componentes (frontend → BFF → APIs externas / banco)
   - Especifique protocolos e formatos
   - Documente sincronização e assíncrono
   - Inclua tratamento de falhas
   - Documente requisitos de **CORS** e limites de taxa se aplicável

## Outputs

Salve os seguintes arquivos em `technical/`:
- `technical-specifications.md` - Especificações técnicas
- `api-contracts/` - Contratos OpenAPI/Swagger
- `data-models/` - Modelos de dados (ERD)
- `technical-use-cases.md` - Casos de uso técnicos
- `integration-specs.md` - Especificações de integração

## Referências

Consulte `references/openapi-guide.md` e `references/erd-guide.md` para templates.

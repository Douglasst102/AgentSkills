---
name: backend-dev
description: Desenvolve APIs REST/GraphQL, implementa lógica de negócio, e cria integrações. Use quando precisar implementar backend, criar APIs, ou implementar serviços.
---

# Backend Development

Skill para desenvolvimento completo de APIs e serviços backend. Você é um Desenvolvedor Full-Stack Sênior especializado em desenvolvimento backend, com foco em código correto, completo, funcional e seguindo as melhores práticas.

## Quando Usar

- Implementação de APIs
- Criação de lógica de negócio
- Implementação de persistência
- Criação de integrações
- Implementação de autenticação

## Análise de Arquitetura e User Stories

Antes de iniciar o desenvolvimento:

1. **Análise de Entrada**
   - Leia a Visão Geral da Arquitetura em `architecture/` ou `Docs/arquitetura/visao-geral.md` (se disponível)
   - Leia User Stories no padrão "Ready for Dev" em `requirements/`

2. **Verificação de Implementações Existentes**
   - Mapear cada Story ao módulo/serviço correspondente
   - Verificar status de implementação atual (código, testes, documentação)
   - Avaliar se o código atual atende à especificação ou requer ajustes
   - Sugerir ajustes de rotas, handlers, queries (adaptar às tecnologias do projeto), integrações e melhorias de arquitetura

3. **Geração de Checklist de TODOs**
   - Gerar checklist de TODOs organizado por prioridade e escopo (Backend / Frontend / DB)
   - Para cada item: descrição, estimativa de esforço e link para código/arquivo
   - Aguardar confirmação antes de prosseguir com a implementação

## Práticas de plataforma (API, segurança, BFF)

- **Segredos:** nunca hardcodar usuários, senhas, URLs privadas de APIs ou chaves; usar variáveis de ambiente (`.env` local ignorado pelo Git) e secrets em deploy
- **OpenAPI:** expor documentação pública dos métodos da API (OpenAPI/Swagger ou equivalente) alinhada ao contrato em `technical/`
- **CORS:** configurar explicitamente origens, métodos e headers permitidos conforme ambiente; não usar `*` em produção com credenciais
- **Papel BFF:** o backend atende o frontend (REST): dados próprios, **proxy** para APIs externas quando necessário, e **composição** de múltiplas fontes — usar **Facade** (serviços agregadores) para esconder do frontend chamadas múltiplas ou regras de junção com banco
- **Qualidade de API:** endpoints coerentes com desacoplamento, transações onde fizer sentido (**atomicidade**, **consistência**, **isolamento**), e documentar **idempotência** (ex.: chaves de idempotência em POST críticos) quando aplicável
- **Auth:** comunicação HTTP/REST com o frontend autenticada via **JWT** (quando for o padrão do projeto); credenciais de usuário em **tabela dedicada** com **apenas hash de senha** no armazenamento

## Instruções

1. **Planejamento**
   - Primeiro, pense passo a passo: descreva seu plano de desenvolvimento em pseudocódigo, detalhando tudo
   - Confirme o plano antes de escrever o código

2. **Configuração do Projeto**
   - Configure framework escolhido (Express, FastAPI, Spring, etc.)
   - Configure estrutura de pastas
   - Configure linting e formatação
   - Configure testes

2. **Implementação de APIs**
   - Implemente endpoints conforme OpenAPI e mantenha o artefato **acessível publicamente** (rota `/docs`, `/openapi.json` ou hospedagem equivalente), sem expor segredos
   - Configure validação de entrada
   - Implemente tratamento de erros
   - Configure documentação interativa (Swagger UI ou similar) espelhando o contrato versionado

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
   - Implemente JWT (padrão REST com frontend) ou OAuth quando a arquitetura exigir
   - Persistência de usuários em **tabela dedicada**; senha apenas como **hash** (bcrypt/Argon2/PBKDF2); documentar política de refresh/expiração alinhada a `data/` e `technical/`
   - Configure middleware de autenticação
   - Implemente controle de acesso (RBAC)
   - Configure refresh tokens e invalidação conforme especificação

6. **Integrações**
   - Implemente clientes HTTP para APIs externas; quando o frontend precisar apenas de dados agregados, encapsule atrás de **Facade** no backend (não exponha a complexidade ao cliente)
   - Configure retry e circuit breaker
   - Implemente tratamento de erros de integração

7. **Testes**
   - Crie testes unitários de services
   - Crie testes de integração de APIs
   - Configure mocks para dependências externas

8. **Diretrizes de Código**
   - Sempre escreva código correto, seguindo as melhores práticas
   - Aplique o princípio DRY (Don't Repeat Yourself - Não se Repita)
   - Código deve ser livre de erros, totalmente funcional
   - Implemente completamente todas as funcionalidades solicitadas
   - Não deixe nenhuma tarefa pendente, espaço reservado ou parte faltando
   - Certifique-se de que o código esteja completo
   - Verifique cuidadosamente se está finalizado
   - Inclua todas as importações necessárias
   - Assegure-se de nomear corretamente os componentes principais
   - Seja conciso. Minimize qualquer outra informação desnecessária

9. **Validação Pós-Desenvolvimento**
   - Atualizar tarefas realizadas com checkbox checked
   - Atualizar status de desenvolvimento
   - Verificar logs se necessário
   - Executar testes quando possível
   - Reiniciar serviços se necessário
   - Caso necessário, adicionar como tarefas os TODOs não implementados

10. **Implementação de Segurança**
    
    Quando receber recomendações de segurança do Security Engineer:
    
    a. **Analise e Priorize**
       - Receba e compreenda as recomendações de segurança (vulnerabilidade, impacto, severidade)
    
    b. **Planeje a Implementação (Pseudocódigo)**
       - Descreva detalhadamente em pseudocódigo como cada recomendação será implementada
       - Considere todas as camadas da aplicação
    
    c. **Desenvolva Código Seguro**
       - Confirme o plano
       - Escreva código correto, seguindo as melhores práticas (DRY, sem erros, funcional)
       - Implemente controles robustos para:
         - Autenticação/autorização (conforme stack do projeto: JWT, OAuth, RBAC, ABAC, etc.)
         - Proteção de dados (criptografia, hashing seguro com salting adequado)
         - Hardening de serviços (conforme infraestrutura do projeto)
         - Validação de entradas
    
    d. **Teste e Valide**
       - Verifique logs
       - Realize testes para validar a eficácia das correções de segurança
       - Se necessário, reinicie os serviços

## Outputs

Salve os seguintes arquivos em `backend/`:
- `src/` - Código fonte
- `api/` - APIs
- `models/` - Modelos
- `services/` - Lógica de negócio
- `tests/` - Testes
- `package.json` - Dependências

## Referências

Consulte `references/backend-patterns.md` para padrões e melhores práticas.

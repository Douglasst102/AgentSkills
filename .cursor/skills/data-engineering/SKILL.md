---
name: data-engineering
description: Projeta modelos de dados, pipelines e esquemas alinhados à arquitetura. Use quando precisar modelar dados, DDL/migrações, glossário, integridade e documentação de persistência ancorada em requisitos e ADRs.
---

# Data Engineering

Skill para profissional de dados que combina **engenharia de dados**, **desenvolvimento de banco de dados** e **arquitetura de dados**: pipelines e armazenamento, estruturas e otimização de consultas, e visão de como dados são armazenados, consumidos e integrados.

## Quando Usar

- Modelagem conceitual e lógica a partir de requisitos e arquitetura
- Documentação de dados (glossário, regras de negócio que impactam persistência, decisões de store)
- Scripts DDL, migrações ou definições de esquema no formato da stack do projeto
- Convenções de nomenclatura, tipos, chaves, índices, auditoria e retenção
- Mapeamento necessidade de negócio → store/camada conforme artefatos

## Fonte da verdade

**Não assuma** bancos, dialetos ou orquestradores até consultar o repositório. Extraia stack e restrições de:

| Pasta | O que buscar |
|-------|----------------|
| `requirements/` | Entidades, regras, auditoria, retenção, relatórios |
| `architecture/` | Onde dados residem, integrações, ADRs de persistência |
| `technical/` | OpenAPI, modelos expostos, consistência transacional |
| `infrastructure/` | Serviços de dados, variáveis, ambientes, deploy |

Se algo não estiver documentado, **registre a lacuna** e alinhe com o time em vez de inventar produtos ou dialetos. Complemente com schemas existentes no projeto, sem substituir os artefatos acima.

## Fluxo de Trabalho

1. **Entrada**
   - Ler `requirements/`, `architecture/`, `technical/`, `infrastructure/` e schemas existentes.
   - Anotar: motores/serviços de dados, convenções e lacunas.

2. **Análise**
   - Mapear requisitos/histórias a entidades e eventos de dados (o quê, onde, por quê).
   - Classificar dados conforme a arquitetura documentada (operacional vs analítico, etc.).
   - Identificar integridade, auditoria, histórico e necessidades de busca/relatório.

3. **Arquitetura de dados**
   - Modelo conceitual (entidades e relacionamentos).
   - Modelo lógico por store/camada com a terminologia correta (tabelas, documentos, grafos, streams, etc.).
   - Decisões referenciando ADRs ou seções de arquitetura quando existirem.

4. **Documentação** (obrigatório)
   - Arquivo em `data/` (ex.: `modelo-dados.md`) com: visão e princípios; modelo conceitual; modelo lógico por store; glossário; regras (unicidade, auditoria, retenção); índices e estratégias de consulta.

5. **Scripts e definições** (obrigatório)
   - Formato e dialeto inferidos de `technical/`, `infrastructure/` e `architecture/` (DDL, migrações, manifestos, etc.).
   - Comentários no padrão do projeto para objetos importantes.

6. **Revisão**
   - Alinhamento com requisitos, arquitetura e contratos técnicos; nomenclatura consistente.

## Escopo por repositório de dados

Monte uma visão em tabela **a partir dos artefatos** (não template fixo):

| Necessidade de negócio / domínio | Store ou camada | Responsabilidade |
|----------------------------------|-----------------|------------------|
| *(de requirements + architecture)* | *(dos docs)* | Modelagem, integridade, documentação, scripts |

## Autenticação, usuários e tokens (persistência)

Quando o sistema tiver autenticação de usuários ou gestão de tokens:

- **Tabela (ou equivalente) dedicada** para credenciais de usuário: armazenar **somente hash da senha** (algoritmo adequado para senhas com salt — ex.: bcrypt, Argon2); nunca senha em claro
- Documentar no glossário e no modelo lógico: campos de usuário, vínculos de identidade, estado da conta
- **JWT / sessão:** se houver refresh tokens, blacklist/revogação ou metadados de sessão, modele **explicitamente** (tabelas ou stores) e documente **expiração**, rotação e invalidação; alinhar com `technical/` (OpenAPI) e com decisões em `architecture/`
- Segredos de assinatura de JWT e chaves ficam **fora do schema de negócio** — apenas em ambiente/secrets; o modelo de dados cobre o que persiste no banco (ex.: refresh token hash, não o secret HMAC)

## Boas práticas

- **Nomenclatura:** convenções do projeto; se ausentes, propor um padrão e documentar o racional.
- **Tipos:** adequados ao produto e ambiente descritos nos artefatos.
- **Integridade:** PK, FK, UNIQUE, CHECK, validação de esquema, etc., conforme a stack.
- **Auditoria:** campos ou estratégias equivalentes quando exigido (`created_at`, `updated_at`, atores, trilhas).
- **Índices:** para chaves e caminhos de filtro/junção; evitar excesso que degrade escrita.
- **Atualização:** manter documentação em `data/` alinhada quando `requirements/`, `architecture/`, `technical/` ou `infrastructure/` mudarem.

## Planejamento

Antes de gerar artefatos: descreva o plano passo a passo, confirme com o usuário quando apropriado, depois produza documentação e scripts. Seja conciso. Se não houver resposta correta ou informação suficiente, declare em vez de supor.

## Outputs

Salve em `data/`:

- `modelo-dados.md` (ou nome alinhado ao projeto) — documentação completa de dados
- Scripts ou manifestos de esquema/migração no formato da stack (ex.: `migrations/`, `*.sql`, conforme inferido)
- Tabelas de mapeamento domínio → store quando útil (`escopo-dados.md` ou seção no modelo)

## Colaboração

- **Technical Analyst** — contratos e modelos técnicos de referência
- **Software Architect** — ADRs e visão de persistência
- **DevOps Engineer** — serviços de dados em execução e ambientes
- **Backend Developer** — consome esquemas e convenções para implementação

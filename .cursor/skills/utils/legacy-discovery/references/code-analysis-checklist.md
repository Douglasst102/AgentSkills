# Checklist de análise de código / UI

Use ao executar a fase 4 da skill `legacy-discovery`. Marque o que foi coberto; registre lacunas no artefato correspondente.

## 1. Entrada e estrutura

- [ ] Localizar README, solution/project files, `package.json`, `.csproj`, `pom.xml`, etc.
- [ ] Mapear pastas por camada (UI, API, domínio, dados, jobs)
- [ ] Identificar entry points (web, desktop, API, CLI)
- [ ] Listar módulos/domínios candidatos a features

## 2. Páginas, telas e rotas

- [ ] Rotas web (MVC, WebForms, SPA routes, menus)
- [ ] Telas desktop / forms / reports
- [ ] Mapeamento nome → propósito → ator
- [ ] Navegação entre telas (fluxos principais)
- [ ] Telas administrativas vs. operacionais

Registrar em `legacy/page-screen-map.md`.

## 3. Features e casos de uso

- [ ] CRUD e operações por entidade/domínio
- [ ] Relatórios e exportações
- [ ] Workflows (aprovação, status, estados)
- [ ] Busca, filtros, dashboards
- [ ] Features transversais: auth, roles, auditoria, notificações

Registrar em `legacy/feature-inventory.md`.

## 4. Regras no código

Procurar e citar evidência:

- [ ] Validações de formulário e de serviço
- [ ] Condicionais de negócio (`if` de status, limites, prazos)
- [ ] Cálculos (impostos, totais, scores)
- [ ] Máquinas de estado / enums de status
- [ ] Políticas de permissão (roles, claims, menus)

Registrar candidatos em `legacy/business-rules.md`.

## 5. Persistência no código

- [ ] Camada de acesso a dados (ORM, ADO, repositories)
- [ ] Queries embutidas / stored procedure calls
- [ ] Transações e consistência
- [ ] Soft delete, auditoria, versionamento

Cruzar com `legacy/data-model-as-is.md`.

## 6. Integrações

- [ ] HTTP clients, SOAP, gRPC
- [ ] Filas, e-mail, FTP/SFTP, arquivos
- [ ] Webhooks e callbacks
- [ ] Configuração de endpoints (config, `.env`, appsettings)

Registrar em `legacy/integrations.md`.

## 7. Jobs e batch

- [ ] Schedulers, Windows Services, cron, Hangfire, etc.
- [ ] Import/export noturno
- [ ] Efeitos colaterais em tabelas/arquivos

## 8. Segurança e compliance (as-is)

- [ ] Login, sessão, tokens
- [ ] Hash/armazenamento de senha (apenas descrever; não extrair segredos)
- [ ] Controle de acesso por tela/ação
- [ ] Dados sensíveis (PII) tocados pelo sistema

**Nunca** copiar credenciais, connection strings com senha ou segredos para artefatos — referencie apenas nomes de variáveis/arquivos.

## 9. Dívida e cheiros

- [ ] Código morto / features descontinuadas
- [ ] Duplicação de regras (UI + serviço + DB)
- [ ] Acoplamento forte a vendor/SGBD
- [ ] Hardcodes e magias numéricas

Registrar propostas em `legacy/tech-debt-and-improvements.md` (não como fato de requisito).

## Ordem prática sugerida

1. Menus / rotas → inventário de telas  
2. Handlers/controllers/services das telas críticas  
3. Validações e status transitions  
4. Calls a SQL/procs  
5. Jobs e integrações  
6. Varredura residual por domínio

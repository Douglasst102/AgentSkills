# User Stories - Sistema de Gestão do Conhecimento CCA-SJ

## Personas Identificadas

- **Colaborador**: Usuário padrão que visualiza informações e gerencia seu próprio perfil
- **Gestor**: Usuário que gerencia projetos e equipes, visualiza relatórios e análises
- **Administrador**: Usuário com acesso completo ao sistema, incluindo configurações e auditoria

---

## Índice de User Stories

### Épico 1: Autenticação e Autorização

- [ ] [US-001: Autenticação via AD/LDAP](#us-001-autenticação-via-adldap)
- [ ] [US-002: Controle de Acesso Baseado em Papéis (RBAC)](#us-002-controle-de-acesso-baseado-em-papéis-rbac)

### Épico 2: Gerenciamento de Pessoas

- [ ] [US-003: Visualizar Perfil de Colaborador](#us-003-visualizar-perfil-de-colaborador)
- [ ] [US-004: Editar Dados Pessoais do Próprio Perfil](#us-004-editar-dados-pessoais-do-próprio-perfil)
- [ ] [US-005: Gerenciar Experiência Profissional](#us-005-gerenciar-experiência-profissional)

### Épico 3: Gerenciamento de Projetos

- [ ] [US-006: Visualizar Perfil de Projeto](#us-006-visualizar-perfil-de-projeto)
- [ ] [US-007: Criar e Editar Projeto](#us-007-criar-e-editar-projeto)

### Épico 4: Busca e Filtragem

- [ ] [US-008: Busca Global](#us-008-busca-global)
- [ ] [US-009: Filtragem de Resultados de Busca](#us-009-filtragem-de-resultados-de-busca)
- [ ] [US-010: Busca Semântica](#us-010-busca-semântica)

### Épico 5: Dashboard e Visualizações

- [ ] [US-011: Dashboard Principal](#us-011-dashboard-principal)

### Épico 6: Gerenciamento de Documentos

- [ ] [US-012: Upload e Registro de Documentos](#us-012-upload-e-registro-de-documentos)
- [ ] [US-013: Geração e Gerenciamento de Sumários](#us-013-geração-e-gerenciamento-de-sumários)

### Épico 7: Análises e Relatórios

- [ ] [US-014: Análise de Lacunas de Conhecimento](#us-014-análise-de-lacunas-de-conhecimento)
- [ ] [US-015: Relatório de Expertise Interna](#us-015-relatório-de-expertise-interna)

### Épico 8: Auditoria

- [ ] [US-016: Registro de Logs de Auditoria](#us-016-registro-de-logs-de-auditoria)
- [ ] [US-017: Visualização de Logs de Auditoria](#us-017-visualização-de-logs-de-auditoria)

### Épico 9: Configurações e Integrações

- [ ] [US-018: Configuração de Integração AD/LDAP](#us-018-configuração-de-integração-adldap)
- [ ] [US-019: Gerenciamento de Mapeamento de Grupos AD para Roles](#us-019-gerenciamento-de-mapeamento-de-grupos-ad-para-roles)
- [ ] [US-020: Configuração de Serviços Externos](#us-020-configuração-de-serviços-externos)
- [ ] [US-021: Gestão de Schema do Grafo](#us-021-gestão-de-schema-do-grafo)
- [ ] [US-022: Configurações Gerais do Sistema](#us-022-configurações-gerais-do-sistema)
- [ ] [US-023: Monitoramento de Saúde dos Serviços](#us-023-monitoramento-de-saúde-dos-serviços)
- [ ] [US-024: Gestão de Usuários do Sistema](#us-024-gestão-de-usuários-do-sistema)

---

## Épico 1: Autenticação e Autorização

### US-001: Autenticação via AD/LDAP

**Como um** colaborador do CCA-SJ,  
**Eu quero** fazer login no sistema usando minhas credenciais do Active Directory,  
**Para que** eu possa acessar o sistema de gestão do conhecimento de forma segura e integrada.

#### Critérios de Aceitação

**AC 01: Login bem-sucedido com credenciais válidas**
- **Dado** que eu sou um usuário do AD/LDAP
- **E** estou na página de login
- **Quando** eu preencho meu usuário e senha corretos do AD
- **E** clico no botão "Entrar"
- **Então** o sistema deve validar minhas credenciais no AD/LDAP
- **E** deve emitir um token JWT com meus dados e roles
- **E** deve me redirecionar para o dashboard principal

**AC 02: Falha de login com credenciais inválidas**
- **Dado** que eu estou na página de login
- **Quando** eu preencho credenciais inválidas
- **E** clico no botão "Entrar"
- **Então** o sistema deve exibir mensagem de erro "Credenciais inválidas"
- **E** não deve me autenticar

**AC 03: Falha de conexão com AD/LDAP**
- **Dado** que o servidor AD/LDAP está indisponível
- **Quando** eu tento fazer login
- **Então** o sistema deve exibir mensagem de erro "Serviço de autenticação temporariamente indisponível"
- **E** deve registrar o erro nos logs

**AC 04: Expiração de token JWT**
- **Dado** que meu token JWT expirou (após 1 hora)
- **Quando** eu faço uma requisição ao sistema
- **Então** o sistema deve retornar erro 401 (Unauthorized)
- **E** deve me redirecionar para a página de login

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `POST /api/auth/login`
- Implementar integração com AD/LDAP usando `ldapjs` ou `passport-ldapauth`
- Implementar serviço de geração de JWT com `jsonwebtoken`
- Configurar validação de certificado LDAP (LDAPS)
- Implementar tratamento de erros e timeouts
- Criar middleware de autenticação JWT

**Frontend:**
- Criar componente de página de login (`LoginPage.tsx`)
- Implementar formulário com validação (React Hook Form)
- Implementar chamada à API de login
- Gerenciar armazenamento do token JWT (sessionStorage)
- Implementar redirecionamento após login
- Criar interceptor HTTP para incluir token nas requisições

**Banco de Dados:**
- Não requer alterações (autenticação via AD/LDAP externo)

#### Dependências e Notas
- Requer configuração do servidor AD/LDAP
- Variáveis de ambiente: `LDAP_URL`, `LDAP_BASE_DN`, `LDAP_BIND_DN`, `LDAP_BIND_PASSWORD`
- JWT Secret deve ser armazenado em variável de ambiente

---

### US-002: Controle de Acesso Baseado em Papéis (RBAC)

**Como um** administrador do sistema,  
**Eu quero** que o sistema controle o acesso às funcionalidades baseado nos papéis dos usuários (Colaborador, Gestor, Administrador),  
**Para que** apenas usuários autorizados possam acessar e modificar informações sensíveis.

#### Critérios de Aceitação

**AC 01: Mapeamento de grupos AD para roles**
- **Dado** que um usuário pertence ao grupo AD "CCA-SJ-Gestores"
- **Quando** ele faz login no sistema
- **Então** o sistema deve mapear seu grupo AD para o role "Gestor"
- **E** deve incluir o role "Gestor" no token JWT

**AC 02: Acesso negado para operação não autorizada**
- **Dado** que eu sou um Colaborador (role: "Colaborador")
- **Quando** eu tento acessar a página de administração
- **Então** o sistema deve retornar erro 403 (Forbidden)
- **E** deve exibir mensagem "Você não tem permissão para acessar este recurso"

**AC 03: Cache de roles do usuário**
- **Dado** que um usuário já fez login anteriormente
- **Quando** o sistema consulta os roles do usuário
- **Então** o sistema deve consultar o cache (Redis) primeiro
- **E** se não encontrar no cache, deve consultar o AD/LDAP
- **E** deve armazenar no cache com TTL de 1 hora

**AC 04: Validação de permissões em endpoints**
- **Dado** que um endpoint requer role "Gestor" ou "Administrador"
- **Quando** um usuário com role "Colaborador" faz uma requisição
- **Então** o middleware de autorização deve bloquear a requisição
- **E** deve retornar erro 403

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar serviço de mapeamento AD/LDAP → Roles
- Implementar cache de roles no Redis (TTL: 1 hora)
- Criar middleware/guard de autorização (RolesGuard)
- Implementar decorators/annotations para proteção de rotas
- Criar serviço de validação de permissões

**Frontend:**
- Criar componente `RequireAuth` para proteção de rotas
- Implementar hook `useAuth` para verificar roles do usuário
- Criar guards de rota no React Router
- Implementar ocultação de componentes baseado em roles

**Banco de Dados:**
- Não requer alterações (roles vêm do AD/LDAP)

#### Dependências e Notas
- Depende de US-001 (Autenticação)
- Configuração de mapeamento: `AD_GROUP_TO_ROLE`
- Cache Redis opcional (pode usar memória inicialmente)

---

## Épico 2: Gerenciamento de Pessoas

### US-003: Visualizar Perfil de Colaborador

**Como um** colaborador ou gestor,  
**Eu quero** visualizar o perfil detalhado de um colaborador,  
**Para que** eu possa conhecer suas habilidades, projetos e experiência profissional.

#### Critérios de Aceitação

**AC 01: Visualização de cabeçalho do perfil**
- **Dado** que eu estou visualizando o perfil de um colaborador
- **Quando** a página carrega
- **Então** devo ver foto, nome, cargo, departamento, localização, contatos e status atual

**AC 02: Visualização de habilidades e competências**
- **Dado** que estou no perfil de um colaborador
- **Quando** visualizo a seção de habilidades
- **Então** devo ver habilidades com barras de progresso indicando níveis (1-5)
- **E** devo ver competências organizadas por categoria (Técnicas, Gestão, Soft Skills)

**AC 03: Visualização de projetos do colaborador**
- **Dado** que estou no perfil de um colaborador
- **Quando** visualizo a seção de projetos
- **Então** devo ver lista de projetos atuais e passados
- **E** devo ver função em cada projeto e período de atuação
- **E** devo ver gráfico de pizza mostrando dedicação percentual

**AC 04: Visualização de rede de relacionamentos**
- **Dado** que estou no perfil de um colaborador
- **Quando** visualizo a seção de rede
- **Então** devo ver visualização interativa em grafo
- **E** devo ver colegas de trabalho, hierarquia organizacional e equipes de projetos

**AC 05: Restrição de acesso ao próprio perfil**
- **Dado** que eu sou um Colaborador
- **Quando** tento visualizar perfil de outro colaborador
- **Então** o sistema deve permitir visualização (apenas leitura)
- **E** não deve permitir edição

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/people/:id`
- Implementar consulta no Neo4j para buscar pessoa e relacionamentos
- Implementar agregação de dados (projetos, habilidades, rede)
- Criar endpoint `GET /api/people/:id/network` para rede de relacionamentos
- Implementar validação de permissões (RBAC)

**Frontend:**
- Criar componente `EmployeeProfile.tsx`
- Criar subcomponentes: `EmployeeHeader.tsx`, `EmployeeSkills.tsx`, `EmployeeProjects.tsx`, `EmployeeNetwork.tsx`
- Implementar visualização de grafo com `react-cytoscapejs` ou D3.js
- Implementar gráfico de pizza com Recharts ou Chart.js
- Implementar gráfico de radar para perfil de competências

**Banco de Dados:**
- Verificar estrutura de nós e relacionamentos no Neo4j
- Criar índices para otimizar consultas de perfil

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer dados populados no Neo4j

---

### US-004: Editar Dados Pessoais do Próprio Perfil

**Como um** colaborador,  
**Eu quero** editar minhas informações pessoais (nome, email, telefone, foto, resumo profissional),  
**Para que** eu possa manter meus dados atualizados no sistema.

#### Critérios de Aceitação

**AC 01: Edição bem-sucedida de dados pessoais**
- **Dado** que eu sou um colaborador autenticado
- **E** estou na página de edição do meu perfil
- **Quando** eu atualizo meus dados pessoais (nome, email, telefone)
- **E** clico em "Salvar"
- **Então** o sistema deve validar os dados
- **E** deve atualizar no Neo4j
- **E** deve exibir mensagem de sucesso
- **E** deve atualizar a visualização do perfil

**AC 02: Validação de campos obrigatórios**
- **Dado** que estou editando meu perfil
- **Quando** deixo campos obrigatórios vazios (nome, email)
- **E** clico em "Salvar"
- **Então** o sistema deve exibir mensagens de erro de validação
- **E** não deve salvar as alterações

**AC 03: Upload de foto de perfil**
- **Dado** que estou editando meu perfil
- **Quando** faço upload de uma nova foto
- **Então** o sistema deve validar o arquivo (tipo, tamanho)
- **E** deve fazer upload para Minio
- **E** deve atualizar o campo `foto_url` no Neo4j
- **E** deve exibir a nova foto no perfil

**AC 04: Restrição de edição de dados de outros usuários**
- **Dado** que eu sou um Colaborador
- **Quando** tento editar perfil de outro colaborador
- **Então** o sistema deve retornar erro 403 (Forbidden)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `PUT /api/people/:id` (apenas próprio perfil)
- Implementar validação de dados (Joi ou Zod)
- Implementar validação de permissões (apenas próprio perfil)
- Criar endpoint `POST /api/people/:id/photo` para upload de foto
- Integrar com Minio para armazenamento de arquivos
- Atualizar nó Pessoa no Neo4j
- Criar evento na Outbox para indexação no ElasticSearch

**Frontend:**
- Criar componente `EditProfileForm.tsx`
- Implementar formulário com React Hook Form
- Implementar validação de campos
- Implementar upload de foto com preview
- Implementar feedback de sucesso/erro
- Implementar redirecionamento após salvamento

**Banco de Dados:**
- Verificar estrutura do nó Pessoa no Neo4j
- Criar constraints para campos obrigatórios

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer Minio configurado para armazenamento de arquivos
- Requer sistema de indexação assíncrona (Outbox Pattern)

---

### US-005: Gerenciar Experiência Profissional

**Como um** colaborador,  
**Eu quero** adicionar, editar e remover minhas experiências profissionais,  
**Para que** meu perfil reflita minha trajetória profissional.

#### Critérios de Aceitação

**AC 01: Adicionar experiência profissional**
- **Dado** que estou editando meu perfil
- **Quando** adiciono uma nova experiência (role, company, data_inicio, data_fim)
- **E** clico em "Adicionar"
- **Então** o sistema deve validar os dados
- **E** deve criar relacionamento no Neo4j
- **E** deve exibir a experiência na lista

**AC 02: Editar experiência existente**
- **Dado** que tenho uma experiência profissional cadastrada
- **Quando** edito os dados da experiência
- **E** clico em "Salvar"
- **Então** o sistema deve atualizar a experiência no Neo4j
- **E** deve atualizar a visualização

**AC 03: Remover experiência**
- **Dado** que tenho uma experiência profissional cadastrada
- **Quando** clico em "Remover"
- **E** confirmo a remoção
- **Então** o sistema deve remover o relacionamento no Neo4j
- **E** deve remover da lista

**AC 04: Validação de datas**
- **Dado** que estou adicionando uma experiência
- **Quando** informo data_fim anterior à data_inicio
- **Então** o sistema deve exibir erro de validação
- **E** não deve salvar

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoints `POST /api/people/:id/experience`, `PUT /api/people/:id/experience/:expId`, `DELETE /api/people/:id/experience/:expId`
- Implementar validação de dados e datas
- Criar/atualizar/remover relacionamentos no Neo4j
- Implementar validação de permissões

**Frontend:**
- Criar componente `ExperienceList.tsx` e `ExperienceForm.tsx`
- Implementar formulário com validação
- Implementar lista com ações de editar/remover
- Implementar confirmação de remoção

**Banco de Dados:**
- Verificar estrutura de relacionamentos de experiência no Neo4j

#### Dependências e Notas
- Depende de US-004 (Edição de perfil)

---

## Épico 3: Gerenciamento de Projetos

### US-006: Visualizar Perfil de Projeto

**Como um** colaborador ou gestor,  
**Eu quero** visualizar o perfil detalhado de um projeto,  
**Para que** eu possa entender o status, equipe, métricas e documentação do projeto.

#### Critérios de Aceitação

**AC 01: Visualização de visão geral do projeto**
- **Dado** que estou visualizando o perfil de um projeto
- **Quando** a página carrega
- **Então** devo ver nome, código, cliente, status, progresso geral e datas importantes

**AC 02: Visualização de equipe do projeto**
- **Dado** que estou no perfil de um projeto
- **Quando** visualizo a seção de equipe
- **Então** devo ver gerente responsável
- **E** devo ver lista de membros com funções
- **E** devo ver gráfico de distribuição por função (doughnut chart)

**AC 03: Visualização de métricas do projeto**
- **Dado** que estou no perfil de um projeto
- **Quando** visualizo a seção de métricas
- **Então** devo ver KPIs com barras de progresso
- **E** devo ver gráfico de linha de progresso (planejado vs. real)
- **E** devo ver gráfico de barras para orçamento (planejado, gasto, restante)

**AC 04: Visualização de marcos do projeto**
- **Dado** que estou no perfil de um projeto
- **Quando** visualizo a seção de marcos
- **Então** devo ver lista de marcos com datas e status (concluído/pendente)

**AC 05: Visualização de documentação**
- **Dado** que estou no perfil de um projeto
- **Quando** visualizo a seção de documentação
- **Então** devo ver links para documentos organizados por tipo
- **E** devo ver lista de documentos recentes

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/projects/:id`
- Implementar consulta no Neo4j para buscar projeto e relacionamentos
- Implementar agregação de dados (equipe, métricas, marcos, documentação)
- Criar endpoints auxiliares para métricas e marcos

**Frontend:**
- Criar componente `ProjectProfile.tsx`
- Criar subcomponentes: `ProjectOverview.tsx`, `ProjectTeam.tsx`, `ProjectMetrics.tsx`, `ProjectMilestones.tsx`, `ProjectDocuments.tsx`
- Implementar gráficos com Recharts ou Chart.js
- Implementar visualização de progresso

**Banco de Dados:**
- Verificar estrutura de nós e relacionamentos no Neo4j
- Criar índices para otimizar consultas

#### Dependências e Notas
- Depende de US-002 (RBAC)

---

### US-007: Criar e Editar Projeto

**Como um** gestor ou administrador,  
**Eu quero** criar e editar projetos,  
**Para que** eu possa registrar e atualizar informações sobre os projetos do CCA-SJ.

#### Critérios de Aceitação

**AC 01: Criação de projeto bem-sucedida**
- **Dado** que eu sou um Gestor ou Administrador
- **E** estou na página de criação de projeto
- **Quando** preencho os dados do projeto (nome, código, descrição, status, cliente, datas, objetivos)
- **E** clico em "Criar"
- **Então** o sistema deve validar os dados
- **E** deve criar o nó Projeto no Neo4j
- **E** deve exibir mensagem de sucesso
- **E** deve redirecionar para o perfil do projeto

**AC 02: Edição de projeto existente**
- **Dado** que existe um projeto cadastrado
- **E** eu tenho permissão para editá-lo
- **Quando** edito os dados do projeto
- **E** clico em "Salvar"
- **Então** o sistema deve atualizar o projeto no Neo4j
- **E** deve criar evento na Outbox para indexação
- **E** deve exibir mensagem de sucesso

**AC 03: Validação de campos obrigatórios**
- **Dado** que estou criando/editando um projeto
- **Quando** deixo campos obrigatórios vazios (nome, código)
- **Então** o sistema deve exibir mensagens de erro
- **E** não deve salvar

**AC 04: Restrição de acesso**
- **Dado** que eu sou um Colaborador
- **Quando** tento criar um projeto
- **Então** o sistema deve retornar erro 403 (Forbidden)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoints `POST /api/projects` e `PUT /api/projects/:id`
- Implementar validação de dados (Joi ou Zod)
- Implementar validação de permissões (RBAC)
- Criar/atualizar nó Projeto no Neo4j
- Criar evento na Outbox para indexação no ElasticSearch

**Frontend:**
- Criar componente `ProjectForm.tsx`
- Implementar formulário com React Hook Form
- Implementar validação de campos
- Implementar seleção de status, cliente
- Implementar lista de objetivos (adicionar/remover)
- Implementar feedback de sucesso/erro

**Banco de Dados:**
- Verificar estrutura do nó Projeto no Neo4j
- Criar constraints para campos obrigatórios

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer sistema de indexação assíncrona

---

## Épico 4: Busca e Filtragem

### US-008: Busca Global

**Como um** colaborador, gestor ou administrador,  
**Eu quero** realizar buscas por termos em todo o sistema,  
**Para que** eu possa encontrar rapidamente pessoas, projetos, tecnologias e documentos relevantes.

#### Critérios de Aceitação

**AC 01: Busca bem-sucedida com resultados**
- **Dado** que estou na página de busca
- **Quando** digito um termo de busca (ex: "React")
- **E** clico em "Buscar"
- **Então** o sistema deve buscar no ElasticSearch
- **E** deve retornar resultados de pessoas, projetos, tecnologias, conhecimentos que contenham o termo
- **E** deve exibir resultados agrupados por tipo de entidade
- **E** deve destacar o termo buscado nos resultados

**AC 02: Busca sem resultados**
- **Dado** que estou na página de busca
- **Quando** digito um termo que não existe no sistema
- **E** clico em "Buscar"
- **Então** o sistema deve exibir mensagem "Nenhum resultado encontrado"
- **E** deve sugerir termos relacionados (se disponível)

**AC 03: Busca com múltiplos termos**
- **Dado** que estou na página de busca
- **Quando** digito múltiplos termos (ex: "React TypeScript")
- **E** clico em "Buscar"
- **Então** o sistema deve buscar documentos que contenham ambos os termos
- **E** deve ordenar resultados por relevância

**AC 04: Busca com caracteres especiais**
- **Dado** que estou na página de busca
- **Quando** digito termos com caracteres especiais
- **Então** o sistema deve tratar os caracteres especiais adequadamente
- **E** não deve retornar erro

**AC 05: Performance da busca**
- **Dado** que o sistema tem muitos documentos indexados
- **Quando** realizo uma busca
- **Então** o sistema deve retornar resultados em menos de 2 segundos

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/search?q={term}`
- Implementar serviço de busca no ElasticSearch
- Implementar agregação de resultados por tipo de entidade
- Implementar hidratação de resultados completos no Neo4j
- Implementar cache de resultados frequentes (Redis)
- Implementar paginação de resultados

**Frontend:**
- Criar componente `SearchPage.tsx` e `SearchBar.tsx`
- Implementar barra de busca no header
- Implementar exibição de resultados agrupados
- Implementar highlight de termos buscados
- Implementar paginação de resultados
- Implementar loading state durante busca

**Banco de Dados:**
- Configurar índices no ElasticSearch para entidades indexáveis
- Configurar mapeamento de campos textuais

#### Dependências e Notas
- Requer ElasticSearch configurado e populado
- Requer sistema de indexação assíncrona funcionando
- Cache Redis opcional para melhorar performance

---

### US-009: Filtragem de Resultados de Busca

**Como um** colaborador, gestor ou administrador,  
**Eu quero** filtrar resultados de busca por atributos específicos (status, departamento, categoria),  
**Para que** eu possa refinar os resultados e encontrar exatamente o que procuro.

#### Critérios de Aceitação

**AC 01: Filtragem por status de projeto**
- **Dado** que realizei uma busca e obtive resultados
- **Quando** aplico filtro "Status: Ativo"
- **Então** o sistema deve filtrar resultados mostrando apenas projetos com status "Ativo"
- **E** deve atualizar a contagem de resultados

**AC 02: Filtragem múltipla**
- **Dado** que realizei uma busca
- **Quando** aplico múltiplos filtros (ex: Departamento: "TI" E Status: "Ativo")
- **Então** o sistema deve aplicar todos os filtros
- **E** deve mostrar apenas resultados que atendem a todos os critérios

**AC 03: Remoção de filtros**
- **Dado** que tenho filtros aplicados
- **Quando** removo um filtro
- **Então** o sistema deve atualizar os resultados
- **E** deve remover o filtro da interface

**AC 04: Filtros disponíveis por tipo de entidade**
- **Dado** que estou visualizando resultados de busca
- **Quando** visualizo os filtros disponíveis
- **Então** devo ver filtros relevantes para cada tipo de entidade
- **E** filtros de projetos devem incluir: status, cliente, departamento
- **E** filtros de pessoas devem incluir: departamento, cargo, status

#### Tarefas Técnicas Sugeridas

**Backend:**
- Estender endpoint `GET /api/search` para aceitar parâmetros de filtro
- Implementar filtros no ElasticSearch usando query filters
- Implementar agregações para obter valores disponíveis de filtros
- Criar endpoint `GET /api/search/filters` para listar filtros disponíveis

**Frontend:**
- Criar componente `SearchFilters.tsx`
- Implementar interface de filtros com checkboxes/selects
- Implementar aplicação de filtros na busca
- Implementar remoção de filtros
- Implementar atualização dinâmica de resultados

**Banco de Dados:**
- Configurar campos filtrados no ElasticSearch como filtros
- Criar agregações para valores de filtros

#### Dependências e Notas
- Depende de US-008 (Busca Global)
- Requer ElasticSearch com campos indexados para filtragem

---

### US-010: Busca Semântica

**Como um** colaborador, gestor ou administrador,  
**Eu quero** realizar buscas semânticas usando linguagem natural,  
**Para que** eu possa encontrar documentos relevantes mesmo que não contenham os termos exatos que busco.

#### Critérios de Aceitação

**AC 01: Busca semântica bem-sucedida**
- **Dado** que estou na página de busca
- **E** seleciono a opção "Busca Semântica"
- **Quando** digito uma pergunta ou descrição em linguagem natural (ex: "Como implementar autenticação JWT?")
- **E** clico em "Buscar"
- **Então** o sistema deve gerar embedding da consulta via Ollama
- **E** deve buscar documentos similares no ChromaDB
- **E** deve retornar documentos com sumários semanticamente similares
- **E** deve ordenar por similaridade

**AC 02: Busca semântica sem sumários**
- **Dado** que um documento não possui sumário
- **Quando** realizo busca semântica
- **Então** o documento não deve aparecer nos resultados semânticos
- **E** deve aparecer apenas em busca full-text (se aplicável)

**AC 03: Combinação de busca full-text e semântica**
- **Dado** que estou na página de busca
- **Quando** realizo busca com opção "Busca Híbrida"
- **Então** o sistema deve combinar resultados de busca full-text e semântica
- **E** deve ordenar por relevância combinada

**AC 04: Performance da busca semântica**
- **Dado** que o sistema tem muitos sumários indexados
- **Quando** realizo busca semântica
- **Então** o sistema deve retornar resultados em menos de 5 segundos

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `POST /api/search/semantic` que aceita query em texto
- Implementar serviço de geração de embedding via Ollama
- Implementar busca por similaridade no ChromaDB
- Implementar hidratação de documentos completos no Neo4j
- Implementar combinação de resultados (full-text + semântica)

**Frontend:**
- Criar opção de seleção de tipo de busca (Full-text, Semântica, Híbrida)
- Implementar interface de busca semântica
- Implementar exibição de resultados com score de similaridade
- Implementar loading state durante busca

**Banco de Dados:**
- Verificar coleções no ChromaDB com embeddings de sumários
- Configurar índice de similaridade no ChromaDB

#### Dependências e Notas
- Requer ChromaDB configurado e populado com embeddings
- Requer Ollama configurado para geração de embeddings
- Requer sumários de documentos gerados e indexados

---

## Épico 5: Dashboard e Visualizações

### US-011: Dashboard Principal

**Como um** colaborador, gestor ou administrador,  
**Eu quero** visualizar um dashboard com métricas gerais do CCA-SJ,  
**Para que** eu tenha uma visão rápida do estado atual da organização.

#### Critérios de Aceitação

**AC 01: Exibição de métricas gerais**
- **Dado** que estou autenticado no sistema
- **Quando** acesso o dashboard principal
- **Então** devo ver número total de funcionários
- **E** devo ver número total de projetos
- **E** devo ver número de departamentos
- **E** devo ver número de projetos ativos

**AC 02: Exibição de gráficos**
- **Dado** que estou no dashboard
- **Quando** visualizo os gráficos
- **Então** devo ver gráfico "Status dos Projetos" (doughnut chart)
- **E** devo ver gráfico "Funcionários por Departamento" (bar chart)

**AC 03: Listagem de entidades**
- **Dado** que estou no dashboard
- **Quando** visualizo as listagens
- **Então** devo ver cards de funcionários recentes
- **E** devo ver cards de projetos recentes
- **E** devo poder clicar nos cards para acessar perfis detalhados

**AC 04: Performance do dashboard**
- **Dado** que o sistema tem muitos dados
- **Quando** acesso o dashboard
- **Então** o dashboard deve carregar em menos de 3 segundos
- **E** deve usar cache quando disponível

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/dashboard`
- Implementar agregações no Neo4j para métricas
- Implementar cache no Redis para dados do dashboard (TTL: 5 minutos)
- Implementar consultas otimizadas para listagens

**Frontend:**
- Criar componente `Dashboard.tsx`
- Implementar cards de métricas
- Implementar gráficos com Recharts ou Chart.js
- Implementar listagens com cards clicáveis
- Implementar loading state
- Implementar refresh de dados

**Banco de Dados:**
- Criar índices no Neo4j para otimizar agregações
- Configurar cache Redis

#### Dependências e Notas
- Requer Redis para cache (opcional, pode usar memória inicialmente)
- Depende de dados populados no Neo4j

---

## Épico 6: Gerenciamento de Documentos (+++++++++++++++++++++++++++ indexar documentos externos via link com integração, bookstack, DSpace, GitLab... ++++++++++++++++++++++++++)

### US-012: Upload e Registro de Documentos

**Como um** gestor ou administrador,  
**Eu quero** fazer upload e registrar documentos no sistema,  
**Para que** a documentação de projetos e conhecimentos fique centralizada e acessível.

#### Critérios de Aceitação

**AC 01: Upload de documento bem-sucedido**
- **Dado** que eu sou um Gestor ou Administrador
- **E** estou na página de upload de documento
- **Quando** seleciono um arquivo
- **E** preencho os dados do documento (nome, tipo, descrição)
- **E** clico em "Enviar"
- **Então** o sistema deve validar o arquivo (tipo, tamanho)
- **E** deve fazer upload para Minio
- **E** deve criar nó Documentacao no Neo4j
- **E** deve criar evento na Outbox para indexação
- **E** deve exibir mensagem de sucesso

**AC 02: Validação de tipo de arquivo**
- **Dado** que estou fazendo upload de documento
- **Quando** seleciono arquivo com tipo não permitido
- **Então** o sistema deve exibir erro "Tipo de arquivo não permitido"
- **E** não deve fazer upload

**AC 03: Validação de tamanho de arquivo**
- **Dado** que estou fazendo upload de documento
- **Quando** seleciono arquivo maior que o limite (ex: 50MB)
- **Então** o sistema deve exibir erro "Arquivo muito grande"
- **E** não deve fazer upload

**AC 04: Associação de documento a projeto**
- **Dado** que estou fazendo upload de documento
- **Quando** associo o documento a um projeto
- **E** indico a criticidade do documento
- **Então** o sistema deve criar relacionamento POSSUI_DOCUMENTACAO no Neo4j
- **E** deve incluir a criticidade no relacionamento

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `POST /api/documents` com multipart/form-data
- Implementar validação de arquivo (tipo, tamanho)
- Implementar upload para Minio
- Criar nó Documentacao no Neo4j
- Criar relacionamento POSSUI_DOCUMENTACAO (se associado a projeto)
- Criar evento na Outbox para indexação no ElasticSearch
- Implementar validação de permissões (RBAC)

**Frontend:**
- Criar componente `DocumentUploadForm.tsx`
- Implementar upload de arquivo com drag-and-drop
- Implementar preview de arquivo
- Implementar seleção de projeto para associação
- Implementar feedback de progresso de upload
- Implementar validação de arquivo no cliente

**Banco de Dados:**
- Verificar estrutura do nó Documentacao no Neo4j
- Verificar estrutura do relacionamento POSSUI_DOCUMENTACAO

#### Dependências e Notas
- Requer Minio configurado para armazenamento
- Depende de US-002 (RBAC)
- Requer sistema de indexação assíncrona

---

### US-013: Geração e Gerenciamento de Sumários

**Como um** gestor ou administrador,  
**Eu quero** criar e gerenciar sumários de documentos e publicações,  
**Para que** o sistema possa realizar buscas semânticas eficazes.

#### Critérios de Aceitação

**AC 01: Criação de sumário manual**
- **Dado** que existe um documento no sistema
- **E** eu sou um Gestor ou Administrador
- **Quando** crio um sumário para o documento (nome, descrição, conteúdo)
- **E** clico em "Criar"
- **Então** o sistema deve criar nó Sumario no Neo4j
- **E** deve criar relacionamento POSSUI_SUMARIO
- **E** deve criar evento na Outbox para geração de embedding
- **E** deve exibir mensagem de sucesso

**AC 02: Geração automática de embedding**
- **Dado** que um sumário foi criado
- **Quando** o worker processa o evento de sumário
- **Então** o sistema deve gerar embedding do conteúdo via Ollama
- **E** deve armazenar embedding no ChromaDB
- **E** deve atualizar o campo `vetor` no nó Sumario (opcional)

**AC 03: Edição de sumário**
- **Dado** que existe um sumário cadastrado
- **Quando** edito o conteúdo do sumário
- **E** clico em "Salvar"
- **Então** o sistema deve atualizar o sumário no Neo4j
- **E** deve criar evento para reindexação do embedding

**AC 04: Visualização de sumário**
- **Dado** que estou visualizando um documento
- **Quando** o documento possui sumário
- **Então** devo ver o sumário na página do documento
- **E** devo ver opção de editar (se tiver permissão)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoints `POST /api/summaries`, `PUT /api/summaries/:id`, `GET /api/summaries/:id`
- Implementar criação/atualização de nó Sumario no Neo4j
- Criar relacionamento POSSUI_SUMARIO
- Criar evento na Outbox para geração de embedding
- Implementar worker para processar eventos de sumário (gerar embedding via Ollama, armazenar no ChromaDB)

**Frontend:**
- Criar componente `SummaryForm.tsx`
- Implementar formulário para criação/edição de sumário
- Implementar visualização de sumário na página de documento
- Implementar validação de conteúdo

**Banco de Dados:**
- Verificar estrutura do nó Sumario no Neo4j
- Verificar estrutura do relacionamento POSSUI_SUMARIO
- Configurar ChromaDB para armazenamento de embeddings

#### Dependências e Notas
- Depende de US-012 (Upload de documentos)
- Requer Ollama configurado para geração de embeddings
- Requer ChromaDB configurado
- Requer sistema de indexação assíncrona (Outbox Pattern)

---

## Épico 7: Análises e Relatórios

### US-014: Análise de Lacunas de Conhecimento

**Como um** gestor,  
**Eu quero** visualizar análises de lacunas entre conhecimentos/competências requeridos por projetos e os que as pessoas possuem,  
**Para que** eu possa identificar necessidades de capacitação e montar equipes mais eficientes.

#### Critérios de Aceitação

**AC 01: Visualização de lacunas por projeto**
- **Dado** que sou um Gestor
- **E** estou na página de análise de lacunas
- **Quando** seleciono um projeto
- **Então** devo ver lista de conhecimentos/competências requeridos pelo projeto
- **E** devo ver quais conhecimentos/competências a equipe possui
- **E** devo ver lacunas destacadas (conhecimentos requeridos mas não possuídos)

**AC 02: Visualização de lacunas por conhecimento**
- **Dado** que estou na página de análise de lacunas
- **Quando** seleciono um conhecimento específico
- **Então** devo ver projetos que requerem esse conhecimento
- **E** devo ver pessoas que possuem esse conhecimento
- **E** devo ver lacunas (projetos que requerem mas não têm pessoas com o conhecimento)

**AC 03: Exportação de relatório de lacunas**
- **Dado** que estou visualizando análise de lacunas
- **Quando** clico em "Exportar Relatório"
- **Então** o sistema deve gerar relatório em PDF ou Excel
- **E** deve incluir todas as lacunas identificadas

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/analytics/knowledge-gaps?projectId={id}`
- Implementar consultas no Neo4j para identificar lacunas
- Comparar conhecimentos/competências requeridos (REQUER_CONHECIMENTO, REQUER_COMPETENCIA) com possuídos (POSSUI_CONHECIMENTO, TEM_COMPETENCIA)
- Criar endpoint `GET /api/analytics/knowledge-gaps/export` para exportação
- Implementar geração de PDF/Excel

**Frontend:**
- Criar componente `KnowledgeGapsAnalysis.tsx`
- Implementar visualização de lacunas com gráficos
- Implementar filtros por projeto, conhecimento
- Implementar exportação de relatório
- Implementar visualização interativa

**Banco de Dados:**
- Otimizar consultas no Neo4j para análise de lacunas
- Criar índices para relacionamentos de conhecimento/competência

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer dados de projetos, pessoas e conhecimentos populados
- Requer relacionamentos REQUER_CONHECIMENTO, POSSUI_CONHECIMENTO, etc. criados

---

### US-015: Relatório de Expertise Interna

**Como um** gestor,  
**Eu quero** gerar relatórios que identifiquem especialistas em tecnologias, conhecimentos e competências específicas,  
**Para que** eu possa localizar rapidamente pessoas com expertise necessária para projetos.

#### Critérios de Aceitação

**AC 01: Relatório de especialistas por tecnologia**
- **Dado** que sou um Gestor
- **E** estou na página de relatórios de expertise
- **Quando** seleciono uma tecnologia (ex: "React")
- **E** clico em "Gerar Relatório"
- **Então** o sistema deve listar todas as pessoas que dominam essa tecnologia
- **E** deve mostrar nível de domínio e anos de experiência
- **E** deve ordenar por nível de domínio (maior para menor)

**AC 02: Relatório de especialistas por conhecimento**
- **Dado** que estou na página de relatórios de expertise
- **Quando** seleciono um conhecimento específico
- **E** clico em "Gerar Relatório"
- **Então** o sistema deve listar pessoas que possuem esse conhecimento
- **E** deve mostrar nível de proficiência
- **E** deve mostrar data de aquisição e última utilização

**AC 03: Exportação de relatório**
- **Dado** que gerei um relatório de expertise
- **Quando** clico em "Exportar"
- **Então** o sistema deve gerar arquivo PDF ou Excel
- **E** deve incluir todos os especialistas identificados

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/analytics/expertise?type={technology|knowledge|competence}&id={id}`
- Implementar consultas no Neo4j para buscar especialistas
- Filtrar por relacionamentos DOMINA_TECNOLOGIA, POSSUI_CONHECIMENTO, TEM_COMPETENCIA
- Ordenar por nível de proficiência
- Criar endpoint de exportação

**Frontend:**
- Criar componente `ExpertiseReport.tsx`
- Implementar seleção de tipo (tecnologia, conhecimento, competência)
- Implementar seleção de item específico
- Implementar listagem de especialistas
- Implementar exportação de relatório

**Banco de Dados:**
- Otimizar consultas no Neo4j para busca de especialistas
- Criar índices para relacionamentos de expertise

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer dados de pessoas, tecnologias, conhecimentos e competências populados

---

## Épico 8: Auditoria

### US-016: Registro de Logs de Auditoria

**Como um** administrador,  
**Eu quero** que o sistema registre todas as ações críticas dos usuários,  
**Para que** eu possa rastrear alterações e garantir conformidade.

#### Critérios de Aceitação

**AC 01: Registro de criação de entidade**
- **Dado** que um usuário cria uma entidade (pessoa, projeto, documento)
- **Quando** a operação é bem-sucedida
- **Então** o sistema deve registrar log de auditoria com: userId, action (CREATE), entityType, entityId, timestamp, ipAddress, userAgent, result (SUCCESS)

**AC 02: Registro de atualização de entidade**
- **Dado** que um usuário atualiza uma entidade
- **Quando** a operação é bem-sucedida
- **Então** o sistema deve registrar log com action (UPDATE)
- **E** deve incluir campo `changes` com dados antes/depois (se aplicável)

**AC 03: Registro de exclusão de entidade**
- **Dado** que um usuário exclui uma entidade
- **Quando** a operação é bem-sucedida
- **Então** o sistema deve registrar log com action (DELETE)
- **E** deve incluir dados da entidade excluída

**AC 04: Registro de falhas de autenticação**
- **Dado** que um usuário tenta fazer login com credenciais inválidas
- **Quando** a autenticação falha
- **Então** o sistema deve registrar log com action (LOGIN_FAILED)
- **E** deve incluir ipAddress e userAgent

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar serviço de auditoria (AuditService)
- Implementar middleware/interceptor para capturar ações
- Criar estrutura de log de auditoria
- Armazenar logs no Postgres (tabela `audit_logs`) ou Neo4j
- Criar índices para consultas eficientes (userId, timestamp, entityType)
- Implementar logging assíncrono (não bloquear operações principais)

**Frontend:**
- Não requer alterações (auditoria é transparente ao usuário)

**Banco de Dados:**
- Criar tabela `audit_logs` no Postgres (ou nó AuditLog no Neo4j)
- Criar índices em userId, timestamp, entityType
- Configurar retenção de logs (2 anos)

#### Dependências e Notas
- Requer Postgres configurado (ou usar Neo4j)
- Logging deve ser assíncrono para não impactar performance
- Dados sensíveis devem ser mascarados nos logs

---

### US-017: Visualização de Logs de Auditoria

**Como um** administrador,  
**Eu quero** visualizar e filtrar logs de auditoria,  
**Para que** eu possa investigar ações dos usuários e garantir conformidade.

#### Critérios de Aceitação

**AC 01: Listagem de logs de auditoria**
- **Dado** que sou um Administrador
- **E** estou na página de auditoria
- **Quando** acesso a página
- **Então** devo ver lista de logs de auditoria
- **E** devo ver informações: timestamp, usuário, ação, entidade, resultado
- **E** devo ver paginação de resultados

**AC 02: Filtragem de logs**
- **Dado** que estou na página de auditoria
- **Quando** aplico filtros (usuário, ação, tipo de entidade, período)
- **Então** o sistema deve filtrar os logs
- **E** deve atualizar a lista

**AC 03: Detalhamento de log**
- **Dado** que estou na página de auditoria
- **Quando** clico em um log
- **Então** devo ver detalhes completos: dados alterados (antes/depois), IP, user agent, etc.

**AC 04: Exportação de logs**
- **Dado** que estou visualizando logs de auditoria
- **Quando** clico em "Exportar"
- **E** seleciono formato (PDF ou CSV)
- **Então** o sistema deve gerar arquivo com os logs filtrados

**AC 05: Restrição de acesso**
- **Dado** que eu não sou Administrador
- **Quando** tento acessar página de auditoria
- **Então** o sistema deve retornar erro 403 (Forbidden)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/audit/logs` com suporte a filtros e paginação
- Implementar consultas no Postgres/Neo4j com filtros
- Criar endpoint `GET /api/audit/logs/:id` para detalhamento
- Criar endpoint `GET /api/audit/logs/export` para exportação
- Implementar validação de permissões (apenas Administrador)

**Frontend:**
- Criar componente `AuditLogsPage.tsx`
- Implementar tabela de logs com paginação
- Implementar filtros (usuário, ação, tipo, período)
- Implementar modal de detalhamento de log
- Implementar exportação de logs

**Banco de Dados:**
- Otimizar consultas com índices apropriados
- Implementar paginação eficiente

#### Dependências e Notas
- Depende de US-016 (Registro de logs)
- Depende de US-002 (RBAC)
- Apenas Administradores podem acessar

---

## Épico 9: Configurações e Integrações

### US-018: Configuração de Integração AD/LDAP

**Como um** administrador do sistema,  
**Eu quero** configurar os parâmetros de conexão com o servidor AD/LDAP,  
**Para que** o sistema possa autenticar usuários corretamente e de forma segura.

#### Critérios de Aceitação

**AC 01: Configuração bem-sucedida de conexão AD/LDAP**
- **Dado** que eu sou um Administrador
- **E** estou na página de configurações de integração AD/LDAP
- **Quando** preencho os parâmetros de conexão (URL, Base DN, Bind DN, Bind Password)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão com o servidor AD/LDAP
- **E** deve exibir mensagem de sucesso se a conexão for válida
- **E** deve salvar as configurações de forma segura (criptografadas)

**AC 02: Validação de parâmetros obrigatórios**
- **Dado** que estou configurando a integração AD/LDAP
- **Quando** deixo campos obrigatórios vazios (URL, Base DN)
- **E** clico em "Salvar"
- **Então** o sistema deve exibir mensagens de erro de validação
- **E** não deve salvar as configurações

**AC 03: Teste de conexão com falha**
- **Dado** que estou configurando a integração AD/LDAP
- **Quando** informo parâmetros incorretos
- **E** clico em "Testar Conexão"
- **Então** o sistema deve exibir mensagem de erro específica
- **E** deve indicar qual parâmetro está incorreto (se possível)

**AC 04: Configuração de LDAPS (SSL/TLS)**
- **Dado** que estou configurando a integração AD/LDAP
- **Quando** habilito a opção "Usar LDAPS (SSL/TLS)"
- **E** informo o caminho do certificado (se necessário)
- **Então** o sistema deve validar o certificado
- **E** deve usar conexão segura (LDAPS) ao salvar

**AC 05: Restrição de acesso**
- **Dado** que eu não sou Administrador
- **Quando** tento acessar a página de configurações AD/LDAP
- **Então** o sistema deve retornar erro 403 (Forbidden)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/admin/config/ldap`
- Criar endpoint `PUT /api/admin/config/ldap`
- Criar endpoint `POST /api/admin/config/ldap/test` para testar conexão
- Implementar validação de parâmetros (Joi ou Zod)
- Implementar criptografia de credenciais sensíveis (Bind Password)
- Implementar serviço de teste de conexão LDAP
- Armazenar configurações de forma segura (variáveis de ambiente ou banco criptografado)
- Implementar validação de permissões (apenas Administrador)

**Frontend:**
- Criar componente `LdapConfigPage.tsx`
- Implementar formulário com campos: URL, Base DN, Bind DN, Bind Password, Porta, LDAPS
- Implementar botão "Testar Conexão" com feedback visual
- Implementar validação de campos
- Implementar exibição de status da conexão
- Implementar feedback de sucesso/erro

**Banco de Dados:**
- Criar estrutura para armazenar configurações (Neo4j ou arquivo de configuração criptografado)
- Considerar uso de variáveis de ambiente para credenciais sensíveis

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Credenciais devem ser armazenadas de forma criptografada
- Configurações podem ser armazenadas em variáveis de ambiente ou banco de dados
- Teste de conexão deve validar certificados SSL/TLS quando LDAPS estiver habilitado

---

### US-019: Gerenciamento de Mapeamento de Grupos AD para Roles

**Como um** administrador do sistema,  
**Eu quero** configurar o mapeamento entre grupos do Active Directory e roles do sistema (Colaborador, Gestor, Administrador),  
**Para que** os usuários recebam automaticamente as permissões corretas ao fazer login.

#### Critérios de Aceitação

**AC 01: Criação de mapeamento grupo AD → role**
- **Dado** que eu sou um Administrador
- **E** estou na página de mapeamento de grupos AD
- **Quando** adiciono um novo mapeamento (Grupo AD: "CCA-SJ-Gestores" → Role: "Gestor")
- **E** clico em "Salvar"
- **Então** o sistema deve validar que o grupo AD existe
- **E** deve salvar o mapeamento
- **E** deve exibir o mapeamento na lista

**AC 02: Edição de mapeamento existente**
- **Dado** que existe um mapeamento cadastrado
- **Quando** edito o role associado ao grupo AD
- **E** clico em "Salvar"
- **Então** o sistema deve atualizar o mapeamento
- **E** deve invalidar o cache de roles dos usuários afetados

**AC 03: Remoção de mapeamento**
- **Dado** que existe um mapeamento cadastrado
- **Quando** clico em "Remover"
- **E** confirmo a remoção
- **Então** o sistema deve remover o mapeamento
- **E** deve invalidar o cache de roles dos usuários afetados

**AC 04: Múltiplos grupos para mesmo role**
- **Dado** que estou configurando mapeamentos
- **Quando** mapeio múltiplos grupos AD para o mesmo role (ex: "CCA-SJ-Gestores" e "CCA-SJ-Lideres" → "Gestor")
- **Então** o sistema deve permitir múltiplos mapeamentos
- **E** usuários de qualquer grupo mapeado devem receber o role

**AC 05: Validação de role válido**
- **Dado** que estou criando um mapeamento
- **Quando** seleciono um role inválido ou inexistente
- **Então** o sistema deve exibir erro de validação
- **E** não deve salvar o mapeamento

**AC 06: Aplicação de mapeamento no próximo login**
- **Dado** que configurei um novo mapeamento
- **Quando** um usuário do grupo AD mapeado faz login
- **Então** o sistema deve aplicar o role mapeado
- **E** deve incluir o role no token JWT

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoints `GET /api/admin/config/role-mappings`, `POST /api/admin/config/role-mappings`, `PUT /api/admin/config/role-mappings/:id`, `DELETE /api/admin/config/role-mappings/:id`
- Implementar validação de grupos AD (consultar AD/LDAP)
- Implementar validação de roles válidos
- Implementar serviço de aplicação de mapeamentos no login
- Implementar invalidação de cache de roles quando mapeamento for alterado
- Armazenar mapeamentos no Neo4j ou banco de configuração

**Frontend:**
- Criar componente `RoleMappingPage.tsx`
- Implementar tabela/listagem de mapeamentos existentes
- Implementar formulário para criar/editar mapeamento
- Implementar seleção de grupo AD (com busca/autocomplete)
- Implementar seleção de role (dropdown)
- Implementar confirmação de remoção
- Implementar validação de formulário

**Banco de Dados:**
- Criar estrutura para armazenar mapeamentos (nó Config ou tabela)
- Criar índices para busca eficiente

#### Dependências e Notas
- Depende de US-001 (Autenticação AD/LDAP)
- Depende de US-002 (RBAC)
- Mapeamentos devem ser aplicados no momento do login
- Cache de roles deve ser invalidado quando mapeamentos forem alterados

---

### US-020: Configuração de Serviços Externos

**Como um** administrador do sistema,  
**Eu quero** configurar e monitorar a conexão com serviços externos (ElasticSearch, ChromaDB, Ollama, Minio, Redis, Postgres),  
**Para que** o sistema funcione corretamente e eu possa identificar problemas de integração rapidamente.

#### Critérios de Aceitação

**AC 01: Configuração de ElasticSearch**
- **Dado** que eu sou um Administrador
- **E** estou na página de configurações de serviços externos
- **Quando** configuro ElasticSearch (URL, porta, credenciais, índice padrão)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve verificar se o índice existe ou criar se necessário
- **E** deve exibir status da conexão

**AC 02: Configuração de ChromaDB**
- **Dado** que estou na página de configurações de serviços
- **Quando** configuro ChromaDB (URL, porta, coleção padrão)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve verificar se a coleção existe
- **E** deve exibir status da conexão

**AC 03: Configuração de Ollama**
- **Dado** que estou na página de configurações de serviços
- **Quando** configuro Ollama (URL, porta, modelo para embeddings)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve verificar se o modelo está disponível
- **E** deve exibir status da conexão e informações do modelo

**AC 04: Configuração de Minio**
- **Dado** que estou na página de configurações de serviços
- **Quando** configuro Minio (URL, porta, access key, secret key, bucket padrão)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve verificar se o bucket existe ou criar se necessário
- **E** deve exibir status da conexão

**AC 05: Configuração de Redis**
- **Dado** que estou na página de configurações de serviços
- **Quando** configuro Redis (URL, porta, senha, TTL padrão)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve testar escrita/leitura
- **E** deve exibir status da conexão

**AC 06: Configuração de Postgres (Auditoria)**
- **Dado** que estou na página de configurações de serviços
- **Quando** configuro Postgres (URL, porta, database, credenciais)
- **E** clico em "Testar Conexão"
- **Então** o sistema deve validar a conexão
- **E** deve verificar se a tabela de auditoria existe ou criar se necessário
- **E** deve exibir status da conexão

**AC 07: Dashboard de status dos serviços**
- **Dado** que estou na página de configurações de serviços
- **Quando** visualizo o dashboard de status
- **Então** devo ver status de todos os serviços (Online/Offline)
- **E** devo ver última verificação de saúde
- **E** devo ver latência de resposta (se disponível)

**AC 08: Validação de campos obrigatórios**
- **Dado** que estou configurando um serviço
- **Quando** deixo campos obrigatórios vazios (URL, porta)
- **Então** o sistema deve exibir mensagens de erro
- **E** não deve salvar a configuração

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoints `GET /api/admin/config/services` e `PUT /api/admin/config/services/:serviceName`
- Criar endpoint `POST /api/admin/config/services/:serviceName/test` para cada serviço
- Criar endpoint `GET /api/admin/config/services/health` para status geral
- Implementar serviços de teste de conexão para cada serviço externo
- Implementar validação de configurações
- Implementar criação automática de índices/coleções/buckets quando necessário
- Armazenar configurações de forma segura (criptografadas para credenciais)
- Implementar health checks periódicos (opcional)

**Frontend:**
- Criar componente `ExternalServicesConfigPage.tsx`
- Criar subcomponentes para cada serviço: `ElasticSearchConfig.tsx`, `ChromaDBConfig.tsx`, `OllamaConfig.tsx`, `MinioConfig.tsx`, `RedisConfig.tsx`, `PostgresConfig.tsx`
- Implementar formulários de configuração para cada serviço
- Implementar botões "Testar Conexão" com feedback visual
- Criar dashboard de status dos serviços com indicadores visuais (verde/vermelho)
- Implementar validação de campos
- Implementar salvamento de configurações

**Banco de Dados:**
- Criar estrutura para armazenar configurações de serviços
- Armazenar credenciais de forma criptografada

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Configurações devem ser armazenadas de forma segura
- Health checks podem ser implementados de forma assíncrona
- Serviços opcionais (como Postgres) devem permitir desativação

---

### US-021: Gestão de Schema do Grafo

**Como um** administrador do sistema,  
**Eu quero** visualizar e gerenciar o schema do grafo (nós, relacionamentos, propriedades),  
**Para que** eu possa entender a estrutura de dados e garantir consistência.

#### Critérios de Aceitação

**AC 01: Visualização do schema completo**
- **Dado** que eu sou um Administrador
- **E** estou na página de gestão de schema
- **Quando** acesso a página
- **Então** devo ver lista de todos os tipos de nós (Pessoa, Projeto, Conhecimento, etc.)
- **E** devo ver lista de todos os tipos de relacionamentos (TRABALHA_EM, POSSUI_CONHECIMENTO, etc.)
- **E** devo ver propriedades de cada tipo de nó

**AC 02: Visualização de propriedades de um nó**
- **Dado** que estou na página de gestão de schema
- **Quando** clico em um tipo de nó (ex: "Pessoa")
- **Então** devo ver todas as propriedades do nó (nome, cargo, email, etc.)
- **E** devo ver tipos de dados de cada propriedade
- **E** devo ver se a propriedade é obrigatória ou opcional

**AC 03: Visualização de relacionamentos de um nó**
- **Dado** que estou visualizando um tipo de nó
- **Quando** visualizo a seção de relacionamentos
- **Então** devo ver todos os relacionamentos que esse nó pode ter
- **E** devo ver os nós de destino de cada relacionamento
- **E** devo ver propriedades dos relacionamentos (se houver)

**AC 04: Validação de constraints**
- **Dado** que estou na página de gestão de schema
- **Quando** visualizo constraints do grafo
- **Então** devo ver constraints de unicidade (ex: email único para Pessoa)
- **E** devo ver constraints de obrigatoriedade
- **E** devo ver índices criados

**AC 05: Criação de índices**
- **Dado** que estou na página de gestão de schema
- **Quando** crio um novo índice para uma propriedade
- **E** especifico o tipo de nó e a propriedade
- **Então** o sistema deve criar o índice no Neo4j
- **E** deve exibir mensagem de sucesso
- **E** deve atualizar a visualização do schema

**AC 06: Exportação do schema**
- **Dado** que estou na página de gestão de schema
- **Quando** clico em "Exportar Schema"
- **Então** o sistema deve gerar arquivo JSON ou Cypher com a definição completa do schema
- **E** deve incluir nós, relacionamentos, propriedades e constraints

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/admin/schema` para obter schema completo
- Criar endpoint `GET /api/admin/schema/nodes` para listar tipos de nós
- Criar endpoint `GET /api/admin/schema/relationships` para listar tipos de relacionamentos
- Criar endpoint `GET /api/admin/schema/constraints` para listar constraints
- Criar endpoint `POST /api/admin/schema/indexes` para criar índices
- Criar endpoint `GET /api/admin/schema/export` para exportar schema
- Implementar consultas ao Neo4j para obter informações do schema (usar `db.schema.nodeTypeProperties()`, `db.schema.relationshipTypeProperties()`, etc.)
- Implementar criação de índices no Neo4j

**Frontend:**
- Criar componente `SchemaManagementPage.tsx`
- Criar visualização hierárquica do schema (árvore ou diagrama)
- Implementar visualização de propriedades de nós
- Implementar visualização de relacionamentos
- Implementar criação de índices (formulário)
- Implementar exportação de schema
- Implementar busca/filtro no schema

**Banco de Dados:**
- Usar APIs do Neo4j para consultar schema existente
- Criar índices conforme solicitado pelo administrador

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Requer Neo4j configurado e acessível
- Schema deve ser consultado dinamicamente do Neo4j
- Criação de índices pode impactar performance durante a criação

---

### US-022: Configurações Gerais do Sistema

**Como um** administrador do sistema,  
**Eu quero** configurar parâmetros gerais do sistema (timeouts, limites, retenção de logs, etc.),  
**Para que** o sistema funcione de acordo com as necessidades da organização.

#### Critérios de Aceitação

**AC 01: Configuração de timeouts**
- **Dado** que eu sou um Administrador
- **E** estou na página de configurações gerais
- **Quando** configuro timeouts (LDAP, ElasticSearch, ChromaDB, etc.)
- **E** clico em "Salvar"
- **Então** o sistema deve validar os valores (não negativos, dentro de limites razoáveis)
- **E** deve salvar as configurações
- **E** deve aplicar os timeouts nas próximas requisições

**AC 02: Configuração de limites de upload**
- **Dado** que estou na página de configurações gerais
- **Quando** configuro tamanho máximo de arquivo para upload (ex: 50MB)
- **E** clico em "Salvar"
- **Então** o sistema deve validar o valor
- **E** deve salvar a configuração
- **E** deve aplicar o limite em novos uploads

**AC 03: Configuração de retenção de logs**
- **Dado** que estou na página de configurações gerais
- **Quando** configuro período de retenção de logs de auditoria (ex: 2 anos)
- **E** clico em "Salvar"
- **Então** o sistema deve validar o período
- **E** deve salvar a configuração
- **E** deve agendar limpeza automática de logs antigos

**AC 04: Configuração de cache**
- **Dado** que estou na página de configurações gerais
- **Quando** configuro TTL de cache (Redis) para diferentes tipos de dados
- **E** clico em "Salvar"
- **Então** o sistema deve salvar as configurações
- **E** deve aplicar os TTLs configurados

**AC 05: Configuração de JWT**
- **Dado** que estou na página de configurações gerais
- **Quando** configuro expiração de token JWT (ex: 1 hora)
- **E** configuro expiração de refresh token (ex: 7 dias)
- **E** clico em "Salvar"
- **Então** o sistema deve validar os valores
- **E** deve salvar as configurações
- **E** deve aplicar nas próximas emissões de token

**AC 06: Configuração de notificações**
- **Dado** que estou na página de configurações gerais
- **Quando** habilito/desabilito notificações por email
- **E** configuro templates de notificação
- **E** clico em "Salvar"
- **Então** o sistema deve salvar as configurações
- **E** deve aplicar nas próximas notificações

**AC 07: Validação de valores**
- **Dado** que estou configurando parâmetros
- **Quando** informo valores inválidos (ex: timeout negativo, tamanho de arquivo muito grande)
- **Então** o sistema deve exibir mensagens de erro
- **E** não deve salvar as configurações

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/admin/config/system`
- Criar endpoint `PUT /api/admin/config/system`
- Implementar validação de valores de configuração
- Implementar aplicação de configurações em tempo de execução (quando possível)
- Armazenar configurações no Neo4j ou arquivo de configuração
- Implementar serviço de configuração centralizado
- Implementar validação de limites razoáveis para cada parâmetro

**Frontend:**
- Criar componente `SystemConfigPage.tsx`
- Criar seções organizadas: Timeouts, Limites, Cache, Segurança, Notificações
- Implementar formulários para cada categoria de configuração
- Implementar validação de campos
- Implementar feedback de sucesso/erro
- Implementar preview de valores antes de salvar

**Banco de Dados:**
- Criar estrutura para armazenar configurações do sistema
- Considerar uso de arquivo de configuração para valores que requerem reinicialização

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Algumas configurações podem requerer reinicialização do sistema
- Valores devem ter limites mínimos e máximos para evitar configurações inválidas
- Configurações críticas devem ter confirmação antes de salvar

---

### US-023: Monitoramento de Saúde dos Serviços

**Como um** administrador do sistema,  
**Eu quero** visualizar o status de saúde de todos os serviços do sistema,  
**Para que** eu possa identificar problemas rapidamente e garantir disponibilidade.

#### Critérios de Aceitação

**AC 01: Dashboard de saúde dos serviços**
- **Dado** que eu sou um Administrador
- **E** estou na página de monitoramento de saúde
- **Quando** acesso a página
- **Então** devo ver status de todos os serviços (Neo4j, ElasticSearch, ChromaDB, Ollama, Minio, Redis, Postgres, AD/LDAP)
- **E** devo ver indicadores visuais (verde para online, vermelho para offline, amarelo para degradado)
- **E** devo ver última verificação de saúde

**AC 02: Detalhamento de status de serviço**
- **Dado** que estou na página de monitoramento
- **Quando** clico em um serviço
- **Então** devo ver informações detalhadas: latência, versão, uso de recursos (se disponível)
- **E** devo ver histórico de status (últimas 24 horas)
- **E** devo ver última vez que o serviço foi acessado com sucesso

**AC 03: Alertas de serviços offline**
- **Dado** que um serviço está offline
- **Quando** visualizo o dashboard de monitoramento
- **Então** devo ver alerta destacado para o serviço offline
- **E** devo ver mensagem indicando o problema
- **E** devo ver sugestões de ação (se disponível)

**AC 04: Histórico de disponibilidade**
- **Dado** que estou na página de monitoramento
- **Quando** visualizo o histórico de um serviço
- **Então** devo ver gráfico de disponibilidade (úptime) nas últimas 24 horas, 7 dias ou 30 dias
- **E** devo ver eventos de falha (se houver)

**AC 05: Teste manual de serviço**
- **Dado** que estou na página de monitoramento
- **Quando** clico em "Testar Agora" para um serviço
- **Então** o sistema deve executar teste de conexão imediato
- **E** deve atualizar o status do serviço
- **E** deve exibir resultado do teste

**AC 06: Métricas de performance**
- **Dado** que estou na página de monitoramento
- **Quando** visualizo métricas de performance
- **Então** devo ver latência média de cada serviço
- **E** devo ver taxa de erro (se disponível)
- **E** devo ver número de requisições (se disponível)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/admin/health` para status geral
- Criar endpoint `GET /api/admin/health/:serviceName` para status específico
- Criar endpoint `POST /api/admin/health/:serviceName/test` para teste manual
- Criar endpoint `GET /api/admin/health/:serviceName/history` para histórico
- Implementar health checks para cada serviço externo
- Implementar armazenamento de histórico de health checks (Neo4j ou Postgres)
- Implementar agendamento de health checks periódicos (cron job)
- Implementar cálculo de métricas (latência, uptime, taxa de erro)

**Frontend:**
- Criar componente `HealthMonitoringPage.tsx`
- Implementar dashboard com cards de status para cada serviço
- Implementar indicadores visuais (cores, ícones)
- Implementar modal de detalhamento de serviço
- Implementar gráficos de histórico (Recharts ou Chart.js)
- Implementar botão "Testar Agora" para cada serviço
- Implementar atualização automática de status (polling ou WebSocket)
- Implementar alertas visuais para serviços offline

**Banco de Dados:**
- Criar estrutura para armazenar histórico de health checks
- Criar índices para consultas eficientes por serviço e timestamp

#### Dependências e Notas
- Depende de US-002 (RBAC)
- Health checks devem ser leves para não impactar performance
- Histórico pode ser limitado a 30 dias para economizar espaço
- Alertas podem ser enviados por email (futuro)

---

### US-024: Gestão de Usuários do Sistema

**Como um** administrador do sistema,  
**Eu quero** visualizar e gerenciar usuários do sistema (ativar, desativar, visualizar permissões),  
**Para que** eu possa controlar o acesso ao sistema e resolver problemas de autenticação.

#### Critérios de Aceitação

**AC 01: Listagem de usuários**
- **Dado** que eu sou um Administrador
- **E** estou na página de gestão de usuários
- **Quando** acesso a página
- **Então** devo ver lista de todos os usuários que já fizeram login no sistema
- **E** devo ver informações: nome, email, último login, status (ativo/inativo), roles
- **E** devo ver paginação de resultados

**AC 02: Busca e filtragem de usuários**
- **Dado** que estou na página de gestão de usuários
- **Quando** busco por nome ou email
- **E** aplico filtros (status, role, departamento)
- **Então** o sistema deve filtrar a lista de usuários
- **E** deve atualizar os resultados

**AC 03: Visualização de detalhes do usuário**
- **Dado** que estou na página de gestão de usuários
- **Quando** clico em um usuário
- **Então** devo ver detalhes completos: informações do AD/LDAP, grupos AD, roles mapeados, histórico de logins, permissões
- **E** devo ver última atividade

**AC 04: Desativação de usuário**
- **Dado** que estou visualizando um usuário
- **Quando** clico em "Desativar Usuário"
- **E** confirmo a ação
- **Então** o sistema deve desativar o usuário
- **E** deve invalidar tokens JWT ativos do usuário
- **E** deve impedir novos logins do usuário
- **E** deve exibir mensagem de sucesso

**AC 05: Reativação de usuário**
- **Dado** que existe um usuário desativado
- **Quando** clico em "Reativar Usuário"
- **E** confirmo a ação
- **Então** o sistema deve reativar o usuário
- **E** deve permitir novos logins
- **E** deve exibir mensagem de sucesso

**AC 06: Visualização de histórico de logins**
- **Dado** que estou visualizando detalhes de um usuário
- **Quando** visualizo a seção de histórico de logins
- **Então** devo ver lista de logins recentes (data, hora, IP, user agent)
- **E** devo ver tentativas de login falhadas (se houver)

**AC 07: Forçar logout de usuário**
- **Dado** que estou visualizando um usuário
- **Quando** clico em "Forçar Logout"
- **E** confirmo a ação
- **Então** o sistema deve invalidar todos os tokens JWT ativos do usuário
- **E** deve exibir mensagem de sucesso
- **E** o usuário será deslogado na próxima requisição

**AC 08: Restrição de acesso**
- **Dado** que eu não sou Administrador
- **Quando** tento acessar a página de gestão de usuários
- **Então** o sistema deve retornar erro 403 (Forbidden)

#### Tarefas Técnicas Sugeridas

**Backend:**
- Criar endpoint `GET /api/admin/users` com suporte a busca, filtros e paginação
- Criar endpoint `GET /api/admin/users/:id` para detalhes
- Criar endpoint `PUT /api/admin/users/:id/status` para ativar/desativar
- Criar endpoint `POST /api/admin/users/:id/force-logout` para forçar logout
- Criar endpoint `GET /api/admin/users/:id/login-history` para histórico
- Implementar consulta ao AD/LDAP para obter informações atualizadas do usuário
- Implementar invalidação de tokens JWT (blacklist ou cache)
- Implementar armazenamento de histórico de logins (Postgres ou Neo4j)

**Frontend:**
- Criar componente `UserManagementPage.tsx`
- Implementar tabela de usuários com paginação
- Implementar busca e filtros
- Implementar modal de detalhes do usuário
- Implementar ações: ativar, desativar, forçar logout
- Implementar confirmação de ações destrutivas
- Implementar visualização de histórico de logins
- Implementar indicadores visuais de status (ativo/inativo)

**Banco de Dados:**
- Criar estrutura para armazenar informações de usuários (cache do AD/LDAP)
- Criar estrutura para histórico de logins
- Criar índices para busca eficiente

#### Dependências e Notas
- Depende de US-001 (Autenticação AD/LDAP)
- Depende de US-002 (RBAC)
- Informações de usuários podem ser consultadas do AD/LDAP em tempo real ou cacheadas
- Invalidação de tokens pode usar Redis ou banco de dados
- Histórico de logins pode ser limitado a 90 dias

---

## Notas Finais

### Priorização Sugerida

**Sprint 1 (Fundação):**
- US-001: Autenticação via AD/LDAP
- US-002: Controle de Acesso Baseado em Papéis (RBAC)
- US-011: Dashboard Principal

**Sprint 2 (Gerenciamento Básico):**
- US-003: Visualizar Perfil de Colaborador
- US-004: Editar Dados Pessoais
- US-006: Visualizar Perfil de Projeto
- US-007: Criar e Editar Projeto

**Sprint 3 (Busca):**
- US-008: Busca Global
- US-009: Filtragem de Resultados
- Sistema de indexação assíncrona (Outbox Pattern)

**Sprint 4 (Documentos e Sumários):**
- US-012: Upload e Registro de Documentos
- US-013: Geração e Gerenciamento de Sumários
- US-010: Busca Semântica

**Sprint 5+ (Análises e Auditoria):**
- US-014: Análise de Lacunas
- US-015: Relatório de Expertise
- US-016: Registro de Logs de Auditoria
- US-017: Visualização de Logs de Auditoria

**Sprint 6+ (Configurações e Integrações):**
- US-018: Configuração de Integração AD/LDAP
- US-019: Gerenciamento de Mapeamento de Grupos AD para Roles
- US-020: Configuração de Serviços Externos
- US-023: Monitoramento de Saúde dos Serviços
- US-021: Gestão de Schema do Grafo
- US-022: Configurações Gerais do Sistema
- US-024: Gestão de Usuários do Sistema

### Observações Importantes

1. **Sistema de Indexação Assíncrona**: Múltiplas User Stories dependem do sistema de indexação (Outbox Pattern inicialmente). Esta deve ser implementada cedo.

2. **Configuração de Infraestrutura**: Várias User Stories requerem serviços externos configurados (Neo4j, ElasticSearch, ChromaDB, Ollama, Minio, Redis, Postgres). Estes devem ser configurados antes do desenvolvimento.

3. **Dados de Teste**: Para desenvolvimento e testes, é necessário ter dados populados no Neo4j representando a estrutura real do sistema.

4. **Segurança**: Todas as User Stories devem considerar requisitos de segurança (HTTPS, validação de entrada, RBAC).

5. **Performance**: Considerar cache (Redis) e otimizações de consultas desde o início.


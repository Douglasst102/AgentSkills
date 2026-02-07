---
name: codebase-documenter
description: Skill para documentação de codebases, incluindo READMEs, documentação de arquitetura, comentários em código e documentação de APIs. Use quando precisar documentar código, criar guias de início rápido, explicar estrutura de projetos ou tornar codebases mais acessíveis para novos desenvolvedores.
---

# Codebase Documenter

Skill para criação de documentação completa e amigável para iniciantes em codebases. Fornece templates estruturados e melhores práticas para escrever READMEs, guias de arquitetura, comentários em código e documentação de APIs que ajudam novos usuários a entender e contribuir rapidamente para projetos.

## Princípios Fundamentais para Documentação Amigável

Ao documentar código para novos usuários, siga estes princípios fundamentais:

1. **Começar com o "Por quê"** - Explicar o propósito antes de mergulhar nos detalhes de implementação
2. **Usar Disclosure Progressivo** - Apresentar informação em camadas do simples ao complexo
3. **Fornecer Contexto** - Explicar não só o que o código faz, mas por que existe
4. **Incluir Exemplos** - Mostrar exemplos concretos de uso para cada conceito
5. **Assumir Sem Conhecimento Prévio** - Definir termos e evitar jargão quando possível
6. **Auxílios Visuais** - Usar diagramas, fluxogramas e estruturas de arquivos
7. **Quick Wins** - Ajudar usuários a ter algo funcionando em menos de 5 minutos

## Tipos de Documentação e Quando Usar

### 1. Documentação README

**Quando criar:** Para diretórios raiz de projetos, módulos de funcionalidades principais ou componentes autônomos.

**Estrutura a seguir:**
```markdown
# Nome do Projeto

## O Que Isso Faz
[Explicação de 1-2 frases em linguagem simples]

## Início Rápido
[Fazer usuários rodarem o projeto em < 5 minutos]

## Estrutura do Projeto
[Árvore de arquivos visual com explicações]

## Conceitos-Chave
[Conceitos principais que usuários precisam entender]

## Tarefas Comuns
[Guias passo a passo para operações frequentes]

## Solução de Problemas
[Problemas comuns e soluções]
```

**Melhores práticas:**
- Liderar com a proposta de valor do projeto
- Incluir instruções de setup que realmente funcionam (teste-as!)
- Fornecer uma visão geral visual da estrutura do projeto
- Linkar para documentação mais profunda para tópicos avançados
- Manter o README raiz focado em começar

### 2. Documentação de Arquitetura

**Quando criar:** Para projetos com múltiplos módulos, fluxos de dados complexos ou decisões de design não óbvias.

**Estrutura a seguir:**
```markdown
# Visão Geral da Arquitetura

## Design do Sistema
[Diagrama de alto nível e explicação]

## Estrutura de Diretórios
[Breakdown detalhado com propósito de cada diretório]

## Fluxo de Dados
[Como os dados se movem pelo sistema]

## Decisões de Design-Chave
[Por que certas escolhas arquiteturais foram feitas]

## Dependências de Módulos
[Como diferentes partes interagem]

## Pontos de Extensão
[Onde e como adicionar novas funcionalidades]
```

**Melhores práticas:**
- Usar diagramas para mostrar componentes do sistema e relacionamentos
- Explicar o "por quê" por trás das decisões arquiteturais
- Documentar tanto o caminho feliz quanto o tratamento de erros
- Identificar limites entre módulos
- Incluir estruturas de árvore de arquivos visuais com anotações

### 3. Comentários em Código

**Quando criar:** Para lógica complexa, algoritmos não óbvios ou código que requer contexto.

**Padrões de anotação:**

**Documentação de Função/Método:**
```javascript
/**
 * Calcula o custo proporcional de assinatura para um período parcial de cobrança.
 *
 * Por que isso existe: Usuários podem se inscrever no meio do mês, então precisamos
 * cobrá-los apenas pelos dias restantes no ciclo de cobrança atual.
 *
 * @param {number} precoCompleto - O preço mensal normal da assinatura
 * @param {Date} dataInicio - Quando a assinatura do usuário começa
 * @param {Date} fimPeriodo - Fim do período de cobrança atual
 * @returns {number} O valor proporcional a ser cobrado
 *
 * @example
 * // Usuário se inscreve em 15 de jan, período termina em 31 de jan
 * calcularCustoProporcional(30, new Date('2024-01-15'), new Date('2024-01-31'))
 * // Retorna: 16.13 (17 dias de 31 dias)
 */
```

**Documentação de Lógica Complexa:**
```python
# Por que esta verificação existe: A API retorna null para usuários deletados,
# mas string vazia para usuários que nunca definiram um nome. Precisamos
# distinguir entre esses casos para o log de auditoria.
if user_name is None:
    # Usuário foi deletado - registrar isso como evento de segurança
    log_deletion_event(user_id)
elif user_name == "":
    # Usuário nunca completou onboarding - seguro para pular
    continue
```

**Melhores práticas:**
- Explicar "por quê" não "o quê" - o código mostra o que faz
- Documentar casos extremos e lógica de negócio
- Adicionar exemplos para funções complexas
- Explicar parâmetros que não são auto-explicativos
- Notar qualquer pegadinha ou comportamento contra-intuitivo

### 4. Documentação de API

**Quando criar:** Para qualquer endpoint HTTP, métodos de SDK ou interfaces públicas.

**Estrutura a seguir:**

```markdown
## Nome do Endpoint

### O Que Faz
[Explicação em linguagem simples do propósito do endpoint]

### Endpoint
`POST /api/v1/resource`

### Autenticação
[Que autenticação é necessária e como fornecê-la]

### Formato de Requisição
[Schema JSON ou exemplo de requisição]

### Formato de Resposta
[Schema JSON ou exemplo de resposta]

### Exemplo de Uso
[Exemplo concreto com curl/código]

### Erros Comuns
[Códigos de erro e o que significam]

### Endpoints Relacionados
[Links para operações relacionadas]
```

**Melhores práticas:**
- Fornecer exemplos de curl funcionais
- Mostrar tanto respostas de sucesso quanto de erro
- Explicar autenticação claramente
- Documentar limites de taxa e restrições
- Incluir solução de problemas para questões comuns

## Workflow de Documentação

### Passo 1: Analisar o Codebase

Antes de escrever documentação:

1. **Identificar pontos de entrada** - Arquivos principais, arquivos index, inicialização da aplicação
2. **Mapear dependências** - Como módulos se relacionam entre si
3. **Encontrar conceitos centrais** - Abstrações-chave que usuários precisam entender
4. **Localizar configuração** - Setup de ambiente, arquivos de configuração
5. **Revisar documentação existente** - Construir sobre o que existe, não duplicar

### Passo 2: Escolher Tipo de Documentação

Baseado na solicitação do usuário e análise do codebase:

- **Novo projeto ou README faltando** → Começar com documentação README
- **Arquitetura complexa ou múltiplos módulos** → Criar documentação de arquitetura
- **Seções de código confusas** → Adicionar comentários inline em código
- **Endpoints HTTP/API** → Escrever documentação de API
- **Múltiplos tipos necessários** → Abordar na ordem: README → Arquitetura → API → Comentários

### Passo 3: Gerar Documentação

Use os templates de `assets/templates/` como pontos de partida:

- `assets/templates/README.template.md` - Para READMEs de projeto
- `assets/templates/ARCHITECTURE.template.md` - Para documentação de arquitetura
- `assets/templates/API.template.md` - Para documentação de API

Personalize templates baseado no codebase específico:

1. **Preencher informações específicas do projeto** - Substituir placeholders com conteúdo real
2. **Adicionar exemplos concretos** - Usar código real do projeto
3. **Incluir auxílios visuais** - Criar árvores de arquivos, diagramas, fluxogramas
4. **Testar instruções** - Verificar que passos de setup realmente funcionam
5. **Linkar documentação relacionada** - Conectar peças de documentação

### Passo 4: Revisar para Clareza

Antes de finalizar documentação:

1. **Ler como iniciante** - Faz sentido sem contexto do projeto?
2. **Verificar completude** - Há lacunas na explicação?
3. **Verificar exemplos** - Exemplos de código realmente funcionam?
4. **Testar instruções** - Alguém pode seguir os passos de setup?
5. **Melhorar estrutura** - A informação é fácil de encontrar?

## Templates de Documentação

Esta skill inclui vários templates em `assets/templates/` que fornecem estruturas de partida:

### Templates Disponíveis

- **README.template.md** - Estrutura abrangente de README com seções para início rápido, estrutura do projeto e tarefas comuns
- **ARCHITECTURE.template.md** - Template de documentação de arquitetura com design do sistema, fluxo de dados e decisões de design
- **API.template.md** - Documentação de endpoint de API com formatos de requisição/resposta e exemplos
- **CODE_COMMENTS.template.md** - Exemplos e padrões para documentação inline efetiva

### Usando Templates

1. **Ler o template apropriado** de `assets/templates/`
2. **Personalizar para o projeto específico** - Substituir placeholders com informações reais
3. **Adicionar seções específicas do projeto** - Estender o template conforme necessário
4. **Incluir exemplos reais** - Usar código real do codebase
5. **Remover seções irrelevantes** - Deletar partes que não se aplicam

## Referência de Melhores Práticas

Para práticas detalhadas de documentação, diretrizes de estilo e padrões avançados, consulte:

- `references/documentation-standards.md` - Padrões fundamentais de documentação
- `references/documentation_guidelines.md` - Guia de estilo abrangente e melhores práticas
- `references/visual_aids_guide.md` - Como criar diagramas e árvores de arquivos efetivos

Carregue essas referências quando:
- Criando documentação para codebases empresariais complexos
- Lidando com requisitos de múltiplos stakeholders
- Precisando de padrões avançados de documentação
- Padronizando documentação em um projeto grande

## Padrões Comuns

### Criando Estruturas de Árvore de Arquivos

Árvores de arquivos ajudam novos usuários a entender organização do projeto:

```
project-root/
├── src/                    # Código fonte
│   ├── components/        # Componentes UI reutilizáveis
│   ├── pages/             # Componentes de nível de página (roteamento)
│   ├── services/          # Lógica de negócio e chamadas de API
│   ├── utils/             # Funções auxiliares
│   └── types/             # Definições de tipos TypeScript
├── public/                # Assets estáticos (imagens, fontes)
├── tests/                 # Arquivos de teste espelhando estrutura src
└── package.json           # Dependências e scripts
```

### Explicando Fluxos de Dados Complexos

Use passos numerados com diagramas:

```
Fluxo de Requisição do Usuário:
1. Usuário submete formulário → 2. Validação → 3. Chamada de API → 4. Banco de Dados → 5. Resposta

[1] components/UserForm.tsx
    ↓ valida entrada
[2] services/validation.ts
    ↓ envia para API
[3] services/api.ts
    ↓ consulta banco de dados
[4] Banco de Dados (PostgreSQL)
    ↓ retorna dados
[5] components/UserForm.tsx (atualiza UI)
```

### Documentando Decisões de Design

Capture o "por quê" por trás de escolhas arquiteturais:

```markdown
## Por Que Usamos Redux

**Decisão:** Gerenciamento de estado com Redux ao invés de Context API

**Contexto:** Nossa aplicação tem 50+ componentes que precisam de acesso ao estado
de autenticação do usuário, carrinho de compras e preferências de UI.

**Raciocínio:**
- Context API causa re-renderizações desnecessárias com tantos componentes
- Redux DevTools ajuda a debugar mudanças de estado complexas
- Equipe tem expertise existente em Redux

**Trade-offs:**
- Mais código boilerplate
- Curva de aprendizado mais íngreme para novos desenvolvedores
- Vale a pena para: performance, debugging, familiaridade da equipe
```

## Diretrizes de Saída

Ao gerar documentação:

1. **Escrever para o público-alvo** - Ajustar complexidade baseado se documentação é para iniciantes, intermediários ou usuários avançados
2. **Usar formatação consistente** - Seguir convenções markdown, hierarquia de cabeçalhos consistente
3. **Fornecer exemplos funcionais** - Testar todos os snippets de código e comandos
4. **Linkar entre documentos** - Criar uma estrutura de navegação de documentação
5. **Manter manutenível** - Documentação deve ser fácil de atualizar conforme código muda
6. **Adicionar datas e versões** - Notar quando documentação foi atualizada pela última vez

## Integração com Agentes de Desenvolvimento

Esta skill é automaticamente chamada pelos seguintes agentes após conclusão de tarefas:

- **frontend-developer** - Documenta componentes, hooks, serviços frontend
- **backend-developer** - Documenta APIs, serviços, modelos backend
- **uiux-designer** - Documenta design system e especificações de design
- **devops-engineer** - Documenta infraestrutura, Docker, CI/CD
- **security-engineer** - Documenta políticas de segurança e correções

### Diretórios de Saída por Tipo

Documentos gerados devem ser salvos em:

- **Frontend:** `outputs/artifacts/frontend/documentation/`
- **Backend:** `outputs/artifacts/backend/documentation/`
- **Infrastructure:** `outputs/artifacts/infrastructure/documentation/`
- **Design:** `outputs/artifacts/design/` (sem subdiretório, pois design já é documentação)
- **Security:** `outputs/artifacts/security/` (sem subdiretório, pois security já é documentação)

### Padrões de Documentação por Contexto

**Frontend:**
- DocStrings em componentes React/Vue/Angular
- README.md explicando estrutura de componentes
- Guias de uso de componentes reutilizáveis
- Documentação de hooks e utilitários

**Backend:**
- DocStrings em APIs, services e models
- API.md documentando endpoints
- README.md explicando estrutura do backend
- Guias de configuração e deploy

**Infrastructure:**
- Documentação de Dockerfiles e docker-compose
- README.md explicando setup e uso
- Guias de configuração de ambientes
- Documentação de pipelines CI/CD

**Design:**
- Documentação de design system
- Guias de uso de componentes de design
- Especificações de padrões de UI/UX

**Security:**
- Documentação de políticas de segurança
- Guias de implementação de controles de segurança
- Documentação de vulnerabilidades e correções

## Diretrizes de Documentação em Código

Seguir as diretrizes de documentação (consulte `references/documentation-standards.md`):

- Sempre que criar uma função, classe ou componente, documente-o utilizando DocString
- Explique sucintamente o que ela faz, seus argumentos e o retorno da função
- Documente também no arquivo pertinente (Como API, DataBase, Frontend, Backend, etc.) em seus respectivos diretórios

## Referência Rápida

**Comando para gerar README:**
"Crie um arquivo README para este projeto que ajude novos desenvolvedores a começar"

**Comando para documentar arquitetura:**
"Documente a arquitetura deste codebase, explicando como os diferentes módulos interagem"

**Comando para adicionar comentários em código:**
"Adicione comentários explicativos a este arquivo que ajudem novos desenvolvedores a entender a lógica"

**Comando para documentar API:**
"Crie documentação de API para todos os endpoints neste arquivo"

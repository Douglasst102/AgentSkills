# Guia de Sintaxe Gherkin

Gherkin é uma linguagem estruturada usada para descrever comportamento de software de forma legível tanto para humanos quanto para máquinas. É amplamente usada em BDD (Behavior-Driven Development) e para escrever critérios de aceitação de User Stories.

## Estrutura Básica

Gherkin usa palavras-chave em português para estruturar cenários:

```
**Dado** [condição inicial]
**Quando** [ação]
**Então** [resultado esperado]
```

## Palavras-Chave Principais

### Dado (Given)
Estabelece o contexto inicial do cenário. Descreve o estado do sistema antes da ação.

```
**Dado** que eu sou um usuário cadastrado
**Dado** que estou na página de login
**Dado** que o produto está em estoque
```

### Quando (When)
Descreve a ação que o usuário realiza ou o evento que ocorre.

```
**Quando** eu preencho meu e-mail e senha
**Quando** eu clico no botão "Entrar"
**Quando** eu adiciono o produto ao carrinho
```

### Então (Then)
Descreve o resultado esperado após a ação.

```
**Então** o sistema deve me autenticar
**Então** devo ser redirecionado para o dashboard
**Então** o produto deve aparecer no carrinho
```

### E (And)
Usado para adicionar condições, ações ou resultados adicionais na mesma linha.

```
**Dado** que eu sou um usuário cadastrado
**E** estou na página de login
**E** tenho credenciais válidas
**Quando** eu preencho meu e-mail e senha
**E** clico no botão "Entrar"
**Então** o sistema deve me autenticar
**E** deve gerar um token JWT
**E** deve me redirecionar para o dashboard
```

### Mas (But)
Usado para expressar exceções ou negações.

```
**Dado** que eu sou um usuário cadastrado
**Mas** não tenho permissão de administrador
**Quando** eu tento acessar a área administrativa
**Então** devo ver uma mensagem de acesso negado
**Mas** não devo ser redirecionado
```

## Estrutura de Cenários

### Cenário Simples

```
**AC 01: Login bem-sucedido**
- **Dado** que eu sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho meu e-mail e senha corretos
- **E** clico no botão "Entrar"
- **Então** o sistema deve me autenticar
- **E** deve me redirecionar para o dashboard principal
```

### Cenário com Múltiplos Resultados

```
**AC 02: Criação de perfil completa**
- **Dado** que eu sou um novo usuário
- **E** estou na página de cadastro
- **Quando** eu preencho todos os campos obrigatórios
- **E** clico no botão "Criar Conta"
- **Então** minha conta deve ser criada
- **E** devo receber um e-mail de confirmação
- **E** devo ser redirecionado para a página de boas-vindas
```

### Cenário de Erro

```
**AC 03: Falha de login com credenciais inválidas**
- **Dado** que eu sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho meu e-mail correto
- **E** preencho uma senha incorreta
- **E** clico no botão "Entrar"
- **Então** o sistema deve exibir a mensagem "Credenciais inválidas"
- **E** não deve me autenticar
- **E** não deve redirecionar
- **E** os campos devem permanecer preenchidos (exceto a senha)
```

### Cenário com Validação

```
**AC 04: Validação de campos obrigatórios**
- **Dado** que estou na página de cadastro
- **Quando** eu deixo o campo "Nome" vazio
- **E** preencho os demais campos
- **E** clico no botão "Criar Conta"
- **Então** o sistema deve exibir a mensagem "Nome é obrigatório"
- **E** o campo "Nome" deve ser destacado em vermelho
- **E** o formulário não deve ser enviado
```

## Boas Práticas

### 1. Seja Específico

❌ **Evite:**
```
**Dado** que o sistema está funcionando
**Quando** eu faço algo
**Então** algo deve acontecer
```

✅ **Prefira:**
```
**Dado** que eu sou um usuário autenticado
**E** estou na página de produtos
**Quando** eu clico no botão "Adicionar ao Carrinho" do produto "Notebook Dell"
**Então** o produto "Notebook Dell" deve aparecer no carrinho
**E** o contador de itens no carrinho deve aumentar para 1
```

### 2. Foque no Comportamento, Não na Implementação

❌ **Evite:**
```
**Quando** o sistema chama a função `validateUser()`
**Então** a variável `isValid` deve ser `true`
```

✅ **Prefira:**
```
**Quando** eu preencho credenciais válidas
**Então** o sistema deve me autenticar
```

### 3. Use Linguagem de Negócio

❌ **Evite:**
```
**Dado** que o objeto User existe no banco de dados
**Quando** o endpoint `/api/users` é chamado
```

✅ **Prefira:**
```
**Dado** que eu sou um usuário cadastrado
**Quando** eu acesso minha página de perfil
```

### 4. Um Cenário, Um Comportamento

Cada critério de aceitação deve testar um comportamento específico. Se você precisa testar múltiplos comportamentos, crie múltiplos critérios.

### 5. Inclua Casos de Erro e Borda

Não se limite ao "caminho feliz". Inclua:
- Validações de campos
- Tratamento de erros
- Casos de borda (valores limites, listas vazias, etc.)
- Comportamento em estados inválidos

## Exemplos por Tipo de Funcionalidade

### Autenticação

```
**AC 01: Login bem-sucedido**
- **Dado** que eu sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho meu e-mail e senha corretos
- **E** clico no botão "Entrar"
- **Então** o sistema deve me autenticar
- **E** deve gerar um token JWT válido
- **E** deve me redirecionar para o dashboard principal

**AC 02: Falha de login com senha incorreta**
- **Dado** que eu sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho meu e-mail correto
- **E** preencho uma senha incorreta
- **E** clico no botão "Entrar"
- **Então** o sistema deve exibir a mensagem "Credenciais inválidas"
- **E** não deve me autenticar
- **E** não deve redirecionar

**AC 03: Expiração de sessão**
- **Dado** que eu estou autenticado
- **E** minha sessão expira (após 1 hora de inatividade)
- **Quando** eu faço uma requisição ao sistema
- **Então** o sistema deve invalidar meu token
- **E** deve me redirecionar para a página de login
- **E** deve exibir a mensagem "Sua sessão expirou"
```

### Formulários

```
**AC 01: Preenchimento válido de formulário**
- **Dado** que estou na página de cadastro
- **Quando** eu preencho todos os campos obrigatórios com dados válidos
- **E** clico no botão "Salvar"
- **Então** o sistema deve salvar os dados
- **E** deve exibir mensagem de sucesso "Cadastro realizado com sucesso"
- **E** deve me redirecionar para a página de confirmação

**AC 02: Validação de campo obrigatório**
- **Dado** que estou na página de cadastro
- **Quando** eu deixo o campo "E-mail" vazio
- **E** preencho os demais campos
- **E** clico no botão "Salvar"
- **Então** o sistema deve exibir a mensagem "E-mail é obrigatório"
- **E** o campo "E-mail" deve ser destacado em vermelho
- **E** o formulário não deve ser enviado

**AC 03: Validação de formato de e-mail**
- **Dado** que estou na página de cadastro
- **Quando** eu preencho o campo "E-mail" com valor "email-invalido"
- **E** clico no botão "Salvar"
- **Então** o sistema deve exibir a mensagem "E-mail deve ter um formato válido"
- **E** o campo "E-mail" deve ser destacado em vermelho
```

### Busca e Filtros

```
**AC 01: Busca com resultados encontrados**
- **Dado** que existem produtos cadastrados no sistema
- **E** estou na página de busca
- **Quando** eu digito "notebook" no campo de busca
- **E** clico no botão "Buscar"
- **Então** o sistema deve exibir uma lista de produtos que contenham "notebook"
- **E** deve mostrar o número total de resultados encontrados

**AC 02: Busca sem resultados**
- **Dado** que estou na página de busca
- **Quando** eu digito "produto-inexistente" no campo de busca
- **E** clico no botão "Buscar"
- **Então** o sistema deve exibir a mensagem "Nenhum resultado encontrado"
- **E** deve sugerir verificar a ortografia ou tentar outros termos

**AC 03: Filtro por categoria**
- **Dado** que estou na página de produtos
- **E** existem produtos de diferentes categorias
- **Quando** eu seleciono o filtro "Eletrônicos"
- **Então** o sistema deve exibir apenas produtos da categoria "Eletrônicos"
- **E** deve atualizar o contador de resultados
```

## Checklist para Critérios de Aceitação

Antes de considerar um critério de aceitação completo, verifique:

- [ ] Está escrito em linguagem de negócio, não técnica
- [ ] Usa as palavras-chave Gherkin corretamente (Dado, Quando, Então, E, Mas)
- [ ] É específico e testável
- [ ] Descreve o comportamento esperado claramente
- [ ] Inclui verificações de resultado (mensagens, redirecionamentos, etc.)
- [ ] Considera casos de erro e validação
- [ ] Pode ser implementado e testado independentemente

## Recursos Adicionais

- [Cucumber - Documentação Gherkin](https://cucumber.io/docs/gherkin/)
- [BDD - Behavior-Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development)
- [Specification by Example](https://www.agilealliance.org/glossary/specification-by-example/)

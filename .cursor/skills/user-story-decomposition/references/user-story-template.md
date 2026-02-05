# Template de User Story

Este template fornece a estrutura completa para criação de User Stories "Ready for Dev".

## Estrutura Completa

```markdown
### US-XXX: [Título Descritivo e Conciso]

**Como um** [Persona de Usuário],
**Eu quero** [Realizar uma ação específica],
**Para que** [Eu possa obter um benefício/valor claro].

#### Critérios de Aceitação

**AC 01: [Nome do cenário - caminho feliz]**
- **Dado** que [condição inicial do cenário]
- **E** [condição adicional necessária]
- **Quando** [ação que o usuário realiza]
- **E** [ação adicional ou confirmação]
- **Então** [resultado esperado do sistema]
- **E** [resultado adicional ou verificação]

**AC 02: [Nome do cenário - caso de erro]**
- **Dado** que [condição inicial]
- **Quando** [ação que causa erro]
- **Então** [mensagem de erro ou comportamento esperado]
- **E** [verificação adicional]

**AC 03: [Nome do cenário - caso de borda]**
- **Dado** que [condição de borda]
- **Quando** [ação]
- **Então** [comportamento esperado em caso de borda]

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] Criar endpoint `[MÉTODO] /api/[recurso]`
- [ ] Implementar lógica de [funcionalidade]
- [ ] Adicionar validações de [tipo]
- [ ] Implementar tratamento de erros
- [ ] Adicionar logs e auditoria

**Frontend:**
- [ ] Criar componente [nome do componente]
- [ ] Implementar formulário com campos [lista]
- [ ] Adicionar validações de formulário
- [ ] Implementar chamada à API
- [ ] Gerenciar estado e feedback ao usuário
- [ ] Adicionar tratamento de erros na UI

**Banco de Dados:**
- [ ] Verificar estrutura da tabela [nome]
- [ ] Criar migração se necessário
- [ ] Adicionar índices para [campos]
- [ ] Definir constraints e validações

**Testes:**
- [ ] Criar testes unitários para [componente]
- [ ] Criar testes de integração para [fluxo]
- [ ] Criar testes E2E para [cenário]

#### Dependências e Notas

- **Depende de:** US-XXX: [Nome da história dependente]
- **Observações técnicas:** [Notas importantes]
- **Referências:** [Links para documentos de arquitetura ou requisitos]
```

## Exemplo Completo

```markdown
### US-001: Autenticação de usuário por e-mail e senha

**Como um** colaborador do sistema,
**Eu quero** fazer login usando meu e-mail e senha,
**Para que** eu possa acessar o sistema de forma segura.

#### Critérios de Aceitação

**AC 01: Login bem-sucedido com credenciais válidas**
- **Dado** que eu sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho meu e-mail e senha corretos
- **E** clico no botão "Entrar"
- **Então** o sistema deve me autenticar
- **E** deve gerar um token JWT
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

**AC 03: Falha de login com e-mail não cadastrado**
- **Dado** que eu não sou um usuário cadastrado
- **E** estou na página de login
- **Quando** eu preencho um e-mail não cadastrado
- **E** preencho qualquer senha
- **E** clico no botão "Entrar"
- **Então** o sistema deve exibir a mensagem "Credenciais inválidas"
- **E** não deve me autenticar

**AC 04: Validação de campos obrigatórios**
- **Dado** que estou na página de login
- **Quando** eu deixo o campo e-mail vazio
- **E** clico no botão "Entrar"
- **Então** o sistema deve exibir mensagem de validação "E-mail é obrigatório"
- **E** não deve enviar a requisição

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] Criar endpoint `POST /api/auth/login`
- [ ] Implementar validação de credenciais
- [ ] Integrar com serviço de autenticação
- [ ] Gerar e retornar token JWT em caso de sucesso
- [ ] Implementar tratamento de erros (credenciais inválidas, usuário não encontrado)
- [ ] Adicionar logs de tentativas de login

**Frontend:**
- [ ] Criar componente da página de login
- [ ] Adicionar campos de e-mail e senha
- [ ] Implementar validações de formulário (e-mail válido, campos obrigatórios)
- [ ] Implementar chamada à API no envio do formulário
- [ ] Gerenciar token JWT recebido (armazenar no localStorage/sessionStorage)
- [ ] Implementar redirecionamento após login bem-sucedido
- [ ] Exibir mensagens de erro apropriadas
- [ ] Adicionar indicador de carregamento durante autenticação

**Banco de Dados:**
- [ ] Verificar se a estrutura da tabela `users` possui campos `email` e `password_hash`
- [ ] Verificar se existe índice no campo `email` para busca rápida
- [ ] Verificar se a senha está armazenada de forma segura (hash)

**Testes:**
- [ ] Criar testes unitários para função de validação de credenciais
- [ ] Criar testes de integração para endpoint de login
- [ ] Criar testes E2E para fluxo completo de login
- [ ] Criar testes para casos de erro (senha incorreta, usuário não encontrado)

#### Dependências e Notas

- **Depende de:** Nenhuma (história independente)
- **Observações técnicas:** 
  - O token JWT deve ter expiração de 1 hora
  - A senha deve ser validada usando bcrypt ou similar
  - Considerar implementar rate limiting para prevenir ataques de força bruta
- **Referências:** 
  - Arquitetura: `architecture-document.md` - Seção de Autenticação
  - Requisito: `functional-requirements.md` - RF-001
```

## Dicas para Uso do Template

1. **Título**: Seja específico e descritivo. Evite títulos genéricos como "Sistema de Login".

2. **Persona**: Use as personas identificadas no projeto. Se não houver, defina claramente o tipo de usuário.

3. **Critérios de Aceitação**: 
   - Comece sempre com o "caminho feliz"
   - Inclua pelo menos um caso de erro
   - Considere casos de borda e validações
   - Use linguagem clara e específica

4. **Tarefas Técnicas**: 
   - Seja específico sobre o que precisa ser feito
   - Organize por área para facilitar o planejamento
   - Inclua tarefas de teste
   - Considere tarefas de documentação se necessário

5. **Dependências**: 
   - Seja explícito sobre dependências
   - Documente a ordem de implementação se relevante

6. **Validação INVEST**: 
   - Verifique se a história atende todos os critérios INVEST antes de considerar "Ready for Dev"

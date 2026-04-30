---
name: security-audit
description: Analisa segurança, identifica vulnerabilidades, e gera relatórios de segurança. Use quando precisar revisar segurança, analisar vulnerabilidades, ou implementar práticas de segurança.
---

# Security Audit

Skill para análise completa de segurança e identificação de vulnerabilidades. Você é um Especialista em Segurança de Aplicações (AppSec) focado em revisar e identificar vulnerabilidades nos mecanismos de segurança, controle de acesso e processos de autenticação/login de um sistema.

## Quando Usar

- Análise de segurança de código
- Identificação de vulnerabilidades
- Análise de dependências
- Revisão de autenticação
- Geração de relatórios de segurança

## Práticas obrigatórias de plataforma (segurança da aplicação)

Ao auditar ou orientar implementação, **exija conformidade** com:

- **Segredos:** é proibido hardcodar usuários, senhas, configurações sensíveis ou endpoints privados no código; uso de `.env` local (ignorado pelo `.gitignore`) e secrets em CI/produção
- **Credenciais de usuário:** quando houver login com senha, persistência em **tabela dedicada** no banco; armazenar **apenas hash de senha** (uso de algoritmo adequado para senhas com salt, ex.: bcrypt, Argon2 — não senha em claro nem esquema frágil)
- **Comunicação frontend ↔ backend:** HTTP/REST com autenticação via **JWT** (ou stack equivalente documentada); validar emissão, validação, armazenamento seguro no cliente e expiração
- **Modelagem:** qualquer fluxo de auth deve ter **dados de suporte documentados** — usuários, sessões/refresh se existirem, revogação, políticas de expiração de token — alinhados a `data/` e `technical/`

### 1. Análise de Arquitetura e Código

- Ao receber descrições arquitetônicas, trechos de código ou configurações, analise-os minuciosamente
- Identifique padrões inseguros de codificação
- Identifique falhas na lógica de autenticação e autorização
- Identifique uso inadequado de bibliotecas ou configurações que possam introduzir vulnerabilidades
- Procure por SQL injection
- Verifique XSS (Cross-Site Scripting)
- Analise CSRF protection
- Verifique validação de entrada
- Analise tratamento de erros (information disclosure)

2. **Análise de Dependências**
   - Execute npm audit (Node.js)
   - Execute pip-audit (Python)
   - Execute dependabot (GitHub)
   - Verifique versões de dependências
   - Identifique dependências desatualizadas

### 3. Revisão de Autenticação e Autorização

**Avaliação de Protocolos de Autenticação:**
- Avalie a implementação de protocolos de autenticação (conforme stack do projeto: JWT, OAuth 2.0, OpenID Connect, etc.)
- Verifique robustez, gerenciamento de tokens e prevenção de ataques de sessão
- Analise password hashing (hashing com salting adequado)
- Analise session management
- Verifique rate limiting

**Avaliação de Mecanismos de Autorização:**
- Examine os mecanismos de autorização (conforme stack do projeto: RBAC, ABAC, etc.)
- Garanta que o controle de acesso seja granular e à prova de falhas
- Prevenha escalação de privilégios
- Verifique controle de acesso (RBAC, ABAC conforme stack do projeto)

### 4. Segurança de Dados e Infraestrutura

**Análise de Infraestrutura:**
- Analise as configurações de segurança da infraestrutura do projeto (adaptar às tecnologias reais utilizadas, não fixar exemplos)
- Com atenção especial à:
  - Controle de acesso (ACLs, permissões de usuários, restrições de rede)
  - Criptografia de dados (em trânsito e em repouso)
  - Gerenciamento e rotação de credenciais
  - Configurações de hardening para cada serviço

**Dados Sensíveis:**
- Verifique se secrets, URLs internas ou credenciais estão hardcoded (incluindo fallbacks em código)
- Confirme `.gitignore` cobrindo `.env*` e ausência de commits acidentais
- Analise uso de variáveis de ambiente
- Verifique criptografia de dados sensíveis
- Analise logging de informações sensíveis

### 5. Criptografia

- Verifique o uso correto de primitivas criptográficas em áreas sensíveis
- Verifique armazenamento de senhas (hashing com salting adequado)
- Verifique transmissão de dados
- Verifique proteção de chaves

### 6. Identificação de Vulnerabilidades Comuns (OWASP Top 10)

- Procure ativamente por vulnerabilidades como:
  - Injeção (SQL Injection, Command Injection)
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Controle de Acesso Quebrado
  - Desserialização Insegura
  - Manuseio Inseguro de Segredos
  - Configuração Incorreta de Segurança
- Concentre-se em como essas vulnerabilidades podem impactar os processos de login e acesso
- Verifique cada item do OWASP Top 10
- Documente vulnerabilidades encontradas
- Priorize por severidade

### 7. Formato de Resposta para Vulnerabilidades

Para cada vulnerabilidade ou ponto de melhoria identificado, você deve fornecer:

- **Descrição da Vulnerabilidade:** Explicação clara do problema
- **Componente Afetado:** Indicar qual parte da stack ou funcionalidade é impactada (conforme stack do projeto)
- **Potencial Impacto:** Descrever as consequências de uma exploração bem-sucedida (e.g., acesso não autorizado, vazamento de dados, negação de serviço)
- **Severidade:** Classifique a vulnerabilidade como Alta, Média ou Baixa, baseando-se no risco e no impacto
- **Recomendações de Mitigação:** Sugestões claras e acionáveis para corrigir o problema, preferencialmente com exemplos de boas práticas ou links para documentação relevante (se aplicável e sem acesso externo)

### 8. Relatório de Segurança

- Liste todas as vulnerabilidades usando o formato estruturado acima
- Classifique por severidade (Alta, Média, Baixa)
- Documente correções recomendadas
- Inclua referências e exemplos
- Gere relatório em Markdown no diretório `Docs/` (se disponível) ou `security/`

**Seu tom deve ser técnico, objetivo e detalhado, com o propósito de fornecer insights de segurança acionáveis para as equipes de desenvolvimento.**

## Outputs

Salve os seguintes arquivos em `security/`:
- `security-report.md` - Relatório completo
- `vulnerabilities.md` - Lista de vulnerabilidades
- `fixes.md` - Correções recomendadas
- `security-policies.md` - Políticas de segurança
- `audit-results/` - Resultados de scans

## Referências

Consulte `references/owasp-top10.md` para guia OWASP Top 10.

---
name: Integração de Prompts em Agents e Skills
overview: Integrar o conteúdo dos prompts de desenvolvimento (prompt_Dev.md, pos-dev.md) e segurança (sec_Rev.md, Dev_Sec.md) nos agents e skills correspondentes, enriquecendo-os com os processos, instruções e formatos de trabalho já validados.
todos:
  - id: integrate-backend-agent
    content: Integrar conteúdo de prompt_Dev.md e pos-dev.md no backend-developer.md (análise automática, checklist de TODOs, pós-desenvolvimento)
    status: completed
  - id: integrate-backend-skill
    content: Integrar conteúdo de prompt_Dev.md e Dev_Sec.md no backend-dev/SKILL.md (processo de desenvolvimento, implementação de segurança)
    status: completed
  - id: integrate-frontend-agent
    content: Integrar conteúdo de pos-dev.md no frontend-developer.md (seção de pós-desenvolvimento)
    status: completed
  - id: integrate-frontend-skill
    content: Integrar conteúdo de pos-dev.md no frontend-dev/SKILL.md (validação pós-desenvolvimento)
    status: completed
  - id: integrate-security-agent
    content: Integrar conteúdo de sec_Rev.md no security-engineer.md (foco AppSec, formato de resposta, análise específica)
    status: completed
  - id: integrate-security-skill
    content: Integrar conteúdo de sec_Rev.md no security-audit/SKILL.md (instruções detalhadas de revisão, formato estruturado)
    status: completed
---

# Integração de Conteúdo de Prompts em Agents e Skills

## Análise dos Prompts

### 1. `prompt_Dev.md` - Desenvolvedor Full-Stack Sênior

**Conteúdo principal:**

- Processo de análise de arquitetura e user stories
- Verificação de implementações existentes
- Geração de checklist de TODOs organizados por prioridade e escopo
- Fluxo de trabalho com confirmação antes de implementar
- Foco em código completo, DRY, sem erros
- Referência a stack do projeto (exemplos: Neo4j, PostgreSQL, ElasticSearch, ChromaDB, Ollama, Redis, MinIO, ReactJS, TypeScript, AD/LDAP, JWT, RBAC - mas deve ser flexível para qualquer stack)

**Onde integrar:**

- `.cursor/agents/backend-developer.md` - Adicionar processo de análise e checklist
- `.cursor/skills/backend-dev/SKILL.md` - Adicionar instruções detalhadas de desenvolvimento

### 2. `pos-dev.md` - Pós-Desenvolvimento

**Conteúdo principal:**

- Atualização de tarefas realizadas com checkboxes
- Verificação de logs
- Execução de testes
- Reinicialização de serviços quando necessário

**Onde integrar:**

- `.cursor/agents/backend-developer.md` - Adicionar seção de pós-desenvolvimento
- `.cursor/agents/frontend-developer.md` - Adicionar seção de pós-desenvolvimento
- `.cursor/skills/backend-dev/SKILL.md` - Adicionar validação pós-desenvolvimento
- `.cursor/skills/frontend-dev/SKILL.md` - Adicionar validação pós-desenvolvimento

### 3. `sec_Rev.md` - Especialista em Segurança (AppSec)

**Conteúdo principal:**

- Foco em autenticação/autorização (JWT, OAuth, RBAC, ABAC)
- Análise OWASP Top 10 detalhada
- Análise de segurança de infraestrutura do projeto (exemplos: Neo4j, PostgreSQL, ElasticSearch, ChromaDB, Ollama, Redis, MinIO - mas deve ser adaptado à infraestrutura real do projeto)
- Formato específico de resposta: Descrição, Componente Afetado, Potencial Impacto, Severidade, Recomendações
- Geração de relatório em Markdown no diretório Docs

**Onde integrar:**

- `.cursor/agents/security-engineer.md` - Adicionar foco em AppSec e formato de resposta
- `.cursor/skills/security-audit/SKILL.md` - Adicionar instruções detalhadas de revisão

### 4. `Dev_Sec.md` - Desenvolvedor Full-Stack Segurança

**Conteúdo principal:**

- Tradução de recomendações de segurança em código
- Implementação de correções de segurança
- Plano de ação: Analise → Planejamento (Pseudocódigo) → Desenvolvimento → Teste e Validação
- Foco em autenticação/autorização, proteção de dados, hardening de serviços

**Onde integrar:**

- `.cursor/agents/backend-developer.md` - Adicionar capacidade de implementar correções de segurança
- `.cursor/skills/backend-dev/SKILL.md` - Adicionar seção de implementação de segurança

## Plano de Implementação

### Fase 1: Integração no Backend Developer

#### 1.1 Atualizar `.cursor/agents/backend-developer.md`

- Adicionar seção "Contexto e Stack Tecnológica" com referência à stack do projeto
- Adicionar processo de análise automática (mapear stories, verificar implementações)
- Adicionar geração de checklist de TODOs organizado por componente
- Adicionar fluxo de confirmação antes de implementar
- Adicionar seção de pós-desenvolvimento (atualizar tarefas, verificar logs, testes, reiniciar serviços)
- Adicionar capacidade de implementar correções de segurança quando necessário

#### 1.2 Atualizar `.cursor/skills/backend-dev/SKILL.md`

- Adicionar instruções sobre análise de arquitetura e user stories
- Adicionar processo de verificação de implementações existentes
- Adicionar instruções para geração de checklist de TODOs
- Adicionar diretrizes de código (DRY, completo, sem erros, funcional)
- Adicionar seção de validação pós-desenvolvimento
- Adicionar seção de implementação de segurança

### Fase 2: Integração no Frontend Developer

#### 2.1 Atualizar `.cursor/agents/frontend-developer.md`

- Adicionar seção de pós-desenvolvimento (atualizar tarefas, verificar logs, testes)

#### 2.2 Atualizar `.cursor/skills/frontend-dev/SKILL.md`

- Adicionar seção de validação pós-desenvolvimento

### Fase 3: Integração no Security Engineer

#### 3.1 Atualizar `.cursor/agents/security-engineer.md`

- Adicionar foco em AppSec (aplicações, não apenas infraestrutura)
- Adicionar formato específico de resposta para vulnerabilidades
- Adicionar análise detalhada de autenticação/autorização
- Adicionar análise de segurança de infraestrutura do projeto (adaptar às tecnologias reais do projeto, não fixar exemplos)
- Adicionar instrução para gerar relatório em Markdown no diretório Docs

#### 3.2 Atualizar `.cursor/skills/security-audit/SKILL.md`

- Adicionar instruções detalhadas sobre revisão de autenticação/autorização
- Adicionar análise específica de protocolos (JWT, OAuth 2.0, OpenID Connect)
- Adicionar análise de mecanismos de autorização (RBAC, ABAC)
- Adicionar análise de segurança de infraestrutura do projeto (adaptar às tecnologias reais do projeto)
- Adicionar formato de resposta estruturado para vulnerabilidades
- Adicionar instruções sobre criptografia e gerenciamento de segredos

## Estrutura de Integração

### Backend Developer - Adições Principais

```markdown
## Contexto e Stack Tecnológica
[Descrição da arquitetura com stack específica]

## Processo de Análise Automática
1. Mapear cada Story ao módulo/serviço correspondente
2. Verificar status de implementação atual (código, testes, documentação)
3. Avaliar se o código atual atende à especificação ou requer ajustes
4. Sugerir correções pontuais e melhorias de arquitetura

## Geração de Checklist de TODOs
- Itens numerados, agrupados por componente (Backend / Frontend / DB)
- Para cada item: descrição, estimativa de esforço e link para código/arquivo
- Aguardar confirmação antes de prosseguir

## Pós-Desenvolvimento
1. Atualizar tarefas realizadas com checkbox checked
2. Atualizar status de desenvolvimento
3. Verificar logs
4. Executar testes
5. Reiniciar serviços se necessário
```

### Security Engineer - Adições Principais

```markdown
## Foco em AppSec
Especialista em segurança de aplicações, focado em revisar e identificar vulnerabilidades nos mecanismos de segurança, controle de acesso e processos de autenticação/login.

## Formato de Resposta para Vulnerabilidades
Para cada vulnerabilidade identificada:
- **Descrição da Vulnerabilidade:** Explicação clara do problema
- **Componente Afetado:** Parte da stack impactada
- **Potencial Impacto:** Consequências de exploração
- **Severidade:** Alta, Média ou Baixa
- **Recomendações de Mitigação:** Sugestões acionáveis

## Análise Específica
- Revisão de autenticação/autorização (JWT, OAuth, RBAC, ABAC - conforme stack do projeto)
- Análise de segurança de infraestrutura do projeto (adaptar às tecnologias reais utilizadas, não fixar exemplos)
- OWASP Top 10 detalhado
- Criptografia e gerenciamento de segredos
```

## Considerações Importantes

1. **Manter Compatibilidade:** As integrações devem manter a estrutura existente dos agents e skills, apenas enriquecendo com o conteúdo dos prompts.

2. **Stack Tecnológica:** Os prompts mencionam tecnologias como exemplos (Neo4j, PostgreSQL, etc.). Os agents devem ser flexíveis e adaptar-se à stack real do projeto, não fixar tecnologias específicas. As referências devem ser tratadas como exemplos ilustrativos, não como requisitos fixos.

3. **Formato de Resposta:** O formato específico de resposta do `sec_Rev.md` deve ser integrado na skill `security-audit` para padronizar os relatórios.

4. **Fluxo de Confirmação:** O processo de geração de checklist e confirmação do `prompt_Dev.md` deve ser integrado, mas adaptado ao fluxo de trabalho dos agents.

5. **Pós-Desenvolvimento:** As instruções de `pos-dev.md` devem ser adicionadas como uma etapa final de validação nos agents de desenvolvimento.
---
name: security-audit
description: Analisa segurança, identifica vulnerabilidades, e gera relatórios de segurança. Use quando precisar revisar segurança, analisar vulnerabilidades, ou implementar práticas de segurança.
---

# Security Audit

Skill para análise completa de segurança e identificação de vulnerabilidades.

## Quando Usar

- Análise de segurança de código
- Identificação de vulnerabilidades
- Análise de dependências
- Revisão de autenticação
- Geração de relatórios de segurança

## Instruções

1. **Análise de Código**
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

3. **Autenticação e Autorização**
   - Verifique implementação de JWT/OAuth
   - Analise password hashing
   - Verifique controle de acesso (RBAC)
   - Analise session management
   - Verifique rate limiting

4. **Dados Sensíveis**
   - Verifique se secrets estão hardcoded
   - Analise uso de variáveis de ambiente
   - Verifique criptografia de dados sensíveis
   - Analise logging de informações sensíveis

5. **OWASP Top 10**
   - Verifique cada item do OWASP Top 10
   - Documente vulnerabilidades encontradas
   - Priorize por severidade

6. **Relatório de Segurança**
   - Liste todas as vulnerabilidades
   - Classifique por severidade (Crítica, Alta, Média, Baixa)
   - Documente correções recomendadas
   - Inclua referências e exemplos

## Outputs

Salve os seguintes arquivos em `outputs/artifacts/security/`:
- `security-report.md` - Relatório completo
- `vulnerabilities.md` - Lista de vulnerabilidades
- `fixes.md` - Correções recomendadas
- `security-policies.md` - Políticas de segurança
- `audit-results/` - Resultados de scans

## Referências

Consulte `references/owasp-top10.md` para guia OWASP Top 10.

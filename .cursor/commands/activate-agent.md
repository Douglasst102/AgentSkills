# Ativar Agente Específico

Ativa um subagent específico para trabalhar em uma etapa particular.

## Uso

`/activate-agent <nome-do-agente>`

Exemplos:
- `/activate-agent business-analyst` - Para análise de negócios
- `/activate-agent software-architect` - Para design de arquitetura
- `/activate-agent security-engineer` - Para revisão de segurança
- `/activate-agent process-analyst` - Para mapeamento de processos
- `/activate-agent requirements-engineer` - Para especificação de requisitos
- `/activate-agent technical-analyst` - Para análise técnica
- `/activate-agent devops-engineer` - Para infraestrutura
- `/activate-agent data-engineer` - Para modelagem, documentação de dados e esquemas
- `/activate-agent uiux-designer` - Para design UI/UX
- `/activate-agent frontend-developer` - Para desenvolvimento frontend
- `/activate-agent backend-developer` - Para desenvolvimento backend
- `/activate-agent codebase-documenter` - Para documentação de código
- `/activate-agent qa-engineer` - Para testes e QA

## Verificação de Dependências

O Agent verificará automaticamente:
- Se as dependências necessárias estão completas no contexto
- Se os artefatos de entrada estão disponíveis
- Se a etapa anterior foi concluída (quando aplicável)

## Contexto

O subagent ativado terá acesso ao contexto compartilhado (`.cursor/project-context.json`) e aos artefatos das etapas anteriores.

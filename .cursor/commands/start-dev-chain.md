# Iniciar Cadeia de Desenvolvimento

Inicia o fluxo completo de desenvolvimento de software, orquestrando todos os subagents na sequência correta.

## Fluxo de Execução

1. Ativa o subagent business-analyst para análise de negócios
2. Aguarda conclusão e valida artefatos
3. Ativa o subagent process-analyst para mapeamento de processos
4. Continua sequencialmente através de todos os estágios
5. Executa agentes em paralelo quando possível (ex: frontend e backend)

## Uso

Digite `/start-dev-chain` no chat do Cursor e forneça:
- Nome do projeto
- Descrição inicial do cliente
- Objetivos principais

O Agent irá orquestrar automaticamente todos os subagents necessários.

## Sequência de Execução

1. **Business Analyst** - Análise de negócios e visão do produto
2. **Process Analyst** - Mapeamento de processos de negócio
3. **Requirements Engineer** - Especificação de requisitos
4. **Software Architect** - Design de arquitetura
5. **Technical Analyst** - Especificações técnicas detalhadas
6. **DevOps Engineer** - Infraestrutura e containers (paralelo com Technical)
7. **Data Engineer** - Documentação de dados, modelo conceitual/lógico e DDL/migrações em `data/` (após Technical e Infraestrutura quando aplicável)
8. **UI/UX Designer** - Design e mockups (paralelo com Architecture quando fizer sentido)
9. **Frontend Developer** - Implementação frontend
10. **Backend Developer** - Implementação backend (paralelo com Frontend; pode consumir artefatos em `data/`)
11. **Security Engineer** - Revisão de segurança
12. **Codebase Documenter** - Documentação de código (após Frontend, Backend, DevOps, UI/UX e Security)
13. **QA Engineer** - Testes e validação final

## Validação

Cada etapa valida suas dependências antes de iniciar e atualiza o contexto compartilhado (`.cursor/project-context.json`) ao concluir.

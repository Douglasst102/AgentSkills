# Visualizar Progresso

Exibe o status atual de todas as etapas da cadeia de desenvolvimento.

## Informações Exibidas

- **Etapas Completas** - Etapas finalizadas com sucesso
- **Etapas em Andamento** - Etapas atualmente sendo executadas
- **Etapas Pendentes** - Etapas aguardando dependências ou início
- **Bloqueios** - Dependências não satisfeitas
- **Artefatos Gerados** - Lista de arquivos criados por cada etapa
- **Percentual de Conclusão** - Progresso geral do projeto

## Uso

Digite `/view-progress` no chat do Cursor para ver o status atual.

## Contexto

As informações são lidas do arquivo `.cursor/project-context.json` que mantém o estado compartilhado entre todos os agentes.

## Estrutura de Status

Cada etapa pode ter os seguintes status:
- `pending` - Aguardando início
- `running` - Em execução
- `complete` - Concluída com sucesso
- `blocked` - Bloqueada por dependências não satisfeitas

# Sincronizar Contexto

Sincroniza o contexto compartilhado entre agentes, atualizando informações e resolvendo inconsistências.

## Uso

Digite `/sync-context` no chat do Cursor para sincronizar o contexto.

## Funcionalidades

1. **Atualização de Status** - Atualiza o status de todas as etapas
2. **Validação de Artefatos** - Verifica se os artefatos referenciados existem
3. **Resolução de Dependências** - Identifica e resolve dependências quebradas
4. **Consolidação de Metadados** - Atualiza timestamps e informações do projeto
5. **Backup Automático** - Cria backup do contexto antes da sincronização

## Quando Usar

- Após edições manuais no contexto
- Quando há inconsistências entre agentes
- Antes de iniciar uma nova etapa
- Após importar artefatos externos
- Para verificar integridade do projeto

## Contexto Compartilhado

O arquivo `.cursor/project-context.json` é o repositório central de estado do projeto. Todos os agentes leem e atualizam este arquivo para manter sincronização.

## Estrutura

O contexto contém:
- Informações do projeto (ID, nome)
- Status de cada etapa
- Referências a artefatos gerados
- Metadados (timestamps, versões)
- Dependências entre etapas

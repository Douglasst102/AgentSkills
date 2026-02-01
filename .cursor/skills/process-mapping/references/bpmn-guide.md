# Guia de Notação BPMN

## Elementos Principais

### Eventos
- **Início** - Círculo vazio
- **Fim** - Círculo com borda grossa
- **Intermediário** - Círculo com borda dupla

### Atividades
- **Tarefa** - Retângulo com cantos arredondados
- **Subprocesso** - Retângulo com símbolo + no canto

### Gateways
- **Exclusivo (XOR)** - Losango com X
- **Paralelo (AND)** - Losango com +
- **Inclusivo (OR)** - Losango com O

### Fluxos
- **Sequência** - Seta sólida
- **Mensagem** - Seta tracejada
- **Associação** - Linha pontilhada

## Exemplo de Estrutura

```
[Início] → [Atividade 1] → [Gateway] → [Atividade 2] → [Fim]
                              ↓
                         [Atividade 3]
```

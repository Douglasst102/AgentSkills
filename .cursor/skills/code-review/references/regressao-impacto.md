# Lente: regressão e impacto sistêmico

Orientação para revisar o código sob este ângulo. Prioridade **máxima** quando conflitar com “parece ok”: não duplique análise de AppSec nem de estilo (outras referências cobrem). Não avalie estilo de código nem vulnerabilidades óbvias de segurança aqui. Seja **crítico e explícito**: silêncio onde há risco é falha.

## Escopo (somente isto)

- Quebra de contratos: API pública, schemas (JSON/OpenAPI), tipos, serialização, filas, mensagens.
- Dependências ocultas: ordem de inicialização, imports dinâmicos, monkey patches, feature flags.
- Efeitos colaterais: mutação global, cache, singletons, threads/async, jobs agendados.
- Fluxos existentes: caminhos felizes e de erro; compatibilidade com clientes antigos.
- Concorrência: race conditions, locks faltando, idempotência, retries duplicados.
- Banco de dados: migrações, índices, locks, N+1, transações, consistência eventual.
- Performance: hot paths, alocação, complexidade algorítmica, I/O desnecessário.

## Checklist obrigatório (percorrer mentalmente; citar itens relevantes na resposta)

1. O que **consumidores externos** (outros serviços, front, scripts) assumem que não mudou?
2. Há mudança em **formato de resposta**, códigos HTTP, nomes de campos, nullability?
3. **Rollback** é possível sem corrupção de dados?
4. **Migrações** são reversíveis ou exigem janela / backfill?
5. Código novo roda em **contexto concorrente** (workers, requests paralelos)?
6. Há **dados legados** que quebram a nova lógica?
7. Testes existentes ainda **provam** o comportamento antigo onde deve ser preservado?

## Comportamento

- Se faltar contexto, liste **hipóteses** e marque como "precisa confirmação".
- Priorize: **P0** (quebra certa/provável), **P1** (quebra sob condição), **P2** (degradação).
- Cada achado deve ter: **perfil sugerido**, **evidência** (arquivo/função/comportamento), **cenário de falha**, **mitigação sugerida**.
- **Trecho de código obrigatório:** para cada achado, inclua **path**, linhas quando souber, e um **bloco fenced** com o trecho do **código revisado** ou do **diff** que sustenta o ponto.

## Formato de saída desta lente

Veja também [evidence-policy.md](evidence-policy.md).

### Resumo executivo (2–4 linhas)

### Achados por severidade

#### P0 — …

#### P1 — …

#### P2 — …

### Perguntas em aberto (se houver)

### O que validar antes do merge (checklist acionável)

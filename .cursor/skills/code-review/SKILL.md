---
name: code-review
description: Revisa código ou mudanças sob três lentes — regressão/impacto, segurança (AppSec) e clean code — e consolida relatório em revision/RUN_ID/. Use quando o usuário pedir revisão de código, de um módulo, pré-merge, análise do que foi implementado (pode usar git diff), code review, ou auditoria de qualidade e risco em trechos alterados.
---

# Revisão de código (três lentes + consolidação)

## Práticas de plataforma (lentes regressão / segurança / clean code)

Verifique também:

- Ausência de segredos, senhas e endpoints sensíveis hardcoded; uso de `.env` + `.gitignore`
- Autenticação JWT em REST entre frontend e backend (quando aplicável) e hashing de senha apenas no backend/tabela dedicada
- Backend como única fonte de verdade para dados sensíveis; frontend sem persistência de negócio fora do combinado em arquitetura

Detalhes na lente de segurança: `references/seguranca.md`.

## Antes de começar

1. **`RUN_ID`**: se o usuário não informar, gere `YYYY-MM-DD-HHmm` (sem espaços), ex.: `2026-04-29-1430`.
2. **Escopo da análise** (definir com o usuário ou inferir):
   - **Trecho / arquivos / módulo**: ler os arquivos indicados e vizinhos relevantes no workspace.
   - **“O que foi implementado” / mudança recente / PR**: usar **Git** — `git merge-base` + `git diff` entre `HEAD` e a **ref base** (`main`, `develop`, etc.). Se faltar ref base, pedir antes de consolidar quando o objetivo for comparar branches.
3. **Saídas** (sempre sob a raiz do projeto): `revision/<RUN_ID>/` — criar a pasta se não existir.

## Referências (ler antes de concluir cada fase)

| Fase | Arquivo |
|------|---------|
| Evidência e perfis | [references/evidence-policy.md](references/evidence-policy.md) |
| Lente regressão | [references/regressao-impacto.md](references/regressao-impacto.md) |
| Lente segurança | [references/seguranca.md](references/seguranca.md) |
| Lente clean code | [references/clean-code.md](references/clean-code.md) |
| Relatório unificado | [references/consolidator.md](references/consolidator.md) |

## Ordem de execução

1. Ler `evidence-policy.md` e as três lentes (`regressao-impacto`, `seguranca`, `clean-code`).
2. Obter **evidência**: para análise por diff, rodar os comandos Git no root do repositório; para análise estática, `Read` nos paths do escopo e comparar com padrões dos arquivos adjacentes.
3. Produzir **três** relatórios parciais (ordem sugerida: regressão primeiro — maior severidade):
   - `revision/<RUN_ID>/regressao-impacto.md`
   - `revision/<RUN_ID>/seguranca.md`
   - `revision/<RUN_ID>/clean-code.md`
4. Cada relatório parcial: **mini-capa** no topo (data/hora, escopo, estratégia: “trecho X–Y”, “módulo `foo/`”, ou “diff `BASE..HEAD`” + branch/ref quando aplicável).
5. **Perfil sugerido**: em todo achado relevante, indicar quem tende a corrigir (`backend`, `frontend`, `frontend e UI`, `frontend e segurança`, `backend e segurança`, `DevOps`, `full-stack`, `dados`, `QA`, etc.).
6. Ler `consolidator.md` e gravar **`revision/<RUN_ID>/RELATORIO-UNIFICADO.md`** conforme a ordem de seções e regras lá definidas (mapa com coluna de perfil, simulação cobrindo todos os IDs, handoff).

## Paralelismo

Se o ambiente permitir, as três lentes podem ser executadas em paralelo **desde que** cada uma grave apenas o seu `.md` e o `RUN_ID` seja o mesmo. Se não for possível, execute em sequência e declare na capa do relatório unificado que a execução foi sequencial.

## Git (quando o escopo for diff)

```bash
git rev-parse --git-dir
git branch --show-current
git status -sb
BASE_REF=<ref base informada>
BASE=$(git merge-base HEAD "$BASE_REF" 2>/dev/null || git merge-base HEAD "origin/$BASE_REF")
git diff "$BASE"..HEAD
```

Opcional: escopo por paths, `git diff --cached` / working tree se o usuário pedir alterações locais. Diff grande: usar `git diff --stat`, amostrar trechos críticos e declarar na capa que foi amostrado.

## O que não fazer

- Não misturar no mesmo arquivo parcial o papel das três lentes (cada lente = um arquivo).
- Não publicar `RELATORIO-UNIFICADO.md` sem os três parciais estarem completos (salvo acordo explícito do usuário para pular uma lente).

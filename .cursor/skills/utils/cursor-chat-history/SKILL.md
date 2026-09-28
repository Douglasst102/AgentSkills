---
name: cursor-chat-history
description: Exporta e sincroniza o histórico de chats do Cursor do projeto em arquivos Markdown locais. Use quando o usuário pedir create-history, update-history, get-history, exportar histórico do Cursor, sincronizar chats ou consultar conversas anteriores por tópico.
disable-model-invocation: true
---

# Cursor Chat History

Exporta chats do Cursor (workspace atual) para Markdown no projeto.

**Autossuficiente.** Não usa CLI externa, npm, Node nem ferramentas deste repositório. O agente lê o armazenamento nativo do Cursor e escreve arquivos com Read, Write e Grep.

## Estrutura gerada

```
history/
├── cursor-history.md      # índice de todas as sessões
├── .manifest.json         # estado interno de sincronização
└── sessions/
    ├── sessions-001.md
    ├── sessions-002.md
    └── ...
```

## Variáveis

- `WORKSPACE` — caminho absoluto da raiz do projeto alvo (padrão: diretório atual)
- `HISTORY` — `history` (relativo à raiz do projeto)

## Fontes de dados do Cursor

Consulte [storage-reference.md](references/storage-reference.md) para paths, formatos e extração.

| Fonte | Formato | Quando usar |
|-------|---------|-------------|
| Global DB | `globalStorage/state.vscdb` | Metadados (`composerData:<id>`) e bubbles completos |
| Workspace DB | `workspaceStorage/.../state.vscdb` | Lista de IDs (`selectedComposerIds` ou `allComposers`) |
| Agent transcripts | JSONL em texto | Fallback quando não há bubbles no global DB |

**Ordem de leitura:** localizar workspace → obter IDs de sessão → carregar `composerData` e bubbles do global DB → fallback JSONL se necessário → pular sessões vazias.

## Pré-requisito: `sqlite3`

Antes de `create-history` ou `update-history`, **verifique** se o CLI `sqlite3` está disponível (`sqlite3 -version`).

| Resultado | Ação |
|-----------|------|
| Disponível | Prosseguir com exportação completa |
| Indisponível | Tentar instalar (ver abaixo); se falhar, pedir ao usuário |
| Instalado mas não no PATH | Atualizar PATH (Windows: ver storage-reference) ou usar caminho completo |

**Por que é necessário:** os bancos `state.vscdb` do Cursor são SQLite. Sem `sqlite3`, só é possível exportar agent transcripts JSONL.

### Instalação

O agente **pode instalar automaticamente** antes de pedir ao usuário:

| SO | Comando |
|----|---------|
| Windows | `winget install SQLite.SQLite --accept-package-agreements --accept-source-agreements` |
| macOS | `brew install sqlite` |
| Linux (Debian/Ubuntu) | `sudo apt install sqlite3` |
| Linux (Fedora) | `sudo dnf install sqlite` |

Após instalar, repetir `sqlite3 -version`. No Windows, atualizar PATH na sessão (ver storage-reference).

**Exportação parcial (somente com consentimento):** se o usuário recusar instalar, exportar apenas JSONL e avisar que chats do Composer ficam de fora.

### Acesso com Cursor aberto

Não pedir para fechar o Cursor como primeira opção. Copiar `state.vscdb` + `state.vscdb-wal` para pasta temporária e consultar a cópia. Detalhes em [storage-reference.md](references/storage-reference.md).

## Encoding

Todos os arquivos em `history/` devem ser **UTF-8 sem BOM**. Preferir a ferramenta **Write** para `.md` e `.manifest.json`. Ver storage-reference para caveats do PowerShell.

## Formato Markdown de sessão

```markdown
# Título da sessão

**Date**: 2026-07-06
**Workspace**: /caminho/do/projeto
**Messages**: 12

---

### **User**

(conteúdo)

### **Assistant**

(conteúdo)
```

Título: `composer.name` se existir; senão primeiro texto do usuário (até 80 chars); senão `Untitled Chat`.

## create-history

1. **Verificar `sqlite3`** — instalar se necessário (ver Pré-requisito)
2. Se `history/.manifest.json` existir → informar e sugerir `update-history`
3. Criar `history/sessions/`
4. Copiar DBs para temp; seguir [storage-reference.md](references/storage-reference.md) para listar e extrair sessões
5. **Pular** sessões com 0 mensagens exportáveis; registrar em `skippedSessions`
6. Ordenar por data de criação (mais antiga = 001)
7. Para cada sessão, escrever `history/sessions/sessions-NNN.md`
8. Escrever `history/.manifest.json` e `history/cursor-history.md` — ver [manifest.md](references/manifest.md)
9. Apagar pasta temporária de DBs
10. Reportar total exportado e sessões ignoradas

## update-history

1. **Verificar `sqlite3`** — instalar se necessário
2. Se manifest ausente → `create-history`
3. Copiar DBs para temp; ler manifest e reler fontes do Cursor
4. Por sessão:
   - **Nova** (`id` ausente): exportar com próximo número
   - **Alterada** (`messageCount` ou `lastUpdatedAt` diferente): re-exportar mesmo arquivo
   - **Vazia**: remover arquivo se existia; mover para `skippedSessions`
5. Atualizar `lastSync`, regenerar `cursor-history.md`
6. Apagar pasta temporária
7. Reportar novas, atualizadas, ignoradas e total

## get-history

Busca por tópico nos Markdown exportados. Apenas Grep/Read — sem acessar DB do Cursor.

1. Exigir tópico
2. Se manifest ausente → sugerir `create-history`
3. Grep em `history/sessions/*.md` (case-insensitive)
4. Resumir: número, título, arquivo, trechos
5. Ler arquivo completo se o usuário precisar de contexto

## Tratamento de erros

| Situação | Ação |
|----------|------|
| DB inacessível / tabelas vazias | Copiar DB+WAL para temp e consultar cópia |
| Cópia também falha | Pedir para fechar o Cursor e repetir |
| Workspace não encontrado | Confirmar `WORKSPACE` absoluto |
| `sqlite3` indisponível | Instalar automaticamente; se falhar, pedir ao usuário |
| Usuário recusa instalar | Exportação parcial (só JSONL), com aviso explícito |
| Manifest existe no create | Usar update |
| Sessão sem mensagens | Pular; registrar em `skippedSessions` |
| JSON grande corrompido | Consultar sqlite diretamente, sem arquivo intermediário |

## Convenções

- Arquivos: `sessions-001.md`, `sessions-002.md`, … (numeração estável)
- `cursor-history.md` regenerado a cada create/update
- `history/` no `.gitignore` se o histórico for local
- Pasta temp de DBs em `%TEMP%` ou equivalente — nunca commitar

## Referência

- [storage-reference.md](references/storage-reference.md) — armazenamento nativo do Cursor
- [manifest.md](references/manifest.md) — manifest e índice

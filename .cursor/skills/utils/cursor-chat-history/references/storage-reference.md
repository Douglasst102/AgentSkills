# Armazenamento nativo do Cursor

Referência para o agente ler chats diretamente. Não depende de ferramentas externas deste repositório.

## Paths por sistema

| SO | workspaceStorage | globalStorage | agent transcripts |
|----|------------------|---------------|-------------------|
| Windows | `%APPDATA%\Cursor\User\workspaceStorage` | `%APPDATA%\Cursor\User\globalStorage` | `%USERPROFILE%\.cursor\projects\<slug>\agent-transcripts\` |
| macOS | `~/Library/Application Support/Cursor/User/workspaceStorage` | `.../globalStorage` | `~/.cursor/projects/<slug>/agent-transcripts/` |
| Linux | `~/.config/Cursor/User/workspaceStorage` | `.../globalStorage` | `~/.cursor/projects/<slug>/agent-transcripts/` |

Cada workspace tem pasta hash em `workspaceStorage/<hash>/` com:
- `workspace.json` — mapeia para o path do projeto
- `state.vscdb` (+ `state.vscdb-wal` se journal WAL) — metadados do workspace

Global: `globalStorage/state.vscdb` (+ WAL) — tabela `cursorDiskKV` com metadados de composers e bubbles completos.

## Localizar workspace do projeto

1. Listar subpastas de `workspaceStorage`
2. Em cada uma, ler `workspace.json`
3. Converter URI `file://` para path do sistema
4. Chaves em `workspace.json`:
   - `folder` — projeto pasta única
   - `workspace` — arquivo `.code-workspace` (preferir se ambos existirem)
5. Comparar com `WORKSPACE` (case-insensitive no Windows)

## Acesso ao SQLite com Cursor aberto

Os bancos usam journal mode **WAL**. Com o Cursor aberto, `sqlite3 "file:...?mode=ro"` pode retornar tabelas vazias ou falhar.

**Estratégia preferida (não exige fechar o Cursor):**

1. Copiar `state.vscdb` **e** `state.vscdb-wal` (se existir) para pasta temporária (`%TEMP%` ou similar)
2. Consultar a cópia local com `sqlite3 <caminho-copia> "SELECT ..."`
3. Apagar a pasta temporária ao final do create/update

**Fallback:** se a cópia também falhar, pedir para fechar o Cursor e repetir.

Nunca modificar os arquivos originais do Cursor. Não redirecionar JSON grande para arquivo intermediário via shell — consultar o sqlite diretamente e parsear em memória.

## Listar sessões

### Passo 1 — IDs no workspace DB

```sql
SELECT value FROM ItemTable WHERE key = 'composer.composerData';
```

Do JSON resultante, obter a lista de sessões por uma destas chaves (em ordem de prioridade):

| Chave | Formato |
|-------|---------|
| `allComposers` | Array de composers (formato legado/completo) |
| `selectedComposerIds` | Array de UUIDs (formato atual comum quando `hasMigratedMultipleComposers: true`) |

Se só houver `selectedComposerIds`, os metadados completos estão no global DB (passo 2).

### Passo 2 — Metadados no global DB

Para cada `composerId`:

```sql
SELECT value FROM cursorDiskKV WHERE key = 'composerData:<composerId>';
```

Cada composer contém:
- `composerId` — ID da sessão
- `name` — título (preferir sobre inferência do texto)
- `createdAt`, `lastUpdatedAt` — timestamps Unix em ms
- `fullConversationHeadersOnly` — lista de `{ bubbleId, type }` na ordem da conversa

Contagem de mensagens ≈ bubbles com conteúdo exportável em `fullConversationHeadersOnly`.

## Mensagens completas (global DB)

Para cada `composerId` e `bubbleId`:

```sql
SELECT value FROM cursorDiskKV WHERE key = 'bubbleId:<composerId>:<bubbleId>';
```

Escapar aspas simples em keys SQL: `'` → `''`.

Bubble JSON relevante:
- `type: 1` → mensagem do usuário
- `type: 2` → mensagem do assistente

### Extração de texto (prioridade)

**Assistente:**
1. `toolFormerData.result` — diffs de write/edit
2. `toolFormerData.name` — chamada de ferramenta (qualquer status)
3. `text` — linguagem natural (verificar JSON diff se começa com `{`)
4. `text` + `codeBlocks[]` — combinar, não escolher um só
5. `thinking.text` — prefixar com `[Thinking]`
6. Erros: `toolFormerData.additionalData.status === 'error'` → prefixar `[Error]`

**Usuário:**
1. `codeBlocks[].content`
2. `text`, `content`, `richText`

**Code blocks:** envolver em ` ```<languageId>\n...\n``` ` quando houver `languageId`.

## Agent transcripts (JSONL)

Path: `.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`

Descobrir `<slug>`: listar `.cursor/projects/` e escolher pasta cujo nome corresponde ao path do projeto (segmentos separados por `-`, ex.: `c-Users-simul-Documents-Codes-Local-cursor-history-main`).

Cada linha é JSON:
```json
{"role":"user","message":{"content":[{"type":"text","text":"..."}]}}
{"role":"assistant","message":{"content":[{"type":"text","text":"..."}]}}
```

Extrair `message.content[].text` onde `type === "text"`. Resumir blocos `tool_use` como `[Tool: nome]`.

## Prioridade de fontes por sessão

Para cada ID de sessão, usar **uma** fonte (evitar duplicar):

| Prioridade | Fonte | Quando |
|------------|-------|--------|
| 1 | Bubbles (`composerData` + `bubbleId` no global DB) | `composerData:<id>` existe e tem bubbles |
| 2 | Agent transcript JSONL | Sem `composerData` ou bubbles vazios |
| — | Pular | `messageCount === 0` após extração — registrar em `skippedSessions` do manifest |

O UUID do transcript geralmente coincide com o `composerId` quando ambos existem; nesse caso usar apenas bubbles.

## Montar sessão para export

1. Obter lista de IDs (workspace DB → `allComposers` ou `selectedComposerIds`)
2. Para cada ID, carregar `composerData:<id>` do global DB
3. Buscar bubbles na ordem de `fullConversationHeadersOnly`
4. Mapear `type` → User / Assistant
5. Se sem bubbles, tentar JSONL com mesmo UUID
6. Pular sessões sem mensagens exportáveis
7. Gerar Markdown conforme template da skill

## Consultas sqlite3

### Verificar disponibilidade

```bash
sqlite3 -version
```

Se indisponível, o agente **pode instalar** antes de pedir ao usuário:

| SO | Instalação |
|----|------------|
| Windows | `winget install SQLite.SQLite --accept-package-agreements --accept-source-agreements` |
| macOS | `brew install sqlite` |
| Linux (Debian/Ubuntu) | `sudo apt install sqlite3` |
| Linux (Fedora) | `sudo dnf install sqlite` |

Após instalar no Windows, atualizar PATH na sessão atual:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Se a instalação falhar ou o usuário recusar, oferecer exportação parcial (só JSONL).

### Consultar banco (via cópia)

```bash
# 1. Copiar DB + WAL para temp
# 2. Consultar cópia:
sqlite3 /tmp/cursor-export/global.vscdb "SELECT value FROM cursorDiskKV WHERE key='composerData:<uuid>';"
```

No Windows, usar barras normais nos paths. Não usar `?mode=ro` na cópia — abrir o arquivo copiado diretamente.

### Alternativa sem sqlite3

Exportar somente agent transcripts JSONL. Informar explicitamente que chats do Composer ficam de fora.

## Encoding (UTF-8)

- Escrever `history/**/*.md` e `.manifest.json` em **UTF-8 sem BOM**
- Preferir a ferramenta **Write** do agente para arquivos finais
- No PowerShell: `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))`
- Evitar `Out-File`, redirecionamento `>` e strings com `[` ou `` ` `` em aspas duplas no PowerShell

## Identificadores no manifest

| Campo | Origem |
|-------|--------|
| `id` | `composerId` ou UUID do transcript |
| `messageCount` | mensagens exportadas |
| `lastUpdatedAt` | `lastUpdatedAt` do composer ou mtime do JSONL |
| `createdAt` | `createdAt` do composer ou ctime do JSONL |

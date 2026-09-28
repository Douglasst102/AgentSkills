# Formato do manifest e índice

## `.manifest.json`

```json
{
  "version": 1,
  "workspace": "/caminho/absoluto/do/projeto",
  "lastSync": "2026-07-06T14:00:00.000Z",
  "sessions": [
    {
      "number": 1,
      "id": "uuid-do-composer",
      "file": "sessions-001.md",
      "title": "Título da sessão",
      "createdAt": "2026-07-05T10:00:00.000Z",
      "lastUpdatedAt": "2026-07-05T12:00:00.000Z",
      "messageCount": 42
    }
  ],
  "skippedSessions": [
    {
      "id": "uuid-sem-mensagens",
      "reason": "empty",
      "title": "Untitled Chat"
    }
  ]
}
```

Campos de cada sessão vêm do armazenamento nativo do Cursor (ver [storage-reference.md](storage-reference.md)). O `title` pode ser refinado lendo a primeira linha `# ...` do markdown exportado.

`skippedSessions` (opcional): sessões encontradas mas não exportadas — tipicamente `reason: "empty"` quando `messageCount === 0`. Não gerar arquivo `sessions-NNN.md` para essas.

Próximo número de arquivo: `max(sessions[].number) + 1`.

## `cursor-history.md`

```markdown
# Cursor Chat History

**Workspace:** `/caminho/absoluto/do/projeto`
**Última atualização:** 2026-07-06 14:00:00
**Sessões:** 3

| # | Título | Data | Mensagens | Arquivo |
|---|--------|------|-----------|---------|
| 1 | Título da sessão | 2026-07-05 | 42 | [sessions-001.md](./sessions/sessions-001.md) |
```

Regenerar a tabela inteira a cada create/update, ordenada por `number`. Incluir apenas sessões exportadas (não listar `skippedSessions` na tabela, mas mencionar a contagem no resumo se houver: "2 sessões vazias ignoradas").

Escrever em UTF-8 sem BOM (ver [storage-reference.md](storage-reference.md)).

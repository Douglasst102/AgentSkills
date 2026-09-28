# Referência — Penpot MCP (local / self-hosted)

> **Documentação passo a passo:** [docs/02-mcp-server.md](../../docs/02-mcp-server.md)  
> **Penpot Docker:** [docs/01-penpot-docker.md](../../docs/01-penpot-docker.md)

## Arquitetura

```
Cursor (MCP client) → MCP Server → WebSocket → Plugin Penpot → Arquivo aberto
```

Três peças obrigatórias: servidor MCP, plugin no Penpot conectado, cliente MCP (Cursor).

## Modos de conexão

| Modo | URL Cursor | Plugin |
|------|------------|--------|
| **Integrado (Docker)** | `http://localhost:9001/mcp/stream?userToken=CHAVE` | File → MCP Server → Connect |
| **Local (`npx`)** | `http://localhost:4401/mcp` | Load from URL → `http://localhost:4400/manifest.json` |

Exemplos de config: `.cursor/mcp.json.example` (local) e `.cursor/mcp.json.example.integrated` (Docker).

## Ferramentas MCP

| Ferramenta | Uso |
|------------|-----|
| `high_level_overview` | Visão geral — **sempre primeiro** |
| `penpot_api_info` | Documentação da Plugin API |
| `execute_code` | Criar/editar via Plugin API |
| `export_shape` | Exportar shapes |
| `import_image` | Importar imagens (paths locais só no modo `npx`) |

## Conceitos operacionais

- **Página focada**: MCP opera só na página com foco no Penpot
- **Aba ativa**: uma aba Penpot por sessão MCP
- **MCP key**: tratar como senha (modo integrado)

## Troubleshooting rápido

| Sintoma | Ação |
|---------|------|
| Ferramentas não aparecem | Reiniciar Cursor; conferir URL e `type: http` |
| Plugin não conecta | Reiniciar MCP; reconectar plugin |
| `execute_code` falha | Plugin desconectado ou página sem foco |

Checklist completo em [docs/02-mcp-server.md](../../docs/02-mcp-server.md#troubleshooting).

## Links

- [Penpot MCP Help](https://help.penpot.app/mcp/)
- [penpot-mcp GitHub](https://github.com/penpot/penpot-mcp)
- [Install with Docker](https://help.penpot.app/technical-guide/getting-started/docker/)

---
name: penpot-prototyping
description: >-
  Prototipa layouts no Penpot via MCP (local ou self-hosted): lê e edita arquivos
  de design, aplica templates, cria tokens/componentes e orienta sobre funcionalidades
  do Penpot. Use quando o usuário mencionar Penpot, MCP, prototipagem de UI, templates
  de layout, design-to-design, design-to-code, ou edição de arquivos .penpot.
---

# Penpot Prototyping (MCP)

Skill para agentes que prototipam layouts no Penpot através do [Penpot MCP Server](https://help.penpot.app/mcp/).

## Antes de qualquer ação

1. **Ler esta skill** e, se necessário, [reference.md](reference.md) e [templates-guide.md](templates-guide.md).
2. **Verificar pré-requisitos** (ver checklist abaixo). Se algo falhar, orientar o usuário antes de chamar ferramentas MCP.
3. **Inspecionar o arquivo** com `high_level_overview` antes de editar.
4. **Consultar a API** com `penpot_api_info` antes de `execute_code` complexo.

### Checklist de conexão

```
- [ ] Servidor MCP em execução (`npx -y @penpot/mcp@stable`)
- [ ] Penpot aberto (self-hosted ou SaaS) com arquivo de design
- [ ] Plugin MCP conectado e status "Connected"
- [ ] Janela do plugin aberta (fechar desconecta)
- [ ] Página correta em foco no Penpot (MCP opera só na página focada)
- [ ] Apenas uma aba Penpot ativa para MCP
```

## Modos de implantação

| Modo | URL MCP | Autenticação | Quando usar |
|------|---------|--------------|-------------|
| **Local** | `http://localhost:4401/mcp` | Sessão do browser | Self-hosted + controle local; `import_image` com paths locais |
| **Remote (self-hosted)** | `https://SEU-DOMINIO/mcp/stream?userToken=CHAVE` | MCP key em Integrações | Sem rodar `npx`; sem FS local |

Para self-hosted com MCP local: abra sua instância Penpot no browser, carregue o plugin em `http://localhost:4400/manifest.json` (Plugins → Load from URL) e conecte.

Detalhes de setup: [reference.md](reference.md) e guias em `docs/01-penpot-docker.md` e `docs/02-mcp-server.md`.

## Ferramentas MCP

| Ferramenta | Uso |
|------------|-----|
| `high_level_overview` | Visão geral do arquivo/página focada — **sempre primeiro** |
| `penpot_api_info` | Documentação da Plugin API antes de `execute_code` |
| `execute_code` | Criar, mover, renomear, estilizar via Plugin API |
| `export_shape` | Exportar shapes (SVG, PNG, etc.) |
| `import_image` | Importar imagens (paths locais só no modo local) |

O agente **não** precisa expor nomes de ferramentas ao usuário; use-as conforme o pedido.

## Fluxos de trabalho

### 1. Prototipar a partir de template

1. Ler o template em `templates/` (ou o que o usuário indicar).
2. `high_level_overview` — confirmar página alvo ou pedir ao usuário focar a página certa.
3. Resumir o que será criado (frames, grid, tipografia, cores) e **aguardar confirmação** se a mudança for grande.
4. `penpot_api_info` para APIs relevantes (boards, rects, text, flex, components).
5. `execute_code` em passos pequenos: estrutura → layout → conteúdo → estilos → componentes.
6. `high_level_overview` novamente para validar.

Guia de templates: [templates-guide.md](templates-guide.md).

### 2. Editar layout existente

1. `high_level_overview` — entender estrutura atual.
2. Descrever mudanças planejadas antes de aplicar (renomear, reorganizar, paleta, spacing).
3. Aplicar em **incrementos reversíveis** (um grupo de layers por vez).
4. Confirmar resultado com o usuário.

### 3. Ajuda com funcionalidades Penpot

Responder sobre: flex/grid, componentes e variantes, design tokens (cores, tipografia), libraries, auto-layout, export, comentários, plugins, estrutura de arquivo (pages, boards, groups).

Combinar explicação conceitual com demonstração via MCP quando o usuário tiver arquivo aberto.

### 4. Design-to-code (quando pedido)

1. Inspecionar estrutura e tokens com `high_level_overview` + `execute_code` de leitura.
2. Mapear componentes Penpot → código (nomes alinhados).
3. Gerar HTML/CSS ou framework solicitado; usar `export_shape` para assets.

Exemplos de prompts: [examples.md](examples.md).

## Princípios de design no Penpot

- **Hierarquia**: Page → Board (frame) → Groups → Shapes.
- **Nomenclatura**: `Section/Component/Variant` ou convenção do template do usuário.
- **Tokens primeiro**: cores e tipografia como library assets antes de aplicar em massa.
- **Auto-layout**: preferir flex do Penpot para listas, cards e formulários responsivos.
- **Componentes**: extrair padrões repetidos; manter variantes organizadas.
- **Espaçamento**: múltiplos de 4 ou 8 px salvo indicação contrária no template.

## Segurança e qualidade

- Começar com ações **somente leitura** em setup novo.
- **Descrever** mudanças de escrita antes de executar.
- Evitar "refatorar tudo" num único `execute_code`.
- Manter plugin conectado durante toda a sessão.
- Usar modelo capaz (VLM recomendado para tarefas visuais complexas).

## Templates do usuário

Templates ficam em `templates/*.template.md`. Ler o frontmatter YAML e as notas do corpo antes de criar shapes.

## Resposta ao usuário

Responder em **português**, salvo pedido contrário.

Estruturar respostas assim:

1. **Estado**: conexão MCP, página em foco, o que foi inspecionado.
2. **Plano**: passos que serão executados.
3. **Execução**: resumo do que foi feito (não despejar código Plugin API bruto).
4. **Próximo passo**: ajustes sugeridos ou pergunta se o usuário quer continuar.

## Fora de escopo

- Não inventar estado do arquivo Penpot.
- Se MCP não estiver disponível, orientar setup via [reference.md](reference.md) — não simular edições no chat.

## Recursos adicionais

- Penpot Docker: `docs/01-penpot-docker.md`
- MCP Server: `docs/02-mcp-server.md`
- Agente e skill: `docs/03-agente-skill.md`
- Setup resumido: [reference.md](reference.md)
- Definir templates: [templates-guide.md](templates-guide.md)
- Prompts de exemplo: [examples.md](examples.md)
- Docs oficiais: https://help.penpot.app/mcp/

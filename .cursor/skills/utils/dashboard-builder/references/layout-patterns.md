# Padrões de layout (canvas customizável)

Grade persistível, modo edição, responsivo e escopo pessoal vs. compartilhado. Libs de grid são **referência**, não obrigação.

## Anatomia do canvas

```
DashboardShell
  Toolbar: seletor de visão | intervalo de tempo | Customize | save status
  FilterBar: filtros globais (não são layout)
  Grid: WidgetFrame[] posicionados
    WidgetFrame: título, fonte, freshness, ações, Chart|Kpi|Table
```

- **12 colunas** no desktop (padrão Grafana / Bootstrap / RGL).
- `rowHeight` e gap tokenizados no design system (ex. 80px / 8px).
- Snap-to-grid; `minW`/`maxW`/`minH`/`maxH` por `widgetType`.
- Compactação vertical (menos buracos) como default; float livre só se o usuário pedir.

## Item de layout (serializar)

```json
{ "i": "w_revenue", "x": 0, "y": 0, "w": 3, "h": 2, "minW": 2, "minH": 2 }
```

Persistir **ids + geometria**, nunca HTML do widget. GridStack: `save(false)` para omitir `content`.

Breakpoints: gravar layouts por breakpoint (`lg`/`md`/`sm`) **ou** um layout canônico + regras de empilhamento. Se usar RGL, `onBreakpointChange` dispara **antes** de `onLayoutChange` — não sobrescrever o layout do breakpoint anterior.

## Modo edição (default da skill)

Separar leitura de composição (Grafana, Metabase, Splunk Dash Studio, UX Patterns):

| View | Edit |
|------|------|
| Consumir dados, filtros, drill | Paleta, drag/resize, add/remove |
| Sem handles de arrasto | Handles + teclado Move earlier/later |
| Toolbar compacta | Save / Cancel / Reset visíveis |

- Entrar em Customize **congela** interações de leitura no card (scroll/brush) ou as restringe ao conteúdo, não ao frame.
- Mudanças ficam **unsaved** até Save; Cancel restaura o layout persistido; Reset volta ao default do papel (não apaga filtros).
- Save pergunta o escopo: **pessoal** | **cópia** | **compartilhado** (este último só com permissão e confirmação).
- Dashboard de equipe: nunca gravar layout pessoal por cima do compartilhado sem aviso.

**Exceção:** home pessoal de um único usuário pode ser “sempre arrastável” se o intake pedir — ainda assim save explícito ou debounce + undo.

## Paleta e ciclo de vida do widget

- Galeria com nome, pergunta, fonte, preview de tamanho, restrição de permissão.
- Add: posição previsível (primeiro slot livre no topo); anunciar; focar o novo card.
- Remove / hide distintos: hide = usuário; retired = catálogo removeu o tipo.
- Máximo de widgets por visão (sugerir 12–16); bloquear duplicata se a query for idêntica.
- Widget sem permissão: card explicativo + request-access, **sem** vazar dados.

## Responsivo e mobile

- Desktop: grade 12. Mobile: coluna única pela **prioridade** (`priority` no layout), não pela ordem visual acidental do resize.
- Preview de ordem mobile **antes** de salvar (UX Patterns).
- Não “espremer” 12 colunas em 320px; empilhar e manter KPIs obrigatórios no topo.
- Touch: alvos ≥ 44px; drag com handle, não o card inteiro (conflito com scroll).

## Persistência e concorrência

- Fonte da verdade: `PUT` visão no backend ([data-contracts.md](data-contracts.md)).
- Debounce 300–800 ms **depois** de drag stop, ou só no Save (preferível no edit mode).
- `schemaVersion` no JSON; `version` / `updatedAt` para conflito (409 + reload).
- Undo/redo local na sessão de edição (Grafana-like, ~50 estados) — não substitui o servidor.

## A11y do builder

- Tab: Customize → paleta → ações de cada widget → Save/Cancel/Reset.
- Teclado: Move earlier/later, Resize (passos de 1 célula), Add, Remove.
- Após mover: foco permanece no widget; live region anuncia posição (`linha 2, colunas 1–4`).
- Ordem visual = ordem DOM = ordem do leitor.
- Escape: fecha paleta; se unsaved, confirma antes de sair do edit mode.
- Não depender só de ícone de arrasto para comunicar que o layout é editável.

## Libs de referência (não obrigatórias)

| Lib | Stack | Uso |
|-----|-------|-----|
| react-grid-layout | React | DnD, resize, breakpoints, `onLayoutChange` |
| GridStack | Agnóstica | `save`/`load`, nested opcional |
| CSS Grid + Sortable | Leve | Só se o produto não precisar resize livre |

Se o projeto já usa uma, **não trocar** no brief. Copiar API de componente (`DashboardGrid`, `onLayoutCommit`) em vez de vazar a lib no domínio.

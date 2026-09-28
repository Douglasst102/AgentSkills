# Princípios de visualização para dashboards

Calibrado pelo mapa web (FT Vocabulary, Nightingale, Grafana/Metabase, UX Patterns, ECharts ARIA, W3C Graphics-ARIA). Não substitui o design system do projeto.

## Hierarquia (3 camadas)

1. **Primário** — 3–6 KPIs no topo: valor, delta vs. período anterior, direção. Visíveis sem scroll em desktop.
2. **Contexto** — 2–5 gráficos que explicam os KPIs (tendência, breakdown, ranking).
3. **Detalhe** — tabela, log ou drill-down; não compete com a camada 1.

Mais de ~12 métricas na mesma visão: dividir em abas, drill, ou visões salvas — não empilhar.

## Defaults antes de customizar

- Layout inicial por **papel/persona**, não canvas vazio.
- A maioria dos usuários não rearranja; invista no default.
- Widgets **obrigatórios** (alerta de SLO, compliance) não podem ser removidos sem política explícita.

## Representação, não decoração

- Cada gráfico responde a uma pergunta ([chart-catalog.md](chart-catalog.md)).
- Títulos descritivos; subtítulo pode ser a pergunta (padrão de painéis públicos PT).
- Unidades e timezone no eixo ou no header do widget.
- Freshness visível (`atualizado há 2 min` / `stale`).
- Densidade: whitespace e alinhamento de grade > “preencher o vazio”.

## Interação

- Filtros globais do dashboard aplicam-se a vários widgets; filtros locais são exceção documentada.
- Drill: clique no mark → detalhe ou filtro cruzado; não navegar para outra app sem aviso.
- Empty / loading / error / permission-denied / retired: estados de primeira classe (não card em branco).
- Skeleton no shell da grade; priorizar fetch dos KPIs.
- Todo gráfico interativo: **entrada animada** + **resposta ao cursor** (abaixo). Tabela não anima marks; KPI pode count-up.

## Animação de entrada (obrigatória no brief)

Os marks **nascem da forma do dado**, não de fade genérico no card. Objetivo: o olho lê a magnitude enquanto o valor aparece.

| Mark | Entrada (primeiro paint com dados) |
|------|-------------------------------------|
| Barra / coluna / hbar | Parte da **baseline** (eixo 0) e cresce até o valor. Empilhadas: do eixo, na ordem das séries |
| Linha | Traço desenha ao longo do tempo (left→right); pontos aparecem no fim ou junto ao traço |
| Área | Mesmo que linha + preenchimento sobe da baseline |
| Donut / funil | Arco/segmento cresce a partir do início do path (sem giro 3D) |
| Scatter / heatmap | Pontos/células *scale* ou *opacity* curtos a partir do centro da marca — sem voar pela tela |
| KPI | Número sobe (count-up) + sparkline desenha; delta entra depois do valor |

**Regras**

- Duração **400–700 ms**, easing `ease-out` (saída lenta). Stagger entre barras/categorias **≤ 40 ms**; entre widgets da grade **≤ 80 ms** (KPIs primeiro).
- Uma vez por montagem com aquele dataset. Filtro/refresh: animação **mais curta** (150–250 ms) ou só o mark que mudou — não repetir o grow completo a cada poll.
- Não loop, bounce elástico, nem animar eixos/grid/legenda.
- Resize do widget e modo edição: **sem** re-entrada.
- Skeleton some **antes** do grow; não animar em cima de placeholder.

## Cursor, destaque e tooltip (obrigatório no brief)

Hover/foco no mark é o canal de **detalhe fino**. O gráfico em repouso continua scannable.

**Tooltip**

- Segue o cursor (ou ancora no mark em touch); contém categoria/período, valor formatado, unidade, série.
- Não é o único acesso ao número: tabela equivalente e, quando couber, rótulo no hover.
- Uma série ativa: irmãs **atenuam** (opacity ~0.3–0.45); a ativa mantém cor + ênfase leve (stroke ou lift 1–2 px).
- Tempo: **crosshair** vertical (e opcionalmente horizontal) + tooltip; `graphTooltip` compartilhado entre widgets alinhados no tempo só se o spec pedir (padrão Grafana).

**Microinteração**

- Barra: grow extra mínimo ou brilho no topo — não distorcer a escala.
- Ponto de linha: halo / ponto maior no vértice ativo.
- Célula de heatmap: borda ou lift; valor no tooltip (cor sozinha não basta).
- KPI: hover no card mostra período de comparação no tooltip, sem animar o número de novo.

**Pointer vs. teclado vs. touch**

- `pointerenter` / `pointerleave` no mark; hit area ≥ o mark visível (barras estreitas: padding invisível).
- Teclado: marks focáveis ou listbox na tabela equivalente; foco mostra o **mesmo** tooltip/destaque que o hover.
- Touch: primeiro tap = tooltip; segundo tap = drill se existir. Não depender de hover.
- Tooltip some no `Escape` e ao sair do gráfico.

## `prefers-reduced-motion`

Se o usuário pede menos movimento (CSS `prefers-reduced-motion: reduce` **ou** toggle do produto):

- **Desligar** grow, draw, count-up, stagger e micro-lift.
- **Manter** estado final, tooltip, atenuação de séries e crosshair (mudança de destaque sem transições longas).
- Atualização de dados: troca instantânea do mark.

## Acessibilidade (mínimo no brief)

| Requisito | Como |
|-----------|------|
| Alternativa textual | `aria-label` / descrição do gráfico (ECharts `aria.show` ou equivalente) |
| Dados exaustivos | Tabela equivalente sincronizada (visível ou disclosure) |
| Cor | Segundo canal: padrão/decal, rótulo, ícone |
| Refresh | `aria-live="polite"` sem roubar foco |
| Reduced motion | Sem grow/draw; tooltip e highlight permanecem |
| Contraste | WCAG 2.2 AA; temas claro/escuro testados nos charts |
| Builder | Teclado para add/remove/move/resize/save; ver [layout-patterns.md](layout-patterns.md) |
| Papéis | `graphics-document` / `figure` quando o mark é SVG |

Canvas/WebGL: espelhar dados no DOM (proxy) — a árvore de a11y não lê pixels.

## Anti-padrões

- Pizza 3D, explosão de fatias, eixos truncados sem aviso
- Widget “Overview” sem pergunta nem fonte
- Customização que esconde alerta obrigatório
- Cor só para encoding quantitativo fino (heatmap sem escala legendada)
- Legenda distante com 12 séries sem rótulo direto
- Auto-refresh agressivo sem live region e sem controle de pausa
- Fade genérico do card no lugar do grow a partir da baseline
- Tooltip só em hover, sem equivalente de foco/teclado
- Animar de novo o grow completo a cada refresh automático

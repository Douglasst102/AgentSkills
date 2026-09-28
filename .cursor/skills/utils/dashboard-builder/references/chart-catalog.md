# Catálogo de gráficos (pergunta → tipo)

Escolha o tipo pela **pergunta analítica**, não pela novidade visual. Taxonomia adaptada do [FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md). Libs abaixo são **referência**, não obrigação.

## Famílias (produto/analytics)

| Família | Pergunta típica | Default no dashboard | Evitar |
|---------|-----------------|----------------------|--------|
| Magnitude | Qual o valor? Quanto maior/menor que X? | KPI card + sparkline; barra | Gauge 3D, pizza para comparar magnitudes |
| Change over time | Como mudou? Qual a tendência? | Linha; barras por período se poucos pontos | Área empilhada com muitas séries |
| Ranking | Quem está no topo / fundo? | Barra horizontal ordenada | Pizza, mapa se posição importa mais que geografia |
| Part-to-whole | Qual a composição? | Barra empilhada 100% ou tabela; donut só ≤5 fatias com rótulo | Pizza 3D, >7 fatias, explode |
| Deviation | Acima/abaixo da meta/média? | Barra divergente; bullet | Sem linha de referência |
| Distribution | Qual a forma / concentração? | Histograma, boxplot | Média sozinha sem dispersão |
| Correlation | X e Y andam juntos? | Scatter (tamanho = 3ª variável com cuidado) | Eixo dual enganoso; causalidade implícita |
| Spatial | A geografia é o ponto? | Mapa **só** se localização for a pergunta | Mapa coroplético para ranking não-espacial |
| Flow | De onde para onde? | Funil (etapas); sankey (opt-in) | Sankey como widget default |

Ops/monitoring: privilegiar status, sparkline, heatmap de tempo (ex. latência × hora). Científico: privilegiar distribuição, scatter, incerteza (fan/intervalo). BI: dimensões + parte-todo + tabela.

## Widgets canônicos (v1)

Use estes ids no `widget-catalog.md` salvo o usuário pedir outros.

| widgetType | Família | Mark | Query típica | minW×minH (grid 12) |
|------------|---------|------|--------------|---------------------|
| `kpi` | Magnitude | Número + delta + sparkline | 1 measure, time grain fino para sparkline | 3×2 |
| `line` | Tempo | Linha (multi-série ≤5) | measure(s) + timeDimension | 6×3 |
| `bar` | Magnitude / ranking | Barra/coluna | measure + 1 dimension ordenável | 4×3 |
| `area` | Tempo (volume) | Área | 1–2 séries; stacked só se parte-todo temporal | 6×3 |
| `hbar` | Ranking | Barra horizontal | Top N + “outros” | 4×4 |
| `donut` | Parte-todo | Anel | ≤5 categorias; senão `bar` | 3×3 |
| `table` | Detalhe | Tabela | dimensions + measures, paginada | 6×4 |
| `heatmap` | Correlação 2D / calendário | Células | 2 dimensions + 1 measure | 6×4 |
| `scatter` | Correlação | Pontos | 2 measures (+ size opcional) | 6×4 |
| `funnel` | Flow | Funil | etapas ordenadas | 4×4 |

Não incluir na v1 sem pedido: radar, chord, sunburst, 3D, gauge ornamental, word cloud.

## Entrada e hover por tipo

Obrigatório no `frontend-brief` e nos widgets do catálogo. Detalhe em [visualization-principles.md](visualization-principles.md).

| widgetType | Entrada | Hover / foco |
|------------|---------|--------------|
| `kpi` | Count-up + sparkline draw | Tooltip de período/delta; sem re-count |
| `line` / `area` | Traço da esquerda para a direita | Crosshair + tooltip; ponto ativo; séries irmãs atenuadas |
| `bar` / `hbar` | Cresce da baseline (0) | Tooltip valor+categoria; barra ativa em ênfase, demais atenuadas |
| `donut` / `funnel` | Segmento cresce no path | Fatia/etapa ativa; tooltip % e valor absoluto |
| `heatmap` | Opacity/scale curto por célula | Célula com borda; valor no tooltip |
| `scatter` | Scale/opacity no ponto | Ponto maior + tooltip dos eixos |
| `table` | Sem animação de mark | Row hover no design system |

## Regras de escolha

1. Comece pela pergunta em linguagem natural; recuse widget sem pergunta.
2. Se a tarefa é **comparar valores**, barra vence pizza (precisão de comprimento vs. ângulo).
3. Se a tarefa é **tendência**, linha; se poucos períodos categóricos, coluna.
4. Nunca usar cor como único canal (decals, padrão, rótulo direto).
5. Eixo dual: só com escalas documentadas e séries de natureza diferente (volume vs. taxa); default é **não**.
6. Null ≠ zero (docs ECharts): lacunas visíveis na linha.
7. Título do widget = pergunta ou afirmação (“Receita vs. meta — 7 dias”), não “Gráfico de linha”.

## Libs de referência (não obrigatórias)

| Lib | Quando citar no brief | Notas |
|-----|----------------------|-------|
| Apache ECharts | Muitos tipos, Canvas/SVG, ARIA + decals oficiais | Bundle seletivo; a11y off by default |
| Recharts + shadcn charts | React + design system existente | Composição, não wrap; `min-h` no container |
| Vega-Lite | Spec declarativo, cross-filter, facetas | Melhor para exploração que para grid de widgets |
| Nivo | Defaults visuais fortes em React | — |
| Grid de layout | ver [layout-patterns.md](layout-patterns.md) | Independente da lib de chart |

Se o projeto já usa uma lib, **não trocar** no brief.

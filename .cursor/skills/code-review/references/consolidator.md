# Consolidação do relatório unificado

Etapa final após os três relatórios parciais (`regressao-impacto.md`, `seguranca.md`, `clean-code.md`) estarem prontos em `revision/<RUN_ID>/`.

## Fonte de verdade

- **Não** refazer a análise do zero; a fonte principal são os **três** arquivos parciais.
- Só usar Git/diff pontualmente para **confirmar** um trecho se algo estiver ambíguo nos relatórios.

## Leitura obrigatória antes de consolidar

1. Os três relatórios parciais em `revision/<RUN_ID>/`.
2. [evidence-policy.md](evidence-policy.md).

## Regras de consolidação

- **Não dilua severidade:** se regressão aponta P0/P1 e outra lente minimiza, o consolidado reflete o **pior caso plausível** até a regressão ser tratada.
- **Cruzamento entre lentes** é obrigatório **na montagem** do mapa e da simulação (concordâncias, divergências resolvidas, riscos combinados), mas **não** produza seção dedicada *Cruzamento e conflitos entre lentes* no arquivo unificado.
- Una **riscos combinados** no mapa quando um achado de uma lente amplifica outro (um ID pode referenciar várias lentes).

## Simulação de impacto

Inclua a seção **Simulação de impacto** (depois do Mapa, antes do Handoff) que **cobre integralmente** o **Mapa de riscos consolidado**:

- Para **cada linha / cada ID** da tabela do mapa (ex.: CON-001, CON-002, …), inclua pelo menos um subitem **explicitamente rotulado com o mesmo ID** (título `**CON-00X — …**` ou equivalente).
- Em cada subitem: **o que quebra ou o que se expõe**, **onde** (componente/rota/arquivo), **por quê** (causa). Ancore com **path + snippet** quando houver código; se for hipótese, declare e cite o trecho que motiva a suspeita.
- Vários IDs podem aparecer no **mesmo** parágrafo narrativo **somente** se o texto deixar inequívoco o destino de cada ID. **Nenhum ID do mapa fica sem simulação correspondente**.
- Não substitua isso por cenários genéricos que omitam riscos do mapa.

## Saída (obrigatório)

Gravar **um** arquivo Markdown:

`revision/<RUN_ID>/RELATORIO-UNIFICADO.md`

### Ordem das seções

1. **Capa** — escopo (estratégia de análise: trecho, módulo ou diff; branch/ref quando Git foi usado; `RUN_ID`; execução paralela ou sequencial das lentes); resumo da mudança ou do trecho (1 parágrafo); lentes aplicadas com **referências** (paths em `.cursor/skills/code-review/references/`) e **justificativa** breve do porquê as três lentes são complementares.
2. **Mapa de riscos consolidado** — tabela: **ID**, **área** (regressão / segurança / código), **severidade global**, **resumo**, **ação recomendada**, **perfil sugerido** (correção), **evidência** (path + trecho curto ou remissão ao achado parcial que já contém bloco de código). A coluna **ação recomendada** deve ser suficiente para priorização (não há seções separadas de prioridade nem de tarefas numeradas).
3. **Simulação de impacto** — conforme regras acima (cobertura **total** dos IDs do mapa).
4. **Handoff** — próximos passos enxutos (quem valida o quê, em uma lista curta), alinhado aos perfis sugeridos quando fizer sentido.

**Não incluir** no `RELATORIO-UNIFICADO.md`: seção *Cruzamento e conflitos entre lentes*; *Prioridade de correção* como bloco separado; *Tarefas acionáveis* numeradas (T1/T2/…). O conteúdo acionável fica no mapa (ação recomendada + perfil) + simulação + handoff.

Tom: direto, técnico, em **português**.

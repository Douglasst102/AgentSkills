# Lente: clean code e design

Orientação para revisar o código sob este ângulo. Escopo **estrito**: legibilidade, organização, princípios de design e duplicação. **Não** substitua análise de segurança ou de impacto sistêmico; se vir problema grave de segurança/regressão, mencione em **uma linha** e remeta às outras lentes.

## Contexto

O padrão esperado **não** é apenas “compilar”. Avalie em relação ao **próprio projeto**: use arquivos **adjacentes** ao trecho revisado como referência de “como escrevemos aqui”, não uma lista teórica genérica.

Esta lente serve para:

- **Reconhecer** quando o trecho **mantém ou eleva** o nível do repositório (e dizer isso explicitamente).
- **Apontar** quando o código **fica abaixo** do que o projeto já demonstra nos módulos vizinhos (funções enormes no meio de código enxuto, nomes genéricos ao lado de domínio bem nomeado, lógica duplicada que o restante do pacote já extraiu para serviço/helper, etc.).

## Barra de comparação

Trate a lista abaixo como referência ao ler o código. Nem todo item aparece em todo arquivo; o que importa é **coerência com o módulo** e **evitar retrocesso** de qualidade.

- **Nomes que contam história:** variáveis e funções dizem *o quê* e *em que contexto* (`user_id` vs `id`, `build_expedition_payload` vs `process`). Evitar `data`, `handle`, `do_it` salvo convenção local muito clara.
- **Funções e métodos curtos e com um motivo para mudar:** um nível principal de abstração por função; trechos longos costumam ser quebrados em passos nomeados (helpers privados, métodos de instância pequenos).
- **Early return / guard clauses:** validações e casos especiais no topo; fluxo principal legível sem pirâmide de `if` aninhados.
- **DRY na regra de negócio, não no ruído:** duplicar duas linhas triviais pode ser ok; duplicar **regra**, **validação** ou **mapeamento** que já existe em outro ponto do mesmo bounded context é sinal vermelho.
- **Camadas respeitadas:** onde o projeto separa view/API, serviço, domínio, persistência ou cliente HTTP, o trecho não deve empilhar tudo “só desta vez”. Espessar uma camada que o resto mantém fina exige justificativa na revisão.
- **Tipagem e contratos explícitos** (quando a stack usa): type hints, serializers/DTOs, schemas — alinhados ao padrão do diretório.
- **Comentários onde o *porquê* não é óbvio:** comentário que repete o nome da função é ruído; comentário que explica invariante, workaround ou decisão de produto é valor.
- **Imports e dependências:** ordem e agrupamento como no resto do pacote; evitar import circular “resolvido” com import tardio salvo padrão já existente no repo.
- **Tratamento de erro e logging no tom do projeto:** mensagens acionáveis, nível de log consistente com vizinhos, sem `except: pass` ou logs genéricos que o time já evita noutros arquivos.
- **Testes e testabilidade:** sem pedir para reescrever suíte inteira — mas apontar quando o desenho novo **torna impossível ou custoso** testar da mesma forma que o código ao redor (acoplamento forte a singleton global, I/O no meio de lógica pura que o projeto costuma isolar).

## SOLID e pragmatismo (só o que dói na manutenção)

- **S** — Uma razão para mudar: se o trecho mistura “buscar dados”, “validar regra” e “disparar efeito colateral” na mesma função sem o projeto fazer assim no mesmo layer, sinalize.
- **O** — Extensão sem editar o núcleo: se o código é sempre `if tipo == X` em cadeia onde o repo já usa estratégia/registry, é inconsistência de design.
- **L** — Subtipos substituíveis: relevante quando há herança ou interfaces compartilhadas.
- **I** — Interfaces/fachadas pequenas: “God object” novo ou método com muitos parâmetros opcionais onde o resto usa objetos de configuração ou builders.
- **D** — Depender de abstrações: injeção ou factories como o restante do módulo; não introduzir `import` concreto de infra no meio de domínio se o pacote já inverteu isso.

Não pregue SOLID por cartilha; cite **só** onde o desvio **aumenta custo real** de mudança em relação ao padrão local.

## Escopo resumido (somente isto)

- Nomes, módulos e vocabulário de domínio.
- Tamanho e responsabilidade de funções/classes; coesão e acoplamento.
- Duplicação e abstrações **justificadas** (evitar over-engineering).
- Pastas, camadas, imports e ciclos aparentes.
- Comentários úteis vs. ruído.
- Testabilidade e alinhamento ao estilo dos vizinhos.

## Checklist obrigatório

1. Um leitor novo entende **o propósito** do trecho em poucos minutos, no mesmo nível que o código ao redor?
2. Há funções com **vários níveis de abstração** misturados (HTTP + regra + SQL + formatação) onde o projeto costuma separar?
3. Nomes são **honestos** (função `get_*` que também persiste; `validate` que altera estado)?
4. A duplicação introduzida é **trivial** ou **copia regra/fluxo** já existente em outro lugar?
5. O trecho **respeita** padrões de pasta, naming e camada que você vê nos arquivos vizinhos?
6. Há **comentários óbvios** ou falta de contexto onde decisões não triviais precisam de uma linha de “por quê”?
7. O código novo fica **mais difícil de testar ou estender** que o equivalente já presente no módulo?

## Comportamento

- Diferencie **obrigatório** (bloqueia merge / inconsistente com o resto do pacote) de **sugestão** (refino).
- **Valorize** quando o trecho mantém o padrão do projeto.
- Prefira **exemplos concretos** (trecho + “como está em `arquivo_x`” ou snippet curto de refatoração), não lista genérica de boas práticas.

## Formato de saída desta lente

Veja também [evidence-policy.md](evidence-policy.md).

### Resumo executivo (2–4 linhas)

### Pontos fortes (se houver)

### Problemas e sugestões (por impacto na manutenção: Alto / Médio / Baixo)

Para cada item: **perfil sugerido** (correção), **local**, **problema**, **sugestão** (idealmente contrastando com **padrão já usado** no repo quando couber), **trecho citado** — bloco fenced com o código que ilustra o problema (e, se útil, snippet curto do **vizinho** que mostra o padrão do projeto).

### Dívida técnica introduzida ou ampliada

### Checklist rápido para o autor antes do merge

- Confirmar nomes e camadas alinhados aos vizinhos.
- Confirmar que novos caminhos de erro e logging seguem o projeto.

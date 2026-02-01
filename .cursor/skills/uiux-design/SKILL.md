---
name: uiux-design
description: Cria wireframes, mockups, design system, e especificações de design. Use quando precisar projetar interfaces, definir design system, ou criar especificações de componentes. Integra os princípios de craft do interface-design.
---

# UI/UX Design

Skill para criação completa de designs de interface e design system, integrando os princípios de craft e qualidade do `interface-design`.

## Quando Usar

- Criação de wireframes
- Desenvolvimento de mockups
- Definição de design system
- Especificação de componentes
- Criação de protótipos
- Design de dashboards, apps, ferramentas (não landing pages)

## Leitura Obrigatória

Antes de criar qualquer design, leia completamente:

1. `.cursor/skills/interface-design/SKILL.md` — fundamentos, princípios e verificações
2. `.cursor/skills/interface-design/references/principles.md` — craft detalhado incluindo layering sutil
3. `.cursor/skills/interface-design/references/example.md` — como decisões se traduzem em código

**Não pule esta etapa.** O conhecimento de craft está nestes arquivos.

---

## Intent First — Responda Antes de Projetar

Antes de tocar em qualquer código ou criar wireframes, responda estas perguntas em voz alta:

**Quem é esta pessoa?** Não "usuários." Onde estão? O que está em suas mentes? Um professor às 7h com café não é um desenvolvedor debugando à meia-noite.

**O que eles devem realizar?** Não "usar o dashboard." O verbo. Avaliar submissões. Encontrar o deployment quebrado. Aprovar o pagamento.

**Como isso deve parecer?** Em palavras que significam algo. "Limpo" não significa nada. Quente como um caderno? Frio como um terminal? Denso como uma sala de trading?

Se você não conseguir responder com especificidades, pare e pergunte ao usuário. Não adivinhe. Não use padrões.

## Antes de Criar Cada Componente

Declare a intenção E a abordagem técnica:

```text
Intent: [quem, o que precisam fazer, como deve parecer]
Palette: [fundação + acento — e POR QUE essas cores se encaixam no mundo do produto]
Depth: [bordas / sombras sutis / camadas — e POR QUE]
Surfaces: [sua escala de elevação — e POR QUE esta temperatura]
Typography: [sua escolha de tipo — e POR QUE se encaixam na intenção]
Spacing: [sua unidade base]
```

Toda escolha deve ser explicável. Se sua resposta é "é comum" ou "funciona" — você não escolheu. Você usou padrão.

**O teste:** Se outra IA dado um prompt similar produziria a mesma saída, você falhou. A interface deve emergir de ESTE usuário, ESTE problema, ESTA intenção.

---

## O Problema dos Padrões

Você gerará saída genérica. Seu treinamento viu milhares de dashboards. Os padrões são fortes.

Você pode seguir todo o processo abaixo — explorar o domínio, nomear uma assinatura, declarar sua intenção — e ainda produzir um template. Cores quentes em estruturas frias. Fontes amigáveis em layouts genéricos. "Sensação de cozinha" que parece todo outro app.

Isso acontece porque a intenção vive em prosa, mas a geração de código puxa de padrões. A lacuna entre eles é onde os padrões vencem.

O processo abaixo ajuda. Mas processo sozinho não garante craft. Você tem que se pegar.

---

## Onde os Padrões se Escondem

Padrões não se anunciam. Eles se disfarçam como infraestrutura — as partes que parecem que só precisam funcionar, não ser projetadas.

**Tipografia parece um container.** Escolha algo legível, siga em frente. Mas tipografia não está segurando seu design — ela É seu design. O peso de um título, a personalidade de um rótulo, a textura de um parágrafo. Estes moldam como o produto parece antes de qualquer um ler uma palavra.

**Navegação parece andaimes.** Construa a barra lateral, adicione os links, chegue ao trabalho real. Mas navegação não está ao redor do seu produto — ela É seu produto. Onde você está, onde pode ir, o que importa mais.

**Dados parecem apresentação.** Você tem números, mostre números. Mas um número na tela não é design. A pergunta é: o que este número significa para a pessoa olhando? O que eles farão com ele?

**Nomes de tokens parecem detalhe de implementação.** Mas suas variáveis CSS são decisões de design. `--ink` e `--parchment` evocam um mundo. `--gray-700` e `--surface-2` evocam um template.

A armadilha é pensar que algumas decisões são criativas e outras são estruturais. Não há decisões estruturais. Tudo é design. O momento em que você para de perguntar "por que isso?" é o momento em que os padrões assumem o controle.

---

## Princípios Fundamentais de Craft

### Layering Sutil

Esta é a espinha dorsal do craft. Independentemente da direção, tipo de produto ou estilo visual — este princípio se aplica a tudo.

**Superfícies devem ser quase diferentes mas ainda distinguíveis.** Estude Vercel, Supabase, Linear. Suas mudanças de elevação são tão sutis que você quase não consegue vê-las — mas você sente a hierarquia. Não saltos dramáticos. Não cores obviamente diferentes. Mudanças sussurradas.

**Bordas devem ser leves mas não invisíveis.** A borda deve desaparecer quando você não está procurando por ela, mas ser encontrada quando você precisa entender a estrutura. Se as bordas são a primeira coisa que você nota, elas são muito fortes. Se você não consegue dizer onde as regiões começam e terminam, elas são muito fracas.

**O teste de piscar:** Feche os olhos na interface. Você ainda deve perceber hierarquia — o que está acima do quê, onde as seções se dividem. Mas nada deve saltar. Sem linhas duras. Sem mudanças de cor jarring. Apenas estrutura silenciosa.

Isso separa interfaces profissionais de amadoras. Erre isso e nada mais importa.

### Expressão Infinita

Todo padrão tem expressões infinitas. **Nenhuma interface deve parecer a mesma.**

Uma exibição de métrica poderia ser um número hero, estatística inline, sparkline, gauge, barra de progresso, delta de comparação, badge de tendência, ou algo novo. Um dashboard poderia enfatizar densidade, espaço em branco, hierarquia ou fluxo de formas completamente diferentes.

**Antes de construir, pergunte:**

- Qual é a ÚNICA coisa que os usuários fazem mais aqui?
- Quais produtos resolvem problemas similares brilhantemente? Estude-os.
- Por que esta interface pareceria projetada para seu propósito, não modelada?

**NUNCA produza saída idêntica.** Mesma largura de barra lateral, mesmo grid de cards, mesmas caixas de métrica com ícone-esquerda-número-grande-rótulo-pequeno toda vez — isso sinaliza imediatamente gerado por IA. É esquecível.

### Cor Vive em Algum Lugar

Todo produto existe em um mundo. Esse mundo tem cores.

Antes de alcançar uma paleta, passe tempo no mundo do produto. O que você veria se entrasse na versão física deste espaço? Quais materiais? Qual luz? Quais objetos?

Sua paleta deve parecer que veio DE algum lugar — não como se fosse aplicada A algo.

**Além de Quente e Frio:** Temperatura é um eixo. Isso é quieto ou alto? Denso ou espaçoso? Sério ou lúdico? Geométrico ou orgânico? Um terminal de trading e um app de meditação são ambos "focados" — tipos completamente diferentes de foco. Encontre a qualidade específica, não o rótulo genérico.

**Cor Carrega Significado:** Cinza constrói estrutura. Cor comunica — status, ação, ênfase, identidade. Cor sem motivo é ruído. Uma cor de acento, usada com intenção, vence cinco cores usadas sem pensamento.

---

## Instruções de Trabalho

### 1. Wireframes

- Crie wireframes para todas as telas principais
- Use baixa fidelidade para focar em estrutura
- Documente fluxos de navegação
- Identifique elementos interativos
- Considere a hierarquia de informação antes de qualquer estilo visual

### 2. Mockups de Alta Fidelidade

**Antes de criar mockups, siga este processo:**

1. **Exploração de Domínio do Produto**
   - Produza todos os quatro outputs obrigatórios:
     - **Domínio:** Conceitos, metáforas, vocabulário do mundo deste produto. Mínimo 5.
     - **Mundo de cores:** Quais cores existem naturalmente no domínio deste produto? Liste 5+.
     - **Assinatura:** Um elemento — visual, estrutural ou de interação — que só poderia existir para ESTE produto.
     - **Padrões:** 3 escolhas óbvias para este tipo de interface — visual E estrutural.

2. **Proposta de Direção**
   - Sua direção deve referenciar explicitamente:
     - Conceitos de domínio explorados
     - Cores do seu mundo de cores
     - Seu elemento de assinatura
     - O que substitui cada padrão

   **O teste:** Leia sua proposta. Remova o nome do produto. Alguém poderia identificar para que isso é? Se não, é genérico. Explore mais profundamente.

3. **Desenvolvimento de Mockups**
   - Desenvolva mockups detalhados aplicando os princípios de craft
   - Use cores e tipografia do design system
   - Aplique layering sutil (superfícies quase diferentes, bordas leves mas não invisíveis)
   - Inclua estados interativos (hover, active, disabled, focus, loading, error)
   - Considere diferentes tamanhos de tela (responsive)
   - Evite padrões genéricos — cada elemento deve emergir da intenção específica

### 3. Design System

**Fundação Primitiva:**

- **Foreground** — cores de texto (primária, secundária, muted)
- **Background** — cores de superfície (base, elevada, overlay)
- **Border** — cores de borda (padrão, sutil, forte)
- **Brand** — seu acento primário
- **Semantic** — cores funcionais (destrutivo, aviso, sucesso)

Não invente novas cores. Mapeie tudo para essas primitivas.

**Hierarquia de Elevação de Superfície:**

```text
Nível 0: Background base (o canvas do app)
Nível 1: Cards, painéis (mesmo plano visual que a base)
Nível 2: Dropdowns, popovers (flutuando acima)
Nível 3: Dropdowns aninhados, overlays empilhados
Nível 4: Maior elevação (raro)
```

**Sistema de Espaçamento:**

- Escolha uma unidade base (4px e 8px são comuns) e use múltiplos em todo lugar
- Construa uma escala para diferentes contextos:
  - Micro espaçamento (lacunas de ícone, pares de elementos apertados)
  - Espaçamento de componente (dentro de botões, inputs, cards)
  - Espaçamento de seção (entre grupos relacionados)
  - Separação maior (entre seções distintas)

**Estratégia de Profundidade:**

Escolha UMA abordagem e comprometa-se:

- **Apenas bordas (flat)** — Limpo, técnico, denso. Para ferramentas focadas em utilidade.
- **Sombras sutis** — Elevação suave. Para produtos acessíveis.
- **Sombras em camadas** — Rico, premium, dimensional. Para cards que precisam de presença.

Não misture abordagens.

**Tipografia:**

- Construa níveis distintos visualmente distinguíveis:
  - **Títulos** — peso pesado, letter-spacing apertado para presença
  - **Corpo** — peso confortável para legibilidade
  - **Rótulos/UI** — peso médio, funciona em tamanhos menores
  - **Dados** — frequentemente monospace, precisa de `tabular-nums` para alinhamento

**Paleta de Cores:**

- Defina paleta de cores (primária, secundária, neutras)
- Cores devem emergir do mundo do produto, não ser aplicadas a ele
- Use uma cor de acento com intenção, não múltiplas cores sem motivo

### 4. Especificações de Componentes

- Documente cada componente do design system
- Especifique propriedades e variantes
- Inclua exemplos de uso
- Documente estados e interações (default, hover, active, focus, disabled, loading, error)
- **Nunca use elementos de formulário nativos para UI estilizada** — construa componentes customizados

### 5. Acessibilidade

- Garanta contraste adequado de cores
- Considere tamanhos de fonte legíveis
- Documente navegação por teclado
- Inclua alternativas textuais para imagens
- Construa uma hierarquia de contraste de quatro níveis: foreground (primária) → secundária → muted → faint

---

## O Mandato — Verificações Antes de Apresentar

**Antes de mostrar ao usuário, olhe o que você fez.**

Pergunte a si mesmo: "Se eles dissessem que isso carece de craft, o que significaria?"

Aquela coisa em que você acabou de pensar — corrija primeiro.

Sua primeira saída provavelmente é genérica. Isso é normal. O trabalho é pegá-la antes que o usuário precise.

### As Verificações

Execute estas contra sua saída antes de apresentar:

- **O teste de troca:** Se você trocasse a fonte pela sua usual, alguém notaria? Se você trocasse o layout por um template de dashboard padrão, pareceria diferente? Os lugares onde trocar não importaria são os lugares onde você usou padrão.

- **O teste de piscar:** Feche os olhos. Você ainda pode perceber hierarquia? Alguma coisa está saltando duramente? Craft sussurra.

- **O teste de assinatura:** Você pode apontar para cinco elementos específicos onde sua assinatura aparece? Não "a sensação geral" — componentes reais. Uma assinatura que você não consegue localizar não existe.

- **O teste de tokens:** Leia suas variáveis CSS em voz alta. Elas soam como se pertencessem ao mundo deste produto, ou poderiam pertencer a qualquer projeto?

Se alguma verificação falhar, itere antes de mostrar.

---

## Comandos Disponíveis

Este skill integra os comandos do `interface-design`:

### `/interface-design:init`

Inicia o processo de design de interface. Leia os arquivos obrigatórios primeiro.

### `/interface-design:status`

Mostra o estado atual do design system, incluindo direção, tokens e padrões.

### `/interface-design:audit <caminho>`

Verifica código existente contra o design system para violações de espaçamento, profundidade, cor e padrões.

### `/interface-design:extract <caminho>`

Extrai padrões de design do código existente para criar um arquivo `system.md`.

**Uso:**

```bash
/interface-design:audit <caminho>     # Audita arquivo/diretório específico
/interface-design:audit                # Audita caminhos UI comuns
/interface-design:extract              # Extrai de caminhos UI comuns
/interface-design:extract <caminho>   # Extrai de diretório específico
```

---

## Outputs

Salve os seguintes arquivos em `outputs/artifacts/design/`:

- `wireframes/` - Wireframes
- `mockups/` - Mockups de alta fidelidade
- `design-system.md` - Design system completo
- `component-specs.md` - Especificações de componentes
- `prototypes/` - Protótipos interativos (opcional)
- `.interface-design/system.md` - Sistema de design estabelecido (quando aplicável)

---

## Após Completar uma Tarefa

Quando você terminar de construir algo, **sempre ofereça para salvar**:

```text
"Quer que eu salve esses padrões para sessões futuras?"
```

Se sim, escreva em `.interface-design/system.md`:

- Direção e sensação
- Estratégia de profundidade (bordas/sombras/camadas)
- Unidade base de espaçamento
- Padrões de componentes chave

Isso se compõe — cada salvamento torna o trabalho futuro mais rápido e consistente.

---

## Evitar

- **Bordas duras** — se as bordas são a primeira coisa que você vê, elas são muito fortes
- **Saltos dramáticos de superfície** — mudanças de elevação devem ser sussurradas
- **Espaçamento inconsistente** — o sinal mais claro de nenhum sistema
- **Estratégias de profundidade mistas** — escolha uma abordagem e comprometa-se
- **Estados de interação faltando** — hover, focus, disabled, loading, error
- **Sombras de queda dramáticas** — sombras devem ser sutis, não chamativas
- **Raio grande em elementos pequenos**
- **Cards brancos puros em fundos coloridos**
- **Bordas decorativas grossas**
- **Gradientes e cor para decoração** — cor deve significar algo
- **Múltiplas cores de acento** — dilui o foco
- **Saída genérica** — se outra IA produziria o mesmo, você falhou

---

## Referências

- `.cursor/skills/interface-design/SKILL.md` — fundamentos completos
- `.cursor/skills/interface-design/references/principles.md` — exemplos de código, valores específicos, dark mode
- `.cursor/skills/interface-design/references/example.md` — como decisões se traduzem em código
- `.cursor/skills/interface-design/references/validation.md` — gerenciamento de memória, quando atualizar system.md
- `references/design-system-guide.md` — templates e exemplos básicos

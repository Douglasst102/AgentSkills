# Guia de templates

Templates definem a estrutura que o agente replica ou adapta no Penpot. Ficam em `templates/` na raiz do projeto.

## Formato de arquivo

Cada template é um `.template.md` com frontmatter YAML:

```markdown
---
name: landing-page
title: Landing Page SaaS
description: Hero, features, pricing e CTA
viewport: 1440x900
grid: 12 colunas, gutter 24, margin 80
tokens:
  colors:
    primary: "#6366F1"
    background: "#0F172A"
    text: "#F8FAFC"
  typography:
    heading: "Inter 32/40 Bold"
    body: "Inter 16/24 Regular"
spacing_unit: 8
sections:
  - id: header
    height: 72
    content: Logo + nav + CTA button
  - id: hero
    height: 560
    content: Headline, subhead, 2 CTAs, illustration placeholder
  - id: features
    layout: 3-column grid
    items: 3 feature cards
  - id: pricing
    layout: 3-tier cards
  - id: footer
    content: Links + copyright
components:
  - Button/Primary
  - Button/Secondary
  - Card/Feature
naming: "Section/Element"
---

## Notas

Instruções livres para o agente (tom de voz, referências visuais, restrições).
```

## Como o agente usa um template

1. Ler frontmatter + notas do `.template.md`.
2. Confirmar com o usuário: template base, página alvo, customizações (cores, copy, seções a omitir).
3. Criar boards por `sections[]` com dimensões e layout indicados.
4. Aplicar `tokens` como cores/tipografias na library ou inline.
5. Instanciar `components` ou criá-los se não existirem no arquivo.
6. Seguir `naming` em todas as layers.

## Criar novo template

1. Copiar `templates/_template.template.md`.
2. Preencher frontmatter com seções e tokens.
3. Pedir ao agente: *"Prototipe usando o template X com [customizações]"*.

## Templates incluídos

| Arquivo | Uso |
|---------|-----|
| `landing-page.template.md` | Marketing / SaaS |
| `dashboard.template.md` | App com sidebar + conteúdo |
| `_template.template.md` | Esqueleto vazio para novos templates |

## Boas práticas

- Um board principal por seção (facilita reorganização).
- Definir tokens antes de shapes individuais.
- Especificar `viewport` para consistência.
- Listar componentes esperados evita duplicação.
- Notas livres para contexto que não cabe no YAML (marca, acessibilidade, referências).

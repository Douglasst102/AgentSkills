# Guia Mobile-First Design

Diretrizes completas para design e desenvolvimento mobile-first.

## Princípios Mobile-First

### Abordagem Mobile-First

**Mobile-First significa:**
- Começar o design pela menor tela (mobile)
- Adicionar recursos e espaço conforme a tela cresce
- Priorizar conteúdo essencial
- Otimizar para interação touch

**Por que Mobile-First:**
- Maioria dos usuários acessa via mobile
- Força foco no conteúdo essencial
- Melhor performance (menos código carregado inicialmente)
- Experiência consistente em todos os dispositivos

### Touch Targets

**Tamanho Mínimo:**
- **Mínimo absoluto**: 44x44 pixels (Apple HIG, Material Design)
- **Recomendado**: 48x48 pixels para melhor usabilidade
- **Espaçamento**: Mínimo de 8px entre touch targets

**Áreas de Toque:**
- Botões, links, inputs devem ter área de toque adequada
- Ícones pequenos devem ter padding para aumentar área de toque
- Evite elementos interativos muito próximos

```css
/* Touch target adequado */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px; /* Aumenta área de toque */
}

/* Ícone com área de toque aumentada */
.icon-button {
  padding: 12px; /* Aumenta área além do ícone */
  min-width: 44px;
  min-height: 44px;
}
```

### Thumb Zones

**Zonas de Alcance do Polegar:**

```
┌─────────────────────────┐
│ Difícil  │  Fácil  │ Difícil │
│          │         │         │
│ Difícil  │  Fácil  │ Difícil │
│          │         │         │
│          │         │         │
│    Muito Fácil (centro)     │
│          │         │         │
│ Difícil  │  Fácil  │ Difícil │
└─────────────────────────┘
```

**Posicionamento de Elementos:**
- **Ações primárias**: Zona fácil (centro-inferior)
- **Navegação principal**: Zona fácil
- **Ações secundárias**: Podem estar em zonas difíceis
- **Elementos perigosos** (delete): Zonas difíceis para evitar toques acidentais

**Orientação:**
- **Retrato**: Elementos importantes no centro e parte inferior
- **Paisagem**: Considerar posição dos polegares em ambos os lados

### Gestos Comuns

**Gestos Nativos:**
- **Tap**: Ação primária
- **Double tap**: Zoom, seleção
- **Long press**: Context menu, drag iniciar
- **Swipe**: Navegação, dismiss
- **Pinch-to-zoom**: Zoom em imagens, mapas
- **Pull-to-refresh**: Atualizar conteúdo

**Implementação:**
- Use gestos nativos quando possível
- Forneça feedback visual imediato
- Evite gestos customizados que conflitem com nativos
- Documente gestos customizados para usuários

**Exemplos de Uso:**
- **Swipe left/right**: Navegação entre cards, dismiss
- **Swipe down**: Pull-to-refresh
- **Pinch**: Zoom em imagens, mapas
- **Long press**: Menu contextual, seleção

### Breakpoints Baseados em Conteúdo

**Abordagem:**
- Defina breakpoints baseados no conteúdo, não em dispositivos específicos
- Teste quando o layout quebra, não em tamanhos fixos
- Use `min-width` (mobile-first) ao invés de `max-width`

**Breakpoints Comuns:**
```css
/* Mobile-first: min-width */
/* Mobile: padrão (sem media query) */
/* Tablet: 768px+ */
@media (min-width: 48rem) { /* 768px */ }

/* Desktop: 1024px+ */
@media (min-width: 64rem) { /* 1024px */ }

/* Large Desktop: 1280px+ */
@media (min-width: 80rem) { /* 1280px */ }
```

**Quando Quebrar:**
- Conteúdo fica espremido demais
- Elementos começam a sobrepor
- Texto fica difícil de ler
- Touch targets ficam muito pequenos
- Layout perde hierarquia visual

### Layouts Fluid

**Unidades Relativas:**
- Use `%`, `em`, `rem` ao invés de `px` fixos
- Permite escalonamento com zoom do usuário
- Melhor para diferentes densidades de tela

```css
/* Evitar */
.container {
  width: 320px;
  font-size: 14px;
}

/* Preferir */
.container {
  width: 100%;
  max-width: 20rem; /* 320px base */
  font-size: 0.875rem; /* 14px base */
}
```

**CSS Grid e Flexbox:**
- Use Grid e Flexbox para layouts flexíveis
- `fr` units no Grid para distribuição proporcional
- `flex-grow`, `flex-shrink` para adaptação

```css
/* Grid fluido */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* Flexbox fluido */
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
```

### Imagens Responsivas

**srcset e sizes:**
```html
<img 
  src="image-800w.jpg"
  srcset="
    image-400w.jpg 400w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Descrição da imagem"
>
```

**Picture Element:**
```html
<picture>
  <source 
    media="(max-width: 768px)" 
    srcset="image-mobile.jpg"
  >
  <source 
    media="(max-width: 1024px)" 
    srcset="image-tablet.jpg"
  >
  <img src="image-desktop.jpg" alt="Descrição">
</picture>
```

**Lazy Loading:**
```html
<img 
  src="image.jpg" 
  loading="lazy"
  alt="Descrição"
>
```

### Tipografia Responsiva

**Unidades Relativas:**
- Use `rem` para tamanhos de fonte (baseado no root)
- Use `em` para espaçamento relativo ao elemento
- Permite zoom do usuário funcionar corretamente

**Escala Modular:**
```css
:root {
  font-size: 16px; /* Base */
}

h1 { font-size: 2rem; } /* 32px */
h2 { font-size: 1.75rem; } /* 28px */
h3 { font-size: 1.5rem; } /* 24px */
body { font-size: 1rem; } /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

**Ajustes por Breakpoint:**
```css
/* Mobile: menor */
h1 { font-size: 1.75rem; }

/* Tablet+: maior */
@media (min-width: 48rem) {
  h1 { font-size: 2rem; }
}
```

**Line Height e Letter Spacing:**
- Ajuste `line-height` para legibilidade em telas pequenas
- `letter-spacing` pode precisar ajuste em tamanhos menores
- Teste legibilidade em dispositivos reais

### Navegação Mobile

**Padrões Comuns:**
- **Hamburger menu**: Para navegação principal
- **Bottom navigation**: Para apps com poucas seções principais
- **Tab bar**: Similar a bottom navigation
- **Sticky header**: Navegação sempre acessível

**Acessibilidade:**
- Menu hamburger deve ser acessível por teclado
- Indicar estado expandido/colapsado
- Animar transições suavemente
- Fornecer forma de fechar (overlay, botão X)

**Exemplo:**
```html
<button 
  aria-expanded="false" 
  aria-controls="mobile-menu"
  aria-label="Menu de navegação"
>
  <span class="hamburger"></span>
</button>
<nav id="mobile-menu" aria-hidden="true">
  <!-- Menu -->
</nav>
```

### Formulários Mobile

**Input Types:**
- Use tipos apropriados para mostrar teclado correto
- `type="email"` → teclado com @
- `type="tel"` → teclado numérico
- `type="number"` → teclado numérico
- `type="url"` → teclado com .com

**Layout:**
- Campos em coluna única em mobile
- Labels acima dos inputs (não ao lado)
- Botões de ação em tamanho adequado (44px+)
- Validação inline clara

**Autocomplete:**
```html
<input 
  type="email" 
  autocomplete="email"
  name="email"
>
```

### Performance Mobile

**Otimizações:**
- Imagens otimizadas e em formatos modernos (WebP, AVIF)
- Lazy loading de imagens abaixo da dobra
- Code splitting para carregar apenas necessário
- Critical CSS inline
- Minimizar JavaScript inicial

**Rede:**
- Considerar conexões lentas (3G, 4G)
- Mostrar indicadores de loading
- Implementar retry para falhas de rede
- Cache estratégico

### Testes em Dispositivos Reais

**Por que testar em dispositivos reais:**
- Emuladores não capturam todos os comportamentos
- Diferentes tamanhos de tela e densidades
- Performance real vs simulada
- Interações touch reais

**Dispositivos para testar:**
- Pelo menos um iOS (iPhone)
- Pelo menos um Android
- Diferentes tamanhos (pequeno, médio, grande)
- Diferentes orientações (retrato, paisagem)

**Ferramentas:**
- Chrome DevTools Device Mode (aproximação)
- BrowserStack, Sauce Labs (testes remotos)
- Dispositivos físicos (melhor opção)

### Checklist Mobile-First

- [ ] Design começa em mobile (menor tela)
- [ ] Touch targets são 44x44px mínimo
- [ ] Elementos importantes estão em thumb zones
- [ ] Navegação funciona bem em mobile
- [ ] Formulários são usáveis em mobile
- [ ] Imagens são responsivas e otimizadas
- [ ] Tipografia é legível em telas pequenas
- [ ] Layouts são fluidos (não quebram)
- [ ] Performance é otimizada para mobile
- [ ] Testado em dispositivos reais

### Recursos Adicionais

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [Responsive Design Patterns](https://responsivedesign.is/patterns/)

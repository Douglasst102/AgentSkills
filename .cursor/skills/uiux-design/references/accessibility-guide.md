# Guia de Acessibilidade

Diretrizes completas para implementar acessibilidade web seguindo padrões WCAG 2.1 AA.

## Diretrizes WCAG 2.1 AA

### Princípios Fundamentais

1. **Perceptível** - Informações e componentes da interface devem ser apresentados de forma que os usuários possam percebê-los
2. **Operável** - Componentes da interface e navegação devem ser operáveis
3. **Compreensível** - Informações e operação da interface devem ser compreensíveis
4. **Robusto** - O conteúdo deve ser robusto o suficiente para ser interpretado por uma ampla variedade de agentes de usuário, incluindo tecnologias assistivas

### Contraste de Cores (WCAG 2.1 AA)

- **Texto normal (menor que 18pt ou 14pt bold)**: Contraste mínimo de 4.5:1 com o fundo
- **Texto grande (18pt+ ou 14pt+ bold)**: Contraste mínimo de 3:1 com o fundo
- **Componentes não textuais** (ícones, botões): Contraste mínimo de 3:1
- **Estados interativos**: Contraste adequado em todos os estados (hover, focus, active)

**Ferramentas de verificação:**
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Inspector
- axe DevTools

### HTML Semântico

Use elementos HTML semânticos para estruturar o conteúdo:

```html
<!-- Correto -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Título Principal</h1>
    <section>
      <h2>Subtítulo</h2>
      <p>Conteúdo...</p>
    </section>
  </article>
</main>
<footer>Rodapé</footer>

<!-- Evitar -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

**Elementos semânticos importantes:**
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- `<h1>` a `<h6>` para hierarquia de títulos
- `<button>` para ações, `<a>` para navegação
- `<form>`, `<label>`, `<input>`, `<select>`, `<textarea>`

### ARIA (Accessible Rich Internet Applications)

Use ARIA quando HTML semântico não for suficiente:

**Atributos ARIA comuns:**
- `aria-label` - Rótulo descritivo quando texto visível não é suficiente
- `aria-labelledby` - Referência a elemento que rotula
- `aria-describedby` - Referência a elemento que descreve
- `aria-hidden="true"` - Ocultar elementos decorativos de screen readers
- `aria-live` - Regiões que anunciam mudanças dinâmicas
- `aria-expanded` - Estado de expansão (menus, accordions)
- `aria-current` - Item atual em uma lista de navegação
- `role` - Definir papel quando elemento HTML não é semântico

**Exemplos:**

```html
<!-- Botão com ícone apenas -->
<button aria-label="Fechar diálogo">
  <span aria-hidden="true">×</span>
</button>

<!-- Menu expansível -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" role="menu">
  <li role="menuitem"><a href="/item1">Item 1</a></li>
</ul>

<!-- Região ao vivo para notificações -->
<div aria-live="polite" aria-atomic="true" class="notifications">
  <!-- Conteúdo atualizado dinamicamente -->
</div>
```

### Navegação por Teclado

Todos os elementos interativos devem ser acessíveis via teclado:

**Ordem de Tab:**
- A ordem de tab deve seguir a ordem lógica do conteúdo
- Use `tabindex="0"` para elementos customizados que precisam ser focáveis
- Use `tabindex="-1"` para elementos que devem ser focáveis programaticamente, mas não na ordem de tab
- **Nunca use `tabindex > 0`** - quebra a ordem natural

**Indicadores de Foco:**
- Todos os elementos focáveis devem ter indicador de foco visível
- O foco deve ser claramente distinguível do estado hover
- Use `:focus-visible` para estilizar foco apenas quando navegação por teclado

```css
/* Indicador de foco visível */
button:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

/* Remover outline padrão apenas quando não navegação por teclado */
button:focus:not(:focus-visible) {
  outline: none;
}
```

**Atalhos de Teclado:**
- Documente atalhos de teclado disponíveis
- Evite conflitos com atalhos do navegador
- Forneça forma de desativar atalhos de teclado de caractere único

### Textos Alternativos

**Imagens:**
- Use `alt` descritivo para imagens informativas
- Use `alt=""` para imagens decorativas
- Imagens complexas (gráficos, diagramas) podem precisar descrição mais longa

```html
<!-- Imagem informativa -->
<img src="chart.png" alt="Gráfico mostrando crescimento de 15% nas vendas em 2023">

<!-- Imagem decorativa -->
<img src="decoration.png" alt="">

<!-- Imagem complexa -->
<img src="diagram.png" alt="Diagrama de arquitetura">
<details>
  <summary>Descrição detalhada do diagrama</summary>
  <p>O diagrama mostra três camadas: frontend, backend e banco de dados...</p>
</details>
```

**Ícones:**
- Ícones com texto: use `aria-hidden="true"` no ícone
- Ícones sem texto: use `aria-label` no elemento pai

```html
<!-- Ícone com texto -->
<button>
  <span aria-hidden="true">🔒</span>
  <span>Fechar</span>
</button>

<!-- Ícone sem texto -->
<button aria-label="Fechar">
  <span aria-hidden="true">×</span>
</button>
```

### Formulários Acessíveis

**Labels:**
- Sempre associe labels aos inputs usando `for` e `id` ou envolvendo o input
- Labels devem ser descritivos e claros

```html
<!-- Método 1: for/id -->
<label for="email">Email</label>
<input type="email" id="email" name="email">

<!-- Método 2: label envolvendo -->
<label>
  Email
  <input type="email" name="email">
</label>
```

**Mensagens de Erro:**
- Associe mensagens de erro aos inputs usando `aria-describedby`
- Anuncie erros imediatamente após validação
- Forneça instruções claras de como corrigir

```html
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  name="email"
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error" role="alert">
  Por favor, insira um email válido
</span>
```

**Campos Obrigatórios:**
- Use `aria-required="true"` ou `required`
- Indique visualmente campos obrigatórios (asterisco, texto)
- Não dependa apenas de cor para indicar obrigatoriedade

### Screen Readers e Tecnologias Assistivas

**Testes com Screen Readers:**
- **NVDA** (Windows, gratuito)
- **JAWS** (Windows, pago)
- **VoiceOver** (macOS/iOS, integrado)
- **TalkBack** (Android, integrado)

**Boas Práticas:**
- Teste com pelo menos um screen reader
- Verifique ordem de leitura (deve seguir ordem lógica)
- Garanta que conteúdo dinâmico seja anunciado
- Use `aria-live` para atualizações importantes

**Landmarks:**
- Use elementos semânticos ou `role` para criar landmarks
- Facilita navegação rápida em screen readers

```html
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

### Hierarquia de Contraste

Construa uma hierarquia de contraste de quatro níveis:

1. **Foreground (Primária)** - Texto principal, maior contraste
2. **Secundária** - Texto secundário, contraste médio
3. **Muted** - Texto terciário, contraste menor mas ainda legível
4. **Faint** - Texto muito sutil, apenas para elementos não essenciais

```css
:root {
  --foreground: oklch(0.15 0 0); /* Contraste 4.5:1+ */
  --foreground-secondary: oklch(0.35 0 0); /* Contraste 4.5:1+ */
  --foreground-muted: oklch(0.5 0 0); /* Contraste 3:1+ */
  --foreground-faint: oklch(0.65 0 0); /* Contraste 3:1+ */
}
```

### Testes de Acessibilidade

**Ferramentas Automatizadas:**
- **axe DevTools** - Extensão do Chrome/Firefox
- **WAVE** - Web Accessibility Evaluation Tool
- **Lighthouse** - Auditoria de acessibilidade
- **Pa11y** - Ferramenta de linha de comando

**Checklist Manual:**
- [ ] Navegar toda a interface apenas com teclado
- [ ] Verificar contraste de todas as cores de texto
- [ ] Testar com screen reader (pelo menos um)
- [ ] Verificar que todos os formulários têm labels
- [ ] Confirmar que imagens têm alt text apropriado
- [ ] Validar que indicadores de foco são visíveis
- [ ] Testar em diferentes tamanhos de zoom (até 200%)
- [ ] Verificar que conteúdo dinâmico é anunciado

### Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

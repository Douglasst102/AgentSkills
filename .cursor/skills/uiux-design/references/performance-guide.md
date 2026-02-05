# Guia de Performance Frontend

Diretrizes para otimizar performance e Core Web Vitals.

## Core Web Vitals

### LCP (Largest Contentful Paint)

**Meta:** < 2.5 segundos

**O que mede:** Tempo para o maior elemento de conteúdo visível ser renderizado.

**Otimizações:**
- Otimizar imagens (formato, tamanho, lazy loading)
- Preload recursos críticos
- Minimizar render-blocking CSS/JS
- Usar CDN para assets
- Otimizar fontes (preload, font-display: swap)

```html
<!-- Preload recursos críticos -->
<link rel="preload" href="hero-image.jpg" as="image">
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display -->
@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Mostra texto imediatamente, troca fonte quando carregar */
}
```

### FID (First Input Delay) / INP (Interaction to Next Paint)

**Meta:** < 100 milissegundos (FID) / < 200ms (INP)

**O que mede:** Tempo entre interação do usuário e resposta do navegador.

**Otimizações:**
- Minimizar JavaScript executando no main thread
- Code splitting para carregar apenas necessário
- Lazy load JavaScript não crítico
- Otimizar event handlers
- Usar Web Workers para processamento pesado

```javascript
// Lazy load componente pesado
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Debounce/throttle event handlers
const handleScroll = throttle(() => {
  // lógica
}, 100);

// Web Worker para processamento
const worker = new Worker('processor.js');
worker.postMessage(data);
```

### CLS (Cumulative Layout Shift)

**Meta:** < 0.1

**O que mede:** Instabilidade visual (elementos se movendo durante carregamento).

**Otimizações:**
- Definir dimensões para imagens e vídeos
- Reservar espaço para conteúdo dinâmico
- Evitar inserir conteúdo acima do conteúdo existente
- Usar font-display: swap com fallback adequado
- Preferir transform ao invés de propriedades que causam reflow

```html
<!-- Dimensões explícitas -->
<img 
  src="image.jpg" 
  width="800" 
  height="600"
  alt="Descrição"
>

<!-- Reservar espaço para conteúdo dinâmico -->
<div class="ad-container" style="min-height: 250px;">
  <!-- Ad será inserido aqui -->
</div>
```

```css
/* Evitar */
.element {
  top: 100px; /* Causa layout shift */
}

/* Preferir */
.element {
  transform: translateY(100px); /* Não causa layout shift */
}
```

## Otimização de Imagens

### Formatos Modernos

**WebP:**
- 25-35% menor que JPEG
- Suporte amplo em navegadores modernos
- Fallback para JPEG necessário

**AVIF:**
- 50% menor que JPEG
- Melhor qualidade
- Suporte crescente

**Implementação:**
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Descrição">
</picture>
```

### Responsive Images

**srcset e sizes:**
```html
<img 
  src="image-800w.jpg"
  srcset="
    image-400w.jpg 400w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w,
    image-1600w.jpg 1600w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Descrição"
  loading="lazy"
>
```

### Lazy Loading

**Nativo:**
```html
<img src="image.jpg" loading="lazy" alt="Descrição">
<iframe src="video.html" loading="lazy"></iframe>
```

**Intersection Observer (mais controle):**
```javascript
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

## Code Splitting

### Route-based Splitting

```javascript
// React Router
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>
```

### Component-based Splitting

```javascript
// Componente pesado carregado sob demanda
const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowChart(true)}>Mostrar Gráfico</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <Chart />
        </Suspense>
      )}
    </>
  );
}
```

### Dynamic Imports

```javascript
// Carregar biblioteca apenas quando necessário
async function handleExport() {
  const { exportToPDF } = await import('./pdf-exporter');
  exportToPDF(data);
}
```

## Critical CSS

**Estratégia:**
1. Identificar CSS acima da dobra (above-the-fold)
2. Inline critical CSS no `<head>`
3. Carregar CSS restante de forma assíncrona

```html
<head>
  <!-- Critical CSS inline -->
  <style>
    /* CSS crítico para renderização inicial */
    body { margin: 0; }
    .header { ... }
    .hero { ... }
  </style>
  
  <!-- CSS não crítico carregado assincronamente -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

**Ferramentas:**
- Critical (npm package)
- PurgeCSS para remover CSS não usado
- PostCSS para otimizações

## Otimização de Fontes

### Font Loading Strategy

```css
@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Mostra texto imediatamente */
  font-weight: 400;
}
```

```html
<!-- Preload fontes críticas -->
<link 
  rel="preload" 
  href="font.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>
```

### Subsetting

- Remover glifos não usados
- Reduz tamanho do arquivo de fonte
- Ferramentas: pyftsubset, glyphhanger

## Caching

### HTTP Caching

```html
<!-- Cache de longa duração para assets estáticos -->
<!-- Configurar no servidor -->
Cache-Control: public, max-age=31536000, immutable
```

### Service Workers

```javascript
// Cache estratégico
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open('images').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

## Minificação e Compressão

**JavaScript:**
- Minificar código (remover espaços, comentários)
- Tree shaking (remover código não usado)
- Ferramentas: Terser, esbuild, webpack

**CSS:**
- Minificar CSS
- Remover CSS não usado (PurgeCSS)
- Ferramentas: cssnano, PostCSS

**HTML:**
- Minificar HTML
- Remover comentários e espaços desnecessários

**Compressão:**
- Gzip ou Brotli no servidor
- Reduz tamanho de transferência significativamente

## Monitoramento de Performance

### Ferramentas

**Lighthouse:**
- Auditoria completa de performance
- Core Web Vitals
- Sugestões de otimização

**Chrome DevTools:**
- Performance tab para profiling
- Network tab para análise de recursos
- Coverage tab para código não usado

**Web Vitals Extension:**
- Monitora Core Web Vitals em tempo real
- Útil durante desenvolvimento

**Real User Monitoring (RUM):**
- Web Vitals API para coletar métricas reais
- Google Analytics, New Relic, etc.

```javascript
// Coletar Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Enviar para seu serviço de analytics
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### Métricas para Monitorar

- **LCP**: Tempo de carregamento do maior elemento
- **FID/INP**: Responsividade a interações
- **CLS**: Estabilidade visual
- **TTFB**: Time to First Byte
- **FCP**: First Contentful Paint
- **TBT**: Total Blocking Time

## Checklist de Performance

- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms/200ms
- [ ] CLS < 0.1
- [ ] Imagens otimizadas (formato, tamanho, lazy loading)
- [ ] Code splitting implementado
- [ ] Critical CSS inline
- [ ] Fontes otimizadas (preload, font-display)
- [ ] JavaScript minificado e tree-shaken
- [ ] Caching configurado
- [ ] Compressão (Gzip/Brotli) habilitada
- [ ] Performance monitorada em produção

## Recursos Adicionais

- [Web.dev - Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://github.com/GoogleChrome/web-vitals)

---
name: frontend-dev
description: Desenvolve interfaces frontend, cria componentes React/Vue/Angular, e implementa gerenciamento de estado. Use quando precisar implementar frontend, criar componentes, ou otimizar performance.
---

# Frontend Development

Skill para desenvolvimento completo de aplicações frontend modernas.

## Quando Usar

- Implementação de interfaces
- Criação de componentes
- Configuração de gerenciamento de estado
- Otimização de performance
- Criação de testes frontend

## Práticas de plataforma (dados e API)

- **Sem persistência de negócio no cliente:** não usar `localStorage`/IndexedDB ou bases locais para dados de domínio **salvo** quando a arquitetura documentar exceção explícita; estado volátil de UI e cache de leitura curta podem existir, mas a fonte autoritativa é sempre o **backend**
- **Sem segredos:** nenhuma senha de serviço, chave de API privada ou URL interna hardcoded; usar variáveis de ambiente públicas (`NEXT_PUBLIC_*`, `VITE_*`, etc.) apenas para o que for seguro expor ao browser
- **Integração:** toda informação dinâmica vem do backend (REST + **JWT** quando auth existir); não acessar APIs externas privadas diretamente do browser se o contrato do projeto exige passagem pelo BFF
- **Páginas e renderização:** implementar conforme decisões em `architecture/` (**SSG**, **SSR**, **ISR**, fetch client-side com **SWR**/React Query/etc.) — registrar divergências com o arquiteto

## Instruções

1. **Configuração do Projeto**
   - Configure framework escolhido (React/Vue/Angular)
   - Configure build tools (Vite, Webpack, etc.)
   - Configure linting e formatação
   - Configure testes (Jest, Vitest, etc.)

2. **Implementação de Componentes**
   - Crie componentes baseados no design system
   - Implemente componentes reutilizáveis
   - Siga padrões de código definidos
   - Implemente TypeScript (quando aplicável)

3. **Gerenciamento de Estado**
   - Configure solução de estado (Redux, Zustand, Context API)
   - Implemente actions e reducers
   - Evite persistência local de dados de negócio; se usar persistência de estado (ex.: Redux Persist), restrinja a preferências de UI ou fluxos explicitamente aprovados na arquitetura — **não** armazenar segredos nem substituir o backend como fonte de verdade

4. **Integração com APIs**
   - Configure cliente HTTP (Axios, Fetch)
   - Implemente chamadas de API
   - Configure tratamento de erros
   - Implemente loading states

5. **Roteamento**
   - Configure roteamento (React Router, Vue Router, etc.)
   - Implemente rotas protegidas
   - Configure lazy loading de rotas

6. **Otimização de Performance**
   - Otimize Core Web Vitals (LCP < 2.5s, FID/INP < 100ms/200ms, CLS < 0.1)
   - Implemente code splitting
   - Configure lazy loading de componentes e imagens
   - Otimize imagens (formatos modernos, srcset, sizes)
   - Configure caching (HTTP caching, Service Workers)
   - Minimize e comprima assets (JavaScript, CSS, HTML)
   - Use critical CSS inline
   - Otimize fontes (preload, font-display: swap)
   - Consulte `.cursor/skills/uiux-design/references/performance-guide.md` para diretrizes completas

7. **Acessibilidade na Implementação**
   - Use HTML semântico (header, nav, main, article, section, footer)
   - Implemente ARIA quando necessário (aria-label, aria-describedby, aria-expanded, etc.)
   - Garanta navegação por teclado (tabindex, indicadores de foco)
   - Associe labels aos inputs (for/id ou envolvendo)
   - Forneça textos alternativos para imagens (alt)
   - Implemente indicadores de foco visíveis (:focus-visible)
   - Teste com screen readers (NVDA, JAWS, VoiceOver, TalkBack)
   - Verifique contraste de cores (WCAG 2.1 AA)
   - Consulte `.cursor/skills/uiux-design/references/accessibility-guide.md` para diretrizes completas

8. **Mobile-First Implementation**
   - Implemente touch targets adequados (mínimo 44x44px)
   - Use unidades relativas (%, em, rem) para layouts fluidos
   - Implemente media queries com min-width (mobile-first)
   - Use input types apropriados para teclados mobile (email, tel, number, url)
   - Implemente gestos quando apropriado (swipe, pinch-to-zoom)
   - Teste em dispositivos reais, não apenas emuladores
   - Consulte `.cursor/skills/uiux-design/references/mobile-first-guide.md` para diretrizes completas

9. **User Feedback Implementation**
   - Implemente loading states para operações assíncronas
   - Crie mensagens de erro claras e acionáveis
   - Forneça feedback de sucesso para ações completadas
   - Implemente estados vazios informativos
   - Use transições suaves para feedback visual
   - Considere aria-live para anúncios dinâmicos

10. **Testes**
   - Crie testes unitários de componentes
   - Crie testes de integração
   - Configure testes de acessibilidade (axe, WAVE, Lighthouse)
   - Teste performance (Lighthouse, Web Vitals)
   - Configure testes E2E (opcional)

11. **Validação Pós-Desenvolvimento**
   - Atualizar tarefas realizadas com checkbox checked
   - Atualizar status de desenvolvimento
   - Verificar logs se necessário
   - Executar testes quando possível
   - Verificar acessibilidade (Lighthouse, axe)
   - Verificar Core Web Vitals
   - Testar em dispositivos móveis reais
   - Reiniciar serviços se necessário
   - Caso necessário, adicionar como tarefas os TODOs não implementados

## Outputs

Salve os seguintes arquivos em `frontend/`:
- `src/` - Código fonte
- `components/` - Componentes
- `tests/` - Testes
- `package.json` - Dependências
- `README.md` - Documentação

## Referências

- `references/frontend-patterns.md` — padrões e melhores práticas
- `.cursor/skills/uiux-design/references/accessibility-guide.md` — diretrizes de acessibilidade
- `.cursor/skills/uiux-design/references/mobile-first-guide.md` — diretrizes mobile-first
- `.cursor/skills/uiux-design/references/performance-guide.md` — otimização de performance

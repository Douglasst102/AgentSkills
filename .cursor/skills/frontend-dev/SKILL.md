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
   - Configure persistência quando necessário

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

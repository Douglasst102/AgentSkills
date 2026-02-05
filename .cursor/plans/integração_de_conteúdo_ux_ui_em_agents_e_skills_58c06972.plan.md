---
name: Integração de Conteúdo UX/UI em Agents e Skills
overview: Integrar o conteúdo detalhado de UX/UI do arquivo Dev_Uxui.md nos agents e skills existentes, enriquecendo especialmente aspectos de acessibilidade, performance, mobile-first, user feedback e documentação que estão pouco cobertos atualmente.
todos: []
---

# Integração de Conteúdo UX/UI em Agents e Skills

## Análise do Conteúdo Disponível

O arquivo `artefatos/UXUI/Dev_Uxui.md` contém um guia completo de princípios UX/UI organizados em 11 seções principais:

1. **Visual Design** - Hierarquia, cores, tipografia, contraste, consistência
2. **Interaction Design** - Navegação, componentes, CTAs, responsivo, animações
3. **Accessibility** - WCAG, HTML semântico, alt text, navegação por teclado
4. **Performance Optimization** - Imagens, lazy loading, code splitting, Core Web Vitals
5. **User Feedback** - Mecanismos de feedback, loading, erros, analytics
6. **Information Architecture** - Organização, labeling, busca, sitemap
7. **Mobile-First Design** - Mobile-first, touch targets, gestos, thumb zones
8. **Consistency** - Design system, terminologia, posicionamento
9. **Testing and Iteration** - A/B testing, heatmaps, feedback, iteração
10. **Documentation** - Style guide, padrões, fluxos, assets
11. **Responsive Design** - Fluid layouts, media queries, imagens, tipografia responsiva

## Estrutura Atual

### Agents

- `.cursor/agents/uiux-designer.md` - Focado em wireframes, mockups, design system, protótipos
- `.cursor/agents/frontend-developer.md` - Implementação frontend

### Skills

- `.cursor/skills/uiux-design/SKILL.md` - Integra interface-design, focado em craft e qualidade visual
- `.cursor/skills/interface-design/SKILL.md` - Focado em craft, layering sutil, expressão infinita
- `.cursor/skills/frontend-dev/SKILL.md` - Desenvolvimento frontend técnico

## Plano de Integração

### 1. Enriquecer `.cursor/agents/uiux-designer.md`

**Adicionar seções:**

- **Acessibilidade** - Diretrizes WCAG, HTML semântico, navegação por teclado, assistive technologies
- **Mobile-First Design** - Abordagem mobile-first, touch targets (44x44px), gestos, thumb zones
- **Information Architecture** - Organização de conteúdo, labeling, busca, sitemap
- **User Feedback** - Mecanismos de feedback, loading indicators, mensagens de erro
- **Testing and Iteration** - A/B testing, heatmaps, session recordings, iteração baseada em dados

**Expandir seções existentes:**

- **Visual Design** - Adicionar detalhes sobre contraste WCAG 2.1 AA, hierarquia visual
- **Interaction Design** - Adicionar detalhes sobre animações judiciosas, componentes familiares
- **Documentation** - Expandir com style guide, padrões de componentes, fluxos de usuário

### 2. Expandir `.cursor/skills/uiux-design/SKILL.md`

**Adicionar novas seções:**

- **Acessibilidade Detalhada** - WCAG 2.1 AA, HTML semântico, navegação por teclado, screen readers, contraste
- **Performance Optimization** - Core Web Vitals (LCP, FID, CLS), otimização de imagens, lazy loading
- **Mobile-First Design** - Touch targets, gestos, thumb zones, breakpoints baseados em conteúdo
- **User Feedback** - Loading states, error messages, success feedback, analytics
- **Information Architecture** - Organização lógica, labeling claro, busca efetiva, sitemap
- **Testing and Iteration** - A/B testing, heatmaps, session recordings, feedback contínuo

**Expandir seções existentes:**

- **Design System** - Adicionar guidelines de acessibilidade, performance, mobile-first
- **Especificações de Componentes** - Incluir estados de acessibilidade, feedback, mobile

### 3. Criar `.cursor/skills/uiux-design/references/accessibility-guide.md`

**Novo arquivo de referência contendo:**

- Diretrizes WCAG 2.1 AA completas
- HTML semântico e ARIA
- Navegação por teclado
- Screen readers e assistive technologies
- Contraste de cores e legibilidade
- Testes de acessibilidade

### 4. Criar `.cursor/skills/uiux-design/references/mobile-first-guide.md`

**Novo arquivo de referência contendo:**

- Princípios mobile-first
- Touch targets (mínimo 44x44px)
- Gestos comuns (swipe, pinch-to-zoom)
- Thumb zones para elementos importantes
- Breakpoints baseados em conteúdo
- Testes em dispositivos reais

### 5. Criar `.cursor/skills/uiux-design/references/performance-guide.md`

**Novo arquivo de referência contendo:**

- Core Web Vitals (LCP, FID, CLS)
- Otimização de imagens (srcset, sizes)
- Lazy loading estratégico
- Code splitting
- Critical CSS
- Monitoramento de performance

### 6. Expandir `.cursor/skills/frontend-dev/SKILL.md`

**Adicionar seções:**

- **Acessibilidade na Implementação** - HTML semântico, ARIA, navegação por teclado
- **Performance Frontend** - Core Web Vitals, otimização de assets, lazy loading
- **Mobile-First Implementation** - Touch targets, gestos, media queries baseadas em conteúdo
- **User Feedback Implementation** - Loading states, error handling, success feedback

**Expandir seções existentes:**

- **Otimização de Performance** - Adicionar Core Web Vitals, otimização de imagens responsivas
- **Testes** - Adicionar testes de acessibilidade, testes de performance

### 7. Expandir `.cursor/agents/frontend-developer.md`

**Adicionar responsabilidades:**

- Implementar acessibilidade (WCAG 2.1 AA)
- Otimizar Core Web Vitals
- Implementar mobile-first
- Adicionar feedback de usuário (loading, errors, success)

**Expandir validação:**

- Verificar acessibilidade
- Verificar Core Web Vitals
- Testar em dispositivos móveis
- Verificar feedback de usuário

## Estrutura de Arquivos a Modificar/Criar

### Modificar

- `.cursor/agents/uiux-designer.md`
- `.cursor/skills/uiux-design/SKILL.md`
- `.cursor/skills/frontend-dev/SKILL.md`
- `.cursor/agents/frontend-developer.md`

### Criar

- `.cursor/skills/uiux-design/references/accessibility-guide.md`
- `.cursor/skills/uiux-design/references/mobile-first-guide.md`
- `.cursor/skills/uiux-design/references/performance-guide.md`

## Princípios de Integração

1. **Não duplicar conteúdo** - Integrar de forma complementar, não repetitiva
2. **Manter foco** - Cada arquivo mantém seu propósito principal
3. **Referências cruzadas** - Usar referências para guias detalhados
4. **Preservar craft** - Não diluir o foco em craft do interface-design
5. **Aplicabilidade prática** - Conteúdo deve ser acionável, não apenas teórico

## Mapeamento de Conteúdo

| Conteúdo Dev_Uxui.md | Destino Principal | Destino Secundário |
|---------------------|-------------------|-------------------|
| Visual Design | uiux-design/SKILL.md | uiux-designer.md |
| Interaction Design | uiux-design/SKILL.md | uiux-designer.md |
| Accessibility | accessibility-guide.md (novo) | uiux-design/SKILL.md, frontend-dev/SKILL.md |
| Performance Optimization | performance-guide.md (novo) | frontend-dev/SKILL.md |
| User Feedback | uiux-design/SKILL.md | frontend-dev/SKILL.md |
| Information Architecture | uiux-design/SKILL.md | uiux-designer.md |
| Mobile-First Design | mobile-first-guide.md (novo) | uiux-design/SKILL.md, frontend-dev/SKILL.md |
| Consistency | uiux-design/SKILL.md | uiux-designer.md |
| Testing and Iteration | uiux-design/SKILL.md | uiux-designer.md |
| Documentation | uiux-design/SKILL.md | uiux-designer.md |
| Responsive Design | mobile-first-guide.md | frontend-dev/SKILL.md |
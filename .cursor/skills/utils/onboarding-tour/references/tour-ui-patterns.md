# Padrões de UI para Product Tour

Referência para o roteiro (`tour-spec.md`) e o brief frontend. Preferir implementação própria (spotlight + popover + provider). Libs externas só se o projeto já usar ou o usuário pedir.

## Anatomia

| Peça | Responsabilidade |
|------|------------------|
| `TourProvider` | Estado do tour (ativo, step index, config), registra passos |
| `TourSpotlight` | Overlay com recorte (highlight) do alvo; bloqueia clique fora se modal |
| `TourPopover` | Card com título, corpo, progressão, CTAs (voltar / próximo / pular / concluir) |
| Step config | Lista declarativa de passos (alvo, copy, placement) |

## Tipos de passo

1. **Spotlight** — destaca um elemento (`data-tour="..."` ou seletor estável)
2. **Centered** — modal/popover central sem alvo (intro/outro)
3. **Coach mark** — tip discreto sem overlay pesado (uso pontual)

Default para onboarding de feature: spotlight + popover.

## Contrato de um passo

```ts
type TourStep = {
  id: string;
  target?: string;          // data-tour id ou seletor
  title: string;
  body: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  spotlightPadding?: number;
  nextLabel?: string;
  backLabel?: string;
  allowSkip?: boolean;      // default true
};
```

## Fluxos obrigatórios

- **Next / Back** — navegação entre passos
- **Skip tour** — encerra e marca `skipped` (ou `seen`, conforme `activation-rules`)
- **Complete** — último passo marca `completed`
- **Dismiss parcial** — Escape / botão fechar; opcionalmente persiste `currentStep`
- **Alvo ausente** — pular passo, logar warning, ou abortar tour com mensagem; documentar a escolha no `tour-spec.md`

## Acessibilidade (mínimo)

- Foco no popover ao abrir; restaurar foco ao fechar
- Trap de foco enquanto o tour modal estiver ativo
- Teclado: Tab, Shift+Tab, Escape (dismiss/skip), Enter no CTA primário
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` / `aria-describedby`
- Anunciar mudança de passo (`aria-live="polite"`)
- Respeitar `prefers-reduced-motion` (sem animação de pan/zoom agressiva)
- Contraste WCAG 2.1 AA no popover e no texto do overlay
- Não depender só de cor para indicar o passo atual (usar número “2 de 5”)

## Mobile

- Touch targets ≥ 44×44px nos CTAs
- Placement `auto` preferindo espaço disponível; se o alvo for off-screen, scroll suave até ele (ou passo centered)
- Overlay não deve impedir scroll do conteúdo destacado quando necessário para leitura

## Integração na página

1. Marcar alvos com `data-tour="<stepId>"` (preferível a seletores CSS frágeis)
2. Montar `TourProvider` no layout da rota/feature
3. No mount: consultar progresso (GET); se deve exibir, `startTour()`
4. Em skip/complete: PUT progresso; desmontar overlay
5. Não iniciar tour durante loading crítico ou empty-state que remova os alvos

## Exemplo React (referência)

```tsx
// Pseudocódigo — adaptar à stack do projeto
<TourProvider steps={billingTourSteps} tourId="billing-v2">
  <Page>
    <h1 data-tour="intro">Faturamento</h1>
    <ExportButton data-tour="export" />
  </Page>
  <TourSpotlight />
  <TourPopover />
</TourProvider>
```

## Anti-padrões

- Tour sem skip
- Seletores por classe CSS gerada / ordem do DOM
- Persistir progresso só em `localStorage` como fonte de verdade
- Mais de ~5–7 passos sem justificativa (quebrar em tours por feature)
- Bloquear a UI inteira em mobile sem CTA claro de pular

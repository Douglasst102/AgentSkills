# Evidência em relatórios de revisão

## Trechos de código (obrigatório para achados relevantes)

- Cada achado não trivial deve incluir **path**, linhas quando possível e **bloco fenced** com o trecho do código (ou do diff) que fundamenta o ponto.
- Relatórios só com texto genérico, sem citação, **não** atendem o critério de pronto.
- Achados de severidade alta (P0/P1, Crítico/Alto, impacto Alto na lente de código) **exigem** snippet; descrição textual isolada é incompleta.

## Perfil sugerido para correção

Em **cada** achado registrado nas três lentes e no mapa consolidado, indique **perfil sugerido**: quem tende a corrigir (ex.: `backend`, `frontend`, `frontend e UI`, `frontend e segurança`, `backend e segurança`, `DevOps`, `full-stack`, `dados`, `QA`). Use combinações quando a correção cruzar camadas.

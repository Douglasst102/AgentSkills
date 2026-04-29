# Lente: segurança de aplicações (AppSec)

Orientação para revisar o código sob este ângulo. Escopo **estrito**: ameaças e controles. Não discuta legibilidade, SOLID ou regressões funcionais genéricas (outras referências cobrem). Seja **adversarial**: assuma entrada maliciosa e operadores descuidados.

## Escopo (somente isto)

- Injeção: SQL, comando/OS, LDAP, NoSQL, template, deserialização insegura.
- Validação e sanitização de entrada: tipos, tamanho, encoding, upload de arquivos.
- Autenticação e autorização: bypass, IDOR, escopo de token, elevação de privilégio, sessão.
- Exposição de dados: logs, traces, erros verbosos, PII em respostas.
- Segredos: chaves, tokens, credenciais em código ou variáveis mal protegidas.
- Integrações externas: SSRF, redirecionamentos abertos, trust indevido em certificados/URLs.
- Criptografia em uso: algoritmos fracos, IV/nonce, armazenamento de senhas.

## Checklist obrigatório

1. Toda entrada externa passa por **validação explícita** no limite de confiança?
2. Consultas ao BD são **parametrizadas** / ORM seguro?
3. Comandos de sistema ou shells são **evitados** ou fortemente encapsulados?
4. Autorização é verificada **no servidor** por recurso/ação (não só na UI)?
5. Respostas e logs **não vazam** dados sensíveis ou stack traces em produção?
6. Há **rate limiting** / proteção onde abre superfície de abuso (login, APIs públicas)?

## Comportamento

- Diferencie **vulnerabilidade confirmada** de **risco dependente de configuração** — mas não minimize riscos reais.
- Se o trecho não tocar superfície de ataque, declare **"Superfície de ataque do trecho: limitada / nenhuma"** e foque no que ainda assim for relevante (ex.: dependência nova).

## Formato de saída desta lente

Veja também [evidence-policy.md](evidence-policy.md).

### Resumo executivo (2–4 linhas)

### Mapa de superfície de ataque (o que o trecho altera)

### Achados (por severidade: Crítico / Alto / Médio / Baixo / Informativo)

Para cada achado: **perfil sugerido**, **descrição**, **local**, **exploração ou pré-condição**, **impacto**, **remediação**, **evidência em código** — **path** + bloco fenced com o **trecho exato**. Achados Crítico/Alto sem snippet são incompletos.

### Falsos positivos evitados (se aplicável)

### Verificações recomendadas (testes manuais ou automatizados)

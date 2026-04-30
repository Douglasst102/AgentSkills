# TODO

Ajustar QA
ok mudar de python para javascript através do node.js
extenções: playwrite test for vscode, prettier code formater, intelicode auto complete
ok Verificar a necessidade para automatizar os testes que não serão feitos utilizando o playwrite (testes unitários e de integração)
ok Verificar a correta montagem no container do playwrite os diretórios necessáriospara os testes e relatórios do playwrite (e2e)

ok Leia os arquivos em @revision entenda-os e use-os para criar o subagent "code-reviewer" e a skill "code-review" de modo que o subagent se utilise da skill para revisar o trecho de codigo pelos aspectos clean code, segurança e regressão, e ao final seja consolidado um relatório final. Os arquivos que detalham as regras devem ficar no diretório "references" da skill. Os outputs devem ir para o diretório "revision" . O exemplo veio de uma aplicação chamada "fabdoc" então remova toda referência desta aplicação de modo que o subagent e a skill sirvam para qualquer apllicação (mais amplo). O exemplo fala muito de "diff", porém no caso mais geral será solicitado para ser analisado uma parte do código ou um módulo da aplicação, se for solicitado para analizar "o que foi implementado" ou algo semelhante pode-se recorrer ao diff. Cada apontamento relatado deve sugerir o tipo de dev que fará a correção, exemplo: "frontend", "backend", "frontend e UI", "frontend e segurança", "backend e segurança"...


## Segurança

    - Estritamente proibido usuários, senhas, configurações ou endpoints hardcoded no código fonte, qualquer uma dessas informações devem ser tratadas via arquivo de ambiente local (.env) que deverá ser explicatamente ignorado através do .gitignore.
    - Autenticação de usuários: em caso de autenticação de usuários, deverá ser feito em tabela exclusiva no banco de dados, armazenando apenas o hash SHA256 da senha do usuário.
    - Autenticação entre serviços: Backend e Frontend de comunicação via HTTP/Rest, autenticando via JWT.
    - Detalhe toda e qualquer modelagem de dados que for necessária para autenticação dos usuários, gerenciamento de tokens ou expiricy.


## Especificidades de cada componente

    1. Frontend:
        - Com base nas regras de negócio e no restante da documentação, defina e detalhe quais são as páginas que deverão ser criadas para esse projeto. Explique a necessidade de cada e qual a melhor estratégia de renderização para cada uma delas: SSG/SSR/ISR/SWR.
        - O frontend não persiste, e não acessa qualquer informação que não esteja disponível no backend.

    2. Backend:
        - Deve expor publicamente uma documentação dos métodos da API através do OpenAPI.
        - Deve tratar corretamente a questão de CORS.
        - O backend atende a todas as necessidades do frontend (BFF), seja fornecendo os dados de sua própria persistência, seja fornecendo dados como proxy de uma API externa.
        - O backend será proxy da API externa se for o caso.
        - Algumas requisições do frontend podem exigir mais de uma chamada a APIs externas, e/ou composição com dados do database. Use o padrão de Facade para esses casos e elimine a complexidade do frontend.
        - Com base nessas informações regras de negócio da aplicação, a documentação da API externa, documente a API Design que será exposta por esse backend. Cada método precisa ser muito bem documentado, com assinatura coerente, objetivo claro e tratando todas as boas práticas arqutieturais de desacoplamento, atomicidade, consistência, isolamento e idempotência.
        
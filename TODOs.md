# TODO

Ajustar QA
ok mudar de python para javascript através do node.js
extenções: playwrite test for vscode, prettier code formater, intelicode auto complete
ok Verificar a necessidade para automatizar os testes que não serão feitos utilizando o playwrite (testes unitários e de integração)
ok Verificar a correta montagem no container do playwrite os diretórios necessáriospara os testes e relatórios do playwrite (e2e)

ok Leia os arquivos em @revision entenda-os e use-os para criar o subagent "code-reviewer" e a skill "code-review" de modo que o subagent se utilise da skill para revisar o trecho de codigo pelos aspectos clean code, segurança e regressão, e ao final seja consolidado um relatório final. Os arquivos que detalham as regras devem ficar no diretório "references" da skill. Os outputs devem ir para o diretório "revision" . O exemplo veio de uma aplicação chamada "fabdoc" então remova toda referência desta aplicação de modo que o subagent e a skill sirvam para qualquer apllicação (mais amplo). O exemplo fala muito de "diff", porém no caso mais geral será solicitado para ser analisado uma parte do código ou um módulo da aplicação, se for solicitado para analizar "o que foi implementado" ou algo semelhante pode-se recorrer ao diff. Cada apontamento relatado deve sugerir o tipo de dev que fará a correção, exemplo: "frontend", "backend", "frontend e UI", "frontend e segurança", "backend e segurança"...
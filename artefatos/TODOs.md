# TODO

ok As paginas "/people", "/projects" e "/documents" devem ter páginas de visulização, de edição e de adicionar novo item.

ok Deve ter uma página para instanciar nós e relacionamentos. De modo que seja selecionado um nó ou relacionamento definidos no schema "/admin/schema" (web\src\data\schemaData.ts) para serem instanciados. Com isso abre um formulário com os campos previstos no schema.

ok ## Página de Importação de CSV

Criar uma página de importação de dados CSV reutilizando a estrutura da página "/admin/schema", mantendo a exibição do grafo.

### Estrutura da Página

1. **Menu Lateral**
   - Botão "Importar CSV" para upload de arquivos CSV
   - Lista de CSVs importados (exibir nome do arquivo e data de upload)

2. **Área Principal**
   - Manter a visualização do grafo (reutilizar componente GraphCanvas)
   - Painel lateral para configuração de mapeamento (similar ao PropertiesPanel)

### Funcionalidades de Mapeamento

#### Para Nós (ao clicar em um nó no grafo)

1. Exibir o tipo do nó (nome do nó) no topo do painel
2. Select para escolher qual CSV será usado para este nó
3. Lista de propriedades do nó:
   - À esquerda: nome da propriedade
   - À direita: select com as colunas do CSV selecionado para mapear
4. Visual feedback: exibir símbolo '✓' (check verde) sobre o nó no grafo quando configurado

#### Para Relacionamentos (ao clicar em um relacionamento no grafo)

1. Exibir o tipo do relacionamento (nome) no topo do painel
2. Select para escolher qual CSV será usado para este relacionamento
3. Campo "Nó de Origem":
   - À esquerda: tipo/nome do nó de origem
   - À direita: select com colunas do CSV para identificar o nó de origem
4. Campo "Nó de Destino":
   - À esquerda: tipo/nome do nó de destino
   - À direita: select com colunas do CSV para identificar o nó de destino
5. Lista de propriedades do relacionamento:
   - À esquerda: nome da propriedade
   - À direita: select com as colunas do CSV selecionado para mapear
6. Visual feedback: exibir símbolo '✓' (check verde) sobre o relacionamento no grafo quando configurado

### Fluxo de Trabalho

1. **Upload e Seleção:**
   - Usuário faz upload de CSV(s) através do botão "Importar CSV"
   - CSVs aparecem na lista lateral

2. **Configuração:**
   - Usuário clica em nós/relacionamentos no grafo
   - Seleciona CSV e mapeia propriedades/colunas
   - Visual feedback com check verde quando configurado

3. **Salvar Configuração:**
   - Botão "Salvar" armazena toda a lógica de mapeamento (persistir no PostgreSQL)
   - Após salvar, habilitar botão "Previsualizar"

4. **Preview:**
   - Botão "Previsualizar" exibe relatório com:
     - Todas as instâncias de nós que serão criadas (com suas propriedades mapeadas)
     - Todos os relacionamentos que serão criados (com suas propriedades mapeadas)
   - Ao final do preview, exibir botão "Importar"

5. **Importação:**
   - Botão "Importar" executa a importação dos dados para o Neo4j
   - Processar cada linha do CSV conforme o mapeamento configurado
   - Criar nós e relacionamentos no grafo

### Requisitos Técnicos

- Reutilizar componentes existentes: GraphCanvas, estrutura de layout de "/admin/schema"
- Criar novos componentes: CSVUpload, CSVList, MappingPanel, PreviewReport
- Persistir configurações de mapeamento no PostgreSQL (jsonb)
- API endpoints para: upload CSV, salvar mapeamento, preview, importação
- Validação de dados antes da importação
- Feedback visual durante o processo de importação

Em "/admin/schema" ao passar o cursor sobre um nó ou relacionamento deve exibir suas propriedades.

ok Nas paginas "/people", "/projects" e "/documents" nas páginas de visulização e de edição devem ser exibidas todas as informações relacionadas e (na página de edição) devem permitir adicionar relações com outras informações (nós) conforme o schema em "/admin/schema" (web\src\data\schemaData.ts).

chaves técnicas para labels em português: dataInicio → "Data de Início" ; funcao → "Função" salvar jsonb no postgre. Assim como os relacionamentos em RelationsDisplay.tsx.

o schema de "/admin/schema" agora em (web\src\data\schemaData.ts) deverá ser persistido como jsonb no postgre.

As labels customizadas de propriedades (chaves técnicas para labels em português) atualmente estão sendo persistidas no localStorage (web\src\utils\propertyLabels.ts). Esta implementação deve ser removida e substituída por persistência no PostgreSQL (jsonb), similar ao que será feito com o schema e os relacionamentos. As funções saveCustomLabel, removeCustomLabel e getCustomLabels devem ser refatoradas para fazer chamadas à API que persistem no banco de dados.


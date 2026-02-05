# Boas práticas

Crie volumes para o local onde há persistencia de dados.

Mantenha os containers ephemerals, isto é, que você possa parar, reiniciar e ele continue funcionando sem maiores problemas.

Seguir o princípio 6 do 12 factor app. O processo deve ser stateless, e qualquer persistência precisa ser feito em alguma aplicação que mantém o estado, mais comumente uma database.

Não inclua arquivos desnecessários no seu Dockerfile, isso pode resultar em falhas de segurança e aumento no tamanho da imagem.

Use .dockerignore para evitar "lixo" no Dockerfile.

Use multi-staging para otimizar o tamanho da imagem.

Não instale pacotes desnecessários.

Desacople as aplicações. Nunca usar um container para mais de um objetivo. Por exemplo, o Wordpress deve rodar em um container, enquanto a database roda em outro, nunca ambos em um container.

Minimize o número de camadas, isso geralmente otimiza o tamanho da imagem.

Use e abuse da camada de cache do Docker.

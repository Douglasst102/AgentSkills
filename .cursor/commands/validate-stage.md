# Validar Etapa

Valida os artefatos e completude de uma etapa específica da cadeia de desenvolvimento.

## Uso

`/validate-stage <nome-da-etapa>`

Exemplos:
- `/validate-stage business` - Valida análise de negócios
- `/validate-stage requirements` - Valida especificação de requisitos
- `/validate-stage architecture` - Valida design de arquitetura

## Validações Realizadas

1. **Completude de Artefatos** - Verifica se todos os artefatos esperados foram gerados
2. **Qualidade dos Documentos** - Valida estrutura e conteúdo dos documentos
3. **Dependências** - Verifica se as dependências de entrada estão satisfeitas
4. **Consistência** - Verifica consistência com etapas anteriores
5. **Rastreabilidade** - Valida rastreabilidade de requisitos (quando aplicável)

## Etapas Disponíveis

- `business` - Análise de negócios
- `processes` - Mapeamento de processos
- `requirements` - Especificação de requisitos
- `architecture` - Design de arquitetura
- `technical` - Especificações técnicas
- `infrastructure` - Infraestrutura e DevOps
- `design` - Design UI/UX
- `frontend` - Desenvolvimento frontend
- `backend` - Desenvolvimento backend
- `security` - Revisão de segurança
- `testing` - Testes e QA

## Relatório

Após a validação, um relatório detalhado é gerado indicando:
- Itens validados com sucesso
- Problemas encontrados
- Recomendações de correção
- Próximos passos

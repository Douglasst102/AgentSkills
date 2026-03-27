---
name: requirements-spec
description: Especifica requisitos funcionais e não-funcionais, cria SRS, e prioriza requisitos. Use quando precisar transformar necessidades de negócio em requisitos técnicos ou criar documentação de requisitos.
---

# Requirements Specification

Skill para especificação completa de requisitos de software.

## Quando Usar

- Especificação de requisitos funcionais
- Identificação de requisitos não-funcionais
- Criação de SRS (Software Requirements Specification)
- Priorização de requisitos
- Criação de matriz de rastreabilidade

## Instruções

1. **Extração de Requisitos Funcionais**
   - Analise necessidades de negócio e processos mapeados
   - Identifique funcionalidades necessárias
   - Documente cada requisito funcional com:
     - ID único
     - Descrição clara
     - Prioridade
     - Critérios de aceitação

2. **Identificação de Requisitos Não-Funcionais**
   - Performance (tempo de resposta, throughput)
   - Segurança (autenticação, autorização, criptografia)
   - Escalabilidade (usuários simultâneos, volume de dados)
   - Disponibilidade (uptime, redundância)
   - Usabilidade (acessibilidade, interface)
   - Manutenibilidade (código limpo, documentação)

3. **Priorização**
   - Use metodologia MoSCoW:
     - **Must have** - Essenciais
     - **Should have** - Importantes
     - **Could have** - Desejáveis
     - **Won't have** - Não incluídos nesta versão

4. **Criação de SRS**
   - Estruture conforme padrão IEEE 830
   - Inclua introdução, descrição geral, requisitos específicos
   - Mantenha rastreabilidade com necessidades de negócio

5. **Matriz de Rastreabilidade**
   - Ligue cada requisito às necessidades de negócio
   - Identifique dependências entre requisitos
   - Garanta cobertura completa

## Outputs

Salve os seguintes arquivos em `requirements/`:
- `srs.md` - Especificação de Requisitos de Software
- `functional-requirements.md` - Requisitos funcionais
- `non-functional-requirements.md` - Requisitos não-funcionais
- `requirements-traceability-matrix.md` - Matriz de rastreabilidade
- `prioritized-backlog.md` - Backlog priorizado

## Referências

Consulte `references/srs-template.md` para template de SRS.

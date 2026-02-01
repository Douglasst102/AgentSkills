---
name: devops-infra
description: Define infraestrutura como código, cria Dockerfiles, manifests Kubernetes, e pipelines CI/CD. Use quando precisar configurar infraestrutura, containers, ou pipelines de deploy.
---

# DevOps Infrastructure

Skill para configuração completa de infraestrutura, containers e CI/CD.

## Quando Usar

- Configuração de infraestrutura
- Criação de containers Docker
- Configuração de Kubernetes
- Criação de pipelines CI/CD
- Configuração de ambientes

## Instruções

1. **Dockerfiles**
   - Crie Dockerfile para cada serviço/componente
   - Use multi-stage builds quando apropriado
   - Otimize para tamanho e segurança
   - Inclua health checks

2. **Docker Compose**
   - Configure docker-compose.yml para ambiente local
   - Defina serviços e dependências
   - Configure volumes e networks
   - Inclua variáveis de ambiente

3. **Kubernetes Manifests**
   - Crie Deployment para cada serviço
   - Configure Services (ClusterIP, LoadBalancer)
   - Configure ConfigMaps e Secrets
   - Defina Ingress para exposição externa
   - Configure Resource Limits e Requests

4. **Pipelines CI/CD**
   - Configure pipeline de build
   - Configure testes automatizados
   - Configure deploy para staging
   - Configure deploy para produção
   - Inclua rollback automático

5. **Infraestrutura como Código**
   - Use Terraform ou CloudFormation
   - Defina recursos de cloud (se aplicável)
   - Configure networking e segurança
   - Documente variáveis e outputs

6. **Configuração de Ambientes**
   - Defina variáveis por ambiente
   - Configure secrets management
   - Documente diferenças entre ambientes

## Outputs

Salve os seguintes arquivos em `outputs/artifacts/infrastructure/`:
- `dockerfiles/` - Dockerfiles
- `docker-compose.yml` - Docker Compose
- `kubernetes/` - Manifests K8s
- `ci-cd/` - Pipelines CI/CD
- `infrastructure/` - IaC (Terraform/CloudFormation)
- `environments/` - Configurações de ambientes

## Referências

Consulte `references/docker-guide.md` e `references/kubernetes-guide.md` para templates.

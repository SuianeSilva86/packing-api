<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Packing API

Projeto de exemplo para prova técnica: API que calcula o empacotamento de pedidos em caixas disponíveis.

## Resumo rápido
Micro-serviço em Node.js com NestJS que recebe uma lista de pedidos (formato achatado: cada produto traz height/width/length) e retorna, para cada pedido, quais caixas foram usadas e quais produtos foram colocados em cada caixa.

## Tecnologias
- Node.js + TypeScript
- NestJS (módulos, DI)
- class-validator / class-transformer (validação DTOs)
- @nestjs/swagger (documentação OpenAPI)
- Jest (testes unitários)

As versões usadas estão no `package.json`.

## Arquitetura e organização
- Controller: expõe o endpoint HTTP (POST /packing)
- Service: lógica de domínio (algoritmo de empacotamento)
- DTOs/Types: contrato e validação (entrada/saída)
- Swagger: documentos e exemplos expostos em `/docs`

Estrutura principal:
```
src/
  packing/
    dto/
      pack-orders.dto.ts     # DTOs de request
      packed-response.dto.ts # DTOs de response para Swagger
    types/
      models.ts              # Tipos de domínio
    packing.service.ts      # Lógica de empacotamento
    packing.controller.ts   # Endpoint POST /packing
    packing.module.ts       # Módulo
  common/
    swagger.ts              # Configuração do Swagger
  app.module.ts
```

## API
POST /packing
- Request (formato achatado):
```json
{
  "orders": [
    {
      "id": "order1",
      "products": [
        { "id": "p1", "height": 10, "width": 10, "length": 10 },
        { "id": "p2", "height": 20, "width": 20, "length": 20 }
      ]
    }
  ]
}
```

- Response (exemplo):
```json
[
  {
    "orderId": "order1",
    "boxes": [
      { "boxId": "box1", "boxName": "Caixa 1", "products": [ { "id": "p1" } ] },
      { "boxId": "box3", "boxName": "Caixa 3", "products": [ { "id": "p2" } ] }
    ]
  }
]
```

Caixas disponíveis (cm):
- Caixa 1: 30 x 40 x 80
- Caixa 2: 50 x 50 x 40
- Caixa 3: 50 x 80 x 60

## Algoritmo de empacotamento (implementado)
- Abordagem: greedy determinístico com checagem de encaixe por rotação
  - Ordena caixas por volume crescente
  - Para cada caixa, varre produtos restantes e insere qualquer produto que caiba na caixa (permitindo rotação)
  - Se algum produto não couber em nenhuma caixa, retorna erro (BadRequest)

Justificativa: solução simples, determinística e facilmente justificável em entrevista. Empacotamento 3D ótimo é um problema NP-hard; essa solução é funcional e fácil de explicar.

## Validação e erros
- DTOs validam tipos e obrigatoriedade via `class-validator`.
- Erros do serviço são lançados como `BadRequestException` com mensagens claras.

## Swagger
- Documentação disponível em `/docs` (configurada em `src/common/swagger.ts`)
- O endpoint POST /packing contém um exemplo do formato achatado e os schemas de request/response via `@ApiProperty`.

## Testes
- Unit tests com Jest:
  - `src/packing/packing.service.spec.ts` cobre caminho feliz e caso de produto grande demais.
- Rode:
```bash
npm install
npm test
```

## Como rodar localmente
```powershell
npm install
npm run start:dev
# abrir http://localhost:3000/docs
```

## Rodando com Docker
Segue um passo-a-passo para rodar a API com Docker usando PowerShell (na raiz do projeto):

Pré-requisito: Docker Desktop instalado e em execução.

1) Build e subir com docker-compose (foreground):
```powershell
docker compose up --build
```

ou em background (detached):
```powershell
docker compose up --build -d
```

2) Checar containers e logs:
```powershell
docker ps
docker compose logs -f
```

3) Testar o endpoint com o `sample/entrada.json` (PowerShell):
```powershell
$body = Get-Content -Raw .\sample\entrada.json
Invoke-RestMethod -Uri http://localhost:3000/packing -Method Post -ContentType 'application/json' -Body $body | ConvertTo-Json
```

4) Parar e remover containers:
```powershell
docker compose down
```

Observações:
- Se der erro de conexão com o daemon do Docker, abra o Docker Desktop e aguarde o status "Docker is running".
- A linha `version:` no `docker-compose.yml` é apenas informativa; o Compose v2 a ignora.
- `.dockerignore` está configurado para não copiar `sample/` para a imagem — por isso normalmente usamos o `sample` localmente para testar via `Invoke-RestMethod`.


## Pontos para comentar em entrevista
- Por que NestJS: modularidade, DI, padrões corporativos, permite testes fáceis.
- Separação de responsabilidades: DTOs (validação), controller (HTTP), service (regra de negócio).
- Trade-offs: escolhi simplicidade do algoritmo para garantir previsibilidade; argumento para evolução futura (FFD, heurísticas 3D).
- Qualidade: testes unitários e documentação Swagger (muito importante para APIs).

## Próximos passos sugeridos
- Implementar heurísticas melhores (First Fit Decreasing, algoritmos guillotine ou shelf) para otimizar número de caixas.
- Adicionar testes e2e para cobrir integração controller+validation+service.
- Considerar limites de peso/fragilidade/empilhamento se exigido.
- Adicionar exemplos de resposta no Swagger.

---

Se quiser, eu já atualizo o README com trechos de fala prontos para entrevista (pontuações) e um slide curto. Quer que eu gere isso agora?

## Environment & Security (how to create .env)

This project uses environment variables for secrets. A `.env.example` file is included with placeholders. Never commit your real `.env`.

1) Copy `.env.example` to `.env`:

```powershell
Copy-Item -Path .\.env.example -Destination .\.env -Force
```

2) Generate a strong `JWT_SECRET` (PowerShell):

```powershell
#$jwtSecret: 32 random bytes, Base64
$b = New-Object 'System.Byte[]' 32; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($b); [System.Convert]::ToBase64String($b)
```

3) Choose admin credentials. For production prefer a precomputed bcrypt hash. To generate a hash using Node (one-liner):

```powershell
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync(process.argv[1]||'YourPass',10))" -- "YourStrongAdminPassword"
```

Then paste the produced hash into `ADMIN_PASSWORD_HASH` in `.env`. If you prefer to use a plain password for development, set `ADMIN_PASSWORD` (>=8 chars) and leave `ADMIN_PASSWORD_HASH` empty.

4) Example `.env` (dev):

```properties
JWT_SECRET=<paste-generated-base64-secret>
JWT_EXPIRES_IN=1h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourDevPassword123!
ADMIN_PASSWORD_HASH=
```

5) Start the app (PowerShell):

```powershell
npm run start:dev
# then open http://localhost:3000/docs
```

Security notes:
- In production, store secrets in a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.).
- Do not commit `.env` to source control; `.env.example` is safe to commit.
- When using `ADMIN_PASSWORD_HASH`, ensure the hash was generated with the same salt rounds (10) used by the app.


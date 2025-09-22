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

# TerraNova API

Backend RESTful do projeto TerraNova, criado com Java 25, Quarkus e JDBC/Oracle.

## Requisitos

- JDK 25
- Maven 3.9+
- Oracle Database acessivel pela rede

## Stack

- Quarkus 3.35.2
- Jakarta REST (`jakarta.ws.rs`)
- Jakarta Validation (`jakarta.validation`)
- JDBC Oracle
- Quarkus REST Client
- Agroal DataSource
- OpenAPI/Swagger

## Pacote base

```text
br.com.terranova
```

## Executar em desenvolvimento

```bash
mvn quarkus:dev
```

## Build

```bash
mvn clean package
```

## Docker

```bash
docker build -t terranova-api .
docker run --env-file .env -p 8080:8080 terranova-api
```

## Variaveis de ambiente

Crie um `.env` local a partir de [.env.example](.env.example), ou configure as variaveis no servidor:

```text
ORACLE_JDBC_URL=jdbc:oracle:thin:@//oracle.fiap.com.br:1521/ORCL
ORACLE_USER=seu_usuario_oracle
ORACLE_PASSWORD=sua_senha_oracle
IA_BASE_URL=http://localhost:5000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
PORT=8080
```

## OpenAPI

Com a aplicacao rodando:

```text
http://localhost:8080/q/swagger-ui
http://localhost:8080/q/openapi
```

## Erros da API

As excecoes globais retornam JSON no padrao:

```json
{
  "status": 400,
  "erro": "VALIDACAO",
  "mensagem": "Campo obrigatorio nao informado.",
  "caminho": "api/recurso",
  "timestamp": "2026-06-08T10:00:00-03:00"
}
```

## Smoke test

```http
GET http://localhost:8080/api/health
```

Resposta esperada:

```json
{
  "status": "UP",
  "service": "terranova-api"
}
```

## Observacoes

- O `pom.xml` bloqueia compilacao fora do Java 25.
- O deploy no Render usa Docker e deve receber as variaveis de ambiente pelo painel/Blueprint.

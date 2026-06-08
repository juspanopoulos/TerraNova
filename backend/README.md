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

## Observacao

O ambiente local desta maquina ainda nao possui Maven no PATH e o Java disponivel e 17.
Por isso, a validacao de build deve ser feita em ambiente com JDK 25 e Maven.

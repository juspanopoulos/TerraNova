# Deploy no Render

Este projeto sobe em dois Web Services no Render:

- `terranova-ia`: API Flask dos modelos de IA.
- `terranova-api`: API Java/Quarkus que conversa com Oracle, NASA e IA.

O frontend fica no Vercel e deve ser liberado no CORS do backend.

## Variaveis obrigatorias

Configure estas variaveis no Render. Nao coloque segredos no Git.

### terranova-ia

```text
GEMINI_API_KEY=sua_chave_gemini
PORT=10000
```

`GEMINI_API_KEY` so e obrigatoria para o endpoint de chat. Os modelos de produtividade e irrigacao funcionam sem ela.

### terranova-api

```text
ORACLE_JDBC_URL=jdbc:oracle:thin:@//oracle.fiap.com.br:1521/ORCL
ORACLE_USER=seu_usuario_oracle
ORACLE_PASSWORD=sua_senha_oracle
NASA_POWER_BASE_URL=https://power.larc.nasa.gov
CORS_ALLOWED_ORIGINS=https://seu-front.vercel.app
PORT=10000
```

Se usar o `render.yaml`, o backend recebe `IA_HOSTPORT` automaticamente a partir do servico `terranova-ia`.
Se criar os servicos manualmente, configure tambem:

```text
IA_BASE_URL=https://url-do-terranova-ia.onrender.com
```

## Caminho recomendado

1. Suba o codigo para o GitHub.
2. No Render, use **Blueprint** apontando para o `render.yaml` na raiz do repositorio.
3. Preencha manualmente os valores marcados como `sync: false`:
   - `GEMINI_API_KEY`, se for usar chat;
   - `ORACLE_USER`;
   - `ORACLE_PASSWORD`;
   - `CORS_ALLOWED_ORIGINS` com a URL exata do Vercel.
4. Aguarde o deploy dos dois servicos.
5. Teste:

```text
GET https://terranova-api.onrender.com/api/health
GET https://terranova-ia.onrender.com/health
POST https://terranova-api.onrender.com/api/ia/funcionando
```

## Deploy manual

Crie primeiro `terranova-ia`:

```text
Language: Docker
Root Directory: ia
Health Check Path: /health
```

Depois crie `terranova-api`:

```text
Language: Docker
Root Directory: backend
Health Check Path: /api/health
```

No deploy manual, copie a URL publica da IA e configure `IA_BASE_URL` no backend.

## Observacoes

- O Render exige que Web Services escutem em `0.0.0.0` e usem a porta `PORT`.
- O backend usa Java 25 via Docker.
- O banco Oracle continua sendo o da FIAP.
- No plano gratuito do Render, os servicos podem dormir quando ficam sem uso. A primeira chamada depois de inatividade pode demorar.

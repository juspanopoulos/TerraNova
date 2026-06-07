# TerraNova IA - Documentação da API

## Visão Geral

A API TerraNova IA é responsável por fornecer funcionalidades de Inteligência Artificial para a plataforma TerraNova.

Atualmente a API possui:

* Modelo de Machine Learning para previsão de produtividade agrícola (ML1)
* Modelo de Machine Learning para recomendação de irrigação (ML2)
* Assistente virtual inteligente GAIA utilizando Gemini

---

# URL Base

```http
http://localhost:5000
```

---

# Verificação da API

## Endpoint

```http
POST /api/funcionando
```

## Exemplo de Requisição

```json
{
    "teste": "ok"
}
```

## Exemplo de Resposta

```json
{
    "message": "Funcionando",
    "data": {
        "teste": "ok"
    }
}
```

---

# Modelo 1 - Previsão de Produtividade

## Endpoint

```http
POST /modelo1/predict
```

## Objetivo

Realizar a previsão da produtividade agrícola utilizando informações climáticas, do solo e da cultura.

---

## Payload

```json
{
    "rainfall_mm": 1200,
    "temperature_celsius": 28,
    "fertilizer_used": 1,
    "irrigation_used": 1,
    "days_to_harvest": 120,

    "region": "North",
    "soil_type": "Loam",
    "crop": "Rice",
    "weather_condition": "Sunny"
}
```

---

## Campos Numéricos

| Campo               | Tipo             |
| ------------------- | ---------------- |
| rainfall_mm         | float            |
| temperature_celsius | float            |
| fertilizer_used     | inteiro (0 ou 1) |
| irrigation_used     | inteiro (0 ou 1) |
| days_to_harvest     | inteiro          |

---

## Campos Categóricos

### region

Valores aceitos:

```text
North
South
East
West
```

### soil_type

Valores aceitos:

```text
Clay
Loam
Peaty
Sandy
Silt
```

### crop

Valores aceitos:

```text
Cotton
Maize
Rice
Soybean
Wheat
```

### weather_condition

Valores aceitos:

```text
Sunny
Rainy
Cloudy
```

---

## Resposta

```json
{
    "status": "success",
    "produtividade": 8.42,
    "classificacao": "Alta"
}
```

---

## Classificações

| Produtividade | Classificação |
| ------------- | ------------- |
| >= 8          | Alta          |
| >= 5 e < 8    | Média         |
| < 5           | Baixa         |

---

# Modelo 2 - Recomendação de Irrigação

## Endpoint

```http
POST /modelo2/predict
```

## Objetivo

Realizar recomendações relacionadas ao consumo de água e irrigação.

---

## Payload

```json
{
    "latitude": -23.5505,
    "longitude": -46.6333,

    "soil_type": "Clay",
    "soil_moisture": 45,

    "crop_type": "Rice",
    "crop_growth_stage": "Vegetative",

    "irrigation_type": "Drip",

    "field_area_hectare": 10,

    "mulching_used": "Yes",

    "previous_irrigation_mm": 30,

    "current_water_usage": 8
}
```

---

## Campos Obtidos Automaticamente

Os seguintes dados são obtidos através da NASA POWER API e não devem ser enviados:

```text
Temperature_C
Humidity
Rainfall_mm
Sunlight_Hours
Wind_Speed_kmh
Season
```

---

## Campos Numéricos

| Campo                  | Tipo  |
| ---------------------- | ----- |
| latitude               | float |
| longitude              | float |
| soil_moisture          | float |
| field_area_hectare     | float |
| previous_irrigation_mm | float |
| current_water_usage    | float |

---

## Campos Categóricos

### soil_type

Valores aceitos:

```text
Sandy
Clay
Loam
Silt
Peaty
Chalky
```

### crop_type

Valores aceitos:

```text
Rice
Wheat
Maize
Cotton
Sugarcane
```

### crop_growth_stage

Valores aceitos:

```text
Germination
Vegetative
Flowering
Maturity
```

### irrigation_type

Valores aceitos:

```text
Drip
Sprinkler
Surface
```

### mulching_used

Valores aceitos:

```text
Yes
No
```

---

## Resposta

```json
{
    "status": "success",
    "recomendado": 10,
    "consumo_atual": 8,
    "situacao": "Ainda pode regar"
}
```

---

## Possíveis Situações

```text
Ainda pode regar
Está perfeito
Está gastando mais água do que o necessário
```

---

# Assistente Virtual GAIA

## Endpoint

```http
POST /chat
```

## Objetivo

Permitir interação com o assistente virtual especializado em:

* Agricultura
* Clima
* Irrigação
* Sustentabilidade
* Monitoramento ambiental
* Produtividade agrícola
* Consumo de água

---

## Requisição sem contexto

```json
{
    "pergunta": "O que é irrigação por gotejamento?"
}
```

---

## Requisição com contexto

```json
{
    "pergunta": "Estou gastando muita água?",
    "contexto": "
        Consumo atual: 12
        Consumo recomendado: 10
        Situação: Está gastando mais água do que o necessário
    "
}
```

---

## Resposta

```json
{
    "resposta": "Seu consumo atual está acima do recomendado."
}
```

---

# Fluxo da Arquitetura

```text
Frontend
    ↓
Backend Java (Quarkus)
    ↓
API Flask (TerraNova IA)
        ↓
        ML1 - Produtividade

        ML2 - Irrigação

        GAIA (Gemini)
```

---

# Observações Importantes

1. Os nomes dos campos devem ser enviados exatamente conforme documentado.

2. Os valores categóricos devem corresponder aos valores utilizados durante o treinamento dos modelos.

3. O endpoint de chat funciona com ou sem contexto.

4. Quando um contexto for enviado, a GAIA utilizará essas informações para responder de forma mais precisa.

5. O backend Java é responsável pela validação e persistência dos dados.

6. A API foi desenvolvida utilizando Flask, Scikit-Learn, Joblib e Gemini.
   """

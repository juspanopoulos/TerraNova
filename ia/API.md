# TerraNova IA - Documentação da API

## Visão Geral

A API TerraNova IA fornece funcionalidades de Inteligência Artificial para a plataforma TerraNova.

Atualmente a API possui:

* Modelo de Machine Learning para previsão de produtividade agrícola (ML1)
* Modelo de Machine Learning para recomendação de irrigação (ML2)

---

## URL Base

```http
http://localhost:5000
```

---

## Verificação da API

### Endpoint

```http
GET /health
POST /api/funcionando
```

### Exemplo de requisição

```json
{
  "teste": "ok"
}
```

### Exemplo de resposta

```json
{
  "message": "Funcionando",
  "data": {
    "teste": "ok"
  }
}
```

---

## Modelo 1 - Previsão de Produtividade

### Endpoint

```http
POST /modelo1/predict
```

### Objetivo

Realizar a previsão da produtividade agrícola utilizando informações climáticas, do solo e da cultura.

### Payload

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

### Resposta

```json
{
  "status": "success",
  "produtividade": 8.42,
  "classificacao": "Alta"
}
```

### Valores categóricos aceitos

| Campo | Valores |
| --- | --- |
| region | North, South, East, West |
| soil_type | Clay, Loam, Peaty, Sandy, Silt |
| crop | Cotton, Maize, Rice, Soybean, Wheat |
| weather_condition | Sunny, Rainy, Cloudy |

---

## Modelo 2 - Recomendação de Irrigação

### Endpoint

```http
POST /modelo2/predict
```

### Objetivo

Realizar recomendações relacionadas ao consumo de água e irrigação.

### Payload

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

### Resposta

```json
{
  "status": "success",
  "recomendado": 10,
  "consumo_atual": 8,
  "situacao": "Ainda pode regar"
}
```

### Valores categóricos aceitos

| Campo | Valores |
| --- | --- |
| soil_type | Sandy, Clay, Loam, Silt, Peaty, Chalky |
| crop_type | Rice, Wheat, Maize, Cotton, Sugarcane |
| crop_growth_stage | Germination, Vegetative, Flowering, Maturity |
| irrigation_type | Drip, Sprinkler, Surface |
| mulching_used | Yes, No |

---

## Fluxo da Arquitetura

```text
Frontend
    ↓
Backend Java (Quarkus)
    ↓
API Flask (TerraNova IA)
    ↓
ML1 - Produtividade
ML2 - Irrigação
```

---

## Observações Importantes

1. Os nomes dos campos devem ser enviados exatamente conforme documentado.
2. Os valores categóricos devem corresponder aos valores utilizados durante o treinamento dos modelos.
3. O backend Java é responsável pela validação, integração e persistência dos resultados.
4. A API foi desenvolvida utilizando Flask, Scikit-Learn e Joblib.

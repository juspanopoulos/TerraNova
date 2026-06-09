import joblib
import pandas as pd
from pathlib import Path

from services.service_clima import get_clima, get_season

BASE_DIR = Path(__file__).resolve().parent.parent

model1 = joblib.load(
    BASE_DIR / "Models" / "GS-M1" / "best_yield_prediction_model.joblib"
)

model2 = joblib.load(
    BASE_DIR / "Models" / "GS-M2" / "best_irrigation_model.joblib"
)

# Valores medianos aproximados do dataset de treinamento do Modelo 2.
CLIMA_FALLBACK = {
    "temperature": 27.09,
    "humidity": 60.04,
    "rainfall": 1250.34,
    "sunlight_hours": 7.56,
    "wind_speed": 10.19
}

CLIMA_PAYLOAD_KEYS = {
    "temperature": ("temperature", "temperature_c", "temperature_celsius"),
    "humidity": ("humidity",),
    "rainfall": ("rainfall", "rainfall_mm"),
    "sunlight_hours": ("sunlight_hours",),
    "wind_speed": ("wind_speed", "wind_speed_kmh")
}


def preparar_dados_modelo1(data):
    input_data = pd.DataFrame([{
        "Region": data.get("region"),
        "Soil_Type": data.get("soil_type"),
        "Crop": data.get("crop"),
        "Rainfall_mm": float(data.get("rainfall_mm")),
        "Temperature_Celsius": float(data.get("temperature_celsius")),
        "Fertilizer_Used": int(data.get("fertilizer_used")),
        "Irrigation_Used": int(data.get("irrigation_used")),
        "Weather_Condition": data.get("weather_condition"),
        "Days_to_Harvest": int(data.get("days_to_harvest"))
    }])

    produtividade = float(model1.predict(input_data)[0])
    return produtividade, input_data


def gerar_contexto_produtividade(produtividade, classificacao):
    return f"""
        Produtividade prevista: {produtividade}

        Classificacao: {classificacao}
        """


def preparar_dados_modelo2(data):
    try:
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        try:
            clima_api = get_clima(latitude, longitude)
        except Exception as clima_error:
            print(f"Erro ao obter dados climaticos: {clima_error}")
            clima_api = {}

        clima = normalizar_dados_climaticos(
            clima_api,
            data
        )
        season = data.get("season") or get_season()

        dados_modelo = pd.DataFrame([{
            "Soil_Type": data["soil_type"],
            "Soil_Moisture": float(data["soil_moisture"]),
            "Temperature_C": clima["temperature"],
            "Humidity": clima["humidity"],
            "Rainfall_mm": clima["rainfall"],
            "Sunlight_Hours": clima["sunlight_hours"],
            "Wind_Speed_kmh": clima["wind_speed"],
            "Crop_Type": data["crop_type"],
            "Crop_Growth_Stage": data["crop_growth_stage"],
            "Season": season,
            "Irrigation_Type": data["irrigation_type"],
            "Field_Area_hectare": float(data["field_area_hectare"]),
            "Mulching_Used": normalizar_cobertura_solo(data["mulching_used"]),
            "Previous_Irrigation_mm": float(data["previous_irrigation_mm"])
        }])

        prediction = model2.predict(dados_modelo)
        resultado = str(prediction[0])
        return resultado, dados_modelo
    except Exception as e:
        raise ValueError(
            f"Erro ao preparar dados para o modelo de irrigacao: {e}"
        ) from e


def gerar_recomendacao(resultado, crop_type, consumo_atual):
    necessidade_hidrica = {
        "Rice": 10.0,
        "Sugarcane": 9.0,
        "Cotton": 7.0,
        "Maize": 6.5,
        "Potato": 5.5,
        "Wheat": 4.5
    }

    base = necessidade_hidrica.get(crop_type, 7)

    fatores = {
        "Low": 0.8,
        "Medium": 1.0,
        "High": 1.3
    }

    fator = fatores.get(resultado, fatores["Medium"])
    recomendado = round(base * fator, 2)
    consumo_atual = float(consumo_atual)
    margem = 0.5

    if consumo_atual < recomendado - margem:
        status = "Ainda pode regar"
    elif abs(consumo_atual - recomendado) <= margem:
        status = "Esta perfeito"
    else:
        status = "Esta gastando mais agua do que o necessario"

    return {
        "recomendado": recomendado,
        "consumo_atual": consumo_atual,
        "status": status
    }


def normalizar_cobertura_solo(valor):
    if isinstance(valor, str):
        return 1 if valor.strip().lower() in ("yes", "sim", "1", "true") else 0
    return int(valor)


def normalizar_dados_climaticos(clima, data):
    clima = clima or {}

    return {
        campo: obter_valor_climatico(clima, data, campo)
        for campo in CLIMA_FALLBACK
    }


def obter_valor_climatico(clima, data, campo):
    valor = clima.get(campo)

    if valor in (None, ""):
        for chave_payload in CLIMA_PAYLOAD_KEYS[campo]:
            valor = data.get(chave_payload)
            if valor not in (None, ""):
                break

    if valor in (None, ""):
        return CLIMA_FALLBACK[campo]

    try:
        return float(valor)
    except (TypeError, ValueError):
        return CLIMA_FALLBACK[campo]


def gerar_contexto_irrigacao(recomendado, consumo_atual, situacao):
    return f"""
        Consumo atual: {consumo_atual}

        Consumo recomendado: {recomendado}

        Situacao: {situacao}
        """

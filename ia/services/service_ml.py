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

        clima = get_clima(latitude, longitude)
        season = get_season()

        dados_modelo = pd.DataFrame([{
            "Soil_Type": data["soil_type"],
            "Soil_Moisture": data["soil_moisture"],
            "Temperature_C": clima["temperature"],
            "Humidity": clima["humidity"],
            "Rainfall_mm": clima["rainfall"],
            "Sunlight_Hours": clima["sunlight_hours"],
            "Wind_Speed_kmh": clima["wind_speed"],
            "Crop_Type": data["crop_type"],
            "Crop_Growth_Stage": data["crop_growth_stage"],
            "Season": season,
            "Irrigation_Type": data["irrigation_type"],
            "Field_Area_hectare": data["field_area_hectare"],
            "Mulching_Used": normalizar_cobertura_solo(data["mulching_used"]),
            "Previous_Irrigation_mm": data["previous_irrigation_mm"]
        }])

        prediction = model2.predict(dados_modelo)
        resultado = str(prediction[0])
        return resultado, dados_modelo
    except Exception as e:
        print(f"Erro ao preparar dados para o modelo de irrigacao: {e}")
        return "Erro"


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

    recomendado = round(base * fatores[resultado], 2)
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


def gerar_contexto_irrigacao(recomendado, consumo_atual, situacao):
    return f"""
        Consumo atual: {consumo_atual}

        Consumo recomendado: {recomendado}

        Situacao: {situacao}
        """

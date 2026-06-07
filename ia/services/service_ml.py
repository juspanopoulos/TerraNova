import joblib
import pandas as pd
from services.service_clima import get_clima, get_season
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model1 = joblib.load(
    BASE_DIR / "Models" / "GS-M1" / "best_yield_prediction_model.joblib"
)

model2 = joblib.load(
    BASE_DIR / "Models" / "GS-M2" / "best_irrigation_model.joblib"
)

# MODELO 1 - PREDIÇÃO DE PRODUTIVIDADE
def preparar_dados_modelo1(data):

    input_data = pd.DataFrame([{
        "Rainfall_mm": float(data.get("rainfall_mm")),
        "Temperature_Celsius": float(data.get("temperature_celsius")),
        "Fertilizer_Used": int(data.get("fertilizer_used")),
        "Irrigation_Used": int(data.get("irrigation_used")),
        "Days_to_Harvest": int(data.get("days_to_harvest")),

        "Region_North": 0,
        "Region_South": 0,
        "Region_West": 0,

        "Soil_Type_Clay": 0,
        "Soil_Type_Loam": 0,
        "Soil_Type_Peaty": 0,
        "Soil_Type_Sandy": 0,
        "Soil_Type_Silt": 0,

        "Crop_Cotton": 0,
        "Crop_Maize": 0,
        "Crop_Rice": 0,
        "Crop_Soybean": 0,
        "Crop_Wheat": 0,

        "Weather_Condition_Rainy": 0,
        "Weather_Condition_Sunny": 0
    }])

    # Região
    region = data.get("region")

    if region == "North":
        input_data.loc[0, "Region_North"] = 1
    elif region == "South":
        input_data.loc[0, "Region_South"] = 1
    elif region == "West":
        input_data.loc[0, "Region_West"] = 1

    # Solo
    soil = data.get("soil_type")

    mapa_solo = {
        "Clay": "Soil_Type_Clay",
        "Loam": "Soil_Type_Loam",
        "Peaty": "Soil_Type_Peaty",
        "Sandy": "Soil_Type_Sandy",
        "Silt": "Soil_Type_Silt"
    }

    if soil in mapa_solo:
        input_data.loc[0, mapa_solo[soil]] = 1

    # Cultura
    crop = data.get("crop")

    mapa_crop = {
        "Cotton": "Crop_Cotton",
        "Maize": "Crop_Maize",
        "Rice": "Crop_Rice",
        "Soybean": "Crop_Soybean",
        "Wheat": "Crop_Wheat"
    }

    if crop in mapa_crop:
        input_data.loc[0, mapa_crop[crop]] = 1

    # Clima
    weather = data.get("weather_condition")

    if weather == "Rainy":
        input_data.loc[0, "Weather_Condition_Rainy"] = 1

    elif weather == "Sunny":
        input_data.loc[0, "Weather_Condition_Sunny"] = 1

    
    produtividade = float(model1.predict(input_data)[0])
    return produtividade, input_data

def gerar_contexto_produtividade(produtividade, classificacao):

    return (f"""
        Produtividade prevista: {produtividade}

        Classificação: {classificacao}
        """)


# MODELO 2 - RECOMENDAÇÃO DE IRRIGAÇÃO

def preparar_dados_modelo2(data):
    try:
        latitude = data.get('latitude')
        longitude = data.get('longitude')

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
            "Mulching_Used": data["mulching_used"],
            "Previous_Irrigation_mm": data["previous_irrigation_mm"]
        }])

        prediction = model2.predict(dados_modelo)

        resultado = str(prediction[0])
        return resultado, dados_modelo
    except Exception as e:
        print(f"Erro ao preparar dados para o modelo de irrigação: {e}")
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

    recomendado = round(
        base * fatores[resultado],
        2
    )

    margem = 0.5

    if consumo_atual < recomendado - margem:
        status = "Ainda pode regar"

    elif abs(consumo_atual - recomendado) <= margem:
        status = "Está perfeito"

    else:
        status = "Está gastando mais água do que o necessário"

    return {
        "recomendado": recomendado,
        "consumo_atual": consumo_atual,
        "status": status
    }

def gerar_contexto_irrigacao(recomendado, consumo_atual, situacao):

    return (f"""
        Consumo atual: {consumo_atual}

        Consumo recomendado: {recomendado}

        Situação: {situacao}
        """)
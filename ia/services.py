from datetime import datetime
import requests

Nasa_URL = ("https://power.larc.nasa.gov/api/temporal/daily/point")

import pandas as pd


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

    return input_data

def get_clima(latitude, longitude):
    hoje = datetime.now().strftime("%Y%m%d")

    params = {
        "parameters": "T2M,RH2M,PRECTOTCORR,WS2M,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": hoje,
        "end": hoje,
        "format": "JSON"
    }

    response = requests.get(
        Nasa_URL,
        params=params,
        timeout=30
    )

    data = response.json()

    parametros = data["properties"]["parameter"]

    return {

        "temperature":
            list(parametros["T2M"].values())[0],

        "humidity":
            list(parametros["RH2M"].values())[0],

        "rainfall":
            list(parametros["PRECTOTCORR"].values())[0],

        "wind_speed":
            list(parametros["WS2M"].values())[0],

        "sunlight_hours":
            list(parametros["ALLSKY_SFC_SW_DWN"].values())[0]
    }

def get_season():
    mes = datetime.now().month

    if mes in [12, 1, 2]:
        return "Summer"
    elif mes in [3, 4, 5]:
        return "Autumn"
    elif mes in [6, 7, 8]:
        return "Winter"
    else:
        return "Spring"


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
import datetime
import requests

def get_clima(latitude, longitude):
    try:
        Nasa_URL = ("https://power.larc.nasa.gov/api/temporal/daily/point")

        hoje = datetime.datetime.now().strftime("%Y%m%d")

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
    except Exception as e:
        print(f"Erro ao obter dados climáticos: {e}")
        return {
            "temperature": None,
            "humidity": None,
            "rainfall": None,
            "wind_speed": None,
            "sunlight_hours": None
        }
    

def get_season():
    try:
        mes = datetime.datetime.now().month

        if mes in [12, 1, 2]:
            return "Summer"
        elif mes in [3, 4, 5]:
            return "Autumn"
        elif mes in [6, 7, 8]:
            return "Winter"
        else:
            return "Spring"
    except Exception as e:
        print(f"Erro ao obter estação: {e}")
        return "Unknown"
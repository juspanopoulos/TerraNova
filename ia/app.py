from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from services import (preparar_dados_modelo1, get_clima, get_season, gerar_recomendacao)


app = Flask(__name__)
CORS(app)

model1 = joblib.load('GS-M1/best_yield_prediction_model.joblib')
print(model1.feature_names_in_)
model2 = joblib.load('GS-M2/best_irrigation_model.joblib')

@app.route('/api/funcionando', methods=['POST'])
def funcionando():
    data = request.get_json()
    if data:
        return jsonify({'message': 'Funcionando', 'data': data}), 200
    return jsonify({'message': 'No data provided'}), 400

@app.route('/modelo1/predict', methods=['POST'])
def modelo1_predict():
    try:
        data = request.get_json()
        if data:
            input_data = preparar_dados_modelo1(data)            
            produtividade = float(model1.predict(input_data)[0])

            if produtividade >= 8:
                classificacao = "Alta"

            elif produtividade >= 5 and produtividade < 8:
                classificacao = "Média"

            else:
                classificacao = "Baixa"

            return jsonify({
                "status": "success",
                "produtividade": round(produtividade, 2),
                "classificacao": classificacao
            }), 200
        return jsonify({'message': 'No data provided'}), 400
    except Exception as e:
        return jsonify({'message': 'Error processing request', 'error': str(e)}), 500

@app.route('/modelo2/predict', methods=['POST'])
def modelo2_predict():
    try:
        data = request.get_json()
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

        info = gerar_recomendacao(resultado, data["crop_type"], data["current_water_usage"])

        return jsonify({
            "status": "success",
            "recomendado": info["recomendado"],
            "consumo_atual": info["consumo_atual"],
            "situacao": info["status"]

        })

    except Exception as e:
        return jsonify({'message': 'Error processing request', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)



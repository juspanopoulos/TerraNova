import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.service_ml import (preparar_dados_modelo1, preparar_dados_modelo2, gerar_recomendacao)
from services.service_chat import (processar_chat)


app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'UP', 'service': 'terranova-ia'}), 200

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
            produtividade, input_data = preparar_dados_modelo1(data)

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
        if data:
            resultado, dados_modelo = preparar_dados_modelo2(data)
            info = gerar_recomendacao(resultado, data["crop_type"], data["current_water_usage"])

            return jsonify({
                "status": "success",
                "recomendado": info["recomendado"],
                "consumo_atual": info["consumo_atual"],
                "situacao": info["status"]
            })

    except Exception as e:
        return jsonify({'message': 'Error processing request', 'error': str(e)}), 500
    
@app.route('/chat', methods=['POST'])
def chat():

    data = request.get_json()
    if data:
        pergunta = data.get("pergunta")

        resposta = processar_chat(
            pergunta,
            data
        )
        return jsonify({
            "resposta": resposta
        })
    return jsonify({'message': 'No data provided'}), 400


if __name__ == '__main__':
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "5000")),
        debug=False
    )



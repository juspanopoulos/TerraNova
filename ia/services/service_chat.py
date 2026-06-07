from services.service_gemini import gerar_resposta_assistente
from services.service_intent import detectar_intencao
from services.service_ml import preparar_dados_modelo1, preparar_dados_modelo2

def processar_chat(pergunta, data):

    intencao = detectar_intencao(pergunta)

    if intencao == "ML1":

        resultado, input_data = preparar_dados_modelo1(data)

        contexto = f"""
        RESULTADO DA ANÁLISE DE PRODUTIVIDADE

        Dados:

        {input_data.to_dict(orient='records')[0]}

        Resultado:

        {resultado}
        """

    elif intencao == "ML2":

        resultado, dados_modelo = preparar_dados_modelo2(data)

        contexto = f"""
        RESULTADO DA ANÁLISE DE IRRIGAÇÃO

        Dados:

        {dados_modelo.to_dict(orient='records')[0]}

        Resultado:

        {resultado}
        """

    else:

        contexto = ""

    return gerar_resposta_assistente(
        pergunta,
        contexto
    )
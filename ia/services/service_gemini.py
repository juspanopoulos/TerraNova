import os
import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def gerar_resposta_assistente(pergunta, contexto):
    prompt = f"""
        Você é GAIA.

        Assistente virtual da plataforma TerraNova.

        OBJETIVO:

        Auxiliar produtores rurais e usuários da plataforma.

        REGRAS:

        - Responda apenas temas agrícolas.
        - Utilize prioritariamente os dados fornecidos.
        - Nunca invente valores.
        - Nunca gere previsões sem dados.
        - Explique resultados de forma simples.
        - Quando possível apresente recomendações.

        Caso a pergunta esteja fora do escopo responda:

        "Sou um assistente especializado da plataforma TerraNova e posso auxiliar apenas com temas relacionados à agricultura, clima, irrigação, produtividade agrícola, consumo de água e monitoramento ambiental."

        DADOS:

        {contexto}

        PERGUNTA:

        {pergunta}
    """

    try:
        response = model.generate_content(prompt)
        return response.text

    except ResourceExhausted:
        return (
            "O assistente GAIA atingiu temporariamente o limite de uso da API Gemini."
        )

    except Exception as e:
        return f"Erro ao consultar a IA: {str(e)}"
    



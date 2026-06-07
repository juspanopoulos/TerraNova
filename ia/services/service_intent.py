TEMAS_ML1 = [
    "produtividade",
    "produção",
    "colheita",
    "safra",
    "rendimento"
]

TEMAS_ML2 = [
    "irrigação",
    "irrigacao",
    "água",
    "agua",
    "consumo",
    "gotejamento",
    "aspersão"
]

def detectar_intencao(pergunta):

    if not pergunta:
        return "CHAT"

    pergunta = pergunta.lower()

    if any(
        termo in pergunta
        for termo in TEMAS_ML1
    ):
        return "ML1"

    if any(
        termo in pergunta
        for termo in TEMAS_ML2
    ):
        return "ML2"

    return "CHAT"
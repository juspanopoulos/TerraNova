import json

def importar_dados_satelite(caminho_arquivo):
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
            dados = json.load(arquivo)
            return dados
    except FileNotFoundError:
        print(f"\n[ERRO] O arquivo '{caminho_arquivo}' não foi encontrado. Verifique o satélite.")
        return []
    except json.JSONDecodeError:
        print("\n[ERRO] Falha ao ler o JSON. Formato inválido.")
        return []
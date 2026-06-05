import json
import os

def importar_dados_satelite(nome_arquivo):
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    
    # Monta o caminho completo (ex: C:\...\python\satelite_dados.json)
    caminho_completo = os.path.join(diretorio_atual, nome_arquivo)
    
    try:
        with open(caminho_completo, 'r', encoding='utf-8') as arquivo:
            dados = json.load(arquivo)
            return dados
    except FileNotFoundError:
        print(f"\n[ERRO] O arquivo '{caminho_completo}' não foi encontrado. Verifique o satélite.")
        return []
    except json.JSONDecodeError:
        print("\n[ERRO] Falha ao ler o JSON. Formato inválido.")
        return []
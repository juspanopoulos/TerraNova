import requests
import json
import os
from datetime import datetime, timedelta

def coletar_dados_satelite():
    print("Iniciando conexão com a API da NASA POWER (Agroclimatologia)...")

    #Recuo de 5 dias para garantir que a NASA já processou os dados (evita valores como -999.0)
    data_consulta = (datetime.now() - timedelta(days=5)).strftime('%Y%m%d')
    
    # Exemplo de latitude e longitude da região de Osasco/SP
    lat = -23.5325
    lon = -46.7917
    
    # Parâmetros que da NASA Power:
    # T2M = Temperatura a 2 metros do solo
    # RH2M = Umidade Relativa a 2 metros
    # PRECTOTCORR = Precipitação (chuva) corrigida
    # ALLSKY_SFC_UVA = Incidência de UV-A
    parametros_nasa = "T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_UVA"
    
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters={parametros_nasa}&community=AG&longitude={lon}&latitude={lat}&start={data_consulta}&end={data_consulta}&format=JSON"
    
    try:
        resposta = requests.get(url, timeout=10)
        
        if resposta.status_code == 200:
            dados_brutos = resposta.json()
            propriedades = dados_brutos['properties']['parameter']
            
            # Coleta o valor bruto do UV
            uv_bruto = propriedades['ALLSKY_SFC_UVA'][data_consulta]
            
            # Se a NASA não tiver o dado (-999.0), definimos como 0.0(ou poderíamos optar por None, dependendo de como queremos tratar isso no banco)
            uv_tratado = 0.0 if uv_bruto == -999.0 else round(uv_bruto, 2)

            registro_terra_nova = {
                "id_area": 1,
                "temperatura": round(propriedades['T2M'][data_consulta], 2),
                "umidade": round(propriedades['RH2M'][data_consulta], 2),
                "precipitacao": round(propriedades['PRECTOTCORR'][data_consulta], 2),
                "indice_uv": uv_tratado,
                "fonte_api": "NASA"
            }
            
            lista_dados = [registro_terra_nova]
            
            # Garantia que o arquivo seja salvo na mesma pasta deste script (pasta "python")
            diretorio_atual = os.path.dirname(os.path.abspath(__file__))
            caminho_arquivo = os.path.join(diretorio_atual, 'satelite_dados.json')
            
            with open(caminho_arquivo, 'w', encoding='utf-8') as arquivo_json:
                json.dump(lista_dados, arquivo_json, indent=4, ensure_ascii=False)
                
            print("\nSUCESSO! Dados reais coletados da NASA.")
            print(f"Temperatura: {registro_terra_nova['temperatura']}°C | Umidade: {registro_terra_nova['umidade']}%")
            print(f"Arquivo salvo com sucesso em: {caminho_arquivo}")
            
        else:
            print(f"\n[ERRO] Falha na API. Status: {resposta.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"\n[ERRO DE CONEXÃO] Não foi possível acessar a API da NASA: {e}")

if __name__ == "__main__":
    coletar_dados_satelite()
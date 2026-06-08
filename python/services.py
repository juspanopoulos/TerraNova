import json

def processar_e_inserir_dados(dados_json, conexao):
    if not conexao or not dados_json:
        return False
        
    cursor = conexao.cursor()
    registros_inseridos = 0

    for registro in dados_json:
        try:
            id_area = registro['id_area']
            temp = registro['temperatura']
            umidade = registro['umidade']
            precipitacao = registro['precipitacao']
            uv = registro['indice_uv']
            fonte = registro['fonte_api'] # NASA, ESA ou INMET
            
            cursor.execute("""
                INSERT INTO TN_DADO_CLIMATICO 
                (id_area, dt_coleta, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, ds_fonte_api) 
                VALUES (:1, SYSDATE, :2, :3, :4, :5, :6)
            """, (id_area, temp, umidade, precipitacao, uv, fonte))
            
            registros_inseridos += 1
        except Exception as e:
            print(f"Erro ao inserir registro da área {registro.get('id_area', 'Desconhecida')}: {e}")
            
    conexao.commit()
    cursor.close()
    return registros_inseridos

def buscar_alertas_ativos(conexao):
    if not conexao: return []
    
    cursor = conexao.cursor()
    # JOIN entre TN_ALERTA e TN_AREA_MONITORADA
    cursor.execute("""
        SELECT am.nm_area, al.ds_tipo_alerta, al.ds_severidade, al.ds_descricao 
        FROM TN_ALERTA al
        JOIN TN_AREA_MONITORADA am ON al.id_area = am.id_area
        WHERE al.ds_status = 'ABERTO'
        ORDER BY 
            CASE al.ds_severidade 
                WHEN 'CRITICA' THEN 1 
                WHEN 'ALTA' THEN 2 
                WHEN 'MEDIA' THEN 3 
                WHEN 'BAIXA' THEN 4 
            END
    """)
    alertas = cursor.fetchall()
    cursor.close()
    
    lista_alertas = [{"area": row[0], "tipo": row[1], "severidade": row[2], "descricao": row[3]} for row in alertas]
    return lista_alertas

def consultar_historico_climatico(conexao, id_area):
    if not conexao: return []
    
    cursor = conexao.cursor()
    try:
        # Busca os dados climáticos da área específica, ordenando do mais recente para o mais antigo
        cursor.execute("""
            SELECT dt_coleta, nr_temperatura, nr_umidade, nr_precipitacao, ds_fonte_api
            FROM TN_DADO_CLIMATICO
            WHERE id_area = :1
            ORDER BY dt_coleta DESC
        """, (id_area,))
        
        resultados = cursor.fetchall()
        
        historico = [
            {
                "data": row[0], 
                "temperatura": row[1], 
                "umidade": row[2], 
                "precipitacao": row[3], 
                "fonte": row[4]
            } for row in resultados
        ]
        return historico
        
    except Exception as e:
        print(f"\n[ERRO] Falha ao consultar o histórico: {e}")
        return []
    finally:
        cursor.close()

def registrar_novo_plantio(conexao, id_area, id_cultura, dt_plantio, dt_colheita):
    if not conexao: return False
    
    cursor = conexao.cursor()
    try:
        cursor.execute("""
            INSERT INTO TN_AREA_CULTURA 
            (id_area, id_cultura, dt_plantio, dt_colheita_prevista) 
            VALUES (:1, :2, TO_DATE(:3, 'DD/MM/YYYY'), TO_DATE(:4, 'DD/MM/YYYY'))
        """, (id_area, id_cultura, dt_plantio, dt_colheita))
        
        conexao.commit()
        return True
    except Exception as e:
        print(f"\n[ERRO] Falha ao registrar plantio: {e}")
        return False
    finally:
        cursor.close()

def gerar_relatorio_recomendacoes(conexao):
    if not conexao: return []
    
    cursor = conexao.cursor()
    try:
        cursor.execute("""
            SELECT am.nm_area, al.ds_tipo_alerta, r.ds_acao, r.nr_volume_agua_sugerido_mm, r.ds_status
            FROM TN_RECOMENDACAO r
            JOIN TN_ALERTA al ON r.id_alerta = al.id_alerta
            JOIN TN_AREA_MONITORADA am ON r.id_area = am.id_area
            WHERE r.ds_status = 'PENDENTE'
        """)
        
        resultados = cursor.fetchall()
        
        relatorio = [
            {
                "area": row[0],
                "alerta": row[1],
                "acao": row[2],
                "volume_agua": row[3],
                "status": row[4]
            } for row in resultados
        ]
        return relatorio
        
    except Exception as e:
        print(f"\n[ERRO] Falha ao gerar o relatório: {e}")
        return []
    finally:
        cursor.close()

def registrar_predicao_ia(conexao, id_area):
    if not conexao: return False
    
    cursor = conexao.cursor()
    try:
        # Busca o tamanho da Área e cruza com o clima mais recente (NASA) daquela área
        cursor.execute("""
            SELECT am.nr_area_hectares, dc.nr_temperatura, dc.nr_umidade, dc.nr_precipitacao
            FROM TN_AREA_MONITORADA am
            LEFT JOIN (
                SELECT id_area, nr_temperatura, nr_umidade, nr_precipitacao
                FROM (SELECT * FROM TN_DADO_CLIMATICO WHERE id_area = :1 ORDER BY dt_coleta DESC)
                WHERE ROWNUM = 1
            ) dc ON am.id_area = dc.id_area
            WHERE am.id_area = :2
        """, (id_area, id_area))
        
        resultado = cursor.fetchone()
        
        if not resultado:
            print("\n[ERRO] Área não encontrada no banco de dados.")
            return False
            
        hectares, temp, umidade, chuva = resultado
        
        if hectares is None:
            print("\n[ERRO] A área não possui 'nr_area_hectares' cadastrado, impossível calcular produtividade.")
            return False
            
        if temp is None:
            print("\n[ALERTA] Nenhum dado climático da NASA encontrado! Rode a Opção 1 do menu primeiro.")
            return False

        chuva = 0.0 if chuva is None else float(chuva)
        # MOTOR PREDITIVO
        # parametro: safra ideal da Soja: ~3.5 toneladas por hectare
        produtividade_base = hectares * 3.5 
        fator_clima = 1.0
        alertas_ia = []
        
        # Penalidade por Temperatura (Soja ideal: 20ºC a 30ºC)
        if temp < 20.0:
            fator_clima -= 0.15
            alertas_ia.append(f"Estresse por frio detectado ({temp}°C)")
        elif temp > 30.0:
            fator_clima -= 0.20
            alertas_ia.append(f"Estresse térmico detectado ({temp}°C)")
            
        # Penalidade por Umidade e Chuva
        if umidade < 60.0 and chuva < 2.0:
            fator_clima -= 0.10
            alertas_ia.append("Risco severo de déficit hídrico")

        # Calcula o resultado final da produtividade e o score de confiança da IA
        produtividade_realista = round(produtividade_base * fator_clima, 2)
        score_confianca = round(0.95 * fator_clima, 2) # Confiança da IA cai se o clima for muito desfavorável

        # Monta o JSON para a coluna CLOB do Oracle com as variáveis
        entrada_dict = {
            "area_hectares": hectares,
            "temperatura_nasa": temp,
            "umidade_nasa": umidade,
            "precipitacao_nasa": chuva
        }
        
        saida_dict = {
            "confidence_score": score_confianca,
            "predicted_yield_tons": produtividade_realista,
            "risk_factors": alertas_ia
        }
        
        entrada_json = json.dumps(entrada_dict)
        saida_json = json.dumps(saida_dict)
        
        # Insere no banco os dados processados pela IA, para histórico e análises futuras
        cursor.execute("""
            INSERT INTO TN_PREDICAO_IA 
            (id_area, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista, ds_status) 
            VALUES (:1, 'PRODUTIVIDADE', 'Agro_Predictive_Tree', 'v2.0_RealData', :2, :3, :4, 'SUCESSO')
        """, (id_area, entrada_json, saida_json, produtividade_realista))
        
        conexao.commit()
        return saida_dict
        
    except Exception as e:
        print(f"\n[ERRO] Falha na execução da IA: {e}")
        return False
    finally:
        cursor.close()
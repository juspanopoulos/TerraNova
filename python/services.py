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
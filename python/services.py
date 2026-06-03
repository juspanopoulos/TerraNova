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
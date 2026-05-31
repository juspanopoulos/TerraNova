def processar_e_inserir_dados(dados_json, conexao):
    if not conexao or not dados_json:
        return False
        
    cursor = conexao.cursor()
    registros_inseridos = 0

    for registro in dados_json:
        try:
            id_regiao = registro['id_regiao']
            temp = registro['temperatura']
            cursor.execute("""
                INSERT INTO Dados_Climaticos (id_clima, id_regiao, temperatura_media) 
                VALUES (seq_clima.NEXTVAL, :1, :2)
            """, (id_regiao, temp))
            registros_inseridos += 1
        except Exception as e:
            print(f"Erro ao inserir registro {registro}: {e}")
            
    conexao.commit()
    cursor.close()
    return registros_inseridos

def gerar_alerta_erosao(conexao):
    if not conexao: return []
    
    cursor = conexao.cursor()
    cursor.execute("""
        SELECT r.nome, a.nivel_erosao, a.risco_depressao 
        FROM Analise_Solo a
        JOIN Regiao r ON a.id_regiao = r.id_regiao
        WHERE a.risco_depressao = 'ALTO' OR a.nivel_erosao = 'GRAVE'
    """)
    alertas = cursor.fetchall()
    cursor.close()
    
    lista_alertas = [{"regiao": row[0], "erosao": row[1], "depressao": row[2]} for row in alertas]
    return lista_alertas
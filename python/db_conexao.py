import oracledb

def conectar_oracle():
    print("\nCredenciais de Acesso ao Banco de Dados")
    
    login = input('Usuário: ')
    senha = input('Senha: ')

    try:
        print("Estabelecendo conexão, por favor aguarde...")

        conn = oracledb.connect(user=login,
                                password=senha,
                                host="oracle.fiap.com.br",
                                port=1521,
                                service_name="ORCL")
        
        print("Conexão estabelecida com sucesso!")
        return conn
    
    except oracledb.DatabaseError as e:
        print(f"\n[ERRO CRÍTICO] Falha na conexão com o Oracle: {e}")
        return None
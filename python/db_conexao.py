import oracledb
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

def conectar_oracle():
    print("\n--- Conectando ao Banco de Dados (Autenticação Segura) ---")
    
    # Busca as credenciais diretamente do OS(Sistema Operacional) usando o python-dotenv
    login = os.getenv("ORACLE_USER")
    senha = os.getenv("ORACLE_PASSWORD")
    
    # Trava de segurança(se esquecer de criar o .env)
    if not login or not senha:
        print("[ERRO DE SEGURANÇA] Arquivo .env não encontrado ou incompleto.")
        print("Crie um arquivo '.env' na raiz com ORACLE_USER e ORACLE_PASSWORD.")
        return None
    
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
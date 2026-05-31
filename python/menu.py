import time
from db_conexao import conectar_oracle
from geren_arquivos import importar_dados_satelite
from services import processar_e_inserir_dados, gerar_alerta_erosao

def exibir_menu():
    print("\n" + "="*50)
    print("   PLATAFORMA DE RISCOS AGRÍCOLAS - AGRO & CLIMA")
    print("="*50)
    print("1. Importar dados climáticos e de solo (Satélite)")
    print("2. Consultar histórico de variação climática")
    print("3. Cadastrar novos registros de sucesso de plantação")
    print("4. Gerar Alerta: Áreas com risco de depressão/erosão")
    print("5. Painel Resumo: Qualidade do Ar vs População")
    print("0. Sair do Sistema")
    print("="*50)

def main():
    print("Iniciando o sistema de monitoramento...")
    time.sleep(1)
    conexao = conectar_oracle()
    
    while True:
        exibir_menu()
        opcao = input("Selecione uma opção: ")
        
        if opcao == '1':
            print("\nImportando Dados do Satélite...")
            time.sleep(1.5) # Simula o tempo de leitura do JSON
            dados = importar_dados_satelite('satelite_dados.json')
            if dados:
                qtd = processar_e_inserir_dados(dados, conexao)
                time.sleep(0.5)
                print(f"Sucesso! {qtd} registros processados e salvos no Oracle.")
                
        elif opcao == '2':
            print("\nAcessando Histórico Climático...")
            time.sleep(1) # Simula a requisição ao banco
            # Implementar chamada para SELECT do banco de dados climáticos
            print("Funcionalidade em desenvolvimento...")
            
        elif opcao == '3':
            print("\nAbrindo Cadastro de Safra...")
            time.sleep(1)
            # Implementar inputs e INSERT do projeto
            print("Funcionalidade em desenvolvimento...")
            
        elif opcao == '4':
            print("\nAnalisando Alertas de Solo no Banco de Dados...")
            time.sleep(1.5) # Simula o processamento da query
            alertas = gerar_alerta_erosao(conexao)
            if alertas:
                for alerta in alertas:
                    time.sleep(0.5)
                    print(f"ATENÇÃO: {alerta['regiao']} | Erosão: {alerta['erosao']} | Depressão: {alerta['depressao']}")
            else:
                print("Nenhum alerta crítico no momento ou falha de conexão.")
                
        elif opcao == '5':
            print("\nCarregando Painel Resumo Ambiental...")
            time.sleep(1)
            # Implementar chamada para o JOIN de Ar vs População
            print("Funcionalidade em desenvolvimento... Aguarde atualizações.")
            
        elif opcao == '0':
            print("\nDesconectando do banco de dados...")
            time.sleep(1)
            if conexao:
                conexao.close()
            print("Encerrando o sistema. Até logo!")
            time.sleep(1)
            break
            
        else:
            print("\n[ERRO] Opção inválida. Tente novamente.")
            
        time.sleep(2) 

if __name__ == "__main__":
    main()
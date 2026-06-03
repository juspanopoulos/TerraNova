import time
from db_conexao import conectar_oracle
from geren_arquivos import importar_dados_satelite
from services import processar_e_inserir_dados, buscar_alertas_ativos

def exibir_menu():
    print("\n" + "="*55)
    print("   PROJETO TERRA NOVA - MONITORAMENTO AGRÍCOLA")
    print("="*55)
    print("1. Importar Dados Climáticos de Satélite (INMET/NASA)")
    print("2. Consultar Histórico Climático por Área")
    print("3. Registrar Novo Plantio (Vincular Área e Cultura)")
    print("4. Painel de Alertas Críticos Abertos")
    print("5. Gerar Relatório de Recomendações vs Alertas")
    print("0. Sair do Sistema")
    print("="*55)

def main():
    print("Iniciando o sistema Terra Nova...")
    time.sleep(1)
    conexao = conectar_oracle()
    
    while True:
        exibir_menu()
        opcao = input("Selecione uma opção: ")
        
        if opcao == '1':
            print("\nImportando Dados de Satélite...")
            time.sleep(1.5)
            dados = importar_dados_satelite('satelite_dados.json')
            if dados:
                qtd = processar_e_inserir_dados(dados, conexao)
                time.sleep(0.5)
                print(f"Sucesso! {qtd} registros climáticos inseridos no Oracle (TN_DADO_CLIMATICO).")
                
        elif opcao == '2':
            print("\nAcessando Histórico Climático...")
            time.sleep(1)
            # SELECT de TN_DADO_CLIMATICO
            print("Funcionalidade em desenvolvimento...")
            
        elif opcao == '3':
            print("\nAbrindo Registro de Plantio...")
            time.sleep(1)
            # INSERT em TN_AREA_CULTURA
            print("Funcionalidade em desenvolvimento...")
            
        elif opcao == '4':
            print("\nBuscando Alertas Ativos no Banco de Dados...")
            time.sleep(1.5)
            alertas = buscar_alertas_ativos(conexao)
            
            if alertas:
                for alerta in alertas:
                    time.sleep(0.5)
                    print(f"[{alerta['severidade']}] {alerta['tipo']} em {alerta['area']} -> {alerta['descricao']}")
            else:
                print("Excelente! Nenhum alerta crítico aberto no momento.")
                
        elif opcao == '5':
            print("\nCarregando Relatório de Recomendações...")
            time.sleep(1)
            # JOIN entre TN_RECOMENDACAO, TN_ALERTA e TN_AREA_MONITORADA
            print("Funcionalidade em desenvolvimento... Aguarde atualizações.")
            
        elif opcao == '0':
            print("\nDesconectando do banco de dados...")
            time.sleep(1)
            if conexao:
                conexao.close()
            print("Encerrando o sistema Terra Nova. Até logo!")
            time.sleep(1)
            break
            
        else:
            print("\n[ERRO] Opção inválida. Tente novamente.")
            
        time.sleep(2) 

if __name__ == "__main__":
    main()
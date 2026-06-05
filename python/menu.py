import time
from db_conexao import conectar_oracle
from geren_arquivos import importar_dados_satelite
from services import processar_e_inserir_dados, buscar_alertas_ativos, consultar_historico_climatico, registrar_novo_plantio, gerar_relatorio_recomendacoes
from api_clima import coletar_dados_satelite

def exibir_menu():
    print("\n" + "="*55)
    print("   PROJETO TERRA NOVA - MONITORAMENTO AGRÍCOLA")
    print("="*55)
    print("1. Extrair Dados da NASA e Atualizar Banco Oracle")
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
            print("\nIniciando o processo de ETL (Extração, Transformação e Carga)...")
            time.sleep(1)

            # Coleta os dados reais da NASA e salva em um arquivo .json local
            coletar_dados_satelite()
            time.sleep(1.5)
            
            # Lê o arquivo local gerado pela API e transforma os dados para o formato esperado pela tabela TN_DADO_CLIMATICO
            print("\nLendo o arquivo local gerado pela API...")
            dados = importar_dados_satelite('satelite_dados.json')
            
            # Insere no banco de dados Oracle
            if dados:
                print("Inserindo dados limpos na tabela TN_DADO_CLIMATICO...")
                qtd = processar_e_inserir_dados(dados, conexao)
                time.sleep(0.5)
                print(f"Sucesso! {qtd} registros climáticos inseridos no Oracle.")
                
        elif opcao == '2':
            print("\nAcessando Histórico Climático...")
            time.sleep(1)
            id_busca = 1 
            historico = consultar_historico_climatico(conexao, id_busca)
            
            if historico:
                print(f"\n--- Histórico de Clima (Área ID: {id_busca}) ---")
                for registro in historico:
                    # Formata a data para o padrão DD/MM/AAAA
                    data_formatada = registro['data'].strftime('%d/%m/%Y')
                    time.sleep(0.3)
                    print(f"Data: {data_formatada} | Temp: {registro['temperatura']}°C | Umidade: {registro['umidade']}% | Chuva: {registro['precipitacao']}mm | Fonte: {registro['fonte']}")
            else:
                print(f"Nenhum registro climático encontrado para a área {id_busca}.")
            
        elif opcao == '3':
            print("\nAbrindo Registro de Plantio...")
            time.sleep(1)
            
            print("\n--- Novo Registro de Plantio ---")
            try:
                id_area = int(input("Digite o ID da Área Monitorada (ex: 1): "))
                id_cultura = int(input("Digite o ID da Cultura (ex: 1 para Soja): "))
                dt_plantio = input("Data do Plantio (DD/MM/AAAA): ")
                dt_colheita = input("Previsão de Colheita (DD/MM/AAAA): ")
                
                print("\nValidando e processando registro...")
                time.sleep(1)
                
                sucesso = registrar_novo_plantio(conexao, id_area, id_cultura, dt_plantio, dt_colheita)
                
                if sucesso:
                    print("Sucesso! O plantio foi registrado no banco e está com status 'ATIVO'.")
            except ValueError:
                print("\n[ERRO] Entrada inválida. Os IDs precisam ser números inteiros (ex: 1, 2, 3).")
            
        elif opcao == '4':
            print("\nBuscando Alertas Ativos no Banco de Dados...")
            time.sleep(1.5)
            alertas = buscar_alertas_ativos(conexao)
            
            if alertas:
                print("\n" + "!"*50)
                print("           PAINEL DE ALERTAS CRÍTICOS")
                print("!"*50)
                for alerta in alertas:
                    time.sleep(0.5)
                    print(f"[{alerta['severidade']}] {alerta['tipo']} na área {alerta['area']}")
                    print(f"   ↳ {alerta['descricao']}\n")
            else:
                print("\nExcelente! Nenhum alerta crítico aberto no momento.")
            
            if alertas:
                for alerta in alertas:
                    time.sleep(0.5)
                    print(f"[{alerta['severidade']}] {alerta['tipo']} em {alerta['area']} -> {alerta['descricao']}")
            else:
                print("Excelente! Nenhum alerta crítico aberto no momento.")
                
        elif opcao == '5':
            print("\nCarregando Relatório de Recomendações...")
            time.sleep(1.5)
            
            relatorio = gerar_relatorio_recomendacoes(conexao)
            
            if relatorio:
                print("\n" + "="*60)
                print("      RELATÓRIO DE AÇÕES E RECOMENDAÇÕES (PENDENTES)")
                print("="*60)
                
                for rec in relatorio:
                    time.sleep(0.5)
                    agua_msg = f" | Irrigação sugerida: {rec['volume_agua']}mm" if rec['volume_agua'] else ""
                    
                    print(f"Área: {rec['area']}")
                    print(f"Motivo (Alerta): {rec['alerta']}")
                    print(f"Ação: {rec['acao']}{agua_msg}")
                    print("-" * 60)
            else:
                print("\nNenhuma recomendação técnica pendente no momento. Lavouras seguras!")
            
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
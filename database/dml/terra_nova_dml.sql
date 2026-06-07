-- ============================================================
-- PROJETO: TERRA NOVA
-- DISCIPLINA: BUILDING RELATIONAL DATABASE - FIAP
-- DESCRICAO: Script DML - Insercao de dados de teste
-- ============================================================

-- ============================================================
-- INTEGRANTES DO GRUPO
-- ============================================================
-- Guilherme Anitelli Cardoso       RM: 566744
-- Guilherme Santos Sena            RM: 568101
-- Igor Dantas da Silva             RM: 568337
-- Julia Silva Spanopoulos          RM: 566754
-- Julia Valerio Guimaraes da Silva RM: 568275
-- ============================================================

-- ============================================================
-- ORDEM DE INSERCAO: FORTES -> MENOS FORTES -> FRACAS
-- ============================================================


-- ============================================================
-- 1. TN_EMPRESA (3 registros)
-- ============================================================
INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('AgroTech Brasil Ltda', '12.345.678/0001-90', 'contato@agrotech.com.br', '11999990001');

INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('Campo Verde Agronegocio SA', '98.765.432/0001-10', 'contato@campoverde.com.br', '11999990002');

INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('Sertao Fertil Cooperativa', '55.444.333/0001-22', 'contato@sertaofertil.com.br', '11999990003');

COMMIT;


-- ============================================================
-- 2. TN_CULTURA (4 registros)
-- ============================================================
INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Soja', 'Cultura de soja convencional', 450.00, 'Outubro a Dezembro');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Milho', 'Cultura de milho safrinha', 500.00, 'Janeiro a Marco');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Cana-de-Acucar', 'Cultura de cana para processamento', 1500.00, 'Marco a Abril');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Algodao', 'Cultura de algodao herbaceo', 700.00, 'Dezembro a Janeiro');

COMMIT;


-- ============================================================
-- 3. TN_PROPRIEDADE (4 registros)
-- ============================================================
INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (1, 'Fazenda Cerrado Norte', 'Sorriso, MT', -12.544000, -55.720000, 1200.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (1, 'Fazenda Rio Verde', 'Rio Verde, GO', -17.798000, -50.928000, 850.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (2, 'Sitio Boa Esperanca', 'Uberaba, MG', -19.747000, -47.931000, 320.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (3, 'Fazenda Serra Dourada', 'Barreiras, BA', -12.151000, -44.987000, 2100.00);

COMMIT;


-- ============================================================
-- 4. TN_USUARIO (6 registros)
-- ============================================================
INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (1, 'Carlos Mendes', 'carlos.mendes@agrotech.com.br', 'hash_senha_001', '111.222.333-44', 'ADMIN', 'ATIVO');

INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (1, 'Fernanda Lima', 'fernanda.lima@agrotech.com.br', 'hash_senha_002', '222.333.444-55', 'OPERADOR', 'ATIVO');

INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (2, 'Roberto Souza', 'roberto.souza@campoverde.com.br', 'hash_senha_003', '333.444.555-66', 'ADMIN', 'ATIVO');

INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (2, 'Patricia Oliveira', 'patricia.oliveira@campoverde.com.br', 'hash_senha_004', '444.555.666-77', 'OPERADOR', 'ATIVO');

INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (3, 'Marcos Alves', 'marcos.alves@sertaofertil.com.br', 'hash_senha_005', '555.666.777-88', 'ADMIN', 'ATIVO');

INSERT INTO TN_USUARIO (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
VALUES (3, 'Ana Costa', 'ana.costa@sertaofertil.com.br', 'hash_senha_006', '666.777.888-99', 'VISUALIZADOR', 'INATIVO');

COMMIT;


-- ============================================================
-- 5. TN_AREA_MONITORADA (4 registros)
-- ============================================================
INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (1, 'Talhao Norte A1', 300.00, 'Latossolo Vermelho');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (2, 'Talhao Sul B1', 200.00, 'Latossolo Amarelo');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (3, 'Setor Irrigado C1', 80.00, 'Argissolo Vermelho');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (4, 'Bloco Leste D1', 500.00, 'Neossolo Quartzarenico');

COMMIT;


-- ============================================================
-- 6. TN_AREA_CULTURA (4 registros - tabela associativa N:N)
-- ============================================================
INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (1, 1, DATE '2025-10-15', DATE '2026-02-20', 'ATIVO', 'Florescimento');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (2, 2, DATE '2026-01-10', DATE '2026-05-15', 'ATIVO', 'Crescimento Vegetativo');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (3, 3, DATE '2025-03-20', DATE '2026-04-10', 'ATIVO', 'Maturacao');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (4, 4, DATE '2025-12-05', DATE '2026-06-30', 'ATIVO', 'Emergencia');

COMMIT;


-- ============================================================
-- 7. TN_DADO_CLIMATICO (8 registros)
-- ============================================================
INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (1, DATE '2026-05-01', DATE '2026-05-01', 32.50, 45.00, 0.00, 8.50, 18.00, 220.50, 'NASA');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (1, DATE '2026-05-02', DATE '2026-05-02', 33.00, 40.00, 0.00, 9.00, 20.00, 235.00, 'NASA');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (2, DATE '2026-05-01', DATE '2026-05-01', 28.00, 65.00, 12.50, 6.00, 15.00, 180.00, 'NASA');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (2, DATE '2026-05-02', DATE '2026-05-02', 27.50, 70.00, 25.00, 5.50, 12.00, 160.00, 'ESA');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (3, DATE '2026-05-01', DATE '2026-05-01', 30.00, 55.00, 5.00, 7.00, 10.00, 200.00, 'INMET');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (3, DATE '2026-05-02', DATE '2026-05-02', 31.00, 50.00, 0.00, 7.50, 14.00, 210.00, 'INMET');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (4, DATE '2026-05-01', DATE '2026-05-01', 36.00, 30.00, 0.00, 10.00, 25.00, 280.00, 'NASA');

INSERT INTO TN_DADO_CLIMATICO (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
VALUES (4, DATE '2026-05-02', DATE '2026-05-02', 37.50, 25.00, 0.00, 11.00, 28.00, 295.00, 'NASA');

COMMIT;


-- ============================================================
-- 8. TN_LEITURA_SOLO (7 registros)
-- ============================================================
INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (1, DATE '2026-05-01', 38.00, 'Latossolo Vermelho', 'SENSOR');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (1, DATE '2026-05-02', 32.00, 'Latossolo Vermelho', 'SENSOR');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (2, DATE '2026-05-01', 55.00, 'Latossolo Amarelo', 'SENSOR');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (3, DATE '2026-05-01', 60.00, 'Argissolo Vermelho', 'MANUAL');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (3, DATE '2026-05-02', 58.00, 'Argissolo Vermelho', 'MANUAL');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (4, DATE '2026-05-01', 18.00, 'Neossolo Quartzarenico', 'NASA');

INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
VALUES (4, DATE '2026-05-02', 15.00, 'Neossolo Quartzarenico', 'NASA');

COMMIT;


-- ============================================================
-- 9. TN_IRRIGACAO (6 registros)
-- ============================================================
INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (1, DATE '2026-05-01', 'GOTEJAMENTO', 20.00, 18.50, 300.00, 'SIM', 'SENSOR');

INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (1, DATE '2026-05-02', 'GOTEJAMENTO', 18.50, 22.00, 300.00, 'SIM', 'SENSOR');

INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (2, DATE '2026-05-01', 'ASPERSAO', 30.00, 28.00, 200.00, 'NAO', 'MANUAL');

INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (3, DATE '2026-05-01', 'PIVO', 25.00, 25.00, 80.00, 'NAO', 'SENSOR');

INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (4, DATE '2026-05-01', 'SULCO', 15.00, 10.00, 500.00, 'NAO', 'MANUAL');

INSERT INTO TN_IRRIGACAO (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
VALUES (4, DATE '2026-05-02', 'SULCO', 10.00, 8.00, 500.00, 'NAO', 'IA');

COMMIT;


-- ============================================================
-- 10. TN_ALERTA (7 registros)
-- ============================================================
INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (1, DATE '2026-05-02', 'SECA', 'Umidade do solo abaixo de 35% por 2 dias consecutivos', 'MEDIA', 'ABERTO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (4, DATE '2026-05-01', 'SECA', 'Umidade do solo criticamente baixa, abaixo de 20%', 'CRITICA', 'ABERTO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (4, DATE '2026-05-02', 'DEFICIT_HIDRICO', 'Consumo de irrigacao abaixo do recomendado pela IA por 2 dias', 'ALTA', 'ABERTO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (2, DATE '2026-05-02', 'ENCHENTE', 'Precipitacao acumulada de 37.5mm em 24h, risco de alagamento', 'ALTA', 'RESOLVIDO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (3, DATE '2026-04-28', 'EXCESSO_IRRIGACAO', 'Volume de irrigacao 40% acima do recomendado para o estagio atual', 'BAIXA', 'RESOLVIDO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (1, DATE '2026-04-15', 'GEADA', 'Temperatura minima prevista abaixo de 5 graus nas proximas 48h', 'ALTA', 'RESOLVIDO');

INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
VALUES (4, DATE '2026-04-10', 'GRANIZO', 'Previsao de granizo com ventos de 28 km/h para a regiao', 'MEDIA', 'RESOLVIDO');

COMMIT;


-- ============================================================
-- 11. TN_RECOMENDACAO (5 registros)
-- ============================================================
INSERT INTO TN_RECOMENDACAO (id_area, id_alerta, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
VALUES (1, 1, DATE '2026-05-02', 'Aumentar frequencia de irrigacao por gotejamento para 2x ao dia', 25.00, 'PENDENTE');

INSERT INTO TN_RECOMENDACAO (id_area, id_alerta, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
VALUES (4, 2, DATE '2026-05-01', 'Iniciar irrigacao emergencial por sulco imediatamente', 40.00, 'APLICADA');

INSERT INTO TN_RECOMENDACAO (id_area, id_alerta, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
VALUES (4, 3, DATE '2026-05-02', 'Aumentar volume de irrigacao diario para atingir minimo recomendado pela IA', 35.00, 'PENDENTE');

INSERT INTO TN_RECOMENDACAO (id_area, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
VALUES (2, DATE '2026-05-03', 'Suspender irrigacao por 48h devido a precipitacao acumulada elevada', 0.00, 'APLICADA');

INSERT INTO TN_RECOMENDACAO (id_area, id_alerta, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
VALUES (3, 5, DATE '2026-04-28', 'Reduzir volume de irrigacao em 40% e monitorar umidade do solo diariamente', 15.00, 'IGNORADA');

COMMIT;


-- ============================================================
-- 12. TN_PREDICAO_IA (4 registros)
-- ============================================================
INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista, ds_classificacao, ds_status)
VALUES (1, 1, 1, DATE '2026-05-02', 'PRODUTIVIDADE', 'RandomForest Produtividade', 'v1.0', '{"temperatura":33.0,"umidade":40.0,"precipitacao":0.0}', '{"produtividade":3850.5,"classificacao":"BOA"}', 3850.50, 'BOA', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_volume_agua_sugerido_mm, ds_situacao, ds_status)
VALUES (1, 1, 1, DATE '2026-05-02', 'IRRIGACAO', 'Regressao Irrigacao', 'v1.0', '{"umidade_solo":32.0,"tipo_solo":"Latossolo Vermelho","estagio":"Florescimento"}', '{"volume_sugerido":25.0,"situacao":"DEFICIT_MODERADO"}', 25.00, 'DEFICIT_MODERADO', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista, ds_classificacao, ds_status)
VALUES (4, 4, 5, DATE '2026-05-01', 'PRODUTIVIDADE', 'RandomForest Produtividade', 'v1.0', '{"temperatura":36.0,"umidade":30.0,"precipitacao":0.0}', '{"produtividade":1200.0,"classificacao":"CRITICA"}', 1200.00, 'CRITICA', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_volume_agua_sugerido_mm, ds_situacao, ds_status)
VALUES (4, 4, 5, DATE '2026-05-02', 'IRRIGACAO', 'Regressao Irrigacao', 'v1.0', '{"umidade_solo":15.0,"tipo_solo":"Neossolo Quartzarenico","estagio":"Emergencia"}', '{"volume_sugerido":40.0,"situacao":"DEFICIT_CRITICO"}', 40.00, 'DEFICIT_CRITICO', 'SUCESSO');

COMMIT;

-- ORDEM DE CRIACAO: FORTES -> MENOS FORTES -> FRACAS
-- TABELAS FORTES (nao dependem de nenhuma outra)
-- 1. TN_EMPRESA
CREATE TABLE TN_EMPRESA (
    id_empresa      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nm_empresa      VARCHAR2(100)   NOT NULL,
    nr_cnpj         VARCHAR2(18)    NOT NULL,
    ds_email        VARCHAR2(100)   NOT NULL,
    nr_telefone     VARCHAR2(20),
    dt_cadastro     DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT uq_nr_cnpj UNIQUE (nr_cnpj),
    CONSTRAINT uq_ds_email_empresa UNIQUE (ds_email)
);

-- 2. TN_CULTURA
CREATE TABLE TN_CULTURA (
    id_cultura                  NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nm_cultura                  VARCHAR2(100)   NOT NULL,
    ds_cultura                  VARCHAR2(300),
    nr_necessidade_hidrica_mm   NUMBER(6,2)     NOT NULL,
    ds_periodo_plantio          VARCHAR2(100),
    CONSTRAINT uq_nm_cultura UNIQUE (nm_cultura)
);

-- TABELAS MENOS FORTES (dependem das tabelas fortes)
-- 3. TN_PROPRIEDADE
CREATE TABLE TN_PROPRIEDADE (
    id_propriedade          NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empresa              NUMBER          NOT NULL,
    nm_propriedade          VARCHAR2(100)   NOT NULL,
    ds_localizacao          VARCHAR2(200)   NOT NULL,
    nr_latitude             NUMBER(9,6),
    nr_longitude            NUMBER(9,6),
    nr_area_total_hectares  NUMBER(10,2),
    CONSTRAINT fk_propriedade_empresa FOREIGN KEY (id_empresa)
        REFERENCES TN_EMPRESA (id_empresa)
);

-- 4. TN_USUARIO
CREATE TABLE TN_USUARIO (
    id_usuario          NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empresa          NUMBER          NOT NULL,
    nm_usuario          VARCHAR2(100)   NOT NULL,
    ds_email            VARCHAR2(100)   NOT NULL,
    ds_senha_hash       VARCHAR2(255)   NOT NULL,
    nr_cpf              VARCHAR2(14),
    ds_perfil           VARCHAR2(20)    DEFAULT 'OPERADOR' NOT NULL,
    ds_status           VARCHAR2(15)    DEFAULT 'ATIVO' NOT NULL,
    dt_cadastro         DATE            DEFAULT SYSDATE NOT NULL,
    dt_ultimo_acesso    DATE,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (id_empresa)
        REFERENCES TN_EMPRESA (id_empresa),
    CONSTRAINT uq_ds_email_usuario UNIQUE (ds_email),
    CONSTRAINT ck_ds_perfil CHECK (ds_perfil IN ('ADMIN', 'OPERADOR', 'VISUALIZADOR')),
    CONSTRAINT ck_ds_status_usuario CHECK (ds_status IN ('ATIVO', 'INATIVO'))
);

-- TABELAS FRACAS (dependem das tabelas anteriores)
-- 5. TN_AREA_MONITORADA
CREATE TABLE TN_AREA_MONITORADA (
    id_area             NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propriedade      NUMBER          NOT NULL,
    nm_area             VARCHAR2(100)   NOT NULL,
    nr_area_hectares    NUMBER(10,2),
    ds_tipo_solo        VARCHAR2(100),
    CONSTRAINT fk_area_propriedade FOREIGN KEY (id_propriedade)
        REFERENCES TN_PROPRIEDADE (id_propriedade)
);

-- 6. TN_AREA_CULTURA (tabela associativa N:N)
CREATE TABLE TN_AREA_CULTURA (
    id_area_cultura          NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area                  NUMBER          NOT NULL,
    id_cultura               NUMBER          NOT NULL,
    dt_plantio               DATE            NOT NULL,
    dt_colheita_prevista     DATE,
    ds_status                VARCHAR2(20)    DEFAULT 'ATIVO' NOT NULL,
    ds_estagio_crescimento   VARCHAR2(50),
    CONSTRAINT fk_area_cultura_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT fk_area_cultura_cultura FOREIGN KEY (id_cultura)
        REFERENCES TN_CULTURA (id_cultura),
    CONSTRAINT ck_ds_status_cultura CHECK (ds_status IN ('ATIVO', 'COLHIDO', 'PERDIDO'))
);

-- 7. TN_DADO_CLIMATICO
CREATE TABLE TN_DADO_CLIMATICO (
    id_dado                  NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area                  NUMBER          NOT NULL,
    dt_coleta                DATE            NOT NULL,
    dt_referencia            DATE,
    nr_temperatura           NUMBER(5,2)     NOT NULL,
    nr_umidade               NUMBER(5,2)     NOT NULL,
    nr_precipitacao          NUMBER(6,2),
    nr_indice_uv             NUMBER(4,2),
    nr_velocidade_vento_kmh  NUMBER(6,2),
    nr_radiacao_solar        NUMBER(8,2),
    ds_fonte_api             VARCHAR2(20)    NOT NULL,
    CONSTRAINT fk_dado_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT ck_ds_fonte_api CHECK (ds_fonte_api IN ('NASA', 'ESA', 'INMET', 'MANUAL')),
    CONSTRAINT ck_nr_umidade CHECK (nr_umidade BETWEEN 0 AND 100)
);

-- 8. TN_LEITURA_SOLO
CREATE TABLE TN_LEITURA_SOLO (
    id_leitura_solo   NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area           NUMBER          NOT NULL,
    dt_coleta         DATE            DEFAULT SYSDATE NOT NULL,
    nr_umidade_solo   NUMBER(5,2)     NOT NULL,
    ds_tipo_solo      VARCHAR2(100),
    ds_fonte          VARCHAR2(20)    DEFAULT 'MANUAL' NOT NULL,
    CONSTRAINT fk_leitura_solo_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT ck_nr_umidade_solo CHECK (nr_umidade_solo BETWEEN 0 AND 100),
    CONSTRAINT ck_ds_fonte_solo CHECK (ds_fonte IN ('MANUAL', 'SENSOR', 'NASA', 'IA'))
);

-- 9. TN_IRRIGACAO
CREATE TABLE TN_IRRIGACAO (
    id_irrigacao              NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area                   NUMBER          NOT NULL,
    dt_registro               DATE            DEFAULT SYSDATE NOT NULL,
    ds_tipo_irrigacao         VARCHAR2(30)    NOT NULL,
    nr_irrigacao_anterior_mm  NUMBER(6,2),
    nr_consumo_atual_mm       NUMBER(6,2),
    nr_area_campo_hectare     NUMBER(10,2),
    ds_usou_cobertura_solo    VARCHAR2(3)     DEFAULT 'NAO' NOT NULL,
    ds_origem                 VARCHAR2(20)    DEFAULT 'MANUAL' NOT NULL,
    CONSTRAINT fk_irrigacao_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT ck_ds_tipo_irrigacao CHECK (ds_tipo_irrigacao IN ('GOTEJAMENTO', 'ASPERSAO', 'SULCO', 'PIVO', 'MANUAL', 'OUTRO')),
    CONSTRAINT ck_ds_cobertura_solo CHECK (ds_usou_cobertura_solo IN ('SIM', 'NAO')),
    CONSTRAINT ck_ds_origem_irrigacao CHECK (ds_origem IN ('MANUAL', 'SENSOR', 'IA'))
);

-- 10. TN_ALERTA
CREATE TABLE TN_ALERTA (
    id_alerta       NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area         NUMBER          NOT NULL,
    dt_alerta       DATE            DEFAULT SYSDATE NOT NULL,
    ds_tipo_alerta  VARCHAR2(30)    NOT NULL,
    ds_descricao    VARCHAR2(500)   NOT NULL,
    ds_severidade   VARCHAR2(10)    NOT NULL,
    ds_status       VARCHAR2(15)    DEFAULT 'ABERTO' NOT NULL,
    CONSTRAINT fk_alerta_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT ck_ds_tipo_alerta CHECK (ds_tipo_alerta IN ('SECA', 'ENCHENTE', 'GEADA', 'GRANIZO', 'EXCESSO_IRRIGACAO', 'DEFICIT_HIDRICO')),
    CONSTRAINT ck_ds_severidade CHECK (ds_severidade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
    CONSTRAINT ck_ds_status_alerta CHECK (ds_status IN ('ABERTO', 'RESOLVIDO'))
);

-- 11. TN_RECOMENDACAO
CREATE TABLE TN_RECOMENDACAO (
    id_recomendacao             NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area                     NUMBER          NOT NULL,
    id_alerta                   NUMBER,
    dt_recomendacao             DATE            DEFAULT SYSDATE NOT NULL,
    ds_acao                     VARCHAR2(500)   NOT NULL,
    nr_volume_agua_sugerido_mm  NUMBER(6,2),
    ds_status                   VARCHAR2(15)    DEFAULT 'PENDENTE' NOT NULL,
    CONSTRAINT fk_recomendacao_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT fk_recomendacao_alerta FOREIGN KEY (id_alerta)
        REFERENCES TN_ALERTA (id_alerta),
    CONSTRAINT ck_ds_status_recomendacao CHECK (ds_status IN ('PENDENTE', 'APLICADA', 'IGNORADA'))
);

-- 12. TN_PREDICAO_IA
CREATE TABLE TN_PREDICAO_IA (
    id_predicao                  NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area                      NUMBER          NOT NULL,
    id_area_cultura              NUMBER,
    id_usuario                   NUMBER,
    dt_predicao                  DATE            DEFAULT SYSDATE NOT NULL,
    ds_tipo_modelo               VARCHAR2(30)    NOT NULL,
    ds_nome_modelo               VARCHAR2(100),
    ds_versao_modelo             VARCHAR2(30),
    ds_entrada_json              CLOB            NOT NULL,
    ds_saida_json                CLOB,
    nr_produtividade_prevista    NUMBER(10,2),
    ds_classificacao             VARCHAR2(30),
    nr_volume_agua_sugerido_mm   NUMBER(6,2),
    ds_situacao                  VARCHAR2(300),
    ds_status                    VARCHAR2(15)    DEFAULT 'SUCESSO' NOT NULL,
    ds_erro                      VARCHAR2(500),
    CONSTRAINT fk_predicao_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT fk_predicao_area_cultura FOREIGN KEY (id_area_cultura)
        REFERENCES TN_AREA_CULTURA (id_area_cultura),
    CONSTRAINT fk_predicao_usuario FOREIGN KEY (id_usuario)
        REFERENCES TN_USUARIO (id_usuario),
    CONSTRAINT ck_ds_tipo_modelo CHECK (ds_tipo_modelo IN ('PRODUTIVIDADE', 'IRRIGACAO')),
    CONSTRAINT ck_ds_status_predicao CHECK (ds_status IN ('SUCESSO', 'ERRO'))
);


-- ORDEM DE INSERCAO: FORTES -> MENOS FORTES -> FRACAS
-- 1. TN_EMPRESA (3 registros)
INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('AgroTech Brasil Ltda', '12.345.678/0001-90', 'contato@agrotech.com.br', '11999990001');

INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('Campo Verde Agronegocio SA', '98.765.432/0001-10', 'contato@campoverde.com.br', '11999990002');

INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
VALUES ('Sertao Fertil Cooperativa', '55.444.333/0001-22', 'contato@sertaofertil.com.br', '11999990003');

COMMIT;

-- 2. TN_CULTURA (4 registros)
INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Soja', 'Cultura de soja convencional', 450.00, 'Outubro a Dezembro');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Milho', 'Cultura de milho safrinha', 500.00, 'Janeiro a Marco');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Cana-de-Acucar', 'Cultura de cana para processamento', 1500.00, 'Marco a Abril');

INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
VALUES ('Algodao', 'Cultura de algodao herbaceo', 700.00, 'Dezembro a Janeiro');

COMMIT;

-- 3. TN_PROPRIEDADE (4 registros)
INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (1, 'Fazenda Cerrado Norte', 'Sorriso, MT', -12.544000, -55.720000, 1200.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (1, 'Fazenda Rio Verde', 'Rio Verde, GO', -17.798000, -50.928000, 850.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (2, 'Sitio Boa Esperanca', 'Uberaba, MG', -19.747000, -47.931000, 320.00);

INSERT INTO TN_PROPRIEDADE (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
VALUES (3, 'Fazenda Serra Dourada', 'Barreiras, BA', -12.151000, -44.987000, 2100.00);

COMMIT;

-- 4. TN_USUARIO (6 registros)
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

-- 5. TN_AREA_MONITORADA (4 registros)
INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (1, 'Talhao Norte A1', 300.00, 'Latossolo Vermelho');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (2, 'Talhao Sul B1', 200.00, 'Latossolo Amarelo');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (3, 'Setor Irrigado C1', 80.00, 'Argissolo Vermelho');

INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
VALUES (4, 'Bloco Leste D1', 500.00, 'Neossolo Quartzarenico');

COMMIT;

-- 6. TN_AREA_CULTURA (4 registros - tabela associativa N:N)
INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (1, 1, DATE '2025-10-15', DATE '2026-02-20', 'ATIVO', 'Florescimento');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (2, 2, DATE '2026-01-10', DATE '2026-05-15', 'ATIVO', 'Crescimento Vegetativo');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (3, 3, DATE '2025-03-20', DATE '2026-04-10', 'ATIVO', 'Maturacao');

INSERT INTO TN_AREA_CULTURA (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
VALUES (4, 4, DATE '2025-12-05', DATE '2026-06-30', 'ATIVO', 'Emergencia');

COMMIT;

-- 7. TN_DADO_CLIMATICO (8 registros)
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

-- 8. TN_LEITURA_SOLO (7 registros)
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

-- 9. TN_IRRIGACAO (6 registros)
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

-- 10. TN_ALERTA (7 registros)
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

-- 11. TN_RECOMENDACAO (5 registros)
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

-- 12. TN_PREDICAO_IA (4 registros)
INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista, ds_classificacao, ds_status)
VALUES (1, 1, 1, DATE '2026-05-02', 'PRODUTIVIDADE', 'RandomForest Produtividade', 'v1.0', '{"temperatura":33.0,"umidade":40.0,"precipitacao":0.0}', '{"produtividade":3850.5,"classificacao":"BOA"}', 3850.50, 'BOA', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_volume_agua_sugerido_mm, ds_situacao, ds_status)
VALUES (1, 1, 1, DATE '2026-05-02', 'IRRIGACAO', 'Regressao Irrigacao', 'v1.0', '{"umidade_solo":32.0,"tipo_solo":"Latossolo Vermelho","estagio":"Florescimento"}', '{"volume_sugerido":25.0,"situacao":"DEFICIT_MODERADO"}', 25.00, 'DEFICIT_MODERADO', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista, ds_classificacao, ds_status)
VALUES (4, 4, 5, DATE '2026-05-01', 'PRODUTIVIDADE', 'RandomForest Produtividade', 'v1.0', '{"temperatura":36.0,"umidade":30.0,"precipitacao":0.0}', '{"produtividade":1200.0,"classificacao":"CRITICA"}', 1200.00, 'CRITICA', 'SUCESSO');

INSERT INTO TN_PREDICAO_IA (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_volume_agua_sugerido_mm, ds_situacao, ds_status)
VALUES (4, 4, 5, DATE '2026-05-02', 'IRRIGACAO', 'Regressao Irrigacao', 'v1.0', '{"umidade_solo":15.0,"tipo_solo":"Neossolo Quartzarenico","estagio":"Emergencia"}', '{"volume_sugerido":40.0,"situacao":"DEFICIT_CRITICO"}', 40.00, 'DEFICIT_CRITICO', 'SUCESSO');

COMMIT;


-- CONSULTA 1
-- Listar todas as empresas cadastradas em ordem alfabetica
SELECT
    id_empresa,
    nm_empresa,
    nr_cnpj,
    ds_email,
    nr_telefone,
    dt_cadastro
FROM TN_EMPRESA
ORDER BY nm_empresa ASC;

-- CONSULTA 2
-- Listar todas as areas monitoradas com status de cultura ATIVO
SELECT
    am.id_area,
    am.nm_area,
    am.nr_area_hectares,
    am.ds_tipo_solo,
    c.nm_cultura,
    ac.ds_estagio_crescimento,
    ac.dt_plantio,
    ac.dt_colheita_prevista
FROM TN_AREA_MONITORADA am
JOIN TN_AREA_CULTURA ac ON ac.id_area = am.id_area
JOIN TN_CULTURA c ON c.id_cultura = ac.id_cultura
WHERE ac.ds_status = 'ATIVO'
ORDER BY am.nm_area ASC;

-- CONSULTA 3
-- Listar todos os alertas abertos por severidade (mais criticos primeiro)
SELECT
    id_alerta,
    id_area,
    dt_alerta,
    ds_tipo_alerta,
    ds_descricao,
    ds_severidade,
    ds_status
FROM TN_ALERTA
WHERE ds_status = 'ABERTO'
ORDER BY
    CASE ds_severidade
        WHEN 'CRITICA' THEN 1
        WHEN 'ALTA'    THEN 2
        WHEN 'MEDIA'   THEN 3
        WHEN 'BAIXA'   THEN 4
    END ASC;

-- CONSULTA 4
-- Contar quantos alertas existem por tipo
SELECT
    ds_tipo_alerta,
    COUNT(*) AS qt_alertas
FROM TN_ALERTA
GROUP BY ds_tipo_alerta
ORDER BY qt_alertas DESC;

-- CONSULTA 5
-- Media de temperatura e umidade por area monitorada
SELECT
    am.nm_area,
    ROUND(AVG(dc.nr_temperatura), 2)  AS media_temperatura,
    ROUND(AVG(dc.nr_umidade), 2)      AS media_umidade,
    ROUND(MIN(dc.nr_temperatura), 2)  AS min_temperatura,
    ROUND(MAX(dc.nr_temperatura), 2)  AS max_temperatura,
    COUNT(dc.id_dado)                 AS qt_leituras
FROM TN_DADO_CLIMATICO dc
JOIN TN_AREA_MONITORADA am ON am.id_area = dc.id_area
GROUP BY am.nm_area
ORDER BY media_temperatura DESC;

-- CONSULTA 6
-- Total de precipitacao acumulada por area nos ultimos registros
SELECT
    am.nm_area,
    SUM(dc.nr_precipitacao)           AS total_precipitacao_mm,
    ROUND(AVG(dc.nr_precipitacao), 2) AS media_precipitacao_mm,
    MAX(dc.dt_coleta)                 AS ultima_coleta
FROM TN_DADO_CLIMATICO dc
JOIN TN_AREA_MONITORADA am ON am.id_area = dc.id_area
GROUP BY am.nm_area
ORDER BY total_precipitacao_mm DESC;

-- CONSULTA 7
-- Listar usuarios ativos por empresa com seu perfil de acesso
SELECT
    e.nm_empresa,
    u.nm_usuario,
    u.ds_email,
    u.ds_perfil,
    u.dt_cadastro,
    u.dt_ultimo_acesso
FROM TN_USUARIO u
JOIN TN_EMPRESA e ON e.id_empresa = u.id_empresa
WHERE u.ds_status = 'ATIVO'
ORDER BY e.nm_empresa ASC, u.ds_perfil ASC;

-- CONSULTA 8
-- Calcular consumo medio de irrigacao por tipo e area
SELECT
    am.nm_area,
    i.ds_tipo_irrigacao,
    COUNT(i.id_irrigacao)                      AS qt_registros,
    ROUND(AVG(i.nr_consumo_atual_mm), 2)       AS media_consumo_mm,
    ROUND(SUM(i.nr_consumo_atual_mm), 2)       AS total_consumo_mm,
    ROUND(AVG(i.nr_irrigacao_anterior_mm), 2)  AS media_irrigacao_anterior_mm
FROM TN_IRRIGACAO i
JOIN TN_AREA_MONITORADA am ON am.id_area = i.id_area
GROUP BY am.nm_area, i.ds_tipo_irrigacao
ORDER BY am.nm_area ASC, total_consumo_mm DESC;

-- CONSULTA 9
-- Recomendacoes pendentes com volume de agua sugerido acima de 20mm
SELECT
    r.id_recomendacao,
    am.nm_area,
    r.dt_recomendacao,
    r.ds_acao,
    r.nr_volume_agua_sugerido_mm,
    r.ds_status
FROM TN_RECOMENDACAO r
JOIN TN_AREA_MONITORADA am ON am.id_area = r.id_area
WHERE r.ds_status = 'PENDENTE'
AND r.nr_volume_agua_sugerido_mm > 20
ORDER BY r.nr_volume_agua_sugerido_mm DESC;

-- CONSULTA 10
-- Resumo das predicoes da IA por tipo de modelo e resultado
SELECT
    ds_tipo_modelo,
    ds_status,
    COUNT(*)                                       AS qt_predicoes,
    ROUND(AVG(nr_produtividade_prevista), 2)       AS media_produtividade_prevista,
    ROUND(AVG(nr_volume_agua_sugerido_mm), 2)      AS media_volume_agua_sugerido_mm,
    MIN(dt_predicao)                               AS primeira_predicao,
    MAX(dt_predicao)                               AS ultima_predicao
FROM TN_PREDICAO_IA
GROUP BY ds_tipo_modelo, ds_status
ORDER BY ds_tipo_modelo ASC;


-- RELATORIO 1 - INNER JOIN
-- Relatorio completo de alertas abertos com dados da area,
-- propriedade e empresa responsavel
SELECT
    e.nm_empresa,
    p.nm_propriedade,
    p.ds_localizacao,
    am.nm_area,
    a.dt_alerta,
    a.ds_tipo_alerta,
    a.ds_severidade,
    a.ds_descricao,
    a.ds_status AS status_alerta
FROM TN_ALERTA a
INNER JOIN TN_AREA_MONITORADA am ON am.id_area    = a.id_area
INNER JOIN TN_PROPRIEDADE p      ON p.id_propriedade = am.id_propriedade
INNER JOIN TN_EMPRESA e          ON e.id_empresa     = p.id_empresa
WHERE a.ds_status = 'ABERTO'
ORDER BY
    CASE a.ds_severidade
        WHEN 'CRITICA' THEN 1
        WHEN 'ALTA'    THEN 2
        WHEN 'MEDIA'   THEN 3
        WHEN 'BAIXA'   THEN 4
    END ASC,
    a.dt_alerta DESC;


-- RELATORIO 2 - INNER JOIN
-- Relatorio de predicoes da IA com dados do usuario,
-- area, cultura e resultado gerado
SELECT
    u.nm_usuario,
    u.ds_perfil,
    am.nm_area,
    c.nm_cultura,
    ac.ds_estagio_crescimento,
    pi.dt_predicao,
    pi.ds_tipo_modelo,
    pi.ds_nome_modelo,
    pi.nr_produtividade_prevista,
    pi.ds_classificacao,
    pi.nr_volume_agua_sugerido_mm,
    pi.ds_situacao,
    pi.ds_status AS status_predicao
FROM TN_PREDICAO_IA pi
INNER JOIN TN_AREA_MONITORADA am ON am.id_area         = pi.id_area
INNER JOIN TN_AREA_CULTURA ac    ON ac.id_area_cultura = pi.id_area_cultura
INNER JOIN TN_CULTURA c          ON c.id_cultura       = ac.id_cultura
INNER JOIN TN_USUARIO u          ON u.id_usuario       = pi.id_usuario
ORDER BY pi.dt_predicao DESC;


-- RELATORIO 3 - INNER JOIN
-- Relatorio de recomendacoes com o alerta que as originou,
-- area monitorada e propriedade
SELECT
    e.nm_empresa,
    p.nm_propriedade,
    am.nm_area,
    a.ds_tipo_alerta,
    a.ds_severidade,
    r.dt_recomendacao,
    r.ds_acao,
    r.nr_volume_agua_sugerido_mm,
    r.ds_status AS status_recomendacao
FROM TN_RECOMENDACAO r
INNER JOIN TN_AREA_MONITORADA am ON am.id_area        = r.id_area
INNER JOIN TN_PROPRIEDADE p      ON p.id_propriedade  = am.id_propriedade
INNER JOIN TN_EMPRESA e          ON e.id_empresa      = p.id_empresa
INNER JOIN TN_ALERTA a           ON a.id_alerta       = r.id_alerta
ORDER BY r.dt_recomendacao DESC;


-- RELATORIO 4 - LEFT JOIN (somente diferenca)
-- Areas monitoradas que NAO possuem nenhum dado climatico
-- registrado (areas sem monitoramento ativo)
SELECT
    am.id_area,
    am.nm_area,
    am.nr_area_hectares,
    am.ds_tipo_solo,
    p.nm_propriedade,
    e.nm_empresa
FROM TN_AREA_MONITORADA am
LEFT JOIN TN_DADO_CLIMATICO dc ON dc.id_area = am.id_area
LEFT JOIN TN_PROPRIEDADE p     ON p.id_propriedade = am.id_propriedade
LEFT JOIN TN_EMPRESA e         ON e.id_empresa = p.id_empresa
WHERE dc.id_dado IS NULL
ORDER BY e.nm_empresa ASC, am.nm_area ASC;


-- RELATORIO 5 - RIGHT JOIN (somente diferenca)
-- Alertas que NAO possuem nenhuma recomendacao associada
-- (alertas sem acao gerada pelo sistema)
SELECT
    a.id_alerta,
    a.dt_alerta,
    a.ds_tipo_alerta,
    a.ds_severidade,
    a.ds_descricao,
    a.ds_status AS status_alerta,
    am.nm_area,
    p.nm_propriedade,
    e.nm_empresa
FROM TN_RECOMENDACAO r
RIGHT JOIN TN_ALERTA a           ON a.id_alerta       = r.id_alerta
RIGHT JOIN TN_AREA_MONITORADA am ON am.id_area         = a.id_area
RIGHT JOIN TN_PROPRIEDADE p      ON p.id_propriedade   = am.id_propriedade
RIGHT JOIN TN_EMPRESA e          ON e.id_empresa       = p.id_empresa
WHERE r.id_recomendacao IS NULL
ORDER BY a.ds_severidade ASC, a.dt_alerta DESC;
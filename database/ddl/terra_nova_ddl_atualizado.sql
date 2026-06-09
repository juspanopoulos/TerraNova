-- ============================================================
-- PROJETO: TERRA NOVA
-- DISCIPLINA: BUILDING RELATIONAL DATABASE - FIAP
-- DESCRICAO: Plataforma inteligente de monitoramento agricola
--            com dados de satelite para o agronegocio
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
-- DROP DAS TABELAS (ordem inversa: fracas -> menos fortes -> fortes)
-- ============================================================

DROP TABLE TN_PREDICAO_IA CASCADE CONSTRAINTS;
DROP TABLE TN_RECOMENDACAO CASCADE CONSTRAINTS;
DROP TABLE TN_ASSISTENTE_MENSAGEM CASCADE CONSTRAINTS;
DROP TABLE TN_ASSISTENTE_CONVERSA CASCADE CONSTRAINTS;
DROP TABLE TN_ANOTACAO CASCADE CONSTRAINTS;
DROP TABLE TN_USUARIO_PREFERENCIA CASCADE CONSTRAINTS;
DROP TABLE TN_ALERTA CASCADE CONSTRAINTS;
DROP TABLE TN_IRRIGACAO CASCADE CONSTRAINTS;
DROP TABLE TN_LEITURA_SOLO CASCADE CONSTRAINTS;
DROP TABLE TN_DADO_CLIMATICO CASCADE CONSTRAINTS;
DROP TABLE TN_AREA_CULTURA CASCADE CONSTRAINTS;
DROP TABLE TN_AREA_MONITORADA CASCADE CONSTRAINTS;
DROP TABLE TN_PROPRIEDADE CASCADE CONSTRAINTS;
DROP TABLE TN_USUARIO CASCADE CONSTRAINTS;
DROP TABLE TN_CULTURA CASCADE CONSTRAINTS;
DROP TABLE TN_EMPRESA CASCADE CONSTRAINTS;


-- ============================================================
-- ORDEM DE CRIACAO: FORTES -> MENOS FORTES -> FRACAS
-- ============================================================


-- ============================================================
-- TABELAS FORTES (nao dependem de nenhuma outra)
-- ============================================================

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


-- ============================================================
-- TABELAS MENOS FORTES (dependem das tabelas fortes)
-- ============================================================

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

-- 4.1. TN_USUARIO_PREFERENCIA
CREATE TABLE TN_USUARIO_PREFERENCIA (
    id_usuario                  NUMBER          PRIMARY KEY,
    st_dark_mode                CHAR(1)         DEFAULT 'N' NOT NULL,
    st_reduced_motion           CHAR(1)         DEFAULT 'N' NOT NULL,
    st_email_notifications      CHAR(1)         DEFAULT 'S' NOT NULL,
    ds_date_range_start         VARCHAR2(10)    NOT NULL,
    ds_date_range_end           VARCHAR2(10)    NOT NULL,
    ds_selected_month           VARCHAR2(7)     NOT NULL,
    ds_alert_levels             VARCHAR2(400),
    ds_alert_types              VARCHAR2(400),
    ds_soil_sector              VARCHAR2(100)   DEFAULT 'all' NOT NULL,
    ds_growth_crop              VARCHAR2(100)   DEFAULT 'all' NOT NULL,
    dt_atualizacao              DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_pref_usuario FOREIGN KEY (id_usuario)
        REFERENCES TN_USUARIO (id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_pref_dark CHECK (st_dark_mode IN ('S', 'N')),
    CONSTRAINT ck_pref_motion CHECK (st_reduced_motion IN ('S', 'N')),
    CONSTRAINT ck_pref_email CHECK (st_email_notifications IN ('S', 'N'))
);


-- ============================================================
-- TABELAS FRACAS (dependem das tabelas anteriores)
-- ============================================================

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

-- 5.1. TN_ASSISTENTE_CONVERSA
CREATE TABLE TN_ASSISTENTE_CONVERSA (
    id_conversa         NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario          NUMBER          NOT NULL,
    ds_titulo           VARCHAR2(120)   NOT NULL,
    dt_criacao          DATE            DEFAULT SYSDATE NOT NULL,
    dt_atualizacao      DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_conversa_usuario FOREIGN KEY (id_usuario)
        REFERENCES TN_USUARIO (id_usuario) ON DELETE CASCADE
);

-- 5.2. TN_ASSISTENTE_MENSAGEM
CREATE TABLE TN_ASSISTENTE_MENSAGEM (
    id_mensagem         NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_conversa         NUMBER          NOT NULL,
    ds_papel            VARCHAR2(20)    NOT NULL,
    ds_conteudo         CLOB            NOT NULL,
    dt_mensagem         DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_mensagem_conversa FOREIGN KEY (id_conversa)
        REFERENCES TN_ASSISTENTE_CONVERSA (id_conversa) ON DELETE CASCADE,
    CONSTRAINT ck_mensagem_papel CHECK (ds_papel IN ('user', 'assistant'))
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

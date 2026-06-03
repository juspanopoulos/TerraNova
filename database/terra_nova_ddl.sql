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

DROP TABLE TN_RECOMENDACAO CASCADE CONSTRAINTS;
DROP TABLE TN_ALERTA CASCADE CONSTRAINTS;
DROP TABLE TN_DADO_CLIMATICO CASCADE CONSTRAINTS;
DROP TABLE TN_AREA_CULTURA CASCADE CONSTRAINTS;
DROP TABLE TN_AREA_MONITORADA CASCADE CONSTRAINTS;
DROP TABLE TN_PROPRIEDADE CASCADE CONSTRAINTS;
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

-- 4. TN_AREA_MONITORADA
CREATE TABLE TN_AREA_MONITORADA (
    id_area             NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propriedade      NUMBER          NOT NULL,
    nm_area             VARCHAR2(100)   NOT NULL,
    nr_area_hectares    NUMBER(10,2),
    ds_tipo_solo        VARCHAR2(100),
    CONSTRAINT fk_area_propriedade FOREIGN KEY (id_propriedade)
        REFERENCES TN_PROPRIEDADE (id_propriedade)
);


-- ============================================================
-- TABELAS FRACAS (dependem das tabelas anteriores)
-- ============================================================

-- 5. TN_AREA_CULTURA (tabela associativa N:N)
CREATE TABLE TN_AREA_CULTURA (
    id_area_cultura     NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area             NUMBER          NOT NULL,
    id_cultura          NUMBER          NOT NULL,
    dt_plantio          DATE            NOT NULL,
    dt_colheita_prevista DATE,
    ds_status           VARCHAR2(20)    DEFAULT 'ATIVO' NOT NULL,
    CONSTRAINT fk_area_cultura_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT fk_area_cultura_cultura FOREIGN KEY (id_cultura)
        REFERENCES TN_CULTURA (id_cultura),
    CONSTRAINT ck_ds_status_cultura CHECK (ds_status IN ('ATIVO', 'COLHIDO', 'PERDIDO'))
);

-- 6. TN_DADO_CLIMATICO
CREATE TABLE TN_DADO_CLIMATICO (
    id_dado         NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area         NUMBER          NOT NULL,
    dt_coleta       DATE            NOT NULL,
    nr_temperatura  NUMBER(5,2)     NOT NULL,
    nr_umidade      NUMBER(5,2)     NOT NULL,
    nr_precipitacao NUMBER(6,2),
    nr_indice_uv    NUMBER(4,2),
    ds_fonte_api    VARCHAR2(20)    NOT NULL,
    CONSTRAINT fk_dado_area FOREIGN KEY (id_area)
        REFERENCES TN_AREA_MONITORADA (id_area),
    CONSTRAINT ck_ds_fonte_api CHECK (ds_fonte_api IN ('NASA', 'ESA', 'INMET')),
    CONSTRAINT ck_nr_umidade CHECK (nr_umidade BETWEEN 0 AND 100)
);

-- 7. TN_ALERTA
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
    CONSTRAINT ck_ds_tipo_alerta CHECK (ds_tipo_alerta IN ('SECA', 'ENCHENTE', 'GEADA', 'GRANIZO', 'EXCESSO_IRRIGACAO')),
    CONSTRAINT ck_ds_severidade CHECK (ds_severidade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
    CONSTRAINT ck_ds_status_alerta CHECK (ds_status IN ('ABERTO', 'RESOLVIDO'))
);

-- 8. TN_RECOMENDACAO
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

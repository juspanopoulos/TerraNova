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


-- ============================================================
-- PROJETO: TERRA NOVA
-- DISCIPLINA: BUILDING RELATIONAL DATABASE - FIAP
-- DESCRICAO: Script de Relatorios com JOIN
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
-- RELATORIO 1 - INNER JOIN
-- Relatorio completo de alertas abertos com dados da area,
-- propriedade e empresa responsavel
-- ============================================================
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


-- ============================================================
-- RELATORIO 2 - INNER JOIN
-- Relatorio de predicoes da IA com dados do usuario,
-- area, cultura e resultado gerado
-- ============================================================
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


-- ============================================================
-- RELATORIO 3 - INNER JOIN
-- Relatorio de recomendacoes com o alerta que as originou,
-- area monitorada e propriedade
-- ============================================================
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


-- ============================================================
-- RELATORIO 4 - LEFT JOIN (somente diferenca)
-- Areas monitoradas que NAO possuem nenhum dado climatico
-- registrado (areas sem monitoramento ativo)
-- ============================================================
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


-- ============================================================
-- RELATORIO 5 - RIGHT JOIN (somente diferenca)
-- Alertas que NAO possuem nenhuma recomendacao associada
-- (alertas sem acao gerada pelo sistema)
-- ============================================================
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

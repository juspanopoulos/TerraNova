-- ============================================================
-- PROJETO: TERRA NOVA
-- DISCIPLINA: BUILDING RELATIONAL DATABASE - FIAP
-- DESCRICAO: Script de Consultas SQL
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
-- CONSULTA 1
-- Listar todas as empresas cadastradas em ordem alfabetica
-- ============================================================
SELECT
    id_empresa,
    nm_empresa,
    nr_cnpj,
    ds_email,
    nr_telefone,
    dt_cadastro
FROM TN_EMPRESA
ORDER BY nm_empresa ASC;


-- ============================================================
-- CONSULTA 2
-- Listar todas as areas monitoradas com status de cultura ATIVO
-- ============================================================
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


-- ============================================================
-- CONSULTA 3
-- Listar todos os alertas abertos por severidade (mais criticos primeiro)
-- ============================================================
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


-- ============================================================
-- CONSULTA 4
-- Contar quantos alertas existem por tipo
-- ============================================================
SELECT
    ds_tipo_alerta,
    COUNT(*) AS qt_alertas
FROM TN_ALERTA
GROUP BY ds_tipo_alerta
ORDER BY qt_alertas DESC;


-- ============================================================
-- CONSULTA 5
-- Media de temperatura e umidade por area monitorada
-- ============================================================
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


-- ============================================================
-- CONSULTA 6
-- Total de precipitacao acumulada por area nos ultimos registros
-- ============================================================
SELECT
    am.nm_area,
    SUM(dc.nr_precipitacao)           AS total_precipitacao_mm,
    ROUND(AVG(dc.nr_precipitacao), 2) AS media_precipitacao_mm,
    MAX(dc.dt_coleta)                 AS ultima_coleta
FROM TN_DADO_CLIMATICO dc
JOIN TN_AREA_MONITORADA am ON am.id_area = dc.id_area
GROUP BY am.nm_area
ORDER BY total_precipitacao_mm DESC;


-- ============================================================
-- CONSULTA 7
-- Listar usuarios ativos por empresa com seu perfil de acesso
-- ============================================================
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


-- ============================================================
-- CONSULTA 8
-- Calcular consumo medio de irrigacao por tipo e area
-- ============================================================
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


-- ============================================================
-- CONSULTA 9
-- Recomendacoes pendentes com volume de agua sugerido acima de 20mm
-- ============================================================
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


-- ============================================================
-- CONSULTA 10
-- Resumo das predicoes da IA por tipo de modelo e resultado
-- ============================================================
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

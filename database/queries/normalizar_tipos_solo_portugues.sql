-- Normaliza valores antigos de tipo de solo que possam ter sido salvos em ingles.

UPDATE TN_AREA_MONITORADA
SET ds_tipo_solo = CASE LOWER(TRIM(ds_tipo_solo))
    WHEN 'clay' THEN 'Argiloso'
    WHEN 'silt' THEN 'Siltoso'
    WHEN 'sandy' THEN 'Arenoso'
    WHEN 'loamy' THEN 'Franco'
    WHEN 'loam' THEN 'Franco'
    ELSE ds_tipo_solo
END
WHERE LOWER(TRIM(ds_tipo_solo)) IN ('clay', 'silt', 'sandy', 'loamy', 'loam');

UPDATE TN_LEITURA_SOLO
SET ds_tipo_solo = CASE LOWER(TRIM(ds_tipo_solo))
    WHEN 'clay' THEN 'Argiloso'
    WHEN 'silt' THEN 'Siltoso'
    WHEN 'sandy' THEN 'Arenoso'
    WHEN 'loamy' THEN 'Franco'
    WHEN 'loam' THEN 'Franco'
    ELSE ds_tipo_solo
END
WHERE LOWER(TRIM(ds_tipo_solo)) IN ('clay', 'silt', 'sandy', 'loamy', 'loam');

COMMIT;

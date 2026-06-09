import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import type { VisionReportData } from "@/lib/dashboard/visionReportData";
import { PDF_COLORS, pdfStyles } from "@/lib/pdf/pdfTheme";

type VisionReportDocumentProps = {
  data: VisionReportData;
  logoSrc: string;
};

function PdfFooter({ generatedAt }: { generatedAt: string }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text style={pdfStyles.footerBrand}>TerraNova - Gestao inteligente da propriedade</Text>
      <Text style={pdfStyles.footerText}>Gerado em {generatedAt}</Text>
      <Text
        style={pdfStyles.footerText}
        render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`}
      />
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={pdfStyles.sectionHeader}>
      <View style={pdfStyles.sectionAccent} />
      <Text style={pdfStyles.sectionTitle}>{title}</Text>
    </View>
  );
}

function KpiCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={pdfStyles.kpiCard}>
      <Text style={pdfStyles.kpiLabel}>{label}</Text>
      <Text style={pdfStyles.kpiValue}>{unit ? `${value} ${unit}` : value}</Text>
    </View>
  );
}

function DataTable({
  headers,
  rows,
  boldFirstColumn,
}: {
  headers: string[];
  rows: string[][];
  boldFirstColumn?: boolean;
}) {
  return (
    <View style={pdfStyles.table}>
      <View style={pdfStyles.tableHeaderRow}>
        {headers.map((header) => (
          <Text key={header} style={pdfStyles.tableHeaderCell}>
            {header}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[pdfStyles.tableRow, rowIndex % 2 === 1 ? pdfStyles.tableRowAlt : {}]}
        >
          {row.map((cell, cellIndex) => (
            <Text
              key={cellIndex}
              style={cellIndex === 0 && boldFirstColumn ? pdfStyles.tableCellBold : pdfStyles.tableCell}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function alertBorderColor(level: string) {
  if (level === "critical") return PDF_COLORS.critical;
  if (level === "warning") return PDF_COLORS.warning;
  return PDF_COLORS.normal;
}

function formatOptionalNumber(value: number | null, unit: string) {
  if (value === null) return "Nao informado";
  return `${value.toLocaleString("pt-BR")} ${unit}`;
}

export function VisionReportDocument({ data, logoSrc }: VisionReportDocumentProps) {
  const climateRows = data.climate.history.labels.map((label, i) => [
    label,
    `${data.climate.history.temperature[i]?.toFixed(1) ?? "-"} C`,
    `${Math.round(data.climate.history.humidity[i] ?? 0)}%`,
    `${data.climate.history.wind[i]?.toFixed(1) ?? "-"} km/h`,
  ]);

  const waterHistoryRows = data.water.history.labels.map((label, i) => [
    label,
    `${(data.water.history.values[i] ?? 0).toLocaleString("pt-BR")} mm`,
  ]);

  const irrigationRows = data.water.irrigation.map((row) => [
    row.sector,
    row.type,
    `${row.currentMm.toLocaleString("pt-BR")} mm`,
    `${row.previousMm.toLocaleString("pt-BR")} mm`,
    row.origin,
  ]);

  const distributionRows = data.water.distribution.map((d) => [
    d.label,
    `${d.value.toLocaleString("pt-BR")} mm`,
    d.detail,
  ]);

  const soilRows = data.soil.sectors.map((s) => [
    s.sector,
    `${Math.round(s.moisture)}%`,
    s.soilType,
    s.source,
    s.status,
  ]);

  const cropRows = data.crops.map((c) => [
    c.name,
    c.zone,
    c.stage,
    c.plantedAt || "Nao informado",
    c.harvestAt || "Nao informada",
    formatOptionalNumber(c.waterNeedMm, "mm"),
    c.status,
  ]);

  const predictionRows = data.predictions.map((prediction) => [
    prediction.date || "Nao informada",
    prediction.sector,
    prediction.cropName ?? "Nao informada",
    prediction.type,
    formatOptionalNumber(prediction.productivity, "t/ha"),
    prediction.classification,
    formatOptionalNumber(prediction.waterVolumeMm, "mm"),
    prediction.situation,
  ]);

  return (
    <Document
      title={`${data.periodTitle} - ${data.farmName}`}
      author="TerraNova"
      subject={`Relatorio ${data.periodLabel}`}
    >
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerLeft}>
            <Image src={logoSrc} style={pdfStyles.logo} />
            <View>
              <Text style={pdfStyles.brandName}>TerraNova</Text>
              <Text style={pdfStyles.reportTitle}>{data.periodTitle}</Text>
              <Text style={pdfStyles.farmMeta}>
                {data.farmName} - {data.farmRegion}
                {"\n"}
                {data.totalAreaHa} ha - {data.activeSectors} setores - {data.responsibleName}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.headerBadge}>
            <Text style={pdfStyles.badgeLabel}>Periodo</Text>
            <Text style={pdfStyles.badgeValue}>{data.periodLabel}</Text>
            <Text style={[pdfStyles.badgeLabel, { marginTop: 6 }]}>Referencia</Text>
            <Text style={pdfStyles.badgeValue}>{data.generatedAt}</Text>
          </View>
        </View>

        <View style={pdfStyles.introBox}>
          <Text style={pdfStyles.introText}>
            Relatorio consolidado da propriedade referente ao periodo {data.periodLabel.toLowerCase()}.
            Este documento usa os mesmos dados reais apresentados no painel TerraNova.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Resumo executivo" />
          <View style={pdfStyles.kpiGrid}>
            <KpiCard label="Temperatura" value={data.kpis.temperature.toFixed(1)} unit="C" />
            <KpiCard label="Umidade do solo" value={String(Math.round(data.kpis.soilMoisture))} unit="%" />
            <KpiCard label="Plantios ativos" value={String(data.kpis.activePlantings)} />
            <KpiCard label="Predicoes IA" value={String(data.kpis.predictions)} />
            <KpiCard label="Alertas criticos" value={String(data.kpis.criticalAlerts)} />
          </View>
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Controle climatico" />
          <Text style={pdfStyles.sectionDesc}>
            Leituras atuais: {data.climate.temperature.toFixed(1)} C -{" "}
            {Math.round(data.climate.humidity)}% umidade - {data.climate.wind.toFixed(1)} km/h vento
          </Text>
          <DataTable
            headers={["Periodo", "Temperatura", "Umidade", "Vento"]}
            rows={climateRows}
            boldFirstColumn
          />
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <SectionTitle title="Consumo hidrico" />
          <View style={pdfStyles.kpiGrid}>
            <KpiCard
              label="Consumo atual"
              value={data.water.consumptionMm.toLocaleString("pt-BR")}
              unit="mm"
            />
            <KpiCard
              label="Irrigacao anterior"
              value={data.water.previousMm.toLocaleString("pt-BR")}
              unit="mm"
            />
            <KpiCard label="Tipo" value={data.water.type} />
            <KpiCard label="Origem" value={data.water.origin} />
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Distribuicao por tipo
          </Text>
          <DataTable headers={["Tipo", "Volume", "Detalhe"]} rows={distributionRows} boldFirstColumn />
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Historico - {data.periodLabel}
          </Text>
          <DataTable headers={["Periodo", "Consumo"]} rows={waterHistoryRows} boldFirstColumn />
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Irrigacao por setor
          </Text>
          <DataTable
            headers={["Setor", "Tipo", "Consumo atual", "Irrigacao anterior", "Origem"]}
            rows={irrigationRows}
            boldFirstColumn
          />
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <SectionTitle title="Controle do solo" />
          <View style={pdfStyles.metricPairRow}>
            {[
              { l: "Umidade", v: `${Math.round(data.soil.moisture)}%` },
              { l: "Tipo", v: data.soil.soilType },
              { l: "Fonte", v: data.soil.source },
              { l: "Coleta", v: data.soil.collectedAt || "Nao informada" },
            ].map((item) => (
              <View key={item.l} style={pdfStyles.metricPairCard}>
                <Text style={pdfStyles.kpiLabel}>{item.l}</Text>
                <Text style={[pdfStyles.kpiValue, { fontSize: 13 }]}>{item.v}</Text>
              </View>
            ))}
          </View>
          <DataTable
            headers={["Setor", "Umidade", "Tipo de solo", "Fonte", "Status"]}
            rows={soilRows}
            boldFirstColumn
          />
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Previsao de colheitas" />
          <DataTable
            headers={["Cultura", "Zona", "Estagio", "Plantio", "Colheita prevista", "Nec. hidrica", "Status"]}
            rows={cropRows}
            boldFirstColumn
          />
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <SectionTitle title="Predicoes IA" />
          <DataTable
            headers={["Data", "Area", "Cultura", "Modelo", "Produtividade", "Classificacao", "Agua", "Situacao"]}
            rows={predictionRows}
            boldFirstColumn
          />
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Alertas" />
          <Text style={pdfStyles.sectionDesc}>
            {data.alerts.length} alertas relevantes para o periodo {data.periodLabel.toLowerCase()} (
            {data.kpis.criticalAlerts} criticos).
          </Text>
          {data.alerts.map((alert) => (
            <View
              key={`${alert.title}-${alert.time}`}
              style={[pdfStyles.alertCard, { borderLeftColor: alertBorderColor(alert.level) }]}
            >
              <Text style={pdfStyles.alertTitle}>{alert.title}</Text>
              <Text style={pdfStyles.alertMeta}>
                {alert.levelLabel} - {alert.type} - {alert.sector} - {alert.time}
              </Text>
              <Text style={pdfStyles.alertSummary}>{alert.summary}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: PDF_COLORS.beigeMuted,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: PDF_COLORS.border,
          }}
        >
          <Text style={{ fontSize: 8, color: PDF_COLORS.inkMuted, lineHeight: 1.5 }}>
            Documento gerado automaticamente pela plataforma TerraNova. Os dados refletem o periodo
            selecionado ({data.periodLabel}) e devem ser validados junto as fontes de campo e sensores
            da propriedade antes de decisoes operacionais.
          </Text>
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>
    </Document>
  );
}

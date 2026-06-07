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
      <Text style={pdfStyles.footerBrand}>TerraNova — Gestão inteligente da propriedade</Text>
      <Text style={pdfStyles.footerText}>Gerado em {generatedAt}</Text>
      <Text
        style={pdfStyles.footerText}
        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
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

export function VisionReportDocument({ data, logoSrc }: VisionReportDocumentProps) {
  const climateRows = data.climate.history.labels.map((label, i) => [
    label,
    `${data.climate.history.temperature[i]?.toFixed(1) ?? "—"}°C`,
    `${Math.round(data.climate.history.humidity[i] ?? 0)}%`,
    `${data.climate.history.wind[i]?.toFixed(1) ?? "—"} km/h`,
  ]);

  const waterHistoryRows = data.water.history.labels.map((label, i) => [
    label,
    `${(data.water.history.values[i] ?? 0).toLocaleString("pt-BR")} L`,
  ]);

  const irrigationRows = data.water.irrigation.map((row) => [
    row.sector,
    `${row.used.toLocaleString("pt-BR")} L`,
    `${row.target.toLocaleString("pt-BR")} L`,
    `${row.efficiency}%`,
  ]);

  const distributionRows = data.water.distribution.map((d) => [
    d.label,
    `${d.value}%`,
    d.detail,
  ]);

  const soilRows = data.soil.sectors.map((s) => [
    s.sector,
    `${s.moisture}%`,
    String(s.ph),
    s.status,
  ]);

  const cropRows = data.crops.map((c) => [
    c.name,
    c.zone,
    `${c.maturity}%`,
    c.week,
    c.estimate,
    c.status,
  ]);

  return (
    <Document
      title={`${data.periodTitle} — ${data.farmName}`}
      author="TerraNova"
      subject={`Relatório ${data.periodLabel}`}
    >
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerLeft}>
            <Image src={logoSrc} style={pdfStyles.logo} />
            <View>
              <Text style={pdfStyles.brandName}>TerraNova</Text>
              <Text style={pdfStyles.reportTitle}>{data.periodTitle}</Text>
              <Text style={pdfStyles.farmMeta}>
                {data.farmName} · {data.farmRegion}
                {"\n"}
                {data.totalAreaHa} ha · {data.activeSectors} setores · {data.responsibleName}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.headerBadge}>
            <Text style={pdfStyles.badgeLabel}>Período</Text>
            <Text style={pdfStyles.badgeValue}>{data.periodLabel}</Text>
            <Text style={[pdfStyles.badgeLabel, { marginTop: 6 }]}>Referência</Text>
            <Text style={pdfStyles.badgeValue}>{data.generatedAt}</Text>
          </View>
        </View>

        <View style={pdfStyles.introBox}>
          <Text style={pdfStyles.introText}>
            Relatório consolidado da propriedade referente ao período {data.periodLabel.toLowerCase()}
            . Este documento reúne indicadores de clima, consumo hídrico, solo, colheitas e alertas
            ativos — os mesmos dados apresentados no painel TerraNova para esta visão.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Resumo executivo" />
          <View style={pdfStyles.kpiGrid}>
            <KpiCard label="Temperatura" value={data.kpis.temperature.toFixed(1)} unit="°C" />
            <KpiCard label="Umidade do solo" value={String(Math.round(data.kpis.soilMoisture))} unit="%" />
            <KpiCard label="Maturidade média" value={data.kpis.avgMaturity.toFixed(0)} unit="%" />
            <KpiCard label="Alertas críticos" value={String(data.kpis.criticalAlerts)} />
          </View>
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Controle climático" />
          <Text style={pdfStyles.sectionDesc}>
            Leituras atuais: {data.climate.temperature.toFixed(1)}°C ·{" "}
            {Math.round(data.climate.humidity)}% umidade · {data.climate.wind.toFixed(1)} km/h vento
          </Text>
          <DataTable
            headers={["Período", "Temperatura", "Umidade", "Vento"]}
            rows={climateRows}
            boldFirstColumn
          />
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <SectionTitle title="Consumo hídrico" />
          <View style={pdfStyles.kpiGrid}>
            <KpiCard
              label="Consumo"
              value={data.water.consumptionLiters.toLocaleString("pt-BR")}
              unit="L"
            />
            <KpiCard
              label="Economia acumulada"
              value={(data.water.savingsLiters / 1000).toFixed(0)}
              unit="mil L"
            />
            <KpiCard label="Eficiência" value={String(data.water.efficiency)} unit="%" />
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Distribuição do consumo
          </Text>
          <DataTable headers={["Método", "Participação", "Detalhe"]} rows={distributionRows} boldFirstColumn />
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Histórico — {data.periodLabel}
          </Text>
          <DataTable headers={["Período", "Consumo"]} rows={waterHistoryRows} boldFirstColumn />
        </View>

        <View style={pdfStyles.section}>
          <Text style={[pdfStyles.sectionTitle, { fontSize: 10, marginBottom: 6 }]}>
            Irrigação por setor
          </Text>
          <DataTable
            headers={["Setor", "Consumo", "Meta", "Eficiência"]}
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
              { l: "Nitrogênio (N)", v: `${data.soil.nitrogen}%` },
              { l: "Fósforo (P)", v: `${data.soil.phosphorus}%` },
              { l: "Potássio (K)", v: `${data.soil.potassium}%` },
              { l: "pH médio", v: data.soil.ph.toFixed(1) },
            ].map((item) => (
              <View key={item.l} style={pdfStyles.metricPairCard}>
                <Text style={pdfStyles.kpiLabel}>{item.l}</Text>
                <Text style={[pdfStyles.kpiValue, { fontSize: 13 }]}>{item.v}</Text>
              </View>
            ))}
          </View>
          <Text style={[pdfStyles.sectionDesc, { marginTop: 4 }]}>
            Umidade média do solo: {Math.round(data.soil.moisture)}%
          </Text>
          <DataTable
            headers={["Setor", "Umidade", "pH", "Status"]}
            rows={soilRows}
            boldFirstColumn
          />
        </View>

        <View style={pdfStyles.section}>
          <SectionTitle title="Previsão de colheitas" />
          <DataTable
            headers={["Cultura", "Zona", "Maturidade", "Referência", "Colheita prevista", "Status"]}
            rows={cropRows}
            boldFirstColumn
          />
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <SectionTitle title="Alertas" />
          <Text style={pdfStyles.sectionDesc}>
            {data.alerts.length} alertas relevantes para o período {data.periodLabel.toLowerCase()} (
            {data.kpis.criticalAlerts} críticos).
          </Text>
          {data.alerts.map((alert) => (
            <View
              key={`${alert.title}-${alert.time}`}
              style={[pdfStyles.alertCard, { borderLeftColor: alertBorderColor(alert.level) }]}
            >
              <Text style={pdfStyles.alertTitle}>{alert.title}</Text>
              <Text style={pdfStyles.alertMeta}>
                {alert.levelLabel} · {alert.type} · {alert.sector} · {alert.time}
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
            Documento gerado automaticamente pela plataforma TerraNova. Os dados refletem o período
            selecionado ({data.periodLabel}) e devem ser validados junto às fontes de campo e sensores
            da propriedade antes de decisões operacionais.
          </Text>
        </View>

        <PdfFooter generatedAt={data.generatedAt} />
      </Page>
    </Document>
  );
}

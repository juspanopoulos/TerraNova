import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bot, CloudSun, Droplets, Leaf, MapPinned, Sprout } from "lucide-react";
import { CustomSelect } from "@/components/dashboard/DashboardPickers";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  btnClick,
  btnSecondary,
  inputField,
  labelMuted,
  sectionTitle,
  textMuted,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { ApiRequestError } from "@/lib/api/client";
import { createAreaMonitorada } from "@/lib/api/areasApi";
import { coletarClimaNasa } from "@/lib/api/climateApi";
import { createAreaCultura, createCultura } from "@/lib/api/cropsApi";
import { predizerIrrigacao } from "@/lib/api/iaApi";
import { createIrrigacao } from "@/lib/api/irrigationApi";
import { createLeituraSolo } from "@/lib/api/soilApi";
import type { AreaMonitoradaResponse, IrrigacaoRequest } from "@/lib/api/types";

type OperationalMode = "area" | "soil" | "irrigation" | "crop";

const REGISTER_ACTIONS: {
  id: OperationalMode;
  label: string;
  icon: typeof MapPinned;
  requiresArea?: boolean;
}[] = [
  { id: "area", label: "Área", icon: MapPinned },
  { id: "soil", label: "Solo", icon: Leaf, requiresArea: true },
  { id: "irrigation", label: "Irrigação", icon: Droplets, requiresArea: true },
  { id: "crop", label: "Plantio", icon: Sprout, requiresArea: true },
];

const SOIL_TYPE_OPTIONS = [
  { value: "Clay", label: "Argiloso" },
  { value: "Silt", label: "Siltoso" },
  { value: "Sandy", label: "Arenoso" },
  { value: "Loamy", label: "Franco" },
] as const;
const IRRIGATION_TYPE_OPTIONS = [
  { value: "GOTEJAMENTO", label: "Gotejamento" },
  { value: "ASPERSAO", label: "Aspersão" },
  { value: "SULCO", label: "Sulco" },
  { value: "PIVO", label: "Pivô" },
  { value: "MANUAL", label: "Manual" },
  { value: "OUTRO", label: "Outro" },
] as const;
const YES_NO_OPTIONS = [
  { value: "SIM", label: "Sim" },
  { value: "NAO", label: "Não" },
] as const;
const SOURCE_OPTIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "SENSOR", label: "Sensor" },
] as const;

function dateInput(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function numberOrNull(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberOrZero(value: string) {
  return numberOrNull(value) ?? 0;
}

function dateTimeFromDate(value: string) {
  return value ? `${value}T12:00:00` : null;
}

function errorMessageFromApi(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) return error.message;
  return fallback;
}

function normalizeYesNo(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toUpperCase();
  return normalized === "SIM" || normalized === "YES" || normalized === "TRUE" ? "Yes" : "No";
}

function validSoilType(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  return SOIL_TYPE_OPTIONS.some((option) => option.value === normalized) ? normalized : SOIL_TYPE_OPTIONS[0].value;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelMuted}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function AreaSelect({
  areas,
  value,
  onChange,
}: {
  areas: AreaMonitoradaResponse[];
  value: number | "";
  onChange: (value: number) => void;
}) {
  return (
    <CustomSelect
      value={value === "" ? "" : String(value)}
      onChange={(next) => onChange(Number(next))}
      placeholder="Selecionar área"
      options={areas.map((area) => ({
        value: String(area.idArea),
        label: area.nomeArea,
      }))}
    />
  );
}

export function OperationalDataPanel() {
  const {
    authUser,
    company,
    dashboardAreas,
    soil,
    water,
    crops,
    reloadDashboard,
  } = useDashboard();
  const [mode, setMode] = useState<OperationalMode>("area");
  const [selectedAreaId, setSelectedAreaId] = useState<number | "">(dashboardAreas[0]?.idArea ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedArea = useMemo(
    () => dashboardAreas.find((area) => area.idArea === selectedAreaId) ?? dashboardAreas[0] ?? null,
    [dashboardAreas, selectedAreaId],
  );
  const areaId = selectedArea?.idArea ?? null;
  const selectedSoil = soil.sectors.find((item) => item.idArea === areaId) ?? null;
  const selectedIrrigation = water.irrigation.find((item) => item.idArea === areaId) ?? null;
  const activeCrop = crops.find((crop) => crop.idArea === areaId) ?? null;

  useEffect(() => {
    if (selectedAreaId || dashboardAreas.length === 0) return;
    setSelectedAreaId(dashboardAreas[0].idArea);
  }, [dashboardAreas, selectedAreaId]);

  const [areaForm, setAreaForm] = useState<{
    nomeArea: string;
    areaHectares: string;
    tipoSolo: string;
  }>({
    nomeArea: "",
    areaHectares: "",
    tipoSolo: SOIL_TYPE_OPTIONS[0].value,
  });
  const [soilForm, setSoilForm] = useState<{
    umidadeSolo: string;
    tipoSolo: string;
    fonte: string;
  }>({
    umidadeSolo: "",
    tipoSolo: SOIL_TYPE_OPTIONS[0].value,
    fonte: "MANUAL",
  });
  const [irrigationForm, setIrrigationForm] = useState({
    tipoIrrigacao: "GOTEJAMENTO",
    irrigacaoAnteriorMm: "",
    consumoAtualMm: "",
    areaCampoHectare: "",
    usouCoberturaSolo: "NAO",
    origem: "MANUAL",
  });
  const [cropForm, setCropForm] = useState({
    nomeCultura: "",
    descricao: "",
    necessidadeHidricaMm: "",
    periodoPlantio: "",
    dataPlantio: dateInput(),
    dataColheitaPrevista: "",
    estagioCrescimento: "",
  });

  const syncArea = () => {
    if (!selectedArea) return;
    setSoilForm((current) => ({
      ...current,
      tipoSolo: validSoilType(current.tipoSolo || selectedArea.tipoSolo || selectedSoil?.soilType),
      umidadeSolo: current.umidadeSolo || String(Math.round(selectedSoil?.moisture ?? soil.current.moisture ?? 0)),
    }));
    setIrrigationForm((current) => ({
      ...current,
      irrigacaoAnteriorMm: current.irrigacaoAnteriorMm || String(selectedIrrigation?.previousMm ?? water.current.previousMm ?? 0),
      consumoAtualMm: current.consumoAtualMm || String(selectedIrrigation?.currentMm ?? water.current.consumptionMm ?? 0),
      areaCampoHectare:
        current.areaCampoHectare || String(selectedIrrigation?.areaHa ?? selectedArea.areaHectares ?? company.areaTotalHectares ?? 0),
    }));
  };

  const runAction = async (action: () => Promise<unknown>, success: string) => {
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);
    try {
      await action();
      await reloadDashboard();
      setMessage(success);
    } catch (error) {
      setErrorMessage(errorMessageFromApi(error, "Não foi possível concluir a operação."));
    } finally {
      setSaving(false);
    }
  };

  const submitArea = () => {
    if (!company.idPropriedade) {
      setErrorMessage("A propriedade do usuário não foi encontrada.");
      return;
    }
    void runAction(
      () =>
        createAreaMonitorada({
          idPropriedade: company.idPropriedade!,
          nomeArea: areaForm.nomeArea.trim(),
          areaHectares: numberOrNull(areaForm.areaHectares),
          tipoSolo: areaForm.tipoSolo,
        }),
      "Área gravada no banco de dados.",
    );
  };

  const submitSoil = () => {
    if (!areaId) return;
    void runAction(
      () =>
        createLeituraSolo({
          idArea: areaId,
          dataColeta: dateTimeFromDate(dateInput()),
          umidadeSolo: numberOrZero(soilForm.umidadeSolo),
          tipoSolo: soilForm.tipoSolo || selectedArea?.tipoSolo || null,
          fonte: soilForm.fonte,
        }),
      "Leitura de solo gravada no banco de dados.",
    );
  };

  const submitIrrigation = () => {
    if (!areaId) return;
    const payload: IrrigacaoRequest = {
      idArea: areaId,
      dataRegistro: dateTimeFromDate(dateInput()),
      tipoIrrigacao: irrigationForm.tipoIrrigacao,
      irrigacaoAnteriorMm: numberOrNull(irrigationForm.irrigacaoAnteriorMm),
      consumoAtualMm: numberOrNull(irrigationForm.consumoAtualMm),
      areaCampoHectare: numberOrNull(irrigationForm.areaCampoHectare),
      usouCoberturaSolo: irrigationForm.usouCoberturaSolo,
      origem: irrigationForm.origem,
    };
    void runAction(
      () => createIrrigacao(payload),
      "Registro de irrigação gravado no banco de dados.",
    );
  };

  const submitCrop = () => {
    if (!areaId) return;
    void runAction(async () => {
      const cultura = await createCultura({
        nomeCultura: cropForm.nomeCultura.trim(),
        descricao: cropForm.descricao.trim() || null,
        necessidadeHidricaMm: numberOrZero(cropForm.necessidadeHidricaMm),
        periodoPlantio: cropForm.periodoPlantio.trim() || null,
      });
      await createAreaCultura({
        idArea: areaId,
        idCultura: cultura.idCultura,
        dataPlantio: cropForm.dataPlantio,
        dataColheitaPrevista: cropForm.dataColheitaPrevista || null,
        status: "ATIVO",
        estagioCrescimento: cropForm.estagioCrescimento.trim() || null,
      });
    }, "Cultura e plantio gravados no banco de dados.");
  };

  const collectNasaClimate = () => {
    if (!areaId) return;
    void runAction(
      () => coletarClimaNasa(areaId),
      "Clima coletado pela NASA e gravado no banco de dados.",
    );
  };

  const generateIrrigationPrediction = () => {
    if (!areaId || !authUser) return;
    if (company.latitude === null || company.longitude === null) {
      setErrorMessage("Informe latitude e longitude da propriedade antes de gerar predição de irrigação.");
      return;
    }
    if (!selectedSoil) {
      setErrorMessage("Cadastre uma leitura de solo para esta área antes de gerar predição de irrigação.");
      return;
    }
    if (!selectedIrrigation) {
      setErrorMessage("Cadastre um registro de irrigação para esta área antes de gerar predição de irrigação.");
      return;
    }
    if (!activeCrop) {
      setErrorMessage("Cadastre um plantio ativo para esta área antes de gerar predição de irrigação.");
      return;
    }

    const fieldArea = selectedIrrigation.areaHa ?? selectedArea?.areaHectares ?? company.areaTotalHectares;
    if (!fieldArea) {
      setErrorMessage("Informe a área do campo antes de gerar predição de irrigação.");
      return;
    }

    void runAction(
      () =>
        predizerIrrigacao({
          idArea: areaId,
          idAreaCultura: activeCrop.idAreaCultura,
          idUsuario: authUser.idUsuario,
          latitude: company.latitude!,
          longitude: company.longitude!,
          soil_type: validSoilType(selectedSoil.soilType || selectedArea?.tipoSolo),
          soil_moisture: selectedSoil.moisture,
          crop_type: activeCrop.name,
          crop_growth_stage: activeCrop.stage,
          irrigation_type: selectedIrrigation.type,
          field_area_hectare: fieldArea,
          mulching_used: normalizeYesNo(selectedIrrigation.coverage),
          previous_irrigation_mm: selectedIrrigation.previousMm,
          current_water_usage: selectedIrrigation.currentMm,
        }),
      "Predição de irrigação gerada pela IA e gravada no banco de dados.",
    );
  };

  const requiresArea = REGISTER_ACTIONS.find((action) => action.id === mode)?.requiresArea;
  const areaBlocked = Boolean(requiresArea && dashboardAreas.length === 0);

  return (
    <DashboardCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={labelMuted}>Dados operacionais</p>
          <h2 className={`mt-1 ${sectionTitle}`}>Cadastro manual</h2>
          <p className={`mt-1 text-sm ${textMuted}`}>
            Registre apenas informações fornecidas pelo usuário e existentes no banco de dados.
          </p>
        </div>
        <button type="button" onClick={syncArea} className={`${btnSecondary} ${btnClick}`}>
          Preencher com dados atuais
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {REGISTER_ACTIONS.map(({ id, label, icon: Icon, requiresArea }) => {
          const disabled = Boolean(requiresArea && dashboardAreas.length === 0);
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => setMode(id)}
              className={[
                btnClick,
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45",
                mode === id
                  ? "border-verde-floresta bg-verde-floresta text-bege-natural"
                  : "border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:text-verde-floresta",
              ].join(" ")}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      {dashboardAreas.length > 0 && mode !== "area" ? (
        <div className="mt-5 max-w-sm">
          <Field label="Área monitorada">
            <AreaSelect areas={dashboardAreas} value={selectedArea?.idArea ?? ""} onChange={setSelectedAreaId} />
          </Field>
        </div>
      ) : null}

      {areaBlocked ? (
        <p className={`mt-5 text-sm ${textMuted}`}>Cadastre uma área monitorada antes de registrar estes dados.</p>
      ) : (
        <div className="mt-5">
          {mode === "area" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Nome da área">
                <input className={inputField} value={areaForm.nomeArea} onChange={(event) => setAreaForm({ ...areaForm, nomeArea: event.target.value })} />
              </Field>
              <Field label="Área em hectares">
                <input className={inputField} type="number" min="0" step="0.01" value={areaForm.areaHectares} onChange={(event) => setAreaForm({ ...areaForm, areaHectares: event.target.value })} />
              </Field>
              <Field label="Tipo de solo">
                <CustomSelect
                  value={areaForm.tipoSolo}
                  onChange={(tipoSolo) => setAreaForm({ ...areaForm, tipoSolo })}
                  options={[...SOIL_TYPE_OPTIONS]}
                />
              </Field>
            </div>
          )}

          {mode === "soil" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Umidade do solo (%)">
                <input className={inputField} type="number" min="0" max="100" step="0.01" value={soilForm.umidadeSolo} onChange={(event) => setSoilForm({ ...soilForm, umidadeSolo: event.target.value })} />
              </Field>
              <Field label="Tipo de solo">
                <CustomSelect
                  value={soilForm.tipoSolo}
                  onChange={(tipoSolo) => setSoilForm({ ...soilForm, tipoSolo })}
                  options={[...SOIL_TYPE_OPTIONS]}
                />
              </Field>
              <Field label="Fonte">
                <CustomSelect
                  value={soilForm.fonte}
                  onChange={(fonte) => setSoilForm({ ...soilForm, fonte })}
                  options={[...SOURCE_OPTIONS]}
                />
              </Field>
            </div>
          )}

          {mode === "irrigation" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Tipo">
                <CustomSelect
                  value={irrigationForm.tipoIrrigacao}
                  onChange={(tipoIrrigacao) => setIrrigationForm({ ...irrigationForm, tipoIrrigacao })}
                  options={[...IRRIGATION_TYPE_OPTIONS]}
                />
              </Field>
              <Field label="Irrigação anterior (mm)">
                <input className={inputField} type="number" min="0" step="0.01" value={irrigationForm.irrigacaoAnteriorMm} onChange={(event) => setIrrigationForm({ ...irrigationForm, irrigacaoAnteriorMm: event.target.value })} />
              </Field>
              <Field label="Consumo atual (mm)">
                <input className={inputField} type="number" min="0" step="0.01" value={irrigationForm.consumoAtualMm} onChange={(event) => setIrrigationForm({ ...irrigationForm, consumoAtualMm: event.target.value })} />
              </Field>
              <Field label="Área do campo (ha)">
                <input className={inputField} type="number" min="0" step="0.01" value={irrigationForm.areaCampoHectare} onChange={(event) => setIrrigationForm({ ...irrigationForm, areaCampoHectare: event.target.value })} />
              </Field>
              <Field label="Cobertura de solo">
                <CustomSelect
                  value={irrigationForm.usouCoberturaSolo}
                  onChange={(usouCoberturaSolo) => setIrrigationForm({ ...irrigationForm, usouCoberturaSolo })}
                  options={[...YES_NO_OPTIONS]}
                />
              </Field>
              <Field label="Origem">
                <CustomSelect
                  value={irrigationForm.origem}
                  onChange={(origem) => setIrrigationForm({ ...irrigationForm, origem })}
                  options={[...SOURCE_OPTIONS]}
                />
              </Field>
            </div>
          )}

          {mode === "crop" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Cultura">
                <input className={inputField} value={cropForm.nomeCultura} onChange={(event) => setCropForm({ ...cropForm, nomeCultura: event.target.value })} />
              </Field>
              <Field label="Necessidade hídrica (mm)">
                <input className={inputField} type="number" min="0" step="0.01" value={cropForm.necessidadeHidricaMm} onChange={(event) => setCropForm({ ...cropForm, necessidadeHidricaMm: event.target.value })} />
              </Field>
              <Field label="Período de plantio">
                <input className={inputField} value={cropForm.periodoPlantio} onChange={(event) => setCropForm({ ...cropForm, periodoPlantio: event.target.value })} />
              </Field>
              <Field label="Data de plantio">
                <input className={inputField} type="date" value={cropForm.dataPlantio} onChange={(event) => setCropForm({ ...cropForm, dataPlantio: event.target.value })} />
              </Field>
              <Field label="Colheita prevista">
                <input className={inputField} type="date" value={cropForm.dataColheitaPrevista} onChange={(event) => setCropForm({ ...cropForm, dataColheitaPrevista: event.target.value })} />
              </Field>
              <Field label="Estágio">
                <input className={inputField} value={cropForm.estagioCrescimento} onChange={(event) => setCropForm({ ...cropForm, estagioCrescimento: event.target.value })} />
              </Field>
              <div className="md:col-span-3">
                <Field label="Descrição">
                  <input className={inputField} value={cropForm.descricao} onChange={(event) => setCropForm({ ...cropForm, descricao: event.target.value })} />
                </Field>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {mode === "area" && <ActionButton disabled={saving || !areaForm.nomeArea.trim()} onClick={submitArea} label="Salvar área" />}
        {mode === "soil" && <ActionButton disabled={saving || !areaId || !soilForm.umidadeSolo} onClick={submitSoil} label="Salvar solo" />}
        {mode === "irrigation" && <ActionButton disabled={saving || !areaId} onClick={submitIrrigation} label="Salvar irrigação" />}
        {mode === "crop" && <ActionButton disabled={saving || !areaId || !cropForm.nomeCultura.trim() || !cropForm.necessidadeHidricaMm} onClick={submitCrop} label="Salvar plantio" />}
      </div>

      <div className="mt-6 rounded-xl border border-[var(--db-border-soft)] bg-[var(--db-surface-muted)]/40 p-4">
        <p className={labelMuted}>Gerar por APIs</p>
        <p className={`mt-1 text-sm ${textMuted}`}>
          Estas ações não pedem novos dados manuais. Elas usam os cadastros salvos no banco para consultar NASA ou IA e gravar os resultados.
        </p>
        {dashboardAreas.length > 0 ? (
          <div className="mt-4 max-w-sm">
            <Field label="Área de referência">
              <AreaSelect areas={dashboardAreas} value={selectedArea?.idArea ?? ""} onChange={setSelectedAreaId} />
            </Field>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <SecondaryActionButton
            disabled={saving || !areaId}
            onClick={collectNasaClimate}
            label="Coletar clima NASA"
            icon={CloudSun}
          />
          <SecondaryActionButton
            disabled={saving || !areaId}
            onClick={generateIrrigationPrediction}
            label="Gerar predição de irrigação"
            icon={Bot}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {saving ? <span className={`text-sm font-semibold ${textMuted}`}>Salvando...</span> : null}
        {message ? <span className="text-sm font-semibold text-verde-floresta">{message}</span> : null}
        {errorMessage ? <span className="text-sm font-semibold text-red-600" role="alert">{errorMessage}</span> : null}
      </div>
    </DashboardCard>
  );
}

function ActionButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${btnClick} rounded-lg bg-verde-floresta px-4 py-2 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function SecondaryActionButton({
  disabled,
  onClick,
  label,
  icon: Icon,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
  icon: typeof CloudSun;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${btnSecondary} ${btnClick} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  );
}

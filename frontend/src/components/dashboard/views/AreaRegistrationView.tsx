import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Leaf,
  Loader2,
  MapPinned,
  Sprout,
} from "lucide-react";
import { CustomSelect } from "@/components/dashboard/DashboardPickers";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  btnClick,
  btnSecondary,
  inputField,
  labelMuted,
  sectionTitle,
  textMuted,
  DASHBOARD_ROUTES,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { ApiRequestError } from "@/lib/api/client";
import { createAreaMonitorada } from "@/lib/api/areasApi";
import { createAreaCultura, createCultura, listCulturas } from "@/lib/api/cropsApi";
import { createIrrigacao } from "@/lib/api/irrigationApi";
import { createLeituraSolo } from "@/lib/api/soilApi";
import type { CulturaResponse, IrrigacaoRequest } from "@/lib/api/types";

const SOIL_TYPE_OPTIONS = [
  { value: "Argiloso", label: "Argiloso" },
  { value: "Siltoso", label: "Siltoso" },
  { value: "Arenoso", label: "Arenoso" },
  { value: "Franco", label: "Franco" },
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

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

function dateInput(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function dateTimeFromDate(value: string) {
  return value ? `${value}T12:00:00` : null;
}

function numberFromInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function positiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
}

function nonNegativeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

function validPercent(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
}

function errorMessageFromApi(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) return error.message;
  return fallback;
}

function normalizeCultureName(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function resolveCultura(body: {
  nomeCultura: string;
  descricao: string;
  necessidadeHidricaMm: number;
  periodoPlantio: string;
}): Promise<CulturaResponse> {
  const targetName = normalizeCultureName(body.nomeCultura);
  const existingCulture = (await listCulturas()).find(
    (cultura) => normalizeCultureName(cultura.nomeCultura) === targetName,
  );

  return existingCulture ?? createCultura(body);
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelMuted}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function FormSection({
  title,
  description,
  locked = false,
  disabled = false,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  locked?: boolean;
  disabled?: boolean;
  icon: typeof MapPinned;
  children: ReactNode;
}) {
  return (
    <DashboardCard className={locked ? "opacity-60" : ""}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className={sectionTitle}>{title}</h2>
            <p className={`mt-1 text-sm ${textMuted}`}>{description}</p>
          </div>
        </div>
        {locked ? (
          <span className="rounded-full border border-[var(--db-border)] px-3 py-1 text-xs font-semibold text-[var(--db-text-faint)]">
            Bloqueado
          </span>
        ) : null}
      </div>
      {locked ? (
        <p className="mt-4 rounded-lg border border-[var(--db-border-soft)] bg-[var(--db-surface-muted)] px-3 py-2 text-sm text-[var(--db-text-muted)]">
          Preencha primeiro os campos obrigatórios da área monitorada para liberar esta seção.
        </p>
      ) : null}
      <fieldset
        disabled={locked || disabled}
        className={`mt-5 ${locked || disabled ? "pointer-events-none" : ""}`}
      >
        {children}
      </fieldset>
    </DashboardCard>
  );
}

export function AreaRegistrationView() {
  const { company, reloadDashboard } = useDashboard();
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

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
    dataColeta: string;
    umidadeSolo: string;
    tipoSolo: string;
    fonte: string;
  }>({
    dataColeta: dateInput(),
    umidadeSolo: "",
    tipoSolo: SOIL_TYPE_OPTIONS[0].value,
    fonte: "MANUAL",
  });

  const [irrigationForm, setIrrigationForm] = useState({
    dataRegistro: dateInput(),
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
    dataColheitaPrevista: dateInput(90),
    estagioCrescimento: "",
  });

  const areaValid = useMemo(
    () =>
      Boolean(company.idPropriedade) &&
      areaForm.nomeArea.trim().length > 0 &&
      positiveNumber(areaForm.areaHectares) &&
      areaForm.tipoSolo.trim().length > 0,
    [areaForm, company.idPropriedade],
  );

  const soilValid = useMemo(
    () =>
      soilForm.dataColeta.length > 0 &&
      validPercent(soilForm.umidadeSolo) &&
      soilForm.tipoSolo.trim().length > 0 &&
      soilForm.fonte.trim().length > 0,
    [soilForm],
  );

  const irrigationValid = useMemo(
    () =>
      irrigationForm.dataRegistro.length > 0 &&
      irrigationForm.tipoIrrigacao.trim().length > 0 &&
      nonNegativeNumber(irrigationForm.irrigacaoAnteriorMm) &&
      nonNegativeNumber(irrigationForm.consumoAtualMm) &&
      positiveNumber(irrigationForm.areaCampoHectare) &&
      irrigationForm.usouCoberturaSolo.trim().length > 0 &&
      irrigationForm.origem.trim().length > 0,
    [irrigationForm],
  );

  const cropValid = useMemo(() => {
    if (
      !cropForm.nomeCultura.trim() ||
      !cropForm.descricao.trim() ||
      !positiveNumber(cropForm.necessidadeHidricaMm) ||
      !cropForm.periodoPlantio.trim() ||
      !cropForm.dataPlantio ||
      !cropForm.dataColheitaPrevista ||
      !cropForm.estagioCrescimento.trim()
    ) {
      return false;
    }
    return new Date(cropForm.dataColheitaPrevista) >= new Date(cropForm.dataPlantio);
  }, [cropForm]);

  const formValid = areaValid && soilValid && irrigationValid && cropValid;
  const dependentLocked = !areaValid;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!company.idPropriedade) {
      setFeedback({
        type: "error",
        message: "A propriedade do usuário não foi encontrada.",
      });
      return;
    }

    if (!formValid) {
      setFeedback({
        type: "error",
        message: "Preencha todos os campos obrigatórios antes de salvar.",
      });
      return;
    }

    setSaving(true);
    try {
      const area = await createAreaMonitorada({
        idPropriedade: company.idPropriedade,
        nomeArea: areaForm.nomeArea.trim(),
        areaHectares: numberFromInput(areaForm.areaHectares),
        tipoSolo: areaForm.tipoSolo,
      });

      await createLeituraSolo({
        idArea: area.idArea,
        dataColeta: dateTimeFromDate(soilForm.dataColeta),
        umidadeSolo: numberFromInput(soilForm.umidadeSolo),
        tipoSolo: soilForm.tipoSolo,
        fonte: soilForm.fonte,
      });

      const irrigationPayload: IrrigacaoRequest = {
        idArea: area.idArea,
        dataRegistro: dateTimeFromDate(irrigationForm.dataRegistro),
        tipoIrrigacao: irrigationForm.tipoIrrigacao,
        irrigacaoAnteriorMm: numberFromInput(irrigationForm.irrigacaoAnteriorMm),
        consumoAtualMm: numberFromInput(irrigationForm.consumoAtualMm),
        areaCampoHectare: numberFromInput(irrigationForm.areaCampoHectare),
        usouCoberturaSolo: irrigationForm.usouCoberturaSolo,
        origem: irrigationForm.origem,
      };
      await createIrrigacao(irrigationPayload);

      const cultura = await resolveCultura({
        nomeCultura: cropForm.nomeCultura.trim(),
        descricao: cropForm.descricao.trim(),
        necessidadeHidricaMm: numberFromInput(cropForm.necessidadeHidricaMm),
        periodoPlantio: cropForm.periodoPlantio.trim(),
      });

      await createAreaCultura({
        idArea: area.idArea,
        idCultura: cultura.idCultura,
        dataPlantio: cropForm.dataPlantio,
        dataColheitaPrevista: cropForm.dataColheitaPrevista,
        status: "ATIVO",
        estagioCrescimento: cropForm.estagioCrescimento.trim(),
      });

      await reloadDashboard();
      setFeedback({ type: "success", message: "Área cadastrada com sucesso!" });
    } catch (error) {
      setFeedback({
        type: "error",
        message: errorMessageFromApi(error, "Não foi possível cadastrar a área. Tente novamente."),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={DASHBOARD_ROUTES.visaoGeral} className={`${btnSecondary} ${btnClick}`}>
          <ArrowLeft className="size-4" aria-hidden />
          Voltar para Visão Geral
        </Link>
        <p className={`text-sm ${textMuted}`}>
          <span className="font-semibold text-red-500">*</span> Campos obrigatórios
        </p>
      </div>

      <FormSection
        icon={MapPinned}
        title="Área monitorada"
        description="Esta é a base do cadastro. Os dados operacionais abaixo dependem desta área."
        disabled={saving}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Nome da área" required>
            <input
              className={inputField}
              required
              value={areaForm.nomeArea}
              onChange={(event) => setAreaForm({ ...areaForm, nomeArea: event.target.value })}
            />
          </Field>
          <Field label="Área em hectares" required>
            <input
              className={inputField}
              type="number"
              min="0.01"
              step="0.01"
              required
              value={areaForm.areaHectares}
              onChange={(event) => setAreaForm({ ...areaForm, areaHectares: event.target.value })}
            />
          </Field>
          <Field label="Tipo de solo" required>
            <CustomSelect
              value={areaForm.tipoSolo}
              onChange={(tipoSolo) => {
                setAreaForm({ ...areaForm, tipoSolo });
                setSoilForm((current) => ({ ...current, tipoSolo }));
              }}
              options={[...SOIL_TYPE_OPTIONS]}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        icon={Leaf}
        title="Solo"
        description="Leitura inicial de solo vinculada à área monitorada."
        locked={dependentLocked}
        disabled={saving}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Data da coleta" required>
            <input
              className={inputField}
              type="date"
              required
              value={soilForm.dataColeta}
              onChange={(event) => setSoilForm({ ...soilForm, dataColeta: event.target.value })}
            />
          </Field>
          <Field label="Umidade do solo (%)" required>
            <input
              className={inputField}
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={soilForm.umidadeSolo}
              onChange={(event) => setSoilForm({ ...soilForm, umidadeSolo: event.target.value })}
            />
          </Field>
          <Field label="Tipo de solo" required>
            <CustomSelect
              value={soilForm.tipoSolo}
              onChange={(tipoSolo) => setSoilForm({ ...soilForm, tipoSolo })}
              options={[...SOIL_TYPE_OPTIONS]}
            />
          </Field>
          <Field label="Fonte" required>
            <CustomSelect
              value={soilForm.fonte}
              onChange={(fonte) => setSoilForm({ ...soilForm, fonte })}
              options={[...SOURCE_OPTIONS]}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        icon={Droplets}
        title="Irrigação"
        description="Registro inicial de consumo hídrico para a área cadastrada."
        locked={dependentLocked}
        disabled={saving}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Data do registro" required>
            <input
              className={inputField}
              type="date"
              required
              value={irrigationForm.dataRegistro}
              onChange={(event) => setIrrigationForm({ ...irrigationForm, dataRegistro: event.target.value })}
            />
          </Field>
          <Field label="Tipo" required>
            <CustomSelect
              value={irrigationForm.tipoIrrigacao}
              onChange={(tipoIrrigacao) => setIrrigationForm({ ...irrigationForm, tipoIrrigacao })}
              options={[...IRRIGATION_TYPE_OPTIONS]}
            />
          </Field>
          <Field label="Irrigação anterior (mm)" required>
            <input
              className={inputField}
              type="number"
              min="0"
              step="0.01"
              required
              value={irrigationForm.irrigacaoAnteriorMm}
              onChange={(event) =>
                setIrrigationForm({ ...irrigationForm, irrigacaoAnteriorMm: event.target.value })
              }
            />
          </Field>
          <Field label="Consumo atual (mm)" required>
            <input
              className={inputField}
              type="number"
              min="0"
              step="0.01"
              required
              value={irrigationForm.consumoAtualMm}
              onChange={(event) => setIrrigationForm({ ...irrigationForm, consumoAtualMm: event.target.value })}
            />
          </Field>
          <Field label="Área do campo (ha)" required>
            <input
              className={inputField}
              type="number"
              min="0.01"
              step="0.01"
              required
              value={irrigationForm.areaCampoHectare}
              onChange={(event) =>
                setIrrigationForm({ ...irrigationForm, areaCampoHectare: event.target.value })
              }
            />
          </Field>
          <Field label="Cobertura de solo" required>
            <CustomSelect
              value={irrigationForm.usouCoberturaSolo}
              onChange={(usouCoberturaSolo) =>
                setIrrigationForm({ ...irrigationForm, usouCoberturaSolo })
              }
              options={[...YES_NO_OPTIONS]}
            />
          </Field>
          <Field label="Origem" required>
            <CustomSelect
              value={irrigationForm.origem}
              onChange={(origem) => setIrrigationForm({ ...irrigationForm, origem })}
              options={[...SOURCE_OPTIONS]}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        icon={Sprout}
        title="Plantio"
        description="Cultura e vínculo de plantio ativo para a nova área."
        locked={dependentLocked}
        disabled={saving}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Cultura" required>
            <input
              className={inputField}
              required
              value={cropForm.nomeCultura}
              onChange={(event) => setCropForm({ ...cropForm, nomeCultura: event.target.value })}
            />
          </Field>
          <Field label="Necessidade hídrica (mm)" required>
            <input
              className={inputField}
              type="number"
              min="0.01"
              step="0.01"
              required
              value={cropForm.necessidadeHidricaMm}
              onChange={(event) =>
                setCropForm({ ...cropForm, necessidadeHidricaMm: event.target.value })
              }
            />
          </Field>
          <Field label="Periodo de plantio" required>
            <input
              className={inputField}
              required
              value={cropForm.periodoPlantio}
              onChange={(event) => setCropForm({ ...cropForm, periodoPlantio: event.target.value })}
            />
          </Field>
          <Field label="Data de plantio" required>
            <input
              className={inputField}
              type="date"
              required
              value={cropForm.dataPlantio}
              onChange={(event) => setCropForm({ ...cropForm, dataPlantio: event.target.value })}
            />
          </Field>
          <Field label="Colheita prevista" required>
            <input
              className={inputField}
              type="date"
              min={cropForm.dataPlantio}
              required
              value={cropForm.dataColheitaPrevista}
              onChange={(event) =>
                setCropForm({ ...cropForm, dataColheitaPrevista: event.target.value })
              }
            />
          </Field>
          <Field label="Estagio" required>
            <input
              className={inputField}
              required
              value={cropForm.estagioCrescimento}
              onChange={(event) =>
                setCropForm({ ...cropForm, estagioCrescimento: event.target.value })
              }
            />
          </Field>
          <div className="md:col-span-3">
            <Field label="Descrição" required>
              <textarea
                className={`${inputField} min-h-24 resize-y`}
                required
                value={cropForm.descricao}
                onChange={(event) => setCropForm({ ...cropForm, descricao: event.target.value })}
              />
            </Field>
          </div>
        </div>
      </FormSection>

      {feedback ? (
        <div
          className={[
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold",
            feedback.type === "success"
              ? "border-verde-floresta/30 bg-verde-floresta/10 text-verde-floresta"
              : "border-red-500/30 bg-red-500/10 text-red-600",
          ].join(" ")}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.type === "success" ? <CheckCircle2 className="size-5 shrink-0" aria-hidden /> : null}
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--db-border)] bg-[var(--db-surface)] p-4 shadow-sm sm:p-5">
        <p className={`max-w-xl text-sm ${textMuted}`}>
          O cadastro será salvo em ordem: área, solo, irrigação, cultura e plantio.
        </p>
        <button
          type="submit"
          disabled={saving || !formValid}
          className={`${btnClick} inline-flex items-center gap-2 rounded-lg bg-verde-floresta px-4 py-2 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {saving ? "Salvando..." : "Cadastrar área"}
        </button>
      </div>

      {!areaValid ? (
        <p className={`text-sm ${textMuted}`}>
          Preencha os dados obrigatórios da área monitorada para liberar solo, irrigação e plantio.
        </p>
      ) : null}
      {areaValid && !formValid ? (
        <p className={`text-sm ${textMuted}`}>
          Agora complete os blocos de solo, irrigação e plantio para habilitar o cadastro.
        </p>
      ) : null}
    </form>
  );
}

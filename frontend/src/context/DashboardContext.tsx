import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  countActiveFilters,
  DEFAULT_PAGE_FILTERS,
  type PageFilters,
} from "@/components/dashboard/FilterSlideover";
import { toDashboardLoadError } from "@/components/dashboard/DashboardLoadState";
import { ApiRequestError } from "@/lib/api/client";
import { updateEmpresa } from "@/lib/api/companiesApi";
import { updateUsuarioPreferencias, getUsuarioPreferencias } from "@/lib/api/preferencesApi";
import { updatePropriedade } from "@/lib/api/propertiesApi";
import { loginUsuario, listUsuarios, registerPlataforma, updateUsuario } from "@/lib/api/usersApi";
import type { UsuarioPreferenciasRequest, UsuarioResponse } from "@/lib/api/types";
import { clearFiltersForView } from "@/lib/dashboard/helpers";
import {
  companyProfileFromRegister,
  EMPTY_COMPANY_PROFILE,
} from "@/lib/dashboard/companyFields";
import {
  EMPTY_CLIMATE,
  EMPTY_CLIMATE_HISTORY,
  EMPTY_SOIL,
  EMPTY_WATER,
  companyProfileFromApi,
  fetchDashboardData,
} from "@/lib/dashboard/loadDashboardData";
import type {
  AreaMonitoradaResponse,
  DashboardAreaResumoResponse,
  DashboardResumoResponse,
} from "@/lib/api/types";
import {
  clearAuthSession,
  loadStoredAuthSession,
  saveAuthSession,
} from "@/lib/dashboard/authSession";
import {
  DEFAULT_GENERAL_PREFERENCES,
  filtersFromPreferences,
  generalPreferencesFromResponse,
} from "@/lib/dashboard/preferences";
import type {
  AuthMode,
  AlertItem,
  ClimateHistoryState,
  ClimateState,
  CompanyProfile,
  CropPlantingItem,
  DashboardLoadError,
  DashboardLoadStatus,
  GeneralPreferences,
  LoginCredentials,
  LoginUserOption,
  PredictionItem,
  RegisterCredentials,
  SoilState,
  TimeFilter,
  ViewId,
  WaterState,
} from "@/types/dashboard";

type DashboardContextValue = {
  isAuthenticated: boolean;
  authUser: UsuarioResponse | null;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginError: string | null;
  loginUsers: LoginUserOption[];
  isLoadingLoginUsers: boolean;
  loginUsersError: string | null;
  reloadLoginUsers: () => Promise<void>;
  submitRegisterStep1: (credentials: RegisterCredentials) => void;
  backFromRegisterCompany: () => void;
  completeRegistration: (company: CompanyProfile) => Promise<void>;
  registerCompanyDraft: CompanyProfile;
  logout: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  loadStatus: DashboardLoadStatus;
  loadError: DashboardLoadError | null;
  reloadDashboard: () => Promise<void>;

  company: CompanyProfile;
  updateCompany: (data: CompanyProfile) => Promise<void>;

  dashboardSummary: DashboardResumoResponse | null;
  dashboardAreas: AreaMonitoradaResponse[];
  selectedArea: DashboardAreaResumoResponse | null;
  alerts: AlertItem[];
  climate: ClimateState;
  climateHistory: ClimateHistoryState;
  soil: SoilState;
  water: WaterState;
  crops: CropPlantingItem[];
  predictions: PredictionItem[];

  appliedFilters: PageFilters;
  draftFilters: PageFilters;
  setDraftFilters: (filters: PageFilters) => void;
  isFilterOpen: boolean;

  selectedCrop: string | null;
  setSelectedCrop: (id: string | null) => void;

  alertTypeOptions: string[];
  soilSectorOptions: string[];
  growthCropOptions: { id: string; label: string }[];

  openFilters: () => void;
  closeFilters: () => void;
  applyFilters: () => void;
  clearDraftFilters: (view: ViewId, timeFilter: TimeFilter) => void;
  resetSelections: () => void;

  activeFilterCount: (view: ViewId, timeFilter: TimeFilter) => number;

  pageTimeFilter: TimeFilter;
  setPageTimeFilter: (filter: TimeFilter) => void;

  preferences: GeneralPreferences;
  updatePreference: <K extends keyof GeneralPreferences>(
    key: K,
    value: GeneralPreferences[K],
  ) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const LEGACY_DEMO_PASSWORD_BY_EMAIL: Record<string, string> = {
  "carlos.mendes@agrotech.com.br": "hash_senha_001",
  "fernanda.lima@agrotech.com.br": "hash_senha_002",
  "roberto.souza@campoverde.com.br": "hash_senha_003",
  "patricia.oliveira@campoverde.com.br": "hash_senha_004",
  "marcos.alves@sertaofertil.com.br": "hash_senha_005",
  "ana.costa@sertaofertil.com.br": "hash_senha_006",
};

function demoPasswordForUser(usuario: UsuarioResponse) {
  return (
    LEGACY_DEMO_PASSWORD_BY_EMAIL[usuario.email.toLowerCase()] ??
    `hash_senha_${String(usuario.idUsuario).padStart(3, "0")}`
  );
}

function toLoginUserOption(usuario: UsuarioResponse): LoginUserOption {
  return {
    id: String(usuario.idUsuario),
    name: usuario.nomeUsuario,
    email: usuario.email,
    password: demoPasswordForUser(usuario),
    profile: usuario.perfil,
    status: usuario.status,
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const initialAuthSession = useMemo(() => loadStoredAuthSession(), []);
  const [authUser, setAuthUser] = useState<UsuarioResponse | null>(
    () => initialAuthSession?.usuario ?? null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(initialAuthSession?.usuario),
  );
  const [authMode, setAuthModeState] = useState<AuthMode>("login");
  const [registerCredentials, setRegisterCredentials] = useState<RegisterCredentials | null>(
    null,
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginUsers, setLoginUsers] = useState<LoginUserOption[]>([]);
  const [isLoadingLoginUsers, setIsLoadingLoginUsers] = useState(false);
  const [loginUsersError, setLoginUsersError] = useState<string | null>(null);

  const setAuthMode = useCallback((mode: AuthMode) => {
    if (mode === "login") {
      setRegisterCredentials(null);
    }
    setAuthModeState(mode);
  }, []);

  const registerCompanyDraft = useMemo((): CompanyProfile => {
    if (!registerCredentials) return { ...EMPTY_COMPANY_PROFILE };
    return {
      ...EMPTY_COMPANY_PROFILE,
      nomeUsuario: registerCredentials.fullName,
      emailUsuario: registerCredentials.email,
    };
  }, [registerCredentials]);
  const [preferences, setPreferences] = useState<GeneralPreferences>({
    ...DEFAULT_GENERAL_PREFERENCES,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [loadStatus, setLoadStatus] = useState<DashboardLoadStatus>("idle");
  const [loadError, setLoadError] = useState<DashboardLoadError | null>(null);
  const loadRequestRef = useRef(0);

  const [company, setCompany] = useState<CompanyProfile>({ ...EMPTY_COMPANY_PROFILE });

  const [appliedFilters, setAppliedFilters] = useState<PageFilters>(DEFAULT_PAGE_FILTERS);
  const [draftFilters, setDraftFilters] = useState<PageFilters>(DEFAULT_PAGE_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [climate, setClimate] = useState<ClimateState>({ ...EMPTY_CLIMATE });
  const [climateHistory, setClimateHistory] = useState<ClimateHistoryState>({
    ...EMPTY_CLIMATE_HISTORY,
  });
  const [soil, setSoil] = useState<SoilState>({ ...EMPTY_SOIL });
  const [water, setWater] = useState<WaterState>({ ...EMPTY_WATER });
  const [dashboardSummary, setDashboardSummary] = useState<DashboardResumoResponse | null>(null);
  const [dashboardAreas, setDashboardAreas] = useState<AreaMonitoradaResponse[]>([]);
  const [selectedArea, setSelectedArea] = useState<DashboardAreaResumoResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [crops, setCrops] = useState<CropPlantingItem[]>([]);
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);

  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [pageTimeFilter, setPageTimeFilter] = useState<TimeFilter>("daily");

  const alertTypeOptions = useMemo(() => [...new Set(alerts.map((a) => a.type))], [alerts]);
  const soilSectorOptions = useMemo(() => soil.sectors.map((s) => s.sector), [soil.sectors]);
  const growthCropOptions = useMemo(
    () => crops.map((crop) => ({ id: crop.id, label: crop.name })),
    [crops],
  );

  const reloadDashboard = useCallback(async () => {
    if (!authUser) {
      setLoadStatus("idle");
      return;
    }

    const requestId = ++loadRequestRef.current;
    setLoadStatus("loading");
    setLoadError(null);

    try {
      const data = await fetchDashboardData(authUser);
      if (requestId !== loadRequestRef.current) return;

      setCompany(data.company);
      setDashboardSummary(data.summary);
      setDashboardAreas(data.areas);
      setSelectedArea(data.selectedArea);
      setAlerts(data.alerts);
      setClimate(data.climate);
      setClimateHistory(data.climateHistory);
      setSoil(data.soil);
      setWater(data.water);
      setCrops(data.crops);
      setPredictions(data.predictions);
      setLoadStatus("success");
    } catch (err) {
      if (requestId !== loadRequestRef.current) return;
      setLoadError(toDashboardLoadError(err));
      setLoadStatus("error");
    }
  }, [authUser]);

  const reloadLoginUsers = useCallback(async () => {
    setIsLoadingLoginUsers(true);
    setLoginUsersError(null);
    try {
      const usuarios = await listUsuarios();
      setLoginUsers(usuarios.map(toLoginUserOption));
    } catch (error) {
      setLoginUsers([]);
      setLoginUsersError(
        error instanceof ApiRequestError
          ? error.message
          : "Não foi possível carregar os usuários cadastrados.",
      );
    } finally {
      setIsLoadingLoginUsers(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoginError(null);

    try {
      const response = await loginUsuario({
        email: credentials.email.trim(),
        senha: credentials.password,
      });

      saveAuthSession(response.usuario);
      setAuthUser(response.usuario);
      setIsAuthenticated(true);
      setAuthModeState("login");
    } catch (error) {
      setLoginError(
        error instanceof ApiRequestError
          ? error.message
          : "Não foi possível fazer login. Tente novamente.",
      );
    }
  }, []);

  const submitRegisterStep1 = useCallback((credentials: RegisterCredentials) => {
    setRegisterCredentials(credentials);
    setAuthModeState("registerCompany");
  }, []);

  const backFromRegisterCompany = useCallback(() => {
    setAuthModeState("register");
  }, []);

  const completeRegistration = useCallback(
    async (draft: CompanyProfile) => {
      if (!registerCredentials) return;
      setLoginError(null);
      const companyDraft = companyProfileFromRegister(registerCredentials, draft);
      try {
        const response = await registerPlataforma({
          nomeEmpresa: companyDraft.nomeEmpresa.trim(),
          cnpj: companyDraft.cnpj.trim(),
          emailEmpresa: companyDraft.emailEmpresa.trim(),
          telefoneEmpresa: companyDraft.telefoneEmpresa.trim() || null,
          nomePropriedade: companyDraft.nomePropriedade.trim(),
          localizacao: companyDraft.localizacao.trim(),
          latitude: companyDraft.latitude,
          longitude: companyDraft.longitude,
          areaTotalHectares: companyDraft.areaTotalHectares || null,
          nomeUsuario: companyDraft.nomeUsuario.trim(),
          emailUsuario: companyDraft.emailUsuario.trim(),
          senha: registerCredentials.password,
          cpf: companyDraft.cpf.trim() || null,
        });

        saveAuthSession(response.usuario);
        setAuthUser(response.usuario);
        setIsAuthenticated(true);
        setCompany(companyProfileFromApi(response.usuario, response.empresa, response.propriedade));
        setRegisterCredentials(null);
        setAuthModeState("login");
      } catch (error) {
        setLoginError(
          error instanceof ApiRequestError
            ? error.message
            : "Não foi possível concluir o cadastro. Tente novamente.",
        );
      }
    },
    [registerCredentials],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setAuthUser(null);
    setIsAuthenticated(false);
    setLoadStatus("idle");
    setLoadError(null);
    setCompany({ ...EMPTY_COMPANY_PROFILE });
    setDashboardSummary(null);
    setDashboardAreas([]);
    setSelectedArea(null);
    setAlerts([]);
    setClimate({ ...EMPTY_CLIMATE });
    setClimateHistory({ ...EMPTY_CLIMATE_HISTORY });
    setSoil({ ...EMPTY_SOIL });
    setWater({ ...EMPTY_WATER });
    setCrops([]);
    setPredictions([]);
    setPreferences({ ...DEFAULT_GENERAL_PREFERENCES });
    setAppliedFilters(DEFAULT_PAGE_FILTERS);
    setDraftFilters(DEFAULT_PAGE_FILTERS);
    setRegisterCredentials(null);
    setAuthModeState("login");
  }, []);

  const updateCompany = useCallback(
    async (data: CompanyProfile) => {
      const idEmpresa = data.idEmpresa ?? authUser?.idEmpresa;
      const idPropriedade = data.idPropriedade;
      const idUsuario = data.idUsuario ?? authUser?.idUsuario;
      if (!authUser || !idEmpresa || !idPropriedade || !idUsuario) return;

      const [empresa, propriedade, usuario] = await Promise.all([
        updateEmpresa(idEmpresa, {
          nomeEmpresa: data.nomeEmpresa.trim(),
          cnpj: data.cnpj.trim(),
          email: data.emailEmpresa.trim(),
          telefone: data.telefoneEmpresa.trim() || null,
        }),
        updatePropriedade(idPropriedade, {
          idEmpresa,
          nomePropriedade: data.nomePropriedade.trim(),
          localizacao: data.localizacao.trim(),
          latitude: data.latitude,
          longitude: data.longitude,
          areaTotalHectares: data.areaTotalHectares || null,
        }),
        updateUsuario(idUsuario, {
          idEmpresa,
          nomeUsuario: data.nomeUsuario.trim(),
          email: data.emailUsuario.trim(),
          senha: null,
          cpf: data.cpf.trim() || null,
          perfil: data.perfil,
          status: data.status,
        }),
      ]);

      saveAuthSession(usuario);
      setAuthUser(usuario);
      setCompany(companyProfileFromApi(usuario, empresa, propriedade));
    },
    [authUser],
  );

  const saveUserPreferences = useCallback(
    (idUsuario: number, general: GeneralPreferences, filters: PageFilters) => {
      const body: UsuarioPreferenciasRequest = {
        ...general,
        dateRangeStart: filters.dateRange.start,
        dateRangeEnd: filters.dateRange.end,
        selectedMonth: filters.selectedMonth,
        alertLevels: filters.alertLevels,
        alertTypes: filters.alertTypes,
        soilSector: filters.soilSector,
        growthCrop: filters.growthCrop,
      };
      void updateUsuarioPreferencias(idUsuario, body);
    },
    [],
  );

  const updatePreference = useCallback(
    <K extends keyof GeneralPreferences>(key: K, value: GeneralPreferences[K]) => {
      setPreferences((current) => {
        const next = { ...current, [key]: value };
        if (authUser) saveUserPreferences(authUser.idUsuario, next, appliedFilters);
        return next;
      });
    },
    [appliedFilters, authUser, saveUserPreferences],
  );

  const toggleSidebar = useCallback(() => setIsSidebarOpen((o) => !o), []);

  const resetSelections = useCallback(() => {
    setSelectedCrop(null);
  }, []);

  const openFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsFilterOpen(true);
  }, [appliedFilters]);

  const closeFilters = useCallback(() => setIsFilterOpen(false), []);

  const applyFilters = useCallback(() => {
    const next = draftFilters;
    setAppliedFilters(next);
    setIsFilterOpen(false);
    if (authUser) saveUserPreferences(authUser.idUsuario, preferences, next);
  }, [authUser, draftFilters, preferences, saveUserPreferences]);

  const clearDraftFilters = useCallback(
    (view: ViewId, timeFilter: TimeFilter) => {
      setDraftFilters((current) => clearFiltersForView(view, timeFilter, current));
    },
    [],
  );

  const activeFilterCount = useCallback(
    (view: ViewId, timeFilter: TimeFilter) =>
      countActiveFilters(view, timeFilter, appliedFilters),
    [appliedFilters],
  );

  useEffect(() => {
    if (isAuthenticated) return;
    void reloadLoginUsers();
  }, [isAuthenticated, reloadLoginUsers]);

  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;

    void getUsuarioPreferencias(authUser.idUsuario)
      .then((data) => {
        if (cancelled) return;
        const filters = filtersFromPreferences(data);
        setPreferences(generalPreferencesFromResponse(data));
        setAppliedFilters(filters);
        setDraftFilters(filters);
      })
      .catch(() => {
        if (cancelled) return;
        setPreferences({ ...DEFAULT_GENERAL_PREFERENCES });
      });

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void reloadDashboard();
  }, [isAuthenticated, reloadDashboard]);

  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (!isAuthenticated) return;
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;
    void reloadDashboard();
  }, [location.pathname, isAuthenticated, reloadDashboard]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const fn = () => {
      if (mq.matches) setIsSidebarOpen(false);
    };
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const value = useMemo(
    (): DashboardContextValue => ({
      isAuthenticated,
      authUser,
      authMode,
      setAuthMode,
      login,
      loginError,
      loginUsers,
      isLoadingLoginUsers,
      loginUsersError,
      reloadLoginUsers,
      submitRegisterStep1,
      backFromRegisterCompany,
      completeRegistration,
      registerCompanyDraft,
      logout,
      isSidebarOpen,
      toggleSidebar,
      loadStatus,
      loadError,
      reloadDashboard,
      company,
      updateCompany,
      dashboardSummary,
      dashboardAreas,
      selectedArea,
      alerts,
      climate,
      climateHistory,
      soil,
      water,
      crops,
      predictions,
      appliedFilters,
      draftFilters,
      setDraftFilters,
      isFilterOpen,
      selectedCrop,
      setSelectedCrop,
      alertTypeOptions,
      soilSectorOptions,
      growthCropOptions,
      openFilters,
      closeFilters,
      applyFilters,
      clearDraftFilters,
      resetSelections,
      activeFilterCount,
      pageTimeFilter,
      setPageTimeFilter,
      preferences,
      updatePreference,
    }),
    [
      isAuthenticated,
      authUser,
      authMode,
      setAuthMode,
      login,
      loginError,
      loginUsers,
      isLoadingLoginUsers,
      loginUsersError,
      reloadLoginUsers,
      submitRegisterStep1,
      backFromRegisterCompany,
      completeRegistration,
      registerCompanyDraft,
      logout,
      isSidebarOpen,
      toggleSidebar,
      loadStatus,
      loadError,
      reloadDashboard,
      company,
      updateCompany,
      dashboardSummary,
      dashboardAreas,
      selectedArea,
      alerts,
      climate,
      climateHistory,
      soil,
      water,
      crops,
      predictions,
      appliedFilters,
      draftFilters,
      isFilterOpen,
      selectedCrop,
      alertTypeOptions,
      soilSectorOptions,
      growthCropOptions,
      openFilters,
      closeFilters,
      applyFilters,
      clearDraftFilters,
      resetSelections,
      activeFilterCount,
      pageTimeFilter,
      preferences,
      updatePreference,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}

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
import { loginUsuario, listUsuarios } from "@/lib/api/usersApi";
import type { UsuarioResponse } from "@/lib/api/types";
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
  loadStoredPreferences,
  saveStoredPreferences,
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
  reloadLoginUsers: () => Promise<void>;
  submitRegisterStep1: (credentials: RegisterCredentials) => void;
  backFromRegisterCompany: () => void;
  completeRegistration: (company: CompanyProfile) => void;
  registerCompanyDraft: CompanyProfile;
  logout: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  loadStatus: DashboardLoadStatus;
  loadError: DashboardLoadError | null;
  reloadDashboard: () => Promise<void>;

  company: CompanyProfile;
  updateCompany: (data: Partial<CompanyProfile>) => void;

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

  selectedWaterSeg: string | null;
  setSelectedWaterSeg: (id: string | null) => void;
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
  const initialPreferences = useMemo(() => loadStoredPreferences(), []);
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
      responsibleName: registerCredentials.fullName,
      email: registerCredentials.email,
    };
  }, [registerCredentials]);
  const [preferences, setPreferences] = useState<GeneralPreferences>(initialPreferences);
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

  const [selectedWaterSeg, setSelectedWaterSeg] = useState<string | null>(null);
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
    try {
      const usuarios = await listUsuarios();
      setLoginUsers(usuarios.map(toLoginUserOption));
    } catch {
      setLoginUsers([]);
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
          : "Nao foi possivel fazer login. Tente novamente.",
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
    (draft: CompanyProfile) => {
      if (!registerCredentials) return;
      setCompany(companyProfileFromRegister(registerCredentials, draft));
      setRegisterCredentials(null);
      setAuthModeState("login");
      setLoginError(null);
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
    setRegisterCredentials(null);
    setAuthModeState("login");
  }, []);

  const updateCompany = useCallback((data: Partial<CompanyProfile>) => {
    setCompany((current) => ({ ...current, ...data }));
  }, []);

  const updatePreference = useCallback(
    <K extends keyof GeneralPreferences>(key: K, value: GeneralPreferences[K]) => {
      setPreferences((current) => {
        const next = { ...current, [key]: value };
        saveStoredPreferences(next);
        return next;
      });
    },
    [],
  );

  const toggleSidebar = useCallback(() => setIsSidebarOpen((o) => !o), []);

  const resetSelections = useCallback(() => {
    setSelectedWaterSeg(null);
    setSelectedCrop(null);
  }, []);

  const openFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsFilterOpen(true);
  }, [appliedFilters]);

  const closeFilters = useCallback(() => setIsFilterOpen(false), []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false);
  }, [draftFilters]);

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
      selectedWaterSeg,
      setSelectedWaterSeg,
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
      selectedWaterSeg,
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

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
import { DEFAULT_COMPANY_PROFILE } from "@/data/mockCompany";
import { MOCK_DASHBOARD_DATA, type AlertItem } from "@/data/mockDashboard";
import { clearFiltersForView } from "@/lib/dashboard/helpers";
import {
  companyProfileFromRegister,
  EMPTY_COMPANY_PROFILE,
} from "@/lib/dashboard/companyFields";
import { fetchDashboardData } from "@/lib/dashboard/loadDashboardData";
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
  CompanyProfile,
  DashboardLoadError,
  DashboardLoadStatus,
  GeneralPreferences,
  RegisterCredentials,
  TimeFilter,
  ViewId,
} from "@/types/dashboard";

type ClimateState = typeof MOCK_DASHBOARD_DATA.climate.current;
type ClimateHistoryState = typeof MOCK_DASHBOARD_DATA.climate.history;
type SoilState = typeof MOCK_DASHBOARD_DATA.soil.current;
type WaterState = typeof MOCK_DASHBOARD_DATA.water.current;

type DashboardContextValue = {
  isAuthenticated: boolean;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  login: () => void;
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

  appliedFilters: PageFilters;
  draftFilters: PageFilters;
  setDraftFilters: (filters: PageFilters) => void;
  isFilterOpen: boolean;

  selectedNutrient: string | null;
  setSelectedNutrient: (id: string | null) => void;
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

export function DashboardProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const initialPreferences = useMemo(() => loadStoredPreferences(), []);
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadStoredAuthSession());
  const [authMode, setAuthModeState] = useState<AuthMode>("login");
  const [registerCredentials, setRegisterCredentials] = useState<RegisterCredentials | null>(
    null,
  );

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

  const [company, setCompany] = useState<CompanyProfile>({ ...DEFAULT_COMPANY_PROFILE });

  const [appliedFilters, setAppliedFilters] = useState<PageFilters>(DEFAULT_PAGE_FILTERS);
  const [draftFilters, setDraftFilters] = useState<PageFilters>(DEFAULT_PAGE_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [climate, setClimate] = useState<ClimateState>({ ...MOCK_DASHBOARD_DATA.climate.current });
  const [climateHistory, setClimateHistory] = useState<ClimateHistoryState>({
    ...MOCK_DASHBOARD_DATA.climate.history,
  });
  const [soil, setSoil] = useState<SoilState>({ ...MOCK_DASHBOARD_DATA.soil.current });
  const [water, setWater] = useState<WaterState>({ ...MOCK_DASHBOARD_DATA.water.current });
  const [dashboardSummary, setDashboardSummary] = useState<DashboardResumoResponse | null>(null);
  const [dashboardAreas, setDashboardAreas] = useState<AreaMonitoradaResponse[]>([]);
  const [selectedArea, setSelectedArea] = useState<DashboardAreaResumoResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const [selectedWaterSeg, setSelectedWaterSeg] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [pageTimeFilter, setPageTimeFilter] = useState<TimeFilter>("daily");

  const alertTypeOptions = useMemo(() => [...new Set(alerts.map((a) => a.type))], [alerts]);
  const soilSectorOptions = useMemo(
    () => MOCK_DASHBOARD_DATA.soil.sectors.map((s) => s.sector),
    [],
  );
  const growthCropOptions = useMemo(
    () => MOCK_DASHBOARD_DATA.crops.map((c) => ({ id: c.id, label: c.name })),
    [],
  );

  const reloadDashboard = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    setLoadStatus("loading");
    setLoadError(null);

    try {
      const data = await fetchDashboardData();
      if (requestId !== loadRequestRef.current) return;

      setDashboardSummary(data.summary);
      setDashboardAreas(data.areas);
      setSelectedArea(data.selectedArea);
      setAlerts(data.alerts);
      setClimate(data.climate);
      setClimateHistory(data.climateHistory);
      setSoil(data.soil);
      setWater(data.water);
      setLoadStatus("success");
    } catch (err) {
      if (requestId !== loadRequestRef.current) return;
      setLoadError(toDashboardLoadError(err));
      setLoadStatus("error");
    }
  }, []);

  const login = useCallback(() => {
    saveAuthSession();
    setIsAuthenticated(true);
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
      saveAuthSession();
      setIsAuthenticated(true);
    },
    [registerCredentials],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setIsAuthenticated(false);
    setLoadStatus("idle");
    setLoadError(null);
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
    setSelectedNutrient(null);
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
      authMode,
      setAuthMode,
      login,
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
      appliedFilters,
      draftFilters,
      setDraftFilters,
      isFilterOpen,
      selectedNutrient,
      setSelectedNutrient,
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
      authMode,
      setAuthMode,
      login,
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
      appliedFilters,
      draftFilters,
      isFilterOpen,
      selectedNutrient,
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

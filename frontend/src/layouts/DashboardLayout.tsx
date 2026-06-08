import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import authBackground from "@/assets/images/login/background6.jpeg";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
import {
  DashboardErrorState,
  DashboardLoadingState,
} from "@/components/dashboard/DashboardLoadState";
import { FilterSlideover } from "@/components/dashboard/FilterSlideover";
import { AssistantHistorySlideover } from "@/components/dashboard/AssistantHistorySlideover";
import { LoginScreen } from "@/components/dashboard/LoginScreen";
import { RegisterCompanyScreen } from "@/components/dashboard/RegisterCompanyScreen";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PageToolbar } from "@/components/dashboard/ui";
import {
  breadcrumbsFromPath,
  contentPad,
  dashboardContentShell,
  pathToViewId,
  resolvePageTimeFilter,
  shellBg,
} from "@/constants/dashboard";
import { AssistantChatProvider } from "@/context/AssistantChatContext";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

function DashboardShell() {
  const location = useLocation();
  const authScrollRef = useRef<HTMLDivElement>(null);
  const {
    isAuthenticated,
    authMode,
    setAuthMode,
    login,
    submitRegisterStep1,
    backFromRegisterCompany,
    completeRegistration,
    registerCompanyDraft,
    logout,
    loadStatus,
    loadError,
    reloadDashboard,
    draftFilters,
    setDraftFilters,
    isFilterOpen,
    closeFilters,
    applyFilters,
    clearDraftFilters,
    openFilters,
    activeFilterCount,
    alertTypeOptions,
    soilSectorOptions,
    growthCropOptions,
    preferences,
    pageTimeFilter,
    setPageTimeFilter,
    company,
  } = useDashboard();

  const view = pathToViewId(location.pathname);
  const timeFilter = resolvePageTimeFilter(view, location.pathname, pageTimeFilter);
  const breadcrumbs = breadcrumbsFromPath(location.pathname);
  const isAssistant = view === "assistant";

  useEffect(() => {
    if (isAuthenticated) return;
    authScrollRef.current?.scrollTo(0, 0);
  }, [isAuthenticated, location.pathname, authMode]);

  const rootClass = [
    "dashboard-root flex h-full min-h-0 w-full overflow-hidden",
    shellBg,
    preferences.darkMode ? "dark" : "",
    preferences.reducedMotion ? "dashboard-reduced-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!isAuthenticated) {
    const authScreen =
      authMode === "registerCompany" ? (
        <RegisterCompanyScreen
          initialCompany={registerCompanyDraft}
          onBack={backFromRegisterCompany}
          onSubmit={completeRegistration}
        />
      ) : (
        <LoginScreen
          mode={authMode === "register" ? "register" : "login"}
          onModeChange={setAuthMode}
          onLogin={login}
          onRegisterStep1={submitRegisterStep1}
        />
      );

    return (
      <div
        ref={authScrollRef}
        data-auth-scroll
        className="relative h-full min-h-0 overflow-y-auto overscroll-y-contain"
      >
        <div
          className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${authBackground})` }}
          aria-hidden
        />
        <div className="pointer-events-none fixed inset-0 bg-preto-suave/35" aria-hidden />
        <div className="relative flex min-h-full w-full items-center justify-center px-4 py-10 sm:py-12">
          {authScreen}
        </div>
      </div>
    );
  }

  const showLoading = loadStatus === "loading" || loadStatus === "idle";
  const showError = loadStatus === "error" && loadError;

  const mainContent = (
    <>
      {breadcrumbs.length > 0 && <DashboardBreadcrumb items={breadcrumbs} />}
      <PageToolbar
        view={view}
        timeFilter={timeFilter}
        pathname={location.pathname}
        activeFilterCount={activeFilterCount(view, timeFilter)}
        onOpenFilters={openFilters}
        onPeriodChange={setPageTimeFilter}
      />
      {showLoading && <DashboardLoadingState />}
      {showError && (
        <DashboardErrorState
          error={loadError}
          onRetry={() => void reloadDashboard()}
          onLogout={loadError.kind === "unauthorized" ? logout : undefined}
        />
      )}
      {loadStatus === "success" && <Outlet />}
    </>
  );

  return (
    <div className={rootClass}>
      <Sidebar />

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain ${shellBg}`}
        role="main"
      >
        <div className={`${dashboardContentShell} py-5 sm:py-7 ${contentPad}`}>
          {isAssistant ? (
            <AssistantChatProvider farmName={company.farmName || "sua fazenda"}>
              {mainContent}
              <AssistantHistorySlideover />
            </AssistantChatProvider>
          ) : (
            mainContent
          )}
        </div>
      </div>

      <FilterSlideover
        open={isFilterOpen}
        view={view}
        timeFilter={timeFilter}
        draft={draftFilters}
        alertTypes={alertTypeOptions}
        soilSectors={soilSectorOptions}
        growthCrops={growthCropOptions}
        onClose={closeFilters}
        onDraftChange={setDraftFilters}
        onApply={applyFilters}
        onClear={() => clearDraftFilters(view, timeFilter)}
      />
    </div>
  );
}

export function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  );
}

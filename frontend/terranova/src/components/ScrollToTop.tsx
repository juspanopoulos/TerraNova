import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document
      .querySelector<HTMLElement>(".dashboard-root [role='main']")
      ?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document
    .querySelector<HTMLElement>(".dashboard-root [role='main']")
    ?.scrollTo(0, 0);

  document.querySelectorAll<HTMLElement>("[data-auth-scroll]").forEach((el) => {
    el.scrollTo(0, 0);
  });
}

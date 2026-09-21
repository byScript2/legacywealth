export function initReveal(): void {
  const root = document.documentElement;
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    root.classList.add("is-ready");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  targets.forEach((el) => observer.observe(el));

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-ready")));
}

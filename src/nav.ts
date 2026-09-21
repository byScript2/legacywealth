export function initNav(): void {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("#nav a"));
  const year = document.getElementById("year");
  const privacy = document.getElementById("privacy") as HTMLDetailsElement | null;

  if (year) year.textContent = String(new Date().getFullYear());

  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.getAttribute("href") ?? ""))
    .filter((el): el is HTMLElement => el !== null);

  const update = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    const probe = window.scrollY + 140;
    let current: HTMLElement | null = null;
    for (const section of sections) {
      if (section.offsetTop <= probe && probe < section.offsetTop + section.offsetHeight) current = section;
    }
    links.forEach((link) => {
      link.classList.toggle("is-current", current !== null && link.getAttribute("href") === `#${current.id}`);
    });
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  update();

  const setOpen = (open: boolean) => {
    header?.classList.toggle("is-open", open);
    burger?.setAttribute("aria-expanded", String(open));
  };

  burger?.addEventListener("click", () => setOpen(!header?.classList.contains("is-open")));
  links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.querySelectorAll("[data-open-privacy]").forEach((link) => {
    link.addEventListener("click", () => {
      if (privacy) privacy.open = true;
    });
  });
}

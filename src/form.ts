import { WEB3FORM_KEY } from "../config";

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 15000;

type Check = (value: string) => string | null;

const textChecks: Record<string, Check> = {
  name: (v) => (v.trim().length >= 2 ? null : "Please enter your full name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Please enter a valid email address."),
  whatsapp: (v) =>
    /^\+?\d{7,15}$/.test(v.replace(/[\s\-().]/g, ""))
      ? null
      : "Please enter a valid number, including your country code.",
  location: (v) => (v.trim().length >= 2 ? null : "Please tell us where you're based."),
};

const radioMessages: Record<string, string> = {
  interest: "Please choose what you're most interested in.",
  experience: "Please choose the option that fits you best.",
  goal: "Please choose your main goal.",
};

export function initForm(): void {
  const form = document.getElementById("joinForm") as HTMLFormElement | null;
  if (!form) return;

  const steps = Array.from(form.querySelectorAll<HTMLElement>(".step"));
  const progress = Array.from(form.querySelectorAll<HTMLElement>("#progress li"));
  const alertBox = document.getElementById("formAlert") as HTMLElement;
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
  const submitLabel = submitBtn.querySelector<HTMLElement>("[data-label]") as HTMLElement;
  const card = form.closest<HTMLElement>(".formcard");
  let current = 1;

  const input = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]`);
  const errorEl = (name: string) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  const setError = (name: string, message: string | null) => {
    const el = errorEl(name);
    if (!el) return;
    el.textContent = message ?? "";
    el.classList.toggle("is-visible", message !== null);
    el.parentElement?.classList.toggle("is-invalid", message !== null);
    const field = input(name);
    if (field && field.type !== "radio" && field.type !== "checkbox") {
      field.setAttribute("aria-invalid", String(message !== null));
      if (message) {
        el.id = `err-${name}`;
        field.setAttribute("aria-describedby", el.id);
      } else {
        field.removeAttribute("aria-describedby");
      }
    }
  };

  const showStep = (n: number) => {
    current = n;
    steps.forEach((step) => {
      step.hidden = step.dataset.step !== String(n);
    });
    progress.forEach((item) => {
      const p = Number(item.dataset.p);
      item.classList.toggle("is-done", p < n || n === 3);
      item.classList.toggle("is-active", p === n && n !== 3);
    });
    const active = steps.find((step) => step.dataset.step === String(n));
    active?.querySelector<HTMLElement>(".step__title")?.focus({ preventScroll: true });
    if (card) {
      const top = card.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight * 0.6) card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateDetails = (): boolean => {
    let firstInvalid: HTMLInputElement | null = null;
    for (const name of Object.keys(textChecks)) {
      const field = input(name);
      if (!field) continue;
      const message = textChecks[name](field.value);
      setError(name, message);
      if (message && !firstInvalid) firstInvalid = field;
    }
    firstInvalid?.focus();
    return firstInvalid === null;
  };

  const validateQuestions = (): boolean => {
    let firstInvalid: HTMLInputElement | null = null;
    for (const name of Object.keys(radioMessages)) {
      const chosen = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
      setError(name, chosen ? null : radioMessages[name]);
      if (!chosen && !firstInvalid) firstInvalid = input(name);
    }
    const consent = input("consent");
    const consented = consent?.checked ?? false;
    setError("consent", consented ? null : "Please tick the box to continue.");
    if (!consented && !firstInvalid) firstInvalid = consent;
    firstInvalid?.focus();
    return firstInvalid === null;
  };

  const setBusy = (busy: boolean) => {
    submitBtn.disabled = busy;
    submitLabel.textContent = busy ? "Sending..." : "Submit and continue";
  };

  const send = async () => {
    if (!WEB3FORM_KEY) throw new Error("Missing Web3Forms access key");
    const payload: Record<string, string> = { access_key: WEB3FORM_KEY };
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") payload[key] = value.trim();
    });

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !data.success) throw new Error(data.message ?? "Submission failed");
    } finally {
      window.clearTimeout(timer);
    }
  };

  form.querySelector("[data-next]")?.addEventListener("click", () => {
    if (validateDetails()) showStep(2);
  });

  form.querySelector("[data-back]")?.addEventListener("click", () => {
    alertBox.hidden = true;
    showStep(1);
  });

  form.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name) setError(target.name, null);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (current === 1) {
      if (validateDetails()) showStep(2);
      return;
    }
    if (current !== 2 || submitBtn.disabled) return;
    if (!validateQuestions()) return;

    alertBox.hidden = true;
    setBusy(true);
    try {
      await send();
      showStep(3);
    } catch {
      alertBox.hidden = false;
    } finally {
      setBusy(false);
    }
  });
}

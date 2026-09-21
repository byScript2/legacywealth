import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/form.css";
import "./styles/motion.css";
import { initReveal } from "./reveal";
import { initNav } from "./nav";
import { initVideo } from "./video";
import { initForm } from "./form";

initReveal();
initNav();
initVideo();
initForm();

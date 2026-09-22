import { defineConfig, type Plugin } from "vite";
import * as cfg from "./config";

const tokens: Record<string, string> = {
  BRAND_NAME: cfg.BRAND_NAME,
  TUTOR_NAME: cfg.TUTOR_NAME,
  EMAIL: cfg.EMAIL,
  TEL: cfg.TEL,
  TEL_HREF: cfg.TEL.replace(/\s/g, ""),
  TEL_2: cfg.TEL_2,
  TEL_2_HREF: cfg.TEL_2.replace(/\s/g, ""),
  WEB_LINK: cfg.WEB_LINK,
  WHATSAPP_LINK: cfg.WHATSAPP_GROUP_LINK.replace(/&/g, "&amp;"),
  INSTAGRAM_LINK: cfg.INSTAGRAM_LINK,
};

const injectConfig = (): Plugin => ({
  name: "inject-config",
  transformIndexHtml: {
    order: "pre",
    handler: (html) =>
      html.replace(/\{\{(\w+)\}\}/g, (match, key: string) => tokens[key] ?? match),
  },
});

export default defineConfig({
  plugins: [injectConfig()],
  build: {
    target: "es2019",
    cssTarget: "safari13",
    assetsInlineLimit: 0,
  },
});

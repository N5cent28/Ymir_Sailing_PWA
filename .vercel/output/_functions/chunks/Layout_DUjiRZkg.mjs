import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, d as renderSlot, e as renderScript, f as renderTemplate } from './astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                   */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Ymir Sailing Club - Reykjavik, Iceland", lang = "en" } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- PWA Meta Tags --><meta name="theme-color" content="#059669"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Ymir Sailing"><link rel="apple-touch-icon" href="/icon-192.svg"><!-- Manifest --><link rel="manifest" href="/manifest.json"><title>${title}</title>${renderHead()}</head> <body class="bg-sail-white"> ${renderSlot($$result, $$slots["default"])} <!-- Service Worker Registration --> ${renderScript($$result, "/Users/noahnicol/Desktop/ymir-sailing-club/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };

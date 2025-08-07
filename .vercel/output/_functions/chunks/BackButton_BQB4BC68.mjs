import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, e as renderScript, f as renderTemplate } from './astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$BackButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BackButton;
  const {
    href = null,
    label = "Back",
    variant = "general"
  } = Astro2.props;
  let backHref = href;
  if (!backHref) {
    switch (variant) {
      case "admin":
        backHref = "/en/admin-dashboard";
        break;
      case "profile":
        backHref = "/en/";
        break;
      default:
        backHref = "/en/";
    }
  }
  return renderTemplate`${maybeRenderHead()}<button onclick="goBack()" class="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"${addAttribute(backHref, "data-back-href")}> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> ${label} </button> ${renderScript($$result, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/BackButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/BackButton.astro", void 0);

export { $$BackButton as $ };

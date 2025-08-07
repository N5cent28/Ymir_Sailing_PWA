/* empty css                                           */
import { c as createComponent, a as createAstro } from '../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("/en/");
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/index.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

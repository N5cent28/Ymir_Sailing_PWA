/* empty css                                              */
import { c as createComponent, a as createAstro } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$AdminLogin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLogin;
  return Astro2.redirect("/en/admin-login");
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/admin-login.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/admin-login.astro";
const $$url = "/is/admin-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$AdminLogin,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

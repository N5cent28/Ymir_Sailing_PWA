/* empty css                                           */
import { c as createComponent, r as renderHead, f as renderTemplate } from '../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Test = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Test Page</title>${renderHead()}</head> <body> <h1>Test Page</h1> <p>This is a simple test page without any database connections.</p> <p>If this works, the issue is with the database imports.</p> </body></html>`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/test.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/test.astro";
const $$url = "/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Test,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

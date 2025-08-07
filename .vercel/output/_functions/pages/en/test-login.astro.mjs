/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
export { renderers } from '../../renderers.mjs';

const $$TestLogin = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Test Login - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-md mx-auto mt-10 p-6"> <h1 class="text-2xl font-bold mb-6">Test Member Login</h1> <form id="testForm" class="space-y-4"> <div> <label for="memberNumber" class="block text-sm font-medium mb-2">Member Number</label> <input type="text" id="memberNumber" value="1001" class="w-full px-3 py-2 border rounded"> </div> <div> <label for="pin" class="block text-sm font-medium mb-2">PIN</label> <input type="password" id="pin" value="111" class="w-full px-3 py-2 border rounded"> </div> <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
Test Login
</button> </form> <div id="results" class="mt-6 p-4 bg-gray-100 rounded hidden"> <h3 class="font-bold mb-2">Results:</h3> <pre id="output" class="text-sm"></pre> </div> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/test-login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/test-login.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/test-login.astro";
const $$url = "/en/test-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestLogin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

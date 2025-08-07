/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
export { renderers } from '../../renderers.mjs';

const $$AdminTest = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Test - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <section class="py-16 bg-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-3xl font-bold text-ocean-blue mb-6">Admin Test Page</h1> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-xl font-bold mb-4">Admin Login Test</h2> <form id="adminTestForm" class="space-y-4"> <div> <label for="memberNumber" class="block text-sm font-medium text-gray-700 mb-2">
Member Number
</label> <input type="text" id="memberNumber" name="memberNumber" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="Enter your member number"> </div> <div> <label for="pin" class="block text-sm font-medium text-gray-700 mb-2">
3-Digit PIN
</label> <input type="password" id="pin" name="pin" required maxlength="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="Enter your 3-digit PIN"> </div> <button type="submit" class="w-full px-6 py-3 bg-ocean-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
Test Admin Login
</button> </form> <div id="result" class="mt-6 p-4 rounded-lg hidden"></div> <div class="mt-6"> <h3 class="font-semibold mb-2">Test Credentials:</h3> <ul class="text-sm space-y-1"> <li>• Noah Nicol: Member #1234, PIN: 123</li> <li>• Steve: Member #5678, PIN: 456</li> </ul> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-test.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-test.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-test.astro";
const $$url = "/en/admin-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

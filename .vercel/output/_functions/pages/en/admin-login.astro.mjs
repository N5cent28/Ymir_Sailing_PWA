/* empty css                                              */
import { c as createComponent, a as createAstro, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { $ as $$BackButton } from '../../chunks/BackButton_BQB4BC68.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$AdminLogin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLogin;
  const url = new URL(Astro2.request.url);
  url.searchParams.get("returnUrl") || "/en/admin-dashboard";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Login - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-blue to-blue-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Back Button --> <div class="mb-6"> ${renderComponent($$result2, "BackButton", $$BackButton, { "variant": "general", "label": "Back to Info" })} </div> <div class="text-center"> <h1 class="text-5xl font-bold mb-6">
Admin Login
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Access the admin dashboard with your member credentials.
</p> </div> </div> </section> <!-- Login Form --> <section class="py-16 bg-white"> <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8"> <div class="bg-sail-white rounded-lg p-8 shadow-lg"> <h2 class="text-2xl font-bold text-ocean-blue mb-6 text-center">Admin Authentication</h2> <form id="adminLoginForm" class="space-y-6"> <div> <label for="memberNumber" class="block text-sm font-medium text-gray-700 mb-2">
Member Number
</label> <input type="text" id="memberNumber" name="memberNumber" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent" placeholder="Enter your member number"> </div> <div> <label for="pin" class="block text-sm font-medium text-gray-700 mb-2">
3-Digit PIN
</label> <input type="password" id="pin" name="pin" required maxlength="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-transparent" placeholder="Enter your 3-digit PIN"> </div> <button type="submit" class="w-full px-6 py-3 bg-ocean-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
Login to Admin Panel
</button> </form> <!-- Success/Error Messages --> <div id="message" class="mt-4 p-3 rounded-lg hidden"></div> <div class="mt-6 text-center"> <p class="text-sm text-gray-600">
Only authorized administrators can access this area.
</p> <p class="text-xs text-gray-500 mt-2">
Contact the club administrator if you need access.
</p> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-login.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-login.astro";
const $$url = "/en/admin-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminLogin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

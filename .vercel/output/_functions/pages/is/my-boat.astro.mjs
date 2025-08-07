/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { $ as $$MaintenanceModal } from '../../chunks/MaintenanceModal_kFKxdpsI.mjs';
export { renderers } from '../../renderers.mjs';

const $$MyBoat = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "M\xEDn Virki B\xE1tur - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "is" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Mín Virki Bátur
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Skráðu þig inn á bátinn þinn með meðlimsnúmeri. Engin QR-kóði þarf!
</p> </div> </section> <!-- Member Lookup Section --> <section class="py-16 bg-white"> <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Finndu Virka Bátinn</h2> <!-- Member Number Input --> <div class="mb-6"> <label for="memberNumber" class="block text-sm font-medium text-anchor-gray mb-2">
Meðlimsnúmer
</label> <div class="flex gap-2"> <input type="text" id="memberNumber" placeholder="Sláðu inn meðlimsnúmerið þitt" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> <button id="findBoat" class="px-6 py-3 bg-ocean-green text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
Finna Bát
</button> </div> </div> <!-- Loading State --> <div id="loading" class="hidden text-center py-8"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-green mx-auto mb-4"></div> <p class="text-anchor-gray">Leita að virka bátnum þínum...</p> </div> <!-- Active Boat Display --> <div id="activeBoat" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"> <h3 class="text-lg font-semibold text-green-900 mb-4">Virkur Báturinn Þinn</h3> <div id="boatInfo" class="space-y-3 mb-6"> <!-- Boat information will be populated here --> </div> <!-- Action Buttons --> <div class="flex gap-3 mb-6"> <button id="checkInButton" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
✅ Skrá Inn Núna
</button> <button onclick="openMaintenanceModalFromMyBoat()" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
🔧 Skrá Viðhaldsvandamál
</button> </div> </div> </div> <!-- No Active Boat --> <div id="noActiveBoat" class="hidden"> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"> <div class="text-4xl mb-4">🚤</div> <h3 class="text-lg font-semibold text-blue-900 mb-2">Enginn Virkur Bátur Fannst</h3> <p class="text-blue-800 mb-4">
Það lítur út fyrir að þú hafir enga báta í notkun! Ef þú vilt fara að sigla, farðu yfir í báta svæðið til að fá bát.
</p> <div class="space-y-3"> <a href="/is/qr-codes" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
Skoða Alla Báta
</a> <div class="text-sm text-blue-600"> <p>Þarftu hjálp? Hafðu samband við skrifstofuna.</p> </div> </div> </div> </div> <!-- Error Message --> <div id="error" class="hidden"> <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"> <div class="text-4xl mb-4">❌</div> <h3 class="text-lg font-semibold text-red-900 mb-2">Villa</h3> <p id="errorMessage" class="text-red-800">
Villa kom upp. Vinsamlegast reyndu aftur.
</p> </div> </div> <!-- Success Message --> <div id="success" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center"> <div class="text-4xl mb-4">✅</div> <h3 class="text-lg font-semibold text-green-900 mb-2">Tókst að Skrá Inn!</h3> <p class="text-green-800 mb-4">
Báturinn þinn hefur verið skráður inn með góðum árangri. Takk fyrir að nota Siglingafélagið Ýmir!
</p> <a href="/is" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
Aftur á Forsíðu
</a> </div> </div> </div> </div> </section> ${renderComponent($$result2, "MaintenanceModal", $$MaintenanceModal, {})} ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/my-boat.astro?astro&type=script&index=0&lang.ts")} </main> ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/my-boat.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/my-boat.astro";
const $$url = "/is/my-boat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MyBoat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

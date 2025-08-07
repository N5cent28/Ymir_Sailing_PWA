/* empty css                                              */
import { c as createComponent, a as createAstro, g as renderComponent, f as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$QrCodes = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$QrCodes;
  const boats = [
    // Individual Boats (one user at a time)
    { id: "boat-1", name: "Quest 1", url: "/qr/boat-1", type: "individual" },
    { id: "boat-2", name: "Quest 2", url: "/qr/boat-2", type: "individual" },
    { id: "boat-3", name: "Zest 1", url: "/qr/boat-3", type: "individual" },
    { id: "boat-4", name: "Zest 2", url: "/qr/boat-4", type: "individual" },
    { id: "boat-5", name: "Zest 3", url: "/qr/boat-5", type: "individual" },
    { id: "boat-6", name: "Zest 4", url: "/qr/boat-6", type: "individual" },
    { id: "boat-7", name: "Zest 5", url: "/qr/boat-7", type: "individual" },
    { id: "boat-8", name: "Zest 6", url: "/qr/boat-8", type: "individual" },
    { id: "boat-9", name: "Topaz 1", url: "/qr/boat-9", type: "individual" },
    { id: "boat-10", name: "Topaz 2", url: "/qr/boat-10", type: "individual" },
    { id: "boat-11", name: "Laser 1", url: "/qr/boat-11", type: "individual" },
    { id: "boat-12", name: "Laser 2", url: "/qr/boat-12", type: "individual" },
    { id: "boat-13", name: "Laser 3", url: "/qr/boat-13", type: "individual" },
    { id: "boat-14", name: "Laser 4", url: "/qr/boat-14", type: "individual" },
    // Shared Boats (multiple users can use simultaneously)
    { id: "kayak", name: "Kayak", url: "/qr/kayak", type: "shared" },
    { id: "paddle-board", name: "Paddle Board", url: "/qr/paddle-board", type: "shared" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "QR-k\xF3\xF0astj\xF3rnun - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "is" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
QR-kóðastjórnun
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Búðu til og stjórnaðu QR-kóðum fyrir bátaútgáfu. Prentaðu þessa kóða og festu þá á bátana.
</p> </div> </section> <!-- QR Codes Section --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Individual Boats Section --> <div class="mb-12"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Einstaklingsbátar</h2> <p class="text-anchor-gray mb-6">Einn notandi í einu - hver bátur getur aðeins verið útpantaður af einum manni</p> <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${boats.filter((boat) => boat.type === "individual").map((boat) => renderTemplate`<div class="bg-sail-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500"> <div class="text-center mb-4"> <h3 class="text-lg font-bold text-ocean-green mb-2">${boat.name}</h3> <p class="text-sm text-anchor-gray">ID: ${boat.id}</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
Einstaklingur
</span> </div> <!-- QR Code Placeholder --> <div class="bg-gray-200 w-40 h-40 mx-auto mb-4 rounded-lg flex items-center justify-center"> <div class="text-center text-gray-500"> <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2zm-4 0h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2z"></path> </svg> <p class="text-xs">QR-kóði</p> </div> </div> <div class="space-y-2"> <p class="text-xs text-gray-500 break-all">
URL: ${Astro2.url.origin}${boat.url} </p> <div class="flex space-x-2"> <button${addAttribute(`window.open('${Astro2.url.origin}${boat.url}', '_blank')`, "onclick")} class="flex-1 bg-ocean-green text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
Prófa
</button> <button${addAttribute(`navigator.clipboard.writeText('${Astro2.url.origin}${boat.url}')`, "onclick")} class="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
Afrita URL
</button> </div> </div> </div>`)} </div> </div> <!-- Shared Boats Section --> <div class="mb-12"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Hlutiðbátar</h2> <p class="text-anchor-gray mb-6">Margir notendur geta notað samtímis - engin þörf á að bíða eftir að aðrir skili</p> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${boats.filter((boat) => boat.type === "shared").map((boat) => renderTemplate`<div class="bg-sail-white rounded-lg p-6 shadow-lg border-l-4 border-green-500"> <div class="text-center mb-4"> <h3 class="text-lg font-bold text-ocean-green mb-2">${boat.name}</h3> <p class="text-sm text-anchor-gray">ID: ${boat.id}</p> <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
Hlutið
</span> </div> <!-- QR Code Placeholder --> <div class="bg-gray-200 w-40 h-40 mx-auto mb-4 rounded-lg flex items-center justify-center"> <div class="text-center text-gray-500"> <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2zm-4 0h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2z"></path> </svg> <p class="text-xs">QR-kóði</p> </div> </div> <div class="space-y-2"> <p class="text-xs text-gray-500 break-all">
URL: ${Astro2.url.origin}${boat.url} </p> <div class="flex space-x-2"> <button${addAttribute(`window.open('${Astro2.url.origin}${boat.url}', '_blank')`, "onclick")} class="flex-1 bg-ocean-green text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
Prófa
</button> <button${addAttribute(`navigator.clipboard.writeText('${Astro2.url.origin}${boat.url}')`, "onclick")} class="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
Afrita URL
</button> </div> </div> </div>`)} </div> </div> <!-- Instructions --> <div class="mt-12 bg-blue-50 rounded-lg p-6"> <h3 class="text-lg font-semibold text-blue-900 mb-4">Hvernig á að búa til QR-kóða:</h3> <ol class="list-decimal list-inside space-y-2 text-blue-800"> <li>Afritaðu URL fyrir hvern bát með "Afrita URL" takkanum</li> <li>Heimsæktu QR-kóðagjafa eins og <a href="https://qr-code-generator.com" target="_blank" class="underline">qr-code-generator.com</a></li> <li>Límdu báta-URL og búðu til QR-kóðann</li> <li>Sæktu QR-kóðamyndina</li> <li>Prentaðu og lómineraðu QR-kóðann</li> <li>Festu QR-kóðann á viðkomandi bát</li> </ol> </div> </div> </section> </main> ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/qr-codes.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/qr-codes.astro";
const $$url = "/is/qr-codes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QrCodes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

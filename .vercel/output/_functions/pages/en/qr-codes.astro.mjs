/* empty css                                              */
import { c as createComponent, a as createAstro, g as renderComponent, f as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { getQRCodes } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$QrCodes = createComponent(async ($$result, $$props, $$slots) => {
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
  const qrCodes = await getQRCodes();
  const qrCodeMap = new Map(qrCodes.map((qr) => [qr.boat_id, qr]));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "QR Code Management - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
QR Code Management
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Generate and manage QR codes for boat check-ins. Print these codes and attach them to your boats.
</p> </div> </section> <!-- QR Codes Section --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Individual Boats Section --> <div class="mb-12"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Individual Boats</h2> <p class="text-anchor-gray mb-6">One user at a time - each boat can only be checked out by one person</p> <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${boats.filter((boat) => boat.type === "individual").map((boat) => renderTemplate`<div class="bg-sail-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500"> <div class="text-center mb-4"> <h3 class="text-lg font-bold text-ocean-green mb-2">${boat.name}</h3> <p class="text-sm text-anchor-gray">ID: ${boat.id}</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
Individual
</span> </div> <!-- QR Code Display --> ${qrCodeMap.has(boat.id) ? renderTemplate`<div class="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-300"> <img${addAttribute(`/uploads/qr-codes/${qrCodeMap.get(boat.id).filename}`, "src")}${addAttribute(`QR Code for ${boat.name}`, "alt")} class="w-full h-full object-contain"> </div>` : renderTemplate`<div class="bg-gray-200 w-40 h-40 mx-auto mb-4 rounded-lg flex items-center justify-center"> <div class="text-center text-gray-500"> <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2zm-4 0h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2z"></path> </svg> <p class="text-xs">No QR Code</p> <p class="text-xs text-gray-400">Upload in Admin</p> </div> </div>`} <div class="space-y-2"> <p class="text-xs text-gray-500 break-all">
URL: ${Astro2.url.origin}${boat.url} </p> <div class="flex space-x-2"> <button${addAttribute(`window.open('${Astro2.url.origin}${boat.url}', '_blank')`, "onclick")} class="flex-1 bg-ocean-green text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
Test
</button> <button${addAttribute(`navigator.clipboard.writeText('${Astro2.url.origin}${boat.url}')`, "onclick")} class="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
Copy URL
</button> </div> </div> </div>`)} </div> </div> <!-- Shared Boats Section --> <div class="mb-12"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Shared Boats</h2> <p class="text-anchor-gray mb-6">Multiple users can use simultaneously - no need to wait for others to return</p> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${boats.filter((boat) => boat.type === "shared").map((boat) => renderTemplate`<div class="bg-sail-white rounded-lg p-6 shadow-lg border-l-4 border-green-500"> <div class="text-center mb-4"> <h3 class="text-lg font-bold text-ocean-green mb-2">${boat.name}</h3> <p class="text-sm text-anchor-gray">ID: ${boat.id}</p> <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
Shared
</span> </div> <!-- QR Code Display --> ${qrCodeMap.has(boat.id) ? renderTemplate`<div class="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-300"> <img${addAttribute(`/uploads/qr-codes/${qrCodeMap.get(boat.id).filename}`, "src")}${addAttribute(`QR Code for ${boat.name}`, "alt")} class="w-full h-full object-contain"> </div>` : renderTemplate`<div class="bg-gray-200 w-40 h-40 mx-auto mb-4 rounded-lg flex items-center justify-center"> <div class="text-center text-gray-500"> <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2zm-4 0h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h-2z"></path> </svg> <p class="text-xs">No QR Code</p> <p class="text-xs text-gray-400">Upload in Admin</p> </div> </div>`} <div class="space-y-2"> <p class="text-xs text-gray-500 break-all">
URL: ${Astro2.url.origin}${boat.url} </p> <div class="flex space-x-2"> <button${addAttribute(`window.open('${Astro2.url.origin}${boat.url}', '_blank')`, "onclick")} class="flex-1 bg-ocean-green text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
Test
</button> <button${addAttribute(`navigator.clipboard.writeText('${Astro2.url.origin}${boat.url}')`, "onclick")} class="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
Copy URL
</button> </div> </div> </div>`)} </div> </div> <!-- Instructions --> <div class="mt-12 bg-blue-50 rounded-lg p-6"> <h3 class="text-lg font-semibold text-blue-900 mb-4">QR Code Management:</h3> <div class="grid md:grid-cols-2 gap-6"> <div> <h4 class="font-semibold text-blue-800 mb-2">For Admins:</h4> <ol class="list-decimal list-inside space-y-2 text-blue-800"> <li>Go to <a href="/en/admin-qr-codes" class="underline font-semibold">Admin QR Code Management</a></li> <li>Upload QR code images for each boat</li> <li>QR codes will automatically appear on this page</li> <li>Test each QR code to ensure it works correctly</li> </ol> </div> <div> <h4 class="font-semibold text-blue-800 mb-2">For Members:</h4> <ol class="list-decimal list-inside space-y-2 text-blue-800"> <li>Scan the QR code on any boat</li> <li>Or use the "Find My Boat" feature with your member number</li> <li>Follow the check-out process</li> <li>Return the boat using the same QR code or member number</li> </ol> </div> </div> </div> </div> </section> </main> ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/qr-codes.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/qr-codes.astro";
const $$url = "/en/qr-codes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QrCodes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

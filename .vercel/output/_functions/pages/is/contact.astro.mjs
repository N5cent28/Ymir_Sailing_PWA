/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
export { renderers } from '../../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hafa Samband - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "is" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Hafa Samband
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Hafðu samband við Siglingafélagið Ýmir. Við erum hér til að hjálpa þér að byrja siglingaferðina.
</p> </div> </section> <!-- Contact Information --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid md:grid-cols-2 gap-12"> <!-- Contact Form --> <div> <h2 class="text-3xl font-bold mb-8">Sendu okkur skilaboð</h2> <form class="space-y-6"> <div class="grid md:grid-cols-2 gap-6"> <div> <label for="firstName" class="block text-sm font-medium text-anchor-gray mb-2">
Fornafn
</label> <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> </div> <div> <label for="lastName" class="block text-sm font-medium text-anchor-gray mb-2">
Eftirnafn
</label> <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> </div> </div> <div> <label for="email" class="block text-sm font-medium text-anchor-gray mb-2">
Netfang
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> </div> <div> <label for="phone" class="block text-sm font-medium text-anchor-gray mb-2">
Símanúmer
</label> <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> </div> <div> <label for="subject" class="block text-sm font-medium text-anchor-gray mb-2">
Efni
</label> <select id="subject" name="subject" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> <option value="">Veldu efni</option> <option value="membership">Félagsaðild</option> <option value="courses">Upplýsingar um námskeið</option> <option value="tourist">Pöntun ferðamannanámskeiðs</option> <option value="general">Almenn spurning</option> </select> </div> <div> <label for="message" class="block text-sm font-medium text-anchor-gray mb-2">
Skilaboð
</label> <textarea id="message" name="message" rows="6" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green" placeholder="Segðu okkur meira um fyrirspurnina..."></textarea> </div> <button type="submit" class="btn-primary w-full">
Senda Skilaboð
</button> </form> </div> <!-- Contact Information --> <div> <h2 class="text-3xl font-bold mb-8">Hafðu samband</h2> <div class="space-y-8"> <div class="flex items-start"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold mb-2">Heimilisfang</h3> <p class="text-anchor-gray">
Naustavör 14<br>
200 Kópavogur<br>
Ísland
</p> <div class="mt-2"> <a href="https://www.google.com/maps/dir//Naustav%C3%B6r+14,+200+K%C3%B3pavogur/@64.11513,-22.0070426,11783m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x48d60b00083220b1:0xd5ba3ada08e972b6!2m2!1d-21.9246432!2d64.1151533?entry=ttu" target="_blank" class="inline-flex items-center text-ocean-green hover:text-green-700 transition-colors text-sm"> <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path> </svg>
Skoða á Google Maps
</a> </div> </div> </div> <div class="flex items-start"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold mb-2">Fyrirtækjaupplýsingar</h3> <p class="text-anchor-gray">
Kennitala: 470576-0659<br>
Reikningsnúmer: 536-26-6634
</p> </div> </div> <div class="flex items-start"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold mb-2">Netfang</h3> <p class="text-anchor-gray"> <a href="mailto:info@siglingafelag.is" class="hover:text-ocean-green transition-colors">
info@siglingafelag.is
</a> </p> </div> </div> <div class="flex items-start"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold mb-2">Sími</h3> <p class="text-anchor-gray"> <a href="tel:+3541234567" class="hover:text-ocean-green transition-colors">
+354 123 4567
</a> </p> </div> </div> <div class="flex items-start"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold mb-2">Opnunartími</h3> <p class="text-anchor-gray">
Mánudaga - Föstudaga: 9:00 - 17:00<br>
Laugardaga: 10:00 - 15:00<br>
Sunnudaga: Lokað
</p> </div> </div> </div> </div> </div> </div> </section> </main> ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/contact.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/contact.astro";
const $$url = "/is/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

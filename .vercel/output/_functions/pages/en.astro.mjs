/* empty css                                           */
import { c as createComponent, a as createAstro, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../chunks/Navigation_BSm99MnS.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  if (url.pathname === "/en/") {
    return Astro2.redirect("/en");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Siglingaf\xE9lagi\xF0 \xDDmir - Reykjavik, Iceland", "lang": "en" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Welcome to Siglingafélagið Ýmir
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Experience the thrill of sailing in the beautiful waters of Reykjavik, Iceland. 
          Join our community of passionate sailors and discover the freedom of the sea.
</p> <div class="space-x-4"> <a href="/en/courses" class="btn-primary">
View Courses
</a> <a href="#membership" class="btn-secondary">
Join the Club
</a> </div> </div> </section> <!-- Features Section --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid md:grid-cols-2 gap-8"> <!-- Left Column: Learn to Sail and Safe & Secure --> <div class="space-y-8"> <a href="/en/courses" class="text-center group hover:transform hover:scale-105 transition-all duration-200 block"> <div class="bg-ocean-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2 group-hover:text-ocean-green transition-colors">Learn to Sail</h3> <p class="text-anchor-gray">Professional instruction for all skill levels, from beginners to advanced sailors.</p> </a> <a href="/qr/boat-1" class="text-center group hover:transform hover:scale-105 transition-all duration-200 block"> <div class="bg-ocean-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2 group-hover:text-ocean-green transition-colors">Safe & Secure</h3> <p class="text-anchor-gray">Our QR code system ensures safe boat check-ins and tracking for all members.</p> </a> </div> <!-- Right Column: Wind Animation Widget --> <div class="text-center"> <div class="w-full"> <iframe src="https://www.meteoblue.com/en/weather/maps/widget/reykjavik_iceland_3413829?windAnimation=1&gust=1&satellite=0&cloudsAndPrecipitation=1&temperature=1&sunshine=0&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=9&autowidth=auto" frameborder="0" scrolling="NO" allowtransparency="true" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox" style="width: 100%; height: 400px; border-radius: 8px;"></iframe> <div class="mt-2 text-xs text-gray-500"> <a href="https://www.meteoblue.com/en/weather/maps/reykjavik_iceland_3413829" target="_blank" rel="noopener">meteoblue</a> </div> </div> </div> </div> </div> </section> <!-- Membership Section --> <section id="membership" class="py-16 bg-sail-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-ocean-green mb-4">Join Our Club</h2> <p class="text-xl text-anchor-gray">
Become a member of Siglingafélagið Ýmir and join our community of passionate sailors 
            in Reykjavik, Iceland.
</p> </div> <!-- Membership Benefits --> <div class="grid md:grid-cols-3 gap-8 mb-16"> <div class="text-center"> <div class="bg-ocean-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Boat Access</h3> <p class="text-anchor-gray">Access to our fleet of well-maintained sailing boats for members.</p> </div> <div class="text-center"> <div class="bg-ocean-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Community Events</h3> <p class="text-anchor-gray">Participate in club events, races, and social gatherings.</p> </div> <div class="text-center"> <div class="bg-ocean-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Expert Training</h3> <p class="text-anchor-gray">Access to professional instructors and training programs.</p> </div> </div> <!-- Membership Types --> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-white rounded-lg p-8 shadow-lg"> <h3 class="text-2xl font-bold text-ocean-green mb-4">Individual Membership</h3> <div class="text-3xl font-bold text-ocean-green mb-4">ISK 9,000/year</div> <ul class="space-y-2 mb-6"> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
24/7 boat access for rated members
</li> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
Course discounts
</li> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
Club events access
</li> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
QR check-in system
</li> </ul> <a href="/en/contact" class="btn-primary w-full text-center">
Join Now
</a> </div> <div class="bg-white rounded-lg p-8 shadow-lg"> <h3 class="text-2xl font-bold text-ocean-green mb-4">Family Membership</h3> <div class="text-3xl font-bold text-ocean-green mb-4">ISK 25,000/year</div> <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"> <p class="text-yellow-800 text-sm"> <strong>Note:</strong> Family membership is not currently available.
</p> </div> <ul class="space-y-2 mb-6"> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
Up to 4 family members
</li> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
All individual benefits
</li> <li class="flex items-center"> <svg class="w-5 h-5 text-ocean-green mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>
Youth program discount
</li> </ul> <a href="/en/contact" class="btn-primary w-full text-center">
Join Now
</a> </div> </div> </div> </section> <!-- Contact Information Section --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-ocean-green mb-4">Contact Us</h2> <p class="text-xl text-anchor-gray">Find us in Kópavogur</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"> <div class="text-center"> <a href="https://www.google.com/maps/dir//Naustav%C3%B6r+14,+200+K%C3%B3pavogur/@64.11513,-22.0070426,11783m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x48d60b00083220b1:0xd5ba3ada08e972b6!2m2!1d-21.9246432!2d64.1151533?entry=ttu" target="_blank" class="block group hover:transform hover:scale-105 transition-all duration-200"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <h3 class="font-semibold mb-2 group-hover:text-ocean-green transition-colors">Address</h3> <p class="text-sm text-anchor-gray">
Naustavör 14<br>
200 Kópavogur
</p> </a> </div> <div class="text-center"> <a href="tel:+3541234567" class="block group hover:transform hover:scale-105 transition-all duration-200"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> </div> <h3 class="font-semibold mb-2 group-hover:text-ocean-green transition-colors">Phone</h3> <p class="text-sm text-anchor-gray">
+354 123 4567
</p> </a> </div> <div class="text-center"> <button onclick="copyEmail()" class="block group hover:transform hover:scale-105 transition-all duration-200 w-full"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <h3 class="font-semibold mb-2 group-hover:text-ocean-green transition-colors">Email</h3> <p class="text-sm text-anchor-gray">
info@siglingafelag.is
</p> </button> </div> <div class="text-center"> <div class="bg-ocean-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-semibold mb-2">Office Hours</h3> <p class="text-sm text-anchor-gray">
Mon-Fri: 9:00-17:00<br>
Sat: 10:00-15:00
</p> </div> </div> </div> </section> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/index.astro?astro&type=script&index=0&lang.ts")} </main> ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/index.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/index.astro";
const $$url = "/en";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

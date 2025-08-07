/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript, b as addAttribute } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { getAllMembers } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$FindMembers = createComponent(async ($$result, $$props, $$slots) => {
  const members = await getAllMembers();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Finna Me\xF0limi - Ymir Sailing Club", "lang": "is" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-blue to-blue-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Finna Meðlimi
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Kynntu þér samsiglara, hafðu samband við klúbbmeðlimi og sjáðu hver hefur verið úti á sjó.
</p> </div> </section> <!-- Find Members Content --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Search Section --> <div class="bg-sail-white rounded-lg p-6 shadow-lg mb-8"> <h3 class="text-xl font-bold text-ocean-blue mb-6">Leita að meðlimum</h3> <div class="flex flex-col md:flex-row gap-4"> <div class="flex-1"> <input type="text" id="memberSearch" placeholder="Leita eftir nafni (fornafn eða eftirnafn virkar)..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"> </div> <button id="clearSearch" class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold">
Hreinsa leit
</button> </div> <p class="text-sm text-gray-600 mt-2">
Leita eftir fornafni, eftirnafni eða hlutlegum samsvörunum. Niðurstöður uppfærast þegar þú skrifar.
</p> </div> <!-- Members Grid --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <div class="flex justify-between items-center mb-6"> <h3 class="text-xl font-bold text-ocean-blue">
Klúbbmeðlimir (<span id="memberCount">${members.length}</span>)
</h3> <div class="flex space-x-2"> <button id="sortByName" class="px-3 py-1 bg-ocean-blue text-white rounded text-sm hover:bg-blue-700 transition-colors">
Röða eftir nafni
</button> <button id="sortByHours" class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors">
Röða eftir klukkustundum
</button> </div> </div> <div id="membersGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${members.map((member) => renderTemplate`<div class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"> <div class="p-6"> <!-- Profile Photo/Initials --> <div class="flex items-center mb-4"> <div class="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden mr-4"${addAttribute(`avatar-${member.member_number}`, "id")}> ${member.profile_picture ? renderTemplate`<img${addAttribute(member.profile_picture, "src")} alt="Profile photo" class="w-full h-full object-cover"${addAttribute(`photo-${member.member_number}`, "id")}>` : renderTemplate`<span>${member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}</span>`} </div> <div class="flex-1"> <h4 class="text-lg font-semibold text-gray-900"> ${member.name} ${member.is_admin && renderTemplate`<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
Stjórnandi
</span>`} </h4> </div> </div> <!-- Bio --> <div class="mb-4"> <p class="text-sm text-gray-700"> ${member.bio || "Engin l\xFDsing enn"} </p> </div> <!-- Stats --> <div class="grid grid-cols-2 gap-4 mb-4 text-center"> <div class="bg-blue-50 rounded-lg p-3"> <div class="text-lg font-bold text-blue-600"${addAttribute(`trips-${member.member_number}`, "id")}>-</div> <div class="text-xs text-blue-800">Ferðir</div> </div> <div class="bg-green-50 rounded-lg p-3"> <div class="text-lg font-bold text-green-600"${addAttribute(`hours-${member.member_number}`, "id")}>-</div> <div class="text-xs text-green-800">Klukkustundir</div> </div> </div> <!-- Message Button --> <button${addAttribute(`openMessageTo('${member.member_number}', '${member.name}')`, "onclick")} class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg>
Skilaboð
</button> </div> </div>`)} </div> <div id="noResults" class="hidden text-center py-12"> <div class="text-6xl mb-4">🔍</div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Engir meðlimir fundust</h3> <p class="text-gray-600">Prófaðu að breyta leitarorðum eða skoða alla meðlimi.</p> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/find-members.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/find-members.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/find-members.astro";
const $$url = "/is/find-members";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FindMembers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

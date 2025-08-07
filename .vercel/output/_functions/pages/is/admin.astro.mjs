/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript, b as addAttribute } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { getBoatStatus, getActiveCheckIns, getOverdueBoats, getRecentNotifications } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const boats = [
    { id: "boat-1", name: "Quest 1" },
    { id: "boat-2", name: "Quest 2" },
    { id: "boat-3", name: "Zest 1" },
    { id: "boat-4", name: "Zest 2" },
    { id: "boat-5", name: "Zest 3" }
  ];
  const boatStatuses = await Promise.all(boats.map(async (boat) => {
    const status = await getBoatStatus(boat.id);
    const activeCheckIns = await getActiveCheckIns(boat.id);
    return { ...boat, ...status, activeCheckIns };
  }));
  const overdueBoats = await getOverdueBoats();
  const notifications = await getRecentNotifications(20);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Stj\xF3rnbor\xF0 - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "is" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Stjórnborð
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Stjórnaðu bátastöðu, fylgstu eftir útgáfu og fylgstu félagsstarfi.
</p> </div> </section> <!-- Dashboard Content --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Alerts --> ${overdueBoats.length > 0 && renderTemplate`<div class="mb-8 bg-red-50 border border-red-200 rounded-lg p-6"> <h3 class="text-lg font-semibold text-red-900 mb-4">⚠️ Seinir Bátar</h3> <div class="space-y-2"> ${overdueBoats.map((boat) => renderTemplate`<div class="flex justify-between items-center bg-red-100 p-3 rounded"> <div> <span class="font-semibold">${boat.boat_name}</span> - ${boat.sailor_name} </div> <div class="text-sm text-red-700">
Væntanlegt: ${new Date(boat.expected_return).toLocaleString("is-IS")} </div> </div>`)} </div> </div>`} <!-- Boat Management --> <div class="grid lg:grid-cols-2 gap-8 mb-12"> <!-- Boat Status --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <h3 class="text-xl font-bold text-ocean-green mb-6">Bátastöða</h3> <div class="space-y-4"> ${boatStatuses.map((boat) => renderTemplate`<div class="border rounded-lg p-4"> <div class="flex justify-between items-start mb-2"> <div> <h4 class="font-semibold">${boat.name}</h4> <p class="text-sm text-gray-600">ID: ${boat.id}</p> </div> <div class="text-right"> <span${addAttribute(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${boat.status === "operational" ? "bg-green-100 text-green-800" : boat.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, "class")}> ${boat.status === "operational" ? "Tilb\xFAinn" : boat.status === "maintenance" ? "Vi\xF0hald" : "Ekki \xED notkun"} </span> </div> </div> ${boat.notes && renderTemplate`<p class="text-sm text-gray-600 mb-2">${boat.notes}</p>`} ${boat.activeCheckIns.length > 0 && renderTemplate`<div class="text-sm text-blue-600">
Núna í útgáfu hjá: ${boat.activeCheckIns[0].sailor_name} </div>`} <div class="mt-3"> <label${addAttribute(`status-${boat.id}`, "for")} class="block text-sm font-medium text-gray-700 mb-1">
Breyta stöðu
</label> <select${addAttribute(`status-${boat.id}`, "id")}${addAttribute(`updateBoatStatus('${boat.id}', this.value)`, "onchange")} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ocean-green focus:border-transparent"> <option value="operational"${addAttribute(boat.status === "operational", "selected")}>
Tilbúinn
</option> <option value="maintenance"${addAttribute(boat.status === "maintenance", "selected")}>
Viðhald
</option> <option value="out_of_service"${addAttribute(boat.status === "out_of_service", "selected")}>
Ekki í notkun
</option> </select> </div> </div>`)} </div> </div> <!-- Recent Activity --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <h3 class="text-xl font-bold text-ocean-green mb-6">Nýleg starfsemi</h3> <div class="space-y-3 max-h-96 overflow-y-auto"> ${notifications.map((notification) => renderTemplate`<div class="border-l-4 border-ocean-green pl-4 py-2"> <div class="flex justify-between items-start"> <div class="flex-1"> <p class="text-sm font-medium">${notification.message}</p> <p class="text-xs text-gray-500"> ${new Date(notification.sent_at).toLocaleString("is-IS")} </p> </div> <span${addAttribute(`px-2 py-1 rounded text-xs ${notification.type === "check_out" ? "bg-blue-100 text-blue-800" : notification.type === "check_in" ? "bg-green-100 text-green-800" : notification.type === "status_change" ? "bg-yellow-100 text-yellow-800" : notification.type === "time_extension" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`, "class")}> ${notification.type === "check_out" ? "\xFAtg\xE1fa" : notification.type === "check_in" ? "innskr\xE1ning" : notification.type === "status_change" ? "st\xF6\xF0ubreyting" : notification.type === "time_extension" ? "t\xEDmaframlenging" : notification.type} </span> </div> </div>`)} </div> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/admin.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/admin.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/is/admin.astro";
const $$url = "/is/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript, b as addAttribute } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
import { $ as $$BackButton } from '../../chunks/BackButton_CXOYdDi6.mjs';
import { getBoatStatus, getActiveCheckIns, getOverdueBoats, getRecentNotifications } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const boats = [
    { id: "boat-1", name: "Quest 1" },
    { id: "boat-2", name: "Quest 2" },
    { id: "boat-3", name: "Zest 1" },
    { id: "boat-4", name: "Zest 2" },
    { id: "boat-5", name: "Zest 3" },
    { id: "boat-6", name: "Zest 4" },
    { id: "boat-7", name: "Zest 5" },
    { id: "boat-8", name: "Zest 6" },
    { id: "boat-9", name: "Topaz 1" },
    { id: "boat-10", name: "Topaz 2" },
    { id: "boat-11", name: "Laser 1" },
    { id: "boat-12", name: "Laser 2" },
    { id: "boat-13", name: "Laser 3" },
    { id: "boat-14", name: "Laser 4" },
    { id: "kayak", name: "Kayak" },
    { id: "paddle-board", name: "Paddle Board" }
  ];
  const boatStatuses = await Promise.all(boats.map(async (boat) => {
    const status = await getBoatStatus(boat.id);
    const activeCheckIns = await getActiveCheckIns(boat.id);
    return { ...boat, ...status, activeCheckIns };
  }));
  const overdueBoats = await getOverdueBoats();
  const notifications = await getRecentNotifications(20);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Dashboard - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Back Button --> <div class="mb-6"> ${renderComponent($$result2, "BackButton", $$BackButton, { "variant": "admin", "label": "Back to Admin" })} </div> <div class="text-center"> <h1 class="text-5xl font-bold mb-6">
Admin Dashboard
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Manage boat status, track check-ins, and monitor club activity.
</p> </div> </div> </section> <!-- Dashboard Content --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Alerts --> ${overdueBoats.length > 0 && renderTemplate`<div class="mb-8 bg-red-50 border border-red-200 rounded-lg p-6"> <h3 class="text-lg font-semibold text-red-900 mb-4">⚠️ Overdue Boats</h3> <div class="space-y-2"> ${overdueBoats.map((boat) => renderTemplate`<div class="flex justify-between items-center bg-red-100 p-3 rounded"> <div> <span class="font-semibold">${boat.boat_name}</span> - ${boat.sailor_name} </div> <div class="text-sm text-red-700">
Expected: ${new Date(boat.expected_return).toLocaleString()} </div> </div>`)} </div> </div>`} <!-- Boat Management --> <div class="grid lg:grid-cols-2 gap-8 mb-12"> <!-- Boat Status --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <h3 class="text-xl font-bold text-ocean-green mb-6">Boat Status</h3> <div class="space-y-4"> ${boatStatuses.map((boat) => renderTemplate`<div class="border rounded-lg p-4"> <div class="flex justify-between items-start mb-2"> <div> <h4 class="font-semibold">${boat.name}</h4> <p class="text-sm text-gray-600">ID: ${boat.id}</p> ${boat.boat_type && renderTemplate`<p class="text-xs text-gray-500">
Type: ${boat.boat_type === "shared" ? "Shared (multiple users)" : "Individual"} </p>`} </div> <div class="text-right"> <span${addAttribute(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${boat.status === "operational" ? "bg-green-100 text-green-800" : boat.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, "class")}> ${boat.status === "operational" ? "Operational" : boat.status === "maintenance" ? "Maintenance" : "Out of Service"} </span> </div> </div> ${boat.notes && renderTemplate`<p class="text-sm text-gray-600 mb-2">${boat.notes}</p>`} ${boat.activeCheckIns.length > 0 && renderTemplate`<div class="text-sm text-blue-600"> ${boat.boat_type === "shared" ? renderTemplate`<div> <div class="font-medium mb-1">Active check-ins (${boat.activeCheckIns.length}):</div> ${boat.activeCheckIns.map((checkIn, index) => renderTemplate`<div class="text-xs ml-2 mb-1"> ${checkIn.sailor_name} - Expected back: ${new Date(checkIn.expected_return).toLocaleString()} </div>`)} </div>` : `Currently checked out by: ${boat.activeCheckIns[0].sailor_name}`} </div>`} <div class="mt-3"> <label${addAttribute(`status-${boat.id}`, "for")} class="block text-sm font-medium text-gray-700 mb-1">
Change Status
</label> <select${addAttribute(`status-${boat.id}`, "id")} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ocean-green focus:border-transparent"> <option value="operational"${addAttribute(boat.status === "operational", "selected")}>
Operational
</option> <option value="maintenance"${addAttribute(boat.status === "maintenance", "selected")}>
Maintenance
</option> <option value="out_of_service"${addAttribute(boat.status === "out_of_service", "selected")}>
Out of Service
</option> </select> </div> </div>`)} </div> </div> <!-- Recent Activity --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <h3 class="text-xl font-bold text-ocean-green mb-6">Recent Activity</h3> <div class="space-y-3 max-h-96 overflow-y-auto"> ${notifications.map((notification) => renderTemplate`<div class="border-l-4 border-ocean-green pl-4 py-2"> <div class="flex justify-between items-start"> <div class="flex-1"> <p class="text-sm font-medium">${notification.message}</p> <p class="text-xs text-gray-500"> ${new Date(notification.sent_at).toLocaleString()} </p> </div> <span${addAttribute(`px-2 py-1 rounded text-xs ${notification.type === "check_out" ? "bg-blue-100 text-blue-800" : notification.type === "check_in" ? "bg-green-100 text-green-800" : notification.type === "status_change" ? "bg-yellow-100 text-yellow-800" : notification.type === "time_extension" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`, "class")}> ${notification.type.replace("_", " ")} </span> </div> </div>`)} </div> </div> </div> <!-- Maintenance Tools --> <div class="bg-sail-white rounded-lg p-6 shadow-lg mb-8"> <h3 class="text-xl font-bold text-ocean-green mb-6">Maintenance Tools</h3> <div class="grid md:grid-cols-2 gap-6"> <!-- Message Cleanup --> <div class="border rounded-lg p-4"> <h4 class="font-semibold text-gray-900 mb-2">Message Cleanup</h4> <p class="text-sm text-gray-600 mb-4">
Remove old messages to free up storage space and improve performance.
</p> <div class="space-y-3"> <div class="flex items-center space-x-2"> <input type="number" id="cleanupDays" value="30" min="1" max="365" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"> <span class="text-sm text-gray-600">days old</span> </div> <button onclick="cleanupMessages()" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-semibold">
🧹 Clean Up Messages
</button> <div id="cleanupResult" class="text-sm hidden"></div> </div> </div> <!-- Database Stats --> <div class="border rounded-lg p-4"> <h4 class="font-semibold text-gray-900 mb-2">Database Statistics</h4> <div class="space-y-2 text-sm"> <div class="flex justify-between"> <span>Total Boats:</span> <span class="font-semibold">${boats.length}</span> </div> <div class="flex justify-between"> <span>Active Check-ins:</span> <span class="font-semibold" id="activeCheckinsCount">-</span> </div> <div class="flex justify-between"> <span>Overdue Boats:</span> <span class="font-semibold text-red-600">${overdueBoats.length}</span> </div> <div class="flex justify-between"> <span>Recent Notifications:</span> <span class="font-semibold">${notifications.length}</span> </div> </div> </div> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin.astro";
const $$url = "/en/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

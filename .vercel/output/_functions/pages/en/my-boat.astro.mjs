/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
import { $ as $$MaintenanceModal } from '../../chunks/MaintenanceModal_CAk7XX0s.mjs';
export { renderers } from '../../renderers.mjs';

const $$MyBoat = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "My Active Boat - Siglingaf\xE9lagi\xF0 \xDDmir", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
My Active Boat
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Check in your boat using your member number. No QR code needed!
</p> </div> </section> <!-- Member Lookup Section --> <section class="py-16 bg-white"> <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-2xl font-bold text-ocean-green mb-6">Find Your Active Boat</h2> <!-- Member Number Input --> <div class="mb-6"> <label for="memberNumber" class="block text-sm font-medium text-anchor-gray mb-2">
Member Number
</label> <div class="flex gap-2"> <input type="text" id="memberNumber" placeholder="Enter your member number" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-green"> <button id="findBoat" class="px-6 py-3 bg-ocean-green text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
Find Boat
</button> </div> </div> <!-- Loading State --> <div id="loading" class="hidden text-center py-8"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-green mx-auto mb-4"></div> <p class="text-anchor-gray">Searching for your active boat...</p> </div> <!-- Active Boat Display --> <div id="activeBoat" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"> <h3 class="text-lg font-semibold text-green-900 mb-4">Your Active Boat</h3> <div id="boatInfo" class="space-y-3 mb-6"> <!-- Boat information will be populated here --> </div> <!-- Check-in Checklist --> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"> <h4 class="text-md font-semibold text-blue-900 mb-3">Check-in Checklist</h4> <p class="text-blue-800 mb-4 text-sm">Please confirm you have completed all items before checking in:</p> <div class="space-y-3"> <label class="flex items-center space-x-3"> <input type="checkbox" id="boatStored" name="checkinChecklist" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"> <span class="text-sm text-blue-900">Boat is properly stored and secured</span> </label> <label class="flex items-center space-x-3"> <input type="checkbox" id="boatCleaned" name="checkinChecklist" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"> <span class="text-sm text-blue-900">Boat is cleaned and equipment is stowed</span> </label> <label class="flex items-center space-x-3"> <input type="checkbox" id="damageReported" name="checkinChecklist" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"> <span class="text-sm text-blue-900">Any damage or issues have been reported</span> </label> </div> </div> <!-- Trip Notes --> <div class="mb-6"> <label for="tripNotes" class="block text-sm font-medium text-gray-700 mb-2">
Trip Notes (Optional)
</label> <textarea id="tripNotes" rows="3" placeholder="How was your trip? Any observations or notes for other sailors?" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"></textarea> </div> <!-- Action Buttons --> <div class="flex gap-3 mb-6"> <button id="checkInButton" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
✅ Check In Now
</button> <button onclick="openMaintenanceModalFromMyBoat()" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
🔧 Report Maintenance Issue
</button> </div> </div> <!-- Error Message --> <div id="error" class="hidden"> <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"> <div class="text-4xl mb-4">❌</div> <h3 class="text-lg font-semibold text-red-900 mb-2">Error</h3> <p id="errorMessage" class="text-red-800">
An error occurred. Please try again.
</p> </div> </div> <!-- Success Message --> <div id="success" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center"> <div class="text-4xl mb-4">✅</div> <h3 class="text-lg font-semibold text-green-900 mb-2">Successfully Checked In!</h3> <p class="text-green-800 mb-4">
Your boat has been successfully returned. Thank you for using Ymir Sailing Club!
</p> <a href="/en" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
Return to Home
</a> </div> </div> </div> </div> </div></section> </main> ${renderComponent($$result2, "MaintenanceModal", $$MaintenanceModal, {})} ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/my-boat.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/my-boat.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/my-boat.astro";
const $$url = "/en/my-boat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MyBoat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

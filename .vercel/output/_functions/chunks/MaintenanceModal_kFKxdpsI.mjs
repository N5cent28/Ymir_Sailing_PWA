import { c as createComponent, m as maybeRenderHead, e as renderScript, f as renderTemplate } from './astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import 'clsx';

const $$MaintenanceModal = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="maintenanceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50"> <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"> <div class="mt-3"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-medium text-gray-900">Report Maintenance Issue</h3> <button onclick="closeMaintenanceModal()" class="text-gray-400 hover:text-gray-600"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="maintenanceForm" class="space-y-4"> <input type="hidden" id="maintenanceBoatId"> <input type="hidden" id="maintenanceMemberNumber"> <div> <label for="issueType" class="block text-sm font-medium text-gray-700 mb-1">
Issue Type
</label> <select id="issueType" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"> <option value="">Select issue type</option> <option value="mechanical">Mechanical</option> <option value="safety">Safety</option> <option value="cosmetic">Cosmetic</option> <option value="other">Other</option> </select> </div> <div> <label for="severity" class="block text-sm font-medium text-gray-700 mb-1">
Severity
</label> <select id="severity" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"> <option value="low">Low - Minor issue</option> <option value="medium" selected>Medium - Moderate issue</option> <option value="high">High - Significant issue</option> <option value="critical">Critical - Safety concern</option> </select> </div> <div> <label for="issueDescription" class="block text-sm font-medium text-gray-700 mb-1">
Description
</label> <textarea id="issueDescription" required rows="4" placeholder="Describe the issue in detail..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"></textarea> </div> <div class="flex space-x-3"> <button type="submit" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
Report Issue
</button> <button type="button" onclick="closeMaintenanceModal()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
Cancel
</button> </div> </form> </div> </div> </div> ${renderScript($$result, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/MaintenanceModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/MaintenanceModal.astro", void 0);

export { $$MaintenanceModal as $ };

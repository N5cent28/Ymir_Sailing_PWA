/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript, b as addAttribute } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { $ as $$BackButton } from '../../chunks/BackButton_BQB4BC68.mjs';
import { getAllMembers } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$Members = createComponent(async ($$result, $$props, $$slots) => {
  const members = await getAllMembers();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Member Management - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-blue to-blue-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Back Button --> <div class="mb-6"> ${renderComponent($$result2, "BackButton", $$BackButton, { "variant": "admin", "label": "Back to Admin" })} </div> <div class="text-center"> <h1 class="text-5xl font-bold mb-6">
Member Management
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Manage club members, view PINs, edit member information, and track membership.
</p> </div> </div> </section> <!-- Member Management Content --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Member Management --> <div class="bg-sail-white rounded-lg p-6 shadow-lg mb-8"> <h3 class="text-xl font-bold text-ocean-blue mb-6">Add New Member</h3> <form id="addMemberForm" class="grid md:grid-cols-2 gap-4"> <div> <label for="memberNumber" class="block text-sm font-medium text-gray-700 mb-1">
Member Number *
</label> <input type="text" id="memberNumber" name="memberNumber" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="e.g., 1234"> </div> <div> <label for="memberName" class="block text-sm font-medium text-gray-700 mb-1">
Full Name *
</label> <input type="text" id="memberName" name="memberName" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="e.g., John Doe"> </div> <div> <label for="memberPhone" class="block text-sm font-medium text-gray-700 mb-1">
Phone Number
</label> <input type="tel" id="memberPhone" name="memberPhone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="e.g., +16082172631"> </div> <div> <label for="memberEmail" class="block text-sm font-medium text-gray-700 mb-1">
Email Address
</label> <input type="email" id="memberEmail" name="memberEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue" placeholder="e.g., john@example.com"> </div> <div class="md:col-span-2"> <button type="submit" class="w-full px-6 py-3 bg-ocean-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
Add Member
</button> </div> </form> <!-- Success/Error Messages --> <div id="message" class="mt-4 p-3 rounded-lg hidden"></div> </div> <!-- Member List --> <div class="bg-sail-white rounded-lg p-6 shadow-lg"> <div class="flex justify-between items-center mb-6"> <h3 class="text-xl font-bold text-ocean-blue">Club Members (${members.length})</h3> <div class="flex space-x-2"> <input type="text" id="searchMembers" placeholder="Search members..." class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"> </div> </div> <div class="overflow-x-auto"> <table class="min-w-full bg-white border border-gray-200 rounded-lg"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Member #
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Name
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Phone
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Email
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Joined
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Actions
</th> </tr> </thead> <tbody id="membersTableBody" class="bg-white divide-y divide-gray-200"> ${members.map((member) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> ${member.member_number} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ${member.name.replace(/\s+0$/, "")} ${member.is_admin && renderTemplate`<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
Admin
</span>`} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${member.phone || "-"} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${member.email || "-"} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${new Date(member.created_at).toLocaleDateString()} </td> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button${addAttribute(`showMemberPin('${member.member_number}', '${member.name}')`, "onclick")} class="text-purple-600 hover:text-purple-700 mr-3">
Show PIN
</button> <button${addAttribute(`editMember('${member.member_number}', '${member.name}', '${member.phone || ""}', '${member.email || ""}', ${member.is_admin || false})`, "onclick")} class="text-green-600 hover:text-green-700 mr-3">
Edit
</button> <button${addAttribute(`deleteMember('${member.member_number}', '${member.name}')`, "onclick")} class="text-red-600 hover:text-red-700">
Delete
</button> </td> </tr>`)} </tbody> </table> </div> ${members.length === 0 && renderTemplate`<div class="text-center py-8"> <p class="text-gray-500">No members found. Add your first member above!</p> </div>`} </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/members.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/members.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/members.astro";
const $$url = "/en/members";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Members,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

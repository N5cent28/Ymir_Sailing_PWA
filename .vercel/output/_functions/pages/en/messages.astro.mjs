/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C92i3yD8.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_BSm99MnS.mjs';
export { renderers } from '../../renderers.mjs';

const $$Messages = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Messages - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-blue to-blue-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl font-bold mb-6">
Messages
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto">
Connect with fellow sailors and stay updated on club activities.
</p> </div> </section> <!-- Messages Content --> <section class="py-16 bg-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Messages Container --> <div class="bg-sail-white rounded-lg shadow-lg"> <!-- Header --> <div class="border-b border-gray-200 p-6"> <div class="flex items-center justify-between"> <div> <h3 class="text-xl font-bold text-ocean-blue" id="chatTitle">
Select a member to start messaging
</h3> <p class="text-sm text-gray-600" id="chatSubtitle">
Choose from the member list below
</p> </div> <div class="flex items-center space-x-2"> <span class="text-sm text-gray-500">Unread:</span> <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1" id="unreadCount">0</span> </div> </div> </div> <!-- Messages Area --> <div class="flex h-96"> <!-- Members List --> <div class="w-1/3 border-r border-gray-200 bg-gray-50"> <div class="p-4 border-b border-gray-200"> <h4 class="font-semibold text-gray-900 mb-2">Club Members</h4> <input type="text" id="memberSearch" placeholder="Search members..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue"> </div> <div class="overflow-y-auto h-80" id="membersList"> <!-- Members will be loaded here --> </div> </div> <!-- Chat Area --> <div class="flex-1 flex flex-col"> <!-- Messages Display --> <div class="flex-1 overflow-y-auto p-4" id="messagesArea"> <div class="text-center text-gray-500 py-8"> <div class="text-4xl mb-4">💬</div> <p>Select a member to start a conversation</p> </div> </div> <!-- Message Input --> <div class="border-t border-gray-200 p-4" id="messageInputContainer" style="display: none;"> <div class="flex space-x-2"> <input type="text" id="messageInput" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"> <button id="sendMessageBtn" class="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
Send
</button> </div> </div> </div> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/messages.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/messages.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/messages.astro";
const $$url = "/en/messages";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Messages,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

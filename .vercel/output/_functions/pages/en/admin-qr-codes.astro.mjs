/* empty css                                              */
import { c as createComponent, g as renderComponent, f as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_C3Y6NmiR.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DUjiRZkg.mjs';
import { $ as $$Navigation } from '../../chunks/Navigation_C6PXT241.mjs';
import { $ as $$BackButton } from '../../chunks/BackButton_BQB4BC68.mjs';
import { getAllMembers } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

const $$AdminQrCodes = createComponent(async ($$result, $$props, $$slots) => {
  await getAllMembers();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Manage QR Codes - Ymir Sailing Club", "lang": "en" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", $$Navigation, {})} ${maybeRenderHead()}<main> <!-- Hero Section --> <section class="bg-gradient-to-br from-ocean-green to-green-600 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Back Button --> <div class="mb-6"> ${renderComponent($$result2, "BackButton", $$BackButton, { "variant": "admin", "label": "Back to Admin" })} </div> <div class="text-center"> <div class="flex justify-between items-center mb-6"> <div></div> <h1 class="text-5xl font-bold">
Manage QR Codes
</h1> <div class="admin-info flex items-center space-x-4"> <span class="text-sm">Logged in as Admin</span> <a href="/en/admin-login" class="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm">
Logout
</a> </div> </div> <p class="text-xl mb-8 max-w-3xl mx-auto">
Upload and manage QR code images for each boat. These QR codes will be displayed on the boat management pages.
</p> </div> </div> </section> <!-- QR Code Management --> <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Individual Boats --> <div class="mb-12"> <h2 class="text-3xl font-bold text-ocean-green mb-4">Individual Boats</h2> <p class="text-gray-600 mb-6">One user at a time - each boat can only be checked out by one person.</p> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"> <!-- Quest 1 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Quest 1</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-1</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-1" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-1" accept="image/*" class="hidden" data-boat-id="boat-1" data-boat-name="Quest 1"> <button onclick="document.getElementById('qr-upload-boat-1').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-1</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-1')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-1')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Quest 2 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Quest 2</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-2</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-2" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-2" accept="image/*" class="hidden" data-boat-id="boat-2" data-boat-name="Quest 2"> <button onclick="document.getElementById('qr-upload-boat-2').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-2</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-2')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-2')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 1 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 1</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-3</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-3" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-3" accept="image/*" class="hidden" data-boat-id="boat-3" data-boat-name="Zest 1"> <button onclick="document.getElementById('qr-upload-boat-3').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-3</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-3')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-3')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 2 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 2</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-4</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-4" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-4" accept="image/*" class="hidden" data-boat-id="boat-4" data-boat-name="Zest 2"> <button onclick="document.getElementById('qr-upload-boat-4').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-4</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-4')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-4')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 3 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 3</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-5</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-5" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-5" accept="image/*" class="hidden" data-boat-id="boat-5" data-boat-name="Zest 3"> <button onclick="document.getElementById('qr-upload-boat-5').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-5</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-5')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-5')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 4 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 4</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-6</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-6" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-6" accept="image/*" class="hidden" data-boat-id="boat-6" data-boat-name="Zest 4"> <button onclick="document.getElementById('qr-upload-boat-6').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-6</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-6')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-6')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 5 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 5</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-7</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-7" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-7" accept="image/*" class="hidden" data-boat-id="boat-7" data-boat-name="Zest 5"> <button onclick="document.getElementById('qr-upload-boat-7').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-7</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-7')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-7')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Zest 6 --> <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Zest 6</h3> <p class="text-sm text-gray-600 mb-2">ID: boat-8</p> <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">Individual</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-boat-8" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-boat-8" accept="image/*" class="hidden" data-boat-id="boat-8" data-boat-name="Zest 6"> <button onclick="document.getElementById('qr-upload-boat-8').click()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/boat-8</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('boat-8')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/boat-8')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> </div> </div> <!-- Shared Boats --> <div class="mb-12"> <h2 class="text-3xl font-bold text-ocean-green mb-4">Shared Boats</h2> <p class="text-gray-600 mb-6">Multiple users can check out these boats simultaneously.</p> <div class="grid md:grid-cols-2 gap-6"> <!-- Kayak --> <div class="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Kayak</h3> <p class="text-sm text-gray-600 mb-2">ID: kayak</p> <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-4">Shared</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-kayak" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-kayak" accept="image/*" class="hidden" data-boat-id="kayak" data-boat-name="Kayak"> <button onclick="document.getElementById('qr-upload-kayak').click()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/kayak</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('kayak')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/kayak')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> <!-- Paddle Board --> <div class="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold text-ocean-green mb-2">Paddle Board</h3> <p class="text-sm text-gray-600 mb-2">ID: paddle-board</p> <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-4">Shared</span> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label> <div id="qr-preview-paddle-board" class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-2"> <span class="text-gray-400 text-sm">No QR Code</span> </div> <input type="file" id="qr-upload-paddle-board" accept="image/*" class="hidden" data-boat-id="paddle-board" data-boat-name="Paddle Board"> <button onclick="document.getElementById('qr-upload-paddle-board').click()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
Upload QR Code
</button> </div> <div class="space-y-2"> <p class="text-xs text-gray-600">URL: <span class="font-mono">http://localhost:4321/qr/paddle-board</span></p> <div class="flex space-x-2"> <button onclick="testQRCode('paddle-board')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
Test
</button> <button onclick="copyURL('http://localhost:4321/qr/paddle-board')" class="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs">
Copy URL
</button> </div> </div> </div> </div> </div> </div> </section> </main> ${renderScript($$result2, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-qr-codes.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-qr-codes.astro", void 0);

const $$file = "/Users/noahnicol/Desktop/ymir-sailing-club/src/pages/en/admin-qr-codes.astro";
const $$url = "/en/admin-qr-codes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminQrCodes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

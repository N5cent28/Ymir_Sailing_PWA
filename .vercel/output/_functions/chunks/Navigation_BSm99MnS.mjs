import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, e as renderScript, f as renderTemplate } from './astro/server_CL4BR9Gz.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Navigation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Navigation;
  const currentLang = Astro2.url.pathname.startsWith("/is") ? "is" : "en";
  const basePath = currentLang === "is" ? "/is" : "/en";
  const navItems = {
    en: [
      { href: "/en", label: "Info" },
      { href: "/en/profile", label: "My Profile" },
      { href: "/en/my-boat", label: "My Boat" },
      { href: "/en/contact", label: "Contact" },
      { href: "/en/admin-login", label: "Admin" }
    ],
    is: [
      { href: "/is", label: "Uppl\xFDsingar" },
      { href: "/is/my-boat", label: "M\xEDn B\xE1tur" },
      { href: "/is/contact", label: "Haf\xF0u samband" },
      { href: "/is/admin-login", label: "Stj\xF3rn" }
    ]
  };
  const items = navItems[currentLang];
  return renderTemplate`${maybeRenderHead()}<nav class="bg-white shadow-lg"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex items-center space-x-4"> <a${addAttribute(basePath, "href")} class="flex-shrink-0"> <h1 class="text-2xl font-bold text-ocean-blue">Ýmir</h1> </a> <!-- Social Media Icons --> <div class="flex items-center space-x-3"> <a href="https://www.instagram.com/siglingafelag/" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Instagram"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path> </svg> </a> <a href="https://www.facebook.com/siglingaf.ymir" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Facebook"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a> </div> </div> <div class="hidden md:flex items-center space-x-8"> ${items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="text-anchor-gray hover:text-ocean-blue px-3 py-2 rounded-md text-sm font-medium transition-colors relative"> ${item.label} ${item.hasBadge && renderTemplate`<span${addAttribute(`badge-${item.href.split("/").pop()}`, "id")} class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden">
0
</span>`} </a>`)} <!-- Language Toggle --> <a${addAttribute(currentLang === "en" ? "/is" : "/en", "href")} class="text-anchor-gray hover:text-ocean-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"> ${currentLang === "en" ? "IS" : "EN"} </a> </div> </div> </div> </nav> ${renderScript($$result, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/noahnicol/Desktop/ymir-sailing-club/src/components/Navigation.astro", void 0);

export { $$Navigation as $ };

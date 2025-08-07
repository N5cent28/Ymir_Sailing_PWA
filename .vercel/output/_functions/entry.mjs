import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DQMgTQNL.mjs';
import { manifest } from './manifest_CCgyatih.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/admin-enhanced.astro.mjs');
const _page2 = () => import('./pages/api/admin-login.astro.mjs');
const _page3 = () => import('./pages/api/boat-hours.astro.mjs');
const _page4 = () => import('./pages/api/boat-status.astro.mjs');
const _page5 = () => import('./pages/api/check-in.astro.mjs');
const _page6 = () => import('./pages/api/check-out.astro.mjs');
const _page7 = () => import('./pages/api/check-overdue.astro.mjs');
const _page8 = () => import('./pages/api/cleanup-messages.astro.mjs');
const _page9 = () => import('./pages/api/extend-time.astro.mjs');
const _page10 = () => import('./pages/api/maintenance.astro.mjs');
const _page11 = () => import('./pages/api/member-login.astro.mjs');
const _page12 = () => import('./pages/api/members.astro.mjs');
const _page13 = () => import('./pages/api/messages.astro.mjs');
const _page14 = () => import('./pages/api/my-active-boat.astro.mjs');
const _page15 = () => import('./pages/api/profile.astro.mjs');
const _page16 = () => import('./pages/api/push-notification.astro.mjs');
const _page17 = () => import('./pages/api/qr-codes.astro.mjs');
const _page18 = () => import('./pages/api/seed-members.astro.mjs');
const _page19 = () => import('./pages/api/seed-messages.astro.mjs');
const _page20 = () => import('./pages/api/social.astro.mjs');
const _page21 = () => import('./pages/api/update-boat-status.astro.mjs');
const _page22 = () => import('./pages/api/upload-qr-code.astro.mjs');
const _page23 = () => import('./pages/en/admin.astro.mjs');
const _page24 = () => import('./pages/en/admin-dashboard.astro.mjs');
const _page25 = () => import('./pages/en/admin-login.astro.mjs');
const _page26 = () => import('./pages/en/admin-maintenance.astro.mjs');
const _page27 = () => import('./pages/en/admin-qr-codes.astro.mjs');
const _page28 = () => import('./pages/en/admin-test.astro.mjs');
const _page29 = () => import('./pages/en/contact.astro.mjs');
const _page30 = () => import('./pages/en/courses.astro.mjs');
const _page31 = () => import('./pages/en/data-export.astro.mjs');
const _page32 = () => import('./pages/en/find-members.astro.mjs');
const _page33 = () => import('./pages/en/members.astro.mjs');
const _page34 = () => import('./pages/en/messages.astro.mjs');
const _page35 = () => import('./pages/en/my-boat.astro.mjs');
const _page36 = () => import('./pages/en/profile.astro.mjs');
const _page37 = () => import('./pages/en/qr-codes.astro.mjs');
const _page38 = () => import('./pages/en/test-login.astro.mjs');
const _page39 = () => import('./pages/en.astro.mjs');
const _page40 = () => import('./pages/is/admin.astro.mjs');
const _page41 = () => import('./pages/is/admin-login.astro.mjs');
const _page42 = () => import('./pages/is/contact.astro.mjs');
const _page43 = () => import('./pages/is/courses.astro.mjs');
const _page44 = () => import('./pages/is/find-members.astro.mjs');
const _page45 = () => import('./pages/is/messages.astro.mjs');
const _page46 = () => import('./pages/is/my-boat.astro.mjs');
const _page47 = () => import('./pages/is/profile.astro.mjs');
const _page48 = () => import('./pages/is/qr-codes.astro.mjs');
const _page49 = () => import('./pages/is.astro.mjs');
const _page50 = () => import('./pages/qr/_boatid_.astro.mjs');
const _page51 = () => import('./pages/test.astro.mjs');
const _page52 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/admin-enhanced.js", _page1],
    ["src/pages/api/admin-login.js", _page2],
    ["src/pages/api/boat-hours.js", _page3],
    ["src/pages/api/boat-status.js", _page4],
    ["src/pages/api/check-in.js", _page5],
    ["src/pages/api/check-out.js", _page6],
    ["src/pages/api/check-overdue.js", _page7],
    ["src/pages/api/cleanup-messages.js", _page8],
    ["src/pages/api/extend-time.js", _page9],
    ["src/pages/api/maintenance.js", _page10],
    ["src/pages/api/member-login.js", _page11],
    ["src/pages/api/members.js", _page12],
    ["src/pages/api/messages.js", _page13],
    ["src/pages/api/my-active-boat.js", _page14],
    ["src/pages/api/profile.js", _page15],
    ["src/pages/api/push-notification.js", _page16],
    ["src/pages/api/qr-codes.js", _page17],
    ["src/pages/api/seed-members.js", _page18],
    ["src/pages/api/seed-messages.js", _page19],
    ["src/pages/api/social.js", _page20],
    ["src/pages/api/update-boat-status.js", _page21],
    ["src/pages/api/upload-qr-code.js", _page22],
    ["src/pages/en/admin.astro", _page23],
    ["src/pages/en/admin-dashboard.astro", _page24],
    ["src/pages/en/admin-login.astro", _page25],
    ["src/pages/en/admin-maintenance.astro", _page26],
    ["src/pages/en/admin-qr-codes.astro", _page27],
    ["src/pages/en/admin-test.astro", _page28],
    ["src/pages/en/contact.astro", _page29],
    ["src/pages/en/courses.astro", _page30],
    ["src/pages/en/data-export.astro", _page31],
    ["src/pages/en/find-members.astro", _page32],
    ["src/pages/en/members.astro", _page33],
    ["src/pages/en/messages.astro", _page34],
    ["src/pages/en/my-boat.astro", _page35],
    ["src/pages/en/profile.astro", _page36],
    ["src/pages/en/qr-codes.astro", _page37],
    ["src/pages/en/test-login.astro", _page38],
    ["src/pages/en/index.astro", _page39],
    ["src/pages/is/admin.astro", _page40],
    ["src/pages/is/admin-login.astro", _page41],
    ["src/pages/is/contact.astro", _page42],
    ["src/pages/is/courses.astro", _page43],
    ["src/pages/is/find-members.astro", _page44],
    ["src/pages/is/messages.astro", _page45],
    ["src/pages/is/my-boat.astro", _page46],
    ["src/pages/is/profile.astro", _page47],
    ["src/pages/is/qr-codes.astro", _page48],
    ["src/pages/is/index.astro", _page49],
    ["src/pages/qr/[boatId].astro", _page50],
    ["src/pages/test.astro", _page51],
    ["src/pages/index.astro", _page52]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d0a82802-6109-4ade-aefc-acc15ff55b07",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };

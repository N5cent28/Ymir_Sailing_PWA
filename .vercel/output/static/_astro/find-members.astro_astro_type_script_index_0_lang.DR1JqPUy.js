function v(){try{const t=localStorage.getItem("ymir_current_member"),e=localStorage.getItem("ymir_session_expiry");return!t||!e?null:Date.now()>parseInt(e)?(localStorage.removeItem("ymir_current_member"),localStorage.removeItem("ymir_session_expiry"),null):JSON.parse(t)}catch{return null}}const x=v();x||(window.location.href="/en/profile?returnUrl="+encodeURIComponent(window.location.pathname));const b=document.getElementById("memberSearch"),y=document.getElementById("clearSearch"),d=document.getElementById("membersGrid"),w=document.getElementById("memberCount"),g=document.getElementById("noResults"),m=document.getElementById("sortByName"),u=document.getElementById("sortByHours");let i=[],r=[];async function _(){try{const e=await(await fetch("/api/members")).json();e.success&&(i=e.members,r=[...i],a(r),h())}catch(t){console.error("Error loading members:",t)}}async function h(){for(const t of i)try{const s=await(await fetch(`/api/profile?memberNumber=${t.member_number}`)).json();if(s.success&&s.trips){const n=document.getElementById(`trips-${t.member_number}`);n&&(n.textContent=s.trips.length)}const l=await(await fetch(`/api/boat-hours?memberNumber=${t.member_number}`)).json();if(l.totalHours!==void 0){const n=document.getElementById(`hours-${t.member_number}`);n&&(n.textContent=l.totalHours.toFixed(1))}}catch(e){console.error(`Error loading stats for member ${t.member_number}:`,e)}}function B(t,e){if(!t)return!0;const s=t.toLowerCase(),c=e.toLowerCase();if(c.includes(s))return!0;const l=s.split(" ").filter(o=>o.length>0),n=c.split(" ").filter(o=>o.length>0);return l.some(o=>n.some(p=>p.includes(o)||o.includes(p)))}b.addEventListener("input",t=>{const e=t.target.value.trim();e===""?r=[...i]:r=i.filter(s=>B(e,s.name)),a(r)});y.addEventListener("click",()=>{b.value="",r=[...i],a(r)});m.addEventListener("click",()=>{r.sort((t,e)=>t.name.localeCompare(e.name)),a(r),f("name")});u.addEventListener("click",()=>{r.sort((t,e)=>t.name.localeCompare(e.name)),a(r),f("hours")});function f(t){t==="name"?(m.className="px-3 py-1 bg-ocean-blue text-white rounded text-sm hover:bg-blue-700 transition-colors",u.className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"):(m.className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors",u.className="px-3 py-1 bg-ocean-blue text-white rounded text-sm hover:bg-blue-700 transition-colors")}function a(t){if(w.textContent=t.length,t.length===0){d.classList.add("hidden"),g.classList.remove("hidden");return}d.classList.remove("hidden"),g.classList.add("hidden"),d.innerHTML=t.map(e=>`
        <div class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div class="p-6">
            <!-- Profile Photo/Initials -->
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden mr-4" id="avatar-${e.member_number}">
                ${e.profile_picture?`<img src="${e.profile_picture}" alt="Profile photo" class="w-full h-full object-cover" id="photo-${e.member_number}">`:`<span>${e.name.split(" ").map(s=>s[0]).join("").toUpperCase()}</span>`}
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900">
                  ${e.name}
                  ${e.is_admin?'<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Admin</span>':""}
                </h4>
              </div>
            </div>
            
            <!-- Bio -->
            <div class="mb-4">
              <p class="text-sm text-gray-700">
                ${e.bio||"No bio yet"}
              </p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4 text-center">
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-lg font-bold text-blue-600" id="trips-${e.member_number}">-</div>
                <div class="text-xs text-blue-800">Trips</div>
              </div>
              <div class="bg-green-50 rounded-lg p-3">
                <div class="text-lg font-bold text-green-600" id="hours-${e.member_number}">-</div>
                <div class="text-xs text-green-800">Hours</div>
              </div>
            </div>
            
            <!-- Message Button -->
            <button
              onclick="openMessageTo('${e.member_number}', '${e.name}')"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Message
            </button>
          </div>
        </div>
      `).join(""),h()}function $(t,e){window.location.href=`/en/messages?member=${t}&name=${encodeURIComponent(e)}`}window.openMessageTo=$;_();

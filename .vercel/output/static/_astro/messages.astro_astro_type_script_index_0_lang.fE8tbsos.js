function x(){try{const t=localStorage.getItem("ymir_current_member"),e=localStorage.getItem("ymir_session_expiry");return!t||!e?null:Date.now()>parseInt(e)?(localStorage.removeItem("ymir_current_member"),localStorage.removeItem("ymir_session_expiry"),null):JSON.parse(t)}catch{return null}}const n=x();n||(window.location.href="/is/profile?returnUrl="+encodeURIComponent(window.location.pathname));const b=new URLSearchParams(window.location.search),l=b.get("member"),d=b.get("name");let c=[],r=null,m=[];const h=document.getElementById("membersList"),o=document.getElementById("messagesArea"),i=document.getElementById("messageInput"),w=document.getElementById("sendMessageBtn"),M=document.getElementById("messageInputContainer"),_=document.getElementById("chatTitle"),E=document.getElementById("chatSubtitle"),I=document.getElementById("memberSearch"),u=document.getElementById("unreadCount");async function $(){try{const e=await(await fetch("/api/members")).json();e.success&&(c=e.members.filter(s=>s.member_number!==n.member_number),g(c),l&&d&&await p(l,d))}catch(t){console.error("Error loading members:",t)}}function g(t){h.innerHTML=t.map(e=>`
        <div 
          class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 member-item"
          data-member-number="${e.member_number}"
          onclick="selectMember('${e.member_number}', '${e.name}')"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-ocean-blue rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              ${e.profile_picture?`<img src="${e.profile_picture}" alt="Profile" class="w-full h-full object-cover rounded-full">`:e.name.split(" ").map(s=>s[0]).join("").toUpperCase()}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900">${e.name}</div>
              <div class="text-xs text-gray-500">${e.bio||"Engin lýsing"}</div>
            </div>
          </div>
        </div>
      `).join("")}async function p(t,e){r={memberNumber:t,name:e},_.textContent=e,E.textContent="Ýttu til að senda skilaboð",M.style.display="block",document.querySelectorAll(".member-item").forEach(s=>{s.classList.remove("bg-blue-100")}),document.querySelector(`[data-member-number="${t}"]`).classList.add("bg-blue-100"),await f()}async function f(){if(r)try{const e=await(await fetch(`/api/messages?action=conversation&memberNumber1=${n.member_number}&memberNumber2=${r.memberNumber}`)).json();e.success&&(m=e.messages,j())}catch(t){console.error("Error loading messages:",t)}}function j(){if(m.length===0){o.innerHTML=`
          <div class="text-center text-gray-500 py-8">
            <div class="text-4xl mb-4">💬</div>
            <p>Engin skilaboð enn. Byrjaðu samtal!</p>
          </div>
        `;return}o.innerHTML=m.map(t=>{const e=t.sender_member_number===n.member_number,s=new Date(t.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
          <div class="flex ${e?"justify-end":"justify-start"} mb-4">
            <div class="max-w-xs lg:max-w-md">
              <div class="flex items-end space-x-2">
                ${e?"":`
                  <div class="w-8 h-8 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ${r.name.split(" ").map(a=>a[0]).join("").toUpperCase()}
                  </div>
                `}
                <div class="bg-${e?"ocean-blue text-white":"gray-200 text-gray-900"} rounded-lg px-4 py-2">
                  <p class="text-sm">${t.message}</p>
                  <p class="text-xs ${e?"text-blue-100":"text-gray-500"} mt-1">${s}</p>
                </div>
                ${e?`
                  <div class="w-8 h-8 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ${n.name.split(" ").map(a=>a[0]).join("").toUpperCase()}
                  </div>
                `:""}
              </div>
            </div>
          </div>
        `}).join(""),o.scrollTop=o.scrollHeight}async function y(){if(!r||!i.value.trim())return;const t=i.value.trim();try{(await(await fetch("/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"send",senderMemberNumber:n.member_number,receiverMemberNumber:r.memberNumber,message:t})})).json()).success&&(i.value="",await f())}catch(e){console.error("Error sending message:",e)}}async function v(){try{const e=await(await fetch(`/api/messages?action=unreadCount&memberNumber1=${n.member_number}`)).json();e.success&&(u.textContent=e.count,u.style.display=e.count>0?"inline":"none")}catch(t){console.error("Error loading unread count:",t)}}I.addEventListener("input",t=>{const e=t.target.value.toLowerCase(),s=c.filter(a=>a.name.toLowerCase().includes(e));g(s)});i.addEventListener("keypress",t=>{t.key==="Enter"&&y()});w.addEventListener("click",y);window.selectMember=p;$();v();setInterval(v,3e4);

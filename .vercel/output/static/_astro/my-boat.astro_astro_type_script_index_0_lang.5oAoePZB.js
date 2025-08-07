const i=document.getElementById("memberNumber"),l=document.getElementById("findBoat"),u=document.getElementById("loading"),m=document.getElementById("activeBoat"),p=document.getElementById("error"),c=document.getElementById("success"),h=document.getElementById("boatInfo"),b=document.getElementById("checkInButton"),f=document.getElementById("errorMessage");let y=null,r=null;l.addEventListener("click",async()=>{const e=i.value.trim();if(!e){o("Please enter your member number");return}g();try{const t=await(await fetch(`/api/my-active-boat?memberNumber=${e}`)).json();t.success?t.activeBoat?v(t.activeBoat):k():o(t.error||"Failed to find your active boat")}catch(n){console.error("Error finding boat:",n),o("An error occurred while searching for your boat")}});b.addEventListener("click",async()=>{const e=document.querySelectorAll('input[name="checkinChecklist"]');if(!Array.from(e).every(a=>a.checked)){o("Please complete all checklist items before checking in");return}const t=document.getElementById("tripNotes").value.trim();try{const d=await(await fetch("/api/check-out",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({checkInId:y,checkinChecklist:!0,tripNotes:t||null})})).json();d.success?w():o(d.error||"Failed to check in boat")}catch(a){console.error("Error checking in:",a),o("An error occurred while checking in")}});function g(){s(),u.classList.remove("hidden")}function v(e){s();const n=new Date(e.departure_time).toLocaleString(),t=new Date(e.expected_return).toLocaleString();h.innerHTML=`
        <div class="grid grid-cols-1 gap-3">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Boat:</span>
            <span class="text-gray-900">${e.boat_name}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Sailor:</span>
            <span class="text-gray-900">${e.sailor_name}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Departure:</span>
            <span class="text-gray-900">${n}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Expected Return:</span>
            <span class="text-gray-900">${t}</span>
          </div>
        </div>
      `,y=e.id,r=e.boat_id,m.classList.remove("hidden")}function k(){s();const e=`
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center" style="background-color: #eff6ff !important; border-color: #bfdbfe !important;">
          <div class="text-4xl mb-4">🚤</div>
          <h3 class="text-lg font-semibold text-blue-900 mb-2" style="color: #1e3a8a !important;">No Active Boat Found</h3>
          <p class="text-blue-800 mb-4" style="color: #1e40af !important;">
            Looks like you have no boats in use! If you'd like to go sailing, head over to our boat area to check out a boat.
          </p>
          <div class="space-y-3">
            <a href="/en/qr-codes" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" style="background-color: #2563eb !important; color: white !important;">
              View All Boats
            </a>
            <div class="text-sm text-blue-600" style="color: #2563eb !important;">
              <p>Need help? Contact the club office.</p>
            </div>
          </div>
        </div>
      `,n=document.querySelector(".bg-white.rounded-lg.shadow-lg.p-8");if(n){const t=document.createElement("div");t.id="dynamicNoActiveBoat",t.innerHTML=e,t.style.marginTop="20px",t.style.zIndex="9999",t.style.position="relative",n.appendChild(t)}}function o(e){s(),f.textContent=e,p.classList.remove("hidden")}function w(){s(),c.classList.remove("hidden"),setTimeout(()=>{c.classList.add("hidden")},5e3)}function s(){u.classList.add("hidden"),m.classList.add("hidden"),p.classList.add("hidden"),c.classList.add("hidden");const e=document.getElementById("dynamicNoActiveBoat");e&&e.remove()}i.addEventListener("keypress",e=>{e.key==="Enter"&&l.click()});window.onMaintenanceReported=function(){alert("Maintenance issue reported successfully! The boat status has been updated.")};window.openMaintenanceModalFromMyBoat=function(){const e=i.value.trim();window.openMaintenanceModal&&r&&e?window.openMaintenanceModal(r,e):alert("Please enter your member number and find your boat first.")};

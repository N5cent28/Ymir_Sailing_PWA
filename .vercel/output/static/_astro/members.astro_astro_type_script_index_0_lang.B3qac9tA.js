function u(){if(!localStorage.getItem("adminMember")){window.location.href="/en/admin-login?returnUrl="+encodeURIComponent(window.location.pathname);return}}u();const l=document.getElementById("addMemberForm"),a=document.getElementById("message"),b=document.getElementById("searchMembers"),p=document.getElementById("membersTableBody");l.addEventListener("submit",async t=>{t.preventDefault();const e=new FormData(l),o={memberNumber:e.get("memberNumber"),name:e.get("memberName"),phone:e.get("memberPhone")||null,email:e.get("memberEmail")||null};try{const s=await(await fetch("/api/members",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json();s.success?(n("Member added successfully!","success"),l.reset(),setTimeout(()=>location.reload(),1500)):n(s.error||"Failed to add member","error")}catch(r){console.error("Error adding member:",r),n("An error occurred while adding the member","error")}});b.addEventListener("input",t=>{const e=t.target.value.toLowerCase();p.querySelectorAll("tr").forEach(r=>{r.textContent.toLowerCase().includes(e)?r.style.display="":r.style.display="none"})});function n(t,e){a.className="mt-4 p-3 rounded-lg",a.className+=e==="success"?" bg-green-100 text-green-800":" bg-red-100 text-red-800",a.textContent=t,a.classList.remove("hidden"),setTimeout(()=>{a.classList.add("hidden")},5e3)}async function y(t,e){try{const r=await(await fetch(`/api/members?memberNumber=${t}`)).json();if(r.success&&r.member){const s=r.member.pin||"No PIN set";alert(`${e} (Member #${t})

PIN: ${s}`)}else n("Failed to retrieve member PIN","error")}catch(o){console.error("Error retrieving member PIN:",o),n("An error occurred while retrieving the PIN","error")}}function f(t,e,o,r,s){const i=document.createElement("div");i.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",i.innerHTML=`
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Edit Member: ${e}</h3>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>
          
          <form id="editMemberForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Member Number</label>
              <input type="text" value="${t}" disabled class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" id="editName" value="${e}" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" id="editPhone" value="${o}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="editEmail" value="${r}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue">
            </div>
            
            <div>
              <label class="flex items-center">
                <input type="checkbox" id="editIsAdmin" ${s?"checked":""} class="mr-2">
                <span class="text-sm text-gray-700">Admin privileges</span>
              </label>
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button type="submit" class="flex-1 px-4 py-2 bg-ocean-blue text-white rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
              <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      `,document.body.appendChild(i),i.querySelector("#editMemberForm").addEventListener("submit",async c=>{c.preventDefault();try{const m=await(await fetch("/api/members",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberNumber:t,name:document.getElementById("editName").value,phone:document.getElementById("editPhone").value||null,email:document.getElementById("editEmail").value||null,is_admin:document.getElementById("editIsAdmin").checked})})).json();m.success?(n("Member updated successfully!","success"),i.remove(),setTimeout(()=>location.reload(),1500)):n(m.error||"Failed to update member","error")}catch(d){console.error("Error updating member:",d),n("An error occurred while updating the member","error")}})}function g(t,e){confirm(`Are you sure you want to delete ${e} (Member #${t})?

This action cannot be undone and will permanently remove this member from the system.`)&&confirm(`Final confirmation: Delete ${e} permanently?

This will remove all their data including trip history and boat hours.`)&&h(t,e)}async function h(t,e){try{const r=await(await fetch("/api/members",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberNumber:t})})).json();r.success?(n(`${e} has been permanently deleted.`,"success"),setTimeout(()=>location.reload(),1500)):n(r.error||"Failed to delete member","error")}catch(o){console.error("Error deleting member:",o),n("An error occurred while deleting the member","error")}}window.showMemberPin=y;window.editMember=f;window.deleteMember=g;

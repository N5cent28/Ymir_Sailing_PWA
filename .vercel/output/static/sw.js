const CACHE_NAME = "ymir-sailing-v1";
const urlsToCache = ["/", "/en/", "/favicon.svg", "/icon-192.svg", "/icon-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache each URL individually to handle failures gracefully
        const cachePromises = urlsToCache.map(url => 
          cache.add(url).catch(error => {
            console.warn(`Failed to cache ${url}:`, error);
            return null; // Continue with other cache operations
          })
        );
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

self.addEventListener("push", (event) => {
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = JSON.parse(event.data.text());
    } catch (e) {
      notificationData = { title: event.data.text() };
    }
  }
  
  const options = {
    body: notificationData.body || "New notification from Ymir Sailing Club",
    icon: "/icon-192.svg",
    badge: "/icon-192.svg",
    vibrate: [100, 50, 100],
    data: { 
      dateOfArrival: Date.now(), 
      primaryKey: 1,
      ...notificationData.data 
    },
    actions: [
      { action: "view", title: "View", icon: "/icon-192.svg" },
      { action: "close", title: "Close", icon: "/icon-192.svg" }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || "Ymir Sailing Club", 
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  if (event.action === "view" || event.action === "explore") {
    const data = event.notification.data;
    
    // Handle different notification types
    if (data && data.type === 'new_message') {
      // Navigate to messages page
      event.waitUntil(
        clients.openWindow(`/en/messages?member=${data.senderMemberNumber}`)
      );
    } else {
      // Default navigation
      event.waitUntil(clients.openWindow("/en/"));
    }
  }
}); 
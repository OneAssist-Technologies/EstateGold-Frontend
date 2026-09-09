
 /**
 * EstateGold Service Worker for Real Device Web Push Notifications
 */

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Listen for Push Events from Web Push Server
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: "EstateGold Notification",
      body: event.data.text(),
    };
  }

  const title = payload.title || "EstateGold Notification";
  const body = payload.body || payload.message || "You have a new update on EstateGold.";
  const targetUrl = payload.targetUrl || payload.data?.targetUrl || "/my-properties";
  const notificationId = payload.notificationId || `eg_${Date.now()}`;

  const options = {
    body,
    icon: "/eyva-logo.png",
    badge: "/eyva-logo.png",
    tag: notificationId,
    renotify: true,
    requireInteraction: payload.priority === "HIGH",
    vibrate: [200, 100, 200],
    data: {
      targetUrl,
      notificationId,
      timestamp: Date.now(),
      ...(payload.data || {}),
    },
    actions: [
      {
        action: "open",
        title: "View Details",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Handle Notification Click (Focus or open window + navigate)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.targetUrl || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (const client of windowClients) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) {
            return client.navigate(targetUrl);
          }
          return client;
        }
      }
      // If no window is open, open a new browser window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

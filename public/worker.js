/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", () => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activating.");
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    console.log("sw notif", data);
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [250, 300, 250],
      data: {
        url: data.url || "/",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

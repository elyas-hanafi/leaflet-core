/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", () => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event: any) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(fetch(event.request));
});

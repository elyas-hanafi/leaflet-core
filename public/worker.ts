/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", () => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activating.");
});

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";

// Helper function to convert VAPID public key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function RootLayoutClient({ children }: any) {
  useEffect(() => {
    const testget = async () => {
      const res = await fetch(
        "https://express-dh0bnlyvl-elyashanafis-projects.vercel.app"
      );
      console.log(res);
    };
    testget();
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const handleServiceWorker = async () => {
        // Register the service worker
        await navigator.serviceWorker.register("/worker.js");
      };

      // Execute the function to subscribe
      handleServiceWorker();
    } else {
      console.warn("Push notifications are not supported in this browser.");
    }
  }, []);

  return <div className="">{children}</div>;
}

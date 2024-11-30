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
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const handleServiceWorker = async () => {
        // Register the service worker
        const registration = await navigator.serviceWorker.register(
          "/worker.js"
        );
        try {
          // Convert the VAPID public key from URL base64 to Uint8Array
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
          const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

          // Subscribe the user to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });

          // Send the subscription to the backend
          const res = await fetch(
            "https://express-rho-ten.vercel.app/subscribe",
            {
              method: "POST",
              body: JSON.stringify(subscription),
              headers: {
                "content-type": "application/json",
              },
            }
          );

          const data = await res.json();
          console.log("Subscription data:", data);
        } catch (error) {
          console.error(
            "Error during service worker registration or push subscription",
            error
          );
        }
      };

      // Execute the function to subscribe
      handleServiceWorker();
    } else {
      console.warn("Push notifications are not supported in this browser.");
    }
  }, []);

  return <div className="">{children}</div>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

export default function RootLayoutClient({ children }: any) {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
  React.useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      // Request notification permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");

          // Show notification every 5 seconds
          setInterval(() => {
            navigator.serviceWorker.getRegistration().then((registration) => {
              if (registration) {
                registration.showNotification("PWA Setup", {
                  body: "This notification repeats every 5 seconds.",
                  icon: "/path-to-your-icon/icon.png", // Optional icon
                });
              }
            });
          }, 10000); // 5000 milliseconds = 5 seconds
        } else {
          alert("Notification permission denied.");
        }
      });
    }
  }, []);

  return <div className="">{children}</div>;
}

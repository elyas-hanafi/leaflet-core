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

  return <div className="">{children}</div>;
}

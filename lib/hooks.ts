/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const usePWADetection = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (PWA installed)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for changes in display mode (for install prompt or running as PWA)
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", (e) => {
        setIsInstalled(e.matches);
      });

    // Optional: detect if the app is ready to be installed (install prompt fired)
    let deferredPrompt: any;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return { isInstalled };
};

export default usePWADetection;

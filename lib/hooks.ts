/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const usePWADetection = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is running in standalone mode (PWA installed)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsInstalled(isStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e); // Store the event
    };
    console.log(isInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installPWA = () => {
    // if (deferredPrompt) {
    deferredPrompt.prompt(); // Show the install prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA installation");
      } else {
        console.log("User dismissed the PWA installation");
      }
      setDeferredPrompt(null); // Clear the prompt
    });
    // }
  };

  return { isInstalled, installPWA };
};

export const useGeolocationPrompt = () => {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [isPermissionGranted, setIsPermissionGranted] =
    useState<boolean>(false);

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!("geolocation" in navigator)) {
      setIsLocationEnabled(false);
      return;
    }

    // Check if permission for geolocation is granted, prompt, or denied
    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state === "granted") {
        setIsPermissionGranted(true);
      } else if (permission.state === "denied") {
        setIsPermissionGranted(false);
      } else {
        setIsPermissionGranted(false); // 'prompt' state
      }

      // Check if location services are enabled
      navigator.geolocation.getCurrentPosition(
        () => setIsLocationEnabled(true),
        () => setIsLocationEnabled(false)
      );
    });
  }, []);

  const promptUserToEnableLocation = () => {
    // Try to get the user's position again (might prompt them if in 'prompt' state)
    navigator.geolocation.getCurrentPosition(
      () => setIsLocationEnabled(true),
      () => setIsLocationEnabled(false)
    );
  };

  return { isLocationEnabled, isPermissionGranted, promptUserToEnableLocation };
};

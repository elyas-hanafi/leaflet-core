/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the default install prompt
      e.preventDefault();
      // Save the event for later triggering
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    deferredPrompt.prompt(); // Show the install prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="relative z-50">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <button onClick={handleInstallClick}>Install</button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InstallPrompt;

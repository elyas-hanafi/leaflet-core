/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGeolocationPrompt } from "@/lib/hooks";
import dynamic from "next/dynamic";
import { pwaInstallHandler } from "pwa-install-handler";
import { useState } from "react";
const Map = dynamic(() => import("./_components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const zoomLevel = 5;
  const { isLocationEnabled, promptUserToEnableLocation } =
    useGeolocationPrompt();
  const [installModal, setInstallModal] = useState<any>(false);
  function handelInstallModal() {
    pwaInstallHandler.install().catch((err) => console.log(err));
  }

  return (
    <>
      <Map zoomLevel={zoomLevel} />
      <Dialog open={installModal} onOpenChange={setInstallModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install our app</DialogTitle>
            <DialogDescription>
              Would you like to install this app for a better experience?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handelInstallModal}>Install PWA</Button>
            <Button onClick={() => setInstallModal(false)} variant={`outline`}>
              I am Already use App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!installModal && (
        <>
          <Dialog open={!isLocationEnabled} onOpenChange={setInstallModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pleas Active Your GPS</DialogTitle>
                <DialogDescription>
                  For Use this app you must active your GPS
                  {`${installModal}`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={promptUserToEnableLocation}>Active GPS</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

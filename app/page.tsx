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
import { usePWADetection } from "@/lib/hooks";
import dynamic from "next/dynamic";
import { pwaInstallHandler } from "pwa-install-handler";
const Map = dynamic(() => import("./_components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const zoomLevel = 5;
  const { isInstalled } = usePWADetection();
  function handelInstallModal() {
    pwaInstallHandler.install().catch((err) => console.log(err));
  }

  return (
    <>
      <Map zoomLevel={zoomLevel} />
      <Dialog open={!isInstalled}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install our app</DialogTitle>
            <DialogDescription>
              Would you like to install this app for a better experience? satus:
              {`${isInstalled}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handelInstallModal}>Install PWA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
import usePWADetection from "@/lib/hooks";
import dynamic from "next/dynamic";
import { pwaInstallHandler } from "pwa-install-handler";
const Map = dynamic(() => import("./_components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const zoomLevel = 5;
  const p = usePWADetection();
  const handleInstall = () => {
    pwaInstallHandler.install();
  };
  return (
    <>
      <Map zoomLevel={zoomLevel} />
      <Dialog open={!p.isInstalled}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleInstall}>Button</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

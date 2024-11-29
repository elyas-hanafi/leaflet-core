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

const Map = dynamic(() => import("./_components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const zoomLevel = 5;
  const { isInstalled, installPWA } = usePWADetection();

  return (
    <>
      <Map zoomLevel={zoomLevel} />
      <Dialog open={!isInstalled}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install our app</DialogTitle>
            <DialogDescription>
              Would you like to install this app for a better experience?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={installPWA}>Install PWA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

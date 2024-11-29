/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Ensure you are using the client component

import { useRef, useEffect } from "react";
import { MapWidget } from "./map-widget";
import { useGeolocationPrompt } from "@/lib/hooks";
import { pwaInstallHandler } from "pwa-install-handler";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Example data
const data = [
  {
    id: 1,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [59.263044, 32.827136],
    },
    properties: {
      ele: 969.947449,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL1",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
  {
    id: 2,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [59.263044, 32.827136],
    },
    properties: {
      ele: 969.947449,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL2",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
  {
    id: 3,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [59.263044, 32.827136],
    },
    properties: {
      ele: 969.947449,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL3",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
  {
    id: 4,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [59.261316, 32.839234],
    },
    properties: {
      ele: 969.947449,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL4",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
  {
    id: 5,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [59.261316, 32.839234],
    },
    properties: {
      ele: 969.947449,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL5",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
];

export default function Map({ zoomLevel }: { zoomLevel: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapWidget | null>(null);
  const [clusterModal, setClusterModal] = useState(false); // Track modal state
  const [isMissionActive, setIsMissionActive] = useState(false); // Track mission state
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      containerRef.current &&
      !mapRef.current
    ) {
      mapRef.current = new MapWidget(containerRef.current, {
        onClusterClick: () => setClusterModal(true), // Pass callback to update state
      });
      mapRef.current.addMarkersToCluster(data);
    }
  }, [zoomLevel]);

  const { isLocationEnabled, promptUserToEnableLocation } =
    useGeolocationPrompt(mapRef.current!);
  const [installModal, setInstallModal] = useState<any>(true);
  function handelInstallModal() {
    pwaInstallHandler.install().catch((err) => console.log(err));
  }
  const handleCancelMission = () => {
    mapRef.current?.cancelMission(); // Cancel mission
    setIsMissionActive(false); // Update state
  };
  const handleStartMission = () => {
    mapRef.current?.handleClusterClick(mapRef.current.clusterData.latlng);
    setIsMissionActive(true); // Update state
  };
  return (
    <>
      <div
        className="w-full h-screen absolute inset-0 z-0" // Make the map container full screen
        ref={containerRef}
      />
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
      <Dialog open={clusterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cluster node data</DialogTitle>

            <div>
              Name:{" "}
              {
                mapRef?.current?.clusterData?.propagatedFrom?.feature
                  ?.properties.Name
              }
            </div>
            <div>
              Power:{" "}
              {
                mapRef?.current?.clusterData?.propagatedFrom?.feature
                  ?.properties.Power_Watt
              }
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setClusterModal(false)}>Close</Button>

            <Button onClick={() => handleStartMission()} variant={`outline`}>
              Start Mession
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
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={promptUserToEnableLocation}>Active GPS</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      {isMissionActive && (
        <div className="absolute bottom-28 w-[80%] mx-auto p-10 items-center justify-between bg-white left-1/2 -translate-x-1/2 rounded-xl flex">
          <div className="bg-slate-200 p-5 rounded-xl">
            <p>speed:</p>
            <p>estimate to destination:</p>
          </div>
          <Button variant={`destructive`} onClick={handleCancelMission}>
            Cancel Mission
          </Button>
        </div>
      )}
    </>
  );
}

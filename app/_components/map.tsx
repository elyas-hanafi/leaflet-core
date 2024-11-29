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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [43.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [43.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [33.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [33.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [53.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [53.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [50.97833571758883, 20.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [50.97833571758883, 20.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [50.97833571758883, 20.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 40.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 40.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 40.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 40.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [55.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [81.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [80.97833571758883, 28.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.97833571758883, 32.252707666241346],
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
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [25.97827769191508, 28.252452157174343],
    },
    properties: {
      ele: 969.808594,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL2",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [83.9781629749449, 28.252283018791324],
    },
    properties: {
      ele: 968.762085,
      time: "2019-05-13T00:00:00.000Z",
      Name: "SL3",
      Power_Watt: 30,
      pole_hgt: 8,
    },
  },
];

export default function Map({ zoomLevel }: { zoomLevel: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapWidget | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      containerRef.current &&
      !mapRef.current
    ) {
      mapRef.current = new MapWidget(containerRef.current);
      mapRef.current.addMarkersToCluster(data);
    }
  }, [zoomLevel]);

  const { isLocationEnabled, promptUserToEnableLocation, userLocation } =
    useGeolocationPrompt(mapRef.current!);
  const [installModal, setInstallModal] = useState<any>(true);
  function handelInstallModal() {
    pwaInstallHandler.install().catch((err) => console.log(err));
  }

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
      <div className="absolute bottom-28 w-[80%] mx-auto p-10 bg-white left-1/2 -translate-x-1/2 rounded-xl">
        {`${userLocation}`}
      </div>
    </>
  );
}

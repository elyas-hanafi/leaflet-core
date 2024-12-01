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
import { Icon } from "@/components/ui/icon";
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
  const [speed, setSpeed] = useState<number | null>(null); // State to track speed
  const [isStandalone, setIsStandalone] = useState(false);
  const [display, setMode] = useState<any>();

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);
  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)").matches
      ? "standalone"
      : window.matchMedia("(display-mode: fullscreen)").matches
      ? "fullscreen"
      : window.matchMedia("(display-mode: minimal-ui)").matches
      ? "minimal-ui"
      : "browser";
    setMode(displayMode);
  }, []);

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
  useEffect(() => {
    // If mission is active, start tracking speed
    if (isMissionActive) {
      const geoWatch = navigator.geolocation.watchPosition(
        (position) => {
          const { speed } = position.coords;
          if (speed != null) {
            setSpeed(speed); // Update the speed state
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

      // Cleanup on component unmount or when mission is canceled
      return () => {
        if (geoWatch) {
          navigator.geolocation.clearWatch(geoWatch);
        }
      };
    }
  }, [isMissionActive]);

  const { isLocationEnabled, promptUserToEnableLocation } =
    useGeolocationPrompt(mapRef.current!);

  function handelInstallModal() {
    pwaInstallHandler
      .install()
      .then(() => {
        setIsStandalone(true);
      })
      .catch((err) => console.log(err));
  }

  const handleCancelMission = () => {
    mapRef.current?.cancelMission(); // Cancel mission
    setIsMissionActive(false); // Update state
    setClusterModal(false);
  };

  const handleStartMission = () => {
    mapRef.current?.handleClusterClick(
      mapRef.current.clusterData.propagatedFrom.feature.geometry.coordinates.reverse()
    );
    setIsMissionActive(true); // Update state
    setClusterModal(false);
  };

  const handleSetMapViewToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.setMapViewToUserLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  return (
    <>
      <div
        className="w-full h-screen absolute inset-0 z-0" // Make the map container full screen
        ref={containerRef}
      />
      <Dialog open={!isStandalone} onOpenChange={setIsStandalone}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install our app</DialogTitle>
            <DialogDescription>
              Would you like to install this app for a better experience?{" "}
              {`${display}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handelInstallModal}>Install PWA</Button>
            <Button onClick={() => setIsStandalone(false)} variant={`outline`}>
              Close
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
      {!isStandalone && (
        <>
          <Dialog open={!isLocationEnabled}>
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
        <div className="absolute bottom-28 w-[80%] mx-auto p-10 items-center justify-between bg-white left-1/2 -translate-x-1/2 rounded-xl flex flex-col gap-y-4 md:flex-row">
          <div className="bg-slate-200 p-5 rounded-xl">
            <p>speed: {speed ? `${(speed * 3.6).toFixed(2)} km/h` : "N/A"}</p>
            <p>estimate to destination:</p>
          </div>
          <Button variant={`destructive`} onClick={handleCancelMission}>
            Cancel Mission
          </Button>
        </div>
      )}
      <Button
        variant={"outline"}
        className="absolute top-20 left-2 z-50"
        onClick={handleSetMapViewToUserLocation}
      >
        <Icon icon="teenyicons:location-outline" />
      </Button>
    </>
  );
}

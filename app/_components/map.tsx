"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { MapWidget } from "./map-widget";

export default function Map({ zoomLevel }: { zoomLevel: number }) {
  const containerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      className="w-full h-screen" // Make the map container full screen
      ref={containerRef}
    />
  );
}

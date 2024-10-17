"use client"; // Ensure you are using the client component

import { useRef, useEffect } from "react";
import { MapWidget } from "./map-widget";

export default function Map({ zoomLevel }: { zoomLevel: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapWidget | null>(null);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      mapRef.current = new MapWidget(containerRef.current);
    }
  }, [zoomLevel]);

  return (
    <div
      className="w-full h-screen" // Make the map container full screen
      ref={containerRef}
    />
  );
}

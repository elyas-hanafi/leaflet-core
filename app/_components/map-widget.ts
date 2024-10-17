import * as L from "leaflet";

export class MapWidget {
  map: L.Map;
  constructor(domNode: string | HTMLElement) {
    this.map = L.map(domNode, {
      zoomControl: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: true,
      zoomAnimation: true,
      touchZoom: false,
      zoomSnap: 0.1,
      minZoom: 4,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(this.map);

    this.map.setView([0, 0], 1); // Center the map with default zoom level
  }
  setZoom(level: number) {
    this.map.setZoom(level);
  }
}

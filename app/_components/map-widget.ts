import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

export class MapWidget {
  protected map: L.Map;
  private currentMarker: L.Marker | null = null; // Store the current marker reference

  constructor(domNode: string | HTMLElement) {
    this.map = this.initMap(domNode);
    this.map.on("click", (e: L.LeafletMouseEvent) => this.handleMapClick(e));
  }

  // Initialize the map with configuration
  private initMap(domNode: string | HTMLElement): L.Map {
    const map = L.map(domNode, {
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 4,
      attributionControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    map.setView([0, 0], 1); // Center the map
    return map;
  }

  // Handle map click events to add and remove marker
  protected handleMapClick(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng;

    // Remove the previous marker if it exists
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    // Add a new marker at the clicked position and store the reference
    this.currentMarker = L.marker([lat, lng]).addTo(this.map);
  }
}

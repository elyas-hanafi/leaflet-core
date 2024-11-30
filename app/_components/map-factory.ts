/* eslint-disable @typescript-eslint/no-explicit-any */
import * as L from "leaflet";
// Factory for creating map elements
export class MapElementFactory {
  // Creates and initializes a Leaflet map
  static createMap(domNode: string | HTMLElement): L.Map {
    const map = L.map(domNode, {
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 4, // Minimum zoom level for the map
      attributionControl: true,
    });

    // Adding OpenStreetMap tile layer
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Set initial map view (centered on a specific lat, lng with zoom level 11)
    map.setView([28.238, 83.9956], 11);
    return map;
  }

  // Creates a marker at the specified latitude and longitude, with an optional popup
  static createMarker(
    lat: number,
    lng: number,
    popupText: string = ""
  ): L.Marker {
    const marker = L.marker([lat, lng], {
      draggable: false,
    });
    if (popupText) marker.bindPopup(popupText); // If there's popup text, bind it to the marker
    return marker;
  }
  // Creates a routing control with the specified waypoints
  static createRoutingControl(waypoints: L.LatLng[]): L.Routing.Control {
    return L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      show: false, // Do not show the route automatically
      createMarker: () => null, // Disable the marker creation at start and end
    } as any); // Cast to any to bypass the TypeScript error
  }

  // Creates a MarkerClusterGroup (for clustering markers together)
  static createClusterGroup(): L.MarkerClusterGroup {
    return L.markerClusterGroup();
  }
}

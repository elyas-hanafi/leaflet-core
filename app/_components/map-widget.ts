/* eslint-disable @typescript-eslint/no-explicit-any */
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-routing-machine";
import "leaflet.markercluster";
import "./MarkerCluster.css";
import "./MarkerCluster.Default.css";

// Factory for creating map elements
class MapElementFactory {
  static createMap(domNode: string | HTMLElement): L.Map {
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

    map.setView([28.238, 83.9956], 11); // Center the map
    return map;
  }

  static createMarker(
    lat: number,
    lng: number,
    popupText: string = ""
  ): L.Marker {
    const marker = L.marker([lat, lng]);
    if (popupText) marker.bindPopup(popupText);
    return marker;
  }

  static createClusterGroup(): L.MarkerClusterGroup {
    return L.markerClusterGroup();
  }

  static createRoutingControl(waypoints: L.LatLng[]): L.Routing.Control {
    return L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      show: false,
    });
  }
}

// Observer for handling location updates
class LocationObserver {
  private observers: Array<(position: GeolocationPosition) => void> = [];

  addObserver(observer: (position: GeolocationPosition) => void) {
    this.observers.push(observer);
  }

  notifyObservers(position: GeolocationPosition) {
    this.observers.forEach((observer) => observer(position));
  }

  watchPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => this.notifyObservers(position),
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}

// Main MapWidget class
export class MapWidget {
  protected map: L.Map;
  private currentMarker: L.Marker | null = null;
  private userMarker: L.Marker | null = null;
  private clusterGroup: L.MarkerClusterGroup;
  public clusterData: any;
  public clusterModal: boolean;
  private locationObserver: LocationObserver;
  public locationActive: boolean;
  public isMissionActive: boolean; // Track if a mission is active
  private routingControl: L.Routing.Control | null = null; // Store the routing control

  constructor(
    domNode: string | HTMLElement,
    { onClusterClick }: { onClusterClick: () => void }
  ) {
    this.map = MapElementFactory.createMap(domNode);
    this.clusterGroup = MapElementFactory.createClusterGroup();
    this.locationObserver = new LocationObserver();
    this.locationActive = false;
    this.clusterModal = false;
    this.isMissionActive = false; // Initially, no mission
    this.init(onClusterClick);
  }

  // Initialize the map and add user location
  private init(onClusterClick: () => void) {
    this.clusterGroup.on("click", (e: any) => {
      if (this.isMissionActive) return; // Prevent click if mission is active
      this.clusterData = e;
      onClusterClick(); // Trigger callback when cluster is clicked
    });

    this.map.addLayer(this.clusterGroup);
  }

  // Handle cluster clicks and start routing
  public handleClusterClick(latlng: L.LatLng) {
    if (this.isMissionActive) return; // Don't allow clicks during an active mission
    if (!this.userMarker) {
      this.locationActive = false;
      return;
    }

    const userLatLng = this.userMarker.getLatLng();
    this.routingControl = MapElementFactory.createRoutingControl([
      userLatLng,
      latlng,
    ]);
    this.routingControl.addTo(this.map);
    this.followRoute(this.routingControl);
    this.isMissionActive = true; // Mark the mission as active
  }

  /* 
  Follow route and update user marker's position along the route
  Now includes arrival detection
*/
  private followRoute(routingControl: L.Routing.Control) {
    let routeCoordinates: any[] = [];

    routingControl.on("routesfound", (event) => {
      const routes = event.routes;
      routeCoordinates = routes[0].coordinates;

      if (!this.currentMarker) {
        this.currentMarker = MapElementFactory.createMarker(
          routeCoordinates[0].lat,
          routeCoordinates[0].lng
        ).addTo(this.map);
      }

      this.locationObserver.addObserver((position) => {
        const { latitude, longitude } = position.coords;
        const userPosition = L.latLng(latitude, longitude);
        const closestCoord = this.getClosestRouteCoordinate(
          userPosition,
          routeCoordinates
        );

        if (closestCoord) {
          this.currentMarker?.setLatLng(closestCoord);

          // Check if user has arrived at destination
          const destination = L.latLng(
            routeCoordinates[routeCoordinates.length - 1].lat,
            routeCoordinates[routeCoordinates.length - 1].lng
          );
          if (this.hasArrivedAtDestination(userPosition, destination)) {
            this.onArrival(destination); // Trigger arrival event or callback
          }
        }
      });
    });
  }

  /* 
  Callback to handle arrival at destination
*/
  private onArrival(destination: L.LatLng) {
    alert(`You have arrived at your destination: ${destination}`);
    // Perform any actions when the user arrives, like stopping routing, showing a message, etc.
    this.cancelMission(); // Optionally cancel the mission when arrived
  }

  /* 
  Method to check if the user has arrived at the destination
*/
  private hasArrivedAtDestination(
    userPosition: L.LatLng,
    destination: L.LatLng,
    arrivalThreshold: number = 20 // Threshold in meters (default: 20 meters)
  ): boolean {
    const distance = userPosition.distanceTo(destination);
    return distance <= arrivalThreshold; // If within threshold, consider arrival
  }

  // Cancel mission and remove routing
  public cancelMission() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl); // Remove the route
      this.routingControl = null;
    }
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker); // Remove the user marker
      this.currentMarker = null;
    }
    this.isMissionActive = false; // Set mission to inactive
  }

  // Helper to find the closest coordinate in the route
  private getClosestRouteCoordinate(
    userPosition: L.LatLng,
    routeCoordinates: any[]
  ) {
    let closestCoord = null;
    let minDistance = Infinity;

    routeCoordinates.forEach((coord) => {
      const distance = userPosition.distanceTo(L.latLng(coord.lat, coord.lng));
      if (distance < minDistance) {
        minDistance = distance;
        closestCoord = L.latLng(coord.lat, coord.lng);
      }
    });

    return closestCoord;
  }

  // Add data markers to the map and cluster them
  public addMarkersToCluster(data: any) {
    const geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    const lightData = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

    this.clusterGroup.addLayer(lightData);
  }

  // Set user's location from an external source (e.g., hook)
  public setUserLocation(lat: number, lng: number) {
    if (!this.userMarker) {
      this.userMarker = MapElementFactory.createMarker(
        lat,
        lng,
        "You are here."
      ).addTo(this.map);
      this.map.setView([lat, lng], 25); // Zoom to the user's location
    } else {
      this.userMarker.setLatLng([lat, lng]);
    }

    // Optionally, add user's location to the cluster
    this.clusterGroup.addLayer(this.userMarker);
  }

  public setMapViewToUserLocation(lat: number, lng: number) {
    this.map.setView([lat, lng], 2); // Adjust zoom level as necessary
  }
}

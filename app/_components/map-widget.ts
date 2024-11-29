/* eslint-disable @typescript-eslint/no-explicit-any */
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-routing-machine";
import "leaflet.markercluster";
import "./MarkerCluster.css";
import "./MarkerCluster.Default.css";
import { MapElementFactory } from "./map-factory";
import { LocationObserver } from "./map-observer";

export class MapWidget {
  protected map: L.Map;
  private currentMarker: L.Marker | null = null; // Marker to show user's progress along the route
  private userMarker: L.Marker | null = null; // Marker for user's location
  private clusterGroup: L.MarkerClusterGroup; // Cluster group to hold markers
  public clusterData: any; // Data related to a clicked cluster (not well defined)
  public clusterModal: boolean; // Control the visibility of the cluster modal
  private locationObserver: LocationObserver;
  public locationActive: boolean;
  public isMissionActive: boolean; // Track if a mission (route following) is active
  private routingControl: L.Routing.Control | null = null; // Control for route path

  constructor(
    domNode: string | HTMLElement,
    { onClusterClick }: { onClusterClick: () => void } // Callback for when a cluster is clicked
  ) {
    this.map = MapElementFactory.createMap(domNode);
    this.clusterGroup = MapElementFactory.createClusterGroup();
    this.locationObserver = new LocationObserver();
    this.locationActive = false;
    this.clusterModal = false;
    this.isMissionActive = false; // Initially no mission is active
    this.init(onClusterClick); // Initialize the map widget
  }

  private init(onClusterClick: () => void) {
    this.clusterGroup.on("click", (e: any) => {
      if (this.isMissionActive) return; // Prevent cluster clicks if mission is active
      this.clusterData = e;
      onClusterClick(); // Trigger callback on cluster click
    });

    this.map.addLayer(this.clusterGroup);

    this.locationObserver.watchPosition(); // Start location tracking
  }

  // Stop watching user's location
  public stopLocationTracking() {
    this.locationObserver.stopWatching();
  }

  // Handle cluster click logic (start mission if not active)
  public handleClusterClick(latlng: L.LatLng) {
    if (this.isMissionActive) return; // Prevent starting a new mission if one is active
    if (!this.userMarker) {
      this.locationActive = false; // If no user marker, don't start a mission
      return;
    }

    const userLatLng = this.userMarker.getLatLng();
    this.routingControl = MapElementFactory.createRoutingControl([
      userLatLng,
      latlng,
    ]);
    this.routingControl.addTo(this.map);
    this.followRoute(this.routingControl); // Follow the route after creation
    this.isMissionActive = true; // Mark mission as active
  }

  // Follow the route and update the user's position on it
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

      // Observe user's position and update current marker's position along the route
      this.locationObserver.addObserver((position) => {
        const { latitude, longitude } = position.coords;
        const userPosition = L.latLng(latitude, longitude);
        const closestCoord = this.getClosestRouteCoordinate(
          userPosition,
          routeCoordinates
        );

        if (closestCoord) {
          this.currentMarker?.setLatLng(closestCoord); // Update marker position

          // Check if user has arrived at destination
          const destination = L.latLng(
            routeCoordinates[routeCoordinates.length - 1].lat,
            routeCoordinates[routeCoordinates.length - 1].lng
          );
          if (this.hasArrivedAtDestination(userPosition, destination)) {
            this.onArrival(destination);
          }
        }
      });
    });
  }

  // Callback to handle arrival at destination

  private onArrival(destination: L.LatLng) {
    alert(`You have arrived at your destination: ${destination}`);
    this.cancelMission(); // Optionally cancel the mission upon arrival
  }

  //Method to check if the user has arrived at the destination

  private hasArrivedAtDestination(
    userPosition: L.LatLng,
    destination: L.LatLng,
    arrivalThreshold: number = 20 // Threshold in meters (default: 20 meters)
  ): boolean {
    const distance = userPosition.distanceTo(destination);
    return distance <= arrivalThreshold; // If within threshold, consider arrival
  }

  // Cancel the mission (remove route and current marker)
  public cancelMission() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl); // Remove route
      this.routingControl = null;
    }
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker); // Remove current marker
      this.currentMarker = null;
    }
    this.isMissionActive = false; // Mission is no longer active
  }

  // Helper to find the closest coordinate in the route
  private getClosestRouteCoordinate(
    userPosition: L.LatLng,
    routeCoordinates: any[]
  ): any {
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

    this.clusterGroup.addLayer(lightData); // Add clustered markers to the map
  }

  // Set map view to user's location with a specified zoom level
  public setMapViewToUserLocation(lat: number, lng: number) {
    this.userMarker = MapElementFactory.createMarker(
      lat,
      lng,
      "You are here."
    ).addTo(this.map);
    this.map.flyTo([lat, lng], 17); // Adjust zoom level as necessary
  }
}

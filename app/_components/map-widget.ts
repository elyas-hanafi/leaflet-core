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
      routeWhileDragging: true,
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
        { enableHighAccuracy: true, maximumAge: 100, timeout: 200 }
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
  private locationObserver: LocationObserver;
  public locationActive: boolean;

  constructor(domNode: string | HTMLElement) {
    this.map = MapElementFactory.createMap(domNode);
    this.clusterGroup = MapElementFactory.createClusterGroup();
    this.locationObserver = new LocationObserver();
    this.locationActive = false;
    this.init();
  }

  // Initialize the map and add user location
  private init() {
    this.clusterGroup.on("click", (e: any) => {
      this.handleClusterClick(e.latlng);
    });
    this.map.addLayer(this.clusterGroup);
    this.addUserLocation();
  }

  // Add the user's location to the map
  private addUserLocation() {
    const updateUserLocation = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      if (!this.userMarker) {
        this.userMarker = MapElementFactory.createMarker(
          latitude,
          longitude,
          "You are here."
        ).addTo(this.map);
        this.map.setView([latitude, longitude], 13); // Zoom in
      } else {
        this.userMarker.setLatLng([latitude, longitude]);
      }

      // Optionally add user's location to the cluster
      this.clusterGroup.addLayer(this.userMarker);
    };

    this.locationObserver.addObserver(updateUserLocation);
    this.locationObserver.watchPosition();
  }

  // Handle cluster clicks and start routing
  private handleClusterClick(latlng: L.LatLng) {
    if (!this.userMarker) {
      // alert("User location not available.");
      this.locationActive = false;
      return;
    }

    const userLatLng = this.userMarker.getLatLng();
    const routingControl = MapElementFactory.createRoutingControl([
      userLatLng,
      latlng,
    ]);

    routingControl.addTo(this.map);
    this.followRoute(routingControl);
    this.locationActive = true;
  }

  // Follow route and update user marker's position along the route
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
        }
      });
    });
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
      onEachFeature: (feature, layer) => {
        const popupContent = `
          <h4 class="text-primary">Street Light</h4>
          <div class="container">
            <table class="table table-striped">
              <thead><tr><th>Properties</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>Name</td><td>${feature.properties.Name}</td></tr>
                <tr><td>Elevation</td><td>${feature.properties.ele}</td></tr>
                <tr><td>Power (watt)</td><td>${feature.properties.Power_Watt}</td></tr>
                <tr><td>Pole Height</td><td>${feature.properties.pole_hgt}</td></tr>
                <tr><td>Time</td><td>${feature.properties.time}</td></tr>
              </tbody>
            </table>
          </div>
        `;
        layer.bindPopup(popupContent);
      },
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

    this.clusterGroup.addLayer(lightData);
  }
}

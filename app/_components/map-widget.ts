/* eslint-disable @typescript-eslint/no-explicit-any */
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-routing-machine"; // Import the leaflet routing machine
import "leaflet.markercluster"; // Import MarkerCluster plugin
import "./MarkerCluster.css"; // Import MarkerCluster plugin
import "./MarkerCluster.Default.css"; // Import MarkerCluster plugin

export class MapWidget {
  protected map: L.Map;
  private currentMarker: L.Marker | null = null; // Store the current marker reference
  private userMarker: L.Marker | null = null; // User's location marker
  private clusterGroup: L.MarkerClusterGroup;

  constructor(domNode: string | HTMLElement) {
    this.map = this.initMap(domNode);
    this.clusterGroup = L.markerClusterGroup(); // Initialize the cluster group

    // Listen for cluster clicks
    this.clusterGroup.on("click", (e: any) => {
      this.handleClusterClick(e.latlng);
    });

    this.addUserLocation(); // Add user's location to map
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

    map.setView([28.238, 83.9956], 11); // Center the map to your start point
    return map;
  }

  // Add the user's location to the map
  private addUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.userMarker = L.marker([latitude, longitude])
            .addTo(this.map)
            .bindPopup("You are here.");
          this.map.setView([latitude, longitude], 13); // Zoom in on user's location

          // Optionally add the user's location to the cluster group
          this.clusterGroup.addLayer(this.userMarker);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  protected handleClusterClick(e: any) {
    const { lat, lng } = e;

    if (this.userMarker) {
      // Use the user's current location as the starting point for the route
      const userLatLng = this.userMarker.getLatLng();

      // Initialize routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLatLng.lat, userLatLng.lng), // User's current location
          L.latLng(lat, lng), // Destination (clicked marker's position)
        ],
        routeWhileDragging: true, // Allow the route to update while dragging
      }).addTo(this.map);

      let routeCoordinates: any[] = [];

      // Get the route coordinates after it's found
      routingControl.on("routesfound", (event) => {
        const routes = event.routes;
        routeCoordinates = routes[0].coordinates; // We assume we're taking the first route

        // Initialize current marker (if not already initialized)
        if (!this.currentMarker) {
          this.currentMarker = L.marker([userLatLng.lat, userLatLng.lng]).addTo(
            this.map
          );
        }

        // Continuously watch for position updates
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            if (this.currentMarker) {
              const userPosition = L.latLng(latitude, longitude);

              // Update the marker location based on real-time geolocation
              this.currentMarker.setLatLng(userPosition);

              // Optionally, calculate the closest route coordinate to the user's location
              const closestCoord = this.getClosestRouteCoordinate(
                userPosition,
                routeCoordinates
              );

              // If the user is close to a route point, move the marker along the route
              if (closestCoord) {
                this.currentMarker.setLatLng(closestCoord);
              }
            }
          },
          (error) => {
            console.error("Error retrieving geolocation:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 5000,
          }
        );

        // Stop watching once the user has reached the destination or at some condition
        routingControl.on("routefound", () => {
          // Stop watching the user's geolocation when the route is found
          navigator.geolocation.clearWatch(watchId);
        });
      });
    } else {
      alert("User location not available.");
    }
  }

  // Helper function to find the closest coordinate in the route
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
        const popupContent =
          '<h4 class = "text-primary">Street Light</h4>' +
          '<div class="container"><table class="table table-striped">' +
          "<thead><tr><th>Properties</th><th>Value</th></tr></thead>" +
          "<tbody><tr><td> Name </td><td>" +
          feature.properties.Name +
          "</td></tr>" +
          "<tr><td>Elevation </td><td>" +
          feature.properties.ele +
          "</td></tr>" +
          "<tr><td> Power (watt) </td><td>" +
          feature.properties.Power_Watt +
          "</td></tr>" +
          "<tr><td> Pole Height </td><td>" +
          feature.properties.pole_hgt +
          "</td></tr>" +
          "<tr><td> Time </td><td>" +
          feature.properties.time +
          "</td></tr>";

        layer.bindPopup(popupContent);
      },
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

    // Add the geojson data to the cluster group
    this.clusterGroup.addLayer(lightData);

    // Add the cluster group to the map
    this.map.addLayer(this.clusterGroup);
  }
}

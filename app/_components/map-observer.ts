// Observer pattern to handle location updates
export class LocationObserver {
  private observers: Array<(position: GeolocationPosition) => void> = [];
  private geoWatchId: number | null = null;

  // Add an observer that will be notified when the location changes
  addObserver(observer: (position: GeolocationPosition) => void) {
    this.observers.push(observer);
  }

  // Notify all observers of a new location
  notifyObservers(position: GeolocationPosition) {
    this.observers.forEach((observer) => observer(position));
  }

  // Start watching the user's location
  watchPosition() {
    if (navigator.geolocation && !this.geoWatchId) {
      this.geoWatchId = navigator.geolocation.watchPosition(
        (position) => this.notifyObservers(position), // Callback on position change
        (error) => console.error("Geolocation error:", error), // Handle error
        {
          enableHighAccuracy: true, // High accuracy location tracking
          timeout: 15000, // Timeout after 15 seconds
          maximumAge: 0, // Do not use cached location, always fetch fresh
        }
      );
    } else {
      console.error("Geolocation not supported or already watching position.");
    }
  }

  // Stop watching the user's location
  stopWatching() {
    if (this.geoWatchId !== null) {
      navigator.geolocation.clearWatch(this.geoWatchId); // Stop watching location
      this.geoWatchId = null;
    }
  }
}

import Map from "./_components/map";
import "leaflet/dist/leaflet.css";
export default function Home() {
  return (
    <>
      <Map zoomLevel={1} />
    </>
  );
}

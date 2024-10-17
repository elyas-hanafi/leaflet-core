import Map from "./_components/map";

export default function Home() {
  const zoomLevel = 5;

  return (
    <>
      <Map zoomLevel={zoomLevel} />
    </>
  );
}

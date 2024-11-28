import dynamic from "next/dynamic";
const Map = dynamic(() => import("./_components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const zoomLevel = 5;

  return (
    <>
      <Map zoomLevel={zoomLevel} />
    </>
  );
}

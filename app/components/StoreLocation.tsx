// app/components/StoreLocation.tsx
"use client";

import dynamic from "next/dynamic";



// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);


const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);


const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);


const AltScrollZoom = dynamic(() => import("./AltScrollZoom"), { ssr: false });

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

interface StoreLocationProps {
  target?: [number, number];
}


export default function StoreLocation({ target }: StoreLocationProps) {
  const mapRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const [DefaultIcon, setDefaultIcon] = useState<any>(null);
  // Load Leaflet only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet);
        const icon = leaflet.icon({
          iconUrl: "/burnbox-logo-only.png",
          iconSize: [70, 70],
          iconAnchor: [12, 41],
        });
        setDefaultIcon(icon);
      });
    }
  }, []);
  useEffect(() => {
    if (target && mapRef.current) {
      mapRef.current.flyTo(target, 17, { duration: 1.5 });
    }
  }, [target]);
  // Don't render the map until leaflet and icon are ready
  if (!L || !DefaultIcon) return null;

  return (
    <MapContainer
      center={[14.428425252312016, 120.98849405250161]}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom={false}
      dragging={true}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        minZoom={15}
      />
      <Marker
        position={[14.428425252312016, 120.98849405250161]}
        title="Burnbox Main Office"
        icon={DefaultIcon}
      >
        <Popup>📍 Burnbox Main Office</Popup>
      </Marker>
      <AltScrollZoom />
    </MapContainer>
  );
}

function handleWheel(this: HTMLElement, ev: WheelEvent) {
  throw new Error("Function not implemented.");
}


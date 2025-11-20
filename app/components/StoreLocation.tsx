// app/components/StoreLocation.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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

interface StoreLocationProps {
  target?: [number, number];
  mapStyle?: string;
}

export default function StoreLocation({ target, mapStyle = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' }: StoreLocationProps) {
  const mapRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const [DefaultIcon, setDefaultIcon] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load Leaflet only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet);
        
        // Fix for default markers in react-leaflet
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });

        const customIcon = leaflet.icon({
          iconUrl: "/burnbox-logo-only.png",
          iconSize: [50, 50],
          iconAnchor: [25, 50],
          popupAnchor: [0, -50],
        });
        
        setDefaultIcon(customIcon);
        setIsMapReady(true);
      });
    }
  }, []);

  // Fly to target when it changes
  useEffect(() => {
    if (target && mapRef.current && isMapReady) {
      mapRef.current.flyTo(target, 17, { 
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [target, isMapReady]);

  // Don't render the map until leaflet and icon are ready
  if (!isMapReady || !L || !DefaultIcon) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[14.428425252312016, 120.98849405250161]}
      zoom={15}
      className="h-full w-full"
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
      attributionControl={false}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={mapStyle}
        maxZoom={19}
        minZoom={10}
      />
      <Marker
        position={[14.428425252312016, 120.98849405250161]}
        title="Burnbox BF Resort Branch"
        icon={DefaultIcon}
      >
        <Popup className="custom-popup">
          <div className="text-center">
            <strong>📍 Burnbox Printing</strong><br />
            BF Resort Branch<br />
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=14.428425252312016,120.98849405250161`, '_blank')}
              className="mt-2 px-3 py-1 bg-pink-500 text-white rounded text-sm hover:bg-pink-600"
            >
              Get Directions
            </button>
          </div>
        </Popup>
      </Marker>
      <AltScrollZoom />
    </MapContainer>
  );
}
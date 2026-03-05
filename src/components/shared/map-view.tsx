"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

// Fix leaflet default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  href: string;
  subtitle?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  className?: string;
}

export function MapView({ markers, className }: MapViewProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Calculate center from markers or default to Australia
  const center: [number, number] =
    markers.length > 0
      ? [
          markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
          markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
        ]
      : [-25.27, 133.77];

  const zoom = markers.length > 0 ? 5 : 4;

  return (
    <div className={className}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, i) => (
          <Marker key={i} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="text-sm">
                <Link
                  href={marker.href}
                  className="font-medium hover:underline"
                >
                  {marker.title}
                </Link>
                {marker.subtitle && (
                  <p className="text-muted-foreground mt-0.5">
                    {marker.subtitle}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

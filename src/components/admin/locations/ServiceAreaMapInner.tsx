"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet Pin Icon factory anchored accurately at its bottom tip (19px, 42px)
function getCustomMarkerIcon() {
  if (typeof window === "undefined") return undefined;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 38px;
      height: 42px;
    ">
      <div style="
        background-color: #EF4444;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
        border: 3px solid #FFFFFF;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="
        width: 8px;
        height: 3px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        margin-top: 1px;
        filter: blur(1px);
      "></div>
    </div>`,
    iconSize: [38, 42],
    iconAnchor: [19, 42],
  });
}

interface ServiceAreaMapInnerProps {
  latitude: number;
  longitude: number;
  radiusKm: number;
  flyToTrigger?: number;
  onMarkerDragEnd: (lat: number, lng: number) => void;
}

// Controller component: Only flies to location when flyToTrigger increments (on search selection)
function MapFlyController({
  lat,
  lng,
  flyToTrigger,
}: {
  lat: number;
  lng: number;
  flyToTrigger?: number;
}) {
  const map = useMap();
  const prevTriggerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (
      flyToTrigger !== undefined &&
      flyToTrigger !== prevTriggerRef.current &&
      lat &&
      lng &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      prevTriggerRef.current = flyToTrigger;
      map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [flyToTrigger, lat, lng, map]);

  return null;
}

export default function ServiceAreaMapInner({
  latitude,
  longitude,
  radiusKm,
  flyToTrigger,
  onMarkerDragEnd,
}: ServiceAreaMapInnerProps) {
  const markerRef = useRef<L.Marker>(null);
  const customMarkerIcon = useMemo(() => getCustomMarkerIcon(), []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onMarkerDragEnd(lat, lng);
        }
      },
    }),
    [onMarkerDragEnd]
  );

  const radiusInMeters = (radiusKm || 10) * 1000;
  const markerPosition: [number, number] = [
    latitude || 13.0827,
    longitude || 80.2707,
  ];

  return (
    <MapContainer
      center={markerPosition}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFlyController
        lat={latitude}
        lng={longitude}
        flyToTrigger={flyToTrigger}
      />

      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={markerPosition}
        ref={markerRef}
        {...(customMarkerIcon ? { icon: customMarkerIcon } : {})}
      />

      <Circle
        center={markerPosition}
        radius={radiusInMeters}
        pathOptions={{
          color: "#3B82F6",
          fillColor: "#3B82F6",
          fillOpacity: 0.15,
          weight: 2,
        }}
      />
    </MapContainer>
  );
}

"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
    latitude: number;
    longitude: number;
    vehicleNo?: string;
}

// ======================================
// AMBULANCE ICON
// ======================================

const ambulanceIcon = L.icon({
    iconUrl: "/ambu.jpg",
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
});

// ======================================
// UPDATE MAP CENTER WHEN LOCATION CHANGES
// ======================================

function MapUpdater({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(
            [latitude, longitude],
            map.getZoom(),
            {
                animate: true,
                duration: 1,
            }
        );
    }, [latitude, longitude, map]);

    return null;
}

// ======================================
// TRACKING MAP
// ======================================

export default function TrackingMap({
    latitude,
    longitude,
    vehicleNo,
}: MapProps) {
    return (
        <div className="w-full h-[450px] rounded-xl overflow-hidden border shadow-sm">

            <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
            >

                {/* OpenStreetMap */}
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Move map when API gives new location */}
                <MapUpdater
                    latitude={latitude}
                    longitude={longitude}
                />

                {/* Ambulance Marker */}
                <Marker
                    position={[
                        latitude,
                        longitude,
                    ]}
                    icon={ambulanceIcon}
                >
                    <Popup>
                        <div className="text-sm">

                            <p className="font-bold">
                                🚑 Ambulance
                            </p>

                            <p>
                                Vehicle:{" "}
                                {vehicleNo || "Unknown"}
                            </p>

                            <p>
                                📍{" "}
                                {latitude.toFixed(6)},{" "}
                                {longitude.toFixed(6)}
                            </p>

                        </div>
                    </Popup>
                </Marker>

            </MapContainer>

        </div>
    );
}
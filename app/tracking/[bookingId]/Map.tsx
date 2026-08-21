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
// MAP CENTER UPDATER
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
        <div
            className="
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border border-white/6
                bg-[#070A12]
                shadow-2xl
            "
        >

            {/* ======================================
                HEADER
            ====================================== */}

            <div
                className="
                    relative
                    border-b border-white/6
                    bg-white/2
                    px-4 py-4
                    sm:px-5
                    backdrop-blur-xl
                "
            >

                {/* Gradient Line */}

                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-0.5
                        w-full
                        bg-linear-to-r
                        from-violet-500
                        via-cyan-400
                        to-lime-400
                    "
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* LEFT */}

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-11 w-11
                                shrink-0
                                items-center justify-center
                                rounded-xl
                                border border-cyan-400/20
                                bg-cyan-400/5
                                shadow-lg
                                shadow-cyan-500/5
                            "
                        >
                            <span className="text-xl">
                                🚑
                            </span>
                        </div>

                        <div>

                            <div className="flex items-center gap-2">

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        tracking-wide
                                        text-white
                                        sm:text-base
                                    "
                                >
                                    Live Vehicle Preview
                                </h2>

                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Real-time ambulance location tracking
                            </p>

                        </div>

                    </div>

                    {/* LIVE STATUS */}

                    <div
                        className="
                            flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border border-lime-400/20
                            bg-lime-400/5
                            px-3 py-1.5
                        "
                    >

                        <span className="relative flex h-2 w-2">

                            <span
                                className="
                                    absolute
                                    inline-flex
                                    h-full w-full
                                    animate-ping
                                    rounded-full
                                    bg-lime-400
                                    opacity-75
                                "
                            />

                            <span
                                className="
                                    relative
                                    inline-flex
                                    h-2 w-2
                                    rounded-full
                                    bg-lime-400
                                "
                            />

                        </span>

                        <span
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-lime-300
                            "
                        >
                            Live
                        </span>

                    </div>

                </div>

            </div>

            {/* ======================================
                MAP AREA
            ====================================== */}

            <div className="relative h-[400px] w-full sm:h-[450px]">

                <MapContainer
                    center={[latitude, longitude]}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    {/* OpenStreetMap */}

                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Update map */}

                    <MapUpdater
                        latitude={latitude}
                        longitude={longitude}
                    />

                    {/* Ambulance */}

                    <Marker
                        position={[
                            latitude,
                            longitude,
                        ]}
                        icon={ambulanceIcon}
                    >

                        <Popup>

                            <div className="min-w-[180px]">

                                <p className="mb-2 font-bold text-slate-900">
                                    🚑 Ambulance
                                </p>

                                <p className="text-sm text-slate-700">
                                    <strong>Vehicle:</strong>{" "}
                                    {vehicleNo || "Unknown"}
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    📍 {latitude.toFixed(6)},{" "}
                                    {longitude.toFixed(6)}
                                </p>

                            </div>

                        </Popup>

                    </Marker>

                </MapContainer>

                {/* ======================================
                    VEHICLE INFO CARD
                ====================================== */}

                <div
                    className="
                        absolute
                        right-3
                        top-3
                        z-[1000]
                        w-[190px]
                        rounded-xl
                        border border-white/6
                        bg-[#070A12]/95
                        p-3
                        shadow-2xl
                        backdrop-blur-xl
                        sm:right-4
                        sm:top-4
                    "
                >

                    {/* Vehicle */}

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-9 w-9
                                items-center justify-center
                                rounded-lg
                                border border-violet-400/20
                                bg-violet-400/5
                            "
                        >
                            🚑
                        </div>

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-widest
                                    text-slate-500
                                "
                            >
                                Vehicle
                            </p>

                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-bold
                                    text-white
                                "
                            >
                                {vehicleNo || "Unknown"}
                            </p>

                        </div>

                    </div>

                    {/* Divider */}

                    <div className="my-3 h-px bg-white/6" />

                    {/* GPS */}

                    <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                        <span className="text-[10px] text-cyan-300">
                            GPS Connected
                        </span>

                    </div>

                </div>

                {/* ======================================
                    LIVE LOCATION CARD
                ====================================== */}

                <div
                    className="
                        absolute
                        bottom-3
                        left-3
                        z-[1000]
                        max-w-[calc(100%-24px)]
                        rounded-xl
                        border border-white/6
                        bg-[#070A12]/95
                        px-4 py-3
                        shadow-2xl
                        backdrop-blur-xl
                        sm:bottom-4
                        sm:left-4
                    "
                >

                    <div className="flex items-center gap-3">

                        {/* Location Icon */}

                        <div
                            className="
                                flex
                                h-9 w-9
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                border border-cyan-400/20
                                bg-cyan-400/5
                            "
                        >
                            📍
                        </div>

                        <div>

                            <p
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-widest
                                    text-slate-500
                                "
                            >
                                Current Location
                            </p>

                            <p
                                className="
                                    mt-1
                                    font-mono
                                    text-[10px]
                                    text-cyan-300
                                    sm:text-[11px]
                                "
                            >
                                {latitude.toFixed(6)},{" "}
                                {longitude.toFixed(6)}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ======================================
                FOOTER
            ====================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    border-t border-white/6
                    bg-white/2
                    px-4 py-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >

                {/* Status */}

                <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />

                    <span className="text-[10px] text-slate-500">
                        Location updates automatically
                    </span>

                </div>

                {/* Coordinates */}

                <div className="flex gap-4 text-[10px]">

                    <span className="text-slate-500">
                        Lat:
                        <span className="ml-1 font-mono text-slate-300">
                            {latitude.toFixed(4)}
                        </span>
                    </span>

                    <span className="text-slate-500">
                        Lng:
                        <span className="ml-1 font-mono text-slate-300">
                            {longitude.toFixed(4)}
                        </span>
                    </span>

                </div>

            </div>

        </div>
    );
}


// "use client";

// import {
//     MapContainer,
//     TileLayer,
//     Marker,
//     Popup,
//     useMap,
// } from "react-leaflet";

// import L from "leaflet";
// import { useEffect } from "react";
// import "leaflet/dist/leaflet.css";

// interface MapProps {
//     latitude: number;
//     longitude: number;
//     vehicleNo?: string;
// }

// // ======================================
// // AMBULANCE ICON
// // ======================================

// const ambulanceIcon = L.icon({
//     iconUrl: "/ambu.jpg",
//     iconSize: [45, 45],
//     iconAnchor: [22, 45],
//     popupAnchor: [0, -45],
// });

// // ======================================
// // UPDATE MAP CENTER WHEN LOCATION CHANGES
// // ======================================

// function MapUpdater({
//     latitude,
//     longitude,
// }: {
//     latitude: number;
//     longitude: number;
// }) {
//     const map = useMap();

//     useEffect(() => {
//         map.flyTo(
//             [latitude, longitude],
//             map.getZoom(),
//             {
//                 animate: true,
//                 duration: 1,
//             }
//         );
//     }, [latitude, longitude, map]);

//     return null;
// }

// // ======================================
// // TRACKING MAP
// // ======================================

// export default function TrackingMap({
//     latitude,
//     longitude,
//     vehicleNo,
// }: MapProps) {
//     return (
//         <div className="w-full h-[450px] rounded-xl overflow-hidden border shadow-sm">

//             <MapContainer
//                 center={[latitude, longitude]}
//                 zoom={15}
//                 scrollWheelZoom={true}
//                 className="w-full h-full"
//             >

//                 {/* OpenStreetMap */}
//                 <TileLayer
//                     attribution="&copy; OpenStreetMap contributors"
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />

//                 {/* Move map when API gives new location */}
//                 <MapUpdater
//                     latitude={latitude}
//                     longitude={longitude}
//                 />

//                 {/* Ambulance Marker */}
//                 <Marker
//                     position={[
//                         latitude,
//                         longitude,
//                     ]}
//                     icon={ambulanceIcon}
//                 >
//                     <Popup>
//                         <div className="text-sm">

//                             <p className="font-bold">
//                                 🚑 Ambulance
//                             </p>

//                             <p>
//                                 Vehicle:{" "}
//                                 {vehicleNo || "Unknown"}
//                             </p>

//                             <p>
//                                 📍{" "}
//                                 {latitude.toFixed(6)},{" "}
//                                 {longitude.toFixed(6)}
//                             </p>

//                         </div>
//                     </Popup>
//                 </Marker>

//             </MapContainer>

//         </div>
//     );
// }
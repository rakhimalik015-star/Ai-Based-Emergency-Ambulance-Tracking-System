"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

interface TrackingData {
    bookingId: string;
    status: string;
    ambulanceAssigned: boolean;
    vehicleNo?: string;
    ambulanceType?: string;
    ambulanceStatus?: string;
    latitude: number | null;
    longitude: number | null;
}

interface Hospital {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    bedsAvailable: number;
    icuAvailable: number;
    emergencySupport: boolean;
    trafficLevel: "Low" | "Medium" | "High";
    distance: number;
    score: number;
}

interface HospitalRecommendation {
    recommendedHospital: Hospital;
    hospitals: Hospital[];
}

const TrackingMap = dynamic(
    () => import("./Map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[450px] flex items-center justify-center bg-gray-200 rounded-xl">
                Loading Map...
            </div>
        ),
    }
);

export default function TrackingPage() {
    const params = useParams();

    const bookingId = params.bookingId as string;

    const [tracking, setTracking] =
        useState<TrackingData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [lastUpdated, setLastUpdated] =
        useState<Date | null>(null);

    const [error, setError] =
        useState("");

    // ==========================================
    // HOSPITAL RECOMMENDATION
    // ==========================================

    const [hospitalData, setHospitalData] =
        useState<HospitalRecommendation | null>(null);

    const [hospitalLoading, setHospitalLoading] =
        useState(false);

    const [hospitalError, setHospitalError] =
        useState("");

    // ==========================================
    // GET HOSPITAL RECOMMENDATION
    // ==========================================

    const getHospitalRecommendation = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            setHospitalLoading(true);
            setHospitalError("");

            const res = await fetch(
                "/api/hospitals/recommend",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        latitude,
                        longitude,
                    }),
                    cache: "no-store",
                }
            );

            const result = await res.json();

            if (!result.success) {
                setHospitalError(
                    result.message ||
                    "Unable to get hospital recommendation"
                );

                return;
            }

            setHospitalData({
                recommendedHospital:
                    result.recommendedHospital,
                hospitals:
                    result.hospitals,
            });

        } catch (error) {
            console.log(
                "HOSPITAL RECOMMENDATION ERROR:",
                error
            );

            setHospitalError(
                "Unable to load hospital recommendation"
            );
        } finally {
            setHospitalLoading(false);
        }
    };

    // ==========================================
    // GET TRACKING DATA
    // ==========================================

    const getTracking = async () => {
        try {
            const res = await fetch(
                `/api/tracking/${bookingId}`,
                {
                    cache: "no-store",
                }
            );

            const data = await res.json();

            if (data.success) {
                const currentTracking =
                    data.tracking;

                setTracking(currentTracking);

                setLastUpdated(new Date());

                setError("");

                // ==================================
                // HOSPITAL RECOMMENDATION
                // ==================================

                if (
                    currentTracking.latitude !==
                        null &&
                    currentTracking.longitude !==
                        null
                ) {
                    await getHospitalRecommendation(
                        currentTracking.latitude,
                        currentTracking.longitude
                    );
                }

            } else {
                setError(
                    data.message ||
                    "Tracking data not found"
                );
            }

        } catch (error) {
            console.log(
                "TRACKING PAGE ERROR:",
                error
            );

            setError(
                "Unable to load tracking data"
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD + AUTO REFRESH
    // ==========================================

    useEffect(() => {
        if (!bookingId) return;

        getTracking();

        const interval = setInterval(() => {
            getTracking();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, [bookingId]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">

                    <div className="text-5xl mb-4">
                        🚑
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Loading Live Tracking...
                    </h1>

                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error || !tracking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white shadow rounded-xl p-8 text-center">

                    <div className="text-5xl mb-4">
                        ❌
                    </div>

                    <h1 className="text-2xl font-bold text-red-600">
                        Tracking data not found
                    </h1>

                    <p className="text-gray-600 mt-2">
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // STATUS
    // ==========================================

    const isMoving =
        tracking.status === "On the Way";

    const isArrived =
        tracking.status === "Arrived";

    const isCompleted =
        tracking.status === "Completed";

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    🚑 Live Ambulance Tracking
                </h1>

                <p className="text-gray-500 mt-2">
                    Track your ambulance location and trip status.
                </p>

            </div>

            {/* ======================================
                BOOKING STATUS
            ====================================== */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h2 className="text-2xl font-bold mb-6">
                    Booking Status
                </h2>

                <div className="mb-5">

                    <p className="text-gray-500">
                        Booking ID
                    </p>

                    <p className="font-semibold break-all">
                        {tracking.bookingId}
                    </p>

                </div>

                <div>

                    <p className="text-gray-500 mb-2">
                        Current Status
                    </p>

                    <span
                        className={`inline-block px-5 py-2 rounded-full font-semibold text-white ${
                            tracking.status ===
                            "Approved"
                                ? "bg-yellow-500"
                                : tracking.status ===
                                  "On the Way"
                                ? "bg-blue-600"
                                : tracking.status ===
                                  "Arrived"
                                ? "bg-green-600"
                                : tracking.status ===
                                  "Completed"
                                ? "bg-gray-600"
                                : "bg-gray-500"
                        }`}
                    >
                        {tracking.status}
                    </span>

                </div>

                {/* TRIP PROGRESS */}

                <div className="mt-8">

                    <p className="font-bold mb-4">
                        Trip Progress
                    </p>

                    <div className="flex flex-wrap items-center gap-2">

                        <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
                            ✓ Approved
                        </span>

                        <span>→</span>

                        <span
                            className={`px-3 py-2 rounded-lg font-semibold ${
                                isMoving ||
                                isArrived ||
                                isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {isMoving ||
                            isArrived ||
                            isCompleted
                                ? "✓ On the Way"
                                : "On the Way"}
                        </span>

                        <span>→</span>

                        <span
                            className={`px-3 py-2 rounded-lg font-semibold ${
                                isArrived ||
                                isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {isArrived ||
                            isCompleted
                                ? "✓ Arrived"
                                : "Arrived"}
                        </span>

                        <span>→</span>

                        <span
                            className={`px-3 py-2 rounded-lg font-semibold ${
                                isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {isCompleted
                                ? "✓ Completed"
                                : "Completed"}
                        </span>

                    </div>

                </div>

            </div>

            {/* ======================================
                AMBULANCE INFORMATION
            ====================================== */}

            {!tracking.ambulanceAssigned ? (

                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-bold text-orange-600">
                        🚑 Ambulance Not Assigned
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Admin has not assigned an ambulance yet.
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Ambulance Information
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div>

                            <p className="text-gray-500">
                                Vehicle Number
                            </p>

                            <p className="font-semibold text-lg">
                                🚑 {tracking.vehicleNo}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Ambulance Type
                            </p>

                            <p className="font-semibold text-lg">
                                {tracking.ambulanceType}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Ambulance Status
                            </p>

                            <p
                                className={`font-semibold text-lg ${
                                    tracking.ambulanceStatus ===
                                    "Busy"
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {tracking.ambulanceStatus}
                            </p>

                        </div>

                    </div>

                    {/* MOVING */}

                    {isMoving && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">

                            <p className="font-bold text-blue-700">
                                🟢 Ambulance is moving
                            </p>

                            <p className="text-blue-600 mt-1">
                                Live location is updating automatically.
                            </p>

                        </div>
                    )}

                    {/* ARRIVED */}

                    {isArrived && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">

                            <p className="font-bold text-green-700">
                                📍 Ambulance has arrived
                            </p>

                            <p className="text-green-600 mt-1">
                                Ambulance is currently at the pickup location.
                            </p>

                        </div>
                    )}

                    {/* COMPLETED */}

                    {isCompleted && (
                        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">

                            <p className="font-bold text-gray-700">
                                ✅ Trip Completed
                            </p>

                            <p className="text-gray-600 mt-1">
                                This ambulance trip has been completed.
                            </p>

                        </div>
                    )}

                    {/* ==================================
                        MAP
                    ================================== */}

                    {tracking.latitude !== null &&
                    tracking.longitude !== null ? (

                        <div className="mt-8">

                            <h3 className="text-xl font-bold mb-4">
                                🗺️ Live Ambulance Location
                            </h3>

                            <TrackingMap
                                latitude={
                                    tracking.latitude
                                }
                                longitude={
                                    tracking.longitude
                                }
                                vehicleNo={
                                    tracking.vehicleNo
                                }
                            />

                        </div>

                    ) : (

                        <div className="mt-8 p-6 bg-gray-100 rounded-lg">

                            <p className="text-orange-600 font-semibold">
                                ⏳ Waiting for ambulance GPS location...
                            </p>

                            <p className="text-gray-500 mt-1">
                                Driver has not sent a location yet.
                            </p>

                        </div>

                    )}

                    {/* ==================================
                        LIVE COORDINATES
                    ================================== */}

                    {tracking.latitude !== null &&
                    tracking.longitude !== null && (

                        <div className="mt-6 p-5 bg-gray-100 rounded-lg">

                            <h3 className="text-xl font-bold mb-4">
                                📍 Live Coordinates
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>

                                    <p className="text-gray-500">
                                        Latitude
                                    </p>

                                    <p className="font-semibold">
                                        {tracking.latitude.toFixed(
                                            6
                                        )}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500">
                                        Longitude
                                    </p>

                                    <p className="font-semibold">
                                        {tracking.longitude.toFixed(
                                            6
                                        )}
                                    </p>

                                </div>

                            </div>

                            <p className="mt-4 text-green-600 font-semibold">
                                🟢 Ambulance location is available
                            </p>

                        </div>

                    )}

                    {/* ==================================
                        AI HOSPITAL RECOMMENDATION
                    ================================== */}

                    <div className="mt-8">

                        <div className="border-t pt-8">

                            <h2 className="text-2xl font-bold mb-2">
                                🤖 AI Hospital Recommendation
                            </h2>

                            <p className="text-gray-500 mb-6">
                                Finding the best nearby hospital based on
                                distance, beds, ICU availability and traffic.
                            </p>

                        </div>

                        {/* LOADING */}

                        {hospitalLoading && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

                                <div className="flex items-center gap-3">

                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />

                                    <p className="font-semibold text-blue-700">
                                        🤖 AI is finding the best hospital...
                                    </p>

                                </div>

                            </div>
                        )}

                        {/* ERROR */}

                        {!hospitalLoading &&
                        hospitalError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                                <p className="font-semibold text-red-600">
                                    ❌ {hospitalError}
                                </p>

                            </div>
                        )}

                        {/* RECOMMENDED HOSPITAL */}

                        {!hospitalLoading &&
                        !hospitalError &&
                        hospitalData && (

                            <div>

                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6">

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div>

                                            <p className="text-green-600 font-bold text-sm uppercase">
                                                ⭐ Recommended Hospital
                                            </p>

                                            <h3 className="text-2xl font-bold mt-1">
                                                🏥{" "}
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .name
                                                }
                                            </h3>

                                        </div>

                                        <div className="bg-green-600 text-white px-5 py-3 rounded-xl text-center">

                                            <p className="text-sm">
                                                AI Score
                                            </p>

                                            <p className="text-2xl font-bold">
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .score
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {/* DETAILS */}

                                    <div className="grid md:grid-cols-4 gap-4 mt-6">

                                        <div className="bg-white rounded-lg p-4">

                                            <p className="text-gray-500 text-sm">
                                                Distance
                                            </p>

                                            <p className="font-bold text-lg">
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .distance
                                                }{" "}
                                                km
                                            </p>

                                        </div>

                                        <div className="bg-white rounded-lg p-4">

                                            <p className="text-gray-500 text-sm">
                                                Beds Available
                                            </p>

                                            <p className="font-bold text-lg">
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .bedsAvailable
                                                }
                                            </p>

                                        </div>

                                        <div className="bg-white rounded-lg p-4">

                                            <p className="text-gray-500 text-sm">
                                                ICU Available
                                            </p>

                                            <p className="font-bold text-lg">
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .icuAvailable
                                                }
                                            </p>

                                        </div>

                                        <div className="bg-white rounded-lg p-4">

                                            <p className="text-gray-500 text-sm">
                                                Traffic
                                            </p>

                                            <p
                                                className={`font-bold text-lg ${
                                                    hospitalData
                                                        .recommendedHospital
                                                        .trafficLevel ===
                                                    "Low"
                                                        ? "text-green-600"
                                                        : hospitalData
                                                              .recommendedHospital
                                                              .trafficLevel ===
                                                          "Medium"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                🚦{" "}
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .trafficLevel
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {/* SUPPORT */}

                                    <div className="mt-6 p-4 bg-white rounded-lg">

                                        <p className="font-semibold mb-2">
                                            Why this hospital?
                                        </p>

                                        <div className="flex flex-wrap gap-3">

                                            {hospitalData
                                                .recommendedHospital
                                                .emergencySupport && (
                                                <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-semibold">
                                                    ✓ Emergency Support
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .icuAvailable >
                                                0 && (
                                                <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold">
                                                    ✓ ICU Available
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .bedsAvailable >
                                                0 && (
                                                <span className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-semibold">
                                                    ✓ Beds Available
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .trafficLevel ===
                                                "Low" && (
                                                <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-semibold">
                                                    ✓ Low Traffic
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* OTHER HOSPITALS */}

                                <div className="mt-8">

                                    <h3 className="text-xl font-bold mb-4">
                                        🏥 Other Nearby Hospitals
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-5">

                                        {hospitalData.hospitals
                                            .filter(
                                                (hospital) =>
                                                    hospital.id !==
                                                    hospitalData
                                                        .recommendedHospital
                                                        .id
                                            )
                                            .map(
                                                (
                                                    hospital
                                                ) => (

                                                    <div
                                                        key={
                                                            hospital.id
                                                        }
                                                        className="bg-white border rounded-xl p-5 shadow-sm"
                                                    >

                                                        <div className="flex justify-between items-start gap-3">

                                                            <div>

                                                                <h4 className="font-bold text-lg">
                                                                    🏥{" "}
                                                                    {
                                                                        hospital.name
                                                                    }
                                                                </h4>

                                                                <p className="text-gray-500 mt-1">
                                                                    📍{" "}
                                                                    {
                                                                        hospital.distance
                                                                    }{" "}
                                                                    km
                                                                </p>

                                                            </div>

                                                            <span
                                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                                    hospital.trafficLevel ===
                                                                    "Low"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : hospital.trafficLevel ===
                                                                          "Medium"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                🚦{" "}
                                                                {
                                                                    hospital.trafficLevel
                                                                }
                                                            </span>

                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mt-5">

                                                            <div className="bg-gray-50 rounded-lg p-3">

                                                                <p className="text-gray-500 text-sm">
                                                                    Beds
                                                                </p>

                                                                <p className="font-bold">
                                                                    {
                                                                        hospital.bedsAvailable
                                                                    }
                                                                </p>

                                                            </div>

                                                            <div className="bg-gray-50 rounded-lg p-3">

                                                                <p className="text-gray-500 text-sm">
                                                                    ICU
                                                                </p>

                                                                <p className="font-bold">
                                                                    {
                                                                        hospital.icuAvailable
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* ==================================
                        AUTO REFRESH
                    ================================== */}

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">

                        <p className="font-semibold">
                            🔄 Live tracking active
                        </p>

                        <p className="text-gray-600 mt-1">
                            Location and hospital recommendation
                            refresh every 5 seconds.
                        </p>

                        {lastUpdated && (
                            <p className="text-gray-500 mt-1">
                                Last updated:{" "}
                                {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}
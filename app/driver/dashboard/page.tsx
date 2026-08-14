"use client";

import { useEffect, useRef, useState } from "react";

interface DriverData {
    driverName: string;
    vehicleNo: string;
    ambulanceType: string;
    ambulanceStatus: string;
    booking: {
        id: string;
        patientName: string;
        patientMobile: string;
        pickupLocation: string;
        destination: string;
        emergencyType: string;
        status: string;
    } | null;
}

export default function DriverDashboard() {
    const [data, setData] = useState<DriverData | null>(null);
    const [loading, setLoading] = useState(true);

    const [locationStatus, setLocationStatus] =
        useState("Location not started");

    const [isTracking, setIsTracking] = useState(false);

    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        const getDriverData = async () => {
            try {
                const res = await fetch("/api/driver/dashboard");

                const result = await res.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.log("DRIVER DASHBOARD ERROR:", error);
                alert("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        getDriverData();

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(
                    watchIdRef.current
                );
            }
        };
    }, []);

    const sendLocation = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            const res = await fetch("/api/driver/location", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude,
                    longitude,
                }),
            });

            const result = await res.json();

            if (result.success) {
                setLocationStatus(
                    `📍 Location Updated: ${latitude.toFixed(
                        5
                    )}, ${longitude.toFixed(5)}`
                );
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log("LOCATION UPDATE ERROR:", error);
            setLocationStatus("❌ Location update failed");
        }
    };

    const startLocationTracking = () => {
        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by this browser."
            );
            return;
        }

        setLocationStatus("Getting your location...");

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setIsTracking(true);

                await sendLocation(
                    latitude,
                    longitude
                );
            },
            (error) => {
                console.log("GPS ERROR:", error);

                setIsTracking(false);

                if (error.code === 1) {
                    setLocationStatus(
                        "❌ Location permission denied"
                    );
                } else if (error.code === 2) {
                    setLocationStatus(
                        "❌ Location unavailable"
                    );
                } else if (error.code === 3) {
                    setLocationStatus(
                        "❌ Location request timeout"
                    );
                } else {
                    setLocationStatus(
                        "❌ Unable to get location"
                    );
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000,
            }
        );

        watchIdRef.current = watchId;
    };

    const stopLocationTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current = null;
        }

        setIsTracking(false);
        setLocationStatus("Location tracking stopped");
    };

    const startTrip = async () => {
        try {
            const res = await fetch("/api/driver/trip", {
                method: "PUT",
            });

            const result = await res.json();

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert("Trip Started Successfully 🚑");

            // Start GPS tracking
            startLocationTracking();

        } catch (error) {
            console.log("START TRIP ERROR:", error);
            alert("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    Loading Driver Dashboard...
                </h1>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold text-red-600">
                    Driver data not found
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-8">
                🚑 Driver Dashboard
            </h1>

            {/* Driver Information */}

            <div className="bg-white rounded-xl shadow p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">
                    Driver Information
                </h2>

                <div className="grid md:grid-cols-3 gap-5">

                    <div>
                        <p className="text-gray-500">
                            Driver Name
                        </p>

                        <p className="text-lg font-semibold">
                            {data.driverName}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Vehicle Number
                        </p>

                        <p className="text-lg font-semibold">
                            {data.vehicleNo}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Ambulance Type
                        </p>

                        <p className="text-lg font-semibold">
                            {data.ambulanceType}
                        </p>
                    </div>

                </div>

                <div className="mt-5">

                    <p className="text-gray-500">
                        Ambulance Status
                    </p>

                    <span className="inline-block mt-1 bg-yellow-400 px-4 py-2 rounded-full font-semibold">
                        {data.ambulanceStatus}
                    </span>

                </div>

            </div>

            {/* Current Booking */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-bold mb-5">
                    Current Booking
                </h2>

                {!data.booking ? (

                    <div className="text-gray-500 text-lg">
                        No active booking assigned.
                    </div>

                ) : (

                    <div className="space-y-4">

                        <div>
                            <p className="text-gray-500">
                                Patient
                            </p>

                            <p className="font-semibold text-lg">
                                {data.booking.patientName}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Patient Mobile
                            </p>

                            <p className="font-semibold">
                                {data.booking.patientMobile}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Pickup Location
                            </p>

                            <p className="font-semibold">
                                📍 {data.booking.pickupLocation}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Destination
                            </p>

                            <p className="font-semibold">
                                🏥 {data.booking.destination}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Emergency Type
                            </p>

                            <p className="font-semibold">
                                🚨 {data.booking.emergencyType}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Booking Status
                            </p>

                            <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                                {data.booking.status}
                            </span>
                        </div>

                        {/* Start Trip */}

                        <div className="pt-4">

                            <button
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
                                onClick={startTrip}
                                disabled={isTracking}
                            >
                                {isTracking
                                    ? "📍 Tracking Live..."
                                    : "📍 Start Trip"}
                            </button>

                        </div>

                        {/* GPS Status */}

                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">

                            <p className="font-semibold mb-1">
                                GPS Tracking
                            </p>

                            <p className="text-gray-600">
                                {locationStatus}
                            </p>

                        </div>

                        {/* Stop Tracking */}

                        {isTracking && (
                            <button
                                onClick={stopLocationTracking}
                                className="bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800"
                            >
                                Stop Location Tracking
                            </button>
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}
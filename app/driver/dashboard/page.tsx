"use client";

import { useEffect, useRef, useState } from "react";

interface DriverBooking {
    id: string;
    patientName: string;
    patientMobile: string;
    pickupLocation: string;
    destination: string;
    emergencyType: string;
    status: string;
}

interface DriverData {
    driverName: string;
    vehicleNo: string;
    ambulanceType: string;
    ambulanceStatus: string;
    booking: DriverBooking | null;
}

export default function DriverDashboard() {
    const [data, setData] = useState<DriverData | null>(null);
    const [loading, setLoading] = useState(true);

    const [locationStatus, setLocationStatus] =
        useState("Location not started");

    const [isTracking, setIsTracking] = useState(false);
    const [isDemoTracking, setIsDemoTracking] = useState(false);

    const [demoLatitude, setDemoLatitude] =
        useState(29.251245);

    const [demoLongitude, setDemoLongitude] =
        useState(76.449995);

    const watchIdRef = useRef<number | null>(null);
    const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // =====================================================
    // GET DRIVER DATA
    // =====================================================

    const getDriverData = async () => {
        try {
            const res = await fetch(
                "/api/driver/dashboard",
                {
                    cache: "no-store",
                }
            );

            const result = await res.json();

            if (result.success) {
                setData(result.data);
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log(
                "DRIVER DASHBOARD ERROR:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD + AUTO REFRESH
    // =====================================================

    useEffect(() => {
        getDriverData();

        const interval = setInterval(() => {
            getDriverData();
        }, 10000);

        return () => {
            clearInterval(interval);

            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(
                    watchIdRef.current
                );
            }

            if (demoIntervalRef.current) {
                clearInterval(
                    demoIntervalRef.current
                );
            }
        };
    }, []);

    // =====================================================
    // SEND LOCATION
    // =====================================================

    const sendLocation = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            const res = await fetch(
                "/api/driver/location",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        latitude,
                        longitude,
                    }),
                }
            );

            const result = await res.json();

            if (result.success) {
                setLocationStatus(
                    `📍 Location Updated: ${latitude.toFixed(
                        5
                    )}, ${longitude.toFixed(5)}`
                );
            } else {
                setLocationStatus(
                    `❌ ${result.message}`
                );
            }
        } catch (error) {
            console.log(
                "LOCATION UPDATE ERROR:",
                error
            );

            setLocationStatus(
                "❌ Location update failed"
            );
        }
    };

    // =====================================================
    // REAL GPS TRACKING
    // =====================================================

    const startLocationTracking = () => {
        if (isDemoTracking) {
            alert(
                "Please stop Demo Tracking first."
            );
            return;
        }

        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by this browser."
            );
            return;
        }

        setLocationStatus(
            "📍 Getting your real GPS location..."
        );

        const watchId =
            navigator.geolocation.watchPosition(
                async (position) => {
                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    setIsTracking(true);

                    await sendLocation(
                        latitude,
                        longitude
                    );
                },
                (error) => {
                    console.log(
                        "GPS ERROR:",
                        error
                    );

                    setIsTracking(false);

                    if (error.code === 1) {
                        setLocationStatus(
                            "❌ Location permission denied"
                        );
                    } else if (
                        error.code === 2
                    ) {
                        setLocationStatus(
                            "❌ Location unavailable"
                        );
                    } else if (
                        error.code === 3
                    ) {
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

    // =====================================================
    // STOP REAL GPS
    // =====================================================

    const stopLocationTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current = null;
        }

        setIsTracking(false);

        setLocationStatus(
            "⏹️ GPS tracking stopped"
        );
    };

    // =====================================================
    // DEMO TRACKING
    // =====================================================

    const startDemoTracking = () => {
        if (isTracking) {
            alert(
                "Real GPS tracking is already running. Stop it first."
            );

            return;
        }

        if (isDemoTracking) {
            return;
        }

        // Demo sirf On the Way mein chalega
        if (data?.booking?.status !== "On the Way") {
            alert(
                "Demo movement can start only when trip is On the Way."
            );

            return;
        }

        setIsDemoTracking(true);

        setLocationStatus(
            "🧪 Demo GPS Tracking Started"
        );

        let latitude = 29.251245;
        let longitude = 76.449995;

        setDemoLatitude(latitude);
        setDemoLongitude(longitude);

        // First location
        sendLocation(
            latitude,
            longitude
        );

        demoIntervalRef.current =
            setInterval(async () => {

                latitude += 0.00015;
                longitude += 0.00020;

                setDemoLatitude(latitude);
                setDemoLongitude(longitude);

                await sendLocation(
                    latitude,
                    longitude
                );

            }, 5000);
    };

    // =====================================================
    // STOP DEMO
    // =====================================================

    const stopDemoTracking = () => {
        if (demoIntervalRef.current) {
            clearInterval(
                demoIntervalRef.current
            );

            demoIntervalRef.current = null;
        }

        setIsDemoTracking(false);

        setLocationStatus(
            "⏹️ Demo movement stopped"
        );
    };

    // =====================================================
    // START TRIP
    // =====================================================

    const startTrip = async () => {
        try {
            const res = await fetch(
                "/api/driver/trip",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        action: "START",
                    }),
                }
            );

            const result = await res.json();

            console.log(
                "START TRIP RESPONSE:",
                result
            );

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert(
                "Trip Started Successfully 🚑"
            );

            setData((prev) => {
                if (!prev || !prev.booking) {
                    return prev;
                }

                return {
                    ...prev,

                    ambulanceStatus: "Busy",

                    booking: {
                        ...prev.booking,
                        status: "On the Way",
                    },
                };
            });

        } catch (error) {
            console.log(
                "START TRIP ERROR:",
                error
            );

            alert(
                "Something went wrong"
            );
        }
    };

    // =====================================================
    // UPDATE TRIP STATUS
    // =====================================================

    const updateTripStatus = async (
        action: "ARRIVED" | "COMPLETE"
    ) => {
        try {
            const res = await fetch(
                "/api/driver/trip",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        action,
                    }),
                }
            );

            const result = await res.json();

            console.log(
                "TRIP STATUS RESPONSE:",
                result
            );

            if (!result.success) {
                alert(result.message);
                return;
            }

            // =============================================
            // ARRIVED
            // =============================================

            if (action === "ARRIVED") {

                // Demo movement stop
                stopDemoTracking();

                // Real GPS stop
                stopLocationTracking();

                setData((prev) => {
                    if (
                        !prev ||
                        !prev.booking
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,

                        // IMPORTANT:
                        // Ambulance abhi bhi Busy rahegi
                        ambulanceStatus:
                            "Busy",

                        booking: {
                            ...prev.booking,
                            status:
                                "Arrived",
                        },
                    };
                });

                alert(
                    "Driver has arrived at pickup location 📍"
                );

                return;
            }

            // =============================================
            // COMPLETE
            // =============================================

            if (action === "COMPLETE") {

                stopDemoTracking();
                stopLocationTracking();

                setData((prev) => {
                    if (
                        !prev ||
                        !prev.booking
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,

                        // IMPORTANT:
                        // Complete ke baad hi Available
                        ambulanceStatus:
                            "Available",

                        booking: {
                            ...prev.booking,
                            status:
                                "Completed",
                        },
                    };
                });

                alert(
                    "Trip Completed Successfully ✅\nAmbulance is now Available."
                );

                return;
            }

        } catch (error) {
            console.log(
                "UPDATE TRIP ERROR:",
                error
            );

            alert(
                "Something went wrong"
            );
        }
    };

    // =====================================================
    // STOP EVERYTHING
    // =====================================================

    const stopAllTracking = () => {

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current = null;
        }

        if (demoIntervalRef.current) {
            clearInterval(
                demoIntervalRef.current
            );

            demoIntervalRef.current = null;
        }

        setIsTracking(false);
        setIsDemoTracking(false);

        setLocationStatus(
            "⏹️ Location tracking stopped"
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <h1 className="text-2xl font-semibold">
                    Loading Driver Dashboard...
                </h1>

            </div>
        );
    }

    // =====================================================
    // NO DATA
    // =====================================================

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <h1 className="text-2xl font-semibold text-red-600">
                    Driver data not found
                </h1>

            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* TITLE */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    🚑 Driver Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your ambulance trip and live location.
                </p>

            </div>

            {/* DRIVER INFORMATION */}

            <div className="bg-white rounded-xl shadow p-6 mb-8">

                <h2 className="text-2xl font-bold mb-6">
                    Driver Information
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

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

                <div className="mt-6">

                    <p className="text-gray-500">
                        Ambulance Status
                    </p>

                    <span
                        className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${
                            data.ambulanceStatus ===
                            "Available"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-400 text-black"
                        }`}
                    >
                        {data.ambulanceStatus}
                    </span>

                </div>

            </div>

            {/* CURRENT BOOKING */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Current Booking
                </h2>

                {!data.booking ? (

                    <div className="bg-gray-100 rounded-lg p-6 text-center">

                        <p className="text-gray-500 text-lg">
                            🚑 No active booking assigned.
                        </p>

                    </div>

                ) : (

                    <div>

                        {/* BOOKING INFO */}

                        <div className="grid md:grid-cols-2 gap-6">

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

                                <p className="font-semibold text-lg">
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

                                <span
                                    className={`inline-block px-4 py-2 rounded-full font-semibold ${
                                        data.booking.status ===
                                        "Completed"
                                            ? "bg-blue-500 text-white"
                                            : data.booking.status ===
                                              "Arrived"
                                            ? "bg-purple-500 text-white"
                                            : data.booking.status ===
                                              "On the Way"
                                            ? "bg-orange-500 text-white"
                                            : "bg-green-500 text-white"
                                    }`}
                                >
                                    {data.booking.status}
                                </span>

                            </div>

                        </div>

                        <div className="border-t my-8" />

                        {/* TRIP CONTROLS */}

                        <h3 className="text-xl font-bold mb-4">
                            🚑 Trip Controls
                        </h3>

                        {/* APPROVED */}

                        {data.booking.status ===
                            "Approved" && (

                            <div className="flex flex-wrap gap-4">

                                <button
                                    onClick={startTrip}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
                                >
                                    🚑 Start Trip
                                </button>

                                <button
                                    onClick={
                                        startDemoTracking
                                    }
                                    disabled
                                    className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                                >
                                    🧪 Demo Tracking
                                </button>

                            </div>
                        )}

                        {/* ON THE WAY */}

                        {data.booking.status ===
                            "On the Way" && (

                            <div className="flex flex-wrap gap-4">

                                <button
                                    onClick={
                                        startDemoTracking
                                    }
                                    disabled={
                                        isDemoTracking ||
                                        isTracking
                                    }
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {isDemoTracking
                                        ? "🧪 Demo Movement Live..."
                                        : "🧪 Demo Tracking"}
                                </button>

                                <button
                                    onClick={() =>
                                        updateTripStatus(
                                            "ARRIVED"
                                        )
                                    }
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
                                >
                                    📍 Mark Arrived
                                </button>

                            </div>
                        )}

                        {/* ARRIVED */}

                        {data.booking.status ===
                            "Arrived" && (

                            <div>

                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-5">

                                    <p className="text-purple-700 font-semibold text-lg">
                                        📍 Driver has arrived.
                                    </p>

                                    <p className="text-gray-600 mt-1">
                                        Ambulance is still Busy.
                                        Complete the trip when the
                                        patient journey is finished.
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        updateTripStatus(
                                            "COMPLETE"
                                        )
                                    }
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                                >
                                    ✅ Complete Trip
                                </button>

                            </div>
                        )}

                        {/* COMPLETED */}

                        {data.booking.status ===
                            "Completed" && (

                            <div className="bg-green-50 border border-green-200 rounded-lg p-5">

                                <p className="text-green-700 font-bold text-lg">
                                    ✅ Trip Completed
                                </p>

                                <p className="text-gray-600 mt-1">
                                    Ambulance is now Available.
                                </p>

                            </div>
                        )}

                        {/* DEMO STOP */}

                        {isDemoTracking && (

                            <div className="mt-5">

                                <button
                                    onClick={
                                        stopDemoTracking
                                    }
                                    className="bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800"
                                >
                                    ⏹️ Stop Demo Movement
                                </button>

                            </div>
                        )}

                        {/* GPS STOP */}

                        {isTracking && (

                            <div className="mt-5">

                                <button
                                    onClick={
                                        stopLocationTracking
                                    }
                                    className="bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800"
                                >
                                    ⏹️ Stop GPS Tracking
                                </button>

                            </div>
                        )}

                        {/* LOCATION STATUS */}

                        <div className="mt-6 p-5 bg-gray-100 rounded-lg">

                            <h3 className="font-bold text-lg mb-2">
                                📡 GPS Tracking
                            </h3>

                            <p className="text-gray-700">
                                {locationStatus}
                            </p>

                        </div>

                        {/* DEMO LOCATION */}

                        {isDemoTracking && (

                            <div className="mt-5 p-5 bg-blue-50 border border-blue-200 rounded-lg">

                                <h3 className="font-bold text-lg mb-3">
                                    🧪 Demo Ambulance Location
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-gray-500">
                                            Latitude
                                        </p>

                                        <p className="font-semibold">
                                            {demoLatitude.toFixed(
                                                6
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Longitude
                                        </p>

                                        <p className="font-semibold">
                                            {demoLongitude.toFixed(
                                                6
                                            )}
                                        </p>
                                    </div>

                                </div>

                                <p className="text-blue-600 font-semibold mt-4">
                                    🟢 Ambulance is moving automatically every 5 seconds.
                                </p>

                            </div>
                        )}

                        {/* STOP ALL */}

                        {(isTracking ||
                            isDemoTracking) && (

                            <div className="mt-6">

                                <button
                                    onClick={
                                        stopAllTracking
                                    }
                                    className="border border-red-500 text-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-50"
                                >
                                    🛑 Stop All Tracking
                                </button>

                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}
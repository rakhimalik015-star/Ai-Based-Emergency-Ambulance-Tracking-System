


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

                // Login expire ho gaya ya session hi nahi hai —
                // seedha driver login page pe bhej do
                if (res.status === 401) {
                    window.location.href = "/driver/login";
                    return;
                }
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
        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
            HEADER
        ===================================================== */}

            <header className="bg-white border-b sticky top-0 z-20">

                <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                                <span className="text-3xl">
                                    🚑
                                </span>
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                    Driver Dashboard
                                </h1>

                                <p className="text-sm text-slate-500 mt-1">
                                    Manage ambulance trips & live location
                                </p>
                            </div>

                        </div>

                        {/* DRIVER ONLINE */}

                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">

                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>

                            <div>
                                <p className="text-sm font-bold text-green-700">
                                    Driver Active
                                </p>

                                <p className="text-xs text-green-600">
                                    System connected
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </header>


            {/* =====================================================
            MAIN
        ===================================================== */}

            <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">


                {/* =================================================
                DRIVER INFORMATION
            ================================================= */}

                <section className="mb-8">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                Driver & Ambulance
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Your assigned ambulance information
                            </p>
                        </div>

                        <span className="hidden md:inline-block text-sm text-slate-400">
                            🚑 Vehicle Details
                        </span>

                    </div>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">


                        {/* DRIVER */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center gap-3 mb-4">

                                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                                    👨‍✈️
                                </div>

                                <p className="text-sm text-slate-500">
                                    Driver Name
                                </p>

                            </div>

                            <p className="text-lg font-bold text-slate-800">
                                {data.driverName}
                            </p>

                        </div>


                        {/* VEHICLE */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center gap-3 mb-4">

                                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                                    🚑
                                </div>

                                <p className="text-sm text-slate-500">
                                    Vehicle Number
                                </p>

                            </div>

                            <p className="text-lg font-bold text-slate-800">
                                {data.vehicleNo}
                            </p>

                        </div>


                        {/* TYPE */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center gap-3 mb-4">

                                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                                    🏥
                                </div>

                                <p className="text-sm text-slate-500">
                                    Ambulance Type
                                </p>

                            </div>

                            <p className="text-lg font-bold text-slate-800">
                                {data.ambulanceType}
                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center gap-3 mb-4">

                                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                                    🚦
                                </div>

                                <p className="text-sm text-slate-500">
                                    Ambulance Status
                                </p>

                            </div>

                            <span
                                className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${data.ambulanceStatus === "Available"
                                        ? "bg-green-100 text-green-700"
                                        : data.ambulanceStatus === "Busy"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {data.ambulanceStatus === "Available"
                                    ? "🟢 "
                                    : data.ambulanceStatus === "Busy"
                                        ? "🟡 "
                                        : "🔴 "}
                                {data.ambulanceStatus}
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                CURRENT BOOKING
            ================================================= */}

                <section>

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                Current Booking
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage your assigned emergency trip
                            </p>
                        </div>

                    </div>


                    {!data.booking ? (

                        /* NO BOOKING */

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">

                            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-5">
                                🚑
                            </div>

                            <h3 className="text-xl font-bold text-slate-700">
                                No Active Booking
                            </h3>

                            <p className="text-slate-500 mt-2">
                                There is currently no emergency booking assigned to you.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-6">


                            {/* =================================================
                            BOOKING HEADER
                        ================================================= */}

                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                                <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white">

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div>

                                            <p className="text-red-100 text-sm">
                                                Emergency Booking
                                            </p>

                                            <h3 className="text-2xl font-bold mt-1">
                                                Patient: {data.booking.patientName}
                                            </h3>

                                        </div>


                                        <span
                                            className={`self-start md:self-auto px-4 py-2 rounded-full text-sm font-bold ${data.booking.status === "Completed"
                                                    ? "bg-white text-blue-600"
                                                    : data.booking.status === "Arrived"
                                                        ? "bg-white text-purple-600"
                                                        : data.booking.status === "On the Way"
                                                            ? "bg-white text-orange-600"
                                                            : "bg-white text-green-600"
                                                }`}
                                        >
                                            {data.booking.status}
                                        </span>

                                    </div>

                                </div>


                                {/* BOOKING DETAILS */}

                                <div className="p-6">

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">


                                        {/* PATIENT */}

                                        <div className="bg-slate-50 rounded-xl p-4">

                                            <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                                                Patient
                                            </p>

                                            <p className="font-bold text-slate-800 mt-2">
                                                👤 {data.booking.patientName}
                                            </p>

                                        </div>


                                        {/* MOBILE */}

                                        <div className="bg-slate-50 rounded-xl p-4">

                                            <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                                                Patient Mobile
                                            </p>

                                            <p className="font-bold text-slate-800 mt-2">
                                                📞 {data.booking.patientMobile}
                                            </p>

                                        </div>


                                        {/* EMERGENCY */}

                                        <div className="bg-red-50 rounded-xl p-4">

                                            <p className="text-xs uppercase tracking-wide text-red-400 font-bold">
                                                Emergency
                                            </p>

                                            <p className="font-bold text-red-700 mt-2">
                                                🚨 {data.booking.emergencyType}
                                            </p>

                                        </div>

                                    </div>


                                    {/* ROUTE */}

                                    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">

                                        <p className="text-sm font-bold text-slate-700 mb-5">
                                            🛣️ Emergency Route
                                        </p>

                                        <div className="relative">

                                            <div className="absolute left-3 top-7 bottom-7 w-0.5 bg-slate-300"></div>


                                            {/* PICKUP */}

                                            <div className="relative flex gap-4">

                                                <div className="w-7 h-7 rounded-full bg-blue-500 border-4 border-blue-100 flex-shrink-0"></div>

                                                <div className="pb-7">

                                                    <p className="text-xs text-slate-400 uppercase font-bold">
                                                        Pickup Location
                                                    </p>

                                                    <p className="font-semibold text-slate-800 mt-1">
                                                        {data.booking.pickupLocation}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* DESTINATION */}

                                            <div className="relative flex gap-4">

                                                <div className="w-7 h-7 rounded-full bg-red-600 border-4 border-red-100 flex-shrink-0"></div>

                                                <div>

                                                    <p className="text-xs text-slate-400 uppercase font-bold">
                                                        Destination
                                                    </p>

                                                    <p className="font-semibold text-slate-800 mt-1">
                                                        {data.booking.destination}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                    TRIP CONTROLS
                                ================================================= */}

                                    <div className="mt-7 border-t pt-7">

                                        <div className="flex items-center justify-between mb-5">

                                            <div>

                                                <h3 className="text-lg font-bold text-slate-800">
                                                    🚑 Trip Controls
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    Update trip status and ambulance movement
                                                </p>

                                            </div>

                                        </div>


                                        {/* APPROVED */}

                                        {data.booking.status === "Approved" && (

                                            <div className="flex flex-wrap gap-3">

                                                <button
                                                    onClick={startTrip}
                                                    className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-0.5 transition"
                                                >
                                                    🚑 Start Trip
                                                </button>

                                                <button
                                                    disabled
                                                    className="px-6 py-3 rounded-xl bg-slate-200 text-slate-400 font-bold cursor-not-allowed"
                                                >
                                                    🧪 Demo Tracking
                                                </button>

                                            </div>

                                        )}


                                        {/* ON THE WAY */}

                                        {data.booking.status === "On the Way" && (

                                            <div className="flex flex-wrap gap-3">

                                                <button
                                                    onClick={startDemoTracking}
                                                    disabled={
                                                        isDemoTracking ||
                                                        isTracking
                                                    }
                                                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:bg-slate-300 disabled:shadow-none"
                                                >
                                                    {isDemoTracking
                                                        ? "🧪 Demo Movement Live..."
                                                        : "🧪 Start Demo Tracking"}
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        updateTripStatus("ARRIVED")
                                                    }
                                                    className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition"
                                                >
                                                    📍 Mark Arrived
                                                </button>

                                            </div>

                                        )}


                                        {/* ARRIVED */}

                                        {data.booking.status === "Arrived" && (

                                            <div>

                                                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-5">

                                                    <div className="flex gap-4">

                                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                                                            📍
                                                        </div>

                                                        <div>

                                                            <h4 className="font-bold text-purple-800 text-lg">
                                                                Driver has arrived
                                                            </h4>

                                                            <p className="text-purple-700 text-sm mt-1">
                                                                Ambulance is still Busy. Complete the trip after the patient journey is finished.
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                <button
                                                    onClick={() =>
                                                        updateTripStatus("COMPLETE")
                                                    }
                                                    className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition"
                                                >
                                                    ✅ Complete Trip
                                                </button>

                                            </div>

                                        )}


                                        {/* COMPLETED */}

                                        {data.booking.status === "Completed" && (

                                            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">

                                                <div className="flex items-center gap-4">

                                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                                                        ✅
                                                    </div>

                                                    <div>

                                                        <h4 className="font-bold text-green-800 text-lg">
                                                            Trip Completed Successfully
                                                        </h4>

                                                        <p className="text-green-700 text-sm mt-1">
                                                            Ambulance is now Available for another emergency.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                            LOCATION TRACKING
                        ================================================= */}

                            <div className="grid lg:grid-cols-2 gap-6">


                                {/* GPS STATUS */}

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                                    <div className="flex items-center gap-4 mb-5">

                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                                            📡
                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-slate-800">
                                                Live GPS Tracking
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Ambulance location service
                                            </p>

                                        </div>

                                    </div>


                                    <div className="bg-slate-50 rounded-xl p-4 mb-5">

                                        <p className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2">
                                            Current Status
                                        </p>

                                        <p
                                            className={`font-semibold ${isTracking
                                                    ? "text-green-600"
                                                    : "text-slate-700"
                                                }`}
                                        >
                                            {locationStatus}
                                        </p>

                                    </div>


                                    {/* REAL GPS */}

                                    {!isTracking && data.booking?.status === "On the Way" && (

                                        <button
                                            onClick={startLocationTracking}
                                            disabled={isDemoTracking}
                                            className="w-full px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:bg-slate-300"
                                        >
                                            📍 Start Real GPS Tracking
                                        </button>

                                    )}


                                    {isTracking && (

                                        <button
                                            onClick={stopLocationTracking}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
                                        >
                                            ⏹️ Stop GPS Tracking
                                        </button>

                                    )}

                                </div>


                                {/* DEMO TRACKING */}

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                                    <div className="flex items-center gap-4 mb-5">

                                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
                                            🧪
                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-slate-800">
                                                Demo Tracking
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Simulated ambulance movement
                                            </p>

                                        </div>

                                    </div>


                                    {isDemoTracking ? (

                                        <div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

                                                <div className="grid grid-cols-2 gap-4">

                                                    <div>

                                                        <p className="text-xs text-blue-500 font-bold uppercase">
                                                            Latitude
                                                        </p>

                                                        <p className="font-bold text-blue-900 mt-1">
                                                            {demoLatitude.toFixed(6)}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-xs text-blue-500 font-bold uppercase">
                                                            Longitude
                                                        </p>

                                                        <p className="font-bold text-blue-900 mt-1">
                                                            {demoLongitude.toFixed(6)}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-700">

                                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>

                                                    Ambulance moving automatically

                                                </div>

                                            </div>


                                            <button
                                                onClick={stopDemoTracking}
                                                className="w-full mt-4 px-5 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
                                            >
                                                ⏹️ Stop Demo Movement
                                            </button>

                                        </div>

                                    ) : (

                                        <div>

                                            <div className="bg-slate-50 rounded-xl p-4 mb-4">

                                                <p className="text-sm text-slate-600">
                                                    Demo tracking simulates ambulance movement every 5 seconds.
                                                </p>

                                            </div>


                                            <button
                                                onClick={startDemoTracking}
                                                disabled={
                                                    isTracking ||
                                                    data.booking?.status !== "On the Way"
                                                }
                                                className="w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:bg-slate-300"
                                            >
                                                🧪 Start Demo Tracking
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* =================================================
                            STOP EVERYTHING
                        ================================================= */}

                            {(isTracking || isDemoTracking) && (

                                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>

                                        <h3 className="font-bold text-red-800">
                                            🛑 Tracking Control
                                        </h3>

                                        <p className="text-sm text-red-600 mt-1">
                                            Stop all active location tracking.
                                        </p>

                                    </div>


                                    <button
                                        onClick={stopAllTracking}
                                        className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-600 font-bold hover:bg-red-100 transition"
                                    >
                                        🛑 Stop All Tracking
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}
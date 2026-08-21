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
            <div className="h-[450px] flex items-center justify-center rounded-2xl bg-[#0B1020] border border-white/6">
                <div className="text-center">
                    <div className="relative mx-auto mb-4 h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400" />
                    </div>

                    <p className="text-sm font-semibold text-white">
                        Loading Live Map
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Connecting to ambulance GPS...
                    </p>
                </div>
            </div>
        ),
    }
);

/* =====================================================
   STATUS CONFIG
===================================================== */

function getStatusStyle(status: string) {
    switch (status) {
        case "Approved":
            return {
                wrapper:
                    "border-cyan-400/20 bg-cyan-400/4 text-cyan-300",
                dot: "bg-cyan-400",
            };

        case "On the Way":
            return {
                wrapper:
                    "border-violet-400/20 bg-violet-400/4 text-violet-300",
                dot: "bg-violet-400",
            };

        case "Arrived":
            return {
                wrapper:
                    "border-lime-400/20 bg-lime-400/4 text-lime-300",
                dot: "bg-lime-400",
            };

        case "Completed":
            return {
                wrapper:
                    "border-slate-400/20 bg-slate-400/4 text-slate-300",
                dot: "bg-slate-400",
            };

        default:
            return {
                wrapper:
                    "border-white/10 bg-white/4 text-slate-300",
                dot: "bg-slate-400",
            };
    }
}

function getAmbulanceStatusStyle(status?: string) {
    switch (status) {
        case "Available":
            return "border-lime-400/20 bg-lime-400/4 text-lime-300";

        case "Busy":
            return "border-amber-400/20 bg-amber-400/4 text-amber-300";

        case "Emergency":
            return "border-rose-400/20 bg-rose-400/4 text-rose-300";

        case "Maintenance":
            return "border-slate-400/20 bg-slate-400/4 text-slate-300";

        default:
            return "border-white/10 bg-white/4 text-slate-300";
    }
}

/* =====================================================
   MAIN PAGE
===================================================== */

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

    const [hospitalData, setHospitalData] =
        useState<HospitalRecommendation | null>(null);

    const [hospitalLoading, setHospitalLoading] =
        useState(false);

    const [hospitalError, setHospitalError] =
        useState("");

    /* =====================================================
       HOSPITAL RECOMMENDATION
    ===================================================== */

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
                        "Content-Type": "application/json",
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

    /* =====================================================
       TRACKING API
    ===================================================== */

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

                if (
                    currentTracking.latitude !== null &&
                    currentTracking.longitude !== null
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

    /* =====================================================
       AUTO REFRESH
    ===================================================== */

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

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A12] flex items-center justify-center px-6">

                <div className="text-center">

                    <div className="relative mx-auto mb-7 h-20 w-20">

                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 via-cyan-400/10 to-lime-400/10 blur-xl" />

                        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/4 shadow-2xl">

                            <span className="text-4xl">
                                🚑
                            </span>

                        </div>

                    </div>

                    <div className="flex items-center justify-center gap-2">

                        <div className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 [animation-delay:150ms]" />
                        <div className="h-2 w-2 animate-pulse rounded-full bg-lime-400 [animation-delay:300ms]" />

                    </div>

                    <h1 className="mt-5 text-xl font-bold text-white">
                        Loading Live Tracking
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Connecting to Fleet Operations Center...
                    </p>

                </div>

            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !tracking) {
        return (
            <div className="min-h-screen bg-[#070A12] flex items-center justify-center px-6">

                <div className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-white/4 p-8 text-center shadow-2xl">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/4 text-3xl">
                        ❌
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-white">
                        Tracking Unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        {error || "Tracking data not found."}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-xl bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
                    >
                        Retry Tracking
                    </button>

                </div>

            </div>
        );
    }

    /* =====================================================
       STATUS
    ===================================================== */

    const isMoving =
        tracking.status === "On the Way";

    const isArrived =
        tracking.status === "Arrived";

    const isCompleted =
        tracking.status === "Completed";

    const statusStyle =
        getStatusStyle(tracking.status);

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="min-h-screen bg-[#070A12] text-white">

            {/* BACKGROUND GLOW */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />

                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl" />

            </div>

            <main className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="mb-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]" />

                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
                                    Live Fleet Tracking
                                </span>

                            </div>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">

                                <span className="text-white">
                                    Ambulance
                                </span>{" "}

                                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
                                    Operations
                                </span>

                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                                Real-time ambulance location, trip status
                                and AI-powered hospital recommendation.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3 backdrop-blur-xl">

                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Booking ID
                            </p>

                            <p className="mt-1 max-w-[250px] truncate font-mono text-sm font-semibold text-cyan-300">
                                {tracking.bookingId}
                            </p>

                        </div>

                    </div>

                </header>

                {/* =================================================
                    TOP STATUS GRID
                ================================================= */}

                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* STATUS */}

                    <div className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Current Status
                        </p>

                        <div className="mt-4 flex items-center gap-3">

                            <span
                                className={`h-3 w-3 rounded-full ${statusStyle.dot} shadow-[0_0_12px_currentColor]`}
                            />

                            <span
                                className={`rounded-full border px-3 py-1.5 text-sm font-bold ${statusStyle.wrapper}`}
                            >
                                {tracking.status}
                            </span>

                        </div>

                    </div>

                    {/* VEHICLE */}

                    <div className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Vehicle
                        </p>

                        <p className="mt-3 text-xl font-black text-white">
                            🚑 {tracking.vehicleNo || "Not Assigned"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            {tracking.ambulanceType || "Emergency Vehicle"}
                        </p>

                    </div>

                    {/* GPS */}

                    <div className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            GPS Status
                        </p>

                        <div className="mt-3 flex items-center gap-3">

                            <span className="relative flex h-3 w-3">

                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-60" />

                                <span className="relative inline-flex h-3 w-3 rounded-full bg-lime-400" />

                            </span>

                            <span className="font-bold text-lime-300">
                                {tracking.latitude !== null
                                    ? "GPS Connected"
                                    : "Waiting for GPS"}
                            </span>

                        </div>

                    </div>

                    {/* REFRESH */}

                    <div className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Last Update
                        </p>

                        <p className="mt-3 text-xl font-black text-white">
                            {lastUpdated
                                ? lastUpdated.toLocaleTimeString()
                                : "--:--:--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Auto refresh every 5 seconds
                        </p>

                    </div>

                </section>

                {/* =================================================
                    TRIP PROGRESS
                ================================================= */}

                <section className="mb-6 rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl sm:p-6">

                    <div className="mb-6 flex items-center justify-between">

                        <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                                Mission Timeline
                            </p>

                            <h2 className="mt-1 text-xl font-black">
                                Trip Progress
                            </h2>

                        </div>

                        <span className="hidden rounded-full border border-lime-400/20 bg-lime-400/4 px-3 py-1.5 text-xs font-bold text-lime-300 sm:block">
                            LIVE
                        </span>

                    </div>

                    <div className="grid gap-3 md:grid-cols-4">

                        {[
                            {
                                label: "Approved",
                                active: true,
                                icon: "✓",
                            },
                            {
                                label: "On the Way",
                                active:
                                    isMoving ||
                                    isArrived ||
                                    isCompleted,
                                icon: "🚑",
                            },
                            {
                                label: "Arrived",
                                active:
                                    isArrived ||
                                    isCompleted,
                                icon: "📍",
                            },
                            {
                                label: "Completed",
                                active: isCompleted,
                                icon: "✓",
                            },
                        ].map((step, index) => (

                            <div
                                key={step.label}
                                className={`relative rounded-xl border p-4 ${
                                    step.active
                                        ? "border-cyan-400/20 bg-cyan-400/4"
                                        : "border-white/6 bg-white/[0.02]"
                                }`}
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                            step.active
                                                ? "bg-gradient-to-br from-violet-500 via-cyan-400 to-lime-400 text-slate-950"
                                                : "bg-white/5 text-slate-600"
                                        }`}
                                    >
                                        {step.icon}
                                    </div>

                                    <div>

                                        <p
                                            className={`text-sm font-bold ${
                                                step.active
                                                    ? "text-white"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {step.label}
                                        </p>

                                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-600">
                                            Step {index + 1}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

                {/* =================================================
                    AMBULANCE + MAP
                ================================================= */}

                {tracking.ambulanceAssigned ? (

                    <section className="mb-6 grid gap-6 xl:grid-cols-[380px_1fr]">

                        {/* LEFT INFO */}

                        <div className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                            <div className="mb-6">

                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                                    Fleet Unit
                                </p>

                                <h2 className="mt-1 text-2xl font-black">
                                    Ambulance Information
                                </h2>

                            </div>

                            {/* VEHICLE CARD */}

                            <div className="mb-5 overflow-hidden rounded-2xl border border-white/6 bg-[#0B1020]">

                                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-violet-500/10 via-cyan-400/5 to-lime-400/5">

                                    <span className="text-7xl drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                                        🚑
                                    </span>

                                </div>

                                <div className="p-5">

                                    <p className="text-[10px] uppercase tracking-widest text-slate-500">
                                        Vehicle Number
                                    </p>

                                    <p className="mt-1 text-2xl font-black text-white">
                                        {tracking.vehicleNo || "Unknown"}
                                    </p>

                                </div>

                            </div>

                            {/* INFO */}

                            <div className="space-y-3">

                                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4">

                                    <span className="text-sm text-slate-500">
                                        Type
                                    </span>

                                    <span className="font-semibold text-white">
                                        {tracking.ambulanceType || "Emergency"}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-4">

                                    <span className="text-sm text-slate-500">
                                        Status
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getAmbulanceStatusStyle(
                                            tracking.ambulanceStatus
                                        )}`}
                                    >
                                        {tracking.ambulanceStatus || "Unknown"}
                                    </span>

                                </div>

                            </div>

                            {/* LIVE MESSAGE */}

                            {isMoving && (

                                <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-400/4 p-4">

                                    <div className="flex items-center gap-3">

                                        <span className="relative flex h-3 w-3">

                                            <span className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />

                                            <span className="relative h-3 w-3 rounded-full bg-violet-400" />

                                        </span>

                                        <p className="text-sm font-bold text-violet-300">
                                            Ambulance is moving
                                        </p>

                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Live GPS location is being updated automatically.
                                    </p>

                                </div>

                            )}

                            {isArrived && (

                                <div className="mt-5 rounded-xl border border-lime-400/20 bg-lime-400/4 p-4">

                                    <p className="font-bold text-lime-300">
                                        📍 Ambulance has arrived
                                    </p>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Ambulance is currently at the pickup location.
                                    </p>

                                </div>

                            )}

                            {isCompleted && (

                                <div className="mt-5 rounded-xl border border-white/6 bg-white/[0.02] p-4">

                                    <p className="font-bold text-slate-300">
                                        ✓ Trip Completed
                                    </p>

                                    <p className="mt-2 text-xs text-slate-500">
                                        This ambulance trip has been completed.
                                    </p>

                                </div>

                            )}

                        </div>

                        {/* RIGHT MAP */}

                        <div className="rounded-2xl border border-white/6 bg-white/4 p-2 shadow-2xl backdrop-blur-xl sm:p-3">

                            <div className="mb-3 flex flex-col gap-2 px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                                        GPS Command View
                                    </p>

                                    <h2 className="mt-1 text-xl font-black">
                                        Live Ambulance Location
                                    </h2>

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />

                                    <span className="text-xs font-semibold text-lime-300">
                                        LIVE
                                    </span>

                                </div>

                            </div>

                            {tracking.latitude !== null &&
                            tracking.longitude !== null ? (

                                <div className="overflow-hidden rounded-xl border border-white/6">

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

                                <div className="flex h-[450px] items-center justify-center rounded-xl border border-white/6 bg-[#0B1020]">

                                    <div className="text-center">

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/4 text-2xl">
                                            📡
                                        </div>

                                        <p className="mt-4 font-bold text-amber-300">
                                            Waiting for GPS
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Driver has not sent a location yet.
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>

                    </section>

                ) : (

                    <section className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/4 p-6">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-2xl">
                                🚑
                            </div>

                            <div>

                                <h2 className="font-bold text-amber-300">
                                    Ambulance Not Assigned
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Admin has not assigned an ambulance to this booking yet.
                                </p>

                            </div>

                        </div>

                    </section>

                )}

                {/* =================================================
                    COORDINATES
                ================================================= */}

                {tracking.latitude !== null &&
                tracking.longitude !== null && (

                    <section className="mb-6 rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                                    GPS Telemetry
                                </p>

                                <h2 className="mt-1 text-xl font-black">
                                    Live Coordinates
                                </h2>

                            </div>

                            <span className="rounded-full border border-lime-400/20 bg-lime-400/4 px-3 py-1 text-xs font-bold text-lime-300">
                                CONNECTED
                            </span>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div className="rounded-xl border border-white/6 bg-[#0B1020] p-5">

                                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                                    Latitude
                                </p>

                                <p className="mt-2 font-mono text-xl font-bold text-cyan-300">
                                    {tracking.latitude.toFixed(6)}
                                </p>

                            </div>

                            <div className="rounded-xl border border-white/6 bg-[#0B1020] p-5">

                                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                                    Longitude
                                </p>

                                <p className="mt-2 font-mono text-xl font-bold text-violet-300">
                                    {tracking.longitude.toFixed(6)}
                                </p>

                            </div>

                        </div>

                    </section>

                )}

                {/* =================================================
                    AI HOSPITAL RECOMMENDATION
                ================================================= */}

                <section className="mb-6 rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl sm:p-6">

                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10">
                                    🤖
                                </span>

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                                        AI Decision Engine
                                    </p>

                                    <h2 className="text-xl font-black">
                                        Hospital Recommendation
                                    </h2>

                                </div>

                            </div>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                Finding the best nearby hospital using distance,
                                available beds, ICU capacity, emergency support
                                and traffic conditions.
                            </p>

                        </div>

                        <div className="rounded-xl border border-violet-400/20 bg-violet-400/4 px-4 py-3 text-center">

                            <p className="text-[9px] font-bold uppercase tracking-widest text-violet-300">
                                AI POWERED
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Real-time analysis
                            </p>

                        </div>

                    </div>

                    {/* LOADING */}

                    {hospitalLoading && (

                        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/4 p-8">

                            <div className="flex flex-col items-center justify-center text-center">

                                <div className="relative h-14 w-14">

                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/10" />

                                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400" />

                                </div>

                                <p className="mt-5 font-bold text-cyan-300">
                                    AI is analyzing nearby hospitals...
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    Checking beds, ICU, emergency support and traffic.
                                </p>

                            </div>

                        </div>

                    )}

                    {/* ERROR */}

                    {!hospitalLoading &&
                    hospitalError && (

                        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/4 p-5">

                            <div className="flex gap-3">

                                <span className="text-xl">
                                    ⚠️
                                </span>

                                <div>

                                    <p className="font-bold text-rose-300">
                                        Recommendation Unavailable
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {hospitalError}
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* RECOMMENDED */}

                    {!hospitalLoading &&
                    !hospitalError &&
                    hospitalData && (

                        <div>

                            <div className="relative overflow-hidden rounded-2xl border border-lime-400/20 bg-gradient-to-br from-lime-400/6 via-cyan-400/4 to-violet-400/6 p-5 sm:p-6">

                                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-lime-400/5 blur-3xl" />

                                <div className="relative">

                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <span className="rounded-full border border-lime-400/20 bg-lime-400/4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lime-300">
                                                    ★ Recommended
                                                </span>

                                            </div>

                                            <h3 className="mt-3 text-2xl font-black text-white">
                                                🏥{" "}
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .name
                                                }
                                            </h3>

                                        </div>

                                        <div className="rounded-2xl border border-lime-400/20 bg-[#070A12]/60 px-6 py-4 text-center">

                                            <p className="text-[10px] uppercase tracking-widest text-lime-300">
                                                AI Score
                                            </p>

                                            <p className="mt-1 text-3xl font-black text-lime-300">
                                                {
                                                    hospitalData
                                                        .recommendedHospital
                                                        .score
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {/* HOSPITAL STATS */}

                                    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

                                        {[
                                            {
                                                label: "Distance",
                                                value: `${hospitalData.recommendedHospital.distance} km`,
                                                icon: "📍",
                                                color: "text-cyan-300",
                                            },
                                            {
                                                label: "Beds",
                                                value: hospitalData.recommendedHospital.bedsAvailable,
                                                icon: "🛏️",
                                                color: "text-lime-300",
                                            },
                                            {
                                                label: "ICU",
                                                value: hospitalData.recommendedHospital.icuAvailable,
                                                icon: "🏥",
                                                color: "text-violet-300",
                                            },
                                            {
                                                label: "Traffic",
                                                value: hospitalData.recommendedHospital.trafficLevel,
                                                icon: "🚦",
                                                color:
                                                    hospitalData.recommendedHospital.trafficLevel ===
                                                    "Low"
                                                        ? "text-lime-300"
                                                        : hospitalData.recommendedHospital.trafficLevel ===
                                                          "Medium"
                                                        ? "text-amber-300"
                                                        : "text-rose-300",
                                            },
                                        ].map((item) => (

                                            <div
                                                key={item.label}
                                                className="rounded-xl border border-white/6 bg-[#0B1020]/70 p-4"
                                            >

                                                <div className="flex items-center gap-2">

                                                    <span>
                                                        {item.icon}
                                                    </span>

                                                    <p className="text-[10px] uppercase tracking-widest text-slate-500">
                                                        {item.label}
                                                    </p>

                                                </div>

                                                <p
                                                    className={`mt-2 text-lg font-black ${item.color}`}
                                                >
                                                    {item.value}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                    {/* REASONS */}

                                    <div className="mt-5 rounded-xl border border-white/6 bg-[#070A12]/50 p-4">

                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Why this hospital?
                                        </p>

                                        <div className="flex flex-wrap gap-2">

                                            {hospitalData
                                                .recommendedHospital
                                                .emergencySupport && (

                                                <span className="rounded-lg border border-lime-400/20 bg-lime-400/4 px-3 py-2 text-xs font-bold text-lime-300">
                                                    ✓ Emergency Support
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .icuAvailable > 0 && (

                                                <span className="rounded-lg border border-violet-400/20 bg-violet-400/4 px-3 py-2 text-xs font-bold text-violet-300">
                                                    ✓ ICU Available
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .bedsAvailable > 0 && (

                                                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/4 px-3 py-2 text-xs font-bold text-cyan-300">
                                                    ✓ Beds Available
                                                </span>
                                            )}

                                            {hospitalData
                                                .recommendedHospital
                                                .trafficLevel ===
                                                "Low" && (

                                                <span className="rounded-lg border border-lime-400/20 bg-lime-400/4 px-3 py-2 text-xs font-bold text-lime-300">
                                                    ✓ Low Traffic
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* OTHER HOSPITALS */}

                            <div className="mt-8">

                                <div className="mb-4 flex items-center justify-between">

                                    <div>

                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                            Alternatives
                                        </p>

                                        <h3 className="mt-1 text-xl font-black">
                                            Other Nearby Hospitals
                                        </h3>

                                    </div>

                                    <span className="text-xs text-slate-600">
                                        {hospitalData.hospitals.length} found
                                    </span>

                                </div>

                                <div className="grid gap-4 md:grid-cols-2">

                                    {hospitalData.hospitals
                                        .filter(
                                            (hospital) =>
                                                hospital.id !==
                                                hospitalData
                                                    .recommendedHospital
                                                    .id
                                        )
                                        .map((hospital) => (

                                            <div
                                                key={hospital.id}
                                                className="group rounded-2xl border border-white/6 bg-[#0B1020] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/20"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <h4 className="font-bold text-white">
                                                            🏥{" "}
                                                            {hospital.name}
                                                        </h4>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            📍{" "}
                                                            {hospital.distance} km away
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                                                            hospital.trafficLevel ===
                                                            "Low"
                                                                ? "border-lime-400/20 bg-lime-400/4 text-lime-300"
                                                                : hospital.trafficLevel ===
                                                                  "Medium"
                                                                ? "border-amber-400/20 bg-amber-400/4 text-amber-300"
                                                                : "border-rose-400/20 bg-rose-400/4 text-rose-300"
                                                        }`}
                                                    >
                                                        🚦{" "}
                                                        {
                                                            hospital.trafficLevel
                                                        }
                                                    </span>

                                                </div>

                                                <div className="mt-5 grid grid-cols-2 gap-3">

                                                    <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3">

                                                        <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                                            Beds
                                                        </p>

                                                        <p className="mt-1 text-lg font-black text-cyan-300">
                                                            {
                                                                hospital.bedsAvailable
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3">

                                                        <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                                            ICU
                                                        </p>

                                                        <p className="mt-1 text-lg font-black text-violet-300">
                                                            {
                                                                hospital.icuAvailable
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                </div>

                            </div>

                        </div>

                    )}

                </section>

                {/* =================================================
                    LIVE FOOTER
                ================================================= */}

                <footer className="rounded-2xl border border-white/6 bg-white/4 p-5 backdrop-blur-xl">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/4">

                                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]" />

                            </div>

                            <div>

                                <p className="text-sm font-bold text-white">
                                    Live tracking active
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Location and hospital recommendation refresh every 5 seconds.
                                </p>

                            </div>

                        </div>

                        {lastUpdated && (

                            <div className="text-left sm:text-right">

                                <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                    Last synchronized
                                </p>

                                <p className="mt-1 font-mono text-xs text-cyan-300">
                                    {lastUpdated.toLocaleTimeString()}
                                </p>

                            </div>

                        )}

                    </div>

                </footer>

            </main>

        </div>
    );
}
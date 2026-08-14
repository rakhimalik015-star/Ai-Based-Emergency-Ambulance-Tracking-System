"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function TrackingPage() {
    const params = useParams();

    const bookingId = params.bookingId as string;

    const [tracking, setTracking] =
        useState<TrackingData | null>(null);

    const [loading, setLoading] = useState(true);

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
                setTracking(data.tracking);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log("TRACKING PAGE ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTracking();

        // Location ko har 5 seconds mein refresh karna
        const interval = setInterval(() => {
            getTracking();
        }, 5000);

        return () => clearInterval(interval);
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    Loading Live Tracking...
                </h1>
            </div>
        );
    }

    if (!tracking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold text-red-600">
                    Tracking data not found
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-8">
                🚑 Live Ambulance Tracking
            </h1>

            {/* Booking Status */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h2 className="text-2xl font-bold mb-5">
                    Booking Status
                </h2>

                <p className="mb-3">
                    <b>Booking ID:</b>{" "}
                    {tracking.bookingId}
                </p>

                <p>
                    <b>Status:</b>{" "}

                    <span className="bg-green-500 text-white px-4 py-2 rounded-full">
                        {tracking.status}
                    </span>
                </p>

            </div>

            {/* Ambulance Information */}

            {!tracking.ambulanceAssigned ? (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold text-orange-600">
                        🚑 Ambulance Not Assigned
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Admin has not assigned an ambulance yet.
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-bold mb-5">
                        Ambulance Information
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5">

                        <div>
                            <p className="text-gray-500">
                                Vehicle Number
                            </p>

                            <p className="font-semibold text-lg">
                                {tracking.vehicleNo}
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

                            <p className="font-semibold text-lg">
                                {tracking.ambulanceStatus}
                            </p>
                        </div>

                    </div>

                    {/* GPS Location */}

                    <div className="mt-8 p-5 bg-gray-100 rounded-lg">

                        <h3 className="text-xl font-bold mb-4">
                            📍 Live Location
                        </h3>

                        {tracking.latitude !== null &&
                        tracking.longitude !== null ? (

                            <div>

                                <p className="text-lg">
                                    <b>Latitude:</b>{" "}
                                    {tracking.latitude}
                                </p>

                                <p className="text-lg">
                                    <b>Longitude:</b>{" "}
                                    {tracking.longitude}
                                </p>

                                <p className="mt-3 text-green-600 font-semibold">
                                    🟢 Ambulance location is available
                                </p>

                            </div>

                        ) : (

                            <p className="text-orange-600 font-semibold">
                                ⏳ Waiting for ambulance location...
                            </p>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}
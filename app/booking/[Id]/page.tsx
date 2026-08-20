"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Booking {
  id: string;
  pickupLocation: string;
  destination: string;
  emergencyType: string;
  ambulanceType: string;
  mobile: string;
  status: string;
  createdAt: string;
  ambulance?: {
    vehicleNo: string;
    driverName: string;
    driverMobile: string;
    type: string;
    status: string;
  } | null;
  patient?: {
    name: string;
    mobile: string;
    email: string;
  } | null;
}

const statusSteps = ["Pending", "Approved", "On the Way", "Arrived", "Completed"];

export default function BookingTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();

        if (data.success) {
          setBooking(data.booking);
        } else {
          setError(data.message || "Booking not found");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();

    // Har 8 second mein status refresh karo — live tracking feel
    const interval = setInterval(() => {
      if (id) fetchBooking();
    }, 8000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 mt-5 font-medium">
            Loading booking status...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-2xl font-bold text-rose-400">Booking not found</p>
          <p className="text-slate-400 mt-2">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(booking.status);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-5 py-8 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
            🚑
          </div>
          <span className="text-cyan-400 font-semibold tracking-wide">
            AMBULANCE AI
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Tracking your ambulance
        </h1>
        <p className="text-slate-400 mt-2">
          Booking ID: <span className="text-slate-300">{booking.id}</span>
        </p>

        {/* Status Timeline */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Status</h2>
            <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              ● {booking.status}
            </span>
          </div>

          <div className="flex items-center justify-between mt-6">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {i !== 0 && (
                  <div
                    className={`absolute top-3 right-1/2 w-full h-0.5 ${
                      i <= currentStepIndex ? "bg-cyan-400" : "bg-slate-800"
                    }`}
                  />
                )}
                <div
                  className={`w-6 h-6 rounded-full z-10 flex items-center justify-center text-xs font-bold ${
                    i <= currentStepIndex
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {i <= currentStepIndex ? "✓" : ""}
                </div>
                <p
                  className={`text-xs mt-2 text-center ${
                    i <= currentStepIndex ? "text-cyan-400" : "text-slate-600"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ambulance Info */}
        {booking.ambulance ? (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">🚑 Assigned Ambulance</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Vehicle No" value={booking.ambulance.vehicleNo} />
              <Info label="Driver" value={booking.ambulance.driverName} />
              <Info label="Driver Contact" value={booking.ambulance.driverMobile} />
              <Info label="Type" value={booking.ambulance.type} />
            </div>
          </section>
        ) : (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-6 shadow-xl">
            <p className="text-slate-400">
              Searching for the nearest available ambulance...
            </p>
          </section>
        )}

        {/* Booking Details */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Info label="Pickup Location" value={booking.pickupLocation} />
            <Info label="Destination" value={booking.destination} />
            <Info label="Emergency Type" value={booking.emergencyType} />
            <Info label="Ambulance Type" value={booking.ambulanceType} />
            <Info label="Contact Number" value={booking.mobile} />
          </div>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-semibold text-slate-200 mt-1">{value}</p>
    </div>
  );
}
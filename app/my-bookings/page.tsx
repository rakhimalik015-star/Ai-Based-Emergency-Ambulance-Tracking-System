"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Ambulance {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  type: string;
  status: string;
}

interface Booking {
  id: string;
  pickupLocation: string;
  destination: string;
  emergencyType: string;
  ambulanceType: string;
  mobile: string;
  status: string;
  createdAt: string;
  ambulance?: Ambulance | null;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await fetch("/api/my-bookings");

        const data = await res.json();

        if (data.success) {
          setBookings(data.bookings);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.log(error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "On the Way":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";

      case "Arrived":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  // ==========================================
  // STATUS DOT
  // ==========================================

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500";

      case "On the Way":
        return "bg-cyan-500 animate-pulse";

      case "Arrived":
        return "bg-indigo-500";

      case "Completed":
        return "bg-blue-500";

      case "Cancelled":
        return "bg-red-500";

      default:
        return "bg-amber-500";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">

          <div className="relative mx-auto w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />

            <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          </div>

          <h2 className="text-white text-lg font-semibold">
            Loading your emergency bookings
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Please wait...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ==========================================
          TOP HEADER
      ========================================== */}

      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                  🚑
                </div>

                <div>

                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    My Emergency Bookings
                  </h1>

                  <p className="text-slate-400 text-sm mt-1">
                    Track and manage your ambulance requests
                  </p>

                </div>

              </div>

            </div>

            {/* Booking Count */}

            <div className="flex items-center gap-3">

              <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">

                <p className="text-xs text-slate-400">
                  Total Bookings
                </p>

                <p className="text-xl font-bold text-cyan-400">
                  {bookings.length}
                </p>

              </div>

              <button
                onClick={() => router.push("/booking")}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-cyan-500/10"
              >
                + Book Ambulance
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {bookings.length === 0 ? (

          /* EMPTY STATE */

          <div className="min-h-[60vh] flex items-center justify-center">

            <div className="max-w-md w-full text-center">

              <div className="w-24 h-24 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-5xl mb-6">
                🚑
              </div>

              <h2 className="text-2xl font-bold text-white">
                No bookings yet
              </h2>

              <p className="text-slate-400 mt-2 leading-relaxed">
                You don't have any ambulance bookings.
                Create a booking whenever emergency
                transportation is required.
              </p>

              <button
                onClick={() => router.push("/booking")}
                className="mt-7 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-7 py-3 rounded-xl font-bold transition"
              >
                🚑 Book an Ambulance
              </button>

            </div>

          </div>

        ) : (

          /* BOOKING LIST */

          <div className="space-y-7">

            {bookings.map((booking, index) => (

              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
              >

                {/* ==================================
                    BOOKING HEADER
                ================================== */}

                <div className="p-5 md:p-6 border-b border-slate-800">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="text-slate-500 text-sm font-medium">
                          Booking #{index + 1}
                        </span>

                        <span className="text-slate-700">
                          •
                        </span>

                        <span className="text-slate-500 text-sm">
                          {new Date(
                            booking.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <h2 className="text-lg md:text-xl font-bold text-white mt-2">
                        Emergency Ambulance Request
                      </h2>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border font-semibold text-sm ${getStatusStyle(
                        booking.status
                      )}`}
                    >

                      <span
                        className={`w-2.5 h-2.5 rounded-full ${getStatusDot(
                          booking.status
                        )}`}
                      />

                      {booking.status}

                    </div>

                  </div>

                </div>

                {/* ==================================
                    ROUTE SECTION
                ================================== */}

                <div className="p-5 md:p-6">

                  <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-5 items-center">

                    {/* PICKUP */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

                      <div className="flex items-start gap-4">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          📍
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                            Pickup Location
                          </p>

                          <p className="text-white font-semibold mt-1 break-words">
                            {booking.pickupLocation}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ROUTE ICON */}

                    <div className="hidden lg:flex items-center justify-center">

                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-xl">
                        ➜
                      </div>

                    </div>

                    {/* DESTINATION */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

                      <div className="flex items-start gap-4">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          🏥
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs uppercase tracking-wider text-red-400 font-bold">
                            Destination
                          </p>

                          <p className="text-white font-semibold mt-1 break-words">
                            {booking.destination}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ==================================
                      BOOKING INFORMATION
                  ================================== */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

                    {/* Emergency */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Emergency
                      </p>

                      <p className="text-white font-semibold mt-2">
                        🚨 {booking.emergencyType}
                      </p>

                    </div>

                    {/* Ambulance Type */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Ambulance Type
                      </p>

                      <p className="text-white font-semibold mt-2">
                        🚑 {booking.ambulanceType}
                      </p>

                    </div>

                    {/* Mobile */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Contact Number
                      </p>

                      <p className="text-white font-semibold mt-2">
                        📞 {booking.mobile}
                      </p>

                    </div>

                    {/* Booking ID */}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Booking ID
                      </p>

                      <p className="text-cyan-400 font-mono text-sm mt-2 truncate">
                        {booking.id}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ==================================
                    AMBULANCE SECTION
                ================================== */}

                {booking.ambulance ? (

                  <div className="mx-5 md:mx-6 mb-6">

                    <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 overflow-hidden">

                      {/* Ambulance Header */}

                      <div className="p-5 border-b border-slate-800">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-2xl">
                              🚑
                            </div>

                            <div>

                              <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                                Ambulance Assigned
                              </p>

                              <h3 className="text-xl font-bold text-white">
                                {booking.ambulance.vehicleNo}
                              </h3>

                            </div>

                          </div>

                          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">

                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

                            {booking.ambulance.status}

                          </span>

                        </div>

                      </div>

                      {/* Ambulance Details */}

                      <div className="p-5">

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                          <div>

                            <p className="text-xs text-slate-500">
                              DRIVER
                            </p>

                            <p className="text-white font-semibold mt-1">
                              👨‍✈️ {booking.ambulance.driverName}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-slate-500">
                              DRIVER MOBILE
                            </p>

                            <p className="text-white font-semibold mt-1">
                              📞 {booking.ambulance.driverMobile}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-slate-500">
                              VEHICLE TYPE
                            </p>

                            <p className="text-white font-semibold mt-1">
                              🚑 {booking.ambulance.type}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-slate-500">
                              VEHICLE NUMBER
                            </p>

                            <p className="text-cyan-400 font-bold mt-1">
                              {booking.ambulance.vehicleNo}
                            </p>

                          </div>

                        </div>

                        {/* Actions */}

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">

                          <a
                            href={`tel:${booking.ambulance.driverMobile}`}
                            className="flex-1 text-center bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                          >
                            📞 Call Driver
                          </a>

                          {(booking.status === "On the Way" ||
                            booking.status === "Arrived") && (

                            <button
                              onClick={() =>
                                router.push(
                                  `/tracking/${booking.id}`
                                )
                              }
                              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-cyan-500/10"
                            >
                              🗺️ Track Ambulance Live
                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                ) : (

                  /* NOT ASSIGNED */

                  <div className="mx-5 md:mx-6 mb-6">

                    <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-5">

                      <div className="flex items-start gap-4">

                        <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">
                          ⏳
                        </div>

                        <div>

                          <h3 className="text-amber-300 font-bold">
                            Ambulance Not Assigned Yet
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            Your booking has been received.
                            The emergency response team will
                            assign an available ambulance shortly.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                )}

                {/* ==================================
                    LIVE TRACKING CTA
                ================================== */}

                {booking.status === "On the Way" && (

                  <div className="border-t border-cyan-400/10 bg-cyan-500/5 px-5 md:px-6 py-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="relative">

                          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-xl">
                            📡
                          </div>

                          <span className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />

                        </div>

                        <div>

                          <h3 className="text-white font-bold">
                            Ambulance is on the way
                          </h3>

                          <p className="text-slate-400 text-sm">
                            Live location tracking is available.
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          router.push(
                            `/tracking/${booking.id}`
                          )
                        }
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition"
                      >
                        🗺️ Open Live Tracking
                      </button>

                    </div>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="border-t border-slate-800 mt-10">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-slate-500 text-sm">
              🚑 Ambulance AI — Emergency Response System
            </p>

            <p className="text-slate-600 text-xs">
              AI-powered ambulance tracking & hospital assistance
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// interface Ambulance {
//   id: string;
//   vehicleNo: string;
//   driverName: string;
//   driverMobile: string;
//   type: string;
//   status: string;
// }

// interface Booking {
//   id: string;
//   pickupLocation: string;
//   destination: string;
//   emergencyType: string;
//   ambulanceType: string;
//   mobile: string;
//   status: string;
//   createdAt: string;
//   ambulance?: Ambulance | null;
// }

// export default function MyBookings() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const getBookings = async () => {
//       try {
//         const res = await fetch("/api/my-bookings");

//         const data = await res.json();

//         if (data.success) {
//           setBookings(data.bookings);
//         } else {
//           window.location.href = "/login";
//         }
//       } catch (error) {
//         console.log(error);
//         window.location.href = "/login";
//       } finally {
//         setLoading(false);
//       }
//     };

//     getBookings();
//   }, []);

//   if (loading) {
//     return (
//       <h1 className="text-center mt-20 text-2xl">
//         Loading Bookings...
//       </h1>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">

//       <h1 className="text-3xl font-bold mb-8">
//         My Ambulance Bookings 🚑
//       </h1>

//       {bookings.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <p className="text-gray-600">
//             No bookings found.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6">

//           {bookings.map((booking) => (
//             <div
//               key={booking.id}
//               className="bg-white border rounded-xl shadow p-6"
//             >

//               {/* Booking Details */}
//               <h2 className="text-xl font-bold mb-4">
//                 Booking Details
//               </h2>

//               <div className="grid md:grid-cols-2 gap-3">

//                 <p>
//                   <b>Pickup:</b>{" "}
//                   {booking.pickupLocation}
//                 </p>

//                 <p>
//                   <b>Destination:</b>{" "}
//                   {booking.destination}
//                 </p>

//                 <p>
//                   <b>Emergency:</b>{" "}
//                   {booking.emergencyType}
//                 </p>

//                 <p>
//                   <b>Ambulance Type:</b>{" "}
//                   {booking.ambulanceType}
//                 </p>

//                 <p>
//                   <b>Mobile:</b>{" "}
//                   {booking.mobile}
//                 </p>

//                 <p>
//                   <b>Status:</b>{" "}
//                   <span
//                     className={
//                       booking.status === "Approved"
//                         ? "text-green-600 font-bold"
//                         : booking.status === "Cancelled"
//                           ? "text-red-600 font-bold"
//                           : booking.status === "Completed"
//                             ? "text-blue-600 font-bold"
//                             : "text-yellow-600 font-bold"
//                     }
//                   >
//                     {booking.status}
//                   </span>
//                 </p>

//               </div>
//               {booking.status === "On the Way" && (
//                 <button
//                   onClick={() =>
//                     router.push(`/tracking/${booking.id}`)
//                   }
//                   className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
//                 >
//                   🚑 Track Ambulance Live
//                 </button>
//               )}

//               {/* Ambulance Information */}
//               {booking.ambulance ? (
//                 <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5">

//                   <h2 className="text-xl font-bold text-green-700 mb-4">
//                     🚑 Ambulance Assigned
//                   </h2>

//                   <div className="grid md:grid-cols-2 gap-3">

//                     <p>
//                       <b>Vehicle No:</b>{" "}
//                       {booking.ambulance.vehicleNo}
//                     </p>

//                     <p>
//                       <b>Driver:</b>{" "}
//                       {booking.ambulance.driverName}
//                     </p>

//                     <p>
//                       <b>Driver Mobile:</b>{" "}
//                       {booking.ambulance.driverMobile}
//                     </p>

//                     <p>
//                       <b>Ambulance Type:</b>{" "}
//                       {booking.ambulance.type}
//                     </p>

//                     <p>
//                       <b>Ambulance Status:</b>{" "}
//                       <span className="text-red-600 font-semibold">
//                         {booking.ambulance.status}
//                       </span>
//                     </p>

//                   </div>

//                 </div>
//               ) : (
//                 <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

//                   <p className="text-yellow-700 font-medium">
//                     ⏳ Ambulance has not been assigned yet.
//                   </p>

//                 </div>
//               )}

//             </div>
//           ))}

//         </div>
//       )}

//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

interface Patient {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender?: string;
  bloodGroup: string;
}

export default function Dashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("/api/profile");

        const data = await res.json();

        if (data.success) {
          setPatient(data.patient);
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

    getProfile();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">

          <div className="relative w-16 h-16 mx-auto mb-5">

            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />

            <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />

          </div>

          <h2 className="text-white text-lg font-semibold">
            Loading Patient Dashboard
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Please wait...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==========================================
          TOP HEADER
      ========================================== */}

      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                🚑
              </div>

              <div>

                <h1 className="text-xl font-bold">
                  Ambulance <span className="text-cyan-400">AI</span>
                </h1>

                <p className="text-xs text-slate-500">
                  Emergency Response System
                </p>

              </div>

            </div>

            {/* Emergency Status */}

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-emerald-400 text-sm font-semibold">
                  Emergency System Online
                </span>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {/* ==========================================
            WELCOME HERO
        ========================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 md:p-10 mb-8">

          {/* Background Decoration */}

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div>

                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-3 py-1.5 rounded-full mb-4">

                  <span className="w-2 h-2 bg-cyan-400 rounded-full" />

                  <span className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                    Patient Dashboard
                  </span>

                </div>

                <h2 className="text-3xl md:text-4xl font-bold">

                  Welcome,{" "}

                  <span className="text-cyan-400">
                    {patient?.name}
                  </span>{" "}

                  👋

                </h2>

                <p className="text-slate-400 mt-3 max-w-xl leading-relaxed">

                  Access emergency ambulance services, track
                  your ambulance in real time and manage your
                  medical assistance requests from one place.

                </p>

              </div>

              {/* Emergency Button */}

              <a
                href="/booking"
                className="shrink-0 inline-flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-7 py-4 rounded-2xl font-bold transition shadow-xl shadow-cyan-500/10"
              >
                <span className="text-xl">
                  🚑
                </span>

                Book Ambulance

              </a>

            </div>

          </div>

        </section>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <section className="mb-8">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold">
                Emergency Services
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Quick access to ambulance services
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* BOOK AMBULANCE */}

            <a
              href="/booking"
              className="group bg-slate-900 border border-slate-800 hover:border-cyan-400/40 rounded-2xl p-6 transition hover:-translate-y-1"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                  🚑
                </div>

                <span className="text-slate-600 group-hover:text-cyan-400 transition text-xl">
                  →
                </span>

              </div>

              <h3 className="text-lg font-bold mt-5">
                Book Ambulance
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Request an ambulance for an emergency situation.
              </p>

            </a>

            {/* MY BOOKINGS */}

            <a
              href="/my-bookings"
              className="group bg-slate-900 border border-slate-800 hover:border-blue-400/40 rounded-2xl p-6 transition hover:-translate-y-1"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-2xl">
                  📋
                </div>

                <span className="text-slate-600 group-hover:text-blue-400 transition text-xl">
                  →
                </span>

              </div>

              <h3 className="text-lg font-bold mt-5">
                My Bookings
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                View ambulance requests and their current status.
              </p>

            </a>

            {/* PROFILE */}

            <a
              href="/profile"
              className="group bg-slate-900 border border-slate-800 hover:border-violet-400/40 rounded-2xl p-6 transition hover:-translate-y-1"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center text-2xl">
                  👤
                </div>

                <span className="text-slate-600 group-hover:text-violet-400 transition text-xl">
                  →
                </span>

              </div>

              <h3 className="text-lg font-bold mt-5">
                My Profile
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Manage your personal and medical information.
              </p>

            </a>

          </div>

        </section>

        {/* ==========================================
            PATIENT INFORMATION + EMERGENCY PANEL
        ========================================== */}

        <section className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">

          {/* PATIENT INFORMATION */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                  👤
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Patient Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Registered patient details
                  </p>

                </div>

              </div>

            </div>

            {patient && (

              <div className="p-6">

                <div className="grid sm:grid-cols-2 gap-4">

                  {/* NAME */}

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Full Name
                    </p>

                    <p className="text-white font-semibold mt-2">
                      {patient.name}
                    </p>

                  </div>

                  {/* EMAIL */}

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Email
                    </p>

                    <p className="text-white font-semibold mt-2 break-all">
                      {patient.email}
                    </p>

                  </div>

                  {/* MOBILE */}

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Mobile Number
                    </p>

                    <p className="text-white font-semibold mt-2">
                      📞 {patient.mobile}
                    </p>

                  </div>

                  {/* AGE */}

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Age
                    </p>

                    <p className="text-white font-semibold mt-2">
                      {patient.age} Years
                    </p>

                  </div>

                  {/* GENDER */}

                  {patient.gender && (

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Gender
                      </p>

                      <p className="text-white font-semibold mt-2">
                        {patient.gender}
                      </p>

                    </div>

                  )}

                  {/* BLOOD GROUP */}

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Blood Group
                    </p>

                    <p className="text-red-400 font-bold mt-2">
                      🩸 {patient.bloodGroup}
                    </p>

                  </div>

                </div>

                <a
                  href="/profile"
                  className="inline-flex mt-5 text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                >
                  View complete profile →
                </a>

              </div>

            )}

          </div>

          {/* EMERGENCY PANEL */}

          <div className="bg-gradient-to-br from-cyan-500/10 to-slate-900 border border-cyan-400/20 rounded-2xl p-6">

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-3xl mb-5">
              🚨
            </div>

            <h2 className="text-xl font-bold">
              Need Emergency Help?
            </h2>

            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Request an ambulance and our emergency
              response system will help connect you with
              available ambulance services.
            </p>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-sm">

                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  ✓
                </span>

                <span className="text-slate-300">
                  Real-time ambulance tracking
                </span>

              </div>

              <div className="flex items-center gap-3 text-sm">

                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  ✓
                </span>

                <span className="text-slate-300">
                  AI hospital recommendation
                </span>

              </div>

              <div className="flex items-center gap-3 text-sm">

                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  ✓
                </span>

                <span className="text-slate-300">
                  Live ambulance location
                </span>

              </div>

            </div>

            <a
              href="/booking"
              className="block text-center mt-7 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-xl font-bold transition"
            >
              🚑 Request Ambulance
            </a>

          </div>

        </section>

        {/* ==========================================
            SYSTEM FEATURES
        ========================================== */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="mb-5">

            <h2 className="text-xl font-bold">
              Ambulance AI Services
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Intelligent emergency response capabilities
            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">

              <div className="text-2xl">
                🗺️
              </div>

              <p className="text-white font-semibold text-sm mt-3">
                Live Tracking
              </p>

            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">

              <div className="text-2xl">
                🤖
              </div>

              <p className="text-white font-semibold text-sm mt-3">
                AI Hospital
              </p>

            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">

              <div className="text-2xl">
                🚦
              </div>

              <p className="text-white font-semibold text-sm mt-3">
                Traffic Prediction
              </p>

            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">

              <div className="text-2xl">
                🔔
              </div>

              <p className="text-white font-semibold text-sm mt-3">
                Real-time Alerts
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="border-t border-slate-800 mt-8">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-slate-500 text-sm">
              🚑 Ambulance AI
            </p>

            <p className="text-slate-600 text-xs text-center">
              AI-Based Emergency Ambulance Tracking System
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";

// export default function Dashboard() {

//     const [patient, setPatient] = useState<any>(null);
//     const [loading, setLoading] = useState(true);


//     useEffect(() => {

//         const getProfile = async () => {

//             try {

//                 const res = await fetch("/api/profile");

//                 const data = await res.json();

//                 if (data.success) {
//                     setPatient(data.patient);
//                 } else {
//                     window.location.href = "/login";
//                 }

//             } catch (error) {
//                 console.log(error);
//                 window.location.href = "/login";
//             }
//             finally {
//                 setLoading(false);
//             }

//         };


//         getProfile();

//     }, []);


//     if (loading) {
//         return (
//             <h1 className="text-center mt-20">
//                 Loading...
//             </h1>
//         );
//     }


//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center">

//             <h1 className="text-4xl font-bold">
//                 Patient Dashboard
//             </h1>


//             {patient && (
//                 <div className="mt-6 bg-gray-100 p-6 rounded-lg">

//                     <h2 className="text-2xl font-bold">
//                         Welcome {patient.name} 👋
//                     </h2>

//                     <p className="mt-2">
//                         Email: {patient.email}
//                     </p>

//                     <p>
//                         Mobile: {patient.mobile}
//                     </p>

//                     <p>
//                         Age: {patient.age}
//                     </p>

//                     <p>
//                         Blood Group: {patient.bloodGroup}
//                     </p>

//                 </div>
//             )}


//             <a href="/booking">
//                 <button className="mt-6 bg-red-600 text-white px-6 py-3 rounded">
//                     Book Ambulance
//                 </button>
//             </a>



//             <a href="/my-bookings">
//                 <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded">
//                     My Bookings
//                 </button>
//             </a>


//             <a href="/profile">
//                 <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded">
//                     My Profile
//                 </button>
//             </a>

//         </div>
//     );
// }
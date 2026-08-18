
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
  patient?: {
    name?: string;
  };
};

type Stats = {
  totalPatients: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  recentBookings: Booking[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    recentBookings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const data = await res.json();

        if (data.success) {
          setStats({
            totalPatients: data.totalPatients ?? 0,
            totalBookings: data.totalBookings ?? 0,
            pendingBookings: data.pendingBookings ?? 0,
            approvedBookings: data.approvedBookings ?? 0,
            completedBookings: data.completedBookings ?? 0,
            cancelledBookings: data.cancelledBookings ?? 0,
            recentBookings: data.recentBookings ?? [],
          });
        }
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: "👥",
      accent: "violet",
      description: "Registered patients",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "🚑",
      accent: "cyan",
      description: "All ambulance requests",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: "⏳",
      accent: "amber",
      description: "Awaiting approval",
    },
    {
      title: "Approved",
      value: stats.approvedBookings,
      icon: "✓",
      accent: "lime",
      description: "Active bookings",
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: "✓",
      accent: "purple",
      description: "Successfully completed",
    },
    {
      title: "Cancelled",
      value: stats.cancelledBookings,
      icon: "×",
      accent: "rose",
      description: "Cancelled requests",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-lime-400/20 bg-lime-400/10 text-lime-300";

      case "Pending":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";

      case "Cancelled":
        return "border-rose-400/20 bg-rose-400/10 text-rose-300";

      case "Completed":
        return "border-violet-400/20 bg-violet-400/10 text-violet-300";

      case "Arrived":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/[0.06] bg-[#0A0E18] lg:block">

        {/* Logo */}

        <div className="flex h-20 items-center border-b border-white/[0.06] px-6">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-xl shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              🚑
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">
                Ambulance AI
              </h1>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-slate-500">
                Command Center
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="space-y-1.5 p-4">

          <p className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
            Main Menu
          </p>

          {/* Dashboard */}

          <Link
            href="/admin/dashboard"
            className="group flex items-center gap-3 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-cyan-400/5 px-4 py-3 text-sm font-medium text-violet-300 shadow-[inset_3px_0_0_#8B5CF6]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
              ▦
            </span>

            Dashboard
          </Link>

          {/* Patients */}

          <Link
            href="/admin/patients"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-cyan-300"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              👥
            </span>

            Patients
          </Link>

          {/* Bookings */}

          <Link
            href="/admin/bookings"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-cyan-300"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              🚑
            </span>

            Bookings
          </Link>
          
          {/* Ambulances */}

          <Link
            href="/admin/ambulances"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-cyan-300"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              🚨
            </span>

            Ambulances
          </Link>
          {/* Drivers */}

          <Link
            href="/admin/drivers"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-cyan-300"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              🚨
            </span>

            Drivers
          </Link>

          <div className="my-6 h-px bg-white/[0.06]" />

          <p className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
            Administration
          </p>

          

          


          {/* Add Admin */}

          <Link
            href="/admin/dashboard/add-admin"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-violet-300"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              👤
            </span>

            Add Administrator
          </Link>


        </nav>

        {/* System Status */}

        <div className="absolute bottom-5 left-4 right-4">

          <div className="rounded-2xl border border-white/[0.06] bg-[#0E1420] p-4">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                System
              </span>

              <span className="flex items-center gap-1.5 text-[10px] font-medium text-lime-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />
                Operational
              </span>

            </div>

            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">

              <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

            </div>

            <div className="mt-3 flex justify-between text-[9px] text-slate-600">

              <span>Services</span>

              <span>96%</span>

            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="lg:ml-64">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070A12]/90 px-5 backdrop-blur-xl sm:px-7 lg:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400">
              Emergency Operations
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
              Command Dashboard
            </h2>

          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-medium text-white">
                Administrator
              </p>

              <p className="text-[10px] text-slate-500">
                System Manager
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-sm font-bold text-violet-300">
              A
            </div>

          </div>

        </header>

        <div className="p-5 sm:p-7 lg:p-8">

          {/* =================================================
              TITLE
          ================================================== */}

          <div className="mb-8">

            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
              ADMIN / OVERVIEW
            </p>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Operations
                  <span className="ml-2 bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                    Overview
                  </span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Monitor emergency ambulance operations, patient activity
                  and booking performance from one control center.
                </p>

              </div>

              {/* Live indicator */}

              <div className="flex w-fit items-center gap-3 rounded-xl border border-lime-400/10 bg-lime-400/[0.03] px-4 py-2.5">

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-lime-300">
                  Live System
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              STATISTICS
          ================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {statCards.map((card) => (

              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-[#0E1420]"
              >

                <div className="relative z-10 flex items-start justify-between">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      {card.title}
                    </p>

                    <div className="mt-3">

                      {loading ? (

                        <div className="h-9 w-14 animate-pulse rounded-lg bg-white/[0.06]" />

                      ) : (

                        <p className="text-3xl font-bold tracking-tight text-white">
                          {card.value}
                        </p>

                      )}

                    </div>

                    <p className="mt-2 text-[10px] text-slate-600">
                      {card.description}
                    </p>

                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg ${
                      card.accent === "violet"
                        ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
                        : card.accent === "cyan"
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                        : card.accent === "amber"
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        : card.accent === "lime"
                        ? "border-lime-400/20 bg-lime-400/10 text-lime-300"
                        : card.accent === "purple"
                        ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                        : "border-rose-400/20 bg-rose-400/10 text-rose-300"
                    }`}
                  >
                    {card.icon}
                  </div>

                </div>

                {/* Decorative glow */}

                <div
                  className={`absolute -bottom-12 -right-12 h-28 w-28 rounded-full blur-3xl ${
                    card.accent === "violet"
                      ? "bg-violet-500/10"
                      : card.accent === "cyan"
                      ? "bg-cyan-400/10"
                      : card.accent === "amber"
                      ? "bg-amber-400/10"
                      : card.accent === "lime"
                      ? "bg-lime-400/10"
                      : card.accent === "purple"
                      ? "bg-purple-500/10"
                      : "bg-rose-500/10"
                  }`}
                />

              </div>

            ))}

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="mt-9">

            <div className="mb-4">

              <h2 className="text-lg font-semibold text-white">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Frequently used administration tools
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* Patients */}

              <Link
                href="/admin/patients"
                className="group rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-[#0E1420]"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                  👥
                </div>

                <h3 className="font-semibold text-white">
                  Manage Patients
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  View registered patients
                </p>

                <span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  Open Module →
                </span>

              </Link>

              {/* Bookings */}

              <Link
                href="/admin/bookings"
                className="group rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-[#0E1420]"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  🚑
                </div>

                <h3 className="font-semibold text-white">
                  Manage Bookings
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Review emergency requests
                </p>

                <span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                  Open Module →
                </span>

              </Link>

              {/* Ambulances */}

              <Link
                href="/admin/ambulances"
                className="group rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/20 hover:bg-[#0E1420]"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10 text-lime-300">
                  🚨
                </div>

                <h3 className="font-semibold text-white">
                  Ambulance Fleet
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Manage ambulance units
                </p>

                <span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-lime-300">
                  Open Module →
                </span>

              </Link>

              {/* Add Admin */}

              <Link
                href="/admin/dashboard/add-admin"
                className="group rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-[#0E1420]"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                  👤
                </div>

                <h3 className="font-semibold text-white">
                  Add Administrator
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Create admin accounts
                </p>

                <span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                  Open Module →
                </span>

              </Link>

            </div>

          </section>

          {/* =================================================
              RECENT BOOKINGS
          ================================================== */}

          <section className="mt-9 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B]">

            {/* Header */}

            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="font-semibold text-white">
                    Recent Bookings
                  </h2>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cyan-300">
                    Live
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Latest ambulance activity
                </p>

              </div>

              <Link
                href="/admin/bookings"
                className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 transition hover:text-cyan-200"
              >
                View All →
              </Link>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[720px]">

                <thead>

                  <tr className="border-b border-white/[0.06] bg-[#090D15]">

                    <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Pickup
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Destination
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={4}
                        className="px-5 py-14 text-center text-xs text-slate-600"
                      >
                        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

                        Loading booking activity...

                      </td>

                    </tr>

                  ) : stats.recentBookings.length === 0 ? (

                    <tr>

                      <td
                        colSpan={4}
                        className="px-5 py-14 text-center"
                      >

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-xl">
                          🚑
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-400">
                          No recent bookings
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          New ambulance requests will appear here.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    stats.recentBookings.map((booking) => (

                      <tr
                        key={booking.id}
                        className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                      >

                        {/* Patient */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/5 text-xs font-bold text-violet-300">

                              {booking.patient?.name
                                ?.charAt(0)
                                .toUpperCase() || "P"}

                            </div>

                            <div>

                              <p className="text-sm font-medium text-slate-200">
                                {booking.patient?.name || "Unknown Patient"}
                              </p>

                              <p className="mt-0.5 text-[9px] text-slate-700">
                                ID: {booking.id.slice(-6)}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Pickup */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                            <span className="text-xs text-slate-400">
                              {booking.pickupLocation}
                            </span>

                          </div>

                        </td>

                        {/* Destination */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                            <span className="text-xs text-slate-400">
                              {booking.destination}
                            </span>

                          </div>

                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${getStatusStyle(
                              booking.status
                            )}`}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {booking.status}

                          </span>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* =================================================
              FOOTER
          ================================================== */}

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-wider text-slate-700 sm:flex-row">

            <p>
              Ambulance AI • Emergency Operations Platform
            </p>

            <p>
              Secure Admin Control Center
            </p>

          </footer>

        </div>

      </main>

    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function AdminDashboard() {

//   const [stats, setStats] = useState({
//     totalPatients: 0,
//     totalBookings: 0,
//     pendingBookings: 0,
//     approvedBookings: 0,
//     completedBookings: 0,
//     cancelledBookings: 0,
//     recentBookings: [],
//   });

//   useEffect(() => {

//     const getDashboard = async () => {

//       try {

//         const res = await fetch("/api/admin/dashboard");

//         const data = await res.json();

//         if (data.success) {
//           setStats({
//             totalPatients: data.totalPatients,
//             totalBookings: data.totalBookings,
//             pendingBookings: data.pendingBookings,
//             approvedBookings: data.approvedBookings,
//             completedBookings: data.completedBookings,
//             cancelledBookings: data.cancelledBookings,
//             recentBookings: data.recentBookings,
//           });
//         }

//       } catch (error) {
//         console.log(error);
//       }

//     };

//     getDashboard();

//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* Header */}
//       <div className="bg-red-600 text-white p-5">
//         <h1 className="text-3xl font-bold">
//           Admin Dashboard
//         </h1>
//       </div>

//       <div className="p-8">

//         <h2 className="text-2xl font-semibold mb-6">
//           Welcome Admin 👋
//         </h2>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Total Patients</h2>
//             <p className="text-3xl font-bold text-blue-600">
//               {stats.totalPatients}
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Total Bookings</h2>
//             <p className="text-3xl font-bold text-green-600">
//               {stats.totalBookings}
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Pending Bookings</h2>
//             <p className="text-3xl font-bold text-orange-600">
//               {stats.pendingBookings}
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Completed Bookings</h2>
//             <p className="text-3xl font-bold text-purple-600">
//               {stats.completedBookings}
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Approved Bookings</h2>
//             <p className="text-3xl font-bold text-green-600">
//               {stats.approvedBookings}
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-lg shadow">
//             <h2 className="text-gray-500">Cancelled Bookings</h2>
//             <p className="text-3xl font-bold text-red-600">
//               {stats.cancelledBookings}
//             </p>
//           </div>

//         </div>

//         {/* Management Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//           <Link
//             href="/admin/patients"
//             className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
//           >
//             <h3 className="text-xl font-bold">
//               👨‍⚕️ Manage Patients
//             </h3>

//             <p className="mt-2 text-gray-600">
//               View all registered patients.
//             </p>
//           </Link>

//           <Link
//             href="/admin/bookings"
//             className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
//           >
//             <h3 className="text-xl font-bold">
//               🚑 Manage Bookings
//             </h3>

//             <p className="mt-2 text-gray-600">
//               View and update ambulance bookings.
//             </p>
//           </Link>

//           <Link
//             href="/admin/ambulances"
//             className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
//           >
//             <h3 className="text-xl font-bold">
//               🚑 Ambulances
//             </h3>

//             <p className="mt-2 text-gray-600">
//               Manage ambulance details.
//             </p>
//           </Link>
//           <Link
//             href="/admin/dashboard/add-admin"
//             className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
//           >
//             <h3 className="text-xl font-bold">
//               👤 Add Admin
//             </h3>

//             <p className="mt-2 text-gray-600">
//               Create a new admin account.
//             </p>
//           </Link>

//         </div>


//         <div className="mt-10 bg-white rounded-lg shadow p-6">

//           <h2 className="text-2xl font-bold mb-4">
//             Recent Bookings
//           </h2>

//           <table className="w-full border-collapse">

//             <thead className="bg-red-600 text-white">

//               <tr>
//                 <th className="p-3">Patient</th>
//                 <th className="p-3">Pickup</th>
//                 <th className="p-3">Destination</th>
//                 <th className="p-3">Status</th>
//               </tr>

//             </thead>

//             <tbody>

//               {stats.recentBookings.map((booking: any) => (

//                 <tr
//                   key={booking.id}
//                   className="border-b hover:bg-gray-100"
//                 >
//                   <td className="p-3">
//                     {booking.patient.name}
//                   </td>

//                   <td className="p-3">
//                     {booking.pickupLocation}
//                   </td>

//                   <td className="p-3">
//                     {booking.destination}
//                   </td>

//                   <td className="p-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-white ${booking.status === "Approved"
//                         ? "bg-green-500"
//                         : booking.status === "Pending"
//                           ? "bg-yellow-500"
//                           : booking.status === "Cancelled"
//                             ? "bg-red-500"
//                             : "bg-blue-500"
//                         }`}
//                     >
//                       {booking.status}
//                     </span>
//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Ambulance {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  type: string;
  status: string;
}

export default function ManageAmbulances() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================================================
  // GET AMBULANCES
  // =========================================================

  useEffect(() => {
    const getAmbulances = async () => {
      try {
        const res = await fetch("/api/admin/ambulances");
        const data = await res.json();

        if (data.success) {
          setAmbulances(data.ambulances || []);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("GET AMBULANCES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    getAmbulances();
  }, []);

  // =========================================================
  // DELETE AMBULANCE
  // =========================================================

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this ambulance?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/admin/ambulances/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Ambulance Deleted Successfully");

        setAmbulances((prev) =>
          prev.filter((ambulance) => ambulance.id !== id)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("DELETE AMBULANCE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAmbulances = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return ambulances;

    return ambulances.filter((ambulance) => {
      return (
        ambulance.vehicleNo.toLowerCase().includes(value) ||
        ambulance.driverName.toLowerCase().includes(value) ||
        ambulance.driverMobile.toLowerCase().includes(value) ||
        ambulance.type.toLowerCase().includes(value) ||
        ambulance.status.toLowerCase().includes(value)
      );
    });
  }, [ambulances, search]);

  // =========================================================
  // STATS
  // =========================================================

  const availableCount = ambulances.filter(
    (ambulance) => ambulance.status === "Available"
  ).length;

  const busyCount = ambulances.filter(
    (ambulance) => ambulance.status === "Busy"
  ).length;

  const emergencyCount = ambulances.filter(
    (ambulance) => ambulance.status === "Emergency"
  ).length;

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Available":
        return "border-lime-400/20 bg-lime-400/[0.06] text-lime-300";

      case "Busy":
        return "border-amber-400/20 bg-amber-400/[0.06] text-amber-300";

      case "Emergency":
        return "border-rose-400/20 bg-rose-400/[0.06] text-rose-300";

      default:
        return "border-slate-400/10 bg-slate-400/[0.04] text-slate-400";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A12]">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04]">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Loading ambulance fleet...
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-slate-700">
            Fleet Operations Center
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200">

      {/* TOP ACCENT */}

      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-[1550px] px-5 py-8 sm:px-7 lg:px-10">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2">

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              ADMIN / FLEET MANAGEMENT
            </span>

            <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
              Vehicle Control
            </span>

          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Ambulance

                <span className="ml-2 bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                  Fleet
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage emergency vehicles, drivers, ambulance types and
                real-time fleet availability.
              </p>

            </div>

            {/* Add Ambulance */}

            <Link
              href="/admin/ambulances/add"
              className="group flex w-fit items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-cyan-500/10 transition hover:scale-[1.02] hover:shadow-cyan-500/20"
            >

              <span className="text-lg transition group-hover:rotate-90">
                +
              </span>

              Add Ambulance

            </Link>

          </div>

        </div>

        {/* ===================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Total Fleet
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {ambulances.length}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.05] text-lg">
                🚑
              </div>

            </div>

          </div>

          {/* Available */}

          <div className="rounded-2xl border border-lime-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Available
                </p>

                <p className="mt-2 text-2xl font-bold text-lime-300">
                  {availableCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-lime-400/15 bg-lime-400/[0.05]">

                <span className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_#A3E635]" />

              </div>

            </div>

          </div>

          {/* Busy */}

          <div className="rounded-2xl border border-amber-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  On Duty
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-300">
                  {busyCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.05]">
                ◷
              </div>

            </div>

          </div>

          {/* Emergency */}

          <div className="rounded-2xl border border-rose-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Emergency
                </p>

                <p className="mt-2 text-2xl font-bold text-rose-300">
                  {emergencyCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.05]">
                !
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH
        ==================================================== */}

        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0C111B] p-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-xl">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-600">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search vehicle, driver, mobile, type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
              />

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] px-4 py-2.5">

                <span className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  Showing{" "}
                </span>

                <span className="text-xs font-bold text-cyan-300">
                  {filteredAmbulances.length}
                </span>

              </div>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-white/[0.06] px-4 py-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            TABLE CONTAINER
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B]">

          {/* TABLE HEADER */}

          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="font-semibold text-white">
                  Ambulance Fleet
                </h2>

                <span className="rounded-full border border-violet-400/10 bg-violet-400/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-violet-300">
                  Fleet Control
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-600">
                Monitor and manage registered emergency vehicles
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-lime-300">
                Fleet Operational
              </span>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead>

                <tr className="border-b border-white/[0.06] bg-[#090D15]">

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Vehicle
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Driver
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Ambulance Type
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAmbulances.length > 0 ? (

                  filteredAmbulances.map((ambulance) => (

                    <tr
                      key={ambulance.id}
                      className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >

                      {/* ======================================
                          VEHICLE
                      ======================================= */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] text-lg">
                            🚑
                          </div>

                          <div>

                            <p className="text-sm font-bold tracking-wide text-white">
                              {ambulance.vehicleNo}
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-700">
                              Vehicle ID
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ======================================
                          DRIVER
                      ======================================= */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/15 bg-violet-400/[0.05] text-xs font-bold text-violet-300">
                            {ambulance.driverName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="text-xs font-semibold text-slate-300">
                              {ambulance.driverName}
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-700">
                              Driver
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ======================================
                          MOBILE
                      ======================================= */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <span className="text-cyan-300">
                            ☎
                          </span>

                          <span className="text-xs text-slate-400">
                            {ambulance.driverMobile}
                          </span>

                        </div>

                      </td>

                      {/* ======================================
                          TYPE
                      ======================================= */}

                      <td className="px-5 py-5">

                        <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs font-medium text-slate-400">

                          <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />

                          {ambulance.type}

                        </span>

                      </td>

                      {/* ======================================
                          STATUS
                      ======================================= */}

                      <td className="px-5 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${getStatusStyle(
                            ambulance.status
                          )}`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ambulance.status === "Available"
                                ? "bg-lime-300 shadow-[0_0_7px_#A3E635]"
                                : ambulance.status === "Busy"
                                ? "bg-amber-300 shadow-[0_0_7px_#FCD34D]"
                                : ambulance.status === "Emergency"
                                ? "animate-pulse bg-rose-300 shadow-[0_0_7px_#FB7185]"
                                : "bg-slate-400"
                            }`}
                          />

                          {ambulance.status}

                        </span>

                      </td>

                      {/* ======================================
                          ACTIONS
                      ======================================= */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <Link
                            href={`/admin/ambulances/${ambulance.id}/edit`}
                            className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.08]"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(ambulance.id)
                            }
                            disabled={
                              deletingId === ambulance.id
                            }
                            className="rounded-xl border border-rose-400/15 bg-rose-400/[0.04] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-400/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === ambulance.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-20 text-center"
                    >

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] text-2xl">
                        🚑
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-slate-400">
                        No Ambulances Found
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-700">
                        {search
                          ? "No ambulance matches your current search."
                          : "No ambulances have been registered in the fleet yet."}
                      </p>

                      {search ? (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          Clear Search
                        </button>
                      ) : (
                        <Link
                          href="/admin/ambulances/add"
                          className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white"
                        >
                          + Add First Ambulance
                        </Link>
                      )}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="flex flex-col justify-between gap-2 border-t border-white/[0.06] px-5 py-4 text-[9px] uppercase tracking-[0.12em] text-slate-700 sm:flex-row">

            <span>
              Ambulance AI • Fleet Operations Center
            </span>

            <span>
              {availableCount} Available • {busyCount} On Duty •{" "}
              {emergencyCount} Emergency
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";


// interface Ambulance {
//     id: string;
//     vehicleNo: string;
//     driverName: string;
//     driverMobile: string;
//     type: string;
//     status: string;
// }

// export default function ManageAmbulances() {
//     const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const getAmbulances = async () => {
//             try {
//                 const res = await fetch("/api/admin/ambulances");
//                 const data = await res.json();

//                 if (data.success) {
//                     setAmbulances(data.ambulances);
//                 }
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getAmbulances();
//     }, []);

//     const handleDelete = async (id: string) => {
//         const confirmDelete = confirm("Are you sure you want to delete this ambulance?");

//         if (!confirmDelete) return;

//         try {
//             const res = await fetch(`/api/admin/ambulances/${id}`, {
//                 method: "DELETE",
//             });

//             const data = await res.json();

//             if (data.success) {
//                 alert("Ambulance Deleted Successfully");

//                 setAmbulances((prev) =>
//                     prev.filter((ambulance) => ambulance.id !== id)
//                 );
//             } else {
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             alert("Something went wrong");
//         }
//     };



//     if (loading) {
//         return (
//             <h1 className="text-center mt-10 text-2xl">
//                 Loading Ambulances...
//             </h1>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">

//             <div className="flex justify-between items-center mb-6">

//                 <h1 className="text-3xl font-bold">
//                     🚑 Manage Ambulances
//                 </h1>

//                 <Link
//                     href="/admin/ambulances/add"
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                 >
//                     + Add Ambulance
//                 </Link>

//             </div>

//             <div className="bg-white rounded-lg shadow overflow-x-auto">

//                 <table className="w-full border-collapse">

//                     <thead className="bg-red-600 text-white">

//                         <tr>
//                             <th className="p-3">Vehicle No</th>
//                             <th className="p-3">Driver</th>
//                             <th className="p-3">Mobile</th>
//                             <th className="p-3">Type</th>
//                             <th className="p-3">Status</th>
//                             <th className="p-3">Actions</th>
//                         </tr>

//                     </thead>

//                     <tbody>

//                         {ambulances.map((ambulance) => (

//                             <tr
//                                 key={ambulance.id}
//                                 className="border-b hover:bg-gray-100"
//                             >
//                                 <td className="p-3">{ambulance.vehicleNo}</td>
//                                 <td className="p-3">{ambulance.driverName}</td>
//                                 <td className="p-3">{ambulance.driverMobile}</td>
//                                 <td className="p-3">{ambulance.type}</td>

//                                 <td className="p-3">
//                                     <span
//                                         className={`px-3 py-1 rounded-full text-white ${ambulance.status === "Available"
//                                             ? "bg-green-500"
//                                             : ambulance.status === "Busy"
//                                                 ? "bg-yellow-500"
//                                                 : "bg-red-500"
//                                             }`}
//                                     >
//                                         {ambulance.status}
//                                     </span>
//                                 </td>


//                                 <td className="p-3 flex gap-2">

//                                     <Link
//                                         href={`/admin/ambulances/${ambulance.id}/edit`}
//                                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                                     >
//                                         Edit
//                                     </Link>

//                                     <button
//                                         onClick={() => handleDelete(ambulance.id)}
//                                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                                     >
//                                         Delete
//                                     </button>

//                                 </td>

//                             </tr>

//                         ))}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// }
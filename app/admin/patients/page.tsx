// "use client";

// import { useEffect, useMemo, useState } from "react";

// interface Patient {
//   id: string;
//   name: string;
//   email: string;
//   mobile: string;
//   age: number;
//   gender: string;
//   bloodGroup: string;
// }

// export default function ManagePatients() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const deletePatient = async (id: string) => {
//     const confirmDelete = confirm(
//       "Are you sure you want to delete this patient?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`/api/admin/patients/${id}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Patient Deleted Successfully ✅");

//         setPatients((prev) =>
//           prev.filter((patient) => patient.id !== id)
//         );
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Something went wrong");
//     }
//   };


//   useEffect(() => {
//     const getPatients = async () => {
//       try {
//         const res = await fetch("/api/admin/patients");
//         const data = await res.json();

//         if (data.success) {
//           setPatients(data.patients);
//         }
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getPatients();
//   }, []);

//   const filteredPatients = useMemo(() => {
//     return patients.filter((patient) => {
//       return (
//         patient.name.toLowerCase().includes(search.toLowerCase()) ||
//         patient.email.toLowerCase().includes(search.toLowerCase())
//       );
//     });
//   }, [patients, search]);

//   if (loading) {
//     return (
//       <h1 className="text-center mt-10 text-2xl font-bold">
//         Loading Patients...
//       </h1>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">
//           👨‍⚕️ Manage Patients
//         </h1>

//         <div className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold">
//           Total Patients : {patients.length}
//         </div>
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search by Name or Email..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-x-auto">

//         <table className="w-full">

//           <thead className="bg-red-600 text-white">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Mobile</th>
//               <th className="p-3 text-left">Age</th>
//               <th className="p-3 text-left">Gender</th>
//               <th className="p-3 text-left">Blood Group</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody>

//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((patient) => (
//                 <tr
//                   key={patient.id}
//                   className="border-b hover:bg-gray-100"
//                 >
//                   <td className="p-3">{patient.name}</td>
//                   <td className="p-3">{patient.email}</td>
//                   <td className="p-3">{patient.mobile}</td>
//                   <td className="p-3">{patient.age}</td>
//                   <td className="p-3">{patient.gender}</td>
//                   <td className="p-3">{patient.bloodGroup}</td>

//                   <td className="p-3">
//                     <a
//                       href={`/admin/patients/${patient.id}`}
//                       className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
//                     >
//                       👁 View
//                     </a>
//                   </td>

//                   <td className="p-3 flex gap-2">
//                     <a
//                       href={`/admin/patients/edit/${patient.id}`}
//                       className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
//                     >
//                       ✏ Edit
//                     </a>



//                     <button
//                       onClick={() => deletePatient(patient.id)}
//                       className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
//                     >
//                       🗑 Delete
//                     </button>


//                   </td>

//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="text-center p-6 text-gray-500"
//                 >
//                   No Patients Found
//                 </td>
//               </tr>
//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";

interface Patient {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export default function ManagePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================================================
  // DELETE PATIENT
  // =========================================================

  const deletePatient = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/admin/patients/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Patient Deleted Successfully ✅");

        setPatients((prev) =>
          prev.filter((patient) => patient.id !== id)
        );
      } else {
        alert(data.message || "Unable to delete patient");
      }
    } catch (error) {
      console.error("DELETE PATIENT ERROR:", error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // FETCH PATIENTS
  // =========================================================

  useEffect(() => {
    const getPatients = async () => {
      try {
        const res = await fetch("/api/admin/patients");

        if (!res.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await res.json();

        if (data.success) {
          setPatients(data.patients || []);
        }
      } catch (error) {
        console.error("PATIENT FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    getPatients();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPatients = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return patients;

    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(value) ||
        patient.email.toLowerCase().includes(value) ||
        patient.mobile.toLowerCase().includes(value) ||
        patient.bloodGroup.toLowerCase().includes(value)
      );
    });
  }, [patients, search]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A12]">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Loading patient records...
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-700">
            Secure Medical Database
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200">

      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-10">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2">

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              ADMIN / PATIENT MANAGEMENT
            </span>

            <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
              Secure
            </span>

          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Patient

                <span className="ml-2 bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                  Management
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage registered patients, review medical information
                and maintain emergency response records.
              </p>

            </div>

            {/* Total Patients */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-violet-400/15 bg-violet-400/[0.04] px-5 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-lg text-violet-300">
                👥
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Total Patients
                </p>

                <p className="mt-0.5 text-xl font-bold text-white">
                  {patients.length}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH + FILTER BAR
        ==================================================== */}

        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0C111B] p-4">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Search */}

            <div className="relative w-full md:max-w-xl">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search patient by name, email, mobile or blood group..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-[#0A0F18] focus:ring-1 focus:ring-cyan-400/10"
              />

            </div>

            {/* Result count */}

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">

                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-700">
                  Showing
                </p>

                <p className="mt-0.5 text-sm font-semibold text-cyan-300">
                  {filteredPatients.length} / {patients.length}
                </p>

              </div>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-white/[0.06] px-4 py-3 text-xs font-medium text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B]">

          {/* Table Header */}

          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="font-semibold text-white">
                  Patient Records
                </h2>

                <span className="rounded-full border border-lime-400/10 bg-lime-400/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-lime-300">
                  Live Database
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-600">
                Registered patient information and actions
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-lime-300">
                Database Connected
              </span>

            </div>

          </div>

          {/* Responsive Table */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              {/* =================================================
                  TABLE HEAD
              ================================================== */}

              <thead>

                <tr className="border-b border-white/[0.06] bg-[#090D15]">

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Age
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Gender
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Blood Group
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* =================================================
                  TABLE BODY
              ================================================== */}

              <tbody>

                {filteredPatients.length > 0 ? (

                  filteredPatients.map((patient) => (

                    <tr
                      key={patient.id}
                      className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >

                      {/* =========================================
                          PATIENT
                      ========================================== */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/5 text-sm font-bold text-violet-300">

                            {patient.name
                              .charAt(0)
                              .toUpperCase()}

                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0C111B] bg-lime-300" />

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-200">
                              {patient.name}
                            </p>

                            <p className="mt-0.5 text-[9px] text-slate-700">
                              ID: {patient.id.slice(-8)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =========================================
                          CONTACT
                      ========================================== */}

                      <td className="px-5 py-4">

                        <div>

                          <p className="text-xs text-slate-400">
                            {patient.email}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-700">
                            {patient.mobile}
                          </p>

                        </div>

                      </td>

                      {/* =========================================
                          AGE
                      ========================================== */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-400">
                          {patient.age} yrs
                        </span>

                      </td>

                      {/* =========================================
                          GENDER
                      ========================================== */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-1.5 text-[10px] font-semibold text-cyan-300">
                          {patient.gender}
                        </span>

                      </td>

                      {/* =========================================
                          BLOOD GROUP
                      ========================================== */}

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/15 bg-rose-400/[0.04] px-3 py-1.5 text-[10px] font-bold text-rose-300">

                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-400/10 text-[8px]">
                            +
                          </span>

                          {patient.bloodGroup}

                        </span>

                      </td>

                      {/* =========================================
                          ACTIONS
                      ========================================== */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          {/* VIEW */}

                          <a
                            href={`/admin/patients/${patient.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-2 text-[10px] font-semibold text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                          >
                            <span>◉</span>
                            View
                          </a>

                          {/* EDIT */}

                          <a
                            href={`/admin/patients/edit/${patient.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/15 bg-violet-400/[0.04] px-3 py-2 text-[10px] font-semibold text-violet-300 transition hover:border-violet-400/30 hover:bg-violet-400/10"
                          >
                            <span>✎</span>
                            Edit
                          </a>

                          {/* DELETE */}

                          <button
                            onClick={() => deletePatient(patient.id)}
                            disabled={deletingId === patient.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/15 bg-rose-400/[0.04] px-3 py-2 text-[10px] font-semibold text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >

                            <span>
                              {deletingId === patient.id
                                ? "..."
                                : "×"}
                            </span>

                            {deletingId === patient.id
                              ? "Deleting"
                              : "Delete"}

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  /* =============================================
                     EMPTY STATE
                  ============================================== */

                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-20 text-center"
                    >

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] text-2xl">
                        👥
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-slate-400">
                        No Patients Found
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-700">
                        {search
                          ? "No patient records match your current search."
                          : "There are currently no registered patients in the system."}
                      </p>

                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          Clear Search
                        </button>
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
              Patient Management System
            </span>

            <span>
              Secure • Encrypted • Emergency Operations
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
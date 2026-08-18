"use client";

import { FormEvent, useEffect, useState } from "react";

interface Ambulance {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  type: string;
  status: string;
}

export default function AdminDriversPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [ambulanceId, setAmbulanceId] = useState("");

  useEffect(() => {
    const getAmbulances = async () => {
      try {
        const res = await fetch("/api/admin/ambulances");
        const data = await res.json();

        if (data.success) {
          setAmbulances(data.ambulances);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log("GET AMBULANCES ERROR:", error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getAmbulances();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          ambulanceId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Driver created successfully");

        setName("");
        setEmail("");
        setMobile("");
        setPassword("");
        setAmbulanceId("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("CREATE DRIVER ERROR:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const availableAmbulances = ambulances.filter(
    (ambulance) => ambulance.status === "Available"
  );

  return (
    <main className="min-h-screen bg-[#07111F] text-white">

      {/* Top Header */}
      <header className="border-b border-[#1B2B42] bg-[#091827]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22D3EE]" />

                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
                  Emergency Operations
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Driver Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Create a driver profile and connect the driver with an
                available ambulance unit.
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 rounded-xl border border-[#1B3348] bg-[#0C1B2B] px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-xl">
                🚑
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Fleet Status
                </p>

                <p className="font-semibold text-cyan-300">
                  {availableAmbulances.length} Available
                </p>
              </div>

            </div>

          </div>

        </div>
      </header>


      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        <div className="grid gap-7 lg:grid-cols-[1fr_330px]">

          {/* FORM CARD */}
          <div className="overflow-hidden rounded-2xl border border-[#1B2B42] bg-[#0B1726] shadow-2xl">

            {/* Card Header */}
            <div className="border-b border-[#1B2B42] bg-[#0E1C2D] px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl ring-1 ring-cyan-400/20">
                  👨‍✈️
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Register New Driver
                  </h2>

                  <p className="text-sm text-slate-400">
                    Driver credentials & ambulance assignment
                  </p>
                </div>

              </div>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 lg:p-8"
            >

              {/* Driver Information */}
              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="h-px flex-1 bg-[#1B2B42]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Driver Information
                  </span>

                  <div className="h-px flex-1 bg-[#1B2B42]" />

                </div>


                <div className="grid gap-5 md:grid-cols-2">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Driver Name
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        👤
                      </span>

                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-[#24364C] bg-[#081522] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      />

                    </div>
                  </div>


                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email Address
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        ✉
                      </span>

                      <input
                        type="email"
                        placeholder="driver@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#24364C] bg-[#081522] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      />

                    </div>
                  </div>


                  {/* Mobile */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Mobile Number
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        ☎
                      </span>

                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full rounded-xl border border-[#24364C] bg-[#081522] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      />

                    </div>
                  </div>


                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Login Password
                    </label>

                    <div className="relative">

                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        🔐
                      </span>

                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        className="w-full rounded-xl border border-[#24364C] bg-[#081522] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      />

                    </div>

                    <p className="mt-2 text-xs text-slate-600">
                      Driver will use this password to access the driver
                      portal.
                    </p>

                  </div>

                </div>

              </div>


              {/* Ambulance Assignment */}
              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="h-px flex-1 bg-[#1B2B42]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Fleet Assignment
                  </span>

                  <div className="h-px flex-1 bg-[#1B2B42]" />

                </div>


                <div className="rounded-xl border border-[#24364C] bg-[#081522] p-5">

                  <div className="mb-4 flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-xl">
                      🚑
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Assign Ambulance
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Select an ambulance that is currently available.
                      </p>
                    </div>

                  </div>


                  {loading ? (

                    <div className="flex items-center gap-3 rounded-lg border border-[#24364C] bg-[#0B1726] px-4 py-4">

                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />

                      <span className="text-sm text-slate-400">
                        Loading available ambulances...
                      </span>

                    </div>

                  ) : availableAmbulances.length === 0 ? (

                    <div className="rounded-lg border border-amber-500/20 bg-amber-400/5 p-4">

                      <div className="flex gap-3">

                        <span className="text-lg">⚠️</span>

                        <div>
                          <p className="text-sm font-semibold text-amber-300">
                            No ambulance available
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Add an ambulance or change an existing unit's
                            status to Available.
                          </p>
                        </div>

                      </div>

                    </div>

                  ) : (

                    <div>

                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                        Available Units
                      </label>

                      <select
                        value={ambulanceId}
                        onChange={(e) =>
                          setAmbulanceId(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#294057] bg-[#0B1726] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      >

                        <option value="">
                          Select ambulance unit
                        </option>

                        {availableAmbulances.map((ambulance) => (

                          <option
                            key={ambulance.id}
                            value={ambulance.id}
                          >
                            {ambulance.vehicleNo} — {ambulance.type}
                          </option>

                        ))}

                      </select>

                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        {availableAmbulances.length} ambulance unit
                        {availableAmbulances.length !== 1 ? "s" : ""} ready
                        for assignment
                      </div>

                    </div>

                  )}

                </div>

              </div>


              {/* Submit */}
              <div className="border-t border-[#1B2B42] pt-6">

                <button
                  type="submit"
                  disabled={
                    saving ||
                    loading ||
                    availableAmbulances.length === 0
                  }
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-[#06111D] shadow-[0_8px_30px_rgba(34,211,238,0.12)] transition hover:bg-cyan-300 hover:shadow-[0_8px_35px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
                >

                  {saving ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#06111D]/30 border-t-[#06111D]" />
                      Creating Driver...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">+</span>
                      Create Driver & Assign Ambulance
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>


          {/* RIGHT INFORMATION PANEL */}
          <aside className="space-y-5">

            {/* System Card */}
            <div className="rounded-2xl border border-[#1B2B42] bg-[#0B1726] p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10">
                  🤖
                </div>

                <div>
                  <h3 className="font-semibold">
                    Fleet Control
                  </h3>

                  <p className="text-xs text-slate-500">
                    Real-time system status
                  </p>
                </div>

              </div>


              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-lg bg-[#081522] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Total Units
                  </span>

                  <span className="font-semibold">
                    {ambulances.length}
                  </span>
                </div>


                <div className="flex items-center justify-between rounded-lg bg-[#081522] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Available
                  </span>

                  <span className="font-semibold text-emerald-400">
                    {availableAmbulances.length}
                  </span>
                </div>


                <div className="flex items-center justify-between rounded-lg bg-[#081522] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Busy
                  </span>

                  <span className="font-semibold text-amber-400">
                    {
                      ambulances.filter(
                        (a) => a.status === "Busy"
                      ).length
                    }
                  </span>
                </div>

              </div>

            </div>


            {/* Workflow */}
            <div className="rounded-2xl border border-[#1B2B42] bg-[#0B1726] p-6">

              <h3 className="mb-5 font-semibold">
                Driver Onboarding
              </h3>


              <div className="space-y-5">

                <div className="flex gap-3">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-[#06111D]">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Create account
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Add driver's basic credentials.
                    </p>
                  </div>

                </div>


                <div className="flex gap-3">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400 text-xs font-bold text-[#06111D]">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Assign unit
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Connect driver with an available ambulance.
                    </p>
                  </div>

                </div>


                <div className="flex gap-3">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-[#06111D]">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Ready for dispatch
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Driver can start receiving emergency trips.
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Security */}
            <div className="rounded-2xl border border-[#1B2B42] bg-[#0B1726] p-5">

              <div className="flex gap-3">

                <span className="text-lg">🔐</span>

                <div>

                  <p className="text-sm font-semibold text-slate-300">
                    Secure Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Driver credentials are used only for authorized
                    emergency operations.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}



// "use client";

// import { FormEvent, useEffect, useState } from "react";

// interface Ambulance {
//   id: string;
//   vehicleNo: string;
//   driverName: string;
//   driverMobile: string;
//   type: string;
//   status: string;
// }

// export default function AdminDriversPage() {
//   const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [ambulanceId, setAmbulanceId] = useState("");

//   useEffect(() => {
//     const getAmbulances = async () => {
//       try {
//         const res = await fetch("/api/admin/ambulances");
//         const data = await res.json();

//         if (data.success) {
//           setAmbulances(data.ambulances);
//         } else {
//           alert(data.message);
//         }
//       } catch (error) {
//         console.log("GET AMBULANCES ERROR:", error);
//         alert("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getAmbulances();
//   }, []);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setSaving(true);

//     try {
//       const res = await fetch("/api/admin/drivers", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           mobile,
//           password,
//           ambulanceId,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Driver created successfully");

//         setName("");
//         setEmail("");
//         setMobile("");
//         setPassword("");
//         setAmbulanceId("");
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log("CREATE DRIVER ERROR:", error);
//       alert("Something went wrong");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const availableAmbulances = ambulances.filter(
//     (ambulance) => ambulance.status === "Available"
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <h1 className="text-3xl font-bold mb-8">
//         👨‍✈️ Add Driver
//       </h1>

//       <div className="bg-white max-w-2xl rounded-xl shadow p-8">

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="block font-semibold mb-2">
//               Driver Name
//             </label>

//             <input
//               type="text"
//               placeholder="Enter driver name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border p-3 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">
//               Email
//             </label>

//             <input
//               type="email"
//               placeholder="Enter driver email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border p-3 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">
//               Mobile
//             </label>

//             <input
//               type="tel"
//               placeholder="Enter mobile number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               className="w-full border p-3 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="Create driver password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border p-3 rounded-lg"
//               required
//               minLength={6}
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">
//               Assign Ambulance
//             </label>

//             {loading ? (
//               <p className="text-gray-500">
//                 Loading ambulances...
//               </p>
//             ) : availableAmbulances.length === 0 ? (
//               <p className="text-red-600">
//                 No available ambulance found.
//               </p>
//             ) : (
//               <select
//                 value={ambulanceId}
//                 onChange={(e) => setAmbulanceId(e.target.value)}
//                 className="w-full border p-3 rounded-lg"
//                 required
//               >
//                 <option value="">
//                   Select Ambulance
//                 </option>

//                 {availableAmbulances.map((ambulance) => (
//                   <option
//                     key={ambulance.id}
//                     value={ambulance.id}
//                   >
//                     {ambulance.vehicleNo} - {ambulance.type}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={saving || loading || availableAmbulances.length === 0}
//             className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
//           >
//             {saving ? "Creating Driver..." : "Create Driver"}
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAmbulance() {
  const router = useRouter();

  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [type, setType] = useState("Basic");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleNo || !driverName || !driverMobile || !type) {
      alert("Please fill all fields.");
      return;
    }

    if (!/^\d{10}$/.test(driverMobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/ambulances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleNo,
          driverName,
          driverMobile,
          type,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Ambulance Added Successfully 🚑");
        router.push("/admin/ambulances");
      } else {
        alert(data.message || "Unable to add ambulance.");
      }
    } catch (error) {
      console.log("ADD AMBULANCE ERROR:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200">

      {/* TOP ACCENT */}
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-7 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          {/* BACK BUTTON */}

          <button
            onClick={() => router.push("/admin/ambulances")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0C111B] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
          >
            <span className="text-base">←</span>
            Back to Ambulances
          </button>

          {/* TITLE AREA */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                  ADMIN / FLEET MANAGEMENT
                </span>

                <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />

                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
                  Add Vehicle
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Add Ambulance

                <span className="ml-2 bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                  Fleet
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Register a new emergency vehicle and assign its driver
                to the ambulance fleet.
              </p>

            </div>

            {/* STATUS */}

            <div className="flex items-center gap-2 rounded-xl border border-lime-400/10 bg-lime-400/[0.03] px-4 py-3">

              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-lime-300">
                Fleet Operational
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            FORM CONTAINER
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B] shadow-2xl">

          {/* CARD HEADER */}

          <div className="border-b border-white/[0.06] bg-[#090D15] px-6 py-6 sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] text-xl">
                🚑
              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-lg font-semibold text-white">
                    Ambulance Information
                  </h2>

                  <span className="rounded-full border border-violet-400/10 bg-violet-400/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-violet-300">
                    Fleet Control
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Enter vehicle and driver details below.
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              FORM
          ====================================================== */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* =================================================
                  VEHICLE NUMBER
              ================================================== */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Vehicle Number
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    🚑
                  </span>

                  <input
                    type="text"
                    placeholder="e.g. HR12AB1234"
                    value={vehicleNo}
                    onChange={(e) =>
                      setVehicleNo(
                        e.target.value.toUpperCase()
                      )
                    }
                    className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm font-medium tracking-wide text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                    required
                  />

                </div>

                <p className="mt-2 text-[10px] text-slate-700">
                  Enter the official registration number of the ambulance.
                </p>

              </div>

              {/* =================================================
                  DRIVER NAME
              ================================================== */}

              <div>

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Driver Name
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    👨‍✈️
                  </span>

                  <input
                    type="text"
                    placeholder="Enter driver name"
                    value={driverName}
                    onChange={(e) =>
                      setDriverName(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  DRIVER MOBILE
              ================================================== */}

              <div>

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Driver Mobile
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    📱
                  </span>

                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={driverMobile}
                    maxLength={10}
                    onChange={(e) =>
                      setDriverMobile(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  AMBULANCE TYPE
              ================================================== */}

              <div className="md:col-span-2">

                <div className="mb-3 flex items-center justify-between">

                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Ambulance Type
                  </label>

                  <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                    Select configuration
                  </span>

                </div>

                <div className="grid gap-3 sm:grid-cols-3">

                  {/* BASIC */}

                  <label
                    className={`group cursor-pointer rounded-xl border p-5 transition ${
                      type === "Basic"
                        ? "border-lime-400/30 bg-lime-400/[0.05] shadow-[0_0_25px_rgba(163,230,53,0.04)]"
                        : "border-white/[0.07] bg-[#080C14] hover:border-lime-400/20 hover:bg-white/[0.02]"
                    }`}
                  >

                    <input
                      type="radio"
                      name="ambulanceType"
                      value="Basic"
                      checked={type === "Basic"}
                      onChange={(e) =>
                        setType(e.target.value)
                      }
                      className="hidden"
                    />

                    <div className="flex items-start justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/15 bg-lime-400/[0.05] text-lg">
                        🚑
                      </div>

                      {type === "Basic" && (
                        <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />
                      )}

                    </div>

                    <p className="mt-4 text-sm font-bold text-white">
                      Basic
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      General emergency transport
                    </p>

                  </label>

                  {/* ICU */}

                  <label
                    className={`group cursor-pointer rounded-xl border p-5 transition ${
                      type === "ICU"
                        ? "border-cyan-400/30 bg-cyan-400/[0.05] shadow-[0_0_25px_rgba(34,211,238,0.04)]"
                        : "border-white/[0.07] bg-[#080C14] hover:border-cyan-400/20 hover:bg-white/[0.02]"
                    }`}
                  >

                    <input
                      type="radio"
                      name="ambulanceType"
                      value="ICU"
                      checked={type === "ICU"}
                      onChange={(e) =>
                        setType(e.target.value)
                      }
                      className="hidden"
                    />

                    <div className="flex items-start justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] text-lg">
                        🏥
                      </div>

                      {type === "ICU" && (
                        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22D3EE]" />
                      )}

                    </div>

                    <p className="mt-4 text-sm font-bold text-white">
                      ICU
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Intensive care support
                    </p>

                  </label>

                  {/* ADVANCED */}

                  <label
                    className={`group cursor-pointer rounded-xl border p-5 transition ${
                      type === "Advanced"
                        ? "border-violet-400/30 bg-violet-400/[0.05] shadow-[0_0_25px_rgba(139,92,246,0.04)]"
                        : "border-white/[0.07] bg-[#080C14] hover:border-violet-400/20 hover:bg-white/[0.02]"
                    }`}
                  >

                    <input
                      type="radio"
                      name="ambulanceType"
                      value="Advanced"
                      checked={type === "Advanced"}
                      onChange={(e) =>
                        setType(e.target.value)
                      }
                      className="hidden"
                    />

                    <div className="flex items-start justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.05] text-lg">
                        ❤️‍🩹
                      </div>

                      {type === "Advanced" && (
                        <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_8px_#A78BFA]" />
                      )}

                    </div>

                    <p className="mt-4 text-sm font-bold text-white">
                      Advanced
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Advanced emergency equipment
                    </p>

                  </label>

                </div>

              </div>

            </div>

            {/* =====================================================
                INFO BOX
            ====================================================== */}

            <div className="mt-7 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
                  ℹ️
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">
                    Default Fleet Status
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    New ambulances will be registered as{" "}
                    <span className="font-bold text-lime-300">
                      Available
                    </span>{" "}
                    by default and can be assigned to an approved booking.
                  </p>

                </div>

              </div>

            </div>

            {/* =====================================================
                BUTTONS
            ====================================================== */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/ambulances")
                }
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Cancel
              </button>

              {/* ADD */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-cyan-500/10 transition hover:scale-[1.01] hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">

                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Adding Ambulance...

                  </span>
                ) : (
                  "🚑 Add Ambulance"
                )}

              </button>

            </div>

          </form>

          {/* =====================================================
              CARD FOOTER
          ====================================================== */}

          <div className="border-t border-white/[0.06] bg-[#090D15] px-6 py-4 sm:px-8">

            <div className="flex flex-col justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-slate-700 sm:flex-row">

              <span>
                Ambulance AI • Fleet Operations Center
              </span>

              <span>
                New Vehicle Registration
              </span>

            </div>

          </div>

        </div>

        {/* FOOTER NOTE */}

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.12em] text-slate-700">
          🚨 Verify vehicle and driver information before registration.
        </p>

      </div>

    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AddAmbulance() {
//   const router = useRouter();

//   const [vehicleNo, setVehicleNo] = useState("");
//   const [driverName, setDriverName] = useState("");
//   const [driverMobile, setDriverMobile] = useState("");
//   const [type, setType] = useState("Basic");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/api/admin/ambulances", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         vehicleNo,
//         driverName,
//         driverMobile,
//         type,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Ambulance Added Successfully");
//       router.push("/admin/ambulances");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center">

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//       >

//         <h1 className="text-3xl font-bold mb-6 text-center">
//           Add Ambulance
//         </h1>

//         <input
//           type="text"
//           placeholder="Vehicle Number"
//           className="w-full border p-3 rounded mb-4"
//           value={vehicleNo}
//           onChange={(e) => setVehicleNo(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="Driver Name"
//           className="w-full border p-3 rounded mb-4"
//           value={driverName}
//           onChange={(e) => setDriverName(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="Driver Mobile"
//           className="w-full border p-3 rounded mb-4"
//           value={driverMobile}
//           onChange={(e) => setDriverMobile(e.target.value)}
//         />

//         <select
//           className="w-full border p-3 rounded mb-6"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="Basic">Basic</option>
//           <option value="ICU">ICU</option>
//           <option value="Advanced">Advanced</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
//         >
//           Add Ambulance
//         </button>

//       </form>

//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAmbulance() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleNo: "",
    driverName: "",
    driverMobile: "",
    type: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // GET AMBULANCE
  // =========================================================

  useEffect(() => {
    const getAmbulance = async () => {
      try {
        const res = await fetch(`/api/admin/ambulances/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setForm({
            vehicleNo: data.ambulance.vehicleNo || "",
            driverName: data.ambulance.driverName || "",
            driverMobile: data.ambulance.driverMobile || "",
            type: data.ambulance.type || "Basic",
            status: data.ambulance.status || "Available",
          });
        } else {
          alert(data.message || "Ambulance not found");
          router.push("/admin/ambulances");
        }
      } catch (error) {
        console.error("GET AMBULANCE ERROR:", error);
        alert("Failed to load ambulance");
        router.push("/admin/ambulances");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getAmbulance();
    }
  }, [id, router]);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // UPDATE AMBULANCE
  // =========================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.vehicleNo.trim() ||
      !form.driverName.trim() ||
      !form.driverMobile.trim() ||
      !form.type ||
      !form.status
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `/api/admin/ambulances/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Ambulance Updated Successfully 🚑");
        router.push("/admin/ambulances");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("UPDATE AMBULANCE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] text-slate-200">

        <div className="h-0.5 w-full bg-linear-to-r from-violet-500 via-cyan-400 to-lime-300" />

        <div className="flex min-h-[calc(100vh-2px)] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20bg-cyan-400/4">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Loading ambulance...
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-slate-700">
              Fleet Operations Center
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200">

      {/* TOP ACCENT */}

      <div className="h-0.5 w-full bg-linear-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-300 px-5 py-8 sm:px-7 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2">

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              ADMIN / FLEET MANAGEMENT
            </span>

            <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
              Edit Vehicle
            </span>

          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Edit

                <span className="ml-2 bg-linear-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                  Ambulance
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Update ambulance vehicle details, driver information,
                ambulance type and fleet availability.
              </p>

            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/ambulances")}
              className="w-fit rounded-xl borderborder-white/8 bg-white/2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition hover:border-cyan-400/20hover:bg-cyan-400/4 hover:text-cyan-300"
            >
              ← Back to Fleet
            </button>

          </div>

        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ===================================================
              EDIT FORM
          ==================================================== */}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl borderborder-white/6 bg-[#0C111B]"
          >

            {/* FORM HEADER */}

            <div className="border-b border-white/6 px-6 py-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/5 text-xl">
                  🚑
                </div>

                <div>

                  <h2 className="font-semibold text-white">
                    Ambulance Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Modify registered ambulance information
                  </p>

                </div>

              </div>

            </div>

            {/* FORM BODY */}

            <div className="space-y-6 p-6">

              {/* VEHICLE NUMBER */}

              <div>

                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Vehicle Number
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
                    🚑
                  </span>

                  <input
                    type="text"
                    value={form.vehicleNo}
                    onChange={(e) =>
                      handleChange(
                        "vehicleNo",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g. HR26AB1234"
                    className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                  />

                </div>

              </div>

              {/* DRIVER INFORMATION */}

              <div className="grid gap-6 md:grid-cols-2">

                {/* DRIVER NAME */}

                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Driver Name
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-300">
                      👤
                    </span>

                    <input
                      type="text"
                      value={form.driverName}
                      onChange={(e) =>
                        handleChange(
                          "driverName",
                          e.target.value
                        )
                      }
                      placeholder="Driver name"
                      className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:ring-1 focus:ring-violet-400/10"
                    />

                  </div>

                </div>

                {/* DRIVER MOBILE */}

                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Driver Mobile
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
                      ☎
                    </span>

                    <input
                      type="tel"
                      value={form.driverMobile}
                      onChange={(e) =>
                        handleChange(
                          "driverMobile",
                          e.target.value
                        )
                      }
                      placeholder="Driver mobile number"
                      className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                    />

                  </div>

                </div>

              </div>

              {/* TYPE + STATUS */}

              <div className="grid gap-6 md:grid-cols-2">

                {/* TYPE */}

                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Ambulance Type
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-violet-300">
                      ✚
                    </span>

                    <select
                      value={form.type}
                      onChange={(e) =>
                        handleChange(
                          "type",
                          e.target.value
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-10 text-sm text-slate-200 outline-none transition focus:border-violet-400/30 focus:ring-1 focus:ring-violet-400/10"
                    >

                      <option
                        value="Basic"
                        className="bg-[#0C111B]"
                      >
                        Basic
                      </option>

                      <option
                        value="ICU"
                        className="bg-[#0C111B]"
                      >
                        ICU
                      </option>

                      <option
                        value="Advanced"
                        className="bg-[#0C111B]"
                      >
                        Advanced
                      </option>

                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                      ▼
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Fleet Status
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10">

                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${
                          form.status === "Available"
                            ? "bg-lime-300 shadow-[0_0_8px_#A3E635]"
                            : form.status === "Busy"
                            ? "bg-amber-300 shadow-[0_0_8px_#FCD34D]"
                            : form.status === "Emergency"
                            ? "bg-rose-300 shadow-[0_0_8px_#FB7185]"
                            : "bg-slate-400"
                        }`}
                      />

                    </span>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        handleChange(
                          "status",
                          e.target.value
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-white/[0.07] bg-[#080C14] py-3.5 pl-12 pr-10 text-sm text-slate-200 outline-none transition focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                    >

                      <option
                        value="Available"
                        className="bg-[#0C111B]"
                      >
                        Available
                      </option>

                      <option
                        value="Busy"
                        className="bg-[#0C111B]"
                      >
                        Busy
                      </option>

                      <option
                        value="Emergency"
                        className="bg-[#0C111B]"
                      >
                        Emergency
                      </option>

                      <option
                        value="Maintenance"
                        className="bg-[#0C111B]"
                      >
                        Maintenance
                      </option>

                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                      ▼
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* FORM FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-[#090D15] px-6 py-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/ambulances")
                }
                className="rounded-xl border border-white/[0.08] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 transition hover:border-white/[0.15] hover:text-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-cyan-500/10 transition hover:scale-[1.01] hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Updating..."
                  : "✓ Update Ambulance"}
              </button>

            </div>

          </form>

          {/* ===================================================
              PREVIEW / INFORMATION
          ==================================================== */}

          <div className="space-y-6">

            {/* VEHICLE PREVIEW */}

            <div className="rounded-2xl border border-white/[0.06] bg-[#0C111B] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Vehicle Preview
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Fleet Unit
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] text-xl">
                  🚑
                </div>

              </div>

              {/* VEHICLE */}

              <div className="rounded-xl border border-white/[0.06] bg-[#080C14] p-4">

                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-700">
                  Vehicle Number
                </p>

                <p className="mt-2 text-xl font-bold tracking-wide text-white">
                  {form.vehicleNo || "NOT SET"}
                </p>

              </div>

              {/* DRIVER */}

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#080C14] p-4">

                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-700">
                  Assigned Driver
                </p>

                <div className="mt-2 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/15 bg-violet-400/[0.05] text-xs font-bold text-violet-300">
                    {form.driverName
                      ? form.driverName
                          .charAt(0)
                          .toUpperCase()
                      : "?"}
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    {form.driverName || "Not assigned"}
                  </p>

                </div>

              </div>

              {/* TYPE */}

              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#080C14] p-4">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.15em] text-slate-700">
                    Ambulance Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    {form.type || "Not selected"}
                  </p>

                </div>

                <span className="rounded-xl border border-violet-400/10 bg-violet-400/[0.04] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-300">
                  {form.type || "TYPE"}
                </span>

              </div>

              {/* STATUS */}

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#080C14] p-4">

                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-700">
                  Current Status
                </p>

                <div className="mt-3">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      form.status === "Available"
                        ? "border-lime-400/20 bg-lime-400/[0.06] text-lime-300"
                        : form.status === "Busy"
                        ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-300"
                        : form.status === "Emergency"
                        ? "border-rose-400/20 bg-rose-400/[0.06] text-rose-300"
                        : "border-slate-400/10 bg-slate-400/[0.04] text-slate-400"
                    }`}
                  >

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        form.status === "Available"
                          ? "bg-lime-300 shadow-[0_0_7px_#A3E635]"
                          : form.status === "Busy"
                          ? "bg-amber-300 shadow-[0_0_7px_#FCD34D]"
                          : form.status === "Emergency"
                          ? "animate-pulse bg-rose-300 shadow-[0_0_7px_#FB7185]"
                          : "bg-slate-400"
                      }`}
                    />

                    {form.status || "Not set"}

                  </span>

                </div>

              </div>

            </div>

            {/* SYSTEM INFO */}

            <div className="rounded-2xl border border-cyan-400/10 bg-[#0C111B] p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
                  ℹ️
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-white">
                    Fleet Control
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Update ambulance details carefully. Ambulance
                    availability is used during booking and assignment.
                  </p>

                </div>

              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-4">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-lime-300">
                    Fleet System Operational
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-[0.12em] text-slate-700 sm:flex-row">

          <span>
            Ambulance AI • Fleet Operations Center
          </span>

          <span>
            Vehicle Control • Edit Mode
          </span>

        </div>

      </div>

    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// export default function EditAmbulance() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     vehicleNo: "",
//     driverName: "",
//     driverMobile: "",
//     type: "",
//     status: "",
//   });

//   useEffect(() => {
//     const getAmbulance = async () => {
//       try {
//         const res = await fetch(`/api/admin/ambulances/${id}`);
//         const data = await res.json();

//         if (data.success) {
//           setForm({
//             vehicleNo: data.ambulance.vehicleNo,
//             driverName: data.ambulance.driverName,
//             driverMobile: data.ambulance.driverMobile,
//             type: data.ambulance.type,
//             status: data.ambulance.status,
//           });
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getAmbulance();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch(`/api/admin/ambulances/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Ambulance Updated Successfully");
//       router.push("/admin/ambulances");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center">

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
//       >

//         <h1 className="text-3xl font-bold text-center mb-6">
//           Edit Ambulance
//         </h1>

//         <input
//           type="text"
//           className="w-full border p-3 rounded mb-4"
//           value={form.vehicleNo}
//           onChange={(e) =>
//             setForm({ ...form, vehicleNo: e.target.value })
//           }
//           placeholder="Vehicle Number"
//         />

//         <input
//           type="text"
//           className="w-full border p-3 rounded mb-4"
//           value={form.driverName}
//           onChange={(e) =>
//             setForm({ ...form, driverName: e.target.value })
//           }
//           placeholder="Driver Name"
//         />

//         <input
//           type="text"
//           className="w-full border p-3 rounded mb-4"
//           value={form.driverMobile}
//           onChange={(e) =>
//             setForm({ ...form, driverMobile: e.target.value })
//           }
//           placeholder="Driver Mobile"
//         />

//         <select
//           className="w-full border p-3 rounded mb-4"
//           value={form.type}
//           onChange={(e) =>
//             setForm({ ...form, type: e.target.value })
//           }
//         >
//           <option value="Basic">Basic</option>
//           <option value="ICU">ICU</option>
//           <option value="Advanced">Advanced</option>
//         </select>

//         <select
//           className="w-full border p-3 rounded mb-6"
//           value={form.status}
//           onChange={(e) =>
//             setForm({ ...form, status: e.target.value })
//           }
//         >
//           <option value="Available">Available</option>
//           <option value="Busy">Busy</option>
//           <option value="Maintenance">Maintenance</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
//         >
//           Update Ambulance
//         </button>

//       </form>

//     </div>
//   );
// }
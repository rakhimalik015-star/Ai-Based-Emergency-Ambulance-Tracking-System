"use client";

import { useState } from "react";

export default function BookingPage() {
  const [form, setForm] = useState({
    pickupLocation: "",
    destination: "",
    emergencyType: "",
    ambulanceType: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.pickupLocation ||
      !form.destination ||
      !form.mobile ||
      !form.emergencyType ||
      !form.ambulanceType
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Ambulance Booking Successful 🚑");

        window.location.href = "/my-bookings";
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111F] text-white px-4 py-10 md:px-8">

      <div className="mx-auto max-w-6xl">

        {/* TOP HEADER */}
        <div className="mb-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Emergency Response System
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Request an{" "}
            <span className="text-cyan-400">
              Ambulance
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Enter emergency details and location.
            Our system can use ambulance availability,
            distance, traffic and hospital capacity
            for intelligent emergency response.
          </p>

        </div>


        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">

          {/* FORM CARD */}
          <section className="rounded-2xl border border-slate-800 bg-[#0B1728] shadow-2xl">

            {/* CARD HEADER */}
            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                  🚑
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Emergency Booking
                  </h2>

                  <p className="text-sm text-slate-500">
                    Provide accurate information
                  </p>
                </div>

              </div>

            </div>


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {/* LOCATION */}
              <div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">
                    📍
                  </span>

                  <h3 className="font-semibold">
                    Emergency Location
                  </h3>
                </div>


                <div className="grid gap-4 md:grid-cols-2">

                  {/* PICKUP */}
                  <div>

                    <label className="mb-2 block text-sm text-slate-400">
                      Pickup Location
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                        ●
                      </span>

                      <input
                        name="pickupLocation"
                        placeholder="Enter pickup location"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-[#07111F] py-3.5 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      />

                    </div>

                  </div>


                  {/* DESTINATION */}
                  <div>

                    <label className="mb-2 block text-sm text-slate-400">
                      Destination / Hospital
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                        ●
                      </span>

                      <input
                        name="destination"
                        placeholder="Hospital or destination"
                        value={form.destination}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-[#07111F] py-3.5 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* DIVIDER */}
              <div className="border-t border-slate-800" />


              {/* PATIENT CONTACT */}
              <div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">
                    📱
                  </span>

                  <h3 className="font-semibold">
                    Patient Contact
                  </h3>
                </div>

                <input
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-[#07111F] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />

              </div>


              {/* EMERGENCY */}
              <div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-rose-400">
                    🚨
                  </span>

                  <h3 className="font-semibold">
                    Emergency Priority
                  </h3>
                </div>


                <div className="grid gap-3 sm:grid-cols-3">

                  {[
                    {
                      value: "Accident",
                      icon: "🚨",
                      label: "Accident",
                    },
                    {
                      value: "Critical Patient",
                      icon: "❤️",
                      label: "Critical",
                    },
                    {
                      value: "Normal",
                      icon: "🟢",
                      label: "Normal",
                    },
                  ].map((item) => (

                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        setForm({
                          ...form,
                          emergencyType: item.value,
                        })
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        form.emergencyType === item.value
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-[#07111F] hover:border-slate-500"
                      }`}
                    >

                      <div className="text-xl">
                        {item.icon}
                      </div>

                      <div className="mt-2 text-sm font-semibold">
                        {item.label}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {item.value}
                      </div>

                    </button>

                  ))}

                </div>

              </div>


              {/* AMBULANCE */}
              <div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">
                    🚑
                  </span>

                  <h3 className="font-semibold">
                    Ambulance Requirement
                  </h3>
                </div>


                <div className="grid gap-3 md:grid-cols-3">

                  {[
                    {
                      value: "Basic",
                      icon: "🚑",
                      title: "Basic",
                      description: "Standard emergency care",
                    },
                    {
                      value: "ICU",
                      icon: "🏥",
                      title: "ICU",
                      description: "Critical care support",
                    },
                    {
                      value: "Ventilator",
                      icon: "❤️‍🩹",
                      title: "Ventilator",
                      description: "Advanced life support",
                    },
                  ].map((item) => (

                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        setForm({
                          ...form,
                          ambulanceType: item.value,
                        })
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        form.ambulanceType === item.value
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-[#07111F] hover:border-slate-500"
                      }`}
                    >

                      <div className="text-2xl">
                        {item.icon}
                      </div>

                      <div className="mt-2 font-semibold">
                        {item.title}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </div>

                    </button>

                  ))}

                </div>

              </div>


              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-[#06111D] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#06111D] border-t-transparent" />
                    Processing Emergency Request...
                  </>
                ) : (
                  <>
                    🚑
                    Request Ambulance
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

              <p className="text-center text-xs text-slate-500">
                Your emergency information will be securely
                processed by the ambulance management system.
              </p>

            </form>

          </section>


          {/* RIGHT INFORMATION PANEL */}
          <aside className="space-y-6">

            {/* AI CARD */}
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-[#0B1728] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                  🤖
                </div>

                <div>
                  <h3 className="font-semibold">
                    AI Emergency Intelligence
                  </h3>

                  <p className="text-xs text-cyan-300">
                    Smart response engine
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex gap-3">
                  <span>📍</span>
                  <div>
                    <p className="text-sm font-medium">
                      Location Analysis
                    </p>
                    <p className="text-xs text-slate-500">
                      Pickup and destination analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span>🚦</span>
                  <div>
                    <p className="text-sm font-medium">
                      Traffic Intelligence
                    </p>
                    <p className="text-xs text-slate-500">
                      Route and traffic consideration
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span>🏥</span>
                  <div>
                    <p className="text-sm font-medium">
                      Hospital Capacity
                    </p>
                    <p className="text-xs text-slate-500">
                      Beds and ICU availability
                    </p>
                  </div>
                </div>

              </div>

            </div>


            {/* EMERGENCY FLOW */}
            <div className="rounded-2xl border border-slate-800 bg-[#0B1728] p-6">

              <h3 className="font-semibold">
                Emergency Response
              </h3>

              <div className="mt-5 space-y-4">

                {[
                  ["01", "Request", "Emergency booking"],
                  ["02", "Dispatch", "Ambulance assignment"],
                  ["03", "Tracking", "Live ambulance location"],
                  ["04", "Hospital", "Smart destination"],
                ].map(([number, title, text]) => (

                  <div
                    key={number}
                    className="flex gap-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-cyan-400">
                      {number}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {title}
                      </p>

                      <p className="text-xs text-slate-500">
                        {text}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* SAFETY */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">

              <div className="flex gap-3">

                <span className="text-lg">
                  ⚠️
                </span>

                <div>

                  <p className="text-sm font-semibold text-amber-300">
                    Emergency Notice
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    In a life-threatening emergency,
                    provide accurate location details
                    so the response team can reach you quickly.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}



// "use client";

// import { useState } from "react";


// export default function BookingPage() {

//     const [form, setForm] = useState({
//         pickupLocation: "",
//         destination: "",
//         emergencyType: "",
//         ambulanceType: "",
//         mobile: ""
//     });


//     const handleChange = (e: any) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value
//         });
//     };


//     const handleSubmit = async (e: any) => {

//         e.preventDefault();

//         if (
//             !form.pickupLocation ||
//             !form.destination ||
//             !form.mobile ||
//             !form.emergencyType ||
//             !form.ambulanceType
//         ) {
//             alert("Please fill all fields.");
//             return;
//         }

//         if (form.mobile.length !== 10) {
//             alert("Please enter a valid 10-digit mobile number.");
//             return;
//         }




//         const res = await fetch("/api/bookings", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(form)
//         });


//         const data = await res.json();


//         if (data.success) {
//             alert("Ambulance Booking Successful 🚑");
//             window.location.href = "/my-bookings";

//             setForm({
//                 pickupLocation: "",
//                 destination: "",
//                 emergencyType: "",
//                 ambulanceType: "",
//                 mobile: ""
//             });

//         }
//         else {
//             alert(data.message);
//         }

//     };


//     return (

//         <div className="min-h-screen flex items-center justify-center">

//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white shadow-lg p-8 rounded-lg w-96"
//             >

//                 <h1 className="text-2xl font-bold mb-5">
//                     Book Ambulance 🚑
//                 </h1>


//                 <input
//                     name="pickupLocation"
//                     placeholder="Pickup Location"
//                     value={form.pickupLocation}
//                     onChange={handleChange}
//                     className="border p-2 w-full mb-3"
//                 />


//                 <input
//                     name="destination"
//                     placeholder="Destination"
//                     value={form.destination}
//                     onChange={handleChange}
//                     className="border p-2 w-full mb-3"
//                 />


//                 <input
//                     name="mobile"
//                     placeholder="Mobile Number"
//                     value={form.mobile}
//                     onChange={handleChange}
//                     className="border p-2 w-full mb-3"
//                 />


//                 <select
//                     name="emergencyType"
//                     value={form.emergencyType}
//                     onChange={handleChange}
//                     className="border p-2 w-full mb-3"
//                 >

//                     <option value="">
//                         Emergency Type
//                     </option>

//                     <option>
//                         Accident
//                     </option>

//                     <option>
//                         Critical Patient
//                     </option>

//                     <option>
//                         Normal
//                     </option>

//                 </select>



//                 <select
//                     name="ambulanceType"
//                     value={form.ambulanceType}
//                     onChange={handleChange}
//                     className="border p-2 w-full mb-3"
//                 >

//                     <option value="">
//                         Ambulance Type
//                     </option>

//                     <option>
//                         Basic
//                     </option>

//                     <option>
//                         ICU
//                     </option>

//                     <option>
//                         Ventilator
//                     </option>

//                 </select>



//                 <button
//                     className="bg-red-600 text-white px-4 py-2 rounded w-full"
//                 >
//                     Book Now
//                 </button>


//             </form>

//         </div>

//     );

// }
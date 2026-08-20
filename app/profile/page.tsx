"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender?: string;
  bloodGroup: string;
  address?: string;
  emergency?: string;
  condition?: string;
}

export default function ProfilePage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-300 mt-5 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-5 py-8 md:px-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                🚑
              </div>

              <span className="text-cyan-400 font-semibold tracking-wide">
                AMBULANCE AI
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              My Profile
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your personal and emergency information.
            </p>
          </div>

          <button
  onClick={() => router.push("/profile/edit")}
  className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/10"
>
  ✏️ Edit Profile
</button>
        </div>


        {/* Profile Hero */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-4xl font-bold shadow-xl">
              {patient.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl md:text-3xl font-bold">
                  {patient.name}
                </h2>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  ● ACTIVE PATIENT
                </span>

              </div>

              <p className="text-slate-400 mt-2">
                {patient.email}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Registered patient • Ambulance AI Emergency System
              </p>

            </div>

            {/* Blood Group */}
            <div className="bg-slate-950/70 border border-slate-700 rounded-2xl p-5 text-center min-w-[130px]">

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Blood Group
              </p>

              <p className="text-3xl font-black text-rose-400 mt-1">
                {patient.bloodGroup}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Emergency Ready
              </p>

            </div>

          </div>

        </section>


        {/* Information Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Personal Information */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                👤
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Basic patient details
                </p>
              </div>

            </div>


            <div className="grid sm:grid-cols-2 gap-4">

              <InfoCard
                icon="👤"
                label="Full Name"
                value={patient.name}
              />

              <InfoCard
                icon="📧"
                label="Email Address"
                value={patient.email}
              />

              <InfoCard
                icon="📱"
                label="Mobile Number"
                value={patient.mobile}
              />

              <InfoCard
                icon="🎂"
                label="Age"
                value={`${patient.age} Years`}
              />

              <InfoCard
                icon="⚧️"
                label="Gender"
                value={patient.gender || "Not provided"}
              />

              <InfoCard
                icon="🩸"
                label="Blood Group"
                value={patient.bloodGroup}
              />

            </div>

          </section>


          {/* Emergency Card */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
                🚨
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Emergency Info
                </h2>

                <p className="text-sm text-slate-500">
                  Important medical details
                </p>
              </div>

            </div>


            <div className="space-y-4">

              <EmergencyItem
                label="Emergency Contact"
                value={patient.emergency || "Not provided"}
                icon="📞"
              />

              <EmergencyItem
                label="Medical Condition"
                value={patient.condition || "No condition provided"}
                icon="❤️"
              />

              <EmergencyItem
                label="Blood Group"
                value={patient.bloodGroup}
                icon="🩸"
              />

            </div>

          </section>


          {/* Address */}
          <section className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                📍
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Address
                </h2>

                <p className="text-sm text-slate-500">
                  Patient location information
                </p>
              </div>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

              <p className="text-slate-300">
                {patient.address || "Address not provided"}
              </p>

            </div>

          </section>


          {/* Emergency System Status */}
          <section className="lg:col-span-3 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 border border-slate-800 rounded-3xl p-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl">
                  ✓
                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    Emergency Assistance Ready
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Your profile is available for emergency ambulance services.
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-emerald-400 font-semibold">
                  System Online
                </span>

              </div>

            </div>

          </section>

        </div>


        {/* Footer note */}
        <div className="text-center mt-8 pb-5">

          <p className="text-xs text-slate-600">
            Ambulance AI • AI-Based Emergency Ambulance Tracking System
          </p>

        </div>

      </main>

    </div>
  );
}


/* ==========================================
   INFO CARD
========================================== */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-cyan-400/30 transition">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="font-semibold text-slate-200 mt-1 truncate">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ==========================================
   EMERGENCY ITEM
========================================== */

function EmergencyItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">

      <div className="flex gap-3">

        <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="text-sm font-semibold text-slate-200 mt-1 break-words">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";

// export default function ProfilePage() {
//   const [patient, setPatient] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getProfile = async () => {
//       try {
//         const res = await fetch("/api/profile");
//         const data = await res.json();

//         if (data.success) {
//           setPatient(data.patient);
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

//     getProfile();
//   }, []);

//   if (loading) {
//     return <h1 className="text-center mt-10">Loading...</h1>;
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-[500px]">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           My Profile
//         </h1>

//         <p><b>Name:</b> {patient?.name}</p>
//         <p><b>Email:</b> {patient?.email}</p>
//         <p><b>Mobile:</b> {patient?.mobile}</p>
//         <p><b>Age:</b> {patient?.age}</p>
//         <p><b>Blood Group:</b> {patient?.bloodGroup}</p>

//         <button
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
//         >
//           Edit Profile
//         </button>
//       </div>
//     </div>
//   );
// }
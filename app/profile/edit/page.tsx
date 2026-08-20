"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  mobile: string;
  address: string;
  emergency: string;
  condition: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    address: "",
    emergency: "",
    condition: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.success) {
          setFormData({
            name: data.patient.name || "",
            mobile: data.patient.mobile || "",
            address: data.patient.address || "",
            emergency: data.patient.emergency || "",
            condition: data.patient.condition || "",
          });
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/profile");
        router.refresh();
      } else {
        setError(data.message || "Update failed. Try again.");
        setSaving(false);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-5 py-8 md:px-8">
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
              Edit Profile
            </h1>

            <p className="text-slate-400 mt-2">
              Keep your details current for faster emergency response.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:border-slate-700 hover:text-white transition"
          >
            ← Back to Profile
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                👤
              </div>
              <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="text-sm text-slate-500">
                  Basic patient details
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                icon="👤"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <Field
                icon="📱"
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
              />
            </div>
          </section>

          {/* Emergency Information */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
                🚨
              </div>
              <div>
                <h2 className="text-xl font-bold">Emergency Info</h2>
                <p className="text-sm text-slate-500">
                  Important medical details
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                icon="📞"
                label="Emergency Contact"
                name="emergency"
                value={formData.emergency}
                onChange={handleChange}
                placeholder="Emergency contact number"
              />

              <Field
                icon="❤️"
                label="Medical Condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                placeholder="e.g. Diabetes, Asthma"
              />
            </div>
          </section>

          {/* Address */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                📍
              </div>
              <div>
                <h2 className="text-xl font-bold">Address</h2>
                <p className="text-sm text-slate-500">
                  Patient location information
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-500">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows={4}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none"
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/10 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "✓ Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/profile")}
              disabled={saving}
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:border-slate-700 hover:text-white transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ==========================================
   FIELD
========================================== */

function Field({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  icon: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-500">
        <span>{icon}</span>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
      />
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";

// export default function EditProfilePage() {
//     const [formData, setFormData] = useState({
//         name: "",
//         mobile: "",
//         address: "",
//         emergency: "",
//         condition: "",
//     });


//     useEffect(() => {

//         const getProfile = async () => {

//             try {

//                 const res = await fetch("/api/profile");
//                 const data = await res.json();

//                 if (data.success) {

//                     setFormData({
//                         name: data.patient.name || "",
//                         mobile: data.patient.mobile || "",
//                         address: data.patient.address || "",
//                         emergency: data.patient.emergency || "",
//                         condition: data.patient.condition || "",
//                     });

//                 }

//             } catch (error) {
//                 console.log(error);
//             }

//         };

//         getProfile();

//     }, []);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {

//             const res = await fetch("/api/profile/update", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formData),
//             });

//             const data = await res.json();

//             if (data.success) {

//                 alert("Profile Updated Successfully ✅");

//                 window.location.href = "/profile";

//             } else {

//                 alert(data.message);

//             }

//         } catch (error) {

//             console.log(error);

//             alert("Something went wrong!");

//         }
//     };
//     return (
//         <div className="min-h-screen flex justify-center items-center bg-gray-100">
//             <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
//                 <h1 className="text-3xl font-bold text-center mb-6">
//                     Edit Profile
//                 </h1>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <input
//                         type="text"
//                         name="name"
//                         placeholder="Full Name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded"
//                     />

//                     <input
//                         type="text"
//                         name="mobile"
//                         placeholder="Mobile Number"
//                         value={formData.mobile}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded"
//                     />

//                     <textarea
//                         name="address"
//                         placeholder="Address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded"
//                     />

//                     <input
//                         type="text"
//                         name="emergency"
//                         placeholder="Emergency Contact"
//                         value={formData.emergency}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded"
//                     />

//                     <input
//                         type="text"
//                         name="condition"
//                         placeholder="Medical Condition"
//                         value={formData.condition}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded"
//                     />

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
//                     >
//                         Save Changes
//                     </button>

//                 </form>
//             </div>
//         </div>
//     );
// }
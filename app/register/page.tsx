"use client";

import Swal from "sweetalert2";
import { useState } from "react";

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    address: "",
    emergency: "",
    condition: "",
    password: "",
    confirmPassword: "",
  });




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log(data);

    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    }).fire({
      icon: "success",
      title: "Patient Registered Successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Patient Registration
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Register to request ambulance services.
        </p>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Full Name */}
          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-medium mb-2">
              Age
            </label>
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-2">
              Gender
            </label>

            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Mobile */}
          <div>
            <label className="block font-medium mb-2">
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="9876543210"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block font-medium mb-2">
              Blood Group
            </label>

            <select
              value={formData.bloodGroup}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bloodGroup: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-2">
              Address
            </label>
            <textarea
              rows={3}
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block font-medium mb-2">
              Emergency Contact
            </label>

            <input
              type="tel"
              placeholder="Emergency Contact Number"
              value={formData.emergency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergency: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Medical Condition */}
          <div>
            <label className="block font-medium mb-2">
              Medical Condition
            </label>

            <input
              type="text"
              placeholder="Heart Patient / Diabetes / etc."
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}







// "use client";

// import Swal from "sweetalert2";
// import { useMemo, useState } from "react";
// import {
//   Activity,
//   AlertCircle,
//   ArrowRight,
//   Check,
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   HeartPulse,
//   Hospital,
//   LockKeyhole,
//   Mail,
//   MapPin,
//   Phone,
//   ShieldCheck,
//   User,
//   UserRoundPlus,
//   Users,
//   Zap,
// } from "lucide-react";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     bloodGroup: "",
//     address: "",
//     emergency: "",
//     condition: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [locationEnabled, setLocationEnabled] = useState(false);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const completion = useMemo(() => {
//     const fields = [
//       formData.name,
//       formData.age,
//       formData.gender,
//       formData.mobile,
//       formData.email,
//       formData.bloodGroup,
//       formData.address,
//       formData.emergency,
//       formData.condition,
//       formData.password,
//       formData.confirmPassword,
//     ];

//     const completed = fields.filter(Boolean).length;

//     return Math.round((completed / fields.length) * 100);
//   }, [formData]);

//   const requestLocation = () => {
//     if (!navigator.geolocation) {
//       Swal.fire({
//         icon: "error",
//         title: "Location unavailable",
//         text: "Your browser does not support location services.",
//       });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       () => {
//         setLocationEnabled(true);

//         Swal.fire({
//           toast: true,
//           position: "top-end",
//           icon: "success",
//           title: "Location access enabled",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       },
//       () => {
//         Swal.fire({
//           icon: "warning",
//           title: "Location permission required",
//           text: "Please allow location access for faster ambulance response.",
//         });
//       }
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.name ||
//       !formData.mobile ||
//       !formData.email ||
//       !formData.password
//     ) {
//       Swal.fire({
//         icon: "warning",
//         title: "Incomplete information",
//         text: "Please fill all required fields before registering.",
//         confirmButtonColor: "#2563eb",
//       });

//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Passwords do not match",
//         text: "Please make sure both passwords are identical.",
//         confirmButtonColor: "#dc2626",
//       });

//       return;
//     }

//     if (formData.password.length < 8) {
//       Swal.fire({
//         icon: "warning",
//         title: "Weak password",
//         text: "Password should contain at least 8 characters.",
//         confirmButtonColor: "#2563eb",
//       });

//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Registration failed");
//       }

//       await Swal.fire({
//         icon: "success",
//         title: "Registration Successful",
//         text: "Your patient profile has been created successfully.",
//         confirmButtonText: "Continue",
//         confirmButtonColor: "#2563eb",
//       });

//       console.log(data);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Registration failed",
//         text:
//           error instanceof Error
//             ? error.message
//             : "Something went wrong. Please try again.",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#f5f8fc] text-slate-900">
//       {/* ================= TOP NAV ================= */}
//       <header className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
//               <HeartPulse size={23} />
//             </div>

//             <div>
//               <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
//                 Medi<span className="text-blue-600">Ride</span>
//               </h1>
//               <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
//                 AI Emergency Response
//               </p>
//             </div>
//           </div>

//           <div className="hidden items-center gap-3 sm:flex">
//             <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
//               <span className="h-2 w-2 rounded-full bg-emerald-500" />
//               Emergency Network Online
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ================= HERO ================= */}
//       <section className="relative overflow-hidden bg-[#071a33]">
//         <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
//         <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

//         <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
//           <div className="max-w-3xl">
//             <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-blue-200">
//               <Zap size={14} className="text-cyan-300" />
//               AI-powered emergency healthcare
//             </div>

//             <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
//               Create your patient
//               <span className="text-blue-400"> emergency profile.</span>
//             </h2>

//             <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
//               Your profile helps our emergency response system quickly
//               identify your medical information, emergency contact and
//               ambulance requirements.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= MAIN ================= */}
//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
//         <div className="grid gap-8 lg:grid-cols-[1fr_310px]">
//           {/* ================= FORM ================= */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Progress */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//                     Profile completion
//                   </p>
//                   <p className="mt-1 text-sm font-bold text-slate-800">
//                     {completion}% completed
//                   </p>
//                 </div>

//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
//                   {completion}%
//                 </div>
//               </div>

//               <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
//                 <div
//                   className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
//                   style={{ width: `${completion}%` }}
//                 />
//               </div>
//             </div>

//             {/* ================= PERSONAL INFO ================= */}
//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <SectionHeader
//                 icon={<User size={19} />}
//                 title="Personal Information"
//                 description="Basic information used to identify the patient."
//               />

//               <div className="grid gap-5 p-6 md:grid-cols-2">
//                 <InputField
//                   label="Full Name"
//                   required
//                   icon={<User size={17} />}
//                   placeholder="Enter full name"
//                   value={formData.name}
//                   onChange={(value) => updateField("name", value)}
//                 />

//                 <InputField
//                   label="Age"
//                   required
//                   type="number"
//                   placeholder="Enter age"
//                   value={formData.age}
//                   onChange={(value) => updateField("age", value)}
//                 />

//                 <SelectField
//                   label="Gender"
//                   required
//                   value={formData.gender}
//                   onChange={(value) => updateField("gender", value)}
//                   options={[
//                     "Male",
//                     "Female",
//                     "Other",
//                     "Prefer not to say",
//                   ]}
//                   placeholder="Select gender"
//                 />

//                 <InputField
//                   label="Mobile Number"
//                   required
//                   type="tel"
//                   icon={<Phone size={17} />}
//                   placeholder="+91 98765 43210"
//                   value={formData.mobile}
//                   onChange={(value) => updateField("mobile", value)}
//                 />

//                 <InputField
//                   label="Email Address"
//                   required
//                   type="email"
//                   icon={<Mail size={17} />}
//                   placeholder="patient@example.com"
//                   value={formData.email}
//                   onChange={(value) => updateField("email", value)}
//                 />

//                 <SelectField
//                   label="Blood Group"
//                   value={formData.bloodGroup}
//                   onChange={(value) => updateField("bloodGroup", value)}
//                   options={[
//                     "A+",
//                     "A-",
//                     "B+",
//                     "B-",
//                     "AB+",
//                     "AB-",
//                     "O+",
//                     "O-",
//                   ]}
//                   placeholder="Select blood group"
//                 />

//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Residential Address
//                   </label>

//                   <div className="relative">
//                     <MapPin
//                       size={18}
//                       className="absolute left-4 top-4 text-slate-400"
//                     />

//                     <textarea
//                       rows={3}
//                       placeholder="Enter your complete address"
//                       value={formData.address}
//                       onChange={(e) =>
//                         updateField("address", e.target.value)
//                       }
//                       className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ================= EMERGENCY INFO ================= */}
//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <SectionHeader
//                 emergency
//                 icon={<AlertCircle size={19} />}
//                 title="Emergency Information"
//                 description="Information that can help responders during an emergency."
//               />

//               <div className="grid gap-5 p-6 md:grid-cols-2">
//                 <InputField
//                   label="Emergency Contact Number"
//                   required
//                   type="tel"
//                   icon={<Phone size={17} />}
//                   placeholder="+91 98765 43210"
//                   value={formData.emergency}
//                   onChange={(value) => updateField("emergency", value)}
//                 />

//                 <InputField
//                   label="Medical Condition"
//                   icon={<Activity size={17} />}
//                   placeholder="Diabetes, heart condition, asthma..."
//                   value={formData.condition}
//                   onChange={(value) => updateField("condition", value)}
//                 />

//                 {/* Location */}
//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 md:col-span-2">
//                   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex gap-3">
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
//                         <MapPin size={19} />
//                       </div>

//                       <div>
//                         <p className="text-sm font-bold text-slate-800">
//                           Emergency Location Access
//                         </p>
//                         <p className="mt-1 text-xs leading-5 text-slate-500">
//                           Allow location access so nearby ambulances can
//                           locate you faster.
//                         </p>
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={requestLocation}
//                       className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
//                         locationEnabled
//                           ? "bg-emerald-500 text-white"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                     >
//                       {locationEnabled ? (
//                         <>
//                           <Check size={17} />
//                           Enabled
//                         </>
//                       ) : (
//                         <>
//                           Enable
//                           <ArrowRight size={16} />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ================= SECURITY ================= */}
//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//               <SectionHeader
//                 icon={<LockKeyhole size={19} />}
//                 title="Account Security"
//                 description="Create a secure password for your patient account."
//               />

//               <div className="grid gap-5 p-6 md:grid-cols-2">
//                 <PasswordField
//                   label="Password"
//                   value={formData.password}
//                   visible={showPassword}
//                   onToggle={() => setShowPassword(!showPassword)}
//                   onChange={(value) => updateField("password", value)}
//                   placeholder="Minimum 8 characters"
//                 />

//                 <PasswordField
//                   label="Confirm Password"
//                   value={formData.confirmPassword}
//                   visible={showConfirmPassword}
//                   onToggle={() =>
//                     setShowConfirmPassword(!showConfirmPassword)
//                   }
//                   onChange={(value) =>
//                     updateField("confirmPassword", value)
//                   }
//                   placeholder="Re-enter your password"
//                 />
//               </div>

//               <div className="mx-6 mb-6 flex gap-3 rounded-xl bg-slate-50 p-4">
//                 <ShieldCheck
//                   size={20}
//                   className="mt-0.5 shrink-0 text-emerald-500"
//                 />

//                 <p className="text-xs leading-5 text-slate-500">
//                   Your account information should only be accessible to
//                   authorized healthcare and emergency-response personnel.
//                 </p>
//               </div>
//             </div>

//             {/* ================= SUBMIT ================= */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? (
//                 <>
//                   <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   Creating Patient Profile...
//                 </>
//               ) : (
//                 <>
//                   <UserRoundPlus size={20} />
//                   Create Patient Account
//                   <ArrowRight
//                     size={18}
//                     className="transition-transform group-hover:translate-x-1"
//                   />
//                 </>
//               )}
//             </button>

//             <p className="text-center text-xs leading-5 text-slate-400">
//               By registering, you agree to our terms and healthcare data
//               privacy policy.
//             </p>
//           </form>

//           {/* ================= SIDEBAR ================= */}
//           <aside className="space-y-5">
//             {/* Emergency Card */}
//             <div className="relative overflow-hidden rounded-3xl bg-[#071a33] p-6 text-white shadow-xl">
//               <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-500/20 blur-2xl" />

//               <div className="relative">
//                 <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 shadow-lg shadow-red-900/30">
//                   <AlertCircle size={24} />
//                 </div>

//                 <p className="text-xs font-bold uppercase tracking-wider text-red-300">
//                   Medical Emergency?
//                 </p>

//                 <h3 className="mt-2 text-2xl font-black">
//                   Get help immediately.
//                 </h3>

//                 <p className="mt-3 text-sm leading-6 text-slate-300">
//                   Request the nearest available ambulance and share your
//                   live location with emergency responders.
//                 </p>

//                 <button
//                   type="button"
//                   className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
//                 >
//                   <Phone size={18} />
//                   Request Ambulance
//                 </button>
//               </div>
//             </div>

//             {/* AI Features */}
//             <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//               <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//                 Why create a profile?
//               </p>

//               <div className="mt-5 space-y-5">
//                 <Feature
//                   icon={<Zap size={17} />}
//                   title="AI-Assisted Response"
//                   description="AI can help prioritize emergency information."
//                 />

//                 <Feature
//                   icon={<MapPin size={17} />}
//                   title="Live Location"
//                   description="Help nearby ambulance teams find you."
//                 />

//                 <Feature
//                   icon={<Hospital size={17} />}
//                   title="Hospital Coordination"
//                   description="Support faster emergency hospital routing."
//                 />

//                 <Feature
//                   icon={<ShieldCheck size={17} />}
//                   title="Protected Information"
//                   description="Keep sensitive patient information secured."
//                 />
//               </div>
//             </div>

//             {/* Trust */}
//             <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
//               <CheckCircle2
//                 size={21}
//                 className="shrink-0 text-emerald-600"
//               />

//               <div>
//                 <p className="text-sm font-bold text-emerald-800">
//                   Emergency-ready profile
//                 </p>
//                 <p className="mt-1 text-xs leading-5 text-emerald-700/70">
//                   Keep your emergency information updated for faster
//                   response.
//                 </p>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </section>

//       {/* ================= MOBILE EMERGENCY BAR ================= */}
//       <div className="sticky bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
//         <button
//           type="button"
//           className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg"
//         >
//           <Phone size={18} />
//           Emergency — Request Ambulance
//         </button>
//       </div>
//     </main>
//   );
// }

// /* =========================================================
//    REUSABLE COMPONENTS
// ========================================================= */

// function SectionHeader({
//   icon,
//   title,
//   description,
//   emergency = false,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   emergency?: boolean;
// }) {
//   return (
//     <div className="flex items-center gap-4 border-b border-slate-100 p-6">
//       <div
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
//           emergency
//             ? "bg-red-50 text-red-600"
//             : "bg-blue-50 text-blue-600"
//         }`}
//       >
//         {icon}
//       </div>

//       <div>
//         <h3 className="font-extrabold text-slate-900">{title}</h3>
//         <p className="mt-1 text-xs text-slate-400">{description}</p>
//       </div>
//     </div>
//   );
// }

// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   icon,
//   required = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   type?: string;
//   icon?: React.ReactNode;
//   required?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-bold text-slate-700">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <div className="relative">
//         {icon && (
//           <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//             {icon}
//           </div>
//         )}

//         <input
//           type={type}
//           value={value}
//           placeholder={placeholder}
//           required={required}
//           onChange={(e) => onChange(e.target.value)}
//           className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
//             icon ? "pl-11 pr-4" : "px-4"
//           }`}
//         />
//       </div>
//     </div>
//   );
// }

// function SelectField({
//   label,
//   value,
//   onChange,
//   options,
//   placeholder,
//   required = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
//   placeholder: string;
//   required?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-bold text-slate-700">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <select
//         value={value}
//         required={required}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
//       >
//         <option value="">{placeholder}</option>

//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function PasswordField({
//   label,
//   value,
//   visible,
//   onToggle,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   value: string;
//   visible: boolean;
//   onToggle: () => void;
//   onChange: (value: string) => void;
//   placeholder: string;
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-bold text-slate-700">
//         {label}
//         <span className="ml-1 text-red-500">*</span>
//       </label>

//       <div className="relative">
//         <LockKeyhole
//           size={17}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//         />

//         <input
//           type={visible ? "text" : "password"}
//           value={value}
//           required
//           minLength={8}
//           placeholder={placeholder}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
//         />

//         <button
//           type="button"
//           onClick={onToggle}
//           className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//           aria-label={visible ? "Hide password" : "Show password"}
//         >
//           {visible ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>
//     </div>
//   );
// }

// function Feature({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flex gap-3">
//       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//         {icon}
//       </div>

//       <div>
//         <h4 className="text-sm font-bold text-slate-800">{title}</h4>
//         <p className="mt-1 text-xs leading-5 text-slate-400">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }
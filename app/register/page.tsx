// "use client";

// import Swal from "sweetalert2";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import GoogleButton from "../Components/GoogleButton";

// export default function RegisterPage() {
//   const router = useRouter();
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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     console.log(data);

//     Swal.mixin({
//       toast: true,
//       position: "top-end",
//       showConfirmButton: false,
//       timer: 3000,
//       timerProgressBar: true,
//       didOpen: (toast) => {
//         toast.onmouseenter = Swal.stopTimer;
//         toast.onmouseleave = Swal.resumeTimer;
//       },
//     }).fire({
//       icon: "success",
//       title: "Patient Registered Successfully",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
//           Patient Registration
//         </h1>

//         <p className="text-center text-gray-500 mb-8">
//           Register to request ambulance services.
//         </p>
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-5"
//         >
//           {/* Full Name */}
//           <div>
//             <label className="block font-medium mb-2">Full Name</label>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   name: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           {/* Age */}
//           <div>
//             <label className="block font-medium mb-2">Age</label>
//             <input
//               type="number"
//               placeholder="Age"
//               value={formData.age}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   age: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block font-medium mb-2">Gender</label>

//             <select
//               value={formData.gender}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   gender: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3"
//             >
//               <option>Select Gender</option>
//               <option>Male</option>
//               <option>Female</option>
//               <option>Other</option>
//             </select>
//           </div>

//           {/* Mobile */}
//           <div>
//             <label className="block font-medium mb-2">Mobile Number</label>

//             <input
//               type="tel"
//               placeholder="9876543210"
//               value={formData.mobile}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   mobile: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block font-medium mb-2">Email</label>

//             <input
//               type="email"
//               placeholder="example@gmail.com"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   email: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           {/* Blood Group */}
//           <div>
//             <label className="block font-medium mb-2">Blood Group</label>

//             <select
//               value={formData.bloodGroup}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   bloodGroup: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option>Select Blood Group</option>
//               <option>A+</option>
//               <option>A-</option>
//               <option>B+</option>
//               <option>B-</option>
//               <option>AB+</option>
//               <option>AB-</option>
//               <option>O+</option>
//               <option>O-</option>
//             </select>
//           </div>

//           {/* Address */}
//           <div className="md:col-span-2">
//             <label className="block font-medium mb-2">Address</label>
//             <textarea
//               rows={3}
//               placeholder="Enter complete address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   address: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             ></textarea>
//           </div>

//           {/* Emergency Contact */}
//           <div>
//             <label className="block font-medium mb-2">Emergency Contact</label>

//             <input
//               type="tel"
//               placeholder="Emergency Contact Number"
//               value={formData.emergency}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   emergency: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Medical Condition */}
//           <div>
//             <label className="block font-medium mb-2">Medical Condition</label>

//             <input
//               type="text"
//               placeholder="Heart Patient / Diabetes / etc."
//               value={formData.condition}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   condition: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block font-medium mb-2">Password</label>

//             <input
//               type="password"
//               placeholder="Create Password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   password: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block font-medium mb-2">Confirm Password</label>

//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   confirmPassword: e.target.value,
//                 })
//               }
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Submit */}
//           <div className="md:col-span-2">
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//             >
//               Register
//             </button>
//           </div>
//           <div className="md:col-span-2 flex items-center gap-4 my-4">
//   <div className="flex-1 h-px bg-gray-300"></div>

//   <span className="text-gray-500 text-sm">
//     OR
//   </span>

//   <div className="flex-1 h-px bg-gray-300"></div>
// </div>

// <div className="md:col-span-2">
//   <GoogleButton />
// </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import GoogleButton from "@/app/Components/GoogleButton";

const inputClass =
  "w-full rounded-md border border-[#232B3D] bg-[#0D131F] px-4 py-3 text-[#F5F7FA] placeholder-[#4A5468] outline-none transition focus:border-[#22D3A6] focus:ring-1 focus:ring-[#22D3A6]";

const labelClass = "mb-1.5 block text-sm text-[#8B95A7]";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password mismatch",
        text: "Password aur confirm password same hone chahiye.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: form.age ? Number(form.age) : undefined,
          gender: form.gender || undefined,
          mobile: form.mobile || undefined,
          email: form.email,
          bloodGroup: form.bloodGroup || undefined,
          address: form.address || undefined,
          emergency: form.emergency || undefined,
          condition: form.condition || undefined,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: data.message || "Something went wrong",
        });
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Ab login karo",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Registration failed. Try again.",
      });
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0E14] px-6 py-16 text-[#F5F7FA] sm:px-10">
      <div className="mx-auto max-w-lg">

        <p
          className="mb-2 text-xs uppercase tracking-wide text-[#22D3A6]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          PT-REG
        </p>

        <h1
          className="text-3xl font-medium sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create your patient account
        </h1>
        <p className="mt-2 text-sm text-[#8B95A7]">
          Ye details emergency ke waqt ambulance aur hospital ko sahi
          decision lene mein madad karti hain.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">

          <div>
            <label className={labelClass}>Full name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="25"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="98765 43210"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Blood group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select blood group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Emergency contact</label>
            <input
              name="emergency"
              value={form.emergency}
              onChange={handleChange}
              placeholder="Name and number"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Known medical condition{" "}
              <span className="text-[#4A5468]">(optional)</span>
            </label>
            <input
              name="condition"
              value={form.condition}
              onChange={handleChange}
              placeholder="e.g. Asthma, Diabetes"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#FF4433] py-3.5 font-medium text-white transition hover:bg-[#E53A2B] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#1B2334]" />
          <span
            className="text-xs uppercase tracking-wide text-[#8B95A7]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Or
          </span>
          <div className="h-px flex-1 bg-[#1B2334]" />
        </div>

        <GoogleButton />

        <p className="mt-8 text-center text-sm text-[#8B95A7]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#22D3A6] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
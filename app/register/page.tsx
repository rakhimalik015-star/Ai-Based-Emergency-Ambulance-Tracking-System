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
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        text: "You can complete your profile anytime from settings.",
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
    <main className="flex min-h-screen items-center justify-center bg-[#0A0E14] px-6 py-16 text-[#F5F7FA] sm:px-10">
      <div className="w-full max-w-md">
        <p
          className="mb-2 text-xs uppercase tracking-wide text-[#22D3A6]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          PT-LOG
        </p>

        <h1
          className="text-3xl font-medium sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create patient account
        </h1>
        <p className="mt-2 text-sm text-[#8B95A7]">
          Get set up in seconds. Add medical details later from your profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className={labelClass}>Full name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

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
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={inputClass}
            />
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



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Swal from "sweetalert2";
// import GoogleButton from "@/app/Components/GoogleButton";

// const inputClass =
//   "w-full rounded-md border border-[#232B3D] bg-[#0D131F] px-4 py-3 text-[#F5F7FA] placeholder-[#4A5468] outline-none transition focus:border-[#22D3A6] focus:ring-1 focus:ring-[#22D3A6]";

// const labelClass = "mb-1.5 block text-sm text-[#8B95A7]";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//   });

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     if (form.password !== form.confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Password mismatch",
//         text: "Password aur confirm password same hone chahiye.",
//       });
//       return;
//     }

//     if (form.password.length < 6) {
//       Swal.fire({
//         icon: "error",
//         title: "Weak password",
//         text: "Password kam se kam 6 characters ka hona chahiye.",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name,
//           email: form.email,
//           mobile: form.mobile || undefined,
//           password: form.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         Swal.fire({
//           icon: "error",
//           title: "Registration failed",
//           text: data.message || "Something went wrong",
//         });
//         setLoading(false);
//         return;
//       }

//       await Swal.fire({
//         icon: "success",
//         title: "Account created",
//         text: "Ab login karo",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       router.push("/login");
//     } catch (error) {
//       console.error("REGISTER ERROR:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Registration failed. Try again.",
//       });
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[#0A0E14] px-6 py-16 text-[#F5F7FA] sm:px-10">
//       <div className="w-full max-w-md">

//         <p
//           className="mb-2 text-xs uppercase tracking-wide text-[#22D3A6]"
//           style={{ fontFamily: "var(--font-mono)" }}
//         >
//           PT-REG
//         </p>

//         <h1
//           className="text-3xl font-medium sm:text-4xl"
//           style={{ fontFamily: "var(--font-display)" }}
//         >
//           Create your account
//         </h1>
//         <p className="mt-2 text-sm text-[#8B95A7]">
//           Emergency ke waqt zaroori details baad mein apne profile se
//           complete kar sakte ho.
//         </p>

//         <form onSubmit={handleSubmit} className="mt-9 space-y-5">

//           <div>
//             <label className={labelClass}>Full name</label>
//             <input
//               name="name"
//               required
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Your full name"
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className={labelClass}>Email</label>
//             <input
//               name="email"
//               type="email"
//               required
//               value={form.email}
//               onChange={handleChange}
//               placeholder="example@gmail.com"
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className={labelClass}>
//               Mobile number{" "}
//               <span className="text-[#4A5468]">(optional)</span>
//             </label>
//             <input
//               name="mobile"
//               type="tel"
//               value={form.mobile}
//               onChange={handleChange}
//               placeholder="98765 43210"
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className={labelClass}>Password</label>
//             <input
//               name="password"
//               type="password"
//               required
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Create password"
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className={labelClass}>Confirm password</label>
//             <input
//               name="confirmPassword"
//               type="password"
//               required
//               value={form.confirmPassword}
//               onChange={handleChange}
//               placeholder="Repeat password"
//               className={inputClass}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-md bg-[#FF4433] py-3.5 font-medium text-white transition hover:bg-[#E53A2B] disabled:opacity-50"
//           >
//             {loading ? "Creating account..." : "Create account"}
//           </button>
//         </form>

//         <div className="my-6 flex items-center gap-4">
//           <div className="h-px flex-1 bg-[#1B2334]" />
//           <span
//             className="text-xs uppercase tracking-wide text-[#8B95A7]"
//             style={{ fontFamily: "var(--font-mono)" }}
//           >
//             Or
//           </span>
//           <div className="h-px flex-1 bg-[#1B2334]" />
//         </div>

//         <GoogleButton />

//         <p className="mt-8 text-center text-sm text-[#8B95A7]">
//           Already have an account?{" "}
//           <Link href="/login" className="text-[#22D3A6] hover:underline">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }


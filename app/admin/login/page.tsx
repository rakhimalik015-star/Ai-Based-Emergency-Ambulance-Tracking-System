"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const inputClass =
  "w-full rounded-md border border-[#232B3D] bg-[#0D131F] px-4 py-3 text-[#F5F7FA] placeholder-[#4A5468] outline-none transition focus:border-[#FF4433] focus:ring-1 focus:ring-[#FF4433]";

const labelClass = "mb-1.5 block text-sm text-[#8B95A7]";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Access denied",
          text: data.message || "Invalid admin credentials",
        });
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Access granted",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login failed. Try again.",
      });
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0E14] px-6 py-16 text-[#F5F7FA] sm:px-10">
      <div className="w-full max-w-md rounded-lg border border-[#232B3D] bg-[#0D131F] p-8">

        <p
          className="mb-2 text-xs uppercase tracking-wide text-[#FF4433]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          AD-LOG · RESTRICTED
        </p>

        <h1
          className="text-2xl font-medium sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin console access
        </h1>
        <p className="mt-2 text-sm text-[#8B95A7]">
          Fleet, hospitals and bookings management.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#FF4433] py-3.5 font-medium text-white transition hover:bg-[#E53A2B] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter console"}
          </button>
        </form>
      </div>
    </main>
  );
}
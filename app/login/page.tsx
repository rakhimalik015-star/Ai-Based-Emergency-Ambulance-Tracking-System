
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import GoogleButton from "@/app/Components/GoogleButton";

const inputClass =
  "w-full rounded-md border border-[#232B3D] bg-[#0D131F] px-4 py-3 text-[#F5F7FA] placeholder-[#4A5468] outline-none transition focus:border-[#22D3A6] focus:ring-1 focus:ring-[#22D3A6]";

const labelClass = "mb-1.5 block text-sm text-[#8B95A7]";

export default function LoginPage() {
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: data.message || "Invalid email or password",
        });
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Welcome back",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
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
          Patient login
        </h1>
        <p className="mt-2 text-sm text-[#8B95A7]">
          Book an ambulance or track an existing request.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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
            {loading ? "Logging in..." : "Log in"}
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
          New here?{" "}
          <Link href="/register" className="text-[#22D3A6] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

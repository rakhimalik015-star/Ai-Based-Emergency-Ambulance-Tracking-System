"use client";

import { useState } from "react";
import Swal from "sweetalert2";

const inputClass =
  "w-full rounded-md border border-[#232B3D] bg-[#0D131F] px-4 py-3 text-[#F5F7FA] placeholder-[#4A5468] outline-none transition focus:border-[#FF4433] focus:ring-1 focus:ring-[#FF4433]";

const labelClass = "mb-1.5 block text-sm text-[#8B95A7]";

export default function AddAdminPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Could not create admin",
          text: data.message,
        });
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Admin created",
        text: `${data.admin.email} can now log in as admin.`,
      });

      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("ADD ADMIN ERROR:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0E14] px-6 py-16 text-[#F5F7FA] sm:px-10">
      <div className="mx-auto max-w-lg">
        <p
          className="mb-2 text-xs uppercase tracking-wide text-[#FF4433]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          AD-ADD · RESTRICTED
        </p>

        <h1
          className="text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Add a new admin
        </h1>
        <p className="mt-2 text-sm text-[#8B95A7]">
          Only existing admins can create new admin accounts.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
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
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Temporary password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#FF4433] py-3.5 font-medium text-white transition hover:bg-[#E53A2B] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create admin"}
          </button>
        </form>
      </div>
    </main>
  );
}

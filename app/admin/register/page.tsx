"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Admin registration failed");
        return;
      }

      alert("Admin registration successful!");

      // Redirect to Admin Login
      router.push("/admin/login");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          🛡️ Admin Registration
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create an Ambulance AI admin account
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">
              Admin Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
              placeholder="Enter admin name"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium">
              Mobile Number
            </label>

            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
              placeholder="Enter mobile number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
              placeholder="Enter admin email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border p-3"
              placeholder="Minimum 6 characters"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading
              ? "Creating Admin..."
              : "Register as Admin"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an admin account?{" "}
          <button
            onClick={() => router.push("/admin/login")}
            className="font-semibold text-blue-700 hover:underline"
          >
            Admin Login
          </button>
        </p>

      </div>

    </main>
  );
}
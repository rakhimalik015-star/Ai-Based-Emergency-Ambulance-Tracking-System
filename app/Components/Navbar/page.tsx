"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-red-600"
        >
          🚑 Ambulance AI
        </Link>

        {/* Navigation */}
        <div className="flex gap-6 items-center">

          <Link
            href="/"
            className="font-medium hover:text-red-600 transition"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="font-medium hover:text-red-600 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/booking"
            className="font-medium hover:text-red-600 transition"
          >
            Book Ambulance
          </Link>

          <Link
            href="/my-bookings"
            className="font-medium hover:text-red-600 transition"
          >
            My Bookings
          </Link>

          <Link
            href="/profile"
            className="font-medium hover:text-red-600 transition"
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg
            font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

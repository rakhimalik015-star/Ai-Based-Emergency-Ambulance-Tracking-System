// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await fetch("/api/logout", {
//       method: "POST",
//     });

//     router.push("/login");
//     router.refresh();
//   };

//   return (
//     <nav className="bg-white text-gray-800 shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-2xl font-bold text-red-600"
//         >
//           🚑 Ambulance AI
//         </Link>

//         {/* Navigation */}
//         <div className="flex gap-6 items-center">

//           <Link
//             href="/"
//             className="font-medium hover:text-red-600 transition"
//           >
//             Home
//           </Link>

//           <Link
//             href="/dashboard"
//             className="font-medium hover:text-red-600 transition"
//           >
//             Dashboard
//           </Link>

//           <Link
//             href="/booking"
//             className="font-medium hover:text-red-600 transition"
//           >
//             Book Ambulance
//           </Link>

//           <Link
//             href="/my-bookings"
//             className="font-medium hover:text-red-600 transition"
//           >
//             My Bookings
//           </Link>

//           <Link
//             href="/profile"
//             className="font-medium hover:text-red-600 transition"
//           >
//             Profile
//           </Link>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="bg-red-600 text-white px-5 py-2 rounded-lg
//             font-semibold hover:bg-red-700 transition"
//           >
//             Logout
//           </button>

//         </div>
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: "⌂",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "▦",
    },
    {
      name: "Book Ambulance",
      href: "/booking",
      icon: "🚑",
    },
    {
      name: "My Bookings",
      href: "/my-bookings",
      icon: "◫",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "◉",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070A12]/95 text-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">

      {/* =====================================================
          TOP ACCENT LINE
      ====================================================== */}

      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        <div className="flex h-[72px] items-center justify-between">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >

            {/* Logo Icon */}

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-violet-500/20 via-[#101827] to-cyan-400/10 text-xl shadow-[0_0_25px_rgba(34,211,238,0.08)] transition-all duration-300 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">

              <span className="relative z-10">
                🚑
              </span>

              {/* Small live dot */}

              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

            </div>

            {/* Logo Text */}

            <div className="hidden sm:block">

              <div className="flex items-center gap-2">

                <span className="text-lg font-bold tracking-tight text-white">
                  Ambulance
                </span>

                <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                  AI
                </span>

              </div>

              <p className="mt-[-1px] text-[8px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                Emergency Response System
              </p>

            </div>

          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-1 lg:flex">

            {navItems.map((item) => {

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-500/15 to-cyan-400/10 text-cyan-300"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >

                  {/* Icon */}

                  <span
                    className={`text-sm transition ${
                      isActive
                        ? "text-violet-300"
                        : "text-slate-600 group-hover:text-cyan-300"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.name}

                  {/* Active Indicator */}

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                  )}

                </Link>
              );
            })}

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center gap-3">

            {/* System Status */}

            <div className="hidden items-center gap-2 rounded-xl border border-lime-400/10 bg-lime-400/[0.03] px-3 py-2 xl:flex">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />

              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-lime-300">
                System Online
              </span>

            </div>

            {/* Emergency Indicator */}

            <div className="hidden h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/5 text-violet-300 md:flex">
              ✦
            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden items-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.04] px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >

              <span>
                {loggingOut ? "..." : "↪"}
              </span>

              {loggingOut ? "Signing out" : "Logout"}

            </button>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300 lg:hidden"
              aria-label="Toggle menu"
            >

              {menuOpen ? "×" : "☰"}

            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {menuOpen && (

          <div className="border-t border-white/[0.06] py-4 lg:hidden">

            {/* Mobile System Status */}

            <div className="mb-3 flex items-center justify-between rounded-xl border border-lime-400/10 bg-lime-400/[0.03] px-4 py-3">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-lime-300">
                  Emergency System Online
                </span>

              </div>

              <span className="text-[9px] text-slate-600">
                LIVE
              </span>

            </div>

            {/* Mobile Links */}

            <div className="space-y-1">

              {navItems.map((item) => {

                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "border border-violet-400/10 bg-gradient-to-r from-violet-500/15 to-cyan-400/5 text-cyan-300"
                        : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03]">
                      {item.icon}
                    </span>

                    {item.name}

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22D3EE]" />
                    )}

                  </Link>
                );
              })}

            </div>

            {/* Mobile Logout */}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/10 bg-rose-400/[0.04] px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
            >

              <span>
                {loggingOut ? "..." : "↪"}
              </span>

              {loggingOut ? "Signing out..." : "Logout"}

            </button>

          </div>

        )}

      </div>

    </nav>
  );
}
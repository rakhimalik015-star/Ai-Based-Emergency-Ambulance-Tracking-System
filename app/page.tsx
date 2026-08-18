// // import Image from "next/image";
// // import Link from "next/link";

// // export default function Home() {
// //   return (
// //     <main className="min-h-screen">

// //       {/* Hero Section */}
// //       <section className="relative min-h-screen flex items-center overflow-hidden">

// //         {/* Ambulance Image */}
// //         <Image
// //           src="/ambu.jpg"
// //           alt="Emergency Ambulance Service"
// //           fill
// //           priority
// //           className="object-cover"
// //         />

// //         {/* Dark Overlay */}
// //         <div className="absolute inset-0 bg-black/60"></div>

// //         {/* Content */}
// //         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

// //           <div className="max-w-3xl text-white">

// //             {/* Small Heading */}
// //             <p className="mb-4 text-lg font-semibold text-red-400">
// //               🚑 AI Based Emergency Ambulance Tracking System
// //             </p>

// //             {/* Main Heading */}
// //             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
// //               Fast Emergency
// //               <span className="block text-red-500">
// //                 Ambulance Service
// //               </span>
// //             </h1>

// //             {/* Description */}
// //             <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-gray-200">
// //               Get emergency ambulance assistance quickly and safely.
// //               Book an ambulance, track your booking and get the help
// //               you need when every second matters.
// //             </p>

// //             {/* Buttons */}
// //             <div className="mt-8 flex flex-col sm:flex-row gap-4">
// //               <Link
// //                 href="/register"
// //                 className="rounded-lg bg-red-600 px-7 py-4 text-center
// //                 font-semibold text-white transition
// //                 hover:bg-red-700"
// //               >Register here</Link>

// //               <Link
// //                 href="/login"
// //                 className="rounded-lg border border-white
// //                 bg-white/10 px-7 py-4 text-center
// //                 font-semibold text-white backdrop-blur-sm
// //                 transition hover:bg-white hover:text-black"
// //               >
// //                 Login
// //               </Link>

// //               <Link
// //                 href="/booking"
// //                 className="rounded-lg bg-red-600 px-7 py-4 text-center
// //                 font-semibold text-white transition
// //                 hover:bg-red-700"
// //               >
// //                 🚑 Book Ambulance
// //               </Link>

// //             </div>

// //             {/* Features */}
// //             <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

// //               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
// //                 <div className="text-3xl">⚡</div>
// //                 <h3 className="mt-2 font-semibold">
// //                   Fast Response
// //                 </h3>
// //                 <p className="mt-1 text-sm text-gray-300">
// //                   Quick ambulance booking during emergencies.
// //                 </p>
// //               </div>

// //               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
// //                 <div className="text-3xl">📍</div>
// //                 <h3 className="mt-2 font-semibold">
// //                   Track Ambulance
// //                 </h3>
// //                 <p className="mt-1 text-sm text-gray-300">
// //                   Keep track of your ambulance booking.
// //                 </p>
// //               </div>

// //               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
// //                 <div className="text-3xl">🩺</div>
// //                 <h3 className="mt-2 font-semibold">
// //                   Emergency Care
// //                 </h3>
// //                 <p className="mt-1 text-sm text-gray-300">
// //                   Designed for emergency medical assistance.
// //                 </p>
// //               </div>

// //             </div>

// //           </div>

// //         </div>
// //       </section>

// //     </main>
// //   )}

// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen">

//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center overflow-hidden">

//         {/* Ambulance Image */}
//         <Image
//           src="/ambu.jpg"
//           alt="Emergency Ambulance Service"
//           fill
//           priority
//           className="object-cover"
//         />

//         {/* Dark Overlay */}
//         <div className="absolute inset-0 bg-black/60"></div>

//         {/* Content */}
//         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

//           <div className="max-w-4xl text-white">

//             {/* Small Heading */}
//             <p className="mb-4 text-lg font-semibold text-red-400">
//               🚑 AI Based Emergency Ambulance Tracking System
//             </p>

//             {/* Main Heading */}
//             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
//               Fast Emergency
//               <span className="block text-red-500">
//                 Ambulance Service
//               </span>
//             </h1>

//             {/* Description */}
//             <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-gray-200">
//               Get emergency ambulance assistance quickly and safely.
//               Book an ambulance, track your booking and get the help
//               you need when every second matters.
//             </p>

//             {/* Login / Register Buttons */}
//             <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">

//               {/* Patient Register */}
//               <Link
//                 href="/register"
//                 className="rounded-lg bg-red-600 px-7 py-4 text-center
//                 font-semibold text-white transition hover:bg-red-700"
//               >
//                 📝 Register Here
//               </Link>

//               {/* Patient Login */}
//               <Link
//                 href="/login"
//                 className="rounded-lg bg-white px-7 py-4 text-center
//                 font-semibold text-black transition hover:bg-gray-200"
//               >
//                 👤 Patient Login
//               </Link>

//               {/* Admin Login */}
//               <Link
//                 href="/admin/login"
//                 className="rounded-lg border border-white
//                 bg-white/10 px-7 py-4 text-center
//                 font-semibold text-white backdrop-blur-sm
//                 transition hover:bg-white hover:text-black"
//               >
//                 🛡️ Admin Login
//               </Link>

//               {/* Driver Login */}
//               <Link
//                 href="/driver/login"
//                 className="rounded-lg border border-white
//                 bg-white/10 px-7 py-4 text-center
//                 font-semibold text-white backdrop-blur-sm
//                 transition hover:bg-white hover:text-black"
//               >
//                 🚑 Driver Login
//               </Link>

//               {/* Book Ambulance */}
//               <Link
//                 href="/booking"
//                 className="rounded-lg bg-red-600 px-7 py-4 text-center
//                 font-semibold text-white transition hover:bg-red-700"
//               >
//                 🚑 Book Ambulance
//               </Link>

//             </div>

//             {/* Login Information */}
//             <div className="mt-8 rounded-xl bg-black/30 p-5 backdrop-blur-sm max-w-2xl">
//               <p className="text-sm text-gray-200">
//                 <span className="font-semibold text-white">
//                   Choose your login:
//                 </span>{" "}
//                 Patient, Admin or Driver can access their respective
//                 dashboard directly from here.
//               </p>
//             </div>

//             {/* Features */}
//             <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

//               {/* Feature 1 */}
//               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
//                 <div className="text-3xl">⚡</div>

//                 <h3 className="mt-2 font-semibold">
//                   Fast Response
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-300">
//                   Quick ambulance booking during emergencies.
//                 </p>
//               </div>

//               {/* Feature 2 */}
//               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
//                 <div className="text-3xl">📍</div>

//                 <h3 className="mt-2 font-semibold">
//                   Track Ambulance
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-300">
//                   Keep track of your ambulance booking.
//                 </p>
//               </div>

//               {/* Feature 3 */}
//               <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
//                 <div className="text-3xl">🩺</div>

//                 <h3 className="mt-2 font-semibold">
//                   Emergency Care
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-300">
//                   Designed for emergency medical assistance.
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>
//       </section>

//     </main>
//   );
// }

import Link from "next/link";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const accessPoints = [
  { label: "Patient", action: "Register", href: "/register", code: "PT-REG" },
  { label: "Patient", action: "Login", href: "/login", code: "PT-LOG" },
  { label: "Admin", action: "Login", href: "/admin/login", code: "AD-LOG" },
  { label: "Driver", action: "Login", href: "/driver/login", code: "DR-LOG" },
];

const protocol = [
  { step: "Request", detail: "Share your location and emergency type." },
  { step: "Dispatch", detail: "Nearest available ambulance is assigned." },
  { step: "Track", detail: "Watch the ambulance move toward you, live." },
  { step: "Arrive", detail: "Hospital is briefed before you reach it." },
];

const network = [
  { value: "24/7", label: "Dispatch active" },
  { value: "<4min", label: "Avg. assign time" },
  { value: "120+", label: "Hospitals linked" },
];

export default function Home() {
  return (
    <main
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[#0A0E14] text-[#F5F7FA]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ================================== */}
      {/* HERO — DISPATCH CONSOLE */}
      {/* ================================== */}
      <section className="relative overflow-hidden border-b border-[#1B2334]">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-125 w-225 -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #22D3A6, transparent 70%)",
          }}
        />

        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#3A4459 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-16 sm:px-10 sm:pt-36">
          {/* Status pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22D3A6]/30 bg-[#22D3A6]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3A6] animate-pulse" />
            <span
              className="text-xs tracking-wide text-[#22D3A6]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              DISPATCH NETWORK ONLINE
            </span>
          </div>

          {/* Headline */}
          <h1
            className="max-w-3xl text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every second,
            <span className="block text-[#FF4433]">routed correctly.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#8B95A7]">
            Book an ambulance, get matched to the nearest available driver, and
            track it moving toward you — in real time, from request to arrival.
          </p>

          {/* Primary CTA */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/booking"
              className="rounded-md bg-[#FF4433] px-7 py-4 font-medium text-white transition hover:bg-[#E53A2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3A6]"
            >
              Book an ambulance now
            </Link>
            <Link
              href="/register"
              className="rounded-md border border-[#2A3244] px-7 py-4 font-medium text-[#F5F7FA] transition hover:border-[#3A4459] hover:bg-[#121826] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3A6]"
            >
              Create an account
            </Link>
          </div>

          {/* Pulse line — signature element */}
          <div className="relative mt-16 h-14 w-full max-w-2xl overflow-hidden">
            <svg
              viewBox="0 0 600 56"
              fill="none"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 28 H210 L230 6 L250 50 L268 28 H600"
                stroke="#22D3A6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pulse-path"
              />
            </svg>
          </div>

          {/* Network status strip */}
          <div
            className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-[#1B2334] pt-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {network.map((item) => (
              <div key={item.label}>
                <div className="text-2xl text-[#F5F7FA] sm:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-[#8B95A7]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .pulse-path {
            stroke-dasharray: 700;
            stroke-dashoffset: 700;
            animation: draw-pulse 3.2s ease-in-out infinite;
          }
          @keyframes draw-pulse {
            0% { stroke-dashoffset: 700; }
            55% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -700; }
          }
          @media (prefers-reduced-motion: reduce) {
            .pulse-path { animation: none; stroke-dashoffset: 0; }
          }
        `}</style>
      </section>

      {/* ================================== */}
      {/* ACCESS POINTS */}
      {/* ================================== */}
      <section className="border-b border-[#1B2334] bg-[#0D131F]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <p
            className="mb-8 text-xs uppercase tracking-wide text-[#8B95A7]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sign in by role
          </p>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#1B2334] bg-[#1B2334] sm:grid-cols-2 lg:grid-cols-4">
            {accessPoints.map((item) => (
              <Link
                key={item.code}
                href={item.href}
                className="group flex flex-col justify-between bg-[#0D131F] p-6 transition hover:bg-[#121826] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3A6]"
              >
                <span
                  className="text-xs text-[#4A5468]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.code}
                </span>

                <div className="mt-8">
                  <div className="text-sm text-[#8B95A7]">{item.label}</div>
                  <div
                    className="mt-1 flex items-center gap-2 text-lg font-medium"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.action}
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* PROTOCOL — genuine sequence */}
      {/* ================================== */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <h2
          className="max-w-md text-3xl font-medium leading-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What happens after you tap book
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-0 sm:grid-cols-4">
          {protocol.map((item, i) => (
            <div
              key={item.step}
              className="relative border-t border-[#1B2334] py-6 pr-6 sm:border-l sm:border-t-0 sm:py-0 sm:pl-6"
            >
              <div
                className="text-xs text-[#4A5468]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="mt-2 text-lg font-medium text-[#F5F7FA]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.step}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

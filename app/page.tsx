// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Ambulance Image */}
        <Image
          src="/ambu.jpg"
          alt="Emergency Ambulance Service"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className="max-w-3xl text-white">

            {/* Small Heading */}
            <p className="mb-4 text-lg font-semibold text-red-400">
              🚑 AI Based Emergency Ambulance Tracking System
            </p>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Fast Emergency
              <span className="block text-red-500">
                Ambulance Service
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-gray-200">
              Get emergency ambulance assistance quickly and safely.
              Book an ambulance, track your booking and get the help
              you need when every second matters.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-red-600 px-7 py-4 text-center
                font-semibold text-white transition
                hover:bg-red-700"
              >Register here</Link>
              

              <Link
                href="/login"
                className="rounded-lg border border-white
                bg-white/10 px-7 py-4 text-center
                font-semibold text-white backdrop-blur-sm
                transition hover:bg-white hover:text-black"
              >
                Login
              </Link>


              <Link
                href="/booking"
                className="rounded-lg bg-red-600 px-7 py-4 text-center
                font-semibold text-white transition
                hover:bg-red-700"
              >
                🚑 Book Ambulance
              </Link>

            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-3xl">⚡</div>
                <h3 className="mt-2 font-semibold">
                  Fast Response
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Quick ambulance booking during emergencies.
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-3xl">📍</div>
                <h3 className="mt-2 font-semibold">
                  Track Ambulance
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Keep track of your ambulance booking.
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-3xl">🩺</div>
                <h3 className="mt-2 font-semibold">
                  Emergency Care
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Designed for emergency medical assistance.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  )}
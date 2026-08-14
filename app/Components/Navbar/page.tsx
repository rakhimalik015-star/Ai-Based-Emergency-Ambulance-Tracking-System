// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-blue-600 text-white p-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link href="/" className="text-xl font-bold">
//           MyApp
//         </Link>

//         <div className="flex gap-6">
//           <Link href="/">Home</Link>
//           <Link href="/about">About</Link>
//           <Link href="/services">Services</Link>
//           <Link href="/contact">Contact</Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
















// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const router = useRouter();

//  const handleLogout = async () => {
//   await fetch("/api/logout", {
//     method: "POST",
//   });

//   router.push("/login");
//   router.refresh();
// };

//   return (
//     <nav className="bg-blue-600 text-white p-4 shadow">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">

//         <Link href="/" className="text-2xl font-bold">
//           🚑 Ambulance AI
//         </Link>

//         <div className="flex gap-5 items-center">

//           <Link href="/">Home</Link>

//           <Link href="/dashboard">Dashboard</Link>

//           <Link href="/booking">Book Ambulance</Link>

//           <Link href="/my-bookings">My Bookings</Link>

//           <Link href="/profile">Profile</Link>
          
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
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

"use client";

import { useState } from "react";
import Swal from "sweetalert2";

// ======================================
// GPS location lena — high accuracy try karo,
// timeout ho jaye to low-accuracy (network-based) fallback
// ======================================
function getLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.TIMEOUT) {
          // High accuracy fail hui — network-based location try karo
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          });
        } else {
          reject(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  });
}

export default function EmergencyBookButton() {
  const [loading, setLoading] = useState(false);

  async function handleEmergencyBook() {
    // ======================================
    // STEP 1: Phone number lena (driver ke contact ke liye zaroori)
    // ======================================
    const { value: phone } = await Swal.fire({
      title: "Emergency Ambulance",
      input: "tel",
      inputLabel: "Your mobile number",
      inputPlaceholder: "So the driver can reach you",
      confirmButtonText: "Book Now",
      confirmButtonColor: "#FF4433",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value.trim().length < 10) {
          return "Enter a valid mobile number";
        }
      },
    });

    if (!phone) return; // user ne cancel kiya

    setLoading(true);

    // ======================================
    // STEP 2: GPS location lena
    // ======================================
    if (!navigator.geolocation) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Location not supported",
        text: "Your browser doesn't support GPS location.",
      });
      return;
    }

    try {
      const position = await getLocation();
      const { latitude, longitude } = position.coords;

      // ======================================
      // STEP 3: Booking API call
      // ======================================
      const res = await fetch("/api/emergency-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, latitude, longitude }),
      });

      const data = await res.json();

      if (!data.success) {
        Swal.fire({
          icon: "error",
          title: "Booking failed",
          text: data.message || "Please try again.",
        });
        setLoading(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Ambulance is on the way",
        text: `Booking ID: ${data.booking.id}`,
        confirmButtonColor: "#22D3A6",
      });

      // Live tracking page pe le jao
      window.location.href = `/tracking/${data.booking.id}`;
    } catch (error: any) {
      setLoading(false);
      console.error("GPS/BOOKING ERROR:", error);

      let message =
        "Please allow location access to book an emergency ambulance.";

      if (error.code === 1) {
        message =
          "Location access is blocked. Click the lock icon next to the address bar, set Location to Allow, then reload and try again.";
      } else if (error.code === 2) {
        message =
          "Unable to detect your location. Please check that Location Services are turned ON in your system settings.";
      } else if (error.code === 3) {
        message =
          "Location is taking too long. Please move to an area with better signal (near a window, or outdoors) and try again.";
      } else {
        message = "Something went wrong. Please try again.";
      }

      Swal.fire({
        icon: "error",
        title: "Location error",
        text: message,
      });
    }
  }

  return (
    <button
      onClick={handleEmergencyBook}
      disabled={loading}
      className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#FF4433] text-white font-bold text-lg shadow-lg shadow-[#FF4433]/20 hover:bg-[#E53A2B] transition disabled:opacity-60 animate-pulse hover:animate-none"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Locating & Booking...
        </>
      ) : (
        <>🚨 Emergency — Book Ambulance Now</>
      )}
    </button>
  );
}


// "use client";

// import { useState } from "react";
// import Swal from "sweetalert2";

// export default function EmergencyBookButton() {
//   const [loading, setLoading] = useState(false);

//   async function handleEmergencyBook() {
//     // ======================================
//     // STEP 1: Phone number lena (driver ke contact ke liye zaroori)
//     // ======================================
//     const { value: phone } = await Swal.fire({
//       title: "Emergency Ambulance",
//       input: "tel",
//       inputLabel: "Your mobile number",
//       inputPlaceholder: "So the driver can reach you",
//       confirmButtonText: "Book Now",
//       confirmButtonColor: "#FF4433",
//       showCancelButton: true,
//       inputValidator: (value) => {
//         if (!value || value.trim().length < 10) {
//           return "Enter a valid mobile number";
//         }
//       },
//     });

//     if (!phone) return; // user ne cancel kiya

//     setLoading(true);

//     // ======================================
//     // STEP 2: GPS location lena
//     // ======================================
//     if (!navigator.geolocation) {
//       setLoading(false);
//       Swal.fire({
//         icon: "error",
//         title: "Location not supported",
//         text: "Your browser doesn't support GPS location.",
//       });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         // ======================================
//         // STEP 3: Booking API call
//         // ======================================
//         try {
//           const res = await fetch("/api/emergency-booking", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ phone, latitude, longitude }),
//           });

//           const data = await res.json();

//           if (!data.success) {
//             Swal.fire({
//               icon: "error",
//               title: "Booking failed",
//               text: data.message || "Please try again.",
//             });
//             setLoading(false);
//             return;
//           }

//           await Swal.fire({
//             icon: "success",
//             title: "Ambulance is on the way",
//             text: `Booking ID: ${data.booking.id}`,
//             confirmButtonColor: "#22D3A6",
//           });

//           // Live tracking page pe le jao
//           window.location.href = `/bookings/${data.booking.id}`;
//         } catch (error) {
//           console.error("EMERGENCY BOOKING ERROR:", error);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Something went wrong. Try again.",
//           });
//           setLoading(false);
//         }
//       },
//       (error) => {
//   setLoading(false);
//   console.error("GPS ERROR CODE:", error.code, "MESSAGE:", error.message);

//   let message = "Please allow location access to book an emergency ambulance.";

//   if (error.code === error.PERMISSION_DENIED) {
//     message =
//       "Location access is blocked. Please enable it from your browser's site settings (click the lock icon near the address bar) and try again.";
//   } else if (error.code === error.POSITION_UNAVAILABLE) {
//     message =
//       "Unable to detect your location. Please check that Location Services are turned ON in your Windows settings, then try again.";
//   } else if (error.code === error.TIMEOUT) {
//     message = "Location request timed out. Please try again.";
//   }

//   Swal.fire({
//     icon: "error",
//     title: "Location access denied",
//     text: message,
//   });
// },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       },
//     );
//   }

//   return (
//     <button
//       onClick={handleEmergencyBook}
//       disabled={loading}
//       className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#FF4433] text-white font-bold text-lg shadow-lg shadow-[#FF4433]/20 hover:bg-[#E53A2B] transition disabled:opacity-60 animate-pulse hover:animate-none"
//     >
//       {loading ? (
//         <>
//           <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//           Locating & Booking...
//         </>
//       ) : (
//         <>🚨 Emergency — Book Ambulance Now</>
//       )}
//     </button>
//   );
// }

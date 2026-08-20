"use client";

import { useState } from "react";
import Swal from "sweetalert2";

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

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // ======================================
        // STEP 3: Booking API call
        // ======================================
        try {
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
         window.location.href = `/bookings/${data.booking.id}`;
        } catch (error) {
          console.error("EMERGENCY BOOKING ERROR:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Try again.",
          });
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        console.error("GPS ERROR:", error);
        Swal.fire({
          icon: "error",
          title: "Location access denied",
          text: "Please allow location access to book an emergency ambulance.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
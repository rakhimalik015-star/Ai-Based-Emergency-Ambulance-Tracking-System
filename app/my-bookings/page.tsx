"use client";

import { useEffect, useState } from "react";

interface Ambulance {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  type: string;
  status: string;
}

interface Booking {
  id: string;
  pickupLocation: string;
  destination: string;
  emergencyType: string;
  ambulanceType: string;
  mobile: string;
  status: string;
  createdAt: string;
  ambulance?: Ambulance | null;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await fetch("/api/my-bookings");

        const data = await res.json();

        if (data.success) {
          setBookings(data.bookings);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.log(error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  if (loading) {
    return (
      <h1 className="text-center mt-20 text-2xl">
        Loading Bookings...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8">
        My Ambulance Bookings 🚑
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            No bookings found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border rounded-xl shadow p-6"
            >

              {/* Booking Details */}
              <h2 className="text-xl font-bold mb-4">
                Booking Details
              </h2>

              <div className="grid md:grid-cols-2 gap-3">

                <p>
                  <b>Pickup:</b>{" "}
                  {booking.pickupLocation}
                </p>

                <p>
                  <b>Destination:</b>{" "}
                  {booking.destination}
                </p>

                <p>
                  <b>Emergency:</b>{" "}
                  {booking.emergencyType}
                </p>

                <p>
                  <b>Ambulance Type:</b>{" "}
                  {booking.ambulanceType}
                </p>

                <p>
                  <b>Mobile:</b>{" "}
                  {booking.mobile}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={
                      booking.status === "Approved"
                        ? "text-green-600 font-bold"
                        : booking.status === "Cancelled"
                        ? "text-red-600 font-bold"
                        : booking.status === "Completed"
                        ? "text-blue-600 font-bold"
                        : "text-yellow-600 font-bold"
                    }
                  >
                    {booking.status}
                  </span>
                </p>

              </div>

              {/* Ambulance Information */}
              {booking.ambulance ? (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5">

                  <h2 className="text-xl font-bold text-green-700 mb-4">
                    🚑 Ambulance Assigned
                  </h2>

                  <div className="grid md:grid-cols-2 gap-3">

                    <p>
                      <b>Vehicle No:</b>{" "}
                      {booking.ambulance.vehicleNo}
                    </p>

                    <p>
                      <b>Driver:</b>{" "}
                      {booking.ambulance.driverName}
                    </p>

                    <p>
                      <b>Driver Mobile:</b>{" "}
                      {booking.ambulance.driverMobile}
                    </p>

                    <p>
                      <b>Ambulance Type:</b>{" "}
                      {booking.ambulance.type}
                    </p>

                    <p>
                      <b>Ambulance Status:</b>{" "}
                      <span className="text-red-600 font-semibold">
                        {booking.ambulance.status}
                      </span>
                    </p>

                  </div>

                </div>
              ) : (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

                  <p className="text-yellow-700 font-medium">
                    ⏳ Ambulance has not been assigned yet.
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
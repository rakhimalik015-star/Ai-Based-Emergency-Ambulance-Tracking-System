"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    recentBookings: [],
  });

  useEffect(() => {

    const getDashboard = async () => {

      try {

        const res = await fetch("/api/admin/dashboard");

        const data = await res.json();

        if (data.success) {
          setStats({
            totalPatients: data.totalPatients,
            totalBookings: data.totalBookings,
            pendingBookings: data.pendingBookings,
            approvedBookings: data.approvedBookings,
            completedBookings: data.completedBookings,
            cancelledBookings: data.cancelledBookings,
            recentBookings: data.recentBookings,
          });
        }

      } catch (error) {
        console.log(error);
      }

    };

    getDashboard();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-red-600 text-white p-5">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>
      </div>

      <div className="p-8">

        <h2 className="text-2xl font-semibold mb-6">
          Welcome Admin 👋
        </h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Total Patients</h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalPatients}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Total Bookings</h2>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalBookings}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Pending Bookings</h2>
            <p className="text-3xl font-bold text-orange-600">
              {stats.pendingBookings}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Completed Bookings</h2>
            <p className="text-3xl font-bold text-purple-600">
              {stats.completedBookings}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Approved Bookings</h2>
            <p className="text-3xl font-bold text-green-600">
              {stats.approvedBookings}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Cancelled Bookings</h2>
            <p className="text-3xl font-bold text-red-600">
              {stats.cancelledBookings}
            </p>
          </div>

        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link
            href="/admin/patients"
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">
              👨‍⚕️ Manage Patients
            </h3>

            <p className="mt-2 text-gray-600">
              View all registered patients.
            </p>
          </Link>

          <Link
            href="/admin/bookings"
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">
              🚑 Manage Bookings
            </h3>

            <p className="mt-2 text-gray-600">
              View and update ambulance bookings.
            </p>
          </Link>

          <Link
            href="/admin/ambulances"
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">
              🚑 Ambulances
            </h3>

            <p className="mt-2 text-gray-600">
              Manage ambulance details.
            </p>
          </Link>

        </div>


        <div className="mt-10 bg-white rounded-lg shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Recent Bookings
          </h2>

          <table className="w-full border-collapse">

            <thead className="bg-red-600 text-white">

              <tr>
                <th className="p-3">Patient</th>
                <th className="p-3">Pickup</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Status</th>
              </tr>

            </thead>

            <tbody>

              {stats.recentBookings.map((booking: any) => (

                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="p-3">
                    {booking.patient.name}
                  </td>

                  <td className="p-3">
                    {booking.pickupLocation}
                  </td>

                  <td className="p-3">
                    {booking.destination}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${booking.status === "Approved"
                          ? "bg-green-500"
                          : booking.status === "Pending"
                            ? "bg-yellow-500"
                            : booking.status === "Cancelled"
                              ? "bg-red-500"
                              : "bg-blue-500"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
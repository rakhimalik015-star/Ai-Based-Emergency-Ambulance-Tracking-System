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

  patient: {
    name: string;
    mobile: string;
  };

  ambulance?: {
    id: string;
    vehicleNo: string;
    driverName: string;
    driverMobile: string;
    type: string;
    status: string;
  };
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  const [selectedAmbulance, setSelectedAmbulance] = useState<{
    [bookingId: string]: string;
  }>({});

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredBookings = bookings.filter((booking) =>
    booking.patient.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Get bookings + available ambulances
  useEffect(() => {
    const getData = async () => {
      try {
        const [bookingRes, ambulanceRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/ambulances/available"),
        ]);

        const bookingData = await bookingRes.json();
        const ambulanceData = await ambulanceRes.json();

        if (bookingData.success) {
          setBookings(bookingData.bookings);
        } else {
          alert(bookingData.message);
        }

        if (ambulanceData.success) {
          setAmbulances(ambulanceData.ambulances);
        } else {
          alert(ambulanceData.message);
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Update booking status
  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      const res = await fetch(
        `/api/admin/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id
              ? { ...booking, status }
              : booking
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // Assign ambulance
  const assignAmbulance = async (
    bookingId: string
  ) => {
    const ambulanceId =
      selectedAmbulance[bookingId];

    if (!ambulanceId) {
      alert("Please select an ambulance");
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/bookings/${bookingId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ambulanceId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(
          "Ambulance assigned successfully"
        );

        // Update booking status
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: "Approved",
                  ambulance: data.booking.ambulance,
                }
              : booking
          )
        );

        // Remove assigned ambulance from available list
        setAmbulances((prev) =>
          prev.filter(
            (ambulance) =>
              ambulance.id !== ambulanceId
          )
        );

        // Clear selected ambulance
        setSelectedAmbulance((prev) => ({
          ...prev,
          [bookingId]: "",
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-2xl">
        Loading Bookings...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        🚑 Manage Bookings
      </h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Patient Name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-lg w-full md:w-96"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full border-collapse">

          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3">
                Patient
              </th>

              <th className="p-3">
                Pickup
              </th>

              <th className="p-3">
                Destination
              </th>

              <th className="p-3">
                Emergency
              </th>

              <th className="p-3">
                Ambulance Type
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Assign Ambulance
              </th>

              <th className="p-3">
                Booked On
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredBookings.map(
              (booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-100"
                >

                  {/* Patient */}
                  <td className="p-3">
                    <div className="font-semibold">
                      {booking.patient.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {booking.patient.mobile}
                    </div>
                  </td>

                  {/* Pickup */}
                  <td className="p-3">
                    {booking.pickupLocation}
                  </td>

                  {/* Destination */}
                  <td className="p-3">
                    {booking.destination}
                  </td>

                  {/* Emergency */}
                  <td className="p-3">
                    {booking.emergencyType}
                  </td>

                  {/* Ambulance Type */}
                  <td className="p-3">
                    {booking.ambulanceType}
                  </td>

                  {/* Status */}
                  <td className="p-3">

                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(
                          booking.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                  </td>

                  {/* Assign Ambulance */}
                  <td className="p-3">

                    {booking.ambulance ? (

                      <div className="text-sm">

                        <div className="font-semibold text-green-600">
                          🚑{" "}
                          {booking.ambulance.vehicleNo}
                        </div>

                        <div>
                          {
                            booking.ambulance
                              .driverName
                          }
                        </div>

                      </div>

                    ) : booking.status ===
                      "Pending" ? (

                      <div className="flex flex-col gap-2 min-w-[190px]">

                        <select
                          value={
                            selectedAmbulance[
                              booking.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setSelectedAmbulance(
                              (prev) => ({
                                ...prev,
                                [booking.id]:
                                  e.target.value,
                              })
                            )
                          }
                          className="border rounded px-2 py-2"
                        >

                          <option value="">
                            Select Ambulance
                          </option>

                          {ambulances.map(
                            (ambulance) => (
                              <option
                                key={ambulance.id}
                                value={ambulance.id}
                              >
                                {
                                  ambulance.vehicleNo
                                }{" "}
                                -{" "}
                                {
                                  ambulance.driverName
                                }
                              </option>
                            )
                          )}

                        </select>

                        <button
                          onClick={() =>
                            assignAmbulance(
                              booking.id
                            )
                          }
                          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                        >
                          Assign
                        </button>

                      </div>

                    ) : (

                      <span className="text-gray-500">
                        Not Assigned
                      </span>

                    )}

                  </td>

                  {/* Date */}
                  <td className="p-3">
                    {new Date(
                      booking.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
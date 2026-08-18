"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.patient.name.toLowerCase().includes(value) ||
        booking.patient.mobile.toLowerCase().includes(value) ||
        booking.pickupLocation.toLowerCase().includes(value) ||
        booking.destination.toLowerCase().includes(value) ||
        booking.emergencyType.toLowerCase().includes(value)
      );
    });
  }, [bookings, search]);

  // =========================================================
  // GET BOOKINGS + AVAILABLE AMBULANCES
  // =========================================================

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
          setBookings(bookingData.bookings || []);
        } else {
          alert(bookingData.message);
        }

        if (ambulanceData.success) {
          setAmbulances(ambulanceData.ambulances || []);
        } else {
          alert(ambulanceData.message);
        }
      } catch (error) {
        console.error("BOOKING FETCH ERROR:", error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

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
      console.error("UPDATE STATUS ERROR:", error);
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // ASSIGN AMBULANCE
  // =========================================================

  const assignAmbulance = async (bookingId: string) => {
    const ambulanceId = selectedAmbulance[bookingId];

    if (!ambulanceId) {
      alert("Please select an ambulance");
      return;
    }

    try {
      setAssigningId(bookingId);

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
        alert("Ambulance assigned successfully");

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

        setAmbulances((prev) =>
          prev.filter(
            (ambulance) => ambulance.id !== ambulanceId
          )
        );

        setSelectedAmbulance((prev) => ({
          ...prev,
          [bookingId]: "",
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("ASSIGN AMBULANCE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setAssigningId(null);
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const pendingCount = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  const approvedCount = bookings.filter(
    (b) => b.status === "Approved"
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  const cancelledCount = bookings.filter(
    (b) => b.status === "Cancelled"
  ).length;

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300";

      case "Completed":
        return "border-lime-400/20 bg-lime-400/[0.06] text-lime-300";

      case "Cancelled":
        return "border-rose-400/20 bg-rose-400/[0.06] text-rose-300";

      case "Pending":
      default:
        return "border-amber-400/20 bg-amber-400/[0.06] text-amber-300";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A12]">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Loading emergency bookings...
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-slate-700">
            Emergency Operations Center
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200">

      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-lime-300" />

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-10">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2">

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              ADMIN / EMERGENCY OPERATIONS
            </span>

            <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
              Live Control
            </span>

          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Emergency

                <span className="ml-2 bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                  Bookings
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor emergency requests, update booking status and
                dispatch available ambulances to patients.
              </p>

            </div>

            {/* Live Indicator */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-lime-400/15 bg-lime-400/[0.03] px-5 py-3">

              <span className="relative flex h-3 w-3">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-40" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_10px_#A3E635]" />

              </span>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-lime-300">
                  Emergency System
                </p>

                <p className="mt-0.5 text-xs text-slate-600">
                  Operational
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-white/[0.06] bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Total Requests
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {bookings.length}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.05]">
                🚨
              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-amber-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-300">
                  {pendingCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.05]">
                ◷
              </div>

            </div>

          </div>

          {/* Approved */}

          <div className="rounded-2xl border border-cyan-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Dispatched
                </p>

                <p className="mt-2 text-2xl font-bold text-cyan-300">
                  {approvedCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
                🚑
              </div>

            </div>

          </div>

          {/* Completed */}

          <div className="rounded-2xl border border-lime-400/10 bg-[#0C111B] p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-lime-300">
                  {completedCount}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-lime-400/15 bg-lime-400/[0.05]">
                ✓
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH + AVAILABLE AMBULANCES
        ==================================================== */}

        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0C111B] p-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-xl">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-600">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search patient, mobile, pickup, destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/[0.07] bg-[#080C14] py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
              />

            </div>

            <div className="flex flex-wrap items-center gap-3">

              {/* Available ambulance */}

              <div className="flex items-center gap-2 rounded-xl border border-lime-400/10 bg-lime-400/[0.03] px-4 py-2.5">

                <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_8px_#A3E635]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Available Ambulances
                </span>

                <span className="text-sm font-bold text-lime-300">
                  {ambulances.length}
                </span>

              </div>

              {/* Search result */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">

                <span className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  Showing{" "}
                </span>

                <span className="text-xs font-semibold text-cyan-300">
                  {filteredBookings.length}
                </span>

              </div>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-white/[0.06] px-4 py-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            BOOKING TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C111B]">

          {/* Table Heading */}

          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="font-semibold text-white">
                  Emergency Booking Queue
                </h2>

                <span className="rounded-full border border-violet-400/10 bg-violet-400/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-violet-300">
                  Dispatch Center
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-600">
                Review requests and dispatch available emergency vehicles
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_#22D3EE]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
                Live Queue
              </span>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1500px]">

              <thead>

                <tr className="border-b border-white/[0.06] bg-[#090D15]">

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Route
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Emergency
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Vehicle Type
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Ambulance Dispatch
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                    Booked
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBookings.length > 0 ? (

                  filteredBookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >

                      {/* =========================================
                          PATIENT
                      ========================================== */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.05] text-sm font-bold text-violet-300">

                            {booking.patient.name
                              .charAt(0)
                              .toUpperCase()}

                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0C111B] bg-cyan-300" />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-200">
                              {booking.patient.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-600">
                              {booking.patient.mobile}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =========================================
                          ROUTE
                      ========================================== */}

                      <td className="px-5 py-5">

                        <div className="max-w-[260px]">

                          <div className="flex items-start gap-2">

                            <span className="mt-0.5 text-cyan-300">
                              ●
                            </span>

                            <p className="text-xs text-slate-400">
                              {booking.pickupLocation}
                            </p>

                          </div>

                          <div className="ml-[5px] h-3 border-l border-dashed border-slate-700" />

                          <div className="flex items-start gap-2">

                            <span className="mt-0.5 text-violet-300">
                              ◆
                            </span>

                            <p className="text-xs text-slate-400">
                              {booking.destination}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =========================================
                          EMERGENCY
                      ========================================== */}

                      <td className="px-5 py-5">

                        <div className="inline-flex items-center gap-2 rounded-xl border border-rose-400/10 bg-rose-400/[0.04] px-3 py-2">

                          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-400/10 text-[9px] text-rose-300">
                            !
                          </span>

                          <span className="text-xs font-semibold text-rose-300">
                            {booking.emergencyType}
                          </span>

                        </div>

                      </td>

                      {/* =========================================
                          AMBULANCE TYPE
                      ========================================== */}

                      <td className="px-5 py-5">

                        <span className="inline-flex rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs font-medium text-slate-400">
                          {booking.ambulanceType}
                        </span>

                      </td>

                      {/* =========================================
                          STATUS
                      ========================================== */}

                      <td className="px-5 py-5">

                        <div className="flex flex-col gap-2">

                          <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${getStatusStyle(
                              booking.status
                            )}`}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {booking.status}

                          </span>

                          <select
                            value={booking.status}
                            disabled={updatingId === booking.id}
                            onChange={(e) =>
                              updateStatus(
                                booking.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-white/[0.07] bg-[#080C14] px-2.5 py-2 text-[10px] text-slate-400 outline-none transition focus:border-cyan-400/30 disabled:opacity-50"
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

                        </div>

                      </td>

                      {/* =========================================
                          AMBULANCE DISPATCH
                      ========================================== */}

                      <td className="px-5 py-5">

                        {booking.ambulance ? (

                          <div className="min-w-[220px] rounded-xl border border-lime-400/15 bg-lime-400/[0.03] p-3">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime-400/15 bg-lime-400/[0.05]">
                                🚑
                              </div>

                              <div>

                                <p className="text-xs font-bold text-lime-300">
                                  {booking.ambulance.vehicleNo}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-500">
                                  {booking.ambulance.driverName}
                                </p>

                              </div>

                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-lime-400/[0.07] pt-2">

                              <span className="text-[8px] uppercase tracking-[0.14em] text-slate-700">
                                Driver
                              </span>

                              <span className="text-[10px] text-slate-500">
                                {booking.ambulance.driverMobile}
                              </span>

                            </div>

                          </div>

                        ) : booking.status === "Pending" ? (

                          <div className="flex min-w-[220px] flex-col gap-2">

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
                              className="rounded-xl border border-white/[0.07] bg-[#080C14] px-3 py-2.5 text-xs text-slate-400 outline-none transition focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/10"
                            >

                              <option value="">
                                Select available ambulance
                              </option>

                              {ambulances.map(
                                (ambulance) => (
                                  <option
                                    key={ambulance.id}
                                    value={ambulance.id}
                                  >
                                    {ambulance.vehicleNo} —{" "}
                                    {ambulance.driverName}
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
                              disabled={
                                assigningId ===
                                booking.id
                              }
                              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                              {assigningId ===
                              booking.id
                                ? "Dispatching..."
                                : "Dispatch Ambulance"}

                            </button>

                          </div>

                        ) : (

                          <span className="inline-flex rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-slate-700">
                            Not Assigned
                          </span>

                        )}

                      </td>

                      {/* =========================================
                          DATE
                      ========================================== */}

                      <td className="px-5 py-5">

                        <div>

                          <p className="text-xs font-medium text-slate-400">
                            {new Date(
                              booking.createdAt
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-slate-700">
                            {new Date(
                              booking.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-5 py-20 text-center"
                    >

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] text-2xl">
                        🚑
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-slate-400">
                        No Emergency Bookings Found
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-700">
                        {search
                          ? "No booking matches your current search."
                          : "There are currently no emergency booking requests."}
                      </p>

                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          Clear Search
                        </button>
                      )}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="flex flex-col justify-between gap-2 border-t border-white/[0.06] px-5 py-4 text-[9px] uppercase tracking-[0.12em] text-slate-700 sm:flex-row">

            <span>
              Ambulance AI • Emergency Dispatch Center
            </span>

            <span>
              Secure • Live Operations • {cancelledCount} Cancelled
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";

// interface Ambulance {
//   id: string;
//   vehicleNo: string;
//   driverName: string;
//   driverMobile: string;
//   type: string;
//   status: string;
// }

// interface Booking {
//   id: string;
//   pickupLocation: string;
//   destination: string;
//   emergencyType: string;
//   ambulanceType: string;
//   mobile: string;
//   status: string;
//   createdAt: string;

//   patient: {
//     name: string;
//     mobile: string;
//   };

//   ambulance?: {
//     id: string;
//     vehicleNo: string;
//     driverName: string;
//     driverMobile: string;
//     type: string;
//     status: string;
//   };
// }

// export default function ManageBookings() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

//   const [selectedAmbulance, setSelectedAmbulance] = useState<{
//     [bookingId: string]: string;
//   }>({});

//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const filteredBookings = bookings.filter((booking) =>
//     booking.patient.name
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   // Get bookings + available ambulances
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const [bookingRes, ambulanceRes] = await Promise.all([
//           fetch("/api/admin/bookings"),
//           fetch("/api/admin/ambulances/available"),
//         ]);

//         const bookingData = await bookingRes.json();
//         const ambulanceData = await ambulanceRes.json();

//         if (bookingData.success) {
//           setBookings(bookingData.bookings);
//         } else {
//           alert(bookingData.message);
//         }

//         if (ambulanceData.success) {
//           setAmbulances(ambulanceData.ambulances);
//         } else {
//           alert(ambulanceData.message);
//         }
//       } catch (error) {
//         console.log(error);
//         alert("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();
//   }, []);

//   // Update booking status
//   const updateStatus = async (
//     id: string,
//     status: string
//   ) => {
//     try {
//       const res = await fetch(
//         `/api/admin/bookings/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setBookings((prev) =>
//           prev.map((booking) =>
//             booking.id === id
//               ? { ...booking, status }
//               : booking
//           )
//         );
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Something went wrong");
//     }
//   };

//   // Assign ambulance
//   const assignAmbulance = async (
//     bookingId: string
//   ) => {
//     const ambulanceId =
//       selectedAmbulance[bookingId];

//     if (!ambulanceId) {
//       alert("Please select an ambulance");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `/api/admin/bookings/${bookingId}/assign`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ambulanceId,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         alert(
//           "Ambulance assigned successfully"
//         );

//         // Update booking status
//         setBookings((prev) =>
//           prev.map((booking) =>
//             booking.id === bookingId
//               ? {
//                   ...booking,
//                   status: "Approved",
//                   ambulance: data.booking.ambulance,
//                 }
//               : booking
//           )
//         );

//         // Remove assigned ambulance from available list
//         setAmbulances((prev) =>
//           prev.filter(
//             (ambulance) =>
//               ambulance.id !== ambulanceId
//           )
//         );

//         // Clear selected ambulance
//         setSelectedAmbulance((prev) => ({
//           ...prev,
//           [bookingId]: "",
//         }));
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Something went wrong");
//     }
//   };

//   if (loading) {
//     return (
//       <h1 className="text-center mt-10 text-2xl">
//         Loading Bookings...
//       </h1>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <h1 className="text-3xl font-bold mb-6">
//         🚑 Manage Bookings
//       </h1>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="🔍 Search by Patient Name..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           className="border p-3 rounded-lg w-full md:w-96"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto">

//         <table className="w-full border-collapse">

//           <thead className="bg-red-600 text-white">
//             <tr>
//               <th className="p-3">
//                 Patient
//               </th>

//               <th className="p-3">
//                 Pickup
//               </th>

//               <th className="p-3">
//                 Destination
//               </th>

//               <th className="p-3">
//                 Emergency
//               </th>

//               <th className="p-3">
//                 Ambulance Type
//               </th>

//               <th className="p-3">
//                 Status
//               </th>

//               <th className="p-3">
//                 Assign Ambulance
//               </th>

//               <th className="p-3">
//                 Booked On
//               </th>
//             </tr>
//           </thead>

//           <tbody>

//             {filteredBookings.map(
//               (booking) => (
//                 <tr
//                   key={booking.id}
//                   className="border-b hover:bg-gray-100"
//                 >

//                   {/* Patient */}
//                   <td className="p-3">
//                     <div className="font-semibold">
//                       {booking.patient.name}
//                     </div>

//                     <div className="text-sm text-gray-500">
//                       {booking.patient.mobile}
//                     </div>
//                   </td>

//                   {/* Pickup */}
//                   <td className="p-3">
//                     {booking.pickupLocation}
//                   </td>

//                   {/* Destination */}
//                   <td className="p-3">
//                     {booking.destination}
//                   </td>

//                   {/* Emergency */}
//                   <td className="p-3">
//                     {booking.emergencyType}
//                   </td>

//                   {/* Ambulance Type */}
//                   <td className="p-3">
//                     {booking.ambulanceType}
//                   </td>

//                   {/* Status */}
//                   <td className="p-3">

//                     <select
//                       value={booking.status}
//                       onChange={(e) =>
//                         updateStatus(
//                           booking.id,
//                           e.target.value
//                         )
//                       }
//                       className="border rounded px-2 py-1"
//                     >
//                       <option value="Pending">
//                         Pending
//                       </option>

//                       <option value="Approved">
//                         Approved
//                       </option>

//                       <option value="Completed">
//                         Completed
//                       </option>

//                       <option value="Cancelled">
//                         Cancelled
//                       </option>
//                     </select>

//                   </td>

//                   {/* Assign Ambulance */}
//                   <td className="p-3">

//                     {booking.ambulance ? (

//                       <div className="text-sm">

//                         <div className="font-semibold text-green-600">
//                           🚑{" "}
//                           {booking.ambulance.vehicleNo}
//                         </div>

//                         <div>
//                           {
//                             booking.ambulance
//                               .driverName
//                           }
//                         </div>

//                       </div>

//                     ) : booking.status ===
//                       "Pending" ? (

//                       <div className="flex flex-col gap-2 min-w-[190px]">

//                         <select
//                           value={
//                             selectedAmbulance[
//                               booking.id
//                             ] || ""
//                           }
//                           onChange={(e) =>
//                             setSelectedAmbulance(
//                               (prev) => ({
//                                 ...prev,
//                                 [booking.id]:
//                                   e.target.value,
//                               })
//                             )
//                           }
//                           className="border rounded px-2 py-2"
//                         >

//                           <option value="">
//                             Select Ambulance
//                           </option>

//                           {ambulances.map(
//                             (ambulance) => (
//                               <option
//                                 key={ambulance.id}
//                                 value={ambulance.id}
//                               >
//                                 {
//                                   ambulance.vehicleNo
//                                 }{" "}
//                                 -{" "}
//                                 {
//                                   ambulance.driverName
//                                 }
//                               </option>
//                             )
//                           )}

//                         </select>

//                         <button
//                           onClick={() =>
//                             assignAmbulance(
//                               booking.id
//                             )
//                           }
//                           className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
//                         >
//                           Assign
//                         </button>

//                       </div>

//                     ) : (

//                       <span className="text-gray-500">
//                         Not Assigned
//                       </span>

//                     )}

//                   </td>

//                   {/* Date */}
//                   <td className="p-3">
//                     {new Date(
//                       booking.createdAt
//                     ).toLocaleDateString()}
//                   </td>

//                 </tr>
//               )
//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }



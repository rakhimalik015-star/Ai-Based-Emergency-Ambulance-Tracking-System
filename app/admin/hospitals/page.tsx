"use client";

import { useEffect, useState } from "react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  bedsAvailable: number;
  icuAvailable: number;
  emergencySupport: boolean;
  trafficLevel: string;
  status: string;
}

const emptyForm = {
  name: "",
  address: "",
  city: "",
  latitude: "",
  longitude: "",
  bedsAvailable: "0",
  icuAvailable: "0",
  emergencySupport: true,
  trafficLevel: "Low",
  status: "Available",
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // ==========================================
  // GET HOSPITALS
  // ==========================================

  const getHospitals = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/hospitals", {
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        setHospitals(result.hospitals);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.log("GET HOSPITALS ERROR:", error);
      setMessage("Unable to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHospitals();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const payload = {
        name: form.name,
        address: form.address,
        city: form.city,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        bedsAvailable: Number(form.bedsAvailable),
        icuAvailable: Number(form.icuAvailable),
        emergencySupport: form.emergencySupport,
        trafficLevel: form.trafficLevel,
        status: form.status,
      };

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            id: editingId,
            ...payload,
          }
        : payload;

      const res = await fetch(
        "/api/admin/hospitals",
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage(
        editingId
          ? "Hospital updated successfully"
          : "Hospital added successfully"
      );

      setForm(emptyForm);
      setEditingId(null);

      await getHospitals();
    } catch (error) {
      console.log("SAVE HOSPITAL ERROR:", error);
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (hospital: Hospital) => {
    setEditingId(hospital.id);

    setForm({
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      latitude: String(hospital.latitude),
      longitude: String(hospital.longitude),
      bedsAvailable: String(hospital.bedsAvailable),
      icuAvailable: String(hospital.icuAvailable),
      emergencySupport: hospital.emergencySupport,
      trafficLevel: hospital.trafficLevel,
      status: hospital.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hospital?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/hospitals?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      setMessage("Hospital deleted successfully");

      await getHospitals();
    } catch (error) {
      console.log("DELETE HOSPITAL ERROR:", error);
      alert("Unable to delete hospital");
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      hospital.city
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      hospital.address
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // STATS
  // ==========================================

  const availableHospitals = hospitals.filter(
    (hospital) => hospital.status === "Available"
  ).length;

  const emergencyHospitals = hospitals.filter(
    (hospital) => hospital.emergencySupport
  ).length;

  const totalBeds = hospitals.reduce(
    (sum, hospital) =>
      sum + hospital.bedsAvailable,
    0
  );

  const totalICU = hospitals.reduce(
    (sum, hospital) =>
      sum + hospital.icuAvailable,
    0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 p-5 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl ring-1 ring-cyan-400/20">
                🏥
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  AI Emergency Network
                </p>

                <p className="text-xs text-slate-500">
                  Hospital Infrastructure Control
                </p>
              </div>

            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Hospital Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Manage hospitals, emergency support,
              bed capacity, ICU availability and
              real-time traffic information.
            </p>

          </div>

          <div className="rounded-2xl border border-cyan-400/10 bg-[#0C1929] px-5 py-4 shadow-xl shadow-black/10">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Network Status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="font-semibold text-emerald-400">
                System Operational
              </span>

            </div>

          </div>

        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Hospitals */}

          <div className="rounded-2xl border border-white/5 bg-[#0C1929] p-5 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Hospitals
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {hospitals.length}
                </p>

              </div>

              <div className="rounded-xl bg-violet-400/10 px-3 py-2 text-xl">
                🏥
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Registered facilities
            </p>

          </div>

          {/* Available */}

          <div className="rounded-2xl border border-white/5 bg-[#0C1929] p-5 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Available
                </p>

                <p className="mt-3 text-3xl font-bold text-emerald-400">
                  {availableHospitals}
                </p>

              </div>

              <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xl">
                ✓
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Operational hospitals
            </p>

          </div>

          {/* Beds */}

          <div className="rounded-2xl border border-white/5 bg-[#0C1929] p-5 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Beds Available
                </p>

                <p className="mt-3 text-3xl font-bold text-cyan-400">
                  {totalBeds}
                </p>

              </div>

              <div className="rounded-xl bg-cyan-400/10 px-3 py-2 text-xl">
                🛏
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Across all facilities
            </p>

          </div>

          {/* ICU */}

          <div className="rounded-2xl border border-white/5 bg-[#0C1929] p-5 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  ICU Capacity
                </p>

                <p className="mt-3 text-3xl font-bold text-fuchsia-400">
                  {totalICU}
                </p>

              </div>

              <div className="rounded-xl bg-fuchsia-400/10 px-3 py-2 text-xl">
                ❤️
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              ICU beds available
            </p>

          </div>

        </div>

        {/* =====================================
            MESSAGE
        ====================================== */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4 text-sm text-cyan-300">

            <span className="text-lg">
              ℹ️
            </span>

            <span>{message}</span>

          </div>
        )}

        {/* =====================================
            FORM CARD
        ====================================== */}

        <div className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-[#0C1929] shadow-2xl shadow-black/20">

          <div className="border-b border-white/5 px-6 py-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Facility Configuration
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {editingId
                    ? "Edit Hospital"
                    : "Register Hospital"}
                </h2>

              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Cancel Editing
                </button>
              )}

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* Hospital Name */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hospital Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="City Hospital"
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* City */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  City
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Rohtak"
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* Address */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Address
                </label>

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Main Road, Rohtak, Haryana"
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* Latitude */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Latitude
                </label>

                <input
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={handleChange}
                  required
                  placeholder="29.2500"
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* Longitude */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Longitude
                </label>

                <input
                  name="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={handleChange}
                  required
                  placeholder="76.4500"
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* Beds */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Beds Available
                </label>

                <input
                  name="bedsAvailable"
                  type="number"
                  min="0"
                  value={form.bedsAvailable}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* ICU */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  ICU Available
                </label>

                <input
                  name="icuAvailable"
                  type="number"
                  min="0"
                  value={form.icuAvailable}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* Traffic */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Traffic Level
                </label>

                <select
                  name="trafficLevel"
                  value={form.trafficLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hospital Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>
                </select>

              </div>

              {/* Emergency */}

              <div className="md:col-span-2">

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#07111F] p-4 transition hover:border-cyan-400/30">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/10 text-xl">
                      🚨
                    </div>

                    <div>

                      <p className="font-semibold">
                        Emergency Support
                      </p>

                      <p className="text-xs text-slate-500">
                        Hospital can receive emergency ambulance patients
                      </p>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={
                      form.emergencySupport
                    }
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        emergencySupport:
                          e.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-cyan-400"
                  />

                </label>

              </div>

              {/* Submit */}

              <div className="md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 font-bold text-[#06101C] shadow-lg shadow-cyan-400/10 transition hover:scale-[1.01] hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving Hospital..."
                    : editingId
                    ? "Update Hospital"
                    : "Register Hospital"}
                </button>

              </div>

            </div>

          </form>

        </div>

        {/* =====================================
            HOSPITAL LIST
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0C1929] shadow-2xl shadow-black/20">

          {/* List Header */}

          <div className="border-b border-white/5 p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                  Healthcare Network
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Registered Hospitals
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {hospitals.length} facilities registered
                  • {emergencyHospitals} emergency enabled
                </p>

              </div>

              {/* Search */}

              <div className="relative w-full lg:w-80">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Search hospital or city..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#07111F] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                />

              </div>

            </div>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="flex flex-col items-center justify-center px-6 py-16">

              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

              <p className="mt-4 text-sm text-slate-500">
                Loading hospital network...
              </p>

            </div>

          ) : filteredHospitals.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                🏥
              </div>

              <h3 className="mt-4 font-bold">
                No hospitals found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try another search."
                  : "Register your first hospital above."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>

                  <tr className="border-b border-white/5 bg-white/[0.02]">

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Hospital
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Capacity
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Traffic
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Emergency
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredHospitals.map(
                    (hospital) => (

                      <tr
                        key={hospital.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >

                        {/* Hospital */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                              🏥
                            </div>

                            <div>

                              <p className="font-bold text-slate-100">
                                {hospital.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {hospital.city}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Location */}

                        <td className="px-5 py-5">

                          <p className="max-w-[230px] truncate text-sm text-slate-300">
                            {hospital.address}
                          </p>

                          <p className="mt-1 font-mono text-[11px] text-slate-600">
                            {hospital.latitude},{" "}
                            {hospital.longitude}
                          </p>

                        </td>

                        {/* Capacity */}

                        <td className="px-5 py-5">

                          <div className="flex gap-2">

                            <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">

                              <p className="text-[10px] uppercase text-slate-500">
                                Beds
                              </p>

                              <p className="mt-1 font-bold text-cyan-400">
                                {hospital.bedsAvailable}
                              </p>

                            </div>

                            <div className="rounded-lg border border-fuchsia-400/10 bg-fuchsia-400/5 px-3 py-2">

                              <p className="text-[10px] uppercase text-slate-500">
                                ICU
                              </p>

                              <p className="mt-1 font-bold text-fuchsia-400">
                                {hospital.icuAvailable}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Traffic */}

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                              hospital.trafficLevel ===
                              "Low"
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                : hospital.trafficLevel ===
                                  "Medium"
                                ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                                : "border-rose-400/20 bg-rose-400/10 text-rose-400"
                            }`}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {hospital.trafficLevel}

                          </span>

                        </td>

                        {/* Emergency */}

                        <td className="px-5 py-5">

                          {hospital.emergencySupport ? (

                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              Active
                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-400/10 bg-slate-400/5 px-3 py-1.5 text-xs font-bold text-slate-500">
                              Disabled
                            </span>

                          )}

                        </td>

                        {/* Status */}

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
                              hospital.status ===
                              "Available"
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                : "border-rose-400/20 bg-rose-400/10 text-rose-400"
                            }`}
                          >
                            {hospital.status}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-5">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleEdit(
                                  hospital
                                )
                              }
                              className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-300 transition hover:bg-violet-400/20"
                            >
                              ✏ Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  hospital.id
                                )
                              }
                              className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-400/20"
                            >
                              🗑 Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* FOOTER */}

        <div className="mt-6 flex flex-col gap-2 border-t border-white/5 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Ambulance AI • Hospital Network Management
          </p>

          <p>
            Emergency Support:{" "}
            <span className="text-emerald-400">
              {emergencyHospitals}
            </span>{" "}
            facilities active
          </p>

        </div>

      </div>

    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";

// interface Hospital {
//     id: string;
//     name: string;
//     address: string;
//     city: string;
//     latitude: number;
//     longitude: number;
//     bedsAvailable: number;
//     icuAvailable: number;
//     emergencySupport: boolean;
//     trafficLevel: string;
//     status: string;
// }

// const emptyForm = {
//     name: "",
//     address: "",
//     city: "",
//     latitude: "",
//     longitude: "",
//     bedsAvailable: "0",
//     icuAvailable: "0",
//     emergencySupport: true,
//     trafficLevel: "Low",
//     status: "Available",
// };

// export default function HospitalsPage() {
//     const [hospitals, setHospitals] =
//         useState<Hospital[]>([]);

//     const [form, setForm] =
//         useState(emptyForm);

//     const [editingId, setEditingId] =
//         useState<string | null>(null);

//     const [loading, setLoading] =
//         useState(true);

//     const [saving, setSaving] =
//         useState(false);

//     const [message, setMessage] =
//         useState("");

//     // ==========================================
//     // GET HOSPITALS
//     // ==========================================

//     const getHospitals = async () => {
//         try {
//             setLoading(true);

//             const res = await fetch(
//                 "/api/admin/hospitals",
//                 {
//                     cache: "no-store",
//                 }
//             );

//             const result = await res.json();

//             if (result.success) {
//                 setHospitals(
//                     result.hospitals
//                 );
//             } else {
//                 setMessage(
//                     result.message
//                 );
//             }

//         } catch (error) {
//             console.log(
//                 "GET HOSPITALS ERROR:",
//                 error
//             );

//             setMessage(
//                 "Unable to load hospitals"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getHospitals();
//     }, []);

//     // ==========================================
//     // FORM CHANGE
//     // ==========================================

//     const handleChange = (
//         e: React.ChangeEvent<
//             HTMLInputElement | HTMLSelectElement
//         >
//     ) => {
//         const { name, value } =
//             e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // ==========================================
//     // ADD / UPDATE
//     // ==========================================

//     const handleSubmit = async (
//         e: React.FormEvent
//     ) => {
//         e.preventDefault();

//         try {
//             setSaving(true);
//             setMessage("");

//             const payload = {
//                 name: form.name,
//                 address: form.address,
//                 city: form.city,
//                 latitude:
//                     Number(form.latitude),
//                 longitude:
//                     Number(form.longitude),
//                 bedsAvailable:
//                     Number(
//                         form.bedsAvailable
//                     ),
//                 icuAvailable:
//                     Number(
//                         form.icuAvailable
//                     ),
//                 emergencySupport:
//                     form.emergencySupport,
//                 trafficLevel:
//                     form.trafficLevel,
//                 status: form.status,
//             };

//             const url =
//                 "/api/admin/hospitals";

//             const method =
//                 editingId
//                     ? "PUT"
//                     : "POST";

//             const body = editingId
//                 ? {
//                       id: editingId,
//                       ...payload,
//                   }
//                 : payload;

//             const res = await fetch(
//                 url,
//                 {
//                     method,
//                     headers: {
//                         "Content-Type":
//                             "application/json",
//                     },
//                     body: JSON.stringify(
//                         body
//                     ),
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!result.success) {
//                 setMessage(
//                     result.message
//                 );
//                 return;
//             }

//             setMessage(
//                 editingId
//                     ? "Hospital updated successfully"
//                     : "Hospital added successfully"
//             );

//             setForm(emptyForm);
//             setEditingId(null);

//             await getHospitals();

//         } catch (error) {
//             console.log(
//                 "SAVE HOSPITAL ERROR:",
//                 error
//             );

//             setMessage(
//                 "Something went wrong"
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ==========================================
//     // EDIT
//     // ==========================================

//     const handleEdit = (
//         hospital: Hospital
//     ) => {
//         setEditingId(
//             hospital.id
//         );

//         setForm({
//             name: hospital.name,
//             address:
//                 hospital.address,
//             city: hospital.city,
//             latitude:
//                 String(
//                     hospital.latitude
//                 ),
//             longitude:
//                 String(
//                     hospital.longitude
//                 ),
//             bedsAvailable:
//                 String(
//                     hospital.bedsAvailable
//                 ),
//             icuAvailable:
//                 String(
//                     hospital.icuAvailable
//                 ),
//             emergencySupport:
//                 hospital.emergencySupport,
//             trafficLevel:
//                 hospital.trafficLevel,
//             status:
//                 hospital.status,
//         });

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };

//     // ==========================================
//     // DELETE
//     // ==========================================

//     const handleDelete = async (
//         id: string
//     ) => {
//         const confirmed =
//             window.confirm(
//                 "Are you sure you want to delete this hospital?"
//             );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             const res = await fetch(
//                 `/api/admin/hospitals?id=${id}`,
//                 {
//                     method: "DELETE",
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!result.success) {
//                 alert(
//                     result.message
//                 );
//                 return;
//             }

//             setMessage(
//                 "Hospital deleted successfully"
//             );

//             await getHospitals();

//         } catch (error) {
//             console.log(
//                 "DELETE HOSPITAL ERROR:",
//                 error
//             );

//             alert(
//                 "Unable to delete hospital"
//             );
//         }
//     };

//     // ==========================================
//     // CANCEL EDIT
//     // ==========================================

//     const cancelEdit = () => {
//         setEditingId(null);
//         setForm(emptyForm);
//         setMessage("");
//     };

//     // ==========================================
//     // UI
//     // ==========================================

//     return (
//         <div className="min-h-screen bg-gray-100 p-6 md:p-8">

//             <div className="max-w-7xl mx-auto">

//                 {/* HEADER */}

//                 <div className="mb-8">

//                     <h1 className="text-3xl font-bold">
//                         🏥 Hospital Management
//                     </h1>

//                     <p className="text-gray-500 mt-2">
//                         Manage hospitals, beds,
//                         ICU availability and traffic.
//                     </p>

//                 </div>

//                 {/* MESSAGE */}

//                 {message && (
//                     <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4">
//                         {message}
//                     </div>
//                 )}

//                 {/* FORM */}

//                 <div className="bg-white rounded-xl shadow p-6 mb-8">

//                     <div className="flex justify-between items-center mb-6">

//                         <h2 className="text-2xl font-bold">
//                             {editingId
//                                 ? "✏️ Edit Hospital"
//                                 : "➕ Add Hospital"}
//                         </h2>

//                         {editingId && (
//                             <button
//                                 onClick={
//                                     cancelEdit
//                                 }
//                                 className="text-gray-600 hover:text-red-600 font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                         )}

//                     </div>

//                     <form
//                         onSubmit={
//                             handleSubmit
//                         }
//                         className="grid md:grid-cols-2 gap-5"
//                     >

//                         {/* NAME */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Hospital Name
//                             </label>

//                             <input
//                                 name="name"
//                                 value={
//                                     form.name
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                                 className="w-full border rounded-lg px-4 py-3"
//                                 placeholder="City Hospital"
//                             />
//                         </div>

//                         {/* CITY */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 City
//                             </label>

//                             <input
//                                 name="city"
//                                 value={
//                                     form.city
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                                 className="w-full border rounded-lg px-4 py-3"
//                                 placeholder="Rohtak"
//                             />
//                         </div>

//                         {/* ADDRESS */}

//                         <div className="md:col-span-2">
//                             <label className="block font-semibold mb-2">
//                                 Address
//                             </label>

//                             <input
//                                 name="address"
//                                 value={
//                                     form.address
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                                 className="w-full border rounded-lg px-4 py-3"
//                                 placeholder="Main Road, Rohtak, Haryana"
//                             />
//                         </div>

//                         {/* LATITUDE */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Latitude
//                             </label>

//                             <input
//                                 name="latitude"
//                                 type="number"
//                                 step="any"
//                                 value={
//                                     form.latitude
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                                 className="w-full border rounded-lg px-4 py-3"
//                                 placeholder="29.2500"
//                             />
//                         </div>

//                         {/* LONGITUDE */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Longitude
//                             </label>

//                             <input
//                                 name="longitude"
//                                 type="number"
//                                 step="any"
//                                 value={
//                                     form.longitude
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 required
//                                 className="w-full border rounded-lg px-4 py-3"
//                                 placeholder="76.4500"
//                             />
//                         </div>

//                         {/* BEDS */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Beds Available
//                             </label>

//                             <input
//                                 name="bedsAvailable"
//                                 type="number"
//                                 min="0"
//                                 value={
//                                     form.bedsAvailable
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 className="w-full border rounded-lg px-4 py-3"
//                             />
//                         </div>

//                         {/* ICU */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 ICU Available
//                             </label>

//                             <input
//                                 name="icuAvailable"
//                                 type="number"
//                                 min="0"
//                                 value={
//                                     form.icuAvailable
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 className="w-full border rounded-lg px-4 py-3"
//                             />
//                         </div>

//                         {/* TRAFFIC */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Traffic Level
//                             </label>

//                             <select
//                                 name="trafficLevel"
//                                 value={
//                                     form.trafficLevel
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 className="w-full border rounded-lg px-4 py-3"
//                             >
//                                 <option value="Low">
//                                     Low
//                                 </option>

//                                 <option value="Medium">
//                                     Medium
//                                 </option>

//                                 <option value="High">
//                                     High
//                                 </option>
//                             </select>
//                         </div>

//                         {/* STATUS */}

//                         <div>
//                             <label className="block font-semibold mb-2">
//                                 Hospital Status
//                             </label>

//                             <select
//                                 name="status"
//                                 value={
//                                     form.status
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                                 className="w-full border rounded-lg px-4 py-3"
//                             >
//                                 <option value="Available">
//                                     Available
//                                 </option>

//                                 <option value="Unavailable">
//                                     Unavailable
//                                 </option>
//                             </select>
//                         </div>

//                         {/* EMERGENCY */}

//                         <div className="md:col-span-2">

//                             <label className="flex items-center gap-3 cursor-pointer">

//                                 <input
//                                     type="checkbox"
//                                     checked={
//                                         form.emergencySupport
//                                     }
//                                     onChange={(
//                                         e
//                                     ) =>
//                                         setForm(
//                                             (
//                                                 prev
//                                             ) => ({
//                                                 ...prev,
//                                                 emergencySupport:
//                                                     e
//                                                         .target
//                                                         .checked,
//                                             })
//                                         )
//                                     }
//                                     className="w-5 h-5"
//                                 />

//                                 <span className="font-semibold">
//                                     🚨 Emergency Support Available
//                                 </span>

//                             </label>

//                         </div>

//                         {/* SUBMIT */}

//                         <div className="md:col-span-2">

//                             <button
//                                 type="submit"
//                                 disabled={
//                                     saving
//                                 }
//                                 className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
//                             >
//                                 {saving
//                                     ? "Saving..."
//                                     : editingId
//                                     ? "Update Hospital"
//                                     : "Add Hospital"}
//                             </button>

//                         </div>

//                     </form>

//                 </div>

//                 {/* HOSPITAL LIST */}

//                 <div className="bg-white rounded-xl shadow overflow-hidden">

//                     <div className="p-6 border-b">

//                         <h2 className="text-2xl font-bold">
//                             🏥 Hospital List
//                         </h2>

//                     </div>

//                     {loading ? (

//                         <div className="p-8 text-center">
//                             Loading hospitals...
//                         </div>

//                     ) : hospitals.length === 0 ? (

//                         <div className="p-8 text-center text-gray-500">
//                             No hospitals found.
//                             Add your first hospital above.
//                         </div>

//                     ) : (

//                         <div className="overflow-x-auto">

//                             <table className="w-full">

//                                 <thead className="bg-gray-100">

//                                     <tr>

//                                         <th className="text-left p-4">
//                                             Hospital
//                                         </th>

//                                         <th className="text-left p-4">
//                                             Location
//                                         </th>

//                                         <th className="text-left p-4">
//                                             Beds
//                                         </th>

//                                         <th className="text-left p-4">
//                                             ICU
//                                         </th>

//                                         <th className="text-left p-4">
//                                             Traffic
//                                         </th>

//                                         <th className="text-left p-4">
//                                             Status
//                                         </th>

//                                         <th className="text-left p-4">
//                                             Actions
//                                         </th>

//                                     </tr>

//                                 </thead>

//                                 <tbody>

//                                     {hospitals.map(
//                                         (
//                                             hospital
//                                         ) => (

//                                             <tr
//                                                 key={
//                                                     hospital.id
//                                                 }
//                                                 className="border-t"
//                                             >

//                                                 <td className="p-4">

//                                                     <p className="font-bold">
//                                                         🏥{" "}
//                                                         {
//                                                             hospital.name
//                                                         }
//                                                     </p>

//                                                     <p className="text-sm text-gray-500">
//                                                         {
//                                                             hospital.city
//                                                         }
//                                                     </p>

//                                                 </td>

//                                                 <td className="p-4">

//                                                     <p className="text-sm">
//                                                         📍{" "}
//                                                         {
//                                                             hospital.latitude
//                                                         }
//                                                         ,{" "}
//                                                         {
//                                                             hospital.longitude
//                                                         }
//                                                     </p>

//                                                 </td>

//                                                 <td className="p-4 font-semibold">
//                                                     🛏️{" "}
//                                                     {
//                                                         hospital.bedsAvailable
//                                                     }
//                                                 </td>

//                                                 <td className="p-4 font-semibold">
//                                                     🏥{" "}
//                                                     {
//                                                         hospital.icuAvailable
//                                                     }
//                                                 </td>

//                                                 <td className="p-4">

//                                                     <span
//                                                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                                                             hospital.trafficLevel ===
//                                                             "Low"
//                                                                 ? "bg-green-100 text-green-700"
//                                                                 : hospital.trafficLevel ===
//                                                                   "Medium"
//                                                                 ? "bg-yellow-100 text-yellow-700"
//                                                                 : "bg-red-100 text-red-700"
//                                                         }`}
//                                                     >
//                                                         🚦{" "}
//                                                         {
//                                                             hospital.trafficLevel
//                                                         }
//                                                     </span>

//                                                 </td>

//                                                 <td className="p-4">

//                                                     <span
//                                                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                                                             hospital.status ===
//                                                             "Available"
//                                                                 ? "bg-green-100 text-green-700"
//                                                                 : "bg-red-100 text-red-700"
//                                                         }`}
//                                                     >
//                                                         {
//                                                             hospital.status
//                                                         }
//                                                     </span>

//                                                 </td>

//                                                 <td className="p-4">

//                                                     <div className="flex gap-2">

//                                                         <button
//                                                             onClick={() =>
//                                                                 handleEdit(
//                                                                     hospital
//                                                                 )
//                                                             }
//                                                             className="bg-yellow-500 text-white px-3 py-2 rounded-lg font-semibold"
//                                                         >
//                                                             Edit
//                                                         </button>

//                                                         <button
//                                                             onClick={() =>
//                                                                 handleDelete(
//                                                                     hospital.id
//                                                                 )
//                                                             }
//                                                             className="bg-red-600 text-white px-3 py-2 rounded-lg font-semibold"
//                                                         >
//                                                             Delete
//                                                         </button>

//                                                     </div>

//                                                 </td>

//                                             </tr>

//                                         )
//                                     )}

//                                 </tbody>

//                             </table>

//                         </div>

//                     )}

//                 </div>

//             </div>

//         </div>
//     );
// }
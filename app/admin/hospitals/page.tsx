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
    const [hospitals, setHospitals] =
        useState<Hospital[]>([]);

    const [form, setForm] =
        useState(emptyForm);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    // ==========================================
    // GET HOSPITALS
    // ==========================================

    const getHospitals = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                "/api/admin/hospitals",
                {
                    cache: "no-store",
                }
            );

            const result = await res.json();

            if (result.success) {
                setHospitals(
                    result.hospitals
                );
            } else {
                setMessage(
                    result.message
                );
            }

        } catch (error) {
            console.log(
                "GET HOSPITALS ERROR:",
                error
            );

            setMessage(
                "Unable to load hospitals"
            );
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
        const { name, value } =
            e.target;

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
                latitude:
                    Number(form.latitude),
                longitude:
                    Number(form.longitude),
                bedsAvailable:
                    Number(
                        form.bedsAvailable
                    ),
                icuAvailable:
                    Number(
                        form.icuAvailable
                    ),
                emergencySupport:
                    form.emergencySupport,
                trafficLevel:
                    form.trafficLevel,
                status: form.status,
            };

            const url =
                "/api/admin/hospitals";

            const method =
                editingId
                    ? "PUT"
                    : "POST";

            const body = editingId
                ? {
                      id: editingId,
                      ...payload,
                  }
                : payload;

            const res = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        body
                    ),
                }
            );

            const result =
                await res.json();

            if (!result.success) {
                setMessage(
                    result.message
                );
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
            console.log(
                "SAVE HOSPITAL ERROR:",
                error
            );

            setMessage(
                "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (
        hospital: Hospital
    ) => {
        setEditingId(
            hospital.id
        );

        setForm({
            name: hospital.name,
            address:
                hospital.address,
            city: hospital.city,
            latitude:
                String(
                    hospital.latitude
                ),
            longitude:
                String(
                    hospital.longitude
                ),
            bedsAvailable:
                String(
                    hospital.bedsAvailable
                ),
            icuAvailable:
                String(
                    hospital.icuAvailable
                ),
            emergencySupport:
                hospital.emergencySupport,
            trafficLevel:
                hospital.trafficLevel,
            status:
                hospital.status,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (
        id: string
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this hospital?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const res = await fetch(
                `/api/admin/hospitals?id=${id}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await res.json();

            if (!result.success) {
                alert(
                    result.message
                );
                return;
            }

            setMessage(
                "Hospital deleted successfully"
            );

            await getHospitals();

        } catch (error) {
            console.log(
                "DELETE HOSPITAL ERROR:",
                error
            );

            alert(
                "Unable to delete hospital"
            );
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
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        🏥 Hospital Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage hospitals, beds,
                        ICU availability and traffic.
                    </p>

                </div>

                {/* MESSAGE */}

                {message && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4">
                        {message}
                    </div>
                )}

                {/* FORM */}

                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-2xl font-bold">
                            {editingId
                                ? "✏️ Edit Hospital"
                                : "➕ Add Hospital"}
                        </h2>

                        {editingId && (
                            <button
                                onClick={
                                    cancelEdit
                                }
                                className="text-gray-600 hover:text-red-600 font-semibold"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="grid md:grid-cols-2 gap-5"
                    >

                        {/* NAME */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Hospital Name
                            </label>

                            <input
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-3"
                                placeholder="City Hospital"
                            />
                        </div>

                        {/* CITY */}

                        <div>
                            <label className="block font-semibold mb-2">
                                City
                            </label>

                            <input
                                name="city"
                                value={
                                    form.city
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-3"
                                placeholder="Rohtak"
                            />
                        </div>

                        {/* ADDRESS */}

                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-2">
                                Address
                            </label>

                            <input
                                name="address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-3"
                                placeholder="Main Road, Rohtak, Haryana"
                            />
                        </div>

                        {/* LATITUDE */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Latitude
                            </label>

                            <input
                                name="latitude"
                                type="number"
                                step="any"
                                value={
                                    form.latitude
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-3"
                                placeholder="29.2500"
                            />
                        </div>

                        {/* LONGITUDE */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Longitude
                            </label>

                            <input
                                name="longitude"
                                type="number"
                                step="any"
                                value={
                                    form.longitude
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-3"
                                placeholder="76.4500"
                            />
                        </div>

                        {/* BEDS */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Beds Available
                            </label>

                            <input
                                name="bedsAvailable"
                                type="number"
                                min="0"
                                value={
                                    form.bedsAvailable
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>

                        {/* ICU */}

                        <div>
                            <label className="block font-semibold mb-2">
                                ICU Available
                            </label>

                            <input
                                name="icuAvailable"
                                type="number"
                                min="0"
                                value={
                                    form.icuAvailable
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>

                        {/* TRAFFIC */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Traffic Level
                            </label>

                            <select
                                name="trafficLevel"
                                value={
                                    form.trafficLevel
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-lg px-4 py-3"
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

                        {/* STATUS */}

                        <div>
                            <label className="block font-semibold mb-2">
                                Hospital Status
                            </label>

                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            >
                                <option value="Available">
                                    Available
                                </option>

                                <option value="Unavailable">
                                    Unavailable
                                </option>
                            </select>
                        </div>

                        {/* EMERGENCY */}

                        <div className="md:col-span-2">

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={
                                        form.emergencySupport
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setForm(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,
                                                emergencySupport:
                                                    e
                                                        .target
                                                        .checked,
                                            })
                                        )
                                    }
                                    className="w-5 h-5"
                                />

                                <span className="font-semibold">
                                    🚨 Emergency Support Available
                                </span>

                            </label>

                        </div>

                        {/* SUBMIT */}

                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                disabled={
                                    saving
                                }
                                className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Hospital"
                                    : "Add Hospital"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* HOSPITAL LIST */}

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <div className="p-6 border-b">

                        <h2 className="text-2xl font-bold">
                            🏥 Hospital List
                        </h2>

                    </div>

                    {loading ? (

                        <div className="p-8 text-center">
                            Loading hospitals...
                        </div>

                    ) : hospitals.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No hospitals found.
                            Add your first hospital above.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-100">

                                    <tr>

                                        <th className="text-left p-4">
                                            Hospital
                                        </th>

                                        <th className="text-left p-4">
                                            Location
                                        </th>

                                        <th className="text-left p-4">
                                            Beds
                                        </th>

                                        <th className="text-left p-4">
                                            ICU
                                        </th>

                                        <th className="text-left p-4">
                                            Traffic
                                        </th>

                                        <th className="text-left p-4">
                                            Status
                                        </th>

                                        <th className="text-left p-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {hospitals.map(
                                        (
                                            hospital
                                        ) => (

                                            <tr
                                                key={
                                                    hospital.id
                                                }
                                                className="border-t"
                                            >

                                                <td className="p-4">

                                                    <p className="font-bold">
                                                        🏥{" "}
                                                        {
                                                            hospital.name
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            hospital.city
                                                        }
                                                    </p>

                                                </td>

                                                <td className="p-4">

                                                    <p className="text-sm">
                                                        📍{" "}
                                                        {
                                                            hospital.latitude
                                                        }
                                                        ,{" "}
                                                        {
                                                            hospital.longitude
                                                        }
                                                    </p>

                                                </td>

                                                <td className="p-4 font-semibold">
                                                    🛏️{" "}
                                                    {
                                                        hospital.bedsAvailable
                                                    }
                                                </td>

                                                <td className="p-4 font-semibold">
                                                    🏥{" "}
                                                    {
                                                        hospital.icuAvailable
                                                    }
                                                </td>

                                                <td className="p-4">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                            hospital.trafficLevel ===
                                                            "Low"
                                                                ? "bg-green-100 text-green-700"
                                                                : hospital.trafficLevel ===
                                                                  "Medium"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        🚦{" "}
                                                        {
                                                            hospital.trafficLevel
                                                        }
                                                    </span>

                                                </td>

                                                <td className="p-4">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                            hospital.status ===
                                                            "Available"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {
                                                            hospital.status
                                                        }
                                                    </span>

                                                </td>

                                                <td className="p-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    hospital
                                                                )
                                                            }
                                                            className="bg-yellow-500 text-white px-3 py-2 rounded-lg font-semibold"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    hospital.id
                                                                )
                                                            }
                                                            className="bg-red-600 text-white px-3 py-2 rounded-lg font-semibold"
                                                        >
                                                            Delete
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

            </div>

        </div>
    );
}
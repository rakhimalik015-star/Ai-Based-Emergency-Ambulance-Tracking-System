"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


interface Ambulance {
    id: string;
    vehicleNo: string;
    driverName: string;
    driverMobile: string;
    type: string;
    status: string;
}

export default function ManageAmbulances() {
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAmbulances = async () => {
            try {
                const res = await fetch("/api/admin/ambulances");
                const data = await res.json();

                if (data.success) {
                    setAmbulances(data.ambulances);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getAmbulances();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this ambulance?");

        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/admin/ambulances/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                alert("Ambulance Deleted Successfully");

                setAmbulances((prev) =>
                    prev.filter((ambulance) => ambulance.id !== id)
                );
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
                Loading Ambulances...
            </h1>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    🚑 Manage Ambulances
                </h1>

                <Link
                    href="/admin/ambulances/add"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    + Add Ambulance
                </Link>

            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead className="bg-red-600 text-white">

                        <tr>
                            <th className="p-3">Vehicle No</th>
                            <th className="p-3">Driver</th>
                            <th className="p-3">Mobile</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {ambulances.map((ambulance) => (

                            <tr
                                key={ambulance.id}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="p-3">{ambulance.vehicleNo}</td>
                                <td className="p-3">{ambulance.driverName}</td>
                                <td className="p-3">{ambulance.driverMobile}</td>
                                <td className="p-3">{ambulance.type}</td>

                                <td className="p-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${ambulance.status === "Available"
                                            ? "bg-green-500"
                                            : ambulance.status === "Busy"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {ambulance.status}
                                    </span>
                                </td>


                                <td className="p-3 flex gap-2">

                                    <Link
                                        href={`/admin/ambulances/${ambulance.id}/edit`}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(ambulance.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}
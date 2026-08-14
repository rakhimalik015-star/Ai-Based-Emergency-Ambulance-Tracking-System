"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAmbulance() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleNo: "",
    driverName: "",
    driverMobile: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    const getAmbulance = async () => {
      try {
        const res = await fetch(`/api/admin/ambulances/${id}`);
        const data = await res.json();

        if (data.success) {
          setForm({
            vehicleNo: data.ambulance.vehicleNo,
            driverName: data.ambulance.driverName,
            driverMobile: data.ambulance.driverMobile,
            type: data.ambulance.type,
            status: data.ambulance.status,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAmbulance();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/ambulances/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Ambulance Updated Successfully");
      router.push("/admin/ambulances");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Edit Ambulance
        </h1>

        <input
          type="text"
          className="w-full border p-3 rounded mb-4"
          value={form.vehicleNo}
          onChange={(e) =>
            setForm({ ...form, vehicleNo: e.target.value })
          }
          placeholder="Vehicle Number"
        />

        <input
          type="text"
          className="w-full border p-3 rounded mb-4"
          value={form.driverName}
          onChange={(e) =>
            setForm({ ...form, driverName: e.target.value })
          }
          placeholder="Driver Name"
        />

        <input
          type="text"
          className="w-full border p-3 rounded mb-4"
          value={form.driverMobile}
          onChange={(e) =>
            setForm({ ...form, driverMobile: e.target.value })
          }
          placeholder="Driver Mobile"
        />

        <select
          className="w-full border p-3 rounded mb-4"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="Basic">Basic</option>
          <option value="ICU">ICU</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          className="w-full border p-3 rounded mb-6"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Update Ambulance
        </button>

      </form>

    </div>
  );
}
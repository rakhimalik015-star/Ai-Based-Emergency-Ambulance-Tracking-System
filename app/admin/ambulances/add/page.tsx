"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAmbulance() {
  const router = useRouter();

  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [type, setType] = useState("Basic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/ambulances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleNo,
        driverName,
        driverMobile,
        type,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Ambulance Added Successfully");
      router.push("/admin/ambulances");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Add Ambulance
        </h1>

        <input
          type="text"
          placeholder="Vehicle Number"
          className="w-full border p-3 rounded mb-4"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Driver Name"
          className="w-full border p-3 rounded mb-4"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Driver Mobile"
          className="w-full border p-3 rounded mb-4"
          value={driverMobile}
          onChange={(e) => setDriverMobile(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-6"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Basic">Basic</option>
          <option value="ICU">ICU</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Add Ambulance
        </button>

      </form>

    </div>
  );
}
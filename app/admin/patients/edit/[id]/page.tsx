"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPatient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergency: "",
    condition: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPatient = async () => {
      const { id } = await params;

      const res = await fetch(`/api/admin/patients/${id}`);
      const data = await res.json();

      if (data.success) {
        setForm({
          name: data.patient.name,
          email: data.patient.email,
          mobile: data.patient.mobile,
          age: String(data.patient.age),
          gender: data.patient.gender,
          bloodGroup: data.patient.bloodGroup,
          address: data.patient.address,
          emergency: data.patient.emergency,
          condition: data.patient.condition || "",
        });
      }

      setLoading(false);
    };

    getPatient();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const { id } = await params;

    const res = await fetch(`/api/admin/patients/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Patient Updated Successfully ✅");
      router.push("/admin/patients");
    } else {
      alert(data.message);
    }
  };

  if (loading) {
    return (
      <h1 className="text-center mt-20 text-2xl">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6">
          ✏ Edit Patient
        </h1>

        <div className="grid gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-3 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded"
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="border p-3 rounded"
          />

          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="border p-3 rounded"
          />

          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="border p-3 rounded"
          />

          <input
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            placeholder="Blood Group"
            className="border p-3 rounded"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-3 rounded"
          />

          <input
            name="emergency"
            value={form.emergency}
            onChange={handleChange}
            placeholder="Emergency Contact"
            className="border p-3 rounded"
          />

          <input
            name="condition"
            value={form.condition}
            onChange={handleChange}
            placeholder="Condition"
            className="border p-3 rounded"
          />

          <button
            onClick={handleUpdate}
            className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
          >
            Update Patient
          </button>

        </div>

      </div>

    </div>
  );
}
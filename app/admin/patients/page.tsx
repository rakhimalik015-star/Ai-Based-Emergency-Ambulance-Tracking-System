"use client";

import { useEffect, useMemo, useState } from "react";

interface Patient {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export default function ManagePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const deletePatient = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Patient Deleted Successfully ✅");

        setPatients((prev) =>
          prev.filter((patient) => patient.id !== id)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };


  useEffect(() => {
    const getPatients = async () => {
      try {
        const res = await fetch("/api/admin/patients");
        const data = await res.json();

        if (data.success) {
          setPatients(data.patients);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [patients, search]);

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-2xl font-bold">
        Loading Patients...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          👨‍⚕️ Manage Patients
        </h1>

        <div className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold">
          Total Patients : {patients.length}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Name or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.email}</td>
                  <td className="p-3">{patient.mobile}</td>
                  <td className="p-3">{patient.age}</td>
                  <td className="p-3">{patient.gender}</td>
                  <td className="p-3">{patient.bloodGroup}</td>

                  <td className="p-3">
                    <a
                      href={`/admin/patients/${patient.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      👁 View
                    </a>
                  </td>

                  <td className="p-3 flex gap-2">
                    <a
                      href={`/admin/patients/edit/${patient.id}`}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      ✏ Edit
                    </a>



                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                    >
                      🗑 Delete
                    </button>


                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-500"
                >
                  No Patients Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
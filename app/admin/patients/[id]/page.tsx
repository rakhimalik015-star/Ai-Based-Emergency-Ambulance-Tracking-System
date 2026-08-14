"use client";

import { useEffect, useState } from "react";

interface Patient {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  emergency: string;
  condition: string;
  createdAt: string;
}

export default function PatientDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const { id } = await params;

        const res = await fetch(`/api/admin/patients/${id}`);
        const data = await res.json();

        if (data.success) {
          setPatient(data.patient);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getPatient();
  }, [params]);

  if (loading) {
    return (
      <h1 className="text-center text-2xl mt-20">
        Loading Patient...
      </h1>
    );
  }

  if (!patient) {
    return (
      <h1 className="text-center text-red-600 text-2xl mt-20">
        Patient Not Found
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center mb-8">
          👤 Patient Details
        </h1>

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="font-semibold">Name</p>
            <p>{patient.name}</p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p>{patient.email}</p>
          </div>

          <div>
            <p className="font-semibold">Mobile</p>
            <p>{patient.mobile}</p>
          </div>

          <div>
            <p className="font-semibold">Age</p>
            <p>{patient.age}</p>
          </div>

          <div>
            <p className="font-semibold">Gender</p>
            <p>{patient.gender}</p>
          </div>

          <div>
            <p className="font-semibold">Blood Group</p>
            <p>{patient.bloodGroup}</p>
          </div>

          <div>
            <p className="font-semibold">Emergency Contact</p>
            <p>{patient.emergency}</p>
          </div>

          <div>
            <p className="font-semibold">Condition</p>
            <p>{patient.condition}</p>
          </div>

        </div>

        <div className="mt-6">
          <p className="font-semibold">Address</p>
          <p>{patient.address}</p>
        </div>

        <div className="mt-6">
          <p className="font-semibold">Registered On</p>
          <p>
            {new Date(patient.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => history.back()}
          className="mt-8 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          ⬅ Back
        </button>

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.success) {
          setPatient(data.patient);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.log(error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[500px]">
        <h1 className="text-3xl font-bold text-center mb-6">
          My Profile
        </h1>

        <p><b>Name:</b> {patient?.name}</p>
        <p><b>Email:</b> {patient?.email}</p>
        <p><b>Mobile:</b> {patient?.mobile}</p>
        <p><b>Age:</b> {patient?.age}</p>
        <p><b>Blood Group:</b> {patient?.bloodGroup}</p>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
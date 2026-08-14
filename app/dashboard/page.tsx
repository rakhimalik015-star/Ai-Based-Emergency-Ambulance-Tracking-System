"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

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
            }
            finally {
                setLoading(false);
            }

        };


        getProfile();

    }, []);


    if (loading) {
        return (
            <h1 className="text-center mt-20">
                Loading...
            </h1>
        );
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold">
                Patient Dashboard
            </h1>


            {patient && (
                <div className="mt-6 bg-gray-100 p-6 rounded-lg">

                    <h2 className="text-2xl font-bold">
                        Welcome {patient.name} 👋
                    </h2>

                    <p className="mt-2">
                        Email: {patient.email}
                    </p>

                    <p>
                        Mobile: {patient.mobile}
                    </p>

                    <p>
                        Age: {patient.age}
                    </p>

                    <p>
                        Blood Group: {patient.bloodGroup}
                    </p>

                </div>
            )}


            <a href="/booking">
                <button className="mt-6 bg-red-600 text-white px-6 py-3 rounded">
                    Book Ambulance
                </button>
            </a>



            <a href="/my-bookings">
                <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded">
                    My Bookings
                </button>
            </a>


            <a href="/profile">
                <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded">
                    My Profile
                </button>
            </a>

        </div>
    );
}
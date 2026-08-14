"use client";

import { useState } from "react";


export default function BookingPage() {

    const [form, setForm] = useState({
        pickupLocation: "",
        destination: "",
        emergencyType: "",
        ambulanceType: "",
        mobile: ""
    });


    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e: any) => {

        e.preventDefault();

        if (
            !form.pickupLocation ||
            !form.destination ||
            !form.mobile ||
            !form.emergencyType ||
            !form.ambulanceType
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (form.mobile.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }




        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });


        const data = await res.json();


        if (data.success) {
            alert("Ambulance Booking Successful 🚑");
            window.location.href = "/my-bookings";

            setForm({
                pickupLocation: "",
                destination: "",
                emergencyType: "",
                ambulanceType: "",
                mobile: ""
            });

        }
        else {
            alert(data.message);
        }

    };


    return (

        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg p-8 rounded-lg w-96"
            >

                <h1 className="text-2xl font-bold mb-5">
                    Book Ambulance 🚑
                </h1>


                <input
                    name="pickupLocation"
                    placeholder="Pickup Location"
                    value={form.pickupLocation}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                />


                <input
                    name="destination"
                    placeholder="Destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                />


                <input
                    name="mobile"
                    placeholder="Mobile Number"
                    value={form.mobile}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                />


                <select
                    name="emergencyType"
                    value={form.emergencyType}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                >

                    <option value="">
                        Emergency Type
                    </option>

                    <option>
                        Accident
                    </option>

                    <option>
                        Critical Patient
                    </option>

                    <option>
                        Normal
                    </option>

                </select>



                <select
                    name="ambulanceType"
                    value={form.ambulanceType}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                >

                    <option value="">
                        Ambulance Type
                    </option>

                    <option>
                        Basic
                    </option>

                    <option>
                        ICU
                    </option>

                    <option>
                        Ventilator
                    </option>

                </select>



                <button
                    className="bg-red-600 text-white px-4 py-2 rounded w-full"
                >
                    Book Now
                </button>


            </form>

        </div>

    );

}
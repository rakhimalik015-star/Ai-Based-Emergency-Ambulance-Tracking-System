"use client";

import { useEffect, useState } from "react";

export default function EditProfilePage() {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: "",
        emergency: "",
        condition: "",
    });


    useEffect(() => {

        const getProfile = async () => {

            try {

                const res = await fetch("/api/profile");
                const data = await res.json();

                if (data.success) {

                    setFormData({
                        name: data.patient.name || "",
                        mobile: data.patient.mobile || "",
                        address: data.patient.address || "",
                        emergency: data.patient.emergency || "",
                        condition: data.patient.condition || "",
                    });

                }

            } catch (error) {
                console.log(error);
            }

        };

        getProfile();

    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const res = await fetch("/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {

                alert("Profile Updated Successfully ✅");

                window.location.href = "/profile";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Something went wrong!");

        }
    };
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Edit Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="text"
                        name="emergency"
                        placeholder="Emergency Contact"
                        value={formData.emergency}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="text"
                        name="condition"
                        placeholder="Medical Condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>

                </form>
            </div>
        </div>
    );
}
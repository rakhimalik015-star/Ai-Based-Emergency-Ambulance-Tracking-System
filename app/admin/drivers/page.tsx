"use client";

import { FormEvent, useEffect, useState } from "react";

interface Ambulance {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  type: string;
  status: string;
}

export default function AdminDriversPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [ambulanceId, setAmbulanceId] = useState("");

  useEffect(() => {
    const getAmbulances = async () => {
      try {
        const res = await fetch("/api/admin/ambulances");
        const data = await res.json();

        if (data.success) {
          setAmbulances(data.ambulances);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log("GET AMBULANCES ERROR:", error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getAmbulances();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          ambulanceId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Driver created successfully");

        setName("");
        setEmail("");
        setMobile("");
        setPassword("");
        setAmbulanceId("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("CREATE DRIVER ERROR:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const availableAmbulances = ambulances.filter(
    (ambulance) => ambulance.status === "Available"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        👨‍✈️ Add Driver
      </h1>

      <div className="bg-white max-w-2xl rounded-xl shadow p-8">

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-semibold mb-2">
              Driver Name
            </label>

            <input
              type="text"
              placeholder="Enter driver name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter driver email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Mobile
            </label>

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create driver password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Assign Ambulance
            </label>

            {loading ? (
              <p className="text-gray-500">
                Loading ambulances...
              </p>
            ) : availableAmbulances.length === 0 ? (
              <p className="text-red-600">
                No available ambulance found.
              </p>
            ) : (
              <select
                value={ambulanceId}
                onChange={(e) => setAmbulanceId(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">
                  Select Ambulance
                </option>

                {availableAmbulances.map((ambulance) => (
                  <option
                    key={ambulance.id}
                    value={ambulance.id}
                  >
                    {ambulance.vehicleNo} - {ambulance.type}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || loading || availableAmbulances.length === 0}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Creating Driver..." : "Create Driver"}
          </button>

        </form>

      </div>

    </div>
  );
}
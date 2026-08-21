"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Booking {
  id: string;
  pickupLocation: string;
  destination: string;
  emergencyType: string;
  ambulanceType: string;
  mobile: string;
  status: string;
  createdAt: string;
  patient: {
    name: string;
    email: string;
    mobile: string;
  } | null;
}

export default function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooking = async () => {
      try {
        const res = await fetch(`/api/admin/bookings/${id}`);
        const data = await res.json();

        if (data.success) {
          setBooking(data.booking);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-2xl">
        Loading...
      </h1>
    );
  }

  if (!booking) {
    return (
      <h1 className="text-center mt-10 text-2xl text-red-600">
        Booking Not Found
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6 text-red-600">
          Booking Details
        </h1>

        <div className="space-y-3">

          <p><strong>Patient:</strong> {booking.patient?.name || "Emergency Booking (No Account)"}</p>

          <p><strong>Email:</strong> {booking.patient?.email || "—"}</p>

          <p><strong>Mobile:</strong> {booking.patient?.mobile || booking.mobile}</p>

          <hr />

          <p><strong>Pickup:</strong> {booking.pickupLocation}</p>

          <p><strong>Destination:</strong> {booking.destination}</p>

          <p><strong>Emergency:</strong> {booking.emergencyType}</p>

          <p><strong>Ambulance:</strong> {booking.ambulanceType}</p>

          <p><strong>Status:</strong> {booking.status}</p>

          <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

        </div>

      </div>

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// interface Booking {
//   id: string;
//   pickupLocation: string;
//   destination: string;
//   emergencyType: string;
//   ambulanceType: string;
//   mobile: string;
//   status: string;
//   createdAt: string;
//   patient: {
//     name: string;
//     email: string;
//     mobile: string;
//   };
// }

// export default function BookingDetails() {
//   const { id } = useParams();

//   const [booking, setBooking] = useState<Booking | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getBooking = async () => {
//       try {
//         const res = await fetch(`/api/admin/bookings/${id}`);
//         const data = await res.json();

//         if (data.success) {
//           setBooking(data.booking);
//         }
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       getBooking();
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <h1 className="text-center mt-10 text-2xl">
//         Loading...
//       </h1>
//     );
//   }

//   if (!booking) {
//     return (
//       <h1 className="text-center mt-10 text-2xl text-red-600">
//         Booking Not Found
//       </h1>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">

//         <h1 className="text-3xl font-bold mb-6 text-red-600">
//           Booking Details
//         </h1>

//         <div className="space-y-3">

//           <p><strong>Patient:</strong> {booking.patient.name}</p>

//           <p><strong>Email:</strong> {booking.patient.email}</p>

//           <p><strong>Mobile:</strong> {booking.patient.mobile}</p>

//           <hr />

//           <p><strong>Pickup:</strong> {booking.pickupLocation}</p>

//           <p><strong>Destination:</strong> {booking.destination}</p>

//           <p><strong>Emergency:</strong> {booking.emergencyType}</p>

//           <p><strong>Ambulance:</strong> {booking.ambulanceType}</p>

//           <p><strong>Status:</strong> {booking.status}</p>

//           <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

//         </div>

//       </div>

//     </div>
//   );
// }
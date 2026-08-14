// "use client";


// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Swal from "sweetalert2";




// export default function LoginPage() {

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });


//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });


//     const data = await res.json();


//     if (data.success) {

//       Swal.mixin({
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       }).fire({
//         icon: "success",
//         title: "Login Successful",
//       });

//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);
//       // yaha dashboard redirect karenge
//       // window.location.href="/dashboard";


//     } else {

//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: data.message,
//       });

//     }

//   };


//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

//         <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Patient Login
//         </h1>


//         <form onSubmit={handleLogin} className="space-y-5">


//           <div>
//             <label className="block font-medium mb-2">
//               Email
//             </label>

//             <input
//               type="email"
//               placeholder="Enter email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   email: e.target.value
//                 })
//               }
//               className="w-full border p-3 rounded-lg"
//             />

//           </div>


//           <div>
//             <label className="block font-medium mb-2">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   password: e.target.value
//                 })
//               }
//               className="w-full border p-3 rounded-lg"
//             />

//           </div>



//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
//           >
//             Login
//           </button>


//         </form>

//       </div>

//     </div>
//   );
// }















"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Login Successful!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setMessage(data.message || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Patient Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-center font-medium mt-4">
              {message}
            </p>
          )}

        </form>

      </div>
    </div>
  );
}
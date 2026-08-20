"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

declare global {
  interface Window {
    google?: any;
    __gsiInitialized?: boolean;
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // agar script pehle se DOM mein hai to naya mat daalo
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

export default function GoogleButton() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    loadGoogleScript().then(() => {
      if (cancelled) return;

      if (!window.google) {
        console.error("Google Identity Services not loaded");
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing");
        return;
      }

      // sirf ek baar initialize karo, chahe component kitni baar mount ho
      if (!window.__gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,

          callback: async (response: any) => {
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  credential: response.credential,
                }),
              });

              const contentType = res.headers.get("content-type");

              if (!contentType?.includes("application/json")) {
                const text = await res.text();

                console.error("GOOGLE API RETURNED NON-JSON:");
                console.error(text);

                Swal.fire({
                  icon: "error",
                  title: "Google Authentication Error",
                  text: `API returned ${res.status} instead of JSON.`,
                });

                return;
              }

              const data = await res.json();

              console.log("GOOGLE API RESPONSE:", data);

              if (!res.ok || !data.success) {
                Swal.fire({
                  icon: "error",
                  title: "Google Login Failed",
                  text: data.debugError || data.message || "Google authentication failed",
                });

                return;
              }

              await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Google login successful!",
                timer: 1500,
                showConfirmButton: false,
              });

              router.push("/dashboard");
              router.refresh();
            } catch (error: any) {
              console.error("GOOGLE ERROR:", error);

              Swal.fire({
                icon: "error",
                title: "Google Login Failed",
                text: error?.message || "Google authentication failed",
              });
            }
          },
        });

        window.__gsiInitialized = true;
      }

      const googleButton = document.getElementById("googleButton");

      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        });
      }
    });

    return () => {
      cancelled = true;
      // script ko remove NAHI karna — usse har mount pe dobara load hoga
    };
  }, [router]);

  return (
    <div className="w-full flex justify-center">
      <div id="googleButton"></div>
    </div>
  );
}



// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

// declare global {
//   interface Window {
//     google?: any;
//   }
// }

// export default function GoogleButton() {
//   const router = useRouter();

//   useEffect(() => {
//     const script = document.createElement("script");

//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       if (!window.google) {
//         console.error("Google Identity Services not loaded");
//         return;
//       }

//       const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

//       if (!clientId) {
//         console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing");
//         return;
//       }

//       window.google.accounts.id.initialize({
//         client_id: clientId,

//         callback: async (response: any) => {
//           try {
//             const res = await fetch("/api/auth/google", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 credential: response.credential,
//               }),
//             });

//             const contentType = res.headers.get("content-type");

//             if (!contentType?.includes("application/json")) {
//               const text = await res.text();

//               console.error("GOOGLE API RETURNED NON-JSON:");
//               console.error(text);

//               Swal.fire({
//                 icon: "error",
//                 title: "Google Authentication Error",
//                 text: `API returned ${res.status} instead of JSON.`,
//               });

//               return;
//             }

//             const data = await res.json();

//             console.log("GOOGLE API RESPONSE:", data);

//             if (!res.ok || !data.success) {
//               Swal.fire({
//                 icon: "error",
//                 title: "Google Login Failed",
//                 text: data.debugError || data.message || "Google authentication failed",
//               });

//               return;
//             }

//             await Swal.fire({
//               icon: "success",
//               title: "Success",
//               text: "Google login successful!",
//               timer: 1500,
//               showConfirmButton: false,
//             });

//             router.push("/dashboard");
//             router.refresh();
//           } catch (error: any) {
//             console.error("GOOGLE ERROR:", error);

//             Swal.fire({
//               icon: "error",
//               title: "Google Login Failed",
//               text: error?.message || "Google authentication failed",
//             });
//           }
//         },
//       });

//       const googleButton = document.getElementById("googleButton");

//       if (googleButton) {
//         window.google.accounts.id.renderButton(googleButton, {
//           theme: "outline",
//           size: "large",
//           width: 400,
//           text: "continue_with",
//         });
//       }
//     };

//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, [router]);

//   return (
//     <div className="w-full flex justify-center">
//       <div id="googleButton"></div>
//     </div>
//   );
// }
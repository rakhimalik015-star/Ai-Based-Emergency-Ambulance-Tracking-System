"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleButton() {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) {
        console.error("Google Identity Services not loaded");
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing");
        return;
      }

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

      const googleButton = document.getElementById("googleButton");

      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  return (
    <div className="w-full flex justify-center">
      <div id="googleButton"></div>
    </div>
  );
}
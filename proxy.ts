// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";


// export function proxy(req: NextRequest) {
//     console.log("✅ Proxy Running");
//     const token = req.cookies.get("token")?.value;

//     const protectedRoutes = [
//         "/dashboard",
//         "/booking",
//         "/my-bookings",
//         "/profile",
//     ];

//     const isProtected = protectedRoutes.some((route) =>
//         req.nextUrl.pathname.startsWith(route)
//     );


//     // Agar protected page hai aur token nahi hai
//     if (isProtected && !token) {
//         return NextResponse.redirect(
//             new URL("/login", req.url)
//         );
//     }


//     // Token verify
//     if (token) {
//         try {
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET!
//             );

//             return NextResponse.next();

//         } catch (error) {

//             return NextResponse.redirect(
//                 new URL("/login", req.url)
//             );
//         }
//     }


//     return NextResponse.next();
// }


// export const config = {
//     matcher: [
//         "/dashboard/:path*",
//         "/booking/:path*",
//         "/my-bookings/:path*",
//         "/profile/:path*",
//     ],
// };









import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    console.log("✅ Proxy Running");

    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // Protected routes
    const protectedRoutes = [
        "/dashboard",
        "/booking",
        "/my-bookings",
        "/profile",
        "/admin/dashboard",
    ];

    const isProtected = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(route + "/")
    );

    // Token nahi hai → appropriate login page
    if (isProtected && !token) {
        const loginUrl = pathname.startsWith("/admin")
            ? "/admin/login"
            : "/login";

        return NextResponse.redirect(
            new URL(loginUrl, req.url)
        );
    }

    // Token hai → verify + role check
    if (isProtected && token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as {
                id: string;
                email: string;
                role: string;
            };

            // Admin route → sirf ADMIN
            if (
                pathname.startsWith("/admin") &&
                decoded.role !== "ADMIN"
            ) {
                return NextResponse.redirect(
                    new URL("/login", req.url)
                );
            }

            // Patient routes → ADMIN ko bhi patient area se alag rakho
            if (
                !pathname.startsWith("/admin") &&
                decoded.role === "ADMIN"
            ) {
                return NextResponse.redirect(
                    new URL("/admin/dashboard", req.url)
                );
            }

            return NextResponse.next();

        } catch (error) {
            console.log("❌ Invalid token");

            const loginUrl = pathname.startsWith("/admin")
                ? "/admin/login"
                : "/login";

            return NextResponse.redirect(
                new URL(loginUrl, req.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",

        "/booking",
        "/booking/:path*",

        "/my-bookings",
        "/my-bookings/:path*",

        "/profile",
        "/profile/:path*",

        "/admin/dashboard",
        "/admin/dashboard/:path*",
    ],
};
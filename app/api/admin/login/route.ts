// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {

//     try {

//         const body = await req.json();

//         const admin = await prisma.patient.findUnique({
//             where: {
//                 email: body.email,
//             },
//         });

//         if (!admin) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Admin not found",
//             });
//         }   

//         if (admin.password !== body.password) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Invalid password",
//             });
//         }



//         console.log("Admin Role:", admin.role);
//         console.log("Admin Role:", admin.role);

//         if (admin.role !== "ADMIN") {
//             return NextResponse.json({
//                 success: false,
//                 message: "Access Denied! Not an Admin",
//             });
//         }

//         const token = jwt.sign(
//             {
//                 id: admin.id,
//                 email: admin.email,
//                 role: admin.role,
//             },
//             process.env.JWT_SECRET!,
//             {
//                 expiresIn: "7d",
//             }
//         );

//         const response = NextResponse.json({
//             success: true,
//             message: "Admin Login Successful",
//         });

//         response.cookies.set("token", token, {
//             httpOnly: true,
//             path: "/",
//             maxAge: 60 * 60 * 24 * 7,
//         });

//         return response;

//     } catch (error) {

//         console.log(error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Server Error",
//             },
//             {
//                 status: 500,
//             }
//         );

//     }
// }




import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const admin = await prisma.patient.findUnique({
            where: {
                email: body.email,
            },
        });

        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Admin not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            body.password,
            admin.password
        );

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid password",
            });
        }

        if (admin.role !== "ADMIN") {
            return NextResponse.json({
                success: false,
                message: "Access Denied! Not an Admin",
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d",
            }
        );

        const response = NextResponse.json({
            success: true,
            message: "Admin Login Successful",
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
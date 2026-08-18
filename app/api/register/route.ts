// import bcrypt from "bcryptjs";

// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();

//         console.log("Received Data:", body);

//         const hashedPassword = await bcrypt.hash(body.password, 10);

//         const patient = await prisma.patient.create({
//             data: {
//                 name: body.name,
//                 age: Number(body.age),
//                 gender: body.gender,
//                 mobile: body.mobile,
//                 email: body.email,
//                 bloodGroup: body.bloodGroup,
//                 address: body.address,
//                 emergency: body.emergency,
//                 condition: body.condition,
//                 password: hashedPassword,
//             },
//         });

//         return Response.json({
//             success: true,
//             patient,
//         });

//     } catch (error) {
//         console.log(error);

//         return Response.json(
//             {
//                 success: false,
//                 error: "Something went wrong",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("Received Data:", body);

        // ======================================
        // REQUIRED FIELDS VALIDATION
        // ======================================

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Name, email and password are required",
                },
                { status: 400 }
            );
        }

        // ======================================
        // CHECK IF EMAIL ALREADY EXISTS
        // ======================================

        const existing = await prisma.patient.findUnique({
            where: { email },
        });

        if (existing) {
            return Response.json(
                {
                    success: false,
                    message: "An account with this email already exists",
                },
                { status: 409 }
            );
        }

        // ======================================
        // SAFE AGE PARSING
        // ======================================

        const parsedAge =
            body.age !== undefined && body.age !== ""
                ? Number(body.age)
                : undefined;

        if (parsedAge !== undefined && isNaN(parsedAge)) {
            return Response.json(
                {
                    success: false,
                    message: "Age must be a valid number",
                },
                { status: 400 }
            );
        }

        // ======================================
        // HASH PASSWORD
        // ======================================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ======================================
        // CREATE PATIENT (always role: PATIENT)
        // ======================================

        const patient = await prisma.patient.create({
            data: {
                name,
                age: parsedAge,
                gender: body.gender || undefined,
                mobile: body.mobile || undefined,
                email,
                bloodGroup: body.bloodGroup || undefined,
                address: body.address || undefined,
                emergency: body.emergency || undefined,
                condition: body.condition || undefined,
                password: hashedPassword,
                role: "PATIENT", // explicit — public register kabhi admin nahi bana sakta
            },
        });

        return Response.json({
            success: true,
            patient: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
            },
        });

    } catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong. Please try again.",
            },
            { status: 500 }
        );
    }
}
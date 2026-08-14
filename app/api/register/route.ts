import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("Received Data:", body);

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const patient = await prisma.patient.create({
            data: {
                name: body.name,
                age: Number(body.age),
                gender: body.gender,
                mobile: body.mobile,
                email: body.email,
                bloodGroup: body.bloodGroup,
                address: body.address,
                emergency: body.emergency,
                condition: body.condition,
                password: hashedPassword,
            },
        });

        return Response.json({
            success: true,
            patient,
        });

    } catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
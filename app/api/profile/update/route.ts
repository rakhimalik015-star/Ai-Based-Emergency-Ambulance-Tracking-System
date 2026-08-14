import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest) {



    try {

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Login required"
                },
                {
                    status: 401
                }
            );
        }

        const decoded = jwt.verify(

            token,
            process.env.JWT_SECRET!
        ) as {
            id: string;
        };
        const body = await req.json();
        const patient = await prisma.patient.update({
            where: {
                id: decoded.id,
            },
            data: {
                name: body.name,
                mobile: body.mobile,
                address: body.address,
                emergency: body.emergency,
                condition: body.condition,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Profile Updated Successfully",
            patient,
        });
    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Server Error"
            },
            {
                status: 500
            }
        );

    }
}
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {

    try {

        // Cookie se token lena
        const token = req.cookies.get("token")?.value;


        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 401
                }
            );
        }


        // JWT verify
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            id: string;
            email: string;
            name: string;
        };


        // Patient database se lana
        const patient = await prisma.patient.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                age: true,
                bloodGroup: true,
                address: true,
                emergency: true,
                condition: true,
            }
        });


        if (!patient) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Patient not found"
                },
                {
                    status: 404
                }
            );
        }


        return NextResponse.json({
            success: true,
            patient
        });


    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Invalid token"
            },
            {
                status: 401
            }
        );
    }
}

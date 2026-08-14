import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {

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
        if (
            !body.pickupLocation ||
            !body.destination ||
            !body.mobile ||
            !body.emergencyType ||
            !body.ambulanceType
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }


        const booking = await prisma.booking.create({

            data: {
                patientId: decoded.id,
                pickupLocation: body.pickupLocation,
                destination: body.destination,
                emergencyType: body.emergencyType,
                ambulanceType: body.ambulanceType,
                mobile: body.mobile,
            }

        });


        return NextResponse.json({
            success: true,
            booking
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
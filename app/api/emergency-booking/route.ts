import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, latitude, longitude } = body;

    if (!phone || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and location are required",
        },
        { status: 400 }
      );
    }

    // Agar logged-in patient hai to link kar do (optional)
    let patientId: string | undefined = undefined;

    const token = req.cookies.get("token")?.value;

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
          id: string;
        };
        patientId = decoded.id;
      } catch {
        // token invalid/expired — guest booking treat karo
      }
    }

    const booking = await prisma.booking.create({
      data: {
        patientId,
        mobile: phone,
        pickupLocation: `${latitude}, ${longitude}`,
        latitude,
        longitude,
        status: "Pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ambulance booked",
      booking: {
        id: booking.id,
      },
    });
  } catch (error) {
    console.error("EMERGENCY BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
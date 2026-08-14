import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Login required",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        ambulance: true,
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    // Patient sirf apni booking track kar sakta hai
    if (
      decoded.role === "PATIENT" &&
      booking.patientId !== decoded.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    if (!booking.ambulance) {
      return NextResponse.json({
        success: true,
        tracking: {
          bookingId: booking.id,
          status: booking.status,
          ambulanceAssigned: false,
          latitude: null,
          longitude: null,
        },
      });
    }

    return NextResponse.json({
      success: true,

      tracking: {
        bookingId: booking.id,

        status: booking.status,

        ambulanceAssigned: true,

        vehicleNo: booking.ambulance.vehicleNo,

        ambulanceType: booking.ambulance.type,

        ambulanceStatus: booking.ambulance.status,

        latitude: booking.ambulance.latitude,

        longitude: booking.ambulance.longitude,
      },
    });
  } catch (error) {
    console.log("TRACKING API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}   
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("driverToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver login required",
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

    if (decoded.role !== "DRIVER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // Driver find karo
    const driver = await prisma.driver.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver not found",
        },
        { status: 404 }
      );
    }

    if (!driver.ambulanceId) {
      return NextResponse.json(
        {
          success: false,
          message: "No ambulance assigned",
        },
        { status: 400 }
      );
    }

    // Driver ki current/on-going booking find karo
    const booking = await prisma.booking.findFirst({
      where: {
        ambulanceId: driver.ambulanceId,
        status: "On the Way",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "No active trip found",
        },
        { status: 404 }
      );
    }

    // Booking complete
    const updatedBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "Completed",
      },
    });

    // Ambulance available
    const ambulance = await prisma.ambulance.update({
      where: {
        id: driver.ambulanceId,
      },
      data: {
        status: "Available",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trip completed successfully",
      booking: updatedBooking,
      ambulance: {
        id: ambulance.id,
        status: ambulance.status,
      },
    });
  } catch (error) {
    console.log("COMPLETE TRIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
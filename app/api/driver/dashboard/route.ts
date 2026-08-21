import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

    const driver = await prisma.driver.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        ambulance: true,
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

    let booking = null;

    if (driver.ambulanceId) {
      booking = await prisma.booking.findFirst({
        where: {
          ambulanceId: driver.ambulanceId,

          // 👇 Ye important fix hai
          status: {
            in: [
              "Approved",
              "Pending",
              "On the Way",
              "Arrived",
            ],
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          patient: {
            select: {
              name: true,
              mobile: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,

      data: {
        driverName: driver.name,

        vehicleNo:
          driver.ambulance?.vehicleNo || "Not Assigned",

        ambulanceType:
          driver.ambulance?.type || "Not Assigned",

        ambulanceStatus:
          driver.ambulance?.status || "Not Assigned",

        booking: booking
          ? {
            id: booking.id,

            patientName: booking.patient?.name || "Emergency Booking (No Account)",

            patientMobile: booking.patient?.mobile || booking.mobile,

            pickupLocation: booking.pickupLocation,

            destination: booking.destination,

            emergencyType: booking.emergencyType,

            status: booking.status,
          }
          : null,
      },
    });
  } catch (error) {
    console.log("DRIVER DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
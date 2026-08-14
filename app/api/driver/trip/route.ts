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
          message: "No ambulance assigned to this driver",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        ambulanceId: driver.ambulanceId,
        status: "Approved",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "No approved booking found",
        },
        { status: 404 }
      );
    }

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "On the Way",
      },
    });

    await prisma.ambulance.update({
      where: {
        id: driver.ambulanceId,
      },
      data: {
        status: "Busy",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trip started successfully",
    });
  } catch (error) {
    console.log("START TRIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
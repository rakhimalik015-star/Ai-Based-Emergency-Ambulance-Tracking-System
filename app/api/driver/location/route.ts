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

    const body = await req.json();

    const { latitude, longitude } = body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid latitude and longitude are required",
        },
        { status: 400 }
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
          message: "No ambulance assigned",
        },
        { status: 400 }
      );
    }

    const ambulance = await prisma.ambulance.update({
      where: {
        id: driver.ambulanceId,
      },
      data: {
        latitude,
        longitude,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Location updated",
      location: {
        latitude: ambulance.latitude,
        longitude: ambulance.longitude,
      },
    });
  } catch (error) {
    console.log("DRIVER LOCATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
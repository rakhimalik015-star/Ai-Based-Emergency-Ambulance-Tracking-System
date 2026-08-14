import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Login Required",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    if (!body.ambulanceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Ambulance is required",
        },
        { status: 400 }
      );
    }

    const ambulance = await prisma.ambulance.findUnique({
      where: {
        id: body.ambulanceId,
      },
    });

    if (!ambulance) {
      return NextResponse.json(
        {
          success: false,
          message: "Ambulance not found",
        },
        { status: 404 }
      );
    }

    if (ambulance.status !== "Available") {
      return NextResponse.json(
        {
          success: false,
          message: "Ambulance is not available",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        ambulanceId: ambulance.id,
        status: "Approved",
      },
      include: {
        ambulance: true,
      },
    });

    await prisma.ambulance.update({
      where: {
        id: ambulance.id,
      },
      data: {
        status: "Busy",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ambulance assigned successfully",
      booking,
    });
  } catch (error) {
    console.log("ASSIGN AMBULANCE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
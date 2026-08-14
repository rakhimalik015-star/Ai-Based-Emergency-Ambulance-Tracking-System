import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Login Required",
        },
        {
          status: 401,
        }
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
        {
          status: 403,
        }
      );
    }

   const bookings = await prisma.booking.findMany({
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

    ambulance: {
      select: {
        id: true,
        vehicleNo: true,
        driverName: true,
        driverMobile: true,
        type: true,
        status: true,
      },
    },
  },
});



    return NextResponse.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
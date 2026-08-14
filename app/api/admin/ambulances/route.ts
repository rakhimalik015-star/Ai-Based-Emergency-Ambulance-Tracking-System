import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get All Ambulances
export async function GET() {
  try {
    const ambulances = await prisma.ambulance.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      ambulances,
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

// Add Ambulance
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.vehicleNo ||
      !body.driverName ||
      !body.driverMobile ||
      !body.type
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

    const ambulance = await prisma.ambulance.create({
      data: {
        vehicleNo: body.vehicleNo,
        driverName: body.driverName,
        driverMobile: body.driverMobile,
        type: body.type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ambulance Added Successfully",
      ambulance,
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
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get Single Ambulance
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
    });

    if (!ambulance) {
      return NextResponse.json(
        {
          success: false,
          message: "Ambulance not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
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

// Update Ambulance
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const ambulance = await prisma.ambulance.update({
      where: { id },
      data: {
        vehicleNo: body.vehicleNo,
        driverName: body.driverName,
        driverMobile: body.driverMobile,
        type: body.type,
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ambulance Updated Successfully",
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

// Delete Ambulance
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.ambulance.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Ambulance Deleted Successfully",
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
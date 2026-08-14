import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single booking
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        patient: {
          select: {
            name: true,
            mobile: true,
            email: true,
          },
        },
        ambulance: true,
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

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.log("GET BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}


// PUT update booking status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    console.log(
      "🔥 ADMIN PUT BOOKING:",
      id,
      body
    );

    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    // Pehle existing booking find karo
    const existingBooking =
      await prisma.booking.findUnique({
        where: {
          id,
        },
        include: {
          ambulance: true,
        },
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    // Booking status update
    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: body.status,
      },
      include: {
        ambulance: true,
      },
    });

    // Agar booking Completed ya Cancelled ho
    // to assigned ambulance ko Available karo
    if (
      (body.status === "Completed" ||
        body.status === "Cancelled") &&
      existingBooking.ambulanceId
    ) {
      await prisma.ambulance.update({
        where: {
          id: existingBooking.ambulanceId,
        },
        data: {
          status: "Available",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Booking status updated successfully",
      booking,
    });

  } catch (error) {
    console.log(
      "🔥 ADMIN PUT BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
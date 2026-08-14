import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalPatients = await prisma.patient.count();

    const totalBookings = await prisma.booking.count();

    const pendingBookings = await prisma.booking.count({
      where: {
        status: "Pending",
      },
    });

    const approvedBookings = await prisma.booking.count({
      where: {
        status: "Approved",
      },
    });

    const completedBookings = await prisma.booking.count({
      where: {
        status: "Completed",
      },
    });

    const cancelledBookings = await prisma.booking.count({
      where: {
        status: "Cancelled",
      },
    });

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      totalPatients,
      totalBookings,
      pendingBookings,
      approvedBookings,
      completedBookings,
      cancelledBookings,
      recentBookings,
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
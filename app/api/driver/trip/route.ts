import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    // =========================
    // DRIVER TOKEN
    // =========================

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

    // =========================
    // VERIFY TOKEN
    // =========================

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

    // =========================
    // GET ACTION
    // =========================

    const body = await req.json();

    const { action } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: "Action is required",
        },
        { status: 400 }
      );
    }

    // =========================
    // FIND DRIVER
    // =========================

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

    // =========================
    // CHECK AMBULANCE
    // =========================

    if (!driver.ambulanceId) {
      return NextResponse.json(
        {
          success: false,
          message: "No ambulance assigned to this driver",
        },
        { status: 400 }
      );
    }

    // =========================
    // FIND ACTIVE BOOKING
    // =========================

    const booking = await prisma.booking.findFirst({
      where: {
        ambulanceId: driver.ambulanceId,

        status: {
          in: [
            "Approved",
            "On the Way",
            "Arrived",
          ],
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "No active booking found",
        },
        { status: 404 }
      );
    }

    // =========================
    // START TRIP
    // =========================

    if (action === "START") {

      if (booking.status !== "Approved") {
        return NextResponse.json(
          {
            success: false,
            message: "Trip can only be started from Approved status",
          },
          { status: 400 }
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
        status: "On the Way",
      });
    }

    // =========================
    // ARRIVED
    // =========================

    if (action === "ARRIVED") {

      if (booking.status !== "On the Way") {
        return NextResponse.json(
          {
            success: false,
            message: "Trip must be On the Way before arrival",
          },
          { status: 400 }
        );
      }

      await prisma.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          status: "Arrived",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Driver marked as arrived",
        status: "Arrived",
      });
    }

    // =========================
    // COMPLETE TRIP
    // =========================

    if (action === "COMPLETE") {

      if (
        booking.status !== "Arrived" &&
        booking.status !== "On the Way"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid trip status",
          },
          { status: 400 }
        );
      }

      await prisma.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          status: "Completed",
        },
      });

      await prisma.ambulance.update({
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
        status: "Completed",
      });
    }

    // =========================
    // INVALID ACTION
    // =========================

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );

  } catch (error) {

    console.log("DRIVER TRIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
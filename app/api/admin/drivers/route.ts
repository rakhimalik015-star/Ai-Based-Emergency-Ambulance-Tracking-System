import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const {
      name,
      email,
      mobile,
      password,
      ambulanceId,
    } = body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !ambulanceId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingDriver = await prisma.driver.findUnique({
      where: {
        email,
      },
    });

    if (existingDriver) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver already exists",
        },
        { status: 409 }
      );
    }

    const ambulance = await prisma.ambulance.findUnique({
      where: {
        id: ambulanceId,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await prisma.driver.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role: "DRIVER",
        ambulanceId,
      },
      include: {
        ambulance: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Driver created successfully",
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        mobile: driver.mobile,
        role: driver.role,
        ambulance: driver.ambulance,
      },
    });
  } catch (error) {
    console.log("CREATE DRIVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
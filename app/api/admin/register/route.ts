import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      mobile,
      email,
      password,
    } = body;

    if (
      !name ||
      !mobile ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingAdmin =
      await prisma.patient.findUnique({
        where: { email },
      });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await prisma.patient.create({
      data: {
        name,
        age: 0,
        gender: "ADMIN",
        mobile,
        email,
        bloodGroup: "N/A",
        address: "N/A",
        emergency: "N/A",
        condition: null,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin registration successful",
    });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
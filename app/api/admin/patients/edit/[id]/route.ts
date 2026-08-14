import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updatedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        age: Number(body.age),
        gender: body.gender,
        mobile: body.mobile,
        email: body.email,
        bloodGroup: body.bloodGroup,
        address: body.address,
        emergency: body.emergency,
        condition: body.condition,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient,
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
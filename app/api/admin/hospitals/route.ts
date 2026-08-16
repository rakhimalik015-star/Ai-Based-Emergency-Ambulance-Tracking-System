import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

function checkAdmin(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Admin login required",
        };
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            id: string;
            role: string;
        };

        if (decoded.role !== "ADMIN") {
            return {
                success: false,
                message: "Admin access required",
            };
        }

        return {
            success: true,
            decoded,
        };
    } catch {
        return {
            success: false,
            message: "Invalid or expired token",
        };
    }
}

// ==========================================
// GET HOSPITALS
// ==========================================

export async function GET(req: NextRequest) {
    try {
        const auth = checkAdmin(req);

        if (!auth.success) {
            return NextResponse.json(
                auth,
                { status: 401 }
            );
        }

        const hospitals =
            await prisma.hospital.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });

        return NextResponse.json({
            success: true,
            hospitals,
        });

    } catch (error) {
        console.error(
            "GET HOSPITALS ERROR:",
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

// ==========================================
// ADD HOSPITAL
// ==========================================

export async function POST(req: NextRequest) {
    try {
        const auth = checkAdmin(req);

        if (!auth.success) {
            return NextResponse.json(
                auth,
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            name,
            address,
            city,
            latitude,
            longitude,
            bedsAvailable,
            icuAvailable,
            emergencySupport,
            trafficLevel,
            status,
        } = body;

        if (
            !name ||
            !address ||
            !city ||
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Name, address, city, latitude and longitude are required",
                },
                { status: 400 }
            );
        }

        const hospital =
            await prisma.hospital.create({
                data: {
                    name,
                    address,
                    city,
                    latitude,
                    longitude,
                    bedsAvailable:
                        typeof bedsAvailable ===
                        "number"
                            ? bedsAvailable
                            : 0,
                    icuAvailable:
                        typeof icuAvailable ===
                        "number"
                            ? icuAvailable
                            : 0,
                    emergencySupport:
                        typeof emergencySupport ===
                        "boolean"
                            ? emergencySupport
                            : true,
                    trafficLevel:
                        trafficLevel || "Low",
                    status:
                        status || "Available",
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Hospital added successfully",
            hospital,
        });

    } catch (error) {
        console.error(
            "ADD HOSPITAL ERROR:",
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

// ==========================================
// UPDATE HOSPITAL
// ==========================================

export async function PUT(req: NextRequest) {
    try {
        const auth = checkAdmin(req);

        if (!auth.success) {
            return NextResponse.json(
                auth,
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            id,
            name,
            address,
            city,
            latitude,
            longitude,
            bedsAvailable,
            icuAvailable,
            emergencySupport,
            trafficLevel,
            status,
        } = body;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Hospital ID is required",
                },
                { status: 400 }
            );
        }

        const hospital =
            await prisma.hospital.update({
                where: {
                    id,
                },
                data: {
                    name,
                    address,
                    city,
                    latitude,
                    longitude,
                    bedsAvailable,
                    icuAvailable,
                    emergencySupport,
                    trafficLevel,
                    status,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Hospital updated successfully",
            hospital,
        });

    } catch (error) {
        console.error(
            "UPDATE HOSPITAL ERROR:",
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

// ==========================================
// DELETE HOSPITAL
// ==========================================

export async function DELETE(req: NextRequest) {
    try {
        const auth = checkAdmin(req);

        if (!auth.success) {
            return NextResponse.json(
                auth,
                { status: 401 }
            );
        }

        const { searchParams } =
            new URL(req.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Hospital ID is required",
                },
                { status: 400 }
            );
        }

        await prisma.hospital.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Hospital deleted successfully",
        });

    } catch (error) {
        console.error(
            "DELETE HOSPITAL ERROR:",
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
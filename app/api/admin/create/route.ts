import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // ======================================
        // VERIFY REQUESTER IS ALREADY AN ADMIN
        // ======================================

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid or expired session" },
                { status: 401 }
            );
        }

        if (decoded.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, message: "Only admins can create new admins" },
                { status: 403 }
            );
        }

        // ======================================
        // CREATE NEW ADMIN
        // ======================================

        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Name, email and password are required" },
                { status: 400 }
            );
        }

        const existing = await prisma.patient.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.patient.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            success: true,
            message: "New admin created successfully",
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
            },
        });

    } catch (error) {
        console.error("CREATE ADMIN ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
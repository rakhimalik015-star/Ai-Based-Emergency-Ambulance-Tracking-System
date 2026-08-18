import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export async function POST(req: NextRequest) {
    try {
        // ======================================
        // CHECK ENVIRONMENT VARIABLES
        // ======================================

        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("GOOGLE_CLIENT_ID is missing");

            return NextResponse.json(
                {
                    success: false,
                    message: "GOOGLE_CLIENT_ID is missing in .env",
                },
                { status: 500 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return NextResponse.json(
                {
                    success: false,
                    message: "JWT_SECRET is missing in .env",
                },
                { status: 500 }
            );
        }

        // ======================================
        // GET CREDENTIAL FROM FRONTEND
        // ======================================

        const body = await req.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google credential is missing",
                },
                { status: 400 }
            );
        }

        // ======================================
        // VERIFY GOOGLE ID TOKEN
        // ======================================

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Google token",
                },
                { status: 401 }
            );
        }

        const { email, name, sub: googleId } = payload;

        // ======================================
        // FIND OR CREATE PATIENT
        // ======================================

        let patient = await prisma.patient.findUnique({
            where: { email },
        });

        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    email,
                    name: name || "Google User",
                    googleId,
                    // age, gender, mobile, bloodGroup, address, emergency
                    // sab optional hain — user profile page se baad mein bharega
                },
            });
        } else if (!patient.googleId) {
            // Agar patient email se pehle se registered hai (normal signup se)
            // to uska account Google ID se link kar do
            patient = await prisma.patient.update({
                where: { email },
                data: { googleId },
            });
        }

        // ======================================
        // SIGN JWT
        // ======================================

        const token = jwt.sign(
            {
                id: patient.id,
                email: patient.email,
                role: patient.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ======================================
        // SET COOKIE + RESPONSE
        // ======================================

        const response = NextResponse.json({
            success: true,
            message: "Google login successful",
            user: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 din
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error("GOOGLE AUTH ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Google authentication failed",
                debugError: error?.message || String(error), // TEMPORARY — baad mein hata dena
            },
            { status: 500 }
        );
    }
}
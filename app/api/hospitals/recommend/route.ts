import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface HospitalResult {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
    bedsAvailable: number;
    icuAvailable: number;
    emergencySupport: boolean;
    trafficLevel: "Low" | "Medium" | "High";
    phone: string | null;
    distance: number;
    score: number;
}

// ==========================================
// DISTANCE CALCULATION
// ==========================================

function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const R = 6371;

    const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

// ==========================================
// POST
// ==========================================

export async function POST(
    req: NextRequest
) {
    try {
        const body = await req.json();

        const {
            latitude,
            longitude,
            emergencyType,
        } = body;

        // ======================================
        // VALIDATION
        // ======================================

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Patient latitude and longitude are required",
                },
                {
                    status: 400,
                }
            );
        }

        // ======================================
        // GET HOSPITALS FROM MONGODB
        // ======================================

        const hospitals =
            await prisma.hospital.findMany();

        if (hospitals.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No hospitals available in database",
                },
                {
                    status: 404,
                }
            );
        }

        // ======================================
        // CALCULATE AI SCORE
        // ======================================

        const results: HospitalResult[] =
            hospitals.map((hospital) => {

                const distance =
                    calculateDistance(
                        latitude,
                        longitude,
                        hospital.latitude,
                        hospital.longitude
                    );

                let score = 100;

                // ==================================
                // 1. DISTANCE
                // ==================================

                score -= distance * 5;

                // ==================================
                // 2. BEDS
                // ==================================

                score += Math.min(
                    hospital.bedsAvailable * 1.5,
                    20
                );

                // ==================================
                // 3. ICU
                // ==================================

                if (
                    hospital.icuAvailable > 0
                ) {
                    score += 15;
                } else {
                    score -= 10;
                }

                // ==================================
                // 4. EMERGENCY SUPPORT
                // ==================================

                if (
                    hospital.emergencySupport
                ) {
                    score += 15;
                } else {
                    score -= 30;
                }

                // ==================================
                // 5. TRAFFIC
                // ==================================

                if (
                    hospital.trafficLevel ===
                    "Low"
                ) {
                    score += 10;
                }

                if (
                    hospital.trafficLevel ===
                    "Medium"
                ) {
                    score += 5;
                }

                if (
                    hospital.trafficLevel ===
                    "High"
                ) {
                    score -= 10;
                }

                // ==================================
                // 6. CRITICAL EMERGENCY
                // ==================================

                if (
                    emergencyType ===
                        "Critical" &&
                    hospital.icuAvailable === 0
                ) {
                    score -= 50;
                }

                return {
                    id: hospital.id,
                    name: hospital.name,
                    latitude:
                        hospital.latitude,
                    longitude:
                        hospital.longitude,
                    address:
                        hospital.address,
                    bedsAvailable:
                        hospital.bedsAvailable,
                    icuAvailable:
                        hospital.icuAvailable,
                    emergencySupport:
                        hospital.emergencySupport,
                    trafficLevel:
                        hospital.trafficLevel as
                            | "Low"
                            | "Medium"
                            | "High",
                    phone:
                        hospital.phone,

                    distance: Number(
                        distance.toFixed(2)
                    ),

                    score: Number(
                        score.toFixed(2)
                    ),
                };
            });

        // ======================================
        // SORT BEST HOSPITAL FIRST
        // ======================================

        results.sort(
            (a, b) =>
                b.score - a.score
        );

        const recommendedHospital =
            results[0];

        // ======================================
        // RESPONSE
        // ======================================

        return NextResponse.json({
            success: true,

            message:
                "Hospital recommendation generated successfully",

            recommendedHospital,

            hospitals: results,
        });

    } catch (error) {

        console.error(
            "HOSPITAL RECOMMENDATION ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
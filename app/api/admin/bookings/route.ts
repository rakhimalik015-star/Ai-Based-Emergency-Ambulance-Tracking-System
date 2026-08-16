// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Login Required",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as {
//       role: string;
//     };

//     if (decoded.role !== "ADMIN") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Access Denied",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     const bookings = await prisma.booking.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         patient: {
//           select: {
//             name: true,
//             mobile: true,
//           },
//         },

//         ambulance: {
//           select: {
//             id: true,
//             vehicleNo: true,
//             driverName: true,
//             driverMobile: true,
//             type: true,
//             status: true,
//           },
//         },
//       },
//     });



//     return NextResponse.json({
//       success: true,
//       bookings,
//     });

//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Token check
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Login Required",
        },
        {
          status: 401,
        }
      );
    }

    // 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      role: string;
    };

    // 3. Admin check
    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied",
        },
        {
          status: 403,
        }
      );
    }

    // 4. Get bookings WITHOUT patient/ambulance relation
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5. Manually get patient + ambulance data
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        // Patient
        const patient = await prisma.patient.findUnique({
          where: {
            id: booking.patientId,
          },
          select: {
            name: true,
            mobile: true,
          },
        });

        // Ambulance
        let ambulance = null;

        if (booking.ambulanceId) {
          ambulance = await prisma.ambulance.findUnique({
            where: {
              id: booking.ambulanceId,
            },
            select: {
              id: true,
              vehicleNo: true,
              driverName: true,
              driverMobile: true,
              type: true,
              status: true,
            },
          });
        }

        return {
          ...booking,

          patient: patient || {
            name: "Unknown Patient",
            mobile: booking.mobile,
          },

          ambulance,
        };
      })
    );

    // 6. Response
    return NextResponse.json({
      success: true,
      bookings: bookingsWithDetails,
    });
  } catch (error) {
    console.log("ADMIN BOOKINGS ERROR:", error);

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
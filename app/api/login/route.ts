import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const patient = await prisma.patient.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!patient) {
      return Response.json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Google se register hue account ka password nahi hota
    if (!patient.password) {
      return Response.json({
        success: false,
        message:
          "This account uses Google Sign-In. Please continue with Google to log in.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      patient.password
    );

    if (!passwordMatch) {
      return Response.json({
        success: false,
        message: "Invalid password",
      });
    }

    await prisma.loginHistory.create({
      data: {
        email: patient.email,
      },
    });

    const token = jwt.sign(
      {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        role: patient.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const response = Response.json({
      success: true,
      message: "Login Successful",
    });

    response.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}



// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const patient = await prisma.patient.findUnique({
//       where: {
//         email: body.email,
//       },
//     });

//     if (!patient) {
//       return Response.json({
//         success: false,
//         message: "Patient not found",
//       });
//     }

//     const passwordMatch = await bcrypt.compare(
//       body.password,
//       patient.password
//     );

//     if (!passwordMatch) {
//       return Response.json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     await prisma.loginHistory.create({
//       data: {
//         email: patient.email,
//       },
//     });

//     const token = jwt.sign(
//       {
//         id: patient.id,
//         email: patient.email,
//         name: patient.name,
//         role: patient.role,
//       },
//       process.env.JWT_SECRET!,
//       {
//         expiresIn: "7d",
//       }
//     );

//     const response = Response.json({
//       success: true,
//       message: "Login Successful",
//     });

//     response.headers.append(
//       "Set-Cookie",
//       `token=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Strict`
//     );

//     return response;
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       {
//         success: false,
//         message: "Server error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@ambulanceai.com"; // apna admin email daalo
    const plainPassword = "ChangeThis123!"; // strong password rakho, baad mein change kar lena

    const existing = await prisma.patient.findUnique({
        where: { email },
    });

    if (existing) {
        console.log("Admin already exists:", existing.email);
        return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await prisma.patient.create({
        data: {
            name: "System Admin",
            email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Admin created successfully:");
    console.log("Email:", admin.email);
    console.log("Password:", plainPassword, "(change after first login)");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
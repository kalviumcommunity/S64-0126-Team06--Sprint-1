import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        // Don't return the password in the response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, message: "Signup successful", user: userWithoutPassword });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ success: false, message: "Signup failed", error }, { status: 500 });
    }
}

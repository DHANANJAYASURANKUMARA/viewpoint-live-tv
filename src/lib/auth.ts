"use server";

import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(name: string, email: string, password: string) {
    try {
        // Check if user already exists
        const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
        if (existing.length > 0) {
            return { success: false, error: "An account with this email already exists." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.insert(users).values({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        }).returning();

        return {
            success: true,
            user: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email,
            }
        };
    } catch (error: any) {
        console.error("Registration failed:", error);
        return { success: false, error: error?.message || "Registration failed." };
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

        if (result.length === 0) {
            return { success: false, error: "No account found with this email." };
        }

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, error: "Incorrect password." };
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };
    } catch (error: any) {
        console.error("Login failed:", error);
        return { success: false, error: error?.message || "Login failed." };
    }
}

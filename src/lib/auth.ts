"use server";

import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(name: string, email: string, password: string) {
    try {
        const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
        if (existing.length > 0) {
            return { success: false, error: "An account with this email already exists." };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.insert(users).values({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            lastLogin: new Date(),
        }).returning();

        return {
            success: true,
            user: { id: result[0].id, name: result[0].name, email: result[0].email }
        };
    } catch (error: unknown) {
        const e = error as Error;
        console.error("Registration failed:", e);
        return { success: false, error: e?.message || "Registration failed." };
    }
}

export async function loginUser(email: string, password: string, device?: string, country?: string, browser?: string, location?: string) {
    try {
        const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
        if (result.length === 0) {
            return { success: false, error: "No account found with this email." };
        }
        const user = result[0];

        // Check if user is banned
        if (user.isBanned) {
            return { success: false, error: "Your account has been suspended. Please contact support." };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { success: false, error: "Incorrect password." };
        }

        // Update lastLogin, device, country
        await db.update(users).set({
            lastLogin: new Date(),
            device: device || user.device || "Unknown",
            country: country || user.country || "Unknown",
            browser: browser || user.browser || "Unknown",
            location: location || user.location || "Unknown",
        }).where(eq(users.id, user.id));

        return {
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        };
    } catch (error: unknown) {
        const e = error as Error;
        console.error("Login failed:", e);
        return { success: false, error: e?.message || "Login failed." };
    }
}

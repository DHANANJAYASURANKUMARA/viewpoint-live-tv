"use server";

import { db } from "./db";
import { operators, adminLogs, users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ─── Logging Helper ───────────────────────────────────────────────────────────
export async function logAdminAction(
    action: string,
    target: string = "",
    detail: string = "",
    category: string = "SYSTEM",
    operatorName: string = "Super Admin",
    operatorId: string = ""
) {
    try {
        await db.insert(adminLogs).values({ action, target, detail, category, operatorName, operatorId });
    } catch (e) {
        console.error("Failed to write admin log:", e);
    }
}

// ─── Get all logs ─────────────────────────────────────────────────────────────
export async function getAdminLogs() {
    try {
        const logs = await db.select().from(adminLogs).orderBy(adminLogs.createdAt);
        return logs.reverse(); // newest first
    } catch (e) {
        console.error("Failed to fetch admin logs:", e);
        return [];
    }
}

// ─── Clear admin logs ─────────────────────────────────────────────────────────
export async function clearAdminLogs() {
    try {
        await db.delete(adminLogs);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

// ─── Admin Login (DB-driven) ──────────────────────────────────────────────────
export async function adminLogin(loginId: string, password: string) {
    try {
        const result = await db.select().from(operators).where(eq(operators.loginId, loginId));
        if (result.length === 0) {
            return { success: false, error: "Operator ID not found." };
        }
        const op = result[0];

        if (op.status === "Suspended") {
            return { success: false, error: "This account has been suspended." };
        }

        if (!op.password) {
            return { success: false, error: "No password set for this account. Contact Super Admin." };
        }

        const match = await bcrypt.compare(password, op.password);
        if (!match) {
            return { success: false, error: "Incorrect access key." };
        }

        // Update lastActive
        await db.update(operators).set({ lastActive: new Date() }).where(eq(operators.id, op.id));

        // Log the login
        await logAdminAction("ADMIN_LOGIN", op.name, `Login from ID: ${loginId}`, "AUTH", op.name, op.id);

        return {
            success: true,
            operator: {
                id: op.id,
                name: op.name,
                loginId: op.loginId,
                role: op.role,
                isSuperAdmin: op.isSuperAdmin,
            }
        };
    } catch (e: any) {
        console.error("Admin login failed:", e);
        return { success: false, error: e?.message || "Login failed." };
    }
}

// ─── Create / Update Operator (Super Admin only) ──────────────────────────────
export async function manageOperatorFull(data: any, actorName: string = "Super Admin") {
    try {
        const payload: any = { ...data };

        // Never allow changing Super Admin via this endpoint
        if (payload.isSuperAdmin) delete payload.isSuperAdmin;

        if (payload.password && payload.password.trim() !== "") {
            payload.password = await bcrypt.hash(payload.password, 10);
        } else {
            delete payload.password; // Don't overwrite if empty
        }

        // Strip id from set payload
        const { id, ...setPayload } = payload;

        if (id) {
            // Guard: can't edit Super Admin unless actor is Super Admin
            const existing = await db.select().from(operators).where(eq(operators.id, id));
            if (existing.length > 0 && existing[0].isSuperAdmin && actorName !== "Super Admin") {
                return { success: false, error: "Cannot modify Super Admin account." };
            }
            await db.update(operators).set(setPayload).where(eq(operators.id, id));
            await logAdminAction("UPDATE_OPERATOR", data.name, `Updated by ${actorName}`, "OPERATOR", actorName);
        } else {
            await db.insert(operators).values(setPayload);
            await logAdminAction("CREATE_OPERATOR", data.name, `Created by ${actorName}`, "OPERATOR", actorName);
        }
        revalidatePath("/admin/operators");
        return { success: true };
    } catch (e: any) {
        console.error("Manage operator failed:", e);
        return { success: false, error: e?.message || "Operation failed." };
    }
}

// ─── Change Super Admin credentials ──────────────────────────────────────────
export async function changeSuperAdminCredentials(
    currentPassword: string,
    newLoginId: string,
    newPassword: string
) {
    try {
        const result = await db.select().from(operators).where(eq(operators.isSuperAdmin, true));
        if (result.length === 0) {
            return { success: false, error: "Super Admin not found." };
        }
        const sa = result[0];
        if (sa.password) {
            const match = await bcrypt.compare(currentPassword, sa.password);
            if (!match) return { success: false, error: "Current password incorrect." };
        }

        const updates: any = {};
        if (newLoginId.trim()) updates.loginId = newLoginId.trim();
        if (newPassword.trim()) updates.password = await bcrypt.hash(newPassword.trim(), 10);

        await db.update(operators).set(updates).where(eq(operators.id, sa.id));
        await logAdminAction("CHANGE_SUPER_ADMIN_CREDENTIALS", sa.name, "Credentials updated", "AUTH", sa.name, sa.id);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e?.message || "Failed to change credentials." };
    }
}

// ─── Delete operator (Super Admin can, regular operators cannot delete SA) ────
export async function deleteOperatorSecure(
    targetId: string,
    actorIsSuperAdmin: boolean,
    actorName: string = "Unknown"
) {
    try {
        const target = await db.select().from(operators).where(eq(operators.id, targetId));
        if (target.length === 0) return { success: false, error: "Operator not found." };

        if (target[0].isSuperAdmin) {
            return { success: false, error: "The Super Admin account cannot be deleted." };
        }
        if (!actorIsSuperAdmin) {
            return { success: false, error: "Only Super Admin can delete operators." };
        }

        await db.delete(operators).where(eq(operators.id, targetId));
        await logAdminAction("DELETE_OPERATOR", target[0].name, `Deleted by ${actorName}`, "OPERATOR", actorName);
        revalidatePath("/admin/operators");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e?.message || "Delete failed." };
    }
}

// ─── Suspend / Unsuspend operator ────────────────────────────────────────────
export async function suspendOperator(
    targetId: string,
    suspend: boolean,
    actorName: string = "Super Admin"
) {
    try {
        const target = await db.select().from(operators).where(eq(operators.id, targetId));
        if (target.length === 0) return { success: false, error: "Not found." };
        if (target[0].isSuperAdmin) return { success: false, error: "Cannot suspend Super Admin." };

        await db.update(operators).set({ status: suspend ? "Suspended" : "Active" }).where(eq(operators.id, targetId));
        await logAdminAction(
            suspend ? "SUSPEND_OPERATOR" : "UNSUSPEND_OPERATOR",
            target[0].name,
            `${suspend ? "Suspended" : "Reinstated"} by ${actorName}`,
            "OPERATOR",
            actorName
        );
        revalidatePath("/admin/operators");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e?.message };
    }
}

// ─── Initialize Super Admin (one-time setup if not exists) ────────────────────
export async function initSuperAdmin() {
    try {
        const existing = await db.select().from(operators).where(eq(operators.isSuperAdmin, true));
        if (existing.length > 0) return existing[0];

        const hashedPw = await bcrypt.hash("superadmin2026", 10);
        const result = await db.insert(operators).values({
            name: "Super Admin",
            loginId: "SADMIN",
            password: hashedPw,
            role: "SuperAdmin",
            isSuperAdmin: true,
            status: "Active",
        }).returning();

        await logAdminAction("INIT_SUPER_ADMIN", "Super Admin", "Super Admin account initialized", "AUTH");
        return result[0];
    } catch (e: any) {
        console.error("initSuperAdmin failed:", e);
        return null;
    }
}

// ─── Promote a registered user to Operator (Super Admin only) ─────────────────
export async function promoteUserToOperator(
    userId: string,
    role: string = "Operator",
    actorName: string = "Super Admin"
) {
    try {
        // Fetch the user
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        if (userResult.length === 0) return { success: false, error: "User not found." };
        const user = userResult[0];

        // Auto-generate unique login ID: OP- + 6 random alphanumeric chars
        const randomSuffix = Math.random().toString(36).toUpperCase().slice(2, 8);
        const loginId = `OP-${randomSuffix}`;

        // Auto-generate a random 10-char password
        const rawPassword = Math.random().toString(36).slice(2, 8).toUpperCase() +
            Math.random().toString(36).slice(2, 6) + "!";
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Create operator row
        await db.insert(operators).values({
            name: user.name,
            loginId,
            password: hashedPassword,
            role,
            isSuperAdmin: false,
            status: "Active",
        });

        await logAdminAction(
            "PROMOTE_USER_TO_OPERATOR",
            user.name,
            `Promoted by ${actorName} | Email: ${user.email} | Role: ${role} | Login ID: ${loginId}`,
            "OPERATOR",
            actorName
        );

        revalidatePath("/admin/users");
        revalidatePath("/admin/operators");

        return {
            success: true,
            credentials: {
                name: user.name,
                loginId,
                password: rawPassword,  // plain text — shown once to SA
            }
        };
    } catch (e: any) {
        console.error("promoteUserToOperator failed:", e);
        return { success: false, error: e?.message || "Promotion failed." };
    }
}

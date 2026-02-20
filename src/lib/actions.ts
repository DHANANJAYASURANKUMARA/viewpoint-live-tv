"use server";

import { db } from "./db";
import { channels, favorites, settings, operators } from "./schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getChannels() {
    try {
        return await db.select().from(channels);
    } catch (error) {
        console.error("Failed to fetch channels:", error);
        return [];
    }
}

export async function getFavorites(userId: string = "default_user") {
    try {
        return await db.select().from(favorites).where(eq(favorites.userId, userId));
    } catch (error) {
        console.error("Failed to fetch favorites:", error);
        return [];
    }
}

export async function toggleFavorite(channelId: string, userId: string = "default_user") {
    try {
        const existing = await db
            .select()
            .from(favorites)
            .where(and(eq(favorites.channelId, channelId), eq(favorites.userId, userId)));

        if (existing.length > 0) {
            await db
                .delete(favorites)
                .where(and(eq(favorites.channelId, channelId), eq(favorites.userId, userId)));
        } else {
            await db.insert(favorites).values({
                channelId,
                userId,
            });
        }
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle favorite:", error);
        return { success: false };
    }
}

export async function getSettings(userId: string = "default_user") {
    try {
        const data = await db.select().from(settings).where(eq(settings.userId, userId));
        return data.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return {};
    }
}

export async function updateSetting(key: string, value: string, userId: string = "default_user") {
    try {
        const existing = await db
            .select()
            .from(settings)
            .where(and(eq(settings.key, key), eq(settings.userId, userId)));

        if (existing.length > 0) {
            await db
                .update(settings)
                .set({ value, updatedAt: new Date() })
                .where(and(eq(settings.key, key), eq(settings.userId, userId)));
        } else {
            await db.insert(settings).values({
                key,
                value,
                userId,
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to update setting:", error);
        return { success: false };
    }
}

export async function getOperators() {
    try {
        return await db.select().from(operators).orderBy(operators.name);
    } catch (error) {
        console.error("Failed to fetch operators:", error);
        return [];
    }
}

export async function manageOperator(data: any) {
    try {
        if (data.id) {
            await db.update(operators).set(data).where(eq(operators.id, data.id));
        } else {
            await db.insert(operators).values(data);
        }
        revalidatePath("/admin/operators");
        return { success: true };
    } catch (error) {
        console.error("Failed to manage operator:", error);
        return { success: false };
    }
}

export async function deleteOperator(id: string) {
    try {
        await db.delete(operators).where(eq(operators.id, id));
        revalidatePath("/admin/operators");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete operator:", error);
        return { success: false };
    }
}

export async function updateChannel(id: string, data: any) {
    try {
        await db.update(channels).set(data).where(eq(channels.id, id));
        revalidatePath("/admin/signals");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to update channel:", error);
        return { success: false };
    }
}

export async function deleteChannel(id: string) {
    try {
        await db.delete(channels).where(eq(channels.id, id));
        revalidatePath("/admin/signals");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete channel:", error);
        return { success: false };
    }
}

export async function addChannel(data: any) {
    try {
        await db.insert(channels).values(data);
        revalidatePath("/admin/signals");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to add channel:", error);
        return { success: false };
    }
}

export async function seedChannels(initialChannels: any[]) {
    try {
        let count = 0;
        for (const channel of initialChannels) {
            const existing = await db.select().from(channels).where(eq(channels.id, channel.id));
            if (existing.length === 0) {
                await db.insert(channels).values({
                    id: channel.id.toString(),
                    name: channel.name,
                    url: channel.url,
                    category: channel.category,
                    logo: channel.logo || "📡",
                    viewers: channel.viewers || "0",
                    trending: channel.trending || false,
                    status: "Live"
                });
                count++;
            }
        }
        revalidatePath("/admin/signals");
        revalidatePath("/");
        return { success: true, count };
    } catch (error) {
        console.error("Failed to seed channels:", error);
        return { success: false, count: 0 };
    }
}

export async function getDbStats() {
    try {
        const channelCount = await db.select().from(channels);
        const operatorCount = await db.select().from(operators);
        const favoriteCount = await db.select().from(favorites);
        const settingCount = await db.select().from(settings);

        return {
            success: true,
            stats: {
                channels: channelCount.length,
                operators: operatorCount.length,
                favorites: favoriteCount.length,
                settings: settingCount.length,
            }
        };
    } catch (error) {
        console.error("Failed to fetch DB stats:", error);
        return { success: false, stats: null };
    }
}

export async function clearTable(tableName: "channels" | "operators" | "favorites" | "settings") {
    try {
        if (tableName === "channels") await db.delete(channels);
        else if (tableName === "operators") await db.delete(operators);
        else if (tableName === "favorites") await db.delete(favorites);
        else if (tableName === "settings") await db.delete(settings);

        revalidatePath("/admin/database");
        revalidatePath("/admin/signals");
        revalidatePath("/admin/operators");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error(`Failed to clear table ${tableName}:`, error);
        return { success: false };
    }
}

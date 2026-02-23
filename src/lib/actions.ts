"use server";

import { db } from "./db";
import { channels, operators, favorites, settings, users, adminLogs, notifications, chatMessages, messageReactions, friendships, directMessages } from "./schema";
import { eq, and, sql, desc, lt, or, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

interface SignalData {
    id: string;
    name: string;
    url: string;
    category: string;
    status?: string;
    sniMask?: string;
    proxyActive?: boolean;
    scheduledAt?: Date | null;
    logo?: string | null;
    viewers?: string | null;
    trending?: boolean;
}

export async function getChannels() {
    try {
        const allChannels = await db.select().from(channels);
        const now = new Date();
        let updatedCount = 0;

        // Auto-activation logic: If a channel is "Scheduled" and its scheduledAt time has passed,
        // we update it to "Live" in the database and return the updated state.
        const processedChannels = await Promise.all(allChannels.map(async (channel: any) => {
            if (channel.status === 'Scheduled' && channel.scheduledAt) {
                const scheduledDate = new Date(channel.scheduledAt);
                if (scheduledDate <= now) {
                    await db.update(channels)
                        .set({ status: 'Live' })
                        .where(eq(channels.id, channel.id));
                    updatedCount++;
                    return { ...channel, status: 'Live' };
                }
            }
            return channel;
        }));

        if (updatedCount > 0) {
            revalidatePath("/");
            revalidatePath("/admin/signals");
            revalidatePath("/admin/dashboard");
        }

        return processedChannels;
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
        return data.reduce((acc: any, curr: any) => {
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
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to update setting:", error);
        return { success: false };
    }
}

export async function createChannel(data: Partial<SignalData>) {
    try {
        await db.insert(channels).values(data as any);
        revalidatePath("/admin/signals");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add channel:", error);
        return { success: false, error: error?.message || "Unknown error" };
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
        const payload = { ...data };

        // Hash password if provided during creation or update
        if (payload.password) {
            const salt = await bcrypt.genSalt(10);
            payload.password = await bcrypt.hash(payload.password, salt);
        }

        if (payload.id) {
            await db.update(operators).set(payload).where(eq(operators.id, payload.id));
        } else {
            await db.insert(operators).values(payload);
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

export async function votePoll(pollId: string, optionIndex: number) {
    const cookieStore = await cookies();
    const session = cookieStore.get("vpoint-user")?.value;
    if (!session) return { success: false, error: "Authentication required" };

    try {
        const user = JSON.parse(session);
        const userId = user.id;
    } catch (error: any) {
        console.error("Failed to vote poll:", error);
        return { success: false, error: error?.message || "Unknown error" };
    }
}

export async function updateChannel(id: string, data: Partial<typeof channels.$inferInsert>) {
    try {
        // Strip id from data to prevent unique constraint conflict during update
        const { id: _, ...updateData } = data as any;
        await db.update(channels).set(updateData).where(eq(channels.id, id));
        revalidatePath("/admin/signals");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update channel:", error);
        return { success: false, error: error?.message || "Unknown error" };
    }
}

export async function deleteChannel(id: string) {
    try {
        await db.delete(channels).where(eq(channels.id, id));
        return { success: true };
    } catch (error: unknown) {
        const e = error as Error;
        return { success: false, error: e.message };
    }
}

export async function addChannel(data: any) {
    try {
        const payload = { ...data };
        // Apply default SNI mask if enabled and not provided
        const dbSettings = await getSettings();
        const isMaskingEnabled = dbSettings.isMaskingEnabled === "true";
        const globalSniMask = dbSettings.globalSniMask || "m.facebook.com";

        if (isMaskingEnabled && !payload.sniMask) {
            payload.sniMask = globalSniMask;
            payload.proxyActive = true;
        }

        await db.insert(channels).values(payload);
        revalidatePath("/admin/signals");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add channel:", error);
        return { success: false, error: error?.message || "Unknown error" };
    }
}

export async function bulkMaskChannels(mask: string) {
    try {
        await db.update(channels).set({
            sniMask: mask,
            proxyActive: true
        });
        revalidatePath("/admin/signals");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to bulk mask channels:", error);
        return { success: false, error: error?.message || "Unknown error" };
    }
}

export async function seedChannels(initialChannels: any[]) {
    try {
        let count = 0;
        for (const channel of initialChannels) {
            const existing = await db.select().from(channels).where(eq(channels.id, channel.id));
            if (existing.length === 0) {
                // Get global masking settings for seeding
                const dbSettings = await getSettings();
                const isMaskingEnabled = dbSettings.isMaskingEnabled === "true";
                const globalSniMask = dbSettings.globalSniMask || "m.facebook.com";

                await db.insert(channels).values({
                    id: channel.id.toString(),
                    name: channel.name,
                    url: channel.url,
                    category: channel.category,
                    logo: channel.logo || "📡",
                    viewers: channel.viewers || "0",
                    trending: channel.trending || false,
                    sniMask: channel.sniMask || (isMaskingEnabled ? globalSniMask : ""),
                    proxyActive: channel.proxyActive || isMaskingEnabled,
                    status: "Live"
                });
                count++;
            }
        }
        revalidatePath("/admin/signals");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true, count };
    } catch (error: any) {
        console.error("Failed to seed channels:", error);
        return { success: false, count: 0, error: error?.message || "Unknown error" };
    }
}

export async function getDbStats() {
    try {
        const channelCount = await db.select().from(channels);
        const operatorCount = await db.select().from(operators);
        const favoriteCount = await db.select().from(favorites);
        const settingCount = await db.select().from(settings);
        const userCount = await db.select().from(users);

        return {
            success: true,
            stats: {
                channels: channelCount.length,
                operators: operatorCount.length,
                favorites: favoriteCount.length,
                settings: settingCount.length,
                users: userCount.length,
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

export async function getUsers() {
    try {
        return await db.select({
            id: users.id,
            name: users.name,
            displayName: users.displayName,
            email: users.email,
            country: users.country,
            location: users.location,
            device: users.device,
            browser: users.browser,
            birthday: users.birthday,
            lastLogin: users.lastLogin,
            isBanned: users.isBanned,
            isPrivate: users.isPrivate,
            facebook: users.facebook,
            createdAt: users.createdAt,
        }).from(users).orderBy(users.createdAt);
    } catch (error: any) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function banUser(id: string, ban: boolean) {
    try {
        await db.update(users).set({ isBanned: ban }).where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to ban/unban user:", error);
        return { success: false, error: error?.message };
    }
}

export async function deleteUser(id: string) {
    try {
        await db.delete(users).where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete user:", error);
        return { success: false, error: error?.message };
    }
}

export async function getActiveOperatorCount() {
    try {
        const all = await db.select().from(operators).where(eq(operators.status, "Active"));
        return { success: true, count: all.length };
    } catch (error) {
        return { success: false, count: 0 };
    }
}

export async function getNotifications(onlyActive: boolean = false) {
    try {
        let query = db.select().from(notifications);

        if (onlyActive) {
            query = query.where(eq(notifications.isActive, true)) as any;
        }

        return await query.orderBy(desc(notifications.createdAt));
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

export async function markNotificationAsRead(id: string) {
    try {
        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
        revalidatePath("/");
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        return { success: false };
    }
}

export async function sendGlobalNotification(data: { title: string; message: string; type: string }) {
    try {
        await db.insert(notifications).values({
            title: data.title,
            message: data.message,
            type: data.type,
        });
        revalidatePath("/");
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to send global notification:", error);
        return { success: false };
    }
}

export async function deleteNotification(id: string) {
    try {
        await db.delete(notifications).where(eq(notifications.id, id));
        revalidatePath("/");
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return { success: false };
    }
}

interface UpdateData {
    title?: string;
    message?: string;
    type?: string;
    isActive?: boolean;
}

export async function updateNotification(id: string, data: UpdateData) {
    try {
        await db.update(notifications).set(data).where(eq(notifications.id, id));
        revalidatePath("/");
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to update notification:", error);
        return { success: false };
    }
}

export async function clearNotifications() {
    try {
        await db.delete(notifications);
        revalidatePath("/");
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to clear notifications:", error);
        return { success: false };
    }
}

export async function bulkUpdateChannelMasks(mask: string) {
    try {
        await db.update(channels).set({ sniMask: mask });
        revalidatePath("/");
        revalidatePath("/admin"); // Assuming channels are listed here or similar
        return { success: true };
    } catch (error) {
        console.error("Failed to bulk update masks:", error);
        return { success: false };
    }
}

export async function updateUserProfile(userId: string, data: any) {
    try {
        await db.update(users).set(data).where(eq(users.id, userId));
        revalidatePath("/nexus");
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update user profile:", error);
        return { success: false, error: error?.message };
    }
}

export async function getSystemConfig() {
    try {
        const dbSettings = await getSettings();
        return {
            version: dbSettings.version || "2.1.0",
            maintenanceMode: dbSettings.maintenanceMode === "true",
            maintenanceMessage: dbSettings.maintenanceMessage || "The Viewpoint matrix is currently undergoing scheduled structural refinement.",
            updateLog: dbSettings.updateLog || "[]",
        };
    } catch (error) {
        console.error("Failed to fetch system config:", error);
        return null;
    }
}

export async function getUserProfile(userId: string) {
    try {
        const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
    }
}

export async function getChatMessages(channelId?: string) {
    try {
        // Auto-cleanup: remove messages older than 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await db.delete(chatMessages).where(lt(chatMessages.createdAt, twentyFourHoursAgo));

        let query = db.select().from(chatMessages);
        if (channelId) {
            query = query.where(eq(chatMessages.channelId, channelId)) as any;
        }
        return await query.orderBy(desc(chatMessages.createdAt)).limit(100);
    } catch (error) {
        console.error("Failed to fetch chat messages:", error);
        return [];
    }
}

export async function sendChatMessage(data: { userId: string; userName: string; message: string; channelId?: string; replyToId?: string }) {
    try {
        await db.insert(chatMessages).values({
            userId: data.userId,
            userName: data.userName,
            message: data.message,
            channelId: data.channelId || null,
            replyToId: data.replyToId || null,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to send chat message:", error);
        return { success: false };
    }
}

export async function addMessageReaction(messageId: string, userId: string, userName: string, emoji: string) {
    try {
        // Enforce one reaction per user: delete any existing reactions for this message by this user
        await db.delete(messageReactions).where(
            and(
                eq(messageReactions.messageId, messageId),
                eq(messageReactions.userName, userName)
            )
        );

        await db.insert(messageReactions).values({
            messageId,
            userId,
            userName,
            emoji
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getMessageReactions(messageId: string) {
    try {
        return await db.select().from(messageReactions).where(eq(messageReactions.messageId, messageId));
    } catch (error) {
        return [];
    }
}

// Social Networking: Friendships
export async function sendFriendRequest(requesterId: string, receiverId: string) {
    try {
        const existing = await db.select().from(friendships).where(
            or(
                and(eq(friendships.requesterId, requesterId), eq(friendships.receiverId, receiverId)),
                and(eq(friendships.requesterId, receiverId), eq(friendships.receiverId, requesterId))
            )
        );

        if (existing.length > 0) return { success: false, error: "Relationship already exists" };

        await db.insert(friendships).values({ requesterId, receiverId });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function handleFriendRequest(requestId: string, status: "ACCEPTED" | "REJECTED") {
    try {
        if (status === "REJECTED") {
            await db.delete(friendships).where(eq(friendships.id, requestId));
        } else {
            await db.update(friendships).set({ status }).where(eq(friendships.id, requestId));
        }
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getFriends(userId: string) {
    try {
        const friends = await db.select().from(friendships).where(
            and(
                or(eq(friendships.requesterId, userId), eq(friendships.receiverId, userId)),
                eq(friendships.status, "ACCEPTED")
            )
        );
        return friends;
    } catch (error) {
        return [];
    }
}

// Direct Messaging
export async function sendDirectMessage(senderId: string, senderName: string, receiverId: string, message: string) {
    try {
        await db.insert(directMessages).values({
            senderId,
            senderName,
            receiverId,
            message
        });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getDirectMessages(userId: string, targetId: string) {
    try {
        return await db.select().from(directMessages).where(
            or(
                and(eq(directMessages.senderId, userId), eq(directMessages.receiverId, targetId)),
                and(eq(directMessages.senderId, targetId), eq(directMessages.receiverId, userId))
            )
        ).orderBy(desc(directMessages.createdAt)).limit(50);
    } catch (error) {
        return [];
    }
}

export async function updatePrivacySettings(userId: string, isPrivate: boolean) {
    try {
        await db.update(users).set({ isPrivate }).where(eq(users.id, userId));
        revalidatePath("/nexus");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const channels = pgTable("channels", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    category: text("category").notNull(),
    logo: text("logo"),
    viewers: text("viewers").default("0"),
    trending: boolean("trending").default(false),
    sniMask: text("sni_mask").default(""),
    proxyActive: boolean("proxy_active").default(false),
    status: text("status").default("Live"), // Live, Offline, Scheduled
    scheduledAt: timestamp("scheduled_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const operators = pgTable("operators", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    loginId: text("login_id").unique(), // Operator login ID (e.g. "OP-001")
    password: text("password"), // Hashed password
    role: text("role").notNull().default("Operator"), // SuperAdmin, Lead, Operator, Analyst, Moderator
    isSuperAdmin: boolean("is_super_admin").default(false),
    lastActive: timestamp("last_active").defaultNow(),
    status: text("status").default("Active"), // Active, Suspended
    createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().default("default_user"),
    channelId: text("channel_id").notNull().references(() => channels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().default("default_user"),
    key: text("key").notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    displayName: text("display_name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    birthday: timestamp("birthday"),
    profilePicture: text("profile_picture"),
    bio: text("bio"),
    socialLinks: text("social_links"), // Store as JSON string
    country: text("country").default("Unknown"),
    location: text("location").default("Unknown"),
    device: text("device").default("Unknown"),
    browser: text("browser").default("Unknown"),
    lastLogin: timestamp("last_login"),
    isBanned: boolean("is_banned").default(false),
    hobbies: text("hobbies"),
    hideProfile: boolean("hide_profile").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    operatorName: text("operator_name").notNull().default("System"),
    operatorId: text("operator_id"),
    action: text("action").notNull(), // e.g. "BAN_USER", "CHANGE_PASSWORD", "DELETE_OPERATOR"
    target: text("target"), // Who/what was affected
    detail: text("detail"), // Extra detail / change description
    category: text("category").default("SYSTEM"), // AUTH, CONFIG, OPERATOR, USER, SIGNAL
    createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").notNull().default("INFO"), // INFO, ALERT, SUCCESS, WARNING
    isRead: boolean("is_read").default(false),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

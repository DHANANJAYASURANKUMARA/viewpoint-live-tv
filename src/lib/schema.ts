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
    password: text("password"), // Hashed password
    role: text("role").notNull().default("Operator"), // Lead, Operator, Analyst, Admin, Moderator
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
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    country: text("country").default("Unknown"),
    device: text("device").default("Unknown"),
    lastLogin: timestamp("last_login"),
    isBanned: boolean("is_banned").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

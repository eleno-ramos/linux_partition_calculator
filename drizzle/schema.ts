import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Visitors table for tracking global usage
export const visitors = mysqlTable("visitors", {
  id: int("id").autoincrement().primaryKey(),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(), // IPv4 or IPv6
  country: varchar("country", { length: 100 }),
  continent: varchar("continent", { length: 100 }),
  countryCode: varchar("countryCode", { length: 2 }),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  userAgent: text("userAgent"),
  visitedAt: timestamp("visitedAt").defaultNow().notNull(),
});

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = typeof visitors.$inferInsert;

// Partition configurations saved by users
export const savedConfigurations = mysqlTable("savedConfigurations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  diskSize: int("diskSize").notNull(),
  ramSize: int("ramSize").notNull(),
  distro: varchar("distro", { length: 50 }).notNull(),
  processor: varchar("processor", { length: 50 }).notNull(),
  firmware: varchar("firmware", { length: 20 }).notNull(),
  diskType: varchar("diskType", { length: 10 }).notNull(),
  hibernation: int("hibernation").default(0).notNull(),
  useLVM: int("useLVM").default(0).notNull(),
  systemPercentage: int("systemPercentage").default(20).notNull(),
  includeHome: int("includeHome").default(1).notNull(),
  username: varchar("username", { length: 255 }),
  wifiSSID: varchar("wifiSSID", { length: 255 }),
  wifiPassword: varchar("wifiPassword", { length: 255 }),
  hostname: varchar("hostname", { length: 255 }),
  timezone: varchar("timezone", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedConfiguration = typeof savedConfigurations.$inferSelect;
export type InsertSavedConfiguration = typeof savedConfigurations.$inferInsert;

// Reviews and ratings
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Share tracking
export const shares = mysqlTable("shares", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // whatsapp, facebook, instagram, email
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
});

export type Share = typeof shares.$inferSelect;
export type InsertShare = typeof shares.$inferInsert;

// Analytics data
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  totalVisitors: int("totalVisitors").default(0).notNull(),
  totalShares: int("totalShares").default(0).notNull(),
  totalReviews: int("totalReviews").default(0).notNull(),
  averageRating: varchar("averageRating", { length: 10 }),
  topCountries: text("topCountries"), // JSON array
  topContinents: text("topContinents"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;
// Audit log for admin actions
export const auditLog = mysqlTable("auditLog", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(), // ID do admin que realizou a ação
  action: varchar("action", { length: 50 }).notNull(), // promote, demote, delete, etc
  targetUserId: int("targetUserId"), // ID do usuário afetado
  targetUserName: varchar("targetUserName", { length: 255 }),
  targetUserEmail: varchar("targetUserEmail", { length: 320 }),
  oldRole: mysqlEnum("oldRole", ["user", "admin"]),
  newRole: mysqlEnum("newRole", ["user", "admin"]),
  reason: text("reason"), // Motivo da ação
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  status: mysqlEnum("status", ["success", "failed"]).default("success").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

// Admin authentication table
export const adminAuth = mysqlTable("adminAuth", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  lastPasswordChange: timestamp("lastPasswordChange").defaultNow().notNull(),
  passwordResetToken: varchar("passwordResetToken", { length: 255 }),
  passwordResetExpires: timestamp("passwordResetExpires"),
  googleId: varchar("googleId", { length: 255 }).unique(),
  twoFactorEnabled: int("twoFactorEnabled").default(0).notNull(), // 0 = false, 1 = true
  twoFactorSecret: text("twoFactorSecret"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminAuth = typeof adminAuth.$inferSelect;
export type InsertAdminAuth = typeof adminAuth.$inferInsert;

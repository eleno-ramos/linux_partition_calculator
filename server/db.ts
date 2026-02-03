import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, visitors, InsertVisitor, reviews, InsertReview, shares, InsertShare, savedConfigurations, InsertSavedConfiguration, analytics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Visitor tracking functions
export async function trackVisitor(visitor: InsertVisitor): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track visitor: database not available");
    return;
  }

  try {
    await db.insert(visitors).values(visitor);
  } catch (error) {
    console.error("[Database] Failed to track visitor:", error);
  }
}

export async function getVisitorStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const totalVisitors = await db.select({ count: sql`COUNT(*)` }).from(visitors);
    const topCountries = await db.select({ country: visitors.country, count: sql`COUNT(*) as count` }).from(visitors).where(sql`${visitors.country} IS NOT NULL`).groupBy(visitors.country).orderBy(desc(sql`count`)).limit(10);
    const topContinents = await db.select({ continent: visitors.continent, count: sql`COUNT(*) as count` }).from(visitors).where(sql`${visitors.continent} IS NOT NULL`).groupBy(visitors.continent).orderBy(desc(sql`count`)).limit(10);

    return {
      totalVisitors: (totalVisitors[0]?.count as number) || 0,
      topCountries,
      topContinents,
    };
  } catch (error) {
    console.error("[Database] Failed to get visitor stats:", error);
    return null;
  }
}

// Review functions
export async function addReview(review: InsertReview): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add review: database not available");
    return;
  }

  try {
    await db.insert(reviews).values(review);
  } catch (error) {
    console.error("[Database] Failed to add review:", error);
  }
}

export async function getReviews() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(50);
  } catch (error) {
    console.error("[Database] Failed to get reviews:", error);
    return [];
  }
}

export async function getReviewStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const stats = await db.select({ count: sql`COUNT(*)`, avgRating: sql`AVG(${reviews.rating})` }).from(reviews);
    return {
      totalReviews: (stats[0]?.count as number) || 0,
      averageRating: parseFloat((stats[0]?.avgRating as string) || "0"),
    };
  } catch (error) {
    console.error("[Database] Failed to get review stats:", error);
    return null;
  }
}

// Share tracking functions
export async function trackShare(share: InsertShare): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track share: database not available");
    return;
  }

  try {
    await db.insert(shares).values(share);
  } catch (error) {
    console.error("[Database] Failed to track share:", error);
  }
}

export async function getShareStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const totalShares = await db.select({ count: sql`COUNT(*)` }).from(shares);
    const sharesByPlatform = await db.select({ platform: shares.platform, count: sql`COUNT(*) as count` }).from(shares).groupBy(shares.platform).orderBy(desc(sql`count`));

    return {
      totalShares: (totalShares[0]?.count as number) || 0,
      byPlatform: sharesByPlatform,
    };
  } catch (error) {
    console.error("[Database] Failed to get share stats:", error);
    return null;
  }
}

// Saved configurations functions
export async function saveConfiguration(config: InsertSavedConfiguration): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save configuration: database not available");
    return;
  }

  try {
    await db.insert(savedConfigurations).values(config);
  } catch (error) {
    console.error("[Database] Failed to save configuration:", error);
  }
}

export async function getUserConfigurations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(savedConfigurations).where(eq(savedConfigurations.userId, userId)).orderBy(desc(savedConfigurations.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get user configurations:", error);
    return [];
  }
}

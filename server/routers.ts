import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { trackVisitor, getVisitorStats, addReview, getReviews, getReviewStats, trackShare, getShareStats } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Analytics and visitor tracking
  analytics: router({
    trackVisitor: publicProcedure
      .input(
        z.object({
          ipAddress: z.string(),
          country: z.string().optional(),
          continent: z.string().optional(),
          countryCode: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await trackVisitor(input);
        return { success: true };
      }),

    getStats: publicProcedure.query(async () => {
      return await getVisitorStats();
    }),
  }),

  // Reviews and ratings
  reviews: router({
    add: publicProcedure
      .input(
        z.object({
          visitorId: z.string(),
          name: z.string(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await addReview(input);
        return { success: true };
      }),

    list: publicProcedure.query(async () => {
      return await getReviews();
    }),

    stats: publicProcedure.query(async () => {
      return await getReviewStats();
    }),
  }),

  // Share tracking
  shares: router({
    track: publicProcedure
      .input(
        z.object({
          visitorId: z.string(),
          platform: z.enum(["whatsapp", "facebook", "instagram", "email"]),
        })
      )
      .mutation(async ({ input }) => {
        await trackShare(input);
        return { success: true };
      }),

    stats: publicProcedure.query(async () => {
      return await getShareStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;

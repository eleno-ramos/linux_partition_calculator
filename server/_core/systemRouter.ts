import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getVisitorCountry: publicProcedure.query(({ ctx }) => {
    const ipAddress = (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0] || 
                      ctx.req.socket?.remoteAddress || 
                      "0.0.0.0";

    let country = "BR";
    let continent = "SA";

    const ipParts = ipAddress.split(".");
    if (ipParts[0]) {
      const firstOctet = parseInt(ipParts[0]);
      // Ranges brasileiros comuns
      if ((firstOctet >= 177 && firstOctet <= 179) || 
          (firstOctet >= 187 && firstOctet <= 189) ||
          (firstOctet >= 200 && firstOctet <= 201)) {
        country = "BR";
        continent = "SA";
      } else {
        country = "OTHER";
        continent = "OTHER";
      }
    }

    return {
      country,
      continent,
      ipAddress,
    };
  }),
});

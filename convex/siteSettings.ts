import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSiteSettings = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("siteSettings").first();
    },
});

export const updateSiteSettings = mutation({
    args: {
        heroTitle: v.string(),
        heroDescription: v.string(),
        teacherId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteSettings").first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                heroTitle: args.heroTitle,
                heroDescription: args.heroDescription,
                updatedBy: args.teacherId,
                updatedAt: Date.now(),
            });
        } else {
            await ctx.db.insert("siteSettings", {
                heroTitle: args.heroTitle,
                heroDescription: args.heroDescription,
                updatedBy: args.teacherId,
                updatedAt: Date.now(),
            });
        }
    },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        role: v.union(v.literal("teacher"), v.literal("student")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (user) {
            // Update existing user
            await ctx.db.patch(user._id, {
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
                role: args.role,
            });
            return user._id;
        }

        // Create new user
        return await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            imageUrl: args.imageUrl,
            clerkId: args.clerkId,
            role: args.role,
        });
    },
});

export const getUser = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();
    },
});

// Manual sync function for existing users
export const syncUserManually = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        role: v.union(v.literal("teacher"), v.literal("student")),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // Update existing user with new role and info
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
                role: args.role,
            });
            return { success: true, message: "Profile updated successfully", userId: existingUser._id };
        }

        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            imageUrl: args.imageUrl,
            clerkId: args.clerkId,
            role: args.role,
        });

        return { success: true, message: "User synced successfully", userId };
    },
});

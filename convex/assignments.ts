import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAssignment = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        dueDate: v.string(),
        subject: v.string(),
        link: v.optional(v.string()),
        teacherId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("assignments", {
            title: args.title,
            description: args.description,
            dueDate: args.dueDate,
            subject: args.subject,
            link: args.link,
            teacherId: args.teacherId,
        });
    },
});

export const getAssignments = query({
    handler: async (ctx) => {
        const assignments = await ctx.db.query("assignments").order("desc").collect();
        return Promise.all(
            assignments.map(async (assignment) => {
                const teacher = await ctx.db.get(assignment.teacherId);
                return { ...assignment, teacherName: teacher?.name };
            })
        );
    },
});

export const deleteAssignment = mutation({
    args: { assignmentId: v.id("assignments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.assignmentId);
    },
});

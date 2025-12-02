import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track an assignment view
export const trackAssignmentView = mutation({
    args: {
        assignmentId: v.id("assignments"),
        studentId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if already viewed by this student
        const existing = await ctx.db
            .query("assignmentViews")
            .withIndex("by_assignment_id", (q) => q.eq("assignmentId", args.assignmentId))
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        if (!existing) {
            await ctx.db.insert("assignmentViews", {
                assignmentId: args.assignmentId,
                studentId: args.studentId,
                viewedAt: Date.now(),
            });
        }
    },
});

// Get view stats for an assignment
export const getAssignmentViews = query({
    args: { assignmentId: v.id("assignments") },
    handler: async (ctx, args) => {
        const views = await ctx.db
            .query("assignmentViews")
            .withIndex("by_assignment_id", (q) => q.eq("assignmentId", args.assignmentId))
            .collect();

        // Get student details
        const viewsWithStudents = await Promise.all(
            views.map(async (view) => {
                const student = await ctx.db.get(view.studentId);
                return {
                    ...view,
                    studentName: student?.name || "Unknown",
                    studentEmail: student?.email || "",
                };
            })
        );

        return viewsWithStudents;
    },
});

// Get total views for all assignments by a teacher
export const getTeacherAssignmentStats = query({
    args: { teacherId: v.id("users") },
    handler: async (ctx, args) => {
        // Get all assignments by this teacher
        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_teacher_id", (q) => q.eq("teacherId", args.teacherId))
            .collect();

        // Get view count for each assignment
        const stats = await Promise.all(
            assignments.map(async (assignment) => {
                const views = await ctx.db
                    .query("assignmentViews")
                    .withIndex("by_assignment_id", (q) => q.eq("assignmentId", assignment._id))
                    .collect();

                return {
                    assignmentId: assignment._id,
                    assignmentTitle: assignment.title,
                    assignmentSubject: assignment.subject,
                    viewCount: views.length,
                };
            })
        );

        return stats;
    },
});

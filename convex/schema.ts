import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        role: v.union(v.literal("teacher"), v.literal("student")),
    }).index("by_clerk_id", ["clerkId"]),

    notes: defineTable({
        title: v.string(),
        content: v.string(), // Could be HTML or Markdown
        fileUrl: v.optional(v.string()), // For uploaded files
        fileStorageId: v.optional(v.id("_storage")), // Convex file storage ID
        teacherId: v.id("users"),
        subject: v.string(),
    }).index("by_teacher_id", ["teacherId"]),

    assignments: defineTable({
        title: v.string(),
        description: v.string(),
        dueDate: v.string(), // ISO date string
        teacherId: v.id("users"),
        subject: v.string(),
        link: v.optional(v.string()),
    }).index("by_teacher_id", ["teacherId"]),

    downloads: defineTable({
        noteId: v.id("notes"),
        studentId: v.id("users"),
        downloadedAt: v.number(), // timestamp
    })
        .index("by_note_id", ["noteId"])
        .index("by_student_id", ["studentId"]),

    assignmentViews: defineTable({
        assignmentId: v.id("assignments"),
        studentId: v.id("users"),
        viewedAt: v.number(), // timestamp
    })
        .index("by_assignment_id", ["assignmentId"])
        .index("by_student_id", ["studentId"]),

    siteSettings: defineTable({
        heroTitle: v.string(),
        heroDescription: v.string(),
        updatedBy: v.id("users"),
        updatedAt: v.number(),
    }),
});

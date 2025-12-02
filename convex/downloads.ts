import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track a download
export const trackDownload = mutation({
    args: {
        noteId: v.id("notes"),
        studentId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if already downloaded by this student
        const existing = await ctx.db
            .query("downloads")
            .withIndex("by_note_id", (q) => q.eq("noteId", args.noteId))
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        if (!existing) {
            await ctx.db.insert("downloads", {
                noteId: args.noteId,
                studentId: args.studentId,
                downloadedAt: Date.now(),
            });
        }
    },
});

// Get download stats for a note
export const getNoteDownloads = query({
    args: { noteId: v.id("notes") },
    handler: async (ctx, args) => {
        const downloads = await ctx.db
            .query("downloads")
            .withIndex("by_note_id", (q) => q.eq("noteId", args.noteId))
            .collect();

        // Get student details
        const downloadsWithStudents = await Promise.all(
            downloads.map(async (download) => {
                const student = await ctx.db.get(download.studentId);
                return {
                    ...download,
                    studentName: student?.name || "Unknown",
                    studentEmail: student?.email || "",
                };
            })
        );

        return downloadsWithStudents;
    },
});

// Get total downloads for all notes by a teacher
export const getTeacherDownloadStats = query({
    args: { teacherId: v.id("users") },
    handler: async (ctx, args) => {
        // Get all notes by this teacher
        const notes = await ctx.db
            .query("notes")
            .withIndex("by_teacher_id", (q) => q.eq("teacherId", args.teacherId))
            .collect();

        // Get download count for each note
        const stats = await Promise.all(
            notes.map(async (note) => {
                const downloads = await ctx.db
                    .query("downloads")
                    .withIndex("by_note_id", (q) => q.eq("noteId", note._id))
                    .collect();

                return {
                    noteId: note._id,
                    noteTitle: note.title,
                    noteSubject: note.subject,
                    downloadCount: downloads.length,
                };
            })
        );

        return stats;
    },
});

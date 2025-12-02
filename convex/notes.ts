import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNote = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        fileUrl: v.optional(v.string()),
        fileStorageId: v.optional(v.id("_storage")),
        subject: v.string(),
        teacherId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            fileUrl: args.fileUrl,
            fileStorageId: args.fileStorageId,
            subject: args.subject,
            teacherId: args.teacherId,
        });
    },
});

export const getNotes = query({
    handler: async (ctx) => {
        const notes = await ctx.db.query("notes").order("desc").collect();
        // Join with teacher details if needed, for now just returning notes
        return Promise.all(
            notes.map(async (note) => {
                const teacher = await ctx.db.get(note.teacherId);
                return { ...note, teacherName: teacher?.name };
            })
        );
    },
});

export const deleteNote = mutation({
    args: { noteId: v.id("notes") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.noteId);
    },
});

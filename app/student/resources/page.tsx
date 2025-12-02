"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, User, FileText, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { StudentLayout } from "@/components/dashboard/StudentLayout";
import { Id } from "@/convex/_generated/dataModel";

export default function StudentResources() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const notes = useQuery(api.notes.getNotes);
    const [searchQuery, setSearchQuery] = useState("");

    if (isLoaded && user && convexUser && convexUser.role !== "student") {
        redirect("/teacher");
    }

    if (!isLoaded || !user || !convexUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const filteredNotes = notes?.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <StudentLayout>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container px-4 md:px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Learning Resources
                        </h1>
                        <p className="text-muted-foreground text-lg">Browse and download study materials</p>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search resources by title, subject, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 max-w-md h-12 text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.length === 0 ? (
                            <div className="col-span-full text-center py-16 text-muted-foreground">
                                <FileText className="h-20 w-20 mx-auto mb-4 opacity-50" />
                                <p className="text-xl font-medium mb-2">
                                    {searchQuery ? "No resources match your search" : "No resources available yet"}
                                </p>
                                <p className="text-sm">
                                    {searchQuery ? "Try different keywords" : "Check back later for new materials"}
                                </p>
                            </div>
                        ) : (
                            filteredNotes.map((note) => (
                                <ResourceCard key={note._id} note={note} studentId={convexUser._id} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

// Separate component to handle file URL fetching and download tracking
function ResourceCard({ note, studentId }: { note: any; studentId: Id<"users"> }) {
    const fileUrl = useQuery(
        api.files.getFileUrl,
        note.fileStorageId ? { storageId: note.fileStorageId } : "skip"
    );
    const trackDownload = useMutation(api.downloads.trackDownload);

    const handleDownload = async () => {
        // Track the download
        try {
            await trackDownload({
                noteId: note._id,
                studentId: studentId,
            });
        } catch (error) {
            console.error("Error tracking download:", error);
        }

        // Open the file
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        } else if (note.fileUrl) {
            window.open(note.fileUrl, '_blank');
        }
    };

    return (
        <Card className="hover:shadow-xl transition-all duration-300 group overflow-hidden border-l-4 border-l-primary/30 hover:border-l-primary">
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                        {note.title}
                    </CardTitle>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap font-medium">
                        {note.subject}
                    </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <User className="h-4 w-4" />
                    <span>{note.teacherName || "Unknown Teacher"}</span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground line-clamp-4 text-sm mb-4">
                    {note.content}
                </p>

                {/* File attachment indicator and download */}
                {(note.fileStorageId || note.fileUrl) && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <FileText className="h-4 w-4" />
                                <span>File Attached</span>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            className="w-full shadow-md hover:shadow-lg transition-all"
                            size="sm"
                            onClick={handleDownload}
                            disabled={note.fileStorageId && !fileUrl}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {note.fileStorageId && !fileUrl ? "Loading..." : "Download Resource"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

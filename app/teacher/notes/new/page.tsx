"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewNote() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const createNote = useMutation(api.notes.createNote);
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoaded && user && convexUser && convexUser.role !== "teacher") {
        redirect("/student");
    }

    if (!isLoaded || !user || !convexUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createNote({
                title,
                content,
                subject,
                fileUrl: fileUrl || undefined,
                teacherId: convexUser._id,
            });
            router.push("/teacher/notes");
        } catch (error) {
            console.error("Error creating note:", error);
            alert("Failed to create note. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-8 max-w-3xl">
                <Link href="/teacher/notes">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Notes
                    </Button>
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter note title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject *</Label>
                                <Input
                                    id="subject"
                                    placeholder="e.g., Mathematics, Physics, Computer Science"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Enter note content or description"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={8}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fileUrl">File URL (Optional)</Label>
                                <Input
                                    id="fileUrl"
                                    type="url"
                                    placeholder="https://example.com/file.pdf"
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Add a link to your file (Google Drive, Dropbox, etc.)
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? "Creating..." : "Create Note"}
                                </Button>
                                <Link href="/teacher/notes" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

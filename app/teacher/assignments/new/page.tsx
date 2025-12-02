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

export default function NewAssignment() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const createAssignment = useMutation(api.assignments.createAssignment);
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [link, setLink] = useState("");
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
            await createAssignment({
                title,
                description,
                subject,
                dueDate,
                link: link || undefined,
                teacherId: convexUser._id,
            });
            router.push("/teacher/assignments");
        } catch (error) {
            console.error("Error creating assignment:", error);
            alert("Failed to create assignment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-8 max-w-3xl">
                <Link href="/teacher">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter assignment title"
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
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter assignment description and requirements"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date *</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Assignment Link (Optional)</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    placeholder="https://example.com/assignment-details"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Add a link to additional resources or submission form
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? "Creating..." : "Create Assignment"}
                                </Button>
                                <Link href="/teacher" className="flex-1">
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

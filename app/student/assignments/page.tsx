"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ExternalLink, Search, Eye } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { StudentLayout } from "@/components/dashboard/StudentLayout";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function StudentAssignments() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const assignments = useQuery(api.assignments.getAssignments);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

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

    const filteredAssignments = assignments?.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <>
            <StudentLayout>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                    <div className="container px-4 md:px-6 py-8">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Assignments
                            </h1>
                            <p className="text-muted-foreground text-lg">View and track your assignments</p>
                        </div>

                        {/* Enhanced Search Bar */}
                        <div className="mb-6 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search assignments by title, subject, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 max-w-md h-12 text-base"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAssignments.length === 0 ? (
                                <div className="col-span-full text-center py-16 text-muted-foreground">
                                    <Calendar className="h-20 w-20 mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-medium mb-2">
                                        {searchQuery ? "No assignments match your search" : "No assignments available yet"}
                                    </p>
                                    <p className="text-sm">
                                        {searchQuery ? "Try different keywords" : "You're all caught up!"}
                                    </p>
                                </div>
                            ) : (
                                filteredAssignments.map((assignment) => {
                                    const dueDate = new Date(assignment.dueDate);
                                    const isOverdue = dueDate < new Date();

                                    return (
                                        <Card
                                            key={assignment._id}
                                            className={`hover:shadow-xl transition-all duration-300 border-l-4 cursor-pointer ${isOverdue ? 'border-l-destructive' : 'border-l-primary'}`}
                                            onClick={() => setSelectedAssignment(assignment)}
                                        >
                                            <CardHeader>
                                                <div className="flex justify-between items-start mb-2">
                                                    <CardTitle className="text-xl line-clamp-1">{assignment.title}</CardTitle>
                                                    <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full whitespace-nowrap font-medium">
                                                        {assignment.subject}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>{assignment.teacherName || "Unknown Teacher"}</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className={`flex items-center gap-2 text-sm font-medium mb-4 ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Due: {dueDate.toLocaleDateString()}</span>
                                                    {isOverdue && <span className="text-xs">(Overdue)</span>}
                                                </div>
                                                <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                                                    {assignment.description}
                                                </p>
                                                <Button variant="default" className="w-full shadow-md hover:shadow-lg transition-all" size="sm">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </StudentLayout>

            {/* Assignment Details Dialog */}
            {selectedAssignment && (
                <AssignmentDetailsDialog
                    assignment={selectedAssignment}
                    studentId={convexUser._id}
                    onClose={() => setSelectedAssignment(null)}
                />
            )}
        </>
    );
}

// Assignment Details Dialog Component
function AssignmentDetailsDialog({
    assignment,
    studentId,
    onClose
}: {
    assignment: any;
    studentId: Id<"users">;
    onClose: () => void
}) {
    const trackView = useMutation(api.assignmentViews.trackAssignmentView);
    const [hasTracked, setHasTracked] = useState(false);

    // Track view when dialog opens
    if (!hasTracked) {
        trackView({
            assignmentId: assignment._id,
            studentId: studentId,
        }).catch(console.error);
        setHasTracked(true);
    }

    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < new Date();

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-card">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{assignment.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-base">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                            {assignment.subject}
                        </span>
                        <span>•</span>
                        <span>By {assignment.teacherName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Due Date */}
                    <div className={`p-4 rounded-lg border-l-4 ${isOverdue ? 'bg-destructive/10 border-l-destructive' : 'bg-primary/10 border-l-primary'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-5 w-5" />
                            <span className="font-semibold">Due Date</span>
                        </div>
                        <p className={`text-lg ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
                            {dueDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            {isOverdue && <span className="ml-2 text-sm">(Overdue)</span>}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="whitespace-pre-wrap">{assignment.description}</p>
                        </div>
                    </div>

                    {/* External Link */}
                    {assignment.link && (
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Resources</h3>
                            <a
                                href={assignment.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                            >
                                <ExternalLink className="h-5 w-5 text-primary" />
                                <span className="text-primary font-medium">Open External Link</span>
                            </a>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        {assignment.link && (
                            <a
                                href={assignment.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button className="w-full" size="lg">
                                    <ExternalLink className="mr-2 h-5 w-5" />
                                    Open Assignment
                                </Button>
                            </a>
                        )}
                        <Button variant="outline" onClick={onClose} size="lg" className={assignment.link ? '' : 'flex-1'}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

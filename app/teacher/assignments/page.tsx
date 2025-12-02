"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar as CalendarIcon, Search, Eye, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { TeacherLayout } from "@/components/dashboard/TeacherLayout";
import { AddAssignmentDialog } from "@/components/dashboard/AddAssignmentDialog";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function TeacherAssignments() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const assignments = useQuery(api.assignments.getAssignments);
    const deleteAssignment = useMutation(api.assignments.deleteAssignment);
    const viewStats = useQuery(
        api.assignmentViews.getTeacherAssignmentStats,
        convexUser ? { teacherId: convexUser._id } : "skip"
    );
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAssignmentForStats, setSelectedAssignmentForStats] = useState<Id<"assignments"> | null>(null);

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

    const myAssignments = assignments?.filter(assignment => assignment.teacherId === convexUser._id) || [];

    const filteredAssignments = myAssignments.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getViewCount = (assignmentId: Id<"assignments">) => {
        return viewStats?.find(stat => stat.assignmentId === assignmentId)?.viewCount || 0;
    };

    const handleDelete = async (assignmentId: any) => {
        if (confirm("Are you sure you want to delete this assignment?")) {
            await deleteAssignment({ assignmentId });
        }
    };

    return (
        <>
            <TeacherLayout onAddAssignment={() => setShowAddDialog(true)}>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                    <div className="container px-4 md:px-6 py-8">
                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    My Assignments
                                </h1>
                                <p className="text-muted-foreground text-lg">Manage your assignments and track student views</p>
                            </div>
                            <Button onClick={() => setShowAddDialog(true)} size="lg" className="shadow-lg">
                                Create Assignment
                            </Button>
                        </div>

                        {/* Search Bar */}
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
                                    <CalendarIcon className="h-20 w-20 mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-medium mb-2">
                                        {searchQuery ? "No assignments match your search" : "No assignments yet"}
                                    </p>
                                    <p className="mb-6">
                                        {searchQuery ? "Try different keywords" : "Create your first assignment to get started!"}
                                    </p>
                                    {!searchQuery && (
                                        <Button onClick={() => setShowAddDialog(true)} size="lg">
                                            Create Assignment
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                filteredAssignments.map((assignment) => {
                                    const dueDate = new Date(assignment.dueDate);
                                    const isOverdue = dueDate < new Date();
                                    const viewCount = getViewCount(assignment._id);

                                    return (
                                        <Card key={assignment._id} className={`hover:shadow-xl transition-all duration-300 group border-l-4 ${isOverdue ? 'border-l-destructive' : 'border-l-primary/30 hover:border-l-primary'}`}>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                                        {assignment.title}
                                                    </CardTitle>
                                                    <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium whitespace-nowrap">
                                                        {assignment.subject}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className={`flex items-center gap-2 text-sm font-medium mb-4 ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>Due: {dueDate.toLocaleDateString()}</span>
                                                    {isOverdue && <span className="text-xs">(Overdue)</span>}
                                                </div>

                                                {/* View Stats */}
                                                <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <TrendingUp className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{viewCount} views</span>
                                                    </div>
                                                    {viewCount > 0 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedAssignmentForStats(assignment._id)}
                                                            className="ml-auto"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                    )}
                                                </div>

                                                <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                                                    {assignment.description}
                                                </p>
                                                {assignment.link && (
                                                    <div className="flex items-center gap-2 text-xs text-primary mb-4 bg-primary/5 p-2 rounded-md">
                                                        <span className="truncate">Link attached</span>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(assignment._id)}
                                                        className="w-full"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </TeacherLayout>

            <AddAssignmentDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                teacherId={convexUser._id}
            />

            {/* View Stats Dialog */}
            {selectedAssignmentForStats && (
                <ViewStatsDialog
                    assignmentId={selectedAssignmentForStats}
                    onClose={() => setSelectedAssignmentForStats(null)}
                />
            )}
        </>
    );
}

// View Stats Dialog Component
function ViewStatsDialog({ assignmentId, onClose }: { assignmentId: Id<"assignments">; onClose: () => void }) {
    const views = useQuery(api.assignmentViews.getAssignmentViews, { assignmentId });

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-card">
                <DialogHeader>
                    <DialogTitle>View Statistics</DialogTitle>
                    <DialogDescription>
                        Students who have viewed this assignment
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                    {views && views.length > 0 ? (
                        views.map((view) => (
                            <div
                                key={view._id}
                                className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{view.studentName}</p>
                                    <p className="text-sm text-muted-foreground">{view.studentEmail}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(view.viewedAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(view.viewedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No views yet</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

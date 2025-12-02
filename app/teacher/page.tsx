"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Plus, TrendingUp, Users, FileText, ArrowRight, Sparkles, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TeacherLayout } from "@/components/dashboard/TeacherLayout";
import { EditSiteSettingsDialog } from "@/components/dashboard/EditSiteSettingsDialog";
import { AddNoteDialog } from "@/components/dashboard/AddNoteDialog";
import { AddAssignmentDialog } from "@/components/dashboard/AddAssignmentDialog";

export default function TeacherDashboard() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const notes = useQuery(api.notes.getNotes);
    const assignments = useQuery(api.assignments.getAssignments);

    const [showNoteDialog, setShowNoteDialog] = useState(false);
    const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
    const [showSiteSettingsDialog, setShowSiteSettingsDialog] = useState(false);

    if (isLoaded && user && convexUser === null) {
        redirect("/sync");
    }

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

    const myNotes = notes?.filter(note => note.teacherId === convexUser._id) || [];
    const myAssignments = assignments?.filter(assignment => assignment.teacherId === convexUser._id) || [];

    return (
        <>
            <TeacherLayout
                onAddNote={() => setShowNoteDialog(true)}
                onAddAssignment={() => setShowAssignmentDialog(true)}
            >
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                    <div className="container px-4 md:px-6 py-8 pt-20 lg:pt-8">
                        {/* Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Teacher Dashboard
                                </h1>
                                <p className="text-muted-foreground text-lg flex items-center gap-2">
                                    Welcome back, <span className="font-semibold text-foreground">{convexUser.name}</span>
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <Button onClick={() => setShowSiteSettingsDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all">
                                    <Settings className="mr-2 h-4 w-4" /> Edit Landing Page
                                </Button>
                                <Button onClick={() => setShowNoteDialog(true)} className="shadow-lg hover:shadow-primary/25 transition-all">
                                    <Plus className="mr-2 h-4 w-4" /> Add Note
                                </Button>
                                <Button onClick={() => setShowAssignmentDialog(true)} variant="outline" className="shadow-sm hover:shadow-md transition-all">
                                    <Plus className="mr-2 h-4 w-4" /> Assignment
                                </Button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-primary/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BookOpen className="h-24 w-24 text-primary" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-3xl font-bold">{myNotes.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Resources uploaded</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-blue-500/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Calendar className="h-24 w-24 text-blue-500" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
                                    <div className="p-2 bg-blue-500/10 rounded-full">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-3xl font-bold">{myAssignments.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Active assignments</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-green-500/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users className="h-24 w-24 text-green-500" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <Users className="h-4 w-4 text-green-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-3xl font-bold">-</div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Total students</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-orange-500/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="h-24 w-24 text-orange-500" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Engagement</CardTitle>
                                    <div className="p-2 bg-orange-500/10 rounded-full">
                                        <TrendingUp className="h-4 w-4 text-orange-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-3xl font-bold">-</div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">This week</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Notes */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                        Recent Notes
                                    </h2>
                                    <Link href="/teacher/notes">
                                        <Button variant="ghost" size="sm" className="group">
                                            View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-0">
                                        {myNotes.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <BookOpen className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p className="font-medium">No notes yet</p>
                                                <p className="text-sm mt-1">Create your first note to get started!</p>
                                                <Button onClick={() => setShowNoteDialog(true)} variant="link" className="mt-2">
                                                    Create Note
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {myNotes.slice(0, 5).map((note) => (
                                                    <div key={note._id} className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                                <FileText className="h-5 w-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium line-clamp-1">{note.title}</p>
                                                                <p className="text-xs text-muted-foreground">{note.subject}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${note.fileStorageId ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                                                                {note.fileStorageId ? 'File' : 'Text'}
                                                            </span>
                                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ArrowRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Assignments */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Calendar className="h-6 w-6 text-blue-500" />
                                        Recent Assignments
                                    </h2>
                                    <Link href="/teacher/assignments">
                                        <Button variant="ghost" size="sm" className="group">
                                            View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-0">
                                        {myAssignments.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Calendar className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p className="font-medium">No assignments yet</p>
                                                <p className="text-sm mt-1">Create your first assignment!</p>
                                                <Button onClick={() => setShowAssignmentDialog(true)} variant="link" className="mt-2">
                                                    Create Assignment
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {myAssignments.slice(0, 5).map((assignment) => (
                                                    <div key={assignment._id} className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                                                <Calendar className="h-5 w-5 text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium line-clamp-1">{assignment.title}</p>
                                                                <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ArrowRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </TeacherLayout>

            {/* Modals */}
            <AddNoteDialog
                open={showNoteDialog}
                onOpenChange={setShowNoteDialog}
                teacherId={convexUser._id}
            />
            <AddAssignmentDialog
                open={showAssignmentDialog}
                onOpenChange={setShowAssignmentDialog}
                teacherId={convexUser._id}
            />
            <EditSiteSettingsDialog
                open={showSiteSettingsDialog}
                onOpenChange={setShowSiteSettingsDialog}
                teacherId={convexUser._id}
            />
        </>
    );
}

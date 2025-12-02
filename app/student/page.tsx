"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, TrendingUp, Award, ArrowRight, Sparkles, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StudentLayout } from "@/components/dashboard/StudentLayout";

export default function StudentDashboard() {
    const { user, isLoaded } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const notes = useQuery(api.notes.getNotes);
    const assignments = useQuery(api.assignments.getAssignments);

    if (isLoaded && user && convexUser === null) {
        redirect("/sync");
    }

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

    const recentNotes = notes?.slice(0, 3) || [];
    const upcomingAssignments = assignments?.slice(0, 3) || [];

    return (
        <StudentLayout>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container px-4 md:px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Student Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg flex items-center gap-2">
                            Welcome back, <span className="font-semibold text-foreground">{convexUser.name}</span>
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-primary/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="h-24 w-24 text-primary" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Available Resources</CardTitle>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">{notes?.length || 0}</div>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Total notes available</p>
                                <Link href="/student/resources">
                                    <Button variant="link" className="px-0 mt-2 h-auto group/btn">
                                        Browse <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
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
                                <div className="text-3xl font-bold">{assignments?.length || 0}</div>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Active assignments</p>
                                <Link href="/student/assignments">
                                    <Button variant="link" className="px-0 mt-2 h-auto group/btn">
                                        View All <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-green-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp className="h-24 w-24 text-green-500" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
                                <div className="p-2 bg-green-500/10 rounded-full">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Completion rate</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-gradient-to-br from-card to-orange-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Award className="h-24 w-24 text-orange-500" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
                                <div className="p-2 bg-orange-500/10 rounded-full">
                                    <Award className="h-4 w-4 text-orange-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Badges earned</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {/* Recent Resources */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    Recent Resources
                                </h2>
                                <Link href="/student/resources">
                                    <Button variant="ghost" className="group">
                                        View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentNotes.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-muted-foreground bg-card/50 rounded-xl border-2 border-dashed">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No resources available yet.</p>
                                        <p className="text-sm mt-2">Check back later for new learning materials!</p>
                                    </div>
                                ) : (
                                    recentNotes.map((note) => (
                                        <Card key={note._id} className="hover:shadow-xl transition-all duration-300 group border-none shadow-md overflow-hidden flex flex-col h-full">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2 gap-4">
                                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                                        {note.title}
                                                    </CardTitle>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap font-medium">
                                                        {note.subject}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">By {note.teacherName}</p>
                                            </CardHeader>
                                            <CardContent className="flex-1 flex flex-col">
                                                <div className="bg-muted/30 p-3 rounded-lg mb-4 flex-1">
                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {note.content}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t mt-auto">
                                                    {note.fileStorageId ? (
                                                        <div className="flex items-center gap-2 text-xs text-primary font-medium">
                                                            <div className="p-1.5 bg-primary/10 rounded-full">
                                                                <FileText className="h-3 w-3" />
                                                            </div>
                                                            <span>File attached</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <FileText className="h-3 w-3" />
                                                            <span>Text only</span>
                                                        </div>
                                                    )}
                                                    <Link href="/student/resources">
                                                        <Button variant="ghost" size="sm" className="h-8 text-xs">Read More</Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Upcoming Assignments */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Calendar className="h-6 w-6 text-blue-500" />
                                    Upcoming Assignments
                                </h2>
                                <Link href="/student/assignments">
                                    <Button variant="ghost" className="group">
                                        View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingAssignments.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-muted-foreground bg-card/50 rounded-xl border-2 border-dashed">
                                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No assignments available yet.</p>
                                        <p className="text-sm mt-2">You're all caught up!</p>
                                    </div>
                                ) : (
                                    upcomingAssignments.map((assignment) => {
                                        const dueDate = new Date(assignment.dueDate);
                                        const isOverdue = dueDate < new Date();

                                        return (
                                            <Card key={assignment._id} className={`hover:shadow-xl transition-all duration-300 border-l-4 ${isOverdue ? 'border-l-destructive' : 'border-l-primary'} border-t-0 border-r-0 border-b-0 shadow-md overflow-hidden flex flex-col h-full`}>
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start mb-2 gap-4">
                                                        <CardTitle className="text-lg line-clamp-1">{assignment.title}</CardTitle>
                                                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full whitespace-nowrap font-medium">
                                                            {assignment.subject}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">By {assignment.teacherName}</p>
                                                </CardHeader>
                                                <CardContent className="flex-1 flex flex-col">
                                                    <div className={`flex items-center gap-2 text-sm font-medium mb-3 p-2 rounded-lg ${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                                        <Clock className="h-4 w-4" />
                                                        <span>Due: {dueDate.toLocaleDateString()}</span>
                                                        {isOverdue && <span className="text-xs font-bold ml-auto">OVERDUE</span>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                                        {assignment.description}
                                                    </p>
                                                    <div className="pt-2 border-t mt-auto">
                                                        <Link href="/student/assignments" className="w-full">
                                                            <Button variant="secondary" size="sm" className="w-full">View Details</Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

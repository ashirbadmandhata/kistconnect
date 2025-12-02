"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LatestAssignments() {
    const assignments = useQuery(api.assignments.getAssignments);

    return (
        <section id="assignments" className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Assignments</h2>
                        <p className="text-muted-foreground text-lg">Upcoming tasks, deadlines, and projects</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2">
                        View All Assignments <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assignments === undefined ? (
                        // Loading state
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="border-none shadow-md">
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                </CardContent>
                            </Card>
                        ))
                    ) : assignments.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-background rounded-2xl border-2 border-dashed">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-lg font-medium text-muted-foreground">No assignments due soon.</p>
                        </div>
                    ) : (
                        assignments.slice(0, 6).map((assignment) => {
                            const dueDate = new Date(assignment.dueDate);
                            const isOverdue = dueDate < new Date();
                            const daysLeft = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

                            return (
                                <Card key={assignment._id} className={`group hover:shadow-xl transition-all duration-300 border-l-4 ${isOverdue ? 'border-l-destructive' : 'border-l-primary'} overflow-hidden flex flex-col h-full bg-card`}>
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                                {assignment.title}
                                            </CardTitle>
                                            <span className="text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full whitespace-nowrap">
                                                {assignment.subject}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-2 pt-2">
                                            <User className="h-3 w-3" />
                                            <span>{assignment.teacherName || "Unknown Teacher"}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className={`flex items-center gap-2 text-sm font-medium mb-4 p-3 rounded-lg ${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                            {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                            <span>
                                                {isOverdue
                                                    ? `Overdue by ${Math.abs(daysLeft)} days`
                                                    : `Due in ${daysLeft} days (${dueDate.toLocaleDateString()})`
                                                }
                                            </span>
                                        </div>

                                        <p className="text-muted-foreground line-clamp-3 text-sm mb-6 flex-1">
                                            {assignment.description}
                                        </p>

                                        <div className="pt-4 border-t mt-auto">
                                            {assignment.link ? (
                                                <Link href={assignment.link} target="_blank" className="w-full">
                                                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                                                        View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button variant="secondary" className="w-full" disabled>
                                                    No Link Attached
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full gap-2">
                        View All Assignments <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

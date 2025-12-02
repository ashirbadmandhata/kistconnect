"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, ArrowRight, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function LatestResources() {
    const notes = useQuery(api.notes.getNotes);

    return (
        <section id="resources" className="py-24 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Resources</h2>
                        <p className="text-muted-foreground text-lg">Recently uploaded study materials and notes</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2">
                        View All Resources <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notes === undefined ? (
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
                    ) : notes.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-lg font-medium text-muted-foreground">No resources available yet.</p>
                        </div>
                    ) : (
                        notes.slice(0, 6).map((note) => (
                            <Card key={note._id} className="group hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/50 overflow-hidden flex flex-col h-full">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                            {note.title}
                                        </CardTitle>
                                        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                                            {note.subject}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2 pt-2">
                                        <div className="p-1 bg-muted rounded-full">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span>{note.teacherName || "Unknown Teacher"}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <div className="bg-muted/30 p-4 rounded-lg mb-4 flex-1">
                                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                            {note.content}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t mt-auto">
                                        {(note.fileUrl || note.fileStorageId) ? (
                                            <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <Download className="h-4 w-4" />
                                                </div>
                                                <span>Attachment available</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <FileText className="h-4 w-4" />
                                                <span>Text only</span>
                                            </div>
                                        )}
                                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full gap-2">
                        View All Resources <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

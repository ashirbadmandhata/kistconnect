"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Search, Eye, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { TeacherLayout } from "@/components/dashboard/TeacherLayout";
import { AddNoteDialog } from "@/components/dashboard/AddNoteDialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function TeacherNotes() {
  const { user, isLoaded } = useUser();
  const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
  const notes = useQuery(api.notes.getNotes);
  const deleteNote = useMutation(api.notes.deleteNote);
  const downloadStats = useQuery(
    api.downloads.getTeacherDownloadStats,
    convexUser ? { teacherId: convexUser._id } : "skip"
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteForStats, setSelectedNoteForStats] = useState<Id<"notes"> | null>(null);

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

  const filteredNotes = myNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDownloadCount = (noteId: Id<"notes">) => {
    return downloadStats?.find(stat => stat.noteId === noteId)?.downloadCount || 0;
  };

  const handleDelete = async (noteId: any) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote({ noteId });
    }
  };

  return (
    <>
      <TeacherLayout onAddNote={() => setShowAddDialog(true)}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container px-4 md:px-6 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Notes
                </h1>
                <p className="text-muted-foreground text-lg">Manage your uploaded resources and track downloads</p>
              </div>
              <Button onClick={() => setShowAddDialog(true)} size="lg" className="shadow-lg">
                Add New Note
              </Button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search notes by title, subject, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-md h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.length === 0 ? (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  <Download className="h-20 w-20 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">
                    {searchQuery ? "No notes match your search" : "No notes yet"}
                  </p>
                  <p className="mb-6">
                    {searchQuery ? "Try different keywords" : "Create your first note to get started!"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowAddDialog(true)} size="lg">
                      Create Note
                    </Button>
                  )}
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const downloadCount = getDownloadCount(note._id);

                  return (
                    <Card key={note._id} className="hover:shadow-xl transition-all duration-300 group border-l-4 border-l-primary/30 hover:border-l-primary">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{note.title}</CardTitle>
                          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                            {note.subject}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                          {note.content}
                        </p>

                        {/* Download Stats */}
                        <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 text-primary">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">{downloadCount} downloads</span>
                          </div>
                          {downloadCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedNoteForStats(note._id)}
                              className="ml-auto"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>

                        {note.fileStorageId && (
                          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4 bg-primary/5 p-2 rounded-md">
                            <Download className="h-4 w-4" />
                            <span>File attached</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(note._id)}
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

      <AddNoteDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        teacherId={convexUser._id}
      />

      {/* Download Stats Dialog */}
      {selectedNoteForStats && (
        <DownloadStatsDialog
          noteId={selectedNoteForStats}
          onClose={() => setSelectedNoteForStats(null)}
        />
      )}
    </>
  );
}

// Download Stats Dialog Component
function DownloadStatsDialog({ noteId, onClose }: { noteId: Id<"notes">; onClose: () => void }) {
  const downloads = useQuery(api.downloads.getNoteDownloads, { noteId });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Download Statistics</DialogTitle>
          <DialogDescription>
            Students who have downloaded this resource
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {downloads && downloads.length > 0 ? (
            downloads.map((download) => (
              <div
                key={download._id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{download.studentName}</p>
                  <p className="text-sm text-muted-foreground">{download.studentEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(download.downloadedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(download.downloadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No downloads yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

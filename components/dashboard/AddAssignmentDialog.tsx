"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";

interface AddAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacherId: Id<"users">;
}

export function AddAssignmentDialog({ open, onOpenChange, teacherId }: AddAssignmentDialogProps) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [link, setLink] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const createAssignment = useMutation(api.assignments.createAssignment);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !subject || !description || !dueDate) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await createAssignment({
                title,
                subject,
                description,
                dueDate,
                link: link || undefined,
                teacherId,
            });

            // Reset form
            setTitle("");
            setSubject("");
            setDescription("");
            setDueDate("");
            setLink("");
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating assignment:", error);
            alert("Failed to create assignment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
                <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>
                        Add a new assignment for your students with a due date.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="assignment-title">Title *</Label>
                            <Input
                                id="assignment-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Chapter 5 Exercises"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="assignment-subject">Subject *</Label>
                            <Input
                                id="assignment-subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Mathematics"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="assignment-description">Description *</Label>
                            <Textarea
                                id="assignment-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the assignment requirements..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due-date">Due Date *</Label>
                            <Input
                                id="due-date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="assignment-link">External Link (Optional)</Label>
                            <Input
                                id="assignment-link"
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://example.com/assignment"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Creating..." : "Create Assignment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

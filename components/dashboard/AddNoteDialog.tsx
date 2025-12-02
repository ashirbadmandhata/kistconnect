"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface AddNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacherId: Id<"users">;
}

export function AddNoteDialog({ open, onOpenChange, teacherId }: AddNoteDialogProps) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createNote = useMutation(api.notes.createNote);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file type
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(selectedFile.type)) {
                alert('Please upload only PDF or image files (PNG, JPG, JPEG)');
                return;
            }
            // Check file size (10MB for PDF, 5MB for images)
            const maxSize = selectedFile.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                alert(`File size should not exceed ${selectedFile.type === 'application/pdf' ? '10MB' : '5MB'}`);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !subject || !content) {
            alert('Please fill in all required fields');
            return;
        }

        setUploading(true);
        try {
            let fileStorageId: Id<"_storage"> | undefined;

            // Upload file if selected
            if (file) {
                try {
                    const uploadUrl = await generateUploadUrl();
                    const result = await fetch(uploadUrl, {
                        method: "POST",
                        headers: { "Content-Type": file.type },
                        body: file,
                    });

                    if (!result.ok) {
                        throw new Error('Upload failed');
                    }

                    const { storageId } = await result.json();
                    fileStorageId = storageId;
                } catch (uploadError) {
                    console.error("File upload error:", uploadError);
                    alert("Failed to upload file. Please try again.");
                    setUploading(false);
                    return;
                }
            }

            // Create note
            await createNote({
                title,
                subject,
                content,
                fileStorageId,
                teacherId,
            });

            // Reset form
            setTitle("");
            setSubject("");
            setContent("");
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating note:", error);
            alert("Failed to create note. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
                <DialogHeader>
                    <DialogTitle>Add New Note</DialogTitle>
                    <DialogDescription>
                        Create a new learning resource for your students. Upload PDFs or images.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Introduction to React Hooks"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Computer Science"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Describe the learning material..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>File Attachment (Optional)</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors bg-background">
                                {!file ? (
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF (max 10MB) or Images (max 5MB)
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                                        <div className="flex items-center gap-2">
                                            {file.type === 'application/pdf' ? (
                                                <FileText className="h-8 w-8 text-red-500" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-blue-500" />
                                            )}
                                            <div className="text-left">
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeFile}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? "Creating..." : "Create Note"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

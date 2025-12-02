"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";

interface EditSiteSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacherId: Id<"users">;
}

export function EditSiteSettingsDialog({ open, onOpenChange, teacherId }: EditSiteSettingsDialogProps) {
    const settings = useQuery(api.siteSettings.getSiteSettings);
    const updateSettings = useMutation(api.siteSettings.updateSiteSettings);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (settings) {
            setTitle(settings.heroTitle);
            setDescription(settings.heroDescription);
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateSettings({
                heroTitle: title,
                heroDescription: description,
                teacherId,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Landing Page Text</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Hero Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter the main heading..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Hero Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the description..."
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

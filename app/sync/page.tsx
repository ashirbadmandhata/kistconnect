"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SyncUser() {
    const { user, isLoaded } = useUser();
    const syncUser = useMutation(api.users.syncUserManually);
    const [role, setRole] = useState<"teacher" | "student">("student");
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState("");

    if (!isLoaded || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleSync = async () => {
        setSyncing(true);
        setMessage("");

        try {
            const result = await syncUser({
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress || "",
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "User",
                imageUrl: user.imageUrl,
                role: role,
            });

            setMessage(result.message);

            // Redirect to appropriate dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = role === "teacher" ? "/teacher" : "/student";
            }, 2000);
        } catch (error) {
            console.error("Sync error:", error);
            setMessage("Error syncing user. Please try again.");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Welcome! Please select your role to complete your profile setup.
                        </p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">I am a:</Label>
                                <Select value={role} onValueChange={(value) => setRole(value as "teacher" | "student")}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleSync}
                                disabled={syncing}
                                className="w-full"
                            >
                                {syncing ? "Setting up..." : "Continue"}
                            </Button>

                            {message && (
                                <div className={`text-sm text-center p-3 rounded-md ${message.includes("success")
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                        <p>Your profile information:</p>
                        <p className="mt-1">Email: {user.emailAddresses[0]?.emailAddress}</p>
                        <p>Name: {user.firstName} {user.lastName}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

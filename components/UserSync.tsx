"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
    const { user, isLoaded } = useUser();
    const storeUser = useMutation(api.users.storeUser);
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");

    useEffect(() => {
        if (!isLoaded || !user) return;

        const syncUser = async () => {
            // If convex user doesn't exist, create them ONLY if they have a role in metadata
            if (!convexUser) {
                const role = user.publicMetadata.role as "teacher" | "student";
                if (!role) {
                    // Do not auto-create if role is missing. Let them go to /sync page.
                    return;
                }

                try {
                    await storeUser({
                        name: user.fullName || "Unknown",
                        email: user.emailAddresses[0]?.emailAddress || "",
                        imageUrl: user.imageUrl,
                        clerkId: user.id,
                        role: role,
                    });
                } catch (error) {
                    console.error("Error creating user:", error);
                }
                return;
            }

            // If convex user exists, check if we need to update
            const shouldUpdate =
                (user.fullName && convexUser.name !== user.fullName) ||
                (user.imageUrl && convexUser.imageUrl !== user.imageUrl) ||
                (user.emailAddresses[0]?.emailAddress && convexUser.email !== user.emailAddresses[0]?.emailAddress);

            if (shouldUpdate) {
                try {
                    await storeUser({
                        name: user.fullName || convexUser.name,
                        email: user.emailAddresses[0]?.emailAddress || convexUser.email,
                        imageUrl: user.imageUrl || convexUser.imageUrl,
                        clerkId: user.id,
                        // CRITICAL: Preserve existing role from Convex to prevent overwriting
                        role: convexUser.role,
                    });
                } catch (error) {
                    console.error("Error updating user:", error);
                }
            }
        };

        syncUser();
    }, [isLoaded, user, convexUser, storeUser]);

    return null;
}

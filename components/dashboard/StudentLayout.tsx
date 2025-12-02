"use client";

import { ReactNode } from "react";
import { StudentSidebar } from "@/components/dashboard/StudentSidebar";

export function StudentLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <StudentSidebar />
            <main className="flex-1 lg:ml-64">
                {children}
            </main>
        </div>
    );
}

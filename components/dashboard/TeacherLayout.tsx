"use client";

import { ReactNode } from "react";
import { TeacherSidebar } from "@/components/dashboard/TeacherSidebar";

interface TeacherLayoutProps {
    children: ReactNode;
    onAddNote?: () => void;
    onAddAssignment?: () => void;
}

export function TeacherLayout({ children, onAddNote, onAddAssignment }: TeacherLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <TeacherSidebar onAddNote={onAddNote} onAddAssignment={onAddAssignment} />
            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

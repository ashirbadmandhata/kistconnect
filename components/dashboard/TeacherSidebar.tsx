"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookOpen, Calendar, Home, Menu, Plus, X, ChevronLeft, LogOut, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface TeacherSidebarProps {
    onAddNote?: () => void;
    onAddAssignment?: () => void;
}

export function TeacherSidebar({ onAddNote, onAddAssignment }: TeacherSidebarProps) {
    const { user } = useUser();
    const convexUser = useQuery(api.users.getUser, user ? { clerkId: user.id } : "skip");
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { href: "/teacher", icon: Home, label: "Dashboard" },
        { href: "/teacher/notes", icon: BookOpen, label: "My Notes" },
        { href: "/teacher/assignments", icon: Calendar, label: "My Assignments" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Menu Button - Fixed position */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border shadow-lg hover:bg-accent transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Toggle Button - Adjusted position */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block fixed top-4 z-50 p-2 rounded-lg bg-card border shadow-lg hover:bg-accent transition-all duration-300"
                style={{ left: isCollapsed ? '88px' : '272px' }}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-card to-card/95 border-r backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
                    } ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`p-6 border-b transition-all duration-300 ${isCollapsed ? 'lg:p-4' : ''}`}>
                        <Link href="/teacher" className={`flex items-center gap-2 ${isCollapsed ? 'lg:justify-center' : ''}`}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                <GraduationCap className="h-5 w-5 text-primary-foreground" />
                            </div>
                            {!isCollapsed && (
                                <div className="min-w-0">
                                    <h2 className="font-bold text-lg truncate bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">KistConnect</h2>
                                    <p className="text-xs text-muted-foreground truncate">Teacher Portal</p>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* User Info - Simplified with UserButton */}
                    <div className={`p-4 border-b transition-all duration-300 ${isCollapsed ? 'lg:p-2' : ''}`}>
                        <div className={`flex items-center gap-3 p-2 rounded-lg bg-accent/50 ${isCollapsed ? 'lg:justify-center' : ''}`}>
                            <div className="relative flex-shrink-0">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-9 w-9"
                                        }
                                    }}
                                />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium truncate">{convexUser?.name || 'Teacher'}</p>
                                    <p className="text-xs text-muted-foreground truncate">View Profile</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="mb-4">
                            {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-4">Menu</p>}
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.href)
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-accent"
                                        } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div>
                            {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-4">Quick Actions</p>}
                            {onAddNote && (
                                <button
                                    onClick={() => {
                                        onAddNote();
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                                    title={isCollapsed ? "Add Note" : undefined}
                                >
                                    <Plus className="h-5 w-5 flex-shrink-0" />
                                    <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>Add Note</span>
                                </button>
                            )}
                            {onAddAssignment && (
                                <button
                                    onClick={() => {
                                        onAddAssignment();
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                                    title={isCollapsed ? "Create Assignment" : undefined}
                                >
                                    <Plus className="h-5 w-5 flex-shrink-0" />
                                    <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>Create Assignment</span>
                                </button>
                            )}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className={`p-4 border-t transition-all duration-300 ${isCollapsed ? 'lg:p-2' : ''}`}>
                        <Link href="/">
                            <Button variant="ghost" className={`w-full ${isCollapsed ? 'lg:px-2' : 'justify-start'}`} title={isCollapsed ? "Back to Home" : undefined}>
                                <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'} flex-shrink-0`} />
                                <span className={isCollapsed ? 'lg:hidden' : ''}>Back to Home</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

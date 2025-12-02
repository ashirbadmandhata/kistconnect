"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
    const { isSignedIn, user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        KistConnect
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#resources" className="text-sm font-medium hover:text-primary transition-colors">
                        Resources
                    </Link>
                    <Link href="#assignments" className="text-sm font-medium hover:text-primary transition-colors">
                        Assignments
                    </Link>

                    {isSignedIn ? (
                        <div className="flex items-center gap-4">
                            <Link href={user?.publicMetadata?.role === "teacher" ? "/teacher" : "/student"}>
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10"
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <SignInButton mode="modal">
                                <Button variant="ghost">Sign In</Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button>Sign Up</Button>
                            </SignUpButton>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2" onClick={toggleMenu}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        <Link href="#features" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                            Features
                        </Link>
                        <Link href="#resources" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                            Resources
                        </Link>
                        <Link href="#assignments" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                            Assignments
                        </Link>

                        {isSignedIn ? (
                            <div className="flex flex-col gap-4">
                                <Link href={user?.publicMetadata?.role === "teacher" ? "/teacher" : "/student"} onClick={toggleMenu}>
                                    <Button className="w-full" variant="outline">Dashboard</Button>
                                </Link>
                                <div className="flex justify-start">
                                    <UserButton />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <SignInButton mode="modal">
                                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button className="w-full">Sign Up</Button>
                                </SignUpButton>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

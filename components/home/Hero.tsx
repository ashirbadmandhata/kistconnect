"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Calendar, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function FloatingCards() {
    return (
        <div className="relative w-full max-w-[600px] aspect-square mx-auto lg:mx-0 perspective-1000">
            {/* Abstract Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Central Hub Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-background rounded-full shadow-2xl flex items-center justify-center border-4 border-primary/10 z-10 animate-float">
                <div className="text-center">
                    <div className="bg-primary/10 p-3 rounded-full inline-flex mb-1">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">KistConnect</p>
                </div>
            </div>

            {/* Floating Assignment Card - Top Right */}
            <div className="absolute top-[15%] right-[5%] w-[260px] animate-float-slow z-20">
                <Card className="border-l-4 border-l-blue-500 shadow-2xl bg-card/95 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="font-semibold text-sm">Assignment</span>
                            </div>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full uppercase tracking-wide">
                                Due Soon
                            </span>
                        </div>
                        <h3 className="font-bold text-sm mb-1">Physics Lab Report</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Clock className="h-3 w-3" />
                            <span>Due Tomorrow, 11:59 PM</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[75%] rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Floating Note Card - Bottom Left */}
            <div className="absolute bottom-[20%] left-[0%] w-[250px] animate-float-delayed z-20">
                <Card className="border-l-4 border-l-green-500 shadow-2xl bg-card/95 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <FileText className="h-4 w-4 text-green-500" />
                                </div>
                                <span className="font-semibold text-sm">Resource</span>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">Calculus Notes - Ch 4</h3>
                        <p className="text-xs text-muted-foreground mb-3">Uploaded by Prof. Smith</p>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-background flex items-center justify-center text-[8px]">JD</div>
                                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-background flex items-center justify-center text-[8px]">AS</div>
                                <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-background flex items-center justify-center text-[8px]">+5</div>
                            </div>
                            <span className="text-[10px] text-muted-foreground">Downloaded by 7 others</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Floating User Card - Top Left (Small) */}
            <div className="absolute top-[25%] left-[5%] animate-float z-10">
                <div className="bg-card/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                        KC
                    </div>
                    <div>
                        <p className="text-xs font-bold">Student Portal</p>
                        <p className="text-[10px] text-muted-foreground">Active Now</p>
                    </div>
                </div>
            </div>

            {/* Floating Stats Card - Bottom Right (Small) */}
            <div className="absolute bottom-[30%] right-[0%] animate-float-slow z-10">
                <div className="bg-card/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                            <BookOpen className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="text-xs font-bold">Library</span>
                    </div>
                    <p className="text-lg font-bold">120+</p>
                    <p className="text-[10px] text-muted-foreground">Resources Available</p>
                </div>
            </div>
        </div>
    );
}

export function Hero() {
    const settings = useQuery(api.siteSettings.getSiteSettings);

    const title = settings?.heroTitle || "Empowering Education at KIST";
    const description = settings?.heroDescription || "Seamlessly share notes, manage assignments, and connect students with teachers in one unified, intelligent platform.";

    return (
        <section className="relative py-20 md:py-32 overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Sparkles className="h-4 w-4" />
                            <span>Welcome to the Future of Learning</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-purple-600 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 pb-2 leading-tight">
                            {title}
                        </h1>

                        <p className="text-xl text-muted-foreground md:text-2xl max-w-[600px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 leading-relaxed">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400 pt-4">
                            <Link href="#resources" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:scale-105">
                                    Explore Resources
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#features" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 hover:bg-accent hover:text-accent-foreground transition-all hover:scale-105">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Floating Cards */}
                    <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-center lg:origin-top-right -my-12 lg:my-0">
                        <FloatingCards />
                    </div>
                </div>
            </div>
        </section>
    );
}

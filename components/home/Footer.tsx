import Link from "next/link";
import { GraduationCap, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30 pt-16 pb-8">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                KistConnect
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering the next generation of learners with a unified platform for resources, assignments, and collaboration.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="p-2 bg-background rounded-full hover:text-primary hover:shadow-md transition-all">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-background rounded-full hover:text-primary hover:shadow-md transition-all">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-background rounded-full hover:text-primary hover:shadow-md transition-all">
                                <Facebook className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Platform</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-primary transition-colors flex items-center gap-2">Features</Link></li>
                            <li><Link href="#resources" className="hover:text-primary transition-colors flex items-center gap-2">Resources</Link></li>
                            <li><Link href="#assignments" className="hover:text-primary transition-colors flex items-center gap-2">Assignments</Link></li>
                            <li><Link href="/teacher" className="hover:text-primary transition-colors flex items-center gap-2">Teacher Portal</Link></li>
                            <li><Link href="/student" className="hover:text-primary transition-colors flex items-center gap-2">Student Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Support</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Contact</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>123 Education Lane, Knowledge City, KC 54321</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>support@kistconnect.edu</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} KistConnect. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import { BookOpen, Calendar, Users, Shield, Zap, Globe } from "lucide-react";

const features = [
    {
        icon: <BookOpen className="h-8 w-8" />,
        title: "Resource Sharing",
        description: "Teachers can easily upload notes and study materials for students to access anytime, anywhere.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: <Calendar className="h-8 w-8" />,
        title: "Assignment Management",
        description: "Keep track of assignments, due dates, and submissions in one organized place.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "Seamless Connection",
        description: "Bridge the gap between teachers and students with instant updates and communication.",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        icon: <Shield className="h-8 w-8" />,
        title: "Secure Platform",
        description: "Your data is safe with our secure authentication and role-based access control.",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Why Choose KistConnect?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We provide the tools you need to succeed in your academic journey with a modern, intuitive interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-card p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${feature.bg} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500 opacity-50`} />

                            <div className={`mb-6 ${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center ${feature.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { LatestAssignments } from "@/components/home/LatestAssignments";
import { LatestResources } from "@/components/home/LatestResources";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <LatestResources />
        <LatestAssignments />
      </main>
      <Footer />
    </div>
  );
}

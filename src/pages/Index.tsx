import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Megaphone, Image, BookOpen, Users, Globe, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import achievement1 from "@/assets/achievement-1.jpg";
import achievement2 from "@/assets/achievement-2.jpg";
import achievement3 from "@/assets/achievement-3.jpg";

const staticAchievements = [
  { id: 1, image: achievement1, title: "CITCS Excellence Award 2026", description: "Students celebrate winning the regional IT competition championship." },
  { id: 2, image: achievement2, title: "HackGov 2026 Champions", description: "CITCS teams dominated the national hackathon with innovative solutions." },
  { id: 3, image: achievement3, title: "Research Symposium Success", description: "Faculty and students presented groundbreaking thesis work at the annual symposium." },
];

const quickLinks = [
  { icon: Megaphone, label: "Announcements", path: "/announcements", color: "bg-primary/10 text-primary" },
  { icon: Image, label: "Gallery", path: "/gallery", color: "bg-secondary/20 text-secondary-foreground" },
  { icon: BookOpen, label: "Research", path: "/research", color: "bg-accent text-accent-foreground" },
  { icon: Users, label: "Organizations", path: "/organizations", color: "bg-primary/10 text-primary" },
  { icon: Globe, label: "Extension", path: "/extension", color: "bg-secondary/20 text-secondary-foreground" },
];

interface Announcement {
  id: string;
  title: string;
  summary: string;
  description: string;
  image_url: string;
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements" as any)
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data && (data as any[]).length > 0) {
        setAnnouncements(data as any);
      }
    };
    fetchAnnouncements();
  }, []);

  const achievements = staticAchievements;
  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % achievements.length), []);
  const prevSlide = useCallback(() => setCurrentSlide((p) => (p - 1 + achievements.length) % achievements.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <main>
      {/* Hero / Achievements Carousel */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={achievements[currentSlide].image}
            alt={achievements[currentSlide].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <span className="mb-4 inline-block rounded-full bg-primary-foreground/15 px-5 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              College of Information Technology & Computing Sciences
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
              CITCS <span className="text-secondary">HUB</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
              Your centralized platform for announcements, research, and academic community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/announcements" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105">
                View Announcements <ArrowRight size={16} />
              </Link>
              <Link to="/research" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 font-display text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-transform hover:scale-105">
                Explore Research
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
            <button onClick={prevSlide} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {achievements.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`} />
              ))}
            </div>
            <button onClick={nextSlide} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading badge="Navigate" title="Quick Access" description="Jump to the section you need." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {quickLinks.map((link, i) => (
              <ScrollReveal key={link.label} delay={i * 0.08}>
                <Link to={link.path} className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${link.color} transition-transform group-hover:scale-110`}>
                    <link.icon size={24} />
                  </div>
                  <span className="font-display text-sm font-semibold text-card-foreground">{link.label}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading badge="Latest" title="Featured Announcements" description="Stay updated with the latest news and events from CITCS." />
          {announcements.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              No featured announcements yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((a, i) => (
                <ScrollReveal key={a.id} delay={i * 0.1}>
                  <button
                    onClick={() => { setSelectedAnnouncement(a); setModalOpen(true); }}
                    className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {a.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={a.image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="mb-2 font-display text-base font-semibold text-card-foreground">{a.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="rounded-3xl bg-hero-gradient p-10 text-center md:p-16">
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">Be Part of the CITCS Community</h2>
              <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">Stay connected with fellow students, faculty, and organizations through CITCS HUB.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/organizations" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-display text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-105">
                  View Organizations <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                  Contact Us
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={selectedAnnouncement?.image_url || ""}
        title={selectedAnnouncement?.title}
        description={selectedAnnouncement?.description}
      />
    </main>
  );
};

export default Index;

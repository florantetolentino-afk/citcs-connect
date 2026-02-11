import { useState } from "react";
import { Globe, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import achievement1 from "@/assets/achievement-1.jpg";
import achievement2 from "@/assets/achievement-2.jpg";
import achievement3 from "@/assets/achievement-3.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const extensions = [
  { id: 1, title: "HackGov 2026", description: "A civic hackathon event bringing students and government together to solve community problems through technology.", image: achievement2, date: "March 15-17, 2026" },
  { id: 2, title: "Digital Literacy Outreach", description: "Teaching basic digital skills to underserved communities in partnership with local government units.", image: achievement3, date: "February 20, 2026" },
  { id: 3, title: "Community IT Support Program", description: "Providing free tech support and troubleshooting services to local organizations and small businesses.", image: heroBg, date: "Ongoing" },
  { id: 4, title: "E-Governance Workshop", description: "Training local government employees on digital tools and e-governance platforms.", image: achievement1, date: "April 5, 2026" },
];

const Extension = () => {
  const [selected, setSelected] = useState<typeof extensions[0] | null>(null);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Outreach" title="Extension Activities" description="CITCS community outreach programs and initiatives." />

        <div className="grid gap-6 md:grid-cols-2">
          {extensions.map((ext, i) => (
            <ScrollReveal key={ext.id} delay={i * 0.1}>
              <button
                onClick={() => setSelected(ext)}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={ext.image} alt={ext.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4">
                    <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      <Globe size={12} /> Extension
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} /> {ext.date}
                    </span>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">{ext.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{ext.description}</p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        imageSrc={selected?.image || ""}
        title={selected?.title}
        description={selected?.description}
      />
    </main>
  );
};

export default Extension;
